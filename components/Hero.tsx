import React from 'react';
import { Translation } from '../types';

interface HeroProps {
  t: Translation['hero'];
}

const Hero: React.FC<HeroProps> = ({ t }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 text-center z-10">
        
        {/* Logo Animation Container */}
        <div className="mb-8 relative inline-block group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <img 
            src="./Blessing.png" 
            alt="Blessing Token" 
            className="relative w-48 h-48 md:w-64 md:h-64 object-contain mx-auto animate-[float_6s_ease-in-out_infinite] drop-shadow-2xl"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          BLESSING
        </h1>
        
        <p className="text-xl md:text-2xl text-blue-300 font-medium mb-8 uppercase tracking-widest">
          {t.subtitle}
        </p>
        
        <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
            {t.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;