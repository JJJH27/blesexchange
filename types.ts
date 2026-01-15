export interface Order {
  id: string; // BigInt converted to string
  user: string;
  isBuy: boolean;
  pairId: number;
  amount: string; // Wei value string
  price: string; // Wei value string
  active: boolean;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
}

export interface PairInfo {
  base: TokenInfo;
  quote: TokenInfo;
}

export enum AppView {
  MARKET = 'MARKET',
  HISTORY = 'HISTORY',
  ADMIN = 'ADMIN'
}

export interface Web3State {
  account: string | null;
  chainId: string | null;
  isOwner: boolean;
}
