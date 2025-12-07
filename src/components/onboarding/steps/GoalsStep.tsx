import { FITNESS_GOALS } from '../../../types';

interface GoalsStepProps {
  selected: string[];
  onChange: (goals: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function GoalsStep({ selected, onChange, onNext, onBack }: GoalsStepProps) {
  const toggleGoal = (goalId: string) => {
    if (selected.includes(goalId)) {
      onChange(selected.filter((g) => g !== goalId));
    } else {
      onChange([...selected, goalId]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">What are your fitness goals?</h2>
        <p className="text-slate-600">Select all that apply. We'll tailor your workouts accordingly.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FITNESS_GOALS.map((goal) => {
          const isSelected = selected.includes(goal.id);
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <span className="text-2xl">{goal.icon}</span>
              <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                {goal.label}
              </span>
              {isSelected && (
                <svg
                  className="w-5 h-5 text-blue-500 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn btn-ghost">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className="btn btn-primary"
        >
          Continue
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
