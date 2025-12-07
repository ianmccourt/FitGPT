import { WORKOUT_PREFERENCES } from '../../../types';

interface PreferencesStepProps {
  selected: string[];
  onChange: (preferences: string[]) => void;
  onComplete: () => void;
  onBack: () => void;
}

export default function PreferencesStep({ selected, onChange, onComplete, onBack }: PreferencesStepProps) {
  const togglePreference = (prefId: string) => {
    if (selected.includes(prefId)) {
      onChange(selected.filter((p) => p !== prefId));
    } else {
      onChange([...selected, prefId]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">What types of workouts do you enjoy?</h2>
        <p className="text-slate-600">Select your favorites. We'll prioritize these in your plan.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {WORKOUT_PREFERENCES.map((pref) => {
          const isSelected = selected.includes(pref.id);
          return (
            <button
              key={pref.id}
              onClick={() => togglePreference(pref.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className={`font-medium text-sm text-center ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                  {pref.label}
                </span>
                {isSelected && (
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary card */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-100">
        <h3 className="font-semibold text-slate-900 mb-3">Ready to create your plan!</h3>
        <p className="text-slate-600 text-sm">
          Based on your preferences, we'll generate a personalized workout plan using AI.
          You'll be able to review and customize it before starting.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          You'll need to add your Anthropic API key to generate workout plans.
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn btn-ghost">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>
        <button
          onClick={onComplete}
          className="btn btn-secondary px-8"
        >
          Complete Setup
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
