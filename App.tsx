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
import { DemoTour, DemoStep } from './components/DemoTour';
import { DEMO_ANSWERS, DEMO_ROUTER_ANSWER, DEMO_EMAIL } from './data/demoData';

// Guided demo walkthrough. Each step drives the app to the right screen/mode
// and spotlights an element ([data-tour=...]) with plain-English narration.
interface DemoStepConfig extends DemoStep {
  screen: AppScreen;
  mode?: ExtractionMode;
  sessionId?: string;
}

const DEMO_STEPS: DemoStepConfig[] = [
  {
    screen: 'questions', sessionId: 'step-1',
    title: 'Welcome to The Overlap',
    body: "A 60-second look at how it pulls the expertise out of your head and into something an AI can actually use. This is an example expert's session — nothing here is saved.",
  },
  {
    screen: 'questions', sessionId: 'step-1', anchor: 'overlap-sessions',
    title: 'The interview, in sections',
    body: 'Who you are, what you do, how you price, how you sound. Work through them in any order — each one pulls out a different part of what you know.',
  },
  {
    screen: 'questions', sessionId: 'step-1', anchor: 'overlap-question',
    title: 'Real questions, not a form',
    body: "Each one is built to surface what you'd never think to write down — the judgment calls and instincts that live only in your head.",
  },
  {
    screen: 'questions', sessionId: 'step-1', anchor: 'overlap-voice',
    title: "Don't type — talk",
    body: 'Hit Talk and just answer out loud, the way you would in a real conversation. It transcribes as you speak, so the words stay in your actual voice.',
  },
  {
    screen: 'questions', sessionId: 'step-1', anchor: 'overlap-progress',
    title: 'Saved as you go',
    body: 'Your answers save automatically. Step away and come back whenever — you pick up right where you left off.',
  },
  {
    screen: 'questions', sessionId: 'step-1', anchor: 'overlap-mode',
    title: 'Two ways to use it',
    body: 'Extract your business knowledge, or map your personal life and goals. Same idea, different questions.',
  },
  {
    screen: 'review', anchor: 'overlap-review',
    title: 'Review before you generate',
    body: "When you're done, look it all over and tweak any answer. Nothing leaves until you say so.",
  },
  {
    screen: 'output', anchor: 'overlap-output',
    title: 'One clean knowledge file',
    body: 'The Overlap turns every answer into a single Markdown file — a knowledge base any AI can read to understand you and sound like you.',
  },
  {
    screen: 'output',
    title: "That's The Overlap",
    body: 'Now do it with your own expertise. Exit the demo and start — your real answers are private, and saved just for you.',
    cta: 'Finish',
  },
];

// Business step ids are 'step-N'; personal ids are 'p-step-N'. Lets us recover
// the mode from a saved position even when the source (e.g. the Sheets row)
// doesn't carry an explicit extractionMode field.
const modeFromStepId = (stepId?: string): ExtractionMode =>
  stepId?.startsWith('p-') ? 'personal' : 'business';

const App: React.FC = () => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { saveProgress, loadProgress, clearProgress, flush, saveStatus } = useAutoSave(settings);

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

  // Demo walkthrough (guided spotlight tour over seeded example answers).
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Auto-save is gated until the initial restore from localStorage has run, so
  // the empty starting state can't overwrite saved answers before they load.
  const [hydrated, setHydrated] = useState(false);

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
      setExtractionMode(saved.extractionMode || modeFromStepId(saved.currentStep));
      // Resume where they left off (but skip vision/landing/router — go to welcome)
      if (saved.currentScreen && saved.currentScreen !== 'landing' && saved.currentScreen !== 'router' && saved.currentScreen !== 'vision') {
        setCurrentScreen(saved.currentScreen);
      } else {
        setCurrentScreen('magic-link');
      }
    }
    setHydrated(true);
  }, []);

  // Auto-save on changes (never while the demo is driving the screens, and not
  // until the initial restore has settled — see the `hydrated` guard).
  useEffect(() => {
    if (!hydrated || currentScreen === 'magic-link' || demoMode) return;
    saveProgress({
      email,
      currentStep: activeSessionId,
      currentScreen,
      extractionMode,
      routerAnswer,
      answers,
      lastSaved: new Date().toISOString(),
    });
  }, [hydrated, answers, routerAnswer, activeSessionId, currentScreen, email, extractionMode, demoMode]);

  // Demo walkthrough: each step drives the app to the right screen/mode.
  useEffect(() => {
    if (!demoMode) return;
    const step = DEMO_STEPS[demoStep];
    if (!step) return;
    if (step.mode) setExtractionMode(step.mode);
    if (step.sessionId) setActiveSessionId(step.sessionId);
    setCurrentScreen(step.screen);
  }, [demoMode, demoStep]);

  // --- Navigation Helpers ---

  const handleMagicLinkComplete = useCallback((userEmail: string, userRouterAnswer: string) => {
    // Any saved answers were already restored from localStorage on mount; the
    // email is just an identity label for the exported file. Straight to the
    // interview — saving is on-device and automatic from here.
    setEmail(userEmail);
    if (userRouterAnswer) setRouterAnswer(userRouterAnswer);
    setHydrated(true);
    setCurrentScreen('questions');
  }, []);

  const handleSkipLogin = useCallback(() => {
    setEmail('skip@skip.com');
    setHydrated(true);
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
    flush(); // make sure everything is written before the finish screen
    setCurrentScreen('output');
  }, [flush]);

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
    const md = generateMarkdown(email, sessions, answers, routerAnswer);
    downloadMarkdown(md, email || 'user');
  }, [email, sessions, answers, routerAnswer]);

  const handleDownloadProgress = useCallback(() => {
    const progress = {
      email,
      routerAnswer,
      answers,
      currentStep: activeSessionId,
      currentScreen,
      extractionMode,
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
  }, [email, routerAnswer, answers, activeSessionId, currentScreen, extractionMode]);

  const handleStartOver = useCallback(() => {
    setAnswers({});
    setRouterAnswer('');
    setEmail('');
    setExtractionMode('business');
    setActiveSessionId('step-1');
    setHydrated(false);
    setCurrentScreen('magic-link');
    clearProgress();
  }, [clearProgress]);

  const handleLogout = useCallback(() => {
    // Full reset — clear every trace of this user so the next person on a
    // shared machine can't inherit (and auto-save) the previous user's answers.
    setAnswers({});
    setRouterAnswer('');
    setEmail('');
    setExtractionMode('business');
    setActiveSessionId('step-1');
    setHydrated(false);
    clearProgress();
    setCurrentScreen('magic-link');
  }, [clearProgress]);

  // --- Demo handlers ---
  const startDemo = useCallback(() => {
    setDemoStep(0);
    setDemoMode(true);
  }, []);

  const exitDemo = useCallback(() => {
    setDemoMode(false);
    setDemoStep(0);
    setCurrentScreen('magic-link');
  }, []);

  const nextDemo = useCallback(() => setDemoStep(s => Math.min(s + 1, DEMO_STEPS.length - 1)), []);
  const backDemo = useCallback(() => setDemoStep(s => Math.max(s - 1, 0)), []);

  const handleClearProgress = useCallback(() => {
    setAnswers({});
    setRouterAnswer('');
    setActiveSessionId('step-1');
    clearProgress();
    setCurrentScreen('questions');
  }, [clearProgress]);

  const handleUploadProgress = useCallback((progress: any) => {
    // Validate shape before claiming success — a file that merely parses as
    // JSON (e.g. `[]` or `{}`) must not report "restored" while restoring nothing.
    if (
      !progress ||
      typeof progress !== 'object' ||
      Array.isArray(progress) ||
      typeof progress.answers !== 'object' ||
      progress.answers === null
    ) {
      alert('That file doesn\'t look like an Overlap progress backup. Please choose a file you downloaded with the Progress button.');
      return;
    }

    if (progress.email) setEmail(progress.email);
    if (progress.routerAnswer) setRouterAnswer(progress.routerAnswer);
    setAnswers(progress.answers);
    if (progress.currentStep) setActiveSessionId(progress.currentStep);
    setExtractionMode(progress.extractionMode || modeFromStepId(progress.currentStep));
    if (progress.currentScreen && progress.currentScreen !== 'landing') {
      setCurrentScreen(progress.currentScreen);
    } else {
      setCurrentScreen('questions');
    }
    setHydrated(true);
    alert('Progress restored successfully!');
  }, []);

  // --- Render ---

  const activeSession = sessions[activeSessionIndex] || sessions[0];

  // While the demo is running, overlay seeded example answers in-memory only —
  // the user's real answers/email are never touched, and restore on exit.
  const noop = () => {};
  const effectiveAnswers = demoMode ? DEMO_ANSWERS : answers;
  const effectiveRouter = demoMode ? DEMO_ROUTER_ANSWER : routerAnswer;
  const effectiveEmail = demoMode ? DEMO_EMAIL : email;

  return (
    <>
      {/* Guided demo walkthrough (spotlight overlay, sits above every screen) */}
      {demoMode && (
        <DemoTour
          steps={DEMO_STEPS}
          stepIndex={demoStep}
          onNext={nextDemo}
          onBack={backDemo}
          onExit={exitDemo}
        />
      )}

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

      {/* Persistent save-status indicator — always visible during the interview
          so the user can trust their answers are being saved on this device. */}
      {!demoMode && (currentScreen === 'questions' || currentScreen === 'review') && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface border border-border-subtle px-3.5 py-2 rounded-xl shadow-soft text-[12px] flex items-center gap-2">
          {saveStatus === 'saving' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-muted animate-pulse" />
              <span className="text-muted">Saving…</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-secondary">Saved on this device</span>
            </>
          )}
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
          onWatchDemo={startDemo}
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
            onSelectSession={demoMode ? noop : handleSelectSession}
            answers={effectiveAnswers}
            settings={settings}
            userEmail={effectiveEmail || undefined}
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
              answers={effectiveAnswers}
              onAnswerChange={demoMode ? noop : handleAnswerChange}
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
          answers={effectiveAnswers}
          routerAnswer={effectiveRouter}
          onEditAnswer={demoMode ? noop : handleAnswerChange}
          onGenerate={demoMode ? noop : handleGenerate}
          onBack={demoMode ? noop : handleBackToQuestions}
        />
      )}

      {currentScreen === 'output' && (
        <OutputScreen
          email={effectiveEmail || 'user'}
          sessions={sessions}
          answers={effectiveAnswers}
          routerAnswer={effectiveRouter}
          onStartOver={demoMode ? noop : handleStartOver}
        />
      )}
    </>
  );
};

export default App;
