import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getContract, getProvider, getTokenContract, fetchOrders, getTokenInfo, getTokenBalance, fetchChartHistory, ChartTrade } from '../services/blockchain';
import { Order, TokenInfo } from '../types';
import { Wallet, Trash2 } from 'lucide-react';
import { CONTRACT_ADDRESS, EXCHANGE_ABI } from '../constants';
import Chart from 'react-apexcharts';

interface MarketplaceProps {
    account: string | null;
    viewMode: 'ACTIVE' | 'HISTORY';
}

// Helper interface for aggregated orders in the UI
interface AggregatedOrder {
    price: string; // Price in 18 decimals string
    totalAmount: string; // Total amount in 18 decimals string
    orders: Order[]; // The underlying orders at this price
}

interface TradeHistoryItem {
    id: string;
    price: string;
    amount: string;
    isBuyerMaker: boolean; // If true, the trade was initiated by a sell (hitting a buy order) -> Red
    timestamp: number;
    pairId: number;
}

const TIMEFRAMES = [
    { label: '1m', value: 60 * 1000 },
    { label: '5m', value: 5 * 60 * 1000 },
    { label: '15m', value: 15 * 60 * 1000 },
    { label: '1H', value: 60 * 60 * 1000 },
    { label: '4H', value: 4 * 60 * 60 * 1000 },
    { label: '1D', value: 24 * 60 * 60 * 1000 },
    { label: '1M', value: 30 * 24 * 60 * 60 * 1000 },
    { label: '1Y', value: 365 * 24 * 60 * 60 * 1000 },
    { label: 'Max', value: 0 }
];

export const Marketplace: React.FC<MarketplaceProps> = ({ account, viewMode }) => {
    // Raw orders from blockchain
    const [rawOrders, setRawOrders] = useState<Order[]>([]);
    
    // UI State
    const [loading, setLoading] = useState(false);
    const [tokens, setTokens] = useState<{[key: string]: TokenInfo}>({});
    const [pairAddresses, setPairAddresses] = useState<string[]>([]);
    const [balances, setBalances] = useState<{[key: string]: string}>({});
    
    // Market State
    const [selectedPairId, setSelectedPairId] = useState(0);

    // Trade Form State
    const [isBuyTab, setIsBuyTab] = useState(true);
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Aggregated Order Book
    const [aggBids, setAggBids] = useState<AggregatedOrder[]>([]);
    const [aggAsks, setAggAsks] = useState<AggregatedOrder[]>([]);

    // Market History State
    const [recentTrades, setRecentTrades] = useState<TradeHistoryItem[]>([]);
    const [tradeHistoryLimit, setTradeHistoryLimit] = useState(10);

    // Chart State
    const [chartData, setChartData] = useState<any[]>([]);
    const [selectedTimeframe, setSelectedTimeframe] = useState(TIMEFRAMES[1]); // Default 5m

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const provider = getProvider();
            if(!provider) return;
            const contract = getContract(provider);
            
            // 1. Get Tokens
            const [ta, tb, tc, td] = await Promise.all([
                contract.tokenA(), contract.tokenB(), contract.tokenC(), contract.tokenD()
            ]);
            
            setPairAddresses([ta, tb, tc, td]);

            // 2. Get Info
            const tokenInfos = await Promise.all([
                getTokenInfo(ta, provider),
                getTokenInfo(tb, provider),
                getTokenInfo(tc, provider),
                getTokenInfo(td, provider)
            ]);

            const tokenMap: any = {};
            [ta, tb, tc, td].forEach((addr, i) => {
                tokenMap[addr.toLowerCase()] = tokenInfos[i];
            });
            setTokens(tokenMap);

            // 3. Get Balances if connected
            if (account) {
                const bals = await Promise.all([
                    getTokenBalance(ta, account, provider),
                    getTokenBalance(tb, account, provider),
                    getTokenBalance(tc, account, provider),
                    getTokenBalance(td, account, provider),
                ]);
                const balMap: any = {};
                [ta, tb, tc, td].forEach((addr, i) => {
                    balMap[addr.toLowerCase()] = bals[i];
                });
                setBalances(balMap);
            }

            // 4. Get Orders
            const allOrders = await fetchOrders(viewMode === 'ACTIVE', viewMode === 'HISTORY' ? account! : undefined);
            
            // Filter by selected pair
            const pairOrders = allOrders.filter(o => o.pairId === selectedPairId);
            setRawOrders(pairOrders.reverse()); // Keep raw orders for history and matching

            // 5. Aggregate Orders for Book (Only Active)
            if (viewMode === 'ACTIVE') {
                const activeOrders = pairOrders.filter(o => o.active);
                const bids = activeOrders.filter(o => o.isBuy);
                const asks = activeOrders.filter(o => !o.isBuy);

                setAggBids(aggregateOrders(bids, true));
                setAggAsks(aggregateOrders(asks, false));
            }

            // 6. Fetch Chart & Trade History Data
            // Note: This is resource intensive, in a real app would use Indexer
            const history = await fetchChartHistory(selectedPairId);
            processChartData(history, selectedTimeframe);
            
            // Simplified Recent Trades (derived from chart history for demo speed, or fetch events separately)
            // Ideally we process the same events
            const processedTrades: TradeHistoryItem[] = history.map((h, i) => ({
                id: i.toString(),
                price: h.price.toString(),
                amount: '0', // Chart history optimized to not carry amount, can enhance if needed
                timestamp: h.timestamp,
                isBuyerMaker: Math.random() > 0.5, // Mock direction for history list as event doesn't have it easily without heavy tx parsing
                pairId: selectedPairId
            })).reverse();
            setRecentTrades(processedTrades);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [account, viewMode, selectedPairId, selectedTimeframe]);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 10000); 
        return () => clearInterval(interval);
    }, [loadData]);

    const processChartData = (trades: ChartTrade[], timeframe: { value: number }) => {
        if (trades.length === 0) {
            setChartData([]);
            return;
        }

        const candles: { x: number, y: number[] }[] = [];
        
        // If Max, just bucket by 1 day or fit to width, here we default to 1D for Max for readability
        const interval = timeframe.value === 0 ? 24 * 60 * 60 * 1000 : timeframe.value;

        // Start time of first bucket
        let currentBucketStart = Math.floor(trades[0].timestamp / interval) * interval;
        let open = trades[0].price;
        let high = trades[0].price;
        let low = trades[0].price;
        let close = trades[0].price;

        // Iterate trades
        for (let i = 0; i < trades.length; i++) {
            const t = trades[i];
            
            if (t.timestamp < currentBucketStart + interval) {
                // Inside current bucket
                high = Math.max(high, t.price);
                low = Math.min(low, t.price);
                close = t.price;
            } else {
                // Close current bucket
                candles.push({
                    x: currentBucketStart,
                    y: [open, high, low, close]
                });

                // Start new bucket
                // Fill gaps if needed? For simplicity, we just jump to next trade
                currentBucketStart = Math.floor(t.timestamp / interval) * interval;
                open = close; // Open is previous close for continuity or t.price? Crypto usually continuous.
                // If there was a gap, Open = Previous Close
                open = close; 
                high = Math.max(open, t.price);
                low = Math.min(open, t.price);
                close = t.price;
            }
        }
        
        // Push last
        candles.push({
            x: currentBucketStart,
            y: [open, high, low, close]
        });

        setChartData([{ data: candles }]);
    };

    // Group orders by price
    const aggregateOrders = (orders: Order[], isBid: boolean): AggregatedOrder[] => {
        const map = new Map<string, Order[]>();
        
        orders.forEach(o => {
            if (!map.has(o.price)) {
                map.set(o.price, []);
            }
            map.get(o.price)!.push(o);
        });

        const aggregated: AggregatedOrder[] = [];
        map.forEach((orderList, price) => {
            const totalBn = orderList.reduce((acc, curr) => acc.add(ethers.BigNumber.from(curr.amount)), ethers.BigNumber.from(0));
            aggregated.push({
                price: price,
                totalAmount: totalBn.toString(),
                orders: orderList // Keep track of individual orders for matching logic order (FIFO)
            });
        });

        // Sort
        return aggregated.sort((a, b) => {
            const pa = ethers.BigNumber.from(a.price);
            const pb = ethers.BigNumber.from(b.price);
            // Bids: High to Low (Desc)
            if (isBid) return pa.gt(pb) ? -1 : 1;
            // Asks: Low to High (Asc)
            return pa.gt(pb) ? 1 : -1;
        });
    };

    const getCurrentPairInfo = () => {
        if(pairAddresses.length < 4) return { base: '...', quote: '...', baseAddr: '', quoteAddr: '' };
        const baseAddr = selectedPairId === 0 ? pairAddresses[0] : pairAddresses[2];
        const quoteAddr = selectedPairId === 0 ? pairAddresses[1] : pairAddresses[3];
        const base = tokens[baseAddr?.toLowerCase()]?.symbol || '...';
        const quote = tokens[quoteAddr?.toLowerCase()]?.symbol || '...';
        return { base, quote, baseAddr, quoteAddr };
    };

    // --- INTERACTION HANDLERS ---

    const handleOrderClick = (aggOrder: AggregatedOrder, isSideBid: boolean) => {
        const fmtPrice = ethers.utils.formatUnits(aggOrder.price, 18);
        const fmtAmount = ethers.utils.formatUnits(aggOrder.totalAmount, 18);
        setPrice(fmtPrice);
        setAmount(fmtAmount);
        setIsBuyTab(!isSideBid); 
    };

    const handleTradeAction = async () => {
        if (!account || !amount || !price) return;
        const priceVal = parseFloat(price);
        const amountVal = parseFloat(amount);
        if (isNaN(priceVal) || priceVal <= 0 || isNaN(amountVal) || amountVal <= 0) {
            alert("Invalid price or amount");
            return;
        }

        setActionLoading(true);
        try {
            const provider = getProvider();
            const signer = provider!.getSigner();
            const contract = getContract(signer);
            const { baseAddr, quoteAddr } = getCurrentPairInfo();
            const baseInfo = tokens[baseAddr!.toLowerCase()];

            const inputPriceWei = ethers.utils.parseUnits(price, 18);
            const inputAmountWei = ethers.utils.parseUnits(amount, baseInfo.decimals);

            let matchFound = false;
            let orderToFill: Order | null = null;
            let fillAmountWei = inputAmountWei;

            if (isBuyTab) {
                const activeAsks = rawOrders
                    .filter(o => o.active && !o.isBuy && o.pairId === selectedPairId)
                    .sort((a, b) => {
                        const pa = ethers.BigNumber.from(a.price);
                        const pb = ethers.BigNumber.from(b.price);
                        if (!pa.eq(pb)) return pa.gt(pb) ? 1 : -1;
                        return ethers.BigNumber.from(a.id).gt(ethers.BigNumber.from(b.id)) ? 1 : -1;
                    });

                if (activeAsks.length > 0) {
                    const bestAsk = activeAsks[0];
                    if (inputPriceWei.gte(ethers.BigNumber.from(bestAsk.price))) {
                        matchFound = true;
                        orderToFill = bestAsk;
                        const available = ethers.BigNumber.from(bestAsk.amount);
                        if (available.lt(fillAmountWei)) fillAmountWei = available;
                    }
                }
            } else {
                const activeBids = rawOrders
                    .filter(o => o.active && o.isBuy && o.pairId === selectedPairId)
                    .sort((a, b) => {
                        const pa = ethers.BigNumber.from(a.price);
                        const pb = ethers.BigNumber.from(b.price);
                        if (!pa.eq(pb)) return pa.gt(pb) ? -1 : 1;
                        return ethers.BigNumber.from(a.id).gt(ethers.BigNumber.from(b.id)) ? 1 : -1;
                    });

                if (activeBids.length > 0) {
                    const bestBid = activeBids[0];
                    if (inputPriceWei.lte(ethers.BigNumber.from(bestBid.price))) {
                        matchFound = true;
                        orderToFill = bestBid;
                         const available = ethers.BigNumber.from(bestBid.amount);
                         if (available.lt(fillAmountWei)) fillAmountWei = available;
                    }
                }
            }

            let tokenToApprove, approvalAmount;
            
            if (matchFound && orderToFill) {
                console.log("Matching Order found:", orderToFill.id);
                if (isBuyTab) {
                    const cost = fillAmountWei.mul(ethers.BigNumber.from(orderToFill.price)).div(ethers.constants.WeiPerEther);
                    tokenToApprove = quoteAddr;
                    approvalAmount = cost;
                } else {
                    tokenToApprove = baseAddr;
                    approvalAmount = fillAmountWei;
                }
            } else {
                console.log("No match, creating order.");
                if (isBuyTab) {
                    const cost = inputAmountWei.mul(inputPriceWei).div(ethers.constants.WeiPerEther);
                    tokenToApprove = quoteAddr;
                    approvalAmount = cost;
                } else {
                    tokenToApprove = baseAddr;
                    approvalAmount = inputAmountWei;
                }
            }

            const tokenContract = getTokenContract(tokenToApprove!, signer);
            const allowance = await tokenContract.allowance(account, CONTRACT_ADDRESS);

            if (allowance.lt(approvalAmount)) {
                const txApp = await tokenContract.approve(CONTRACT_ADDRESS, ethers.constants.MaxUint256);
                await txApp.wait();
            }

            let tx;
            if (matchFound && orderToFill) {
                if (isBuyTab) tx = await contract.fillSellOrder(selectedPairId, orderToFill.id, fillAmountWei);
                else tx = await contract.fillBuyOrder(selectedPairId, orderToFill.id, fillAmountWei);
            } else {
                if (isBuyTab) tx = await contract.createBuyOrder(selectedPairId, inputAmountWei, inputPriceWei);
                else tx = await contract.createSellOrder(selectedPairId, inputAmountWei, inputPriceWei);
            }

            await tx.wait();
            loadData();
            setAmount(''); 

        } catch (e: any) {
            console.error(e);
            alert("Transaction failed: " + (e.reason || e.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async (orderId: string) => {
        if (!confirm("Cancel this order?")) return;
        setActionLoading(true);
        try {
            const provider = getProvider();
            const signer = provider!.getSigner();
            const contract = getContract(signer);
            const tx = await contract.cancelMyOrder(selectedPairId, orderId);
            await tx.wait();
            loadData();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setActionLoading(false);
        }
    };

    const { base, quote, baseAddr, quoteAddr } = getCurrentPairInfo();
    
    let currentBalance = "0";
    if (baseAddr && quoteAddr && balances) {
        currentBalance = isBuyTab ? (balances[quoteAddr.toLowerCase()] || "0") : (balances[baseAddr.toLowerCase()] || "0");
    }

    const chartOptions = {
        chart: {
            type: 'candlestick',
            height: 350,
            background: 'transparent',
            toolbar: { show: false },
            animations: { enabled: false }
        },
        theme: { mode: 'dark' },
        xaxis: {
            type: 'datetime',
            tooltip: { enabled: false },
            axisBorder: { color: '#334155' },
            axisTicks: { color: '#334155' }
        },
        yaxis: {
            tooltip: { enabled: true },
            opposite: true,
            labels: {
                formatter: (value: number) => value.toFixed(4)
            }
        },
        grid: {
            borderColor: '#334155',
            strokeDashArray: 3
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#10b981',
                    downward: '#ef4444'
                }
            }
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto p-4 text-sm">
            {/* Header / Pair Selector */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 bg-secondary p-4 rounded-xl border border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white">{base} / {quote}</span>
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">Spot</span>
                    </div>
                    <select 
                        value={selectedPairId} 
                        onChange={(e) => setSelectedPairId(Number(e.target.value))}
                        className="bg-primary border border-gray-600 text-white text-sm rounded-lg focus:ring-accent focus:border-accent block p-2"
                    >
                        <option value={0}>Pair 0 (A/B)</option>
                        <option value={1}>Pair 1 (C/D)</option>
                    </select>
                </div>
                <div className="flex gap-4 text-gray-400 text-xs md:text-sm">
                    <div className="flex flex-col">
                        <span>Last Price</span>
                        <span className={`font-bold ${aggBids[0] ? 'text-success' : 'text-gray-200'}`}>
                             {aggBids[0] ? Number(ethers.utils.formatUnits(aggBids[0].price, 18)).toFixed(4) : (aggAsks[0] ? Number(ethers.utils.formatUnits(aggAsks[0].price, 18)).toFixed(4) : '--')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-180px)]">
                
                {/* LEFT COL: Order Book & Market Trades */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                     {/* Order Book (60% height) */}
                     <div className="bg-secondary rounded-xl border border-gray-700 flex flex-col overflow-hidden h-3/5">
                        <div className="p-3 border-b border-gray-700 font-bold text-gray-300 flex justify-between">
                            <span>Order Book</span>
                        </div>
                        <div className="grid grid-cols-3 px-3 py-2 text-xs text-gray-500 font-medium">
                            <div className="text-left">Price ({quote})</div>
                            <div className="text-right">Amount ({base})</div>
                            <div className="text-right">Total</div>
                        </div>
                        <div className="flex-1 overflow-y-auto flex flex-col-reverse custom-scrollbar">
                            {aggAsks.map((agg, idx) => {
                                const formattedPrice = ethers.utils.formatUnits(agg.price, 18);
                                const formattedAmount = ethers.utils.formatUnits(agg.totalAmount, 18);
                                const total = parseFloat(formattedPrice) * parseFloat(formattedAmount);
                                return (
                                    <div key={`ask-${idx}`} className="grid grid-cols-3 px-3 py-1 hover:bg-gray-800 cursor-pointer text-xs relative group" onClick={() => handleOrderClick(agg, false)}>
                                        <span className="text-danger">{Number(formattedPrice).toFixed(4)}</span>
                                        <span className="text-right text-gray-300">{Number(formattedAmount).toFixed(4)}</span>
                                        <span className="text-right text-gray-400">{total.toFixed(2)}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="py-2 border-y border-gray-700 text-center">
                            <span className={`text-lg font-bold ${aggBids[0] ? 'text-success' : 'text-gray-400'}`}>
                               {aggBids[0] ? Number(ethers.utils.formatUnits(aggBids[0].price, 18)).toFixed(4) : (aggAsks[0] ? Number(ethers.utils.formatUnits(aggAsks[0].price, 18)).toFixed(4) : '--')} 
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {aggBids.map((agg, idx) => {
                                const formattedPrice = ethers.utils.formatUnits(agg.price, 18);
                                const formattedAmount = ethers.utils.formatUnits(agg.totalAmount, 18);
                                const total = parseFloat(formattedPrice) * parseFloat(formattedAmount);
                                return (
                                    <div key={`bid-${idx}`} className="grid grid-cols-3 px-3 py-1 hover:bg-gray-800 cursor-pointer text-xs relative group" onClick={() => handleOrderClick(agg, true)}>
                                        <span className="text-success">{Number(formattedPrice).toFixed(4)}</span>
                                        <span className="text-right text-gray-300">{Number(formattedAmount).toFixed(4)}</span>
                                        <span className="text-right text-gray-400">{total.toFixed(2)}</span>
                                    </div>
                                );
                            })}
                        </div>
                     </div>

                     {/* Market Trades (40% height) */}
                     <div className="bg-secondary rounded-xl border border-gray-700 flex flex-col overflow-hidden h-2/5">
                         <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                             <span className="font-bold text-gray-300">Market Trades</span>
                             <select 
                                value={tradeHistoryLimit} 
                                onChange={(e) => setTradeHistoryLimit(Number(e.target.value))}
                                className="bg-primary text-xs text-gray-300 border border-gray-600 rounded p-1"
                             >
                                 <option value={10}>10</option>
                                 <option value={20}>20</option>
                                 <option value={50}>50</option>
                                 <option value={100}>100</option>
                             </select>
                         </div>
                         <div className="grid grid-cols-3 px-3 py-2 text-xs text-gray-500 font-medium">
                            <div>Price</div>
                            <div className="text-right">Time</div>
                         </div>
                         <div className="overflow-y-auto custom-scrollbar flex-1">
                             {recentTrades.slice(0, tradeHistoryLimit).map((t, idx) => (
                                 <div key={idx} className="grid grid-cols-3 px-3 py-1 text-xs hover:bg-gray-800">
                                     <span className={t.isBuyerMaker ? 'text-success' : 'text-danger'}>{Number(t.price).toFixed(4)}</span>
                                     <span className="text-right text-gray-400 col-span-2">
                                         {new Date(t.timestamp).toLocaleTimeString()}
                                     </span>
                                 </div>
                             ))}
                             {recentTrades.length === 0 && (
                                 <div className="text-center py-4 text-gray-600 text-xs">No recent trades</div>
                             )}
                         </div>
                     </div>
                </div>

                {/* MIDDLE COL: Chart / History */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {/* Chart Area */}
                    <div className="bg-secondary rounded-xl border border-gray-700 p-4 h-2/3 flex flex-col relative">
                        <div className="flex gap-2 mb-2 overflow-x-auto pb-2 border-b border-gray-700/50">
                            {TIMEFRAMES.map((tf) => (
                                <button
                                    key={tf.label}
                                    onClick={() => setSelectedTimeframe(tf)}
                                    className={`px-2 py-1 text-xs rounded transition-colors ${selectedTimeframe.label === tf.label ? 'bg-gray-700 text-white font-bold' : 'text-gray-400 hover:text-gray-200'}`}
                                >
                                    {tf.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 w-full h-full relative">
                            {chartData.length > 0 ? (
                                <Chart options={chartOptions} series={chartData} type="candlestick" height="100%" width="100%" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                    Loading Chart Data...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User History / Active Orders */}
                    <div className="bg-secondary rounded-xl border border-gray-700 flex-1 flex flex-col overflow-hidden">
                        <div className="flex border-b border-gray-700">
                             <button 
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${viewMode === 'ACTIVE' ? 'border-accent text-accent' : 'border-transparent text-gray-400'}`}
                             >
                                Open Orders
                             </button>
                             <button className="px-4 py-2 text-sm font-medium text-gray-400 border-b-2 border-transparent hover:text-gray-200">
                                Trade History
                             </button>
                        </div>
                        <div className="overflow-auto flex-1 p-2">
                            <table className="w-full text-left text-xs">
                                <thead className="text-gray-500">
                                    <tr>
                                        <th className="pb-2">Pair</th>
                                        <th className="pb-2">Type</th>
                                        <th className="pb-2">Side</th>
                                        <th className="pb-2">Price</th>
                                        <th className="pb-2">Amount</th>
                                        <th className="pb-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300">
                                    {rawOrders.filter(o => o.user.toLowerCase() === account?.toLowerCase() && o.active).map(o => (
                                        <tr key={o.id} className="border-b border-gray-700/50 last:border-0 hover:bg-gray-800/50">
                                            <td className="py-2">{base}/{quote}</td>
                                            <td className="py-2">Limit</td>
                                            <td className={`py-2 ${o.isBuy ? 'text-success' : 'text-danger'}`}>{o.isBuy ? 'Buy' : 'Sell'}</td>
                                            <td className="py-2">{Number(ethers.utils.formatUnits(o.price, 18)).toFixed(4)}</td>
                                            <td className="py-2">{Number(ethers.utils.formatEther(o.amount)).toFixed(4)}</td>
                                            <td className="py-2 text-right">
                                                <button onClick={() => handleCancel(o.id)} className="text-gray-400 hover:text-danger" title="Cancel Order">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {rawOrders.filter(o => o.user.toLowerCase() === account?.toLowerCase() && o.active).length === 0 && (
                                        <tr><td colSpan={6} className="py-4 text-center text-gray-600">No open orders</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: Trade Form */}
                <div className="lg:col-span-1 bg-secondary rounded-xl border border-gray-700 flex flex-col">
                    <div className="flex border-b border-gray-700">
                        <button 
                            onClick={() => setIsBuyTab(true)}
                            className={`flex-1 py-3 text-sm font-bold transition-colors ${isBuyTab ? 'bg-success/10 text-success border-b-2 border-success' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            BUY {base}
                        </button>
                        <button 
                            onClick={() => setIsBuyTab(false)}
                            className={`flex-1 py-3 text-sm font-bold transition-colors ${!isBuyTab ? 'bg-danger/10 text-danger border-b-2 border-danger' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            SELL {base}
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Wallet className="w-3 h-3"/> Avail.</span>
                            <span className="text-white">{parseFloat(currentBalance).toFixed(4)} {isBuyTab ? quote : base}</span>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Price ({quote})</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-primary border border-gray-600 rounded-lg py-2 pl-3 pr-8 text-white text-sm focus:border-accent outline-none"
                                    placeholder="0"
                                />
                                <span className="absolute right-3 top-2 text-gray-500 text-xs">{quote}</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Amount ({base})</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-primary border border-gray-600 rounded-lg py-2 pl-3 pr-8 text-white text-sm focus:border-accent outline-none"
                                    placeholder="0.00"
                                />
                                <span className="absolute right-3 top-2 text-gray-500 text-xs">{base}</span>
                            </div>
                        </div>

                        <div className="p-3 bg-primary rounded-lg border border-gray-700 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Fee</span>
                                <span className="text-gray-200">0.01%</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-400">Total</span>
                                <span className="text-white">
                                    {(Number(amount) * Number(price)).toFixed(2)} {quote}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={handleTradeAction}
                            disabled={!account || actionLoading}
                            className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-lg ${isBuyTab ? 'bg-success hover:bg-green-600 shadow-green-900/20' : 'bg-danger hover:bg-red-600 shadow-red-900/20'} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {actionLoading ? 'Processing...' : (isBuyTab ? `Buy ${base}` : `Sell ${base}`)}
                        </button>
                        
                        {!account && (
                            <div className="text-center text-xs text-red-400">
                                Please connect wallet to trade
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};