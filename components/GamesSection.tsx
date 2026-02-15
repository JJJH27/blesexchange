import React from 'react';
import { Translation } from '../types';
import { ExternalLink, CheckCircle } from 'lucide-react';

interface GamesSectionProps {
  t: Translation['gamesSection'];
}

const GamesSection: React.FC<GamesSectionProps> = ({ t }) => {
  return (
    <div className="pt-32 pb-24 relative overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-20 text-center">
          {t.title}
        </h2>

        {/* Section 1: Introduction */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-32">
          
          {/* Text */}
          <div className="flex-1 w-full order-2 lg:order-1">
             <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
                <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
                   {t.introText}
                </p>
             </div>
          </div>

          {/* Image */}
          <div className="flex-1 w-full order-1 lg:order-2 flex justify-center">
             <div className="relative group">
                <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full group-hover:bg-purple-500/30 transition-colors duration-500"></div>
                <img 
                  src="./blesjuego.png" 
                  alt="Blessing Games" 
                  className="relative w-full max-w-sm object-contain drop-shadow-2xl animate-[float_5s_ease-in-out_infinite]"
                />
             </div>
          </div>
        </div>

        {/* Section 2: Bles Pool Win */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
           
           {/* Image & Link (Left) */}
           <div className="flex-1 w-full flex justify-center lg:justify-end">
              <a 
                href="https://blespoolwin.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-6"
              >
                 <div className="relative p-6 bg-gradient-to-b from-gray-900/80 to-black/80 rounded-3xl border border-white/10 group-hover:border-green-400/50 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_0_40px_rgba(74,222,128,0.2)]">
                    <div className="absolute inset-0 bg-green-400/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img 
                      src="./blespoolwin.png" 
                      alt="Bles Pool Win" 
                      className="w-full max-w-xs object-contain relative z-10"
                    />
                 </div>
                 <div className="flex items-center gap-2 px-6 py-2 bg-white/5 rounded-full border border-white/10 group-hover:bg-green-500/10 group-hover:border-green-500/30 transition-all">
                    <span className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors tracking-wide">{t.poolLink}</span>
                    <ExternalLink size={20} className="text-gray-400 group-hover:text-green-400" />
                 </div>
              </a>
           </div>

           {/* Content (Right) */}
           <div className="flex-1 w-full">
              <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 blur-3xl rounded-full pointer-events-none"></div>
                 
                 <h3 className="text-3xl font-bold text-green-400 mb-6 border-b border-white/10 pb-4 inline-block">
                    {t.poolTitle}
                 </h3>
                 
                 <p className="text-lg text-white mb-8 leading-relaxed">
                    {t.poolDesc}
                 </p>

                 <ul className="space-y-4">
                    {[t.poolPoint1, t.poolPoint2, t.poolPoint3, t.poolPoint4].map((point, i) => (
                       <li key={i} className="flex gap-4 items-start group">
                          <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <p className="text-gray-300 text-base leading-relaxed">{point}</p>
                       </li>
                    ))}
                 </ul>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default GamesSection;