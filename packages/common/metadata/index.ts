export type TradingMetadata = {
  type: "LONG" | "SHORT";
  qty: number;
  symbol: typeof SUPPORTED_ASSESTS;
};

export const SUPPORTED_ASSESTS = ["SOL", "BTC", "ETH"];

export type PriceTriggerNodeMetadata = {
  assest: string;
  amount: number;
};
export type TimerTriggerNodeMetadata = {
  time: number;
};

export type ActionCredentials = {
  apiKey: string;
};
