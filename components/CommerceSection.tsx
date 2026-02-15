import React from 'react';
import { Translation } from '../types';
import { ArrowRightLeft } from 'lucide-react';

interface CommerceProps {
  t: Translation['commerce'];
}

const CommerceSection: React.FC<CommerceProps> = ({ t }) => {
  return (
    <div id="exchange" className="py-24 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-block p-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-6 shadow-lg shadow-teal-500/30">
                <ArrowRightLeft className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.title}</h2>
            <p className="text-xl text-gray-300 mb-12">{t.subtitle}</p>

            {/* Exchange Image Visualization */}
            <div className="max-w-4xl mx-auto transform hover:scale-[1.01] transition duration-500">
                <a 
                  href="https://blesexchange.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                    <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group">
                        {/* Fallback image that looks like a crypto exchange */}
                        <img 
                            src="./blesexchange.png" 
                            alt="Blessing Exchange" 
                            className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-lg border border-white/20 group-hover:bg-black/70 transition-colors">
                                <span className="text-2xl font-bold text-white">Blessing Exchange</span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
  );
};

export default CommerceSection;