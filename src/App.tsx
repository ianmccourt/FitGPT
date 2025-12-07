import { AppProvider, useApp } from './context/AppContext';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import Dashboard from './components/workout/Dashboard';
import CalendarView from './components/calendar/CalendarView';
import SettingsPanel from './components/settings/SettingsPanel';
import NavigationBar from './components/common/NavigationBar';

function AppContent() {
  const { state } = useApp();

  // Show onboarding if user hasn't completed it
  if (state.currentView === 'onboarding' || !state.userProfile?.completedOnboarding) {
    return <OnboardingFlow />;
  }

  // Main app with navigation
  return (
    <div className="min-h-screen bg-slate-50">
      <NavigationBar />

      {/* Main content area with responsive padding */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {state.currentView === 'dashboard' && <Dashboard />}
          {state.currentView === 'calendar' && <CalendarView />}
          {state.currentView === 'settings' && <SettingsPanel />}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
