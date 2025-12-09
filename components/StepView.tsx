import React from 'react';
import { Session, InterviewResponse } from '../types';
import QuestionCard from './QuestionCard';

interface StepViewProps {
  session: Session;
  onUpdateResponse: (response: InterviewResponse) => void;
  onNextStep: () => void;
  isLastStep: boolean;
}

const StepView: React.FC<StepViewProps> = ({ session, onUpdateResponse, onNextStep, isLastStep }) => {
  
  const completedCount = session.responses.length;
  const totalCount = session.questions.length;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-12 pb-32 animate-fadeIn">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
            <span className="text-orange text-xs font-bold uppercase tracking-widest">Step {session.id.replace('step-', '')}</span>
            <span className="h-px w-8 bg-orange/50"></span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4 tracking-tight">{session.name}</h1>
        <p className="text-xl text-secondary font-light max-w-2xl leading-relaxed">{session.subtitle}</p>
        
        <div className="mt-6 inline-flex items-center px-3 py-1 bg-surface border border-border rounded-full text-xs font-medium text-secondary">
             {completedCount === totalCount ? (
                 <span className="text-green-500 flex items-center gap-1">
                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                     Completed
                 </span>
             ) : (
                 <span>{completedCount} of {totalCount} questions complete</span>
             )}
        </div>
      </div>

      {/* Questions List */}
      <div>
          {session.questions.map((q, index) => {
              // Determine if this is the first question of a new section
              const isFirstInSection = index === 0 || q.section !== session.questions[index - 1].section;
              const existingResponse = session.responses.find(r => r.questionId === q.id);
              // Count questions in this section
              const sectionQuestionCount = session.questions.filter(sq => sq.section === q.section).length;

              return (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    existingResponse={existingResponse}
                    onSave={onUpdateResponse}
                    isFirstInSection={isFirstInSection}
                    sectionQuestionCount={isFirstInSection ? sectionQuestionCount : undefined}
                  />
              );
          })}
      </div>

      {/* Footer Nav */}
      <div className="flex justify-end pt-8 border-t border-border mt-12">
        {!isLastStep ? (
             <button 
                onClick={onNextStep}
                className="group flex items-center gap-2 text-primary font-medium hover:text-orange transition-colors"
             >
                Next Step
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
             </button>
        ) : (
             <div className="text-green-500 font-bold">Workflow Complete</div>
        )}
      </div>
    </div>
  );
};

export default StepView;