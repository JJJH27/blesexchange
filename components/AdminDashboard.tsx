import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract, getProvider } from '../services/blockchain';
import { Shield, Save, Download, AlertTriangle, AlertCircle } from 'lucide-react';

interface AdminDashboardProps {
  account: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ account }) => {
  const [fees, setFees] = useState({ buy: '0', sell: '0' });
  const [tokens, setTokens] = useState({ a: '', b: '', c: '', d: '' });
  const [rescue, setRescue] = useState({ token: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchConfig = async () => {
    try {
        const provider = getProvider();
        if(!provider) return;
        const contract = getContract(provider);
        const [buy, sell, ta, tb, tc, td] = await Promise.all([
            contract.buyFeeBP(),
            contract.sellFeeBP(),
            contract.tokenA(),
            contract.tokenB(),
            contract.tokenC(),
            contract.tokenD()
        ]);

        setFees({ buy: buy.toString(), sell: sell.toString() });
        setTokens({ a: ta, b: tb, c: tc, d: td });
    } catch (e) {
        console.error(e);
    }
  };

  const updateFees = async () => {
    if(!fees.buy || !fees.sell) return;
    try {
        setLoading(true);
        const provider = getProvider();
        const signer = provider.getSigner();
        const contract = getContract(signer);
        const tx = await contract.setFees(fees.buy, fees.sell);
        await tx.wait();
        setMsg({ type: 'success', text: 'Fees updated successfully!' });
    } catch (e: any) {
        setMsg({ type: 'error', text: e.message || "Failed to update fees" });
    } finally {
        setLoading(false);
    }
  };

  const configureTokens = async () => {
    try {
        setLoading(true);
        const provider = getProvider();
        const signer = provider.getSigner();
        const contract = getContract(signer);
        const tx = await contract.configureTokens(tokens.a, tokens.b, tokens.c, tokens.d);
        await tx.wait();
        setMsg({ type: 'success', text: 'Tokens configured successfully!' });
    } catch (e: any) {
        setMsg({ type: 'error', text: e.message || "Failed to configure tokens" });
    } finally {
        setLoading(false);
    }
  };

  const withdrawAll = async () => {
    try {
        setLoading(true);
        const provider = getProvider();
        const signer = provider.getSigner();
        const contract = getContract(signer);
        const tx = await contract.withdrawAll();
        await tx.wait();
        setMsg({ type: 'success', text: 'All funds withdrawn to owner wallet.' });
    } catch (e: any) {
        setMsg({ type: 'error', text: e.message || "Withdraw failed" });
    } finally {
        setLoading(false);
    }
  };

  const handleRescue = async () => {
      if(!rescue.token || !rescue.amount) return;
      try {
          setLoading(true);
          const provider = getProvider();
          const signer = provider.getSigner();
          const contract = getContract(signer);
          // Ethers v5 syntax for parsing units
          const amountWei = ethers.utils.parseUnits(rescue.amount, 18);
          const tx = await contract.rescueERC20(rescue.token, amountWei);
          await tx.wait();
          setMsg({ type: 'success', text: 'Tokens rescued successfully!' });
      } catch (e: any) {
          setMsg({ type: 'error', text: e.message || "Rescue failed" });
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-r from-gold/10 to-transparent border border-gold/30 p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-gold flex items-center gap-2 mb-2">
                <Shield className="w-6 h-6" /> Admin Control Panel
            </h2>
            <p className="text-gray-400">Manage fees, tokens, and contract funds securely.</p>
        </div>

        {msg && (
            <div className={`p-4 rounded-xl ${msg.type === 'success' ? 'bg-success/20 text-success border border-success/30' : 'bg-danger/20 text-danger border border-danger/30'}`}>
                {msg.text}
            </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
            {/* Fee Management */}
            <div className="bg-secondary p-6 rounded-2xl border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white">Fee Management (Basis Points)</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Buy Fee (0-100)</label>
                        <input 
                            type="number" 
                            value={fees.buy} 
                            onChange={(e) => setFees({...fees, buy: e.target.value})}
                            className="w-full bg-primary border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-accent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Sell Fee (0-100)</label>
                        <input 
                            type="number" 
                            value={fees.sell} 
                            onChange={(e) => setFees({...fees, sell: e.target.value})}
                            className="w-full bg-primary border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-accent outline-none"
                        />
                    </div>
                    <button 
                        onClick={updateFees}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-blue-600 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                        <Save className="w-4 h-4" /> Update Fees
                    </button>
                </div>
            </div>

            {/* Withdraw */}
            <div className="bg-secondary p-6 rounded-2xl border border-gray-700 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">Emergency & Withdrawals</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Withdraw all collected fees and tokens held in the contract address to the owner's wallet.
                    </p>
                </div>
                <button 
                    onClick={withdrawAll}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors shadow-lg shadow-red-900/20"
                >
                    <Download className="w-4 h-4" /> Withdraw All Assets
                </button>
            </div>
        </div>

        {/* Rescue Tokens */}
        <div className="bg-secondary p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-blue-400 w-5 h-5" />
                <h3 className="text-lg font-semibold text-white">Rescue Stuck Tokens</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Send any ERC20 token currently in the contract to the owner address.</p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input 
                    placeholder="Token Address to Rescue" 
                    value={rescue.token}
                    onChange={(e) => setRescue({...rescue, token: e.target.value})}
                    className="w-full bg-primary border border-gray-600 rounded-lg p-2 text-white text-sm"
                />
                <input 
                    type="number"
                    placeholder="Amount (e.g. 10.5)" 
                    value={rescue.amount}
                    onChange={(e) => setRescue({...rescue, amount: e.target.value})}
                    className="w-full bg-primary border border-gray-600 rounded-lg p-2 text-white text-sm"
                />
            </div>
             <button 
                onClick={handleRescue}
                disabled={loading}
                className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
                <Save className="w-4 h-4" /> Rescue Token
            </button>
        </div>

        {/* Token Configuration */}
        <div className="bg-secondary p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="text-gold w-5 h-5" />
                <h3 className="text-lg font-semibold text-white">Pair Configuration</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                    <span className="text-xs text-accent uppercase font-bold tracking-wider mb-2 block">Pair 0 (Base/Quote)</span>
                    <input 
                        placeholder="Token A Address" 
                        value={tokens.a}
                        onChange={(e) => setTokens({...tokens, a: e.target.value})}
                        className="w-full bg-primary border border-gray-600 rounded-lg p-2 text-white text-sm mb-2"
                    />
                    <input 
                        placeholder="Token B Address" 
                        value={tokens.b}
                        onChange={(e) => setTokens({...tokens, b: e.target.value})}
                        className="w-full bg-primary border border-gray-600 rounded-lg p-2 text-white text-sm"
                    />
                </div>
                <div>
                    <span className="text-xs text-accent uppercase font-bold tracking-wider mb-2 block">Pair 1 (Base/Quote)</span>
                    <input 
                        placeholder="Token C Address" 
                        value={tokens.c}
                        onChange={(e) => setTokens({...tokens, c: e.target.value})}
                        className="w-full bg-primary border border-gray-600 rounded-lg p-2 text-white text-sm mb-2"
                    />
                    <input 
                        placeholder="Token D Address" 
                        value={tokens.d}
                        onChange={(e) => setTokens({...tokens, d: e.target.value})}
                        className="w-full bg-primary border border-gray-600 rounded-lg p-2 text-white text-sm"
                    />
                </div>
            </div>
            <button 
                onClick={configureTokens}
                disabled={loading}
                className="ml-auto flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
                <Save className="w-4 h-4" /> Save Token Config
            </button>
        </div>
    </div>
  );
};
