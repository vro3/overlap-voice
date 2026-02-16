import React, { useState, useEffect, useCallback } from 'react';
import { AppScreen, Session, InterviewResponse } from './types';
import { INITIAL_SESSIONS, ROUTER_QUESTION } from './data/initialData';
import { useSettings } from './hooks/useSettings';
import { useAutoSave } from './hooks/useAutoSave';
import { generateMarkdown, downloadMarkdown } from './utils/generateMarkdown';

import MagicLink from './components/MagicLink';
import RouterQuestion from './components/RouterQuestion';
import Sidebar from './components/Sidebar';
import StepView from './components/StepView';
import ReviewScreen from './components/ReviewScreen';
import OutputScreen from './components/OutputScreen';
import SettingsPanel from './components/SettingsPanel';

const App: React.FC = () => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { saveProgress, loadProgress, loadProgressFromServer, clearProgress, showSavedToast } = useAutoSave(settings);

  // Screen state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('router');

  // Data state
  const [sessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [routerAnswer, setRouterAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [activeSessionId, setActiveSessionId] = useState('step-1');

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleOpenSettings = useCallback(() => {
    if (isAdmin) {
      setShowSettings(true);
      return;
    }
    const pin = window.prompt('Enter admin PIN:');
    if (pin === '1999') {
      setIsAdmin(true);
      setShowSettings(true);
    }
  }, [isAdmin]);

  // Load saved progress on mount
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setEmail(saved.email || '');
      setAnswers(saved.answers || {});
      setRouterAnswer(saved.routerAnswer || '');
      setActiveSessionId(saved.currentStep || 'step-1');
      // Resume where they left off (but skip landing page)
      if (saved.currentScreen && saved.currentScreen !== 'landing') {
        setCurrentScreen(saved.currentScreen);
      } else {
        // Always start with router question, not landing
        setCurrentScreen('router');
      }
    }
  }, []);

  // Auto-save on changes
  useEffect(() => {
    if (currentScreen === 'magic-link') return;
    saveProgress({
      email,
      currentStep: activeSessionId,
      currentScreen,
      routerAnswer,
      answers,
      aiResponses: {},
      lastSaved: new Date().toISOString(),
    });
  }, [answers, routerAnswer, activeSessionId, currentScreen, email]);

  // --- Navigation Helpers ---

  const handleStart = useCallback(() => {
    if (settings.magicLinkEnabled) {
      setCurrentScreen('magic-link');
    } else if (settings.routerQuestionEnabled) {
      setCurrentScreen('router');
    } else {
      setCurrentScreen('questions');
    }
  }, [settings.magicLinkEnabled, settings.routerQuestionEnabled]);

  const handleMagicLinkComplete = useCallback(async (userEmail: string) => {
    setEmail(userEmail);

    // Try to restore from server if KV mode is on
    if (settings.storageMode === 'vercelKV') {
      const serverData = await loadProgressFromServer(userEmail);
      if (serverData) {
        setAnswers(serverData.answers || {});
        setRouterAnswer(serverData.routerAnswer || '');
        setActiveSessionId(serverData.currentStep || 'step-1');
        if (serverData.currentScreen && serverData.currentScreen !== 'landing' && serverData.currentScreen !== 'magic-link') {
          setCurrentScreen(serverData.currentScreen);
          return;
        }
      }
    }

    if (settings.routerQuestionEnabled) {
      setCurrentScreen('router');
    } else {
      setCurrentScreen('questions');
    }
  }, [settings.routerQuestionEnabled, settings.storageMode, loadProgressFromServer]);

  const handleRouterContinue = useCallback(() => {
    setCurrentScreen('questions');
  }, []);

  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  // Step navigation
  const activeSessionIndex = sessions.findIndex(s => s.id === activeSessionId);

  const handleNextStep = useCallback(() => {
    const nextIndex = activeSessionIndex + 1;
    if (nextIndex < sessions.length) {
      setActiveSessionId(sessions[nextIndex].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Past last step
      if (settings.reviewScreenEnabled) {
        setCurrentScreen('review');
      } else {
        setCurrentScreen('output');
      }
    }
  }, [activeSessionIndex, sessions, settings.reviewScreenEnabled]);

  const handlePrevStep = useCallback(() => {
    const prevIndex = activeSessionIndex - 1;
    if (prevIndex >= 0) {
      setActiveSessionId(sessions[prevIndex].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSessionIndex, sessions]);

  const handleSelectSession = useCallback((id: string) => {
    setActiveSessionId(id);
    setCurrentScreen('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGenerate = useCallback(() => {
    setCurrentScreen('output');
  }, []);

  const handleBackToQuestions = useCallback(() => {
    setCurrentScreen('questions');
  }, []);

  const handleBackToReview = useCallback(() => {
    if (settings.reviewScreenEnabled) {
      setCurrentScreen('review');
    } else {
      setCurrentScreen('questions');
    }
  }, [settings.reviewScreenEnabled]);

  const handleExport = useCallback(() => {
    const md = generateMarkdown(email, sessions, answers, routerAnswer, settings.aiAnalysisEnabled);
    downloadMarkdown(md, email || 'user');
  }, [email, sessions, answers, routerAnswer, settings.aiAnalysisEnabled]);

  const handleStartOver = useCallback(() => {
    setAnswers({});
    setRouterAnswer('');
    setActiveSessionId('step-1');
    setCurrentScreen('router');
    clearProgress();
  }, [clearProgress]);

  const handleLogout = useCallback(() => {
    setEmail('');
    setCurrentScreen('router');
  }, []);

  const handleClearProgress = useCallback(() => {
    setAnswers({});
    setRouterAnswer('');
    setActiveSessionId('step-1');
    clearProgress();
    setCurrentScreen('questions');
  }, [clearProgress]);

  // --- Render ---

  const activeSession = sessions[activeSessionIndex] || sessions[0];

  return (
    <>
      {/* Settings Panel (overlay, any screen) */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onUpdate={updateSetting}
          onReset={resetSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Save toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface border border-border-subtle px-4 py-2.5 rounded-xl shadow-soft text-[13px] text-success animate-fadeIn">
          Progress saved
        </div>
      )}

      {/* Screens */}
      {currentScreen === 'magic-link' && (
        <MagicLink onComplete={handleMagicLinkComplete} />
      )}

      {currentScreen === 'router' && (
        <RouterQuestion
          value={routerAnswer}
          onChange={setRouterAnswer}
          onContinue={handleRouterContinue}
          settings={settings}
        />
      )}

      {currentScreen === 'questions' && (
        <div className="flex min-h-screen bg-background text-primary">
          <Sidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            answers={answers}
            settings={settings}
            userEmail={email || undefined}
            onLogout={email ? handleLogout : undefined}
            onOpenSettings={handleOpenSettings}
            onExport={handleExport}
          />
          <main className="flex-1 overflow-x-hidden">
            <StepView
              key={activeSession.id}
              session={activeSession}
              stepIndex={activeSessionIndex}
              totalSteps={sessions.length}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              settings={settings}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
              isFirstStep={activeSessionIndex === 0}
              isLastStep={activeSessionIndex === sessions.length - 1}
            />
          </main>
        </div>
      )}

      {currentScreen === 'review' && (
        <ReviewScreen
          sessions={sessions}
          answers={answers}
          routerAnswer={routerAnswer}
          onEditAnswer={handleAnswerChange}
          onGenerate={handleGenerate}
          onBack={handleBackToQuestions}
        />
      )}

      {currentScreen === 'output' && (
        <OutputScreen
          email={email || 'user'}
          sessions={sessions}
          answers={answers}
          routerAnswer={routerAnswer}
          aiEnabled={settings.aiAnalysisEnabled}
          onStartOver={handleStartOver}
        />
      )}
    </>
  );
};

export default App;
