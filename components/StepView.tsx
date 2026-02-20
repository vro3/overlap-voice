import React from 'react';
import { Session, AppSettings } from '../types';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';

interface StepViewProps {
  session: Session;
  stepIndex: number;
  totalSteps: number;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  settings: AppSettings;
  onNextStep: () => void;
  onPrevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onAudioSettings?: () => void;
}

const StepView: React.FC<StepViewProps> = ({
  session, stepIndex, totalSteps, answers, onAnswerChange,
  settings, onNextStep, onPrevStep, isFirstStep, isLastStep, onAudioSettings
}) => {
  const visibleQuestions = settings.showAllQuestions
    ? session.questions
    : session.questions.filter(q => !q.tier || !settings.hiddenTiers.includes(q.tier));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 pt-16 lg:pt-8 pb-32 animate-fadeIn">
      <ProgressBar
        currentStep={stepIndex + 1}
        totalSteps={totalSteps}
        stepName={session.name}
        settings={settings}
      />

      <div className="mb-14">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-accent text-[11px] font-semibold uppercase tracking-[0.12em]">Step {stepIndex + 1}</span>
          <span className="h-px w-8 bg-accent/30"></span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary mb-4 tracking-tight">{session.name}</h1>
        <p className="text-lg sm:text-xl text-secondary font-normal max-w-2xl leading-relaxed">{session.subtitle}</p>

        <div className="mt-7 inline-flex items-center px-4 py-2 bg-surface border border-border-subtle rounded-full text-[12px] font-medium text-secondary">
          {visibleQuestions.length} questions
        </div>
      </div>

      <div>
        {visibleQuestions.map((q, index) => {
          const isFirstInSection = index === 0 || q.section !== visibleQuestions[index - 1].section;
          const sectionCount = visibleQuestions.filter(sq => sq.section === q.section).length;

          return (
            <QuestionCard
              key={q.id}
              question={q}
              value={answers[q.id] || ''}
              onChange={onAnswerChange}
              settings={settings}
              isFirstInSection={isFirstInSection}
              sectionQuestionCount={isFirstInSection ? sectionCount : undefined}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-8 border-t border-border-subtle mt-14">
        {!isFirstStep ? (
          <button onClick={onPrevStep} className="text-secondary hover:text-primary text-[15px] transition-colors">
            ← Previous Section
          </button>
        ) : <div />}

        <button
          onClick={onNextStep}
          className="group flex items-center gap-2.5 text-primary text-[15px] font-medium hover:text-accent transition-colors"
        >
          {isLastStep ? 'Continue to Review' : 'Next Section'}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StepView;
