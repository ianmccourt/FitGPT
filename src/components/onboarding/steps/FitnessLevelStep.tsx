import type { UserProfile } from '../../../types';

interface FitnessLevelStepProps {
  selected: UserProfile['fitnessLevel'];
  onChange: (level: UserProfile['fitnessLevel']) => void;
  onNext: () => void;
  onBack: () => void;
}

const levels = [
  {
    id: 'beginner' as const,
    title: 'Beginner',
    description: 'New to exercise or returning after a long break',
    details: [
      'Little to no workout experience',
      'Learning proper form and technique',
      'Building foundational fitness',
    ],
    icon: '🌱',
  },
  {
    id: 'intermediate' as const,
    title: 'Intermediate',
    description: 'Consistent workout routine for 6+ months',
    details: [
      'Comfortable with most exercises',
      'Good understanding of form',
      'Ready for more challenging workouts',
    ],
    icon: '💪',
  },
  {
    id: 'advanced' as const,
    title: 'Advanced',
    description: 'Training consistently for 2+ years',
    details: [
      'High fitness level and endurance',
      'Excellent form and body awareness',
      'Looking for intense, complex workouts',
    ],
    icon: '🏆',
  },
];

export default function FitnessLevelStep({ selected, onChange, onNext, onBack }: FitnessLevelStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">What's your fitness level?</h2>
        <p className="text-slate-600">Be honest - we'll create a plan that matches where you're at.</p>
      </div>

      <div className="space-y-4">
        {levels.map((level) => {
          const isSelected = selected === level.id;
          return (
            <button
              key={level.id}
              onClick={() => onChange(level.id)}
              className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{level.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                      {level.title}
                    </h3>
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
                  <p className={`mt-1 ${isSelected ? 'text-blue-600' : 'text-slate-600'}`}>
                    {level.description}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {level.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-500">
                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
        <button onClick={onNext} className="btn btn-primary">
          Continue
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
