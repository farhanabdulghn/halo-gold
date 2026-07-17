import { create } from "zustand";

const INITIAL_BALANCE_GRAM = 2.5;
const INITIAL_PRICE_PER_GRAM = 1_250_000;
const PRICE_TICK_INTERVAL_MS = 5000;
const PRICE_TICK_MAX_DELTA = 5_000;
export const MINIMUM_PURCHASE_NOMINAL = 10_000;

export type GoldTransaction = {
  id: string;
  nominal: number;
  gram: number;
  pricePerGram: number;
  createdAt: number;
};

type GoldState = {
  balanceGram: number;
  pricePerGram: number;
  buyGold: (nominal: number) => GoldTransaction;
};

export const useGoldStore = create<GoldState>((set, get) => ({
  balanceGram: INITIAL_BALANCE_GRAM,
  pricePerGram: INITIAL_PRICE_PER_GRAM,

  buyGold: (nominal) => {
    const lockedPricePerGram = get().pricePerGram;
    const gram = nominal / lockedPricePerGram;

    set((state) => ({ balanceGram: state.balanceGram + gram }));

    return {
      id: `${Date.now()}`,
      nominal,
      gram,
      pricePerGram: lockedPricePerGram,
      createdAt: Date.now(),
    };
  },
}));

let priceTickStarted = false;
export function startGoldPriceTicker() {
  if (priceTickStarted) return;
  priceTickStarted = true;

  setInterval(() => {
    useGoldStore.setState((state) => {
      const delta = Math.round((Math.random() - 0.5) * PRICE_TICK_MAX_DELTA);
      return { pricePerGram: Math.max(1, state.pricePerGram + delta) };
    });
  }, PRICE_TICK_INTERVAL_MS);
}
