import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateISO, formatDate, isSameDay } from '../../utils/statistics';
import type { WorkoutLog, ExerciseLog } from '../../types';
import WorkoutCard from '../workout/WorkoutCard';
import Confetti from '../common/Confetti';

interface DayDetailProps {
  date: Date;
  onClose: () => void;
}

export default function DayDetail({ date, onClose }: DayDetailProps) {
  const { dispatch, getWorkoutForDate } = useApp();
  const [showConfetti, setShowConfetti] = useState(false);
  const [notes, setNotes] = useState('');

  const dateStr = formatDateISO(date);
  const { workout, log } = getWorkoutForDate(dateStr);
  const today = new Date();
  const isToday = isSameDay(date, today);

  const [exerciseStatus, setExerciseStatus] = useState<Record<string, boolean>>(() => {
    const status: Record<string, boolean> = {};
    if (log?.exercises) {
      log.exercises.forEach((ex) => {
        status[ex.exerciseId] = ex.completed;
      });
    }
    return status;
  });

  if (!workout) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{formatDate(date, 'long')}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-500">No workout plan for this day</p>
        </div>
      </div>
    );
  }

  if (workout.isRestDay) {
    return (
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{formatDate(date, 'long')}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/50">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <h4 className="font-semibold text-slate-900">Rest Day</h4>
          <p className="text-sm text-slate-600 mt-1">
            {workout.notes || 'Recovery time - take it easy!'}
          </p>
        </div>
      </div>
    );
  }

  const toggleExercise = (exerciseId: string) => {
    const newStatus = { ...exerciseStatus, [exerciseId]: !exerciseStatus[exerciseId] };
    setExerciseStatus(newStatus);

    const exercises: ExerciseLog[] = workout.exercises.map((ex) => ({
      exerciseId: ex.id,
      completed: newStatus[ex.id] || false,
    }));

    const allCompleted = workout.exercises.every((ex) => newStatus[ex.id]);

    const newLog: WorkoutLog = {
      id: log?.id || Math.random().toString(36).substring(2, 15),
      date: dateStr,
      dayOfWeek: date.getDay(),
      workoutId: workout.id,
      completed: allCompleted,
      exercises,
      notes: log?.notes || notes,
    };

    dispatch({ type: 'ADD_WORKOUT_LOG', payload: newLog });

    if (allCompleted && !log?.completed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleCompleteAll = () => {
    const newStatus: Record<string, boolean> = {};
    workout.exercises.forEach((ex) => {
      newStatus[ex.id] = true;
    });
    setExerciseStatus(newStatus);

    const exercises: ExerciseLog[] = workout.exercises.map((ex) => ({
      exerciseId: ex.id,
      completed: true,
    }));

    const newLog: WorkoutLog = {
      id: log?.id || Math.random().toString(36).substring(2, 15),
      date: dateStr,
      dayOfWeek: date.getDay(),
      workoutId: workout.id,
      completed: true,
      exercises,
      notes: log?.notes || notes,
    };

    dispatch({ type: 'ADD_WORKOUT_LOG', payload: newLog });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const completedCount = Object.values(exerciseStatus).filter(Boolean).length;
  const totalCount = workout.exercises.length;
  const isComplete = completedCount === totalCount;

  return (
    <div className="card overflow-hidden">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{formatDate(date, 'long')}</h3>
          {isToday && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Today</span>
          )}
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Workout info */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900">{workout.type}</h4>
        <p className="text-sm text-slate-600">{workout.focus} - {workout.duration} min</p>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-600">Progress</span>
          <span className="font-medium">{completedCount}/{totalCount}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-blue-500'}`}
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Complete all button */}
      {!isComplete && (
        <button onClick={handleCompleteAll} className="w-full btn btn-secondary mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mark All Complete
        </button>
      )}

      {isComplete && (
        <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
          <p className="text-sm font-medium text-emerald-700">Workout Complete!</p>
        </div>
      )}

      {/* Exercises list */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {workout.exercises.map((exercise, index) => (
          <WorkoutCard
            key={exercise.id}
            exercise={exercise}
            index={index}
            isCompleted={exerciseStatus[exercise.id]}
            onToggle={() => toggleExercise(exercise.id)}
          />
        ))}
      </div>

      {/* Notes */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <label className="text-sm font-medium text-slate-700">Notes</label>
        <textarea
          value={log?.notes || notes}
          onChange={(e) => {
            setNotes(e.target.value);
            if (log) {
              dispatch({
                type: 'UPDATE_WORKOUT_LOG',
                payload: { date: dateStr, updates: { notes: e.target.value } },
              });
            }
          }}
          placeholder="Add notes..."
          rows={2}
          className="input resize-none mt-1 text-sm"
        />
      </div>
    </div>
  );
}
