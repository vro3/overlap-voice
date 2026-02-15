import React from 'react';
import { AppSettings } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdate: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onReset: () => void;
  onClose: () => void;
}

const Toggle: React.FC<{ label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <div className="text-[14px] text-primary font-medium">{label}</div>
      {description && <div className="text-[12px] text-muted mt-0.5">{description}</div>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-border'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onReset, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-sidebar border-l border-border-subtle h-full overflow-y-auto">
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-primary">Settings</h2>
          <button onClick={onClose} className="p-2 text-muted hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Features */}
          <div>
            <h3 className="text-[11px] font-semibold text-muted uppercase tracking-[0.15em] mb-3">Features</h3>
            <div className="space-y-1 divide-y divide-border-subtle">
              <Toggle label="AI Analysis" description="Send answers to Gemini for summaries and insights" checked={settings.aiAnalysisEnabled} onChange={(v) => onUpdate('aiAnalysisEnabled', v)} />
              <Toggle label="Voice Input" description="Show microphone button for speech-to-text" checked={settings.voiceInputEnabled} onChange={(v) => onUpdate('voiceInputEnabled', v)} />
              <Toggle label="Magic Link Screen" description="Show email entry before questions" checked={settings.magicLinkEnabled} onChange={(v) => onUpdate('magicLinkEnabled', v)} />
              <Toggle label="Router Question" description="Show standalone first question" checked={settings.routerQuestionEnabled} onChange={(v) => onUpdate('routerQuestionEnabled', v)} />
              <Toggle label="Review Screen" description="Show answer review before output" checked={settings.reviewScreenEnabled} onChange={(v) => onUpdate('reviewScreenEnabled', v)} />
            </div>
          </div>

          {/* Display */}
          <div>
            <h3 className="text-[11px] font-semibold text-muted uppercase tracking-[0.15em] mb-3">Display</h3>
            <div className="space-y-1 divide-y divide-border-subtle">
              <Toggle label="Tier Indicators" description="Show must-ask/should-ask/optional labels" checked={settings.showTierIndicators} onChange={(v) => onUpdate('showTierIndicators', v)} />
              <Toggle label="Progress Percentage" description="Show % instead of plain language" checked={settings.showProgressPercentage} onChange={(v) => onUpdate('showProgressPercentage', v)} />
              <Toggle label="AI Insights in Sidebar" description="Show insights and quotables panel" checked={settings.showAiInsightsInSidebar} onChange={(v) => onUpdate('showAiInsightsInSidebar', v)} />
            </div>
          </div>

          {/* Storage */}
          <div>
            <h3 className="text-[11px] font-semibold text-muted uppercase tracking-[0.15em] mb-3">Storage</h3>
            <div className="space-y-1 divide-y divide-border-subtle">
              <Toggle label="Auto-Save" description="Automatically save progress" checked={settings.autoSaveEnabled} onChange={(v) => onUpdate('autoSaveEnabled', v)} />
              <div className="py-3">
                <div className="text-[14px] text-primary font-medium mb-2">Storage Mode</div>
                <select
                  value={settings.storageMode}
                  onChange={(e) => onUpdate('storageMode', e.target.value as 'localStorage' | 'vercelKV')}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primary text-[14px] focus:border-accent outline-none"
                >
                  <option value="localStorage">Local Storage (no account needed)</option>
                  <option value="vercelKV">Vercel KV (cloud sync)</option>
                </select>
              </div>
              <div className="py-3">
                <div className="text-[14px] text-primary font-medium mb-2">Auto-Save Delay</div>
                <select
                  value={settings.autoSaveDebounceMs}
                  onChange={(e) => onUpdate('autoSaveDebounceMs', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-primary text-[14px] focus:border-accent outline-none"
                >
                  <option value={250}>250ms (fast)</option>
                  <option value={500}>500ms (default)</option>
                  <option value={1000}>1 second</option>
                  <option value={2000}>2 seconds</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h3 className="text-[11px] font-semibold text-danger uppercase tracking-[0.15em] mb-3">Danger Zone</h3>
            <div className="space-y-3">
              <button
                onClick={onReset}
                className="w-full px-4 py-3 bg-danger/10 border border-danger/20 text-danger text-[14px] font-medium rounded-xl hover:bg-danger/20 transition-colors"
              >
                Reset Settings to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
