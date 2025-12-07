import type { WorkoutLog, WorkoutPlan, Statistics } from '../types';

export function calculateStatistics(logs: WorkoutLog[], plan: WorkoutPlan | null): Statistics {
  const completedLogs = logs.filter((log) => log.completed);
  const today = new Date();
  const startOfWeek = getStartOfWeek(today);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // This week's completed workouts
  const thisWeekCompleted = completedLogs.filter((log) => {
    const logDate = new Date(log.date);
    return logDate >= startOfWeek && logDate <= today;
  }).length;

  // This month's completed workouts
  const thisMonthCompleted = completedLogs.filter((log) => {
    const logDate = new Date(log.date);
    return logDate >= startOfMonth && logDate <= today;
  }).length;

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(logs, plan);

  // Average workout duration
  const durations = completedLogs
    .filter((log) => log.duration && log.duration > 0)
    .map((log) => log.duration as number);
  const averageWorkoutDuration =
    durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  // Completion rate (last 30 days)
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentLogs = logs.filter((log) => new Date(log.date) >= thirtyDaysAgo);
  const recentCompleted = recentLogs.filter((log) => log.completed).length;
  const scheduledDays = plan ? plan.weeklySchedule.filter((d) => !d.isRestDay).length : 4;
  const expectedWorkouts = Math.round((scheduledDays / 7) * 30);
  const completionRate = expectedWorkouts > 0 ? Math.round((recentCompleted / expectedWorkouts) * 100) : 0;

  // Most frequent workout type
  const typeCounts: Record<string, number> = {};
  completedLogs.forEach((log) => {
    const workout = plan?.weeklySchedule.find((w) => w.id === log.workoutId);
    if (workout && workout.type) {
      typeCounts[workout.type] = (typeCounts[workout.type] || 0) + 1;
    }
  });
  const mostFrequentWorkoutType =
    Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

  return {
    totalWorkoutsCompleted: completedLogs.length,
    currentStreak,
    longestStreak,
    thisWeekCompleted,
    thisMonthCompleted,
    averageWorkoutDuration,
    completionRate: Math.min(completionRate, 100),
    mostFrequentWorkoutType,
  };
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function calculateStreaks(
  logs: WorkoutLog[],
  plan: WorkoutPlan | null
): { currentStreak: number; longestStreak: number } {
  if (!plan || logs.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const scheduledDays = new Set(
    plan.weeklySchedule.filter((w) => !w.isRestDay).map((w) => w.dayOfWeek)
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check current streak
  let checkDate = new Date(today);
  let foundBreak = false;

  for (let i = 0; i < 365 && !foundBreak; i++) {
    const dateStr = formatDateISO(checkDate);
    const dayOfWeek = checkDate.getDay();

    if (scheduledDays.has(dayOfWeek)) {
      const log = logs.find((l) => l.date === dateStr);
      if (log?.completed) {
        currentStreak++;
      } else if (checkDate < today) {
        foundBreak = true;
      }
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Calculate longest streak
  const allDates = new Set(logs.map((l) => l.date));
  const sortedDates = Array.from(allDates).sort();

  if (sortedDates.length > 0) {
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);

    let currentDate = new Date(startDate);
    tempStreak = 0;

    while (currentDate <= endDate) {
      const dateStr = formatDateISO(currentDate);
      const dayOfWeek = currentDate.getDay();

      if (scheduledDays.has(dayOfWeek)) {
        const log = logs.find((l) => l.date === dateStr);
        if (log?.completed) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return { currentStreak, longestStreak };
}

export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getWeekDates(date: Date): Date[] {
  const start = getStartOfWeek(date);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export function getMonthDates(year: number, month: number): Date[] {
  const dates: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Add days from previous month to start on Sunday
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(firstDay);
    d.setDate(d.getDate() - i - 1);
    dates.push(d);
  }

  // Add all days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    dates.push(new Date(year, month, i));
  }

  // Add days from next month to complete the grid (6 rows * 7 days = 42)
  const remaining = 42 - dates.length;
  for (let i = 1; i <= remaining; i++) {
    dates.push(new Date(year, month + 1, i));
  }

  return dates;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function formatDate(date: Date, format: 'short' | 'long' | 'weekday' = 'short'): string {
  switch (format) {
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'weekday':
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    case 'short':
    default:
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
  }
}
