import React, { useState, useEffect } from 'react';
import { Translation } from '../types';
import { Copy, Database, Layers, Coins, Fingerprint, Plus, Check, Wallet, Users, Activity } from 'lucide-react';

interface TokenSectionProps {
  t: Translation['tokenSection'];
}

// Extend Window interface for Ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const TokenSection: React.FC<TokenSectionProps> = ({ t }) => {
  const contractAddress = "0x2830b5a25e70ABb6f82B3333f3DF4A88379Cc91a";
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ holders: number | null; transfers: number | null }>({
    holders: null,
    transfers: null
  });

  const fetchStats = async () => {
    try {
      const baseUrl = "https://0x4e4542e3.explorer.aurora-cloud.dev/api/v2/tokens";
      
      // Fetch both main token info and counters endpoint to ensure we get all data
      // Transfers are often located in the counters endpoint in Blockscout V2
      const [tokenRes, countersRes] = await Promise.all([
        fetch(`${baseUrl}/${contractAddress}`).catch(e => null),
        fetch(`${baseUrl}/${contractAddress}/counters`).catch(e => null)
      ]);

      let holdersCount = 0;
      let transfersCount = 0;

      // Process main token response
      if (tokenRes && tokenRes.ok) {
        const data = await tokenRes.json();
        holdersCount = parseInt(data.holders_count || '0');
        transfersCount = parseInt(data.transfers_count || '0');
      }

      // Process counters response (often more reliable for transfers)
      if (countersRes && countersRes.ok) {
        const data = await countersRes.json();
        const cTransfers = parseInt(data.transfers_count || '0');
        const cHolders = parseInt(data.token_holders_count || '0');
        
        // Use the larger number if available
        if (cTransfers > transfersCount) transfersCount = cTransfers;
        if (cHolders > holdersCount) holdersCount = cHolders;
      }

      setStats({
        holders: holdersCount,
        transfers: transfersCount
      });
    } catch (error) {
      console.error("Error fetching token stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    // Update every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const addNetworkToMetamask = async () => {
    if (!window.ethereum) {
      alert("MetaMask no está instalado / MetaMask is not installed");
      return;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x4e4542e3', // 1313161955 in hex
          chainName: 'TuxaChain',
          nativeCurrency: {
            name: 'WNEAR',
            symbol: 'WNEAR',
            decimals: 18
          },
          rpcUrls: ['https://0x4e4542e3.rpc.aurora-cloud.dev'],
          blockExplorerUrls: ['https://0x4e4542e3.explorer.aurora-cloud.dev/']
        }]
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addTokenToMetamask = async () => {
    if (!window.ethereum) {
      alert("MetaMask no está instalado / MetaMask is not installed");
      return;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: contractAddress,
            symbol: 'Bles',
            decimals: 18,
            image: window.location.origin + '/Blessing.png',
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="token" className="pt-32 pb-24 relative overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">
          {t.title}
        </h2>

        {/* Top Section: Properties & Images */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
          
          {/* Properties Card */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-blue-300 mb-8 border-b border-white/10 pb-4">
                {t.propsTitle}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Fingerprint className="w-5 h-5 text-blue-500" />
                    <span>{t.propName}:</span>
                  </div>
                  <span className="text-xl font-semibold text-white">Blessing</span>
                </div>

                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Coins className="w-5 h-5 text-purple-500" />
                    <span>{t.propSymbol}:</span>
                  </div>
                  <span className="text-xl font-semibold text-white">Bles</span>
                </div>

                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Layers className="w-5 h-5 text-green-500" />
                    <span>{t.propType}:</span>
                  </div>
                  <span className="text-xl font-semibold text-white uppercase">ERC20</span>
                </div>

                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Database className="w-5 h-5 text-yellow-500" />
                    <span>{t.propSupply}:</span>
                  </div>
                  <span className="text-xl font-semibold text-white">500,000,000</span>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-gray-400 mb-2 text-sm">{t.propContract}:</div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400 break-all font-mono tracking-tight selection:bg-blue-500/30">
                      {contractAddress}
                    </span>
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white flex items-center gap-2"
                      title={copied ? "Copied!" : "Copy Address"}
                    >
                      {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                      {copied && <span className="text-xs font-semibold text-green-400">Copiado!</span>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Images and Buttons */}
          <div className="flex-1 w-full order-1 lg:order-2 flex flex-row justify-center items-start gap-8 relative">
             <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
             
             {/* Blessing Token Column */}
             <div className="flex flex-col items-center gap-6 z-10 group">
                <img 
                  src="./Blessing.png" 
                  alt="Blessing Token" 
                  className="w-36 h-36 md:w-56 md:h-56 object-contain animate-[float_4s_ease-in-out_infinite] drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-transform duration-300 group-hover:scale-105"
                />
                <button 
                  onClick={addTokenToMetamask}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 rounded-full text-blue-300 hover:text-white transition-all duration-300 text-sm font-semibold backdrop-blur-md shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30"
                >
                  <Plus size={16} />
                  {t.addTokenBtn}
                </button>
             </div>

             {/* Tuxa Chain Column */}
             <div className="flex flex-col items-center gap-6 z-10 group mt-12 md:mt-0">
                <img 
                  src="./tuxa.png" 
                  alt="Tuxa Character" 
                  className="w-36 h-36 md:w-56 md:h-56 object-contain animate-[float_5s_ease-in-out_infinite] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-transform duration-300 group-hover:scale-105"
                  style={{ animationDelay: '1s' }}
                />
                <button 
                  onClick={addNetworkToMetamask}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 rounded-full text-purple-300 hover:text-white transition-all duration-300 text-sm font-semibold backdrop-blur-md shadow-lg shadow-purple-500/10 hover:shadow-purple-500/30"
                >
                  <Wallet size={16} />
                  {t.addNetworkBtn}
                </button>
             </div>
          </div>
        </div>

        {/* Explorer Link */}
        <div className="flex justify-center mb-12">
          <a 
            href="https://0x4e4542e3.explorer.aurora-cloud.dev/token/0x2830b5a25e70ABb6f82B3333f3DF4A88379Cc91a"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
          >
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20 group-hover:border-blue-400/50 group-hover:bg-white/15 transition-all shadow-lg">
              <img src="./explorer.png" alt="Explorer" className="h-16 w-auto object-contain" />
            </div>
            <span className="text-xl font-semibold text-blue-300 group-hover:text-blue-200 transition-colors uppercase tracking-widest">
              {t.explorerText}
            </span>
          </a>
        </div>

        {/* Live Statistics (Holders & Transfers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-24 px-4">
          {/* Holders */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-blue-500/30 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:border-blue-500/60 transition-colors shadow-lg">
             <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
             <div className="flex items-center gap-4 z-10">
               <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 group-hover:scale-110 transition-transform duration-500">
                  <Users size={28} />
               </div>
               <div>
                  <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">{t.holdersLabel}</div>
                  <div className="text-3xl font-bold text-white tracking-tight">
                    {stats.holders !== null ? stats.holders.toLocaleString() : <span className="animate-pulse">---</span>}
                  </div>
               </div>
             </div>
             {/* Decorative circle */}
             <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors"></div>
          </div>

          {/* Transfers */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-purple-500/30 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group hover:border-purple-500/60 transition-colors shadow-lg">
             <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
             <div className="flex items-center gap-4 z-10">
               <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 group-hover:scale-110 transition-transform duration-500">
                  <Activity size={28} />
               </div>
               <div>
                  <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">{t.transfersLabel}</div>
                  <div className="text-3xl font-bold text-white tracking-tight">
                    {stats.transfers !== null ? stats.transfers.toLocaleString() : <span className="animate-pulse">---</span>}
                  </div>
               </div>
             </div>
             {/* Decorative circle */}
             <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-colors"></div>
          </div>
        </div>

        {/* Tokenomics */}
        <div className="relative">
           <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
             {t.tokenomicsTitle}
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Liquidity */}
              <div className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 p-6 rounded-2xl border border-blue-500/30 hover:transform hover:-translate-y-2 transition-all duration-300">
                 <div className="flex justify-between items-end mb-4">
                    <span className="text-5xl font-bold text-cyan-300">50%</span>
                 </div>
                 <div className="h-2 w-full bg-black/40 rounded-full mb-4 overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[50%] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                 </div>
                 <p className="text-lg font-medium text-cyan-100">{t.tokLiquidity}</p>
              </div>

              {/* Card 2: Utility */}
              <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 p-6 rounded-2xl border border-purple-500/30 hover:transform hover:-translate-y-2 transition-all duration-300">
                 <div className="flex justify-between items-end mb-4">
                    <span className="text-5xl font-bold text-purple-300">30%</span>
                 </div>
                 <div className="h-2 w-full bg-black/40 rounded-full mb-4 overflow-hidden">
                    <div className="h-full bg-purple-400 w-[30%] shadow-[0_0_10px_rgba(192,132,252,0.5)]"></div>
                 </div>
                 <p className="text-lg font-medium text-purple-100">{t.tokUtility}</p>
              </div>

              {/* Card 3: Social */}
              <div className="bg-gradient-to-br from-pink-900/60 to-rose-900/60 p-6 rounded-2xl border border-pink-500/30 hover:transform hover:-translate-y-2 transition-all duration-300">
                 <div className="flex justify-between items-end mb-4">
                    <span className="text-5xl font-bold text-pink-300">15%</span>
                 </div>
                 <div className="h-2 w-full bg-black/40 rounded-full mb-4 overflow-hidden">
                    <div className="h-full bg-pink-400 w-[15%] shadow-[0_0_10px_rgba(244,114,182,0.5)]"></div>
                 </div>
                 <p className="text-lg font-medium text-pink-100">{t.tokSocial}</p>
              </div>

              {/* Card 4: Project */}
              <div className="bg-gradient-to-br from-yellow-900/60 to-orange-900/60 p-6 rounded-2xl border border-yellow-500/30 hover:transform hover:-translate-y-2 transition-all duration-300">
                 <div className="flex justify-between items-end mb-4">
                    <span className="text-5xl font-bold text-yellow-300">5%</span>
                 </div>
                 <div className="h-2 w-full bg-black/40 rounded-full mb-4 overflow-hidden">
                    <div className="h-full bg-yellow-400 w-[5%] shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                 </div>
                 <p className="text-lg font-medium text-yellow-100">{t.tokProject}</p>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};

export default TokenSection;