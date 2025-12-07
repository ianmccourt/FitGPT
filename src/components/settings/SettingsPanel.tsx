import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validateApiKey } from '../../utils/api';
import { downloadData, importData, clearAllData } from '../../utils/storage';
import { FITNESS_GOALS, EQUIPMENT_OPTIONS } from '../../types';

export default function SettingsPanel() {
  const { state, dispatch } = useApp();
  const [apiKey, setApiKey] = useState(state.settings.apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setValidationStatus('invalid');
      return;
    }

    setIsValidating(true);
    setValidationStatus('idle');

    const isValid = await validateApiKey(apiKey);

    if (isValid) {
      dispatch({ type: 'UPDATE_SETTINGS', payload: { apiKey } });
      setValidationStatus('valid');
    } else {
      setValidationStatus('invalid');
    }

    setIsValidating(false);
  };

  const handleExport = () => {
    downloadData();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const success = importData(content);
          if (success) {
            dispatch({ type: 'LOAD_FROM_STORAGE' });
            alert('Data imported successfully!');
          } else {
            alert('Failed to import data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    clearAllData();
    dispatch({ type: 'CLEAR_ALL_DATA' });
    setShowClearConfirm(false);
  };

  const handleRegenerate = () => {
    dispatch({ type: 'CLEAR_WORKOUT_PLAN' });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'dashboard' });
    setShowRegenerateConfirm(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      {/* API Key Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">API Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Anthropic API Key</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setValidationStatus('idle');
                  }}
                  placeholder="sk-ant-api03-..."
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showApiKey ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                onClick={handleSaveApiKey}
                disabled={isValidating || !apiKey.trim()}
                className="btn btn-primary"
              >
                {isValidating ? 'Validating...' : 'Save'}
              </button>
            </div>
            {validationStatus === 'valid' && (
              <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                API key is valid and saved!
              </p>
            )}
            {validationStatus === 'invalid' && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Invalid API key. Please check and try again.
              </p>
            )}
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-amber-800">
                <p className="font-medium">Security Note</p>
                <p>Your API key is stored locally in your browser. Never share your API key with others.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Summary */}
      {state.userProfile && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Profile</h2>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-slate-500">Fitness Level</span>
              <p className="font-medium capitalize">{state.userProfile.fitnessLevel}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500">Goals</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {state.userProfile.goals.map((goal) => {
                  const goalInfo = FITNESS_GOALS.find((g) => g.id === goal);
                  return (
                    <span key={goal} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {goalInfo?.label || goal}
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <span className="text-sm text-slate-500">Equipment</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {state.userProfile.equipment.map((eq) => {
                  const eqInfo = EQUIPMENT_OPTIONS.find((e) => e.id === eq);
                  return (
                    <span key={eq} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                      {eqInfo?.label || eq}
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <span className="text-sm text-slate-500">Schedule</span>
              <p className="font-medium">
                {state.userProfile.availability.daysPerWeek} days/week,{' '}
                {state.userProfile.availability.minutesPerSession} min/session
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Workout Plan Actions */}
      {state.workoutPlan && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Workout Plan</h2>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Created on {new Date(state.workoutPlan.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => setShowRegenerateConfirm(true)}
              className="btn btn-outline w-full"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate Plan
            </button>
          </div>
        </div>
      )}

      {/* Data Management */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Data Management</h2>
        <div className="space-y-3">
          <button onClick={handleExport} className="btn btn-outline w-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Data
          </button>
          <button onClick={handleImport} className="btn btn-outline w-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import Data
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="btn w-full bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All Data
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-bounce-in">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Clear All Data?</h3>
            <p className="text-slate-600 mb-6">
              This will permanently delete all your data including your profile, workout plans, and progress logs. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="btn bg-red-500 text-white hover:bg-red-600 flex-1"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regenerate Confirmation Modal */}
      {showRegenerateConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-bounce-in">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Regenerate Workout Plan?</h3>
            <p className="text-slate-600 mb-6">
              This will replace your current workout plan. Your workout logs will be preserved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRegenerateConfirm(false)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerate}
                className="btn btn-primary flex-1"
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Info */}
      <div className="text-center text-sm text-slate-500">
        <p>FitGPT - AI-Powered Fitness Coach</p>
        <p>Your data is stored locally in your browser.</p>
      </div>
    </div>
  );
}
