interface CurrentRoutineStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const quickOptions = [
  { id: 'none', label: "I don't currently exercise", description: 'Starting from scratch' },
  { id: 'occasional', label: 'Occasional workouts', description: '1-2 times per month' },
  { id: 'light', label: 'Light activity', description: 'Walking, light stretching' },
  { id: 'moderate', label: 'Moderate routine', description: '2-3 workouts per week' },
  { id: 'active', label: 'Active lifestyle', description: '4+ workouts per week' },
];

export default function CurrentRoutineStep({ value, onChange, onNext, onBack }: CurrentRoutineStepProps) {
  const handleQuickSelect = (option: string) => {
    const selected = quickOptions.find((o) => o.id === option);
    if (selected) {
      onChange(`${selected.label}: ${selected.description}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">What's your current routine?</h2>
        <p className="text-slate-600">Tell us about your current activity level.</p>
      </div>

      <div className="space-y-3">
        {quickOptions.map((option) => {
          const isSelected = value.includes(option.label);
          return (
            <button
              key={option.id}
              onClick={() => handleQuickSelect(option.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center justify-between ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <h3 className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                  {option.label}
                </h3>
                <p className={`text-sm ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                  {option.description}
                </p>
              </div>
              {isSelected && (
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-gradient-to-br from-blue-50 via-white to-emerald-50 text-slate-500">
            Or describe in detail
          </span>
        </div>
      </div>

      <div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tell us more about your current workout routine... (optional)"
          rows={4}
          className="input resize-none"
        />
        <p className="mt-2 text-sm text-slate-500">
          Include details like specific activities, sports, or exercises you do regularly.
        </p>
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
