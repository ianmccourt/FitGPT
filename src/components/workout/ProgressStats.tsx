import { useApp } from '../../context/AppContext';

export default function ProgressStats() {
  const { statistics } = useApp();

  const stats = [
    {
      label: 'Current Streak',
      value: statistics.currentStreak,
      unit: 'days',
      icon: (
        <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      ),
      color: 'bg-orange-50',
    },
    {
      label: 'Total Completed',
      value: statistics.totalWorkoutsCompleted,
      unit: 'workouts',
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      color: 'bg-emerald-50',
    },
    {
      label: 'This Week',
      value: statistics.thisWeekCompleted,
      unit: 'workouts',
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      color: 'bg-blue-50',
    },
    {
      label: 'Completion Rate',
      value: statistics.completionRate,
      unit: '%',
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
      color: 'bg-purple-50',
    },
  ];

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-900 mb-4">Your Progress</h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className={`p-3 rounded-lg ${stat.color}`}>
            <div className="flex items-center gap-2 mb-1">
              {stat.icon}
              <span className="text-xs text-slate-600">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {stat.value}
              <span className="text-sm font-normal text-slate-500 ml-1">{stat.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {statistics.longestStreak > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Longest streak</span>
            <span className="font-semibold text-slate-900">{statistics.longestStreak} days</span>
          </div>
        </div>
      )}
    </div>
  );
}
