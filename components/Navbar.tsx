import React from 'react';
import { AppView, Web3State } from '../types';
import { Wallet, LayoutDashboard, History, Settings, LogOut } from 'lucide-react';

interface NavbarProps {
  web3State: Web3State;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  connect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ web3State, currentView, setCurrentView, connect }) => {
  return (
    <nav className="bg-secondary border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-accent to-purple-600 p-2 rounded-lg">
                <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Blessing Exchange
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => setCurrentView(AppView.MARKET)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === AppView.MARKET ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                Active Orders
              </button>
              
              {web3State.account && (
                <button
                    onClick={() => setCurrentView(AppView.HISTORY)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === AppView.HISTORY ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                    Order History
                </button>
              )}

              {web3State.isOwner && (
                <button
                  onClick={() => setCurrentView(AppView.ADMIN)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === AppView.ADMIN ? 'bg-gold/20 text-gold' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                  <Settings className="w-4 h-4" /> Admin
                </button>
              )}
            </div>
          </div>

          <div>
            {!web3State.account ? (
              <button
                onClick={connect}
                className="flex items-center gap-2 bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20"
              >
                <Wallet className="w-4 h-4" /> Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="bg-gray-800 px-4 py-1.5 rounded-full border border-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-sm font-mono text-gray-300">
                        {web3State.account.slice(0, 6)}...{web3State.account.slice(-4)}
                    </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
