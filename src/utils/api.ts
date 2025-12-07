import type { UserProfile, WorkoutPlan, DailyWorkout } from '../types';
import { DAYS_OF_WEEK, FITNESS_GOALS, EQUIPMENT_OPTIONS, WORKOUT_PREFERENCES } from '../types';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function buildPrompt(profile: UserProfile): string {
  const goals = profile.goals
    .map((g) => FITNESS_GOALS.find((fg) => fg.id === g)?.label || g)
    .join(', ');

  const equipment = profile.equipment
    .map((e) => EQUIPMENT_OPTIONS.find((eq) => eq.id === e)?.label || e)
    .join(', ');

  const preferences = profile.preferences
    .map((p) => WORKOUT_PREFERENCES.find((wp) => wp.id === p)?.label || p)
    .join(', ');

  const workoutDays = profile.availability.preferredDays.join(', ');

  return `You are a professional fitness coach creating a personalized weekly workout plan. Generate a comprehensive workout plan based on the following user profile:

## User Profile
- **Fitness Goals**: ${goals}
- **Fitness Level**: ${profile.fitnessLevel}
- **Current Routine**: ${profile.currentRoutine || 'None specified'}
- **Workout Days**: ${workoutDays} (${profile.availability.daysPerWeek} days per week)
- **Session Duration**: ${profile.availability.minutesPerSession} minutes per session
- **Available Equipment**: ${equipment || 'Bodyweight only'}
- **Physical Limitations**: ${profile.limitations || 'None'}
- **Preferred Workout Types**: ${preferences || 'No specific preferences'}

## Requirements
Create a structured weekly workout plan that:
1. Schedules workouts ONLY on the specified days: ${workoutDays}
2. Fits within ${profile.availability.minutesPerSession} minutes per session
3. Uses only the available equipment: ${equipment || 'bodyweight exercises'}
4. Avoids exercises that may aggravate any limitations mentioned
5. Aligns with the user's goals and preferences
6. Includes proper warm-up and cool-down for each workout
7. Provides progressive overload suggestions

## Output Format
Respond with ONLY a valid JSON object (no markdown, no code blocks, no explanations) in this exact format:

{
  "weeklySchedule": [
    {
      "dayOfWeek": 0,
      "dayName": "Sunday",
      "type": "Rest",
      "focus": "Recovery",
      "duration": 0,
      "isRestDay": true,
      "exercises": [],
      "notes": "Active recovery - light walking or stretching recommended"
    },
    {
      "dayOfWeek": 1,
      "dayName": "Monday",
      "type": "Strength Training",
      "focus": "Upper Body",
      "duration": 45,
      "isRestDay": false,
      "exercises": [
        {
          "name": "Exercise Name",
          "category": "warmup",
          "sets": 1,
          "reps": "30 seconds",
          "duration": "30 seconds",
          "rest": "10 seconds",
          "instructions": "Step by step instructions",
          "modifications": "Easier/harder variations"
        }
      ],
      "notes": "Focus on proper form"
    }
  ],
  "progressionNotes": "Progression suggestions for the coming weeks"
}

Rules for the JSON:
- dayOfWeek: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
- Include ALL 7 days (mark non-workout days as rest days)
- category must be one of: "warmup", "main", "cooldown"
- For rest days: isRestDay=true, exercises=[], duration=0
- For workout days: include 2-3 warmup exercises, 4-8 main exercises, 2-3 cooldown exercises
- Each exercise must have: name, category, instructions (and optionally sets, reps, duration, rest, modifications)

Generate the workout plan now:`;
}

function parseWorkoutPlan(jsonString: string, profile: UserProfile): WorkoutPlan {
  // Try to extract JSON from the response if it's wrapped in markdown code blocks
  let cleanJson = jsonString.trim();

  // Remove markdown code blocks if present
  if (cleanJson.startsWith('```json')) {
    cleanJson = cleanJson.slice(7);
  } else if (cleanJson.startsWith('```')) {
    cleanJson = cleanJson.slice(3);
  }
  if (cleanJson.endsWith('```')) {
    cleanJson = cleanJson.slice(0, -3);
  }
  cleanJson = cleanJson.trim();

  const parsed = JSON.parse(cleanJson);

  // Transform the parsed data into our format
  const weeklySchedule: DailyWorkout[] = parsed.weeklySchedule.map((day: any) => ({
    id: generateId(),
    dayOfWeek: day.dayOfWeek,
    dayName: day.dayName || DAYS_OF_WEEK[day.dayOfWeek],
    type: day.type || 'Rest',
    focus: day.focus || '',
    duration: day.duration || 0,
    isRestDay: day.isRestDay ?? day.duration === 0,
    exercises: (day.exercises || []).map((ex: any) => ({
      id: generateId(),
      name: ex.name,
      category: ex.category || 'main',
      sets: ex.sets,
      reps: ex.reps,
      duration: ex.duration,
      rest: ex.rest,
      instructions: ex.instructions || '',
      modifications: ex.modifications,
    })),
    notes: day.notes || '',
  }));

  // Ensure all 7 days are present
  for (let i = 0; i < 7; i++) {
    if (!weeklySchedule.find((d) => d.dayOfWeek === i)) {
      weeklySchedule.push({
        id: generateId(),
        dayOfWeek: i,
        dayName: DAYS_OF_WEEK[i],
        type: 'Rest',
        focus: 'Recovery',
        duration: 0,
        isRestDay: true,
        exercises: [],
        notes: 'Rest day',
      });
    }
  }

  // Sort by day of week
  weeklySchedule.sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    weeklySchedule,
    durationWeeks: 4,
    progressionNotes: parsed.progressionNotes || '',
    userProfileSnapshot: {
      goals: profile.goals,
      fitnessLevel: profile.fitnessLevel,
      availability: profile.availability,
      equipment: profile.equipment,
      preferences: profile.preferences,
    },
  };
}

export async function generateWorkoutPlan(
  apiKey: string,
  profile: UserProfile,
  onProgress?: (message: string) => void
): Promise<WorkoutPlan> {
  if (!apiKey) {
    throw new Error('API key is required. Please add your Anthropic API key in settings.');
  }

  onProgress?.('Analyzing your fitness profile...');

  const prompt = buildPrompt(profile);

  onProgress?.('Designing your personalized workout plan...');

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Anthropic API key in settings.');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    onProgress?.('Finalizing your workout plan...');

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      throw new Error('No response received from the API');
    }

    const workoutPlan = parseWorkoutPlan(content, profile);

    onProgress?.('Your plan is ready!');

    return workoutPlan;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate workout plan. Please try again.');
  }
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Hi',
          },
        ],
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}
