export const CONTRACT_ADDRESS = "0x95d430DeB3f49d7B753c3e4Bef50e9238d934f31";
export const BLESSING_TOKEN_ADDRESS = "0x2830b5a25e70ABb6f82B3333f3DF4A88379Cc91a";

export const TUXA_CHAIN = {
  chainId: '0x4e4542e3', // Hex for 1313161955
  chainName: 'TuxaChain',
  nativeCurrency: {
    name: 'WNEAR',
    symbol: 'WNEAR',
    decimals: 18,
  },
  rpcUrls: ['https://0x4e4542e3.rpc.aurora-cloud.dev'],
  blockExplorerUrls: ['https://0x4e4542e3.explorer.aurora-cloud.dev/'],
};

export const EXCHANGE_ABI = [
  "function owner() view returns (address)",
  "function tokenA() view returns (address)",
  "function tokenB() view returns (address)",
  "function tokenC() view returns (address)",
  "function tokenD() view returns (address)",
  "function buyFeeBP() view returns (uint256)",
  "function sellFeeBP() view returns (uint256)",
  "function configureTokens(address _tokenA, address _tokenB, address _tokenC, address _tokenD) external",
  "function setFees(uint256 _buyFeeBP, uint256 _sellFeeBP) external",
  "function withdrawAll() external",
  "function rescueERC20(address token, uint256 amount) external",
  "function createBuyOrder(uint8 pairId, uint256 amount, uint256 price) external",
  "function createSellOrder(uint8 pairId, uint256 amount, uint256 price) external",
  "function cancelMyOrder(uint8 pairId, uint256 orderId) external",
  "function fillSellOrder(uint8 pairId, uint256 orderId, uint256 amountToBuy) external",
  "function fillBuyOrder(uint8 pairId, uint256 orderId, uint256 amountToSell) external",
  "function getActiveOrders() external view returns (tuple(uint256 id, address user, bool isBuy, uint8 pairId, uint256 amount, uint256 price, bool active)[])",
  "function getUserOrders(address user) external view returns (tuple(uint256 id, address user, bool isBuy, uint8 pairId, uint256 amount, uint256 price, bool active)[])",
  "event OrderCreated(uint256 indexed id, address indexed user, bool isBuy, uint8 pairId, uint256 amount, uint256 price)",
  "event OrderFilled(uint256 indexed id, address indexed executor, uint256 amount, uint256 price, uint256 fee)",
  "event OrderCancelled(uint256 indexed id, address indexed user)"
];

export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];