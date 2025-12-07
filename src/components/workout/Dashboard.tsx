import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/statistics';
import TodaysWorkout from './TodaysWorkout';
import WorkoutPlanGenerator from './WorkoutPlanGenerator';
import ProgressStats from './ProgressStats';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {getGreeting()}, {state.userProfile?.name || 'Athlete'}!
          </h1>
          <p className="text-slate-600 mt-1">{formatDate(today, 'long')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'calendar' })}
            className="btn btn-outline"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Calendar
          </button>
        </div>
      </div>

      {/* Main content */}
      {state.workoutPlan ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's workout - takes 2 columns */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Today's Workout</h2>
            <TodaysWorkout />
          </div>

          {/* Sidebar - stats */}
          <div className="space-y-6">
            <ProgressStats />

            {/* Quick actions */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'calendar' })}
                  className="w-full btn btn-ghost justify-start"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  View Calendar
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'settings' })}
                  className="w-full btn btn-ghost justify-start"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
              </div>
            </div>

            {/* Weekly schedule preview */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 mb-4">This Week</h3>
              <div className="space-y-2">
                {state.workoutPlan.weeklySchedule.map((day) => (
                  <div
                    key={day.id}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      day.dayOfWeek === today.getDay()
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-slate-50'
                    }`}
                  >
                    <span className={`text-sm ${
                      day.dayOfWeek === today.getDay() ? 'font-semibold text-blue-700' : 'text-slate-600'
                    }`}>
                      {day.dayName.slice(0, 3)}
                    </span>
                    <span className={`text-sm ${
                      day.isRestDay ? 'text-slate-400' : 'text-slate-700'
                    }`}>
                      {day.isRestDay ? 'Rest' : day.focus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto py-8">
          <WorkoutPlanGenerator />
        </div>
      )}
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
