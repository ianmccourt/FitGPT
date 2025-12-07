import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type {
  UserProfile,
  WorkoutPlan,
  WorkoutLog,
  AppSettings,
  AppState,
  Statistics,
} from '../types';
import * as storage from '../utils/storage';
import { calculateStatistics, formatDateISO } from '../utils/statistics';

// Action types
type Action =
  | { type: 'SET_USER_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'CLEAR_USER_PROFILE' }
  | { type: 'SET_WORKOUT_PLAN'; payload: WorkoutPlan }
  | { type: 'CLEAR_WORKOUT_PLAN' }
  | { type: 'SET_WORKOUT_LOGS'; payload: WorkoutLog[] }
  | { type: 'ADD_WORKOUT_LOG'; payload: WorkoutLog }
  | { type: 'UPDATE_WORKOUT_LOG'; payload: { date: string; updates: Partial<WorkoutLog> } }
  | { type: 'CLEAR_WORKOUT_LOGS' }
  | { type: 'SET_SETTINGS'; payload: AppSettings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_GENERATING_PLAN'; payload: boolean }
  | { type: 'SET_CURRENT_VIEW'; payload: AppState['currentView'] }
  | { type: 'SET_SELECTED_DATE'; payload: string | null }
  | { type: 'CLEAR_ALL_DATA' }
  | { type: 'LOAD_FROM_STORAGE' };

// Initial state
const initialState: AppState = {
  userProfile: null,
  workoutPlan: null,
  workoutLogs: [],
  settings: {
    apiKey: '',
    darkMode: false,
    notifications: true,
    weekStartsOn: 0,
  },
  isGeneratingPlan: false,
  currentView: 'onboarding',
  selectedDate: null,
};

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER_PROFILE':
      storage.setUserProfile(action.payload);
      return { ...state, userProfile: action.payload };

    case 'UPDATE_USER_PROFILE':
      if (state.userProfile) {
        const updated = { ...state.userProfile, ...action.payload };
        storage.setUserProfile(updated);
        return { ...state, userProfile: updated };
      }
      return state;

    case 'CLEAR_USER_PROFILE':
      storage.clearUserProfile();
      return { ...state, userProfile: null };

    case 'SET_WORKOUT_PLAN':
      storage.setWorkoutPlan(action.payload);
      return { ...state, workoutPlan: action.payload };

    case 'CLEAR_WORKOUT_PLAN':
      storage.clearWorkoutPlan();
      return { ...state, workoutPlan: null };

    case 'SET_WORKOUT_LOGS':
      storage.setWorkoutLogs(action.payload);
      return { ...state, workoutLogs: action.payload };

    case 'ADD_WORKOUT_LOG':
      const newLogs = [...state.workoutLogs];
      const existingIndex = newLogs.findIndex((l) => l.date === action.payload.date);
      if (existingIndex >= 0) {
        newLogs[existingIndex] = action.payload;
      } else {
        newLogs.push(action.payload);
      }
      storage.setWorkoutLogs(newLogs);
      return { ...state, workoutLogs: newLogs };

    case 'UPDATE_WORKOUT_LOG':
      const updatedLogs = state.workoutLogs.map((log) =>
        log.date === action.payload.date ? { ...log, ...action.payload.updates } : log
      );
      storage.setWorkoutLogs(updatedLogs);
      return { ...state, workoutLogs: updatedLogs };

    case 'CLEAR_WORKOUT_LOGS':
      storage.clearWorkoutLogs();
      return { ...state, workoutLogs: [] };

    case 'SET_SETTINGS':
      storage.setSettings(action.payload);
      return { ...state, settings: action.payload };

    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.payload };
      storage.setSettings(newSettings);
      return { ...state, settings: newSettings };

    case 'SET_GENERATING_PLAN':
      return { ...state, isGeneratingPlan: action.payload };

    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };

    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };

    case 'CLEAR_ALL_DATA':
      storage.clearAllData();
      return { ...initialState };

    case 'LOAD_FROM_STORAGE':
      const userProfile = storage.getUserProfile();
      const workoutPlan = storage.getWorkoutPlan();
      const workoutLogs = storage.getWorkoutLogs();
      const settings = storage.getSettings();

      let currentView: AppState['currentView'] = 'onboarding';
      if (userProfile?.completedOnboarding && workoutPlan) {
        currentView = 'dashboard';
      } else if (userProfile?.completedOnboarding) {
        currentView = 'dashboard';
      }

      return {
        ...state,
        userProfile,
        workoutPlan,
        workoutLogs,
        settings,
        currentView,
        selectedDate: formatDateISO(new Date()),
      };

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  statistics: Statistics;
  getTodaysWorkout: () => { workout: WorkoutPlan['weeklySchedule'][0] | null; log: WorkoutLog | null };
  getWorkoutForDate: (date: string) => { workout: WorkoutPlan['weeklySchedule'][0] | null; log: WorkoutLog | null };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from storage on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_FROM_STORAGE' });
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (state.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.settings.darkMode]);

  // Calculate statistics
  const statistics = calculateStatistics(state.workoutLogs, state.workoutPlan);

  // Helper to get today's workout
  const getTodaysWorkout = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dateStr = formatDateISO(today);

    const workout = state.workoutPlan?.weeklySchedule.find((w) => w.dayOfWeek === dayOfWeek) || null;
    const log = state.workoutLogs.find((l) => l.date === dateStr) || null;

    return { workout, log };
  };

  // Helper to get workout for a specific date
  const getWorkoutForDate = (date: string) => {
    const d = new Date(date);
    const dayOfWeek = d.getDay();

    const workout = state.workoutPlan?.weeklySchedule.find((w) => w.dayOfWeek === dayOfWeek) || null;
    const log = state.workoutLogs.find((l) => l.date === date) || null;

    return { workout, log };
  };

  return (
    <AppContext.Provider value={{ state, dispatch, statistics, getTodaysWorkout, getWorkoutForDate }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
