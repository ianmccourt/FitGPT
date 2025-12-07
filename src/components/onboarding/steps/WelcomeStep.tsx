interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center space-y-8">
      {/* Logo/Icon */}
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 shadow-lg animate-bounce-in">
        <svg
          className="w-12 h-12 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>

      {/* Title */}
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold">
          Welcome to{' '}
          <span className="text-gradient">FitGPT</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-lg mx-auto">
          Your AI-powered personal fitness coach. Let's create a workout plan tailored just for you.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-xl mx-auto">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-100">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Personalized</h3>
            <p className="text-sm text-slate-600">Plans made for your goals</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-100">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Track Progress</h3>
            <p className="text-sm text-slate-600">Log workouts daily</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-100">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Stay Motivated</h3>
            <p className="text-sm text-slate-600">Build lasting habits</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-4">
        <button
          onClick={onNext}
          className="btn btn-primary px-8 py-3 text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
        >
          Get Started
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Privacy note */}
      <p className="text-sm text-slate-500">
        Your data stays on your device. We respect your privacy.
      </p>
    </div>
  );
}
