import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Waves } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="text-center max-w-3xl mx-auto space-y-5 mb-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
        <Waves className="w-4 h-4" />
        Coastal Marine Conservation Platform
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
        Welcome to Ghostnet Reporter
      </h1>

      <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
        The ocean has no voice—your report is its lifeline. Be the eyes our seas need to report drifting ghost gear and safeguard the waters that feed us.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/fisherman/login')}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-sky-700 hover:bg-sky-800 text-white font-semibold py-3 px-6 rounded text-sm transition shadow-xs"
        >
          <span>Report a Ghost Net</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={scrollToHowItWorks}
          className="inline-flex items-center justify-center w-full sm:w-auto bg-white hover:bg-sky-50 text-sky-800 font-semibold py-3 px-6 rounded text-sm border border-sky-200 transition"
        >
          How It Works
        </button>
      </div>
    </div>
  );
};

export default Hero;
