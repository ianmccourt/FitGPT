import type { Exercise } from '../../types';

interface WorkoutCardProps {
  exercise: Exercise;
  index: number;
  isCompleted?: boolean;
  onToggle?: () => void;
}

export default function WorkoutCard({ exercise, index, isCompleted, onToggle }: WorkoutCardProps) {
  const getCategoryColor = (category: Exercise['category']) => {
    switch (category) {
      case 'warmup':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cooldown':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const getCategoryLabel = (category: Exercise['category']) => {
    switch (category) {
      case 'warmup':
        return 'Warm-up';
      case 'cooldown':
        return 'Cool-down';
      default:
        return 'Exercise';
    }
  };

  return (
    <div
      className={`card p-4 transition-all duration-200 ${
        isCompleted ? 'bg-emerald-50 border-emerald-200' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Exercise number or checkbox */}
        {onToggle ? (
          <button
            onClick={onToggle}
            className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-slate-300 hover:border-emerald-400'
            }`}
          >
            {isCompleted ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span className="text-sm font-medium text-slate-400">{index + 1}</span>
            )}
          </button>
        ) : (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-sm font-medium text-slate-600">{index + 1}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`font-semibold ${isCompleted ? 'text-emerald-700 line-through' : 'text-slate-900'}`}>
              {exercise.name}
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(exercise.category)}`}>
              {getCategoryLabel(exercise.category)}
            </span>
          </div>

          {/* Sets/Reps/Duration */}
          <div className="flex flex-wrap gap-3 mt-2 text-sm">
            {exercise.sets && (
              <span className="flex items-center gap-1 text-slate-600">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                {exercise.sets} sets
              </span>
            )}
            {exercise.reps && (
              <span className="flex items-center gap-1 text-slate-600">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                {exercise.reps}
              </span>
            )}
            {exercise.duration && (
              <span className="flex items-center gap-1 text-slate-600">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {exercise.duration}
              </span>
            )}
            {exercise.rest && (
              <span className="flex items-center gap-1 text-slate-600">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Rest: {exercise.rest}
              </span>
            )}
          </div>

          {/* Instructions */}
          {exercise.instructions && (
            <p className="mt-2 text-sm text-slate-600">{exercise.instructions}</p>
          )}

          {/* Modifications */}
          {exercise.modifications && (
            <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500">
                <span className="font-medium">Modifications:</span> {exercise.modifications}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
