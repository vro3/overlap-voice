import React, { useState, useEffect, useCallback } from 'react';
import { AppScreen, Session, InterviewResponse, ExtractionMode } from './types';
import { INITIAL_SESSIONS, ROUTER_QUESTION, PERSONAL_SESSIONS, PERSONAL_ROUTER_QUESTION } from './data/initialData';
import { useSettings } from './hooks/useSettings';
import { useAutoSave } from './hooks/useAutoSave';
import { generateMarkdown, downloadMarkdown } from './utils/generateMarkdown';

import MagicLink from './components/MagicLink';
import Sidebar from './components/Sidebar';
import StepView from './components/StepView';
import ReviewScreen from './components/ReviewScreen';
import OutputScreen from './components/OutputScreen';
import SettingsPanel from './components/SettingsPanel';
import AudioSettingsModal from './components/AudioSettingsModal';
import { KnowledgeSearch } from './components/KnowledgeSearch';

const App: React.FC = () => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { saveProgress, loadProgress, loadProgressFromServer, clearProgress, showSavedToast } = useAutoSave(settings);

  // Screen state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('magic-link');

  // Data state
  const [extractionMode, setExtractionMode] = useState<ExtractionMode>('business');
  const sessions = extractionMode === 'business' ? INITIAL_SESSIONS : PERSONAL_SESSIONS;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [routerAnswer, setRouterAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [activeSessionId, setActiveSessionId] = useState('step-1');

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  const handleModeChange = useCallback((mode: ExtractionMode) => {
    setExtractionMode(mode);
    setActiveSessionId(mode === 'business' ? 'step-1' : 'p-step-1');
  }, []);

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
      // Resume where they left off (but skip vision/landing/router — go to welcome)
      if (saved.currentScreen && saved.currentScreen !== 'landing' && saved.currentScreen !== 'router' && saved.currentScreen !== 'vision') {
        setCurrentScreen(saved.currentScreen);
      } else {
        setCurrentScreen('magic-link');
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

  const handleMagicLinkComplete = useCallback(async (userEmail: string, userRouterAnswer: string) => {
    setEmail(userEmail);
    if (userRouterAnswer) setRouterAnswer(userRouterAnswer);

    // Try to restore from server (with timeout to prevent blocking)
    if (settings.storageMode === 'googleSheets') {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 2000)
        );
        const serverData = await Promise.race([
          loadProgressFromServer(userEmail),
          timeoutPromise
        ]) as any;

        if (serverData) {
          setAnswers(serverData.answers || {});
          if (!userRouterAnswer && serverData.routerAnswer) {
            setRouterAnswer(serverData.routerAnswer);
          }
          setActiveSessionId(serverData.currentStep || 'step-1');
          if (serverData.currentScreen && serverData.currentScreen !== 'landing' && serverData.currentScreen !== 'magic-link' && serverData.currentScreen !== 'router') {
            setCurrentScreen(serverData.currentScreen);
            return;
          }
        }
      } catch (e) {
        // Silently fail and proceed with localStorage data
      }
    }

    setCurrentScreen('questions');
  }, [settings.storageMode, loadProgressFromServer]);

  const handleSkipLogin = useCallback(() => {
    setEmail('skip@skip.com');
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

  const handleDownloadProgress = useCallback(() => {
    const progress = {
      email,
      routerAnswer,
      answers,
      currentStep: activeSessionId,
      currentScreen,
      lastSaved: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(progress, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `overlap-progress-${email || 'backup'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [email, routerAnswer, answers, activeSessionId, currentScreen]);

  const handleStartOver = useCallback(() => {
    setAnswers({});
    setRouterAnswer('');
    setEmail('');
    setExtractionMode('business');
    setActiveSessionId('step-1');
    setCurrentScreen('magic-link');
    clearProgress();
  }, [clearProgress]);

  const handleLogout = useCallback(() => {
    setEmail('');
    setCurrentScreen('magic-link');
  }, []);

  const handleClearProgress = useCallback(() => {
    setAnswers({});
    setRouterAnswer('');
    setActiveSessionId('step-1');
    clearProgress();
    setCurrentScreen('questions');
  }, [clearProgress]);

  const handleUploadProgress = useCallback((progress: any) => {
    try {
      if (progress.email) setEmail(progress.email);
      if (progress.routerAnswer) setRouterAnswer(progress.routerAnswer);
      if (progress.answers) setAnswers(progress.answers);
      if (progress.currentStep) setActiveSessionId(progress.currentStep);
      if (progress.currentScreen && progress.currentScreen !== 'landing') {
        setCurrentScreen(progress.currentScreen);
      } else {
        setCurrentScreen('questions');
      }
      alert('Progress restored successfully!');
    } catch (error) {
      console.error('Failed to restore progress:', error);
      alert('Failed to restore progress. Please check the file format.');
    }
  }, []);

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

      {/* Audio Settings Modal (overlay, any screen) */}
      <AudioSettingsModal
        isOpen={showAudioSettings}
        onClose={() => setShowAudioSettings(false)}
      />

      {/* Save toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface border border-border-subtle px-4 py-2.5 rounded-xl shadow-soft text-[13px] text-success animate-fadeIn">
          Progress saved
        </div>
      )}

      {/* Screens */}
      {currentScreen === 'magic-link' && (
        <MagicLink
          onComplete={handleMagicLinkComplete}
          onSkip={handleSkipLogin}
          settings={settings}
          initialRouterAnswer={routerAnswer}
          onAudioSettings={() => setShowAudioSettings(true)}
        />
      )}

      {currentScreen === 'questions' && (
        <div className="flex min-h-screen bg-background text-primary relative">
          {/* User email indicator — bottom left */}
          {email && email !== 'skip@skip.com' && (
            <div className="fixed bottom-4 left-4 z-20 lg:left-[calc(18rem+1rem)] text-[11px] text-muted bg-surface/80 backdrop-blur-sm border border-border-subtle rounded-lg px-3 py-1.5">
              {email}
            </div>
          )}
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
            onDownloadProgress={handleDownloadProgress}
            onUploadProgress={handleUploadProgress}
            onAudioSettings={() => setShowAudioSettings(true)}
            extractionMode={extractionMode}
            onModeChange={handleModeChange}
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
              onAudioSettings={() => setShowAudioSettings(true)}
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
        <>
          <OutputScreen
            email={email || 'user'}
            sessions={sessions}
            answers={answers}
            routerAnswer={routerAnswer}
            aiEnabled={settings.aiAnalysisEnabled}
            onStartOver={handleStartOver}
          />
          <div style={{ textAlign: 'center', paddingBottom: 32 }}>
            <button
              onClick={() => setCurrentScreen('search')}
              style={{ background: 'none', border: '1px solid #333', color: '#888', cursor: 'pointer', fontSize: 13, padding: '8px 20px', borderRadius: 8 }}
            >
              Search knowledge base
            </button>
          </div>
        </>
      )}

      {currentScreen === 'search' && (
        <div className="min-h-screen bg-background text-primary">
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #1f1f1f', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setCurrentScreen('output')}
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 14 }}
            >
              ← Back
            </button>
            <span style={{ color: '#555', fontSize: 14 }}>Knowledge Base Search</span>
          </div>
          <KnowledgeSearch />
        </div>
      )}
    </>
  );
};

export default App;
