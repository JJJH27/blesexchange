import React from 'react';
import { Translation } from '../types';
import { ExternalLink } from 'lucide-react';

interface UtilitySectionProps {
  t: Translation['utilitySection'];
}

const UtilitySection: React.FC<UtilitySectionProps> = ({ t }) => {
  return (
    <div className="pt-32 pb-24 relative overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">
          {t.title}
        </h2>

        {/* Content Container */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mb-24">
          
          {/* Text Content */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
               {/* Decorative Gradient */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

               <div className="space-y-6 text-lg text-gray-200 leading-relaxed font-light">
                 <p>{t.p1}</p>
                 <p>{t.p2}</p>
                 <p>{t.p3}</p>
                 <div className="p-4 bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                    <p className="font-medium text-blue-100">{t.p4}</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="flex-1 w-full order-1 lg:order-2 flex justify-center items-center">
             <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full group-hover:bg-blue-500/30 transition-colors duration-500"></div>
                <img 
                  src="./utilidad.png" 
                  alt="Utilidad Blessing" 
                  className="relative w-full max-w-md object-contain drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]"
                />
             </div>
          </div>
        </div>

        {/* Wallet Links Section */}
        <div className="mt-20">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              
              {/* Web Wallet */}
              <a 
                href="https://bleswallet.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-6 p-8 bg-gradient-to-b from-gray-900/60 to-black/60 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
              >
                 <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src="./bleswallet.png" alt="Bles Wallet" className="w-32 h-32 object-contain relative z-10" />
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{t.walletWeb}</span>
                    <ExternalLink size={20} className="text-gray-400 group-hover:text-blue-400" />
                 </div>
              </a>

              {/* Android Wallet */}
              <a 
                href="https://www.google.com/url?q=https%3A%2F%2Famaranth-gothic-carp-349.mypinata.cloud%2Fipfs%2Fbafybeid6pug6lzthwea2f2pbs36wfigruwo3pinxgitzsupkswghkbwvnq&sa=D&sntz=1&usg=AOvVaw0Mvwa53iIESeXgKqmi0kDH" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-6 p-8 bg-gradient-to-b from-gray-900/60 to-black/60 rounded-3xl border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]"
              >
                 <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src="./bleswallet.png" alt="Bles Wallet Android" className="w-32 h-32 object-contain relative z-10" />
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">{t.walletAndroid}</span>
                    <ExternalLink size={20} className="text-gray-400 group-hover:text-green-400" />
                 </div>
              </a>

           </div>
        </div>

      </div>
    </div>
  );
};

export default UtilitySection;