export interface UserProfile {
  goals: string[];
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  currentRoutine: string;
  availability: {
    daysPerWeek: number;
    minutesPerSession: number;
    preferredDays: string[];
  };
  equipment: string[];
  limitations: string;
  preferences: string[];
  name?: string;
  completedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  rest?: string;
  instructions: string;
  modifications?: string;
  category: 'warmup' | 'main' | 'cooldown';
}

export interface DailyWorkout {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  dayName: string;
  type: string;
  focus: string;
  duration: number; // minutes
  exercises: Exercise[];
  warmup?: Exercise[];
  cooldown?: Exercise[];
  notes?: string;
  isRestDay: boolean;
}

export interface WorkoutPlan {
  id: string;
  createdAt: string;
  updatedAt: string;
  weeklySchedule: DailyWorkout[];
  durationWeeks: number;
  progressionNotes: string;
  userProfileSnapshot: Partial<UserProfile>;
}

export interface ExerciseLog {
  exerciseId: string;
  completed: boolean;
  actualSets?: number;
  actualReps?: string;
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  dayOfWeek: number;
  workoutId: string;
  completed: boolean;
  startTime?: string;
  endTime?: string;
  duration?: number; // actual minutes
  exercises: ExerciseLog[];
  notes: string;
  mood?: 'great' | 'good' | 'okay' | 'tired' | 'exhausted';
  difficulty?: 'too_easy' | 'just_right' | 'challenging' | 'too_hard';
}

export interface AppSettings {
  apiKey: string;
  darkMode: boolean;
  notifications: boolean;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
}

export interface AppState {
  userProfile: UserProfile | null;
  workoutPlan: WorkoutPlan | null;
  workoutLogs: WorkoutLog[];
  settings: AppSettings;
  isGeneratingPlan: boolean;
  currentView: 'onboarding' | 'dashboard' | 'calendar' | 'settings' | 'workout';
  selectedDate: string | null;
}

export interface Statistics {
  totalWorkoutsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  thisWeekCompleted: number;
  thisMonthCompleted: number;
  averageWorkoutDuration: number;
  completionRate: number;
  mostFrequentWorkoutType: string;
}

// Onboarding step types
export type OnboardingStep =
  | 'welcome'
  | 'goals'
  | 'fitness-level'
  | 'current-routine'
  | 'availability'
  | 'equipment'
  | 'limitations'
  | 'preferences'
  | 'complete';

export interface OnboardingState {
  currentStep: OnboardingStep;
  data: Partial<UserProfile>;
}

// API types
export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeAPIRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
}

export interface ClaudeAPIResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

// Constants
export const FITNESS_GOALS = [
  { id: 'weight-loss', label: 'Weight Loss', icon: '🔥' },
  { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
  { id: 'endurance', label: 'Build Endurance', icon: '🏃' },
  { id: 'strength', label: 'Strength Training', icon: '🏋️' },
  { id: 'flexibility', label: 'Flexibility & Mobility', icon: '🧘' },
  { id: 'general-fitness', label: 'General Fitness', icon: '❤️' },
  { id: 'sports-performance', label: 'Sports Performance', icon: '⚡' },
  { id: 'stress-relief', label: 'Stress Relief', icon: '🧠' },
] as const;

export const EQUIPMENT_OPTIONS = [
  { id: 'gym', label: 'Full Gym Access', description: 'Machines, cables, free weights' },
  { id: 'home-gym', label: 'Home Gym', description: 'Dumbbells, barbells, bench' },
  { id: 'basic-equipment', label: 'Basic Equipment', description: 'Dumbbells, resistance bands' },
  { id: 'bodyweight', label: 'Bodyweight Only', description: 'No equipment needed' },
  { id: 'kettlebells', label: 'Kettlebells', description: 'Kettlebell collection' },
  { id: 'pull-up-bar', label: 'Pull-up Bar', description: 'Doorway or mounted' },
  { id: 'cardio-machines', label: 'Cardio Machines', description: 'Treadmill, bike, elliptical' },
  { id: 'yoga-mat', label: 'Yoga Mat', description: 'For floor exercises' },
] as const;

export const WORKOUT_PREFERENCES = [
  { id: 'strength', label: 'Strength Training' },
  { id: 'cardio', label: 'Cardio Workouts' },
  { id: 'hiit', label: 'HIIT Sessions' },
  { id: 'yoga', label: 'Yoga & Stretching' },
  { id: 'pilates', label: 'Pilates' },
  { id: 'calisthenics', label: 'Calisthenics' },
  { id: 'circuit', label: 'Circuit Training' },
  { id: 'sports', label: 'Sports-Specific' },
] as const;

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
