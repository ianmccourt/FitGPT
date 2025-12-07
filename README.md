# FitGPT - AI-Powered Fitness Coach

A modern, responsive web application that generates personalized workout plans using AI and helps users track their fitness progress.

## Features

- **Personalized Workout Plans**: AI-generated workout routines tailored to your fitness goals, level, equipment, and schedule
- **Interactive Onboarding**: Multi-step questionnaire to understand your fitness needs
- **Workout Tracking**: Log completed workouts with notes and track your progress
- **Calendar View**: Visual calendar showing scheduled workouts, completed sessions, and rest days
- **Progress Statistics**: Track streaks, completion rates, and workout history
- **Data Management**: Export/import your data, all stored locally in your browser
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **Anthropic Claude API** for AI-powered workout generation
- **localStorage** for data persistence (no backend required)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/FitGPT.git
   cd FitGPT
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Complete the Onboarding**: Answer questions about your fitness goals, experience level, available equipment, and schedule.

2. **Add Your API Key**: Go to Settings and enter your Anthropic API key to enable workout plan generation.

3. **Generate Your Plan**: Click "Generate My Plan" to create a personalized weekly workout routine.

4. **Track Your Workouts**: Check off exercises as you complete them and add notes about your sessions.

5. **View Your Progress**: Use the calendar to see your workout history and the dashboard for statistics.

## Project Structure

```
src/
├── components/
│   ├── calendar/       # Calendar view components
│   ├── common/         # Shared components (Navigation, Confetti)
│   ├── onboarding/     # Multi-step onboarding flow
│   ├── settings/       # Settings panel
│   └── workout/        # Workout display and tracking
├── context/            # React Context for state management
├── types/              # TypeScript type definitions
└── utils/              # Utility functions (storage, API, statistics)
```

## Data Privacy

- All data is stored locally in your browser's localStorage
- Your API key never leaves your device except when making requests to Anthropic
- No analytics or tracking is used
- Export your data anytime as a JSON backup

## License

MIT
