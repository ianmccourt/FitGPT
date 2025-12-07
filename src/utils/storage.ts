import type { UserProfile, WorkoutPlan, WorkoutLog, AppSettings } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'fitgpt_user_profile',
  WORKOUT_PLAN: 'fitgpt_workout_plan',
  WORKOUT_LOGS: 'fitgpt_workout_logs',
  SETTINGS: 'fitgpt_settings',
} as const;

const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  darkMode: false,
  notifications: true,
  weekStartsOn: 0,
};

// Generic storage helpers
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

// User Profile
export function getUserProfile(): UserProfile | null {
  return getItem<UserProfile | null>(STORAGE_KEYS.USER_PROFILE, null);
}

export function setUserProfile(profile: UserProfile): void {
  setItem(STORAGE_KEYS.USER_PROFILE, {
    ...profile,
    updatedAt: new Date().toISOString(),
  });
}

export function clearUserProfile(): void {
  removeItem(STORAGE_KEYS.USER_PROFILE);
}

// Workout Plan
export function getWorkoutPlan(): WorkoutPlan | null {
  return getItem<WorkoutPlan | null>(STORAGE_KEYS.WORKOUT_PLAN, null);
}

export function setWorkoutPlan(plan: WorkoutPlan): void {
  setItem(STORAGE_KEYS.WORKOUT_PLAN, {
    ...plan,
    updatedAt: new Date().toISOString(),
  });
}

export function clearWorkoutPlan(): void {
  removeItem(STORAGE_KEYS.WORKOUT_PLAN);
}

// Workout Logs
export function getWorkoutLogs(): WorkoutLog[] {
  return getItem<WorkoutLog[]>(STORAGE_KEYS.WORKOUT_LOGS, []);
}

export function setWorkoutLogs(logs: WorkoutLog[]): void {
  setItem(STORAGE_KEYS.WORKOUT_LOGS, logs);
}

export function addWorkoutLog(log: WorkoutLog): void {
  const logs = getWorkoutLogs();
  const existingIndex = logs.findIndex((l) => l.date === log.date);
  if (existingIndex >= 0) {
    logs[existingIndex] = log;
  } else {
    logs.push(log);
  }
  setWorkoutLogs(logs);
}

export function updateWorkoutLog(date: string, updates: Partial<WorkoutLog>): void {
  const logs = getWorkoutLogs();
  const index = logs.findIndex((l) => l.date === date);
  if (index >= 0) {
    logs[index] = { ...logs[index], ...updates };
    setWorkoutLogs(logs);
  }
}

export function getWorkoutLogByDate(date: string): WorkoutLog | undefined {
  const logs = getWorkoutLogs();
  return logs.find((l) => l.date === date);
}

export function clearWorkoutLogs(): void {
  removeItem(STORAGE_KEYS.WORKOUT_LOGS);
}

// Settings
export function getSettings(): AppSettings {
  return getItem<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function setSettings(settings: AppSettings): void {
  setItem(STORAGE_KEYS.SETTINGS, settings);
}

export function updateSettings(updates: Partial<AppSettings>): void {
  const settings = getSettings();
  setSettings({ ...settings, ...updates });
}

export function clearSettings(): void {
  removeItem(STORAGE_KEYS.SETTINGS);
}

// Export all data
export function exportAllData(): string {
  const data = {
    userProfile: getUserProfile(),
    workoutPlan: getWorkoutPlan(),
    workoutLogs: getWorkoutLogs(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
  return JSON.stringify(data, null, 2);
}

// Import data
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.userProfile) setUserProfile(data.userProfile);
    if (data.workoutPlan) setWorkoutPlan(data.workoutPlan);
    if (data.workoutLogs) setWorkoutLogs(data.workoutLogs);
    if (data.settings) setSettings(data.settings);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

// Clear all data
export function clearAllData(): void {
  clearUserProfile();
  clearWorkoutPlan();
  clearWorkoutLogs();
  clearSettings();
}

// Download data as file
export function downloadData(): void {
  const data = exportAllData();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fitgpt-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
