import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateWorkoutPlan } from '../../utils/api';

const motivationalMessages = [
  'Building your perfect workout routine...',
  'Analyzing your fitness goals...',
  'Customizing exercises for your level...',
  'Optimizing for your schedule...',
  'Adding progressive overload strategies...',
  'Finalizing your personalized plan...',
];

export default function WorkoutPlanGenerator() {
  const { state, dispatch } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % motivationalMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!state.settings.apiKey) {
      setError('Please add your API key in settings first.');
      return;
    }

    if (!state.userProfile) {
      setError('User profile not found. Please complete the onboarding first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    dispatch({ type: 'SET_GENERATING_PLAN', payload: true });

    try {
      const plan = await generateWorkoutPlan(
        state.settings.apiKey,
        state.userProfile,
        (message) => setProgress(message)
      );

      dispatch({ type: 'SET_WORKOUT_PLAN', payload: plan });
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'dashboard' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate workout plan');
    } finally {
      setIsGenerating(false);
      dispatch({ type: 'SET_GENERATING_PLAN', payload: false });
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
        {/* Animated loader */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-full border-4 border-slate-200 animate-pulse"></div>
          <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          <div className="absolute inset-2 w-16 h-16 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>

        {/* Progress message */}
        <div className="space-y-3">
          <p className="text-xl font-semibold text-slate-900 animate-fade-in" key={messageIndex}>
            {motivationalMessages[messageIndex]}
          </p>
          {progress && (
            <p className="text-slate-600">{progress}</p>
          )}
        </div>

        {/* Motivational tip */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-md">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Did you know?</span> Consistent exercise can improve mood, energy levels, and sleep quality within just a few weeks!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-lg mx-auto text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Generate Your Workout Plan</h2>
        <p className="text-slate-600">
          Our AI will create a personalized workout plan based on your profile, goals, and preferences.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="text-left">
              <p className="font-medium">Error generating plan</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {!state.settings.apiKey && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-left">
              <p className="font-medium">API Key Required</p>
              <p>Please add your Anthropic API key in settings to generate workout plans.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={handleGenerate}
          disabled={!state.settings.apiKey || isGenerating}
          className="btn btn-primary py-3 text-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate My Plan
        </button>

        {!state.settings.apiKey && (
          <button
            onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'settings' })}
            className="btn btn-outline"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Go to Settings
          </button>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Plan generation uses the Anthropic Claude API and typically takes 10-30 seconds.
      </p>
    </div>
  );
}
