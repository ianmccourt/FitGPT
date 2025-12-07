import { useState } from 'react';
import type { UserProfile, OnboardingStep } from '../../types';
import { useApp } from '../../context/AppContext';
import WelcomeStep from './steps/WelcomeStep';
import GoalsStep from './steps/GoalsStep';
import FitnessLevelStep from './steps/FitnessLevelStep';
import CurrentRoutineStep from './steps/CurrentRoutineStep';
import AvailabilityStep from './steps/AvailabilityStep';
import EquipmentStep from './steps/EquipmentStep';
import LimitationsStep from './steps/LimitationsStep';
import PreferencesStep from './steps/PreferencesStep';

const STEPS: OnboardingStep[] = [
  'welcome',
  'goals',
  'fitness-level',
  'current-routine',
  'availability',
  'equipment',
  'limitations',
  'preferences',
  'complete',
];

const initialProfile: Partial<UserProfile> = {
  goals: [],
  fitnessLevel: 'beginner',
  currentRoutine: '',
  availability: {
    daysPerWeek: 3,
    minutesPerSession: 45,
    preferredDays: [],
  },
  equipment: [],
  limitations: '',
  preferences: [],
};

export default function OnboardingFlow() {
  const { dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [profileData, setProfileData] = useState<Partial<UserProfile>>(initialProfile);

  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex) / (STEPS.length - 1)) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfileData((prev) => ({ ...prev, ...updates }));
  };

  const handleComplete = () => {
    const now = new Date().toISOString();
    const fullProfile: UserProfile = {
      goals: profileData.goals || [],
      fitnessLevel: profileData.fitnessLevel || 'beginner',
      currentRoutine: profileData.currentRoutine || '',
      availability: profileData.availability || {
        daysPerWeek: 3,
        minutesPerSession: 45,
        preferredDays: [],
      },
      equipment: profileData.equipment || [],
      limitations: profileData.limitations || '',
      preferences: profileData.preferences || [],
      completedOnboarding: true,
      createdAt: now,
      updatedAt: now,
    };

    dispatch({ type: 'SET_USER_PROFILE', payload: fullProfile });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'dashboard' });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onNext={handleNext} />;
      case 'goals':
        return (
          <GoalsStep
            selected={profileData.goals || []}
            onChange={(goals) => updateProfile({ goals })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'fitness-level':
        return (
          <FitnessLevelStep
            selected={profileData.fitnessLevel || 'beginner'}
            onChange={(fitnessLevel) => updateProfile({ fitnessLevel })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'current-routine':
        return (
          <CurrentRoutineStep
            value={profileData.currentRoutine || ''}
            onChange={(currentRoutine) => updateProfile({ currentRoutine })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'availability':
        return (
          <AvailabilityStep
            availability={profileData.availability || { daysPerWeek: 3, minutesPerSession: 45, preferredDays: [] }}
            onChange={(availability) => updateProfile({ availability })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'equipment':
        return (
          <EquipmentStep
            selected={profileData.equipment || []}
            onChange={(equipment) => updateProfile({ equipment })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'limitations':
        return (
          <LimitationsStep
            value={profileData.limitations || ''}
            onChange={(limitations) => updateProfile({ limitations })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'preferences':
        return (
          <PreferencesStep
            selected={profileData.preferences || []}
            onChange={(preferences) => updateProfile({ preferences })}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex flex-col">
      {/* Progress bar */}
      {currentStep !== 'welcome' && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl animate-fade-in">
          {renderStep()}
        </div>
      </div>

      {/* Step indicator */}
      {currentStep !== 'welcome' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex gap-2">
            {STEPS.slice(1, -1).map((step, index) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index < currentStepIndex
                    ? 'bg-emerald-500'
                    : index === currentStepIndex - 1
                    ? 'bg-blue-500 w-4'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
