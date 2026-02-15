import React from 'react';
import { AppSettings } from '../types';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  settings: AppSettings;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, stepName, settings }) => {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-medium text-secondary">
          {settings.showProgressPercentage
            ? `${percent}% complete`
            : `Step ${currentStep} of ${totalSteps}: ${stepName}`
          }
        </span>
      </div>
      <div className="h-1.5 bg-background rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
