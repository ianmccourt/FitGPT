import { EQUIPMENT_OPTIONS } from '../../../types';

interface EquipmentStepProps {
  selected: string[];
  onChange: (equipment: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function EquipmentStep({ selected, onChange, onNext, onBack }: EquipmentStepProps) {
  const toggleEquipment = (equipmentId: string) => {
    if (selected.includes(equipmentId)) {
      onChange(selected.filter((e) => e !== equipmentId));
    } else {
      onChange([...selected, equipmentId]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">What equipment do you have?</h2>
        <p className="text-slate-600">Select all that you have access to. We'll plan workouts accordingly.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EQUIPMENT_OPTIONS.map((equipment) => {
          const isSelected = selected.includes(equipment.id);
          return (
            <button
              key={equipment.id}
              onClick={() => toggleEquipment(equipment.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                    {equipment.label}
                  </h3>
                  <p className={`text-sm mt-1 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                    {equipment.description}
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
              </div>
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-center text-sm text-slate-500">
          No equipment? No problem! Select "Bodyweight Only" for equipment-free workouts.
        </p>
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
