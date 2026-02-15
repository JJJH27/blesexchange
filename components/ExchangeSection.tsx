import React from 'react';
import { Translation } from '../types';

interface ExchangeSectionProps {
  t: Translation['exchangeSection'];
}

const ExchangeSection: React.FC<ExchangeSectionProps> = ({ t }) => {
  return (
    <div className="pt-32 pb-24 relative overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-20 text-center">
          {t.title}
        </h2>

        {/* Content Container */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
          
          {/* Text Content */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
               {/* Decorative Gradient */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-3xl rounded-full pointer-events-none"></div>

               <div className="space-y-6 text-lg text-gray-200 leading-relaxed font-light">
                 <p className="font-medium text-xl text-teal-300">{t.p1}</p>
                 <p>{t.p2}</p>
                 <div className="p-4 bg-teal-900/20 border-l-4 border-teal-500 rounded-r-lg">
                    <p className="text-gray-300 text-base">{t.p3}</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Side Image */}
          <div className="flex-1 w-full order-1 lg:order-2 flex justify-center items-center">
             <div className="relative group">
                <div className="absolute inset-0 bg-teal-500/20 blur-[50px] rounded-full group-hover:bg-teal-500/30 transition-colors duration-500"></div>
                <img 
                  src="./Exchange.png" 
                  alt="Blessing Exchange Dapp" 
                  className="relative w-full max-w-md object-contain drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]"
                />
             </div>
          </div>
        </div>

        {/* Bottom Image and Label */}
        <div className="flex flex-col items-center justify-center mt-12 gap-6">
            <a 
              href="https://blesexchange.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full max-w-4xl block"
            >
                <div className="relative group transform hover:scale-[1.02] transition-all duration-500">
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-black/50 backdrop-blur-sm p-2">
                        <img 
                          src="./blesexchange.png" 
                          alt="Blessing Exchange Interface" 
                          className="w-full h-auto object-cover rounded-xl"
                        />
                    </div>
                </div>
            </a>
            
            <a 
              href="https://blesexchange.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
                <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 cursor-pointer">
                    {t.imageLabel}
                </h3>
            </a>
        </div>

      </div>
    </div>
  );
};

export default ExchangeSection;