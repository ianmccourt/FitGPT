interface LimitationsStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const commonLimitations = [
  { id: 'none', label: 'No limitations', description: "I'm good to go!" },
  { id: 'back', label: 'Back issues', description: 'Lower or upper back pain/injury' },
  { id: 'knee', label: 'Knee problems', description: 'Knee pain or previous injury' },
  { id: 'shoulder', label: 'Shoulder issues', description: 'Shoulder pain or limited mobility' },
  { id: 'wrist', label: 'Wrist/hand issues', description: 'Limited grip or wrist pain' },
  { id: 'cardio', label: 'Cardio limitations', description: 'Heart/breathing conditions' },
];

export default function LimitationsStep({ value, onChange, onNext, onBack }: LimitationsStepProps) {
  const handleQuickSelect = (limitation: string) => {
    const selected = commonLimitations.find((l) => l.id === limitation);
    if (selected) {
      if (limitation === 'none') {
        onChange('No physical limitations');
      } else {
        onChange(value ? `${value}, ${selected.label}` : selected.label);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Any physical limitations?</h2>
        <p className="text-slate-600">
          Tell us about injuries or conditions so we can keep you safe.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {commonLimitations.map((limitation) => {
          const isSelected = limitation.id === 'none'
            ? value === 'No physical limitations'
            : value.toLowerCase().includes(limitation.label.toLowerCase());
          return (
            <button
              key={limitation.id}
              onClick={() => handleQuickSelect(limitation.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? limitation.id === 'none'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-orange-500 bg-orange-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-semibold ${
                    isSelected
                      ? limitation.id === 'none' ? 'text-emerald-700' : 'text-orange-700'
                      : 'text-slate-900'
                  }`}>
                    {limitation.label}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    isSelected
                      ? limitation.id === 'none' ? 'text-emerald-600' : 'text-orange-600'
                      : 'text-slate-500'
                  }`}>
                    {limitation.description}
                  </p>
                </div>
                {isSelected && (
                  <svg
                    className={`w-5 h-5 flex-shrink-0 ${
                      limitation.id === 'none' ? 'text-emerald-500' : 'text-orange-500'
                    }`}
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
              </div>
            </button>
          );
        })}
      </div>

      <div>
        <label className="label">Additional details (optional)</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe any injuries, health conditions, or exercises you need to avoid..."
          rows={4}
          className="input resize-none"
        />
        <p className="mt-2 text-sm text-slate-500">
          Include any specific movements or exercises you should avoid.
        </p>
      </div>

      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> Always consult with a healthcare provider before starting any new exercise program, especially if you have existing health conditions.
          </p>
        </div>
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
