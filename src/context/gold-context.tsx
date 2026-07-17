import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

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

type GoldContextValue = {
  /** Current gold balance owned by the user, in grams. */
  balanceGram: number;
  /** Current buy price, in Rupiah per gram (simulates FR-006 realtime price). */
  pricePerGram: number;
  /** Executes a purchase: converts nominal (Rp) to grams and credits the balance. */
  buyGold: (nominal: number) => GoldTransaction;
};

const GoldContext = createContext<GoldContextValue | undefined>(undefined);

export function GoldProvider({ children }: PropsWithChildren) {
  const [balanceGram, setBalanceGram] = useState(INITIAL_BALANCE_GRAM);
  const [pricePerGram, setPricePerGram] = useState(INITIAL_PRICE_PER_GRAM);

  // Simulates a realtime gold price feed (BRD FR-006: "Menampilkan harga emas realtime").
  useEffect(() => {
    const interval = setInterval(() => {
      setPricePerGram((current) => {
        const delta = Math.round((Math.random() - 0.5) * PRICE_TICK_MAX_DELTA);
        return Math.max(1, current + delta);
      });
    }, PRICE_TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const buyGold = (nominal: number): GoldTransaction => {
    // Locks the gram conversion against the price at the moment of purchase,
    // mirroring BRD FR-012 "Lock harga selama periode tertentu".
    const lockedPricePerGram = pricePerGram;
    const gram = nominal / lockedPricePerGram;

    setBalanceGram((current) => current + gram);

    return {
      id: `${Date.now()}`,
      nominal,
      gram,
      pricePerGram: lockedPricePerGram,
      createdAt: Date.now(),
    };
  };

  const value = useMemo<GoldContextValue>(
    () => ({ balanceGram, pricePerGram, buyGold }),
    [balanceGram, pricePerGram]
  );

  return <GoldContext.Provider value={value}>{children}</GoldContext.Provider>;
}

export function useGold() {
  const context = useContext(GoldContext);
  if (!context) {
    throw new Error('useGold must be used within a GoldProvider');
  }
  return context;
}
