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

  // Demo walkthrough (guided spotlight tour over seeded example answers).
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Auto-save is gated until the initial restore (mount + server load) has
  // settled. Without this, an empty starting state can auto-save over a
  // returning user's cloud answers before their real data has loaded.
  const [hydrated, setHydrated] = useState(false);
  // Set when a returning user's server restore fails/times out, so we can
  // offer a retry instead of silently starting them from scratch.
  const [loadError, setLoadError] = useState(false);

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
      aiResponses: {},
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

  // Pull this email's saved answers from the server, bounded by a timeout so a
  // slow Sheets read never blocks the UI. Returns true if cloud data was
  // applied. Throws on timeout/failure so callers can offer a retry.
  const restoreFromServer = useCallback(async (userEmail: string, userRouterAnswer: string): Promise<boolean> => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 2000)
    );
    const serverData = await Promise.race([
      loadProgressFromServer(userEmail),
      timeoutPromise,
    ]);

    if (serverData) {
      setAnswers(serverData.answers || {});
      if (!userRouterAnswer && serverData.routerAnswer) {
        setRouterAnswer(serverData.routerAnswer);
      }
      setActiveSessionId(serverData.currentStep || 'step-1');
      setExtractionMode(serverData.extractionMode || modeFromStepId(serverData.currentStep));
      if (serverData.currentScreen && serverData.currentScreen !== 'landing' && serverData.currentScreen !== 'magic-link' && serverData.currentScreen !== 'router') {
        setCurrentScreen(serverData.currentScreen);
      } else {
        setCurrentScreen('questions');
      }
      return true;
    }
    return false;
  }, [loadProgressFromServer]);

  const handleMagicLinkComplete = useCallback(async (userEmail: string, userRouterAnswer: string) => {
    setEmail(userEmail);
    if (userRouterAnswer) setRouterAnswer(userRouterAnswer);
    setLoadError(false);

    if (settings.storageMode === 'googleSheets') {
      try {
        // Hold off auto-save until the restore attempt settles, so a slow load
        // can't be clobbered by an empty-state save.
        setHydrated(false);
        const applied = await restoreFromServer(userEmail, userRouterAnswer);
        setHydrated(true);
        if (applied) return;
      } catch (e) {
        // Couldn't reach the cloud copy. Surface a retry rather than silently
        // starting fresh, and keep auto-save OFF so we don't overwrite the
        // (possibly newer) cloud row with the empty local state.
        setLoadError(true);
        setCurrentScreen('questions');
        return;
      }
    }

    setHydrated(true);
    setCurrentScreen('questions');
  }, [settings.storageMode, restoreFromServer]);

  const handleRetryLoad = useCallback(async () => {
    if (!email) return;
    setLoadError(false);
    try {
      setHydrated(false);
      await restoreFromServer(email, routerAnswer);
      setHydrated(true);
    } catch (e) {
      setLoadError(true);
    }
  }, [email, routerAnswer, restoreFromServer]);

  const handleDismissLoadError = useCallback(() => {
    // User chose to continue with local data — safe to enable saving now.
    setLoadError(false);
    setHydrated(true);
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
    setLoadError(false);
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
    setLoadError(false);
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

      {/* Save toast */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface border border-border-subtle px-4 py-2.5 rounded-xl shadow-soft text-[13px] text-success animate-fadeIn">
          Progress saved
        </div>
      )}

      {/* Cloud-restore failure — offer a retry instead of silently starting fresh */}
      {loadError && !demoMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] bg-surface border border-danger/30 rounded-xl shadow-soft px-4 py-3 flex items-center gap-3 animate-fadeIn">
          <span className="flex-1 text-[13px] text-secondary leading-snug">
            We couldn't reach your saved answers. Your work here isn't being synced yet.
          </span>
          <button
            onClick={handleRetryLoad}
            className="flex-shrink-0 text-[12px] font-medium text-accent hover:text-accent/80 px-2 py-1 rounded-lg hover:bg-accent/10 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={handleDismissLoadError}
            className="flex-shrink-0 text-[12px] font-medium text-muted hover:text-primary px-2 py-1 rounded-lg hover:bg-surface-hover transition-colors"
          >
            Continue
          </button>
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
