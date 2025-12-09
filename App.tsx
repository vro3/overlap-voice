import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import StepView from './components/StepView';
import LandingPage from './components/LandingPage';
import { Session, InterviewResponse } from './types';
import { INITIAL_SESSIONS } from './data/initialData';

const USER_EMAIL_KEY = 'the-overlap-user-email';

const App: React.FC = () => {
  // User authentication state
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem(USER_EMAIL_KEY);
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sessions state
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>('step-1');

  // Track if we need to save (debounce)
  const saveTimeoutRef = useRef<number | null>(null);
  const lastSavedRef = useRef<string>('');

  // Load user data when email is set
  useEffect(() => {
    if (userEmail) {
      loadUserData(userEmail);
    }
  }, []);

  // Auto-save when sessions change (debounced)
  useEffect(() => {
    if (!userEmail) return;

    // Create a hash of current state to avoid duplicate saves
    const currentState = JSON.stringify({ sessions, activeSessionId });
    if (currentState === lastSavedRef.current) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save by 2 seconds
    saveTimeoutRef.current = window.setTimeout(() => {
      saveUserData();
      lastSavedRef.current = currentState;
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [sessions, activeSessionId, userEmail]);

  // --- API Functions ---

  const loadUserData = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.exists && data.data) {
        // User has existing data - restore it
        setSessions(data.data.sessions);
        setActiveSessionId(data.data.activeSessionId || 'step-1');
      } else {
        // New user - use fresh initial data
        setSessions(INITIAL_SESSIONS);
        setActiveSessionId('step-1');
        // Save initial state for new user
        await saveUserDataDirect(email, INITIAL_SESSIONS, 'step-1');
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Fallback to initial data on error
      setSessions(INITIAL_SESSIONS);
      setActiveSessionId('step-1');
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async () => {
    if (!userEmail) return;
    await saveUserDataDirect(userEmail, sessions, activeSessionId);
  };

  const saveUserDataDirect = async (email: string, sessionsData: Session[], activeId: string) => {
    try {
      await fetch('/api/user/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          sessions: sessionsData,
          activeSessionId: activeId
        })
      });
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  // --- Auth Handlers ---

  const handleLogin = async (email: string) => {
    setIsLoading(true);
    setUserEmail(email);
    localStorage.setItem(USER_EMAIL_KEY, email);
    await loadUserData(email);
  };

  const handleLogout = () => {
    // Save before logging out
    saveUserData();
    setUserEmail(null);
    localStorage.removeItem(USER_EMAIL_KEY);
    setSessions(INITIAL_SESSIONS);
    setActiveSessionId('step-1');
  };

  // --- Session Handlers ---

  const activeSessionIndex = sessions.findIndex(s => s.id === activeSessionId);
  const activeSession = sessions[activeSessionIndex] || sessions[0];

  const handleUpdateResponse = (response: InterviewResponse) => {
    setSessions(prev => prev.map(session => {
        if (session.id !== activeSessionId) return session;

        const existingIndex = session.responses.findIndex(r => r.questionId === response.questionId);
        let newResponses;

        if (existingIndex >= 0) {
            newResponses = [...session.responses];
            newResponses[existingIndex] = response;
        } else {
            newResponses = [...session.responses, response];
        }

        return { ...session, responses: newResponses };
    }));
  };

  const handleNextStep = () => {
      const nextIndex = activeSessionIndex + 1;
      if (nextIndex < sessions.length) {
          setActiveSessionId(sessions[nextIndex].id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const handleReset = () => {
      if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
          setSessions(INITIAL_SESSIONS);
          setActiveSessionId('step-1');
          // Save the reset state
          if (userEmail) {
            saveUserDataDirect(userEmail, INITIAL_SESSIONS, 'step-1');
          }
      }
  };

  // --- Render ---

  // Show landing page if not logged in
  if (!userEmail) {
    return <LandingPage onLogin={handleLogin} isLoading={isLoading} />;
  }

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-surface border-t-orange rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-primary">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onReset={handleReset}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-x-hidden">
        <StepView
            key={activeSession.id}
            session={activeSession}
            onUpdateResponse={handleUpdateResponse}
            onNextStep={handleNextStep}
            isLastStep={activeSessionIndex === sessions.length - 1}
        />
      </main>
    </div>
  );
};

export default App;
