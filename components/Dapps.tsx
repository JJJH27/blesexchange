import React from 'react';
import { Translation } from '../types';
import { Layers, TrendingUp, CheckCircle2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

interface DappsProps {
  tStaking: Translation['staking'];
  tPrediction: Translation['prediction'];
}

const Dapps: React.FC<DappsProps> = ({ tStaking, tPrediction }) => {
  return (
    <div id="games" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Staking Section */}
        <div className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <Layers className="text-white w-8 h-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{tStaking.title}</h2>
                </div>
                <p className="text-lg text-blue-100">{tStaking.description}</p>
                
                <div className="bg-black/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-300 mb-4">{tStaking.featuresTitle}</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{tStaking.feature1}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{tStaking.feature2}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Animated Button */}
              <a 
                href="https://blessingstaking.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-full text-white font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:scale-105 group"
              >
                {tStaking.ctaButton}
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
            
            {/* Visual representation for staking */}
            <div className="flex-1 flex justify-center">
               <div className="relative w-64 h-64 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-400/30 animate-pulse">
                  <div className="w-48 h-48 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/50">
                     <div className="text-4xl font-bold text-blue-200">BLES</div>
                  </div>
                  {/* Floating nodes */}
                  <div className="absolute top-0 left-1/2 w-8 h-8 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                  <div className="absolute bottom-10 right-0 w-6 h-6 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                  <div className="absolute bottom-10 left-0 w-10 h-10 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Prediction Market Section */}
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-purple-500/20 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 relative z-10">
            <div className="flex-1 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500 rounded-lg">
                    <TrendingUp className="text-white w-8 h-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">{tPrediction.title}</h2>
                </div>
                <p className="text-lg text-purple-100">{tPrediction.description}</p>
                
                <div className="bg-black/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-purple-300 mb-4">{tPrediction.featuresTitle}</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{tPrediction.feature1}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{tPrediction.feature2}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{tPrediction.feature3}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Animated Button */}
              <a 
                href="https://blessingmarketpre.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 rounded-full text-white font-bold text-lg shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-300 transform hover:scale-105 group"
              >
                {tPrediction.ctaButton}
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
            
            {/* Visual representation for prediction */}
             <div className="flex-1 flex justify-center">
                 <div className="bg-black/40 p-6 rounded-xl border border-white/10 w-full max-w-sm relative">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-sm text-gray-400">BLES/USDT Prediction</div>
                        <div className="flex items-center gap-1">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-xs text-green-400">LIVE</span>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="h-48 relative flex items-end justify-between gap-3 pb-2">
                      {/* Grid lines */}
                      <div className="absolute inset-0 grid grid-rows-4 w-full h-full pointer-events-none opacity-10 z-0">
                         <div className="border-t border-white border-dashed"></div>
                         <div className="border-t border-white border-dashed"></div>
                         <div className="border-t border-white border-dashed"></div>
                         <div className="border-t border-white border-dashed"></div>
                      </div>

                      {/* Candles Container */}
                      <div className="flex items-end justify-between w-2/3 h-full z-10 pr-2 border-r border-white/10 border-dashed">
                           {/* Candle 1: Green */}
                          <div className="relative w-full mx-1 h-full">
                             <div className="absolute bottom-[20%] h-[20%] w-full bg-green-500 rounded-[1px]"></div>
                             <div className="absolute bottom-[15%] h-[30%] w-[1px] left-1/2 -translate-x-1/2 bg-green-500/50"></div>
                          </div>
                          {/* Candle 2: Red */}
                          <div className="relative w-full mx-1 h-full">
                             <div className="absolute bottom-[35%] h-[15%] w-full bg-red-500 rounded-[1px]"></div>
                             <div className="absolute bottom-[32%] h-[25%] w-[1px] left-1/2 -translate-x-1/2 bg-red-500/50"></div>
                          </div>
                          {/* Candle 3: Green */}
                          <div className="relative w-full mx-1 h-full">
                             <div className="absolute bottom-[30%] h-[25%] w-full bg-green-500 rounded-[1px]"></div>
                             <div className="absolute bottom-[25%] h-[35%] w-[1px] left-1/2 -translate-x-1/2 bg-green-500/50"></div>
                          </div>
                          {/* Candle 4: Green */}
                          <div className="relative w-full mx-1 h-full">
                             <div className="absolute bottom-[50%] h-[15%] w-full bg-green-500 rounded-[1px]"></div>
                             <div className="absolute bottom-[48%] h-[22%] w-[1px] left-1/2 -translate-x-1/2 bg-green-500/50"></div>
                          </div>
                          {/* Candle 5: Red */}
                          <div className="relative w-full mx-1 h-full">
                             <div className="absolute bottom-[60%] h-[10%] w-full bg-red-500 rounded-[1px]"></div>
                             <div className="absolute bottom-[58%] h-[18%] w-[1px] left-1/2 -translate-x-1/2 bg-red-500/50"></div>
                          </div>
                      </div>

                      {/* Prediction Arrows */}
                      <div className="flex-1 h-full flex flex-col items-center justify-center relative z-10 pl-2">
                           <div className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                                <ArrowUp className="w-8 h-8 text-green-500 filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-bounce" style={{ animationDuration: '2s' }} />
                                <span className="text-5xl font-bold text-white my-2 drop-shadow-md">?</span>
                                <ArrowDown className="w-8 h-8 text-red-500 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-bounce" style={{ animationDuration: '2s', animationDelay: '1s' }} />
                           </div>
                      </div>
                    </div>
                 </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dapps;