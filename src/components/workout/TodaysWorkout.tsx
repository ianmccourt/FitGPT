import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateISO } from '../../utils/statistics';
import type { WorkoutLog, ExerciseLog } from '../../types';
import WorkoutCard from './WorkoutCard';
import Confetti from '../common/Confetti';

export default function TodaysWorkout() {
  const { state, dispatch, getTodaysWorkout } = useApp();
  const [showConfetti, setShowConfetti] = useState(false);
  const [notes, setNotes] = useState('');

  const { workout, log } = getTodaysWorkout();
  const today = new Date();
  const dateStr = formatDateISO(today);

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
      <div className="card text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No Workout Today</h3>
        <p className="text-slate-600 mt-1">
          {state.workoutPlan
            ? "Today is a rest day. Enjoy your recovery!"
            : "Generate a workout plan to get started!"}
        </p>
      </div>
    );
  }

  if (workout.isRestDay) {
    return (
      <div className="card text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Rest Day</h3>
        <p className="text-slate-600 mt-2 max-w-md mx-auto">
          {workout.notes || "Recovery is just as important as training. Take it easy today!"}
        </p>
        <div className="mt-6 p-4 bg-white/60 rounded-lg max-w-sm mx-auto">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Tip:</span> Light stretching, walking, or yoga can help with recovery.
          </p>
        </div>
      </div>
    );
  }

  const toggleExercise = (exerciseId: string) => {
    const newStatus = { ...exerciseStatus, [exerciseId]: !exerciseStatus[exerciseId] };
    setExerciseStatus(newStatus);

    // Update the log
    const exercises: ExerciseLog[] = workout.exercises.map((ex) => ({
      exerciseId: ex.id,
      completed: newStatus[ex.id] || false,
    }));

    const allCompleted = workout.exercises.every((ex) => newStatus[ex.id]);

    const newLog: WorkoutLog = {
      id: log?.id || Math.random().toString(36).substring(2, 15),
      date: dateStr,
      dayOfWeek: today.getDay(),
      workoutId: workout.id,
      completed: allCompleted,
      exercises,
      notes: log?.notes || notes,
    };

    dispatch({ type: 'ADD_WORKOUT_LOG', payload: newLog });

    // Show confetti when all exercises are completed
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
      dayOfWeek: today.getDay(),
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
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isComplete = completedCount === totalCount;

  return (
    <div className="space-y-6">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{workout.type}</h2>
            <p className="text-slate-600">{workout.focus} - {workout.duration} min</p>
          </div>
          {!isComplete && (
            <button onClick={handleCompleteAll} className="btn btn-secondary">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Complete All
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-600">Progress</span>
            <span className="font-medium text-slate-900">{completedCount}/{totalCount}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isComplete ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {isComplete && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-emerald-700">Workout Complete!</p>
                <p className="text-sm text-emerald-600">Great job! You crushed it today!</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exercises */}
      <div className="space-y-3">
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
      <div className="card">
        <label className="label">Workout Notes</label>
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
          placeholder="How did it go? Any modifications or observations..."
          rows={3}
          className="input resize-none"
        />
      </div>
    </div>
  );
}
