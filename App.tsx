import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Marketplace } from './components/Marketplace';
import { AdminDashboard } from './components/AdminDashboard';
import { AppView, Web3State } from './types';
import { connectWallet, getProvider, getContract } from './services/blockchain';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.MARKET);
  const [web3State, setWeb3State] = useState<Web3State>({
    account: null,
    chainId: null,
    isOwner: false,
  });

  const handleConnect = async () => {
    try {
      const { address, chainId } = await connectWallet();
      const provider = getProvider();
      
      let isOwner = false;
      if (provider) {
        const contract = getContract(provider);
        const ownerAddr = await contract.owner();
        isOwner = ownerAddr.toLowerCase() === address.toLowerCase();
      }

      setWeb3State({ account: address, chainId: chainId.toString(), isOwner });
    } catch (error) {
      console.error("Connection failed", error);
      alert("Failed to connect wallet: " + (error as any).message);
    }
  };

  useEffect(() => {
    // Attempt to reconnect if already authorized
    if (window.ethereum && window.ethereum.selectedAddress) {
      handleConnect();
    }
    
    // Listen for account changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', () => window.location.reload());
        window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  return (
    <div className="min-h-screen bg-primary text-gray-100 font-sans selection:bg-accent selection:text-white pb-20">
      <Navbar 
        web3State={web3State} 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        connect={handleConnect}
      />

      <main className="mt-8 px-4">
        {currentView === AppView.ADMIN ? (
           web3State.isOwner ? (
             <AdminDashboard account={web3State.account!} />
           ) : (
             <div className="text-center mt-20 text-gray-500">
               <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
               <p>Only the contract owner can access the admin panel.</p>
             </div>
           )
        ) : currentView === AppView.HISTORY ? (
            <Marketplace account={web3State.account} viewMode="HISTORY" />
        ) : (
            <Marketplace account={web3State.account} viewMode="ACTIVE" />
        )}
      </main>
    </div>
  );
}

export default App;
