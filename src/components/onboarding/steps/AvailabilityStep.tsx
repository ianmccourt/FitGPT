import { DAYS_OF_WEEK } from '../../../types';

interface AvailabilityStepProps {
  availability: {
    daysPerWeek: number;
    minutesPerSession: number;
    preferredDays: string[];
  };
  onChange: (availability: AvailabilityStepProps['availability']) => void;
  onNext: () => void;
  onBack: () => void;
}

const sessionDurations = [
  { value: 20, label: '20 min', description: 'Quick session' },
  { value: 30, label: '30 min', description: 'Short workout' },
  { value: 45, label: '45 min', description: 'Standard' },
  { value: 60, label: '60 min', description: 'Full session' },
  { value: 90, label: '90 min', description: 'Extended' },
];

export default function AvailabilityStep({ availability, onChange, onNext, onBack }: AvailabilityStepProps) {
  const toggleDay = (day: string) => {
    const newDays = availability.preferredDays.includes(day)
      ? availability.preferredDays.filter((d) => d !== day)
      : [...availability.preferredDays, day];
    onChange({
      ...availability,
      preferredDays: newDays,
      daysPerWeek: newDays.length,
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">When can you workout?</h2>
        <p className="text-slate-600">We'll schedule your workouts around your availability.</p>
      </div>

      {/* Days selection */}
      <div className="space-y-4">
        <label className="label">Which days work best for you?</label>
        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = availability.preferredDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className={`text-xs font-medium ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                  {day.slice(0, 3)}
                </span>
                {isSelected && (
                  <svg className="w-4 h-4 text-blue-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-slate-500">
          {availability.preferredDays.length} day{availability.preferredDays.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      {/* Duration selection */}
      <div className="space-y-4">
        <label className="label">How long can you workout per session?</label>
        <div className="grid grid-cols-5 gap-2">
          {sessionDurations.map((duration) => {
            const isSelected = availability.minutesPerSession === duration.value;
            return (
              <button
                key={duration.value}
                onClick={() => onChange({ ...availability, minutesPerSession: duration.value })}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className={`text-lg font-bold ${isSelected ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {duration.label}
                </span>
                <span className={`text-xs ${isSelected ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {duration.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {availability.preferredDays.length > 0 && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-100">
          <p className="text-slate-700">
            <span className="font-semibold">Your schedule:</span>{' '}
            {availability.preferredDays.length} workout{availability.preferredDays.length !== 1 ? 's' : ''} per week,{' '}
            {availability.minutesPerSession} minutes each session
          </p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="btn btn-ghost">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>
        <button
          onClick={onNext}
          disabled={availability.preferredDays.length === 0}
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
