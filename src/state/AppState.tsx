import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { STAMPS_PER_REWARD, type PlanId } from '../data/club';
import { nyParts } from '../lib/hours';
import type { CartLine, Totals } from '../lib/pricing';

export interface Order {
  id: string;
  createdAt: number;
  pickup: string;
  name: string;
  lines: CartLine[];
  totals: Totals;
}

export interface State {
  cart: CartLine[];
  plan: PlanId | null;
  memberSince: number | null;
  perkUsage: { date: string; drink: boolean; nata: boolean };
  stamps: number;
  orders: Order[];
  name: string;
}

type Action =
  | { type: 'add'; line: Omit<CartLine, 'key'> }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'clearCart' }
  | { type: 'joinPlan'; plan: PlanId }
  | { type: 'cancelPlan' }
  | { type: 'placeOrder'; order: Order };

const STORAGE_KEY = 'nata-app-v1';

const initialState: State = {
  cart: [],
  plan: null,
  memberSince: null,
  perkUsage: { date: '', drink: false, nata: false },
  stamps: 0,
  orders: [],
  name: '',
};

function lineKey(itemId: string, options: Record<string, string>): string {
  const opts = Object.keys(options)
    .sort()
    .map((k) => `${k}=${options[k]}`)
    .join('&');
  return `${itemId}?${opts}`;
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.line.itemId, action.line.options);
      const existing = state.cart.find((l) => l.key === key);
      const cart = existing
        ? state.cart.map((l) => (l.key === key ? { ...l, qty: l.qty + action.line.qty } : l))
        : [...state.cart, { ...action.line, key }];
      return { ...state, cart };
    }
    case 'setQty':
      return {
        ...state,
        cart:
          action.qty <= 0
            ? state.cart.filter((l) => l.key !== action.key)
            : state.cart.map((l) => (l.key === action.key ? { ...l, qty: action.qty } : l)),
      };
    case 'clearCart':
      return { ...state, cart: [] };
    case 'joinPlan':
      return { ...state, plan: action.plan, memberSince: state.memberSince ?? Date.now() };
    case 'cancelPlan':
      return { ...state, plan: null, memberSince: null };
    case 'placeOrder': {
      const { order } = action;
      const today = todayUsage(state);
      return {
        ...state,
        cart: [],
        name: order.name,
        orders: [order, ...state.orders],
        stamps:
          state.stamps -
          (order.totals.usesReward ? STAMPS_PER_REWARD : 0) +
          order.totals.stampsEarned,
        perkUsage: {
          date: today.date,
          drink: today.drink || order.totals.usesDrinkPerk,
          nata: today.nata || order.totals.usesNataPerk,
        },
      };
    }
  }
}

/** Club perks reset every day at midnight, store time. */
export function todayUsage(state: State, now = new Date()) {
  const date = nyParts(now).dateKey;
  return state.perkUsage.date === date ? state.perkUsage : { date, drink: false, nata: false };
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable in private mode; the app still works for the session.
    }
  }, [state]);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside AppStateProvider');
  return ctx;
}

export function cartCount(state: State): number {
  return state.cart.reduce((s, l) => s + l.qty, 0);
}
