import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getMonthDates, formatDateISO, isSameDay } from '../../utils/statistics';
import { DAYS_OF_WEEK } from '../../types';
import DayDetail from './DayDetail';

export default function CalendarView() {
  const { getWorkoutForDate } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const dates = getMonthDates(year, month);
  const today = new Date();

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getDayStatus = (date: Date) => {
    const dateStr = formatDateISO(date);
    const { workout, log } = getWorkoutForDate(dateStr);

    if (!workout) return null;

    if (workout.isRestDay) {
      return { type: 'rest', workout, log };
    }

    if (log?.completed) {
      return { type: 'completed', workout, log };
    }

    if (date < today && !isSameDay(date, today)) {
      return { type: 'missed', workout, log };
    }

    return { type: 'scheduled', workout, log };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
        <button onClick={goToToday} className="btn btn-outline text-sm">
          Today
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="card">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={goToPrevMonth}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Previous month"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-slate-900">{monthName}</h2>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Next month"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-slate-500 py-2"
                >
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {dates.map((date, index) => {
                const isCurrentMonth = date.getMonth() === month;
                const isToday = isSameDay(date, today);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const status = getDayStatus(date);

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      aspect-square p-1 rounded-lg transition-all relative
                      ${!isCurrentMonth ? 'opacity-30' : ''}
                      ${isSelected ? 'ring-2 ring-blue-500' : ''}
                      ${isToday ? 'bg-blue-50' : 'hover:bg-slate-50'}
                    `}
                  >
                    <div className={`
                      w-full h-full rounded-lg flex flex-col items-center justify-center
                      ${status?.type === 'completed' ? 'bg-emerald-100' : ''}
                      ${status?.type === 'missed' ? 'bg-red-50' : ''}
                      ${status?.type === 'scheduled' ? 'bg-blue-50' : ''}
                      ${status?.type === 'rest' ? 'bg-slate-50' : ''}
                    `}>
                      <span className={`
                        text-sm font-medium
                        ${isToday ? 'text-blue-600 font-bold' : ''}
                        ${status?.type === 'completed' ? 'text-emerald-700' : ''}
                        ${status?.type === 'missed' ? 'text-red-600' : ''}
                        ${!status && isCurrentMonth ? 'text-slate-700' : ''}
                      `}>
                        {date.getDate()}
                      </span>

                      {/* Status indicator */}
                      {status && isCurrentMonth && (
                        <div className="mt-0.5">
                          {status.type === 'completed' && (
                            <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {status.type === 'missed' && (
                            <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          {status.type === 'scheduled' && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                          {status.type === 'rest' && (
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Completed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-600">Scheduled</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-slate-600">Missed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-slate-600">Rest Day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Day detail sidebar */}
        <div>
          {selectedDate ? (
            <DayDetail date={selectedDate} onClose={() => setSelectedDate(null)} />
          ) : (
            <div className="card text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-600">Select a date to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
