import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, EXCHANGE_ABI, ERC20_ABI, TUXA_CHAIN } from '../constants';
import { Order, TokenInfo } from '../types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

export const getContract = (provider: ethers.providers.Web3Provider | ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, EXCHANGE_ABI, provider);
};

export const getTokenContract = (address: string, provider: ethers.providers.Web3Provider | ethers.Signer) => {
  return new ethers.Contract(address, ERC20_ABI, provider);
};

export const connectWallet = async () => {
  if (!window.ethereum) throw new Error("No crypto wallet found");
  
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  
  const provider = getProvider();
  if (!provider) throw new Error("Provider initialization failed");
  
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  
  // Ethers v5 network.chainId is a number
  if (network.chainId !== parseInt(TUXA_CHAIN.chainId, 16)) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TUXA_CHAIN.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [TUXA_CHAIN],
        });
      } else {
        throw switchError;
      }
    }
  }

  return { address, provider, chainId: network.chainId.toString() };
};

export const fetchOrders = async (activeOnly: boolean, userAddress?: string): Promise<Order[]> => {
  const provider = getProvider();
  if (!provider) return [];
  const contract = getContract(provider);
  
  let rawOrders: any[] = [];
  
  try {
    if (userAddress) {
        rawOrders = await contract.getUserOrders(userAddress);
    } else {
        rawOrders = await contract.getActiveOrders();
    }
  } catch (e) {
      console.error("Failed to fetch orders", e);
      return [];
  }

  return rawOrders.map((o: any) => ({
    id: o.id.toString(),
    user: o.user,
    isBuy: o.isBuy,
    pairId: o.pairId,
    amount: o.amount.toString(),
    price: o.price.toString(),
    active: o.active
  })).filter(o => activeOnly ? o.active : true);
};

export const getTokenInfo = async (address: string, provider: ethers.providers.Web3Provider): Promise<TokenInfo> => {
    if(address === ethers.constants.AddressZero) return { address, symbol: '???', decimals: 18 };
    try {
        const contract = getTokenContract(address, provider);
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        return { address, symbol, decimals };
    } catch (e) {
        console.error("Error fetching token info for", address, e);
        return { address, symbol: 'UNK', decimals: 18 };
    }
}

export const getTokenBalance = async (address: string, user: string, provider: ethers.providers.Web3Provider): Promise<string> => {
    try {
        const contract = getTokenContract(address, provider);
        const bal = await contract.balanceOf(user);
        const dec = await contract.decimals();
        return ethers.utils.formatUnits(bal, dec);
    } catch(e) {
        return "0";
    }
}

export interface ChartTrade {
    timestamp: number;
    price: number;
}

export const fetchChartHistory = async (pairId: number): Promise<ChartTrade[]> => {
    const provider = getProvider();
    if (!provider) return [];
    const contract = getContract(provider);
    
    try {
        // Fetch OrderFilled events
        const filter = contract.filters.OrderFilled();
        // Limit query to last 5000 blocks to avoid RPC timeout on heavy chains, 
        // or from block 0 if chain is light. TuxaChain is relatively new/light, but safe to limit or paginate.
        // For this demo, we try getting as much as possible.
        const events = await contract.queryFilter(filter);
        
        const trades: ChartTrade[] = [];
        const iface = new ethers.utils.Interface(EXCHANGE_ABI);

        // Process events to find those matching pairId
        // Since OrderFilled doesn't have pairId in event args, we must check transaction input
        // This is resource intensive, so in production a subgraph is better. 
        // We will process recent events.
        
        for (const evt of events) {
            try {
                // We need the block timestamp
                const block = await evt.getBlock();
                const tx = await evt.getTransaction();
                
                // Decode transaction input to see if it was called on this pair
                const decoded = iface.parseTransaction({ data: tx.data });
                
                // Methods that emit OrderFilled: fillBuyOrder or fillSellOrder
                // Both have pairId as first argument
                if (decoded && decoded.args && decoded.args[0] === pairId) {
                    const priceWei = evt.args!.price;
                    const price = parseFloat(ethers.utils.formatUnits(priceWei, 18));
                    trades.push({
                        timestamp: block.timestamp * 1000, // JS uses ms
                        price: price
                    });
                }
            } catch (err) {
                // If tx decoding fails or other issue, skip
                continue;
            }
        }
        
        return trades.sort((a, b) => a.timestamp - b.timestamp);
    } catch (e) {
        console.error("Error fetching chart history", e);
        return [];
    }
}
