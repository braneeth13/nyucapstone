import { describe, expect, it } from 'vitest';
import { reducer, type State } from './AppState';
import type { Totals } from '../lib/pricing';

const base: State = {
  cart: [],
  plan: null,
  memberSince: null,
  perkUsage: { date: '', drink: false, nata: false },
  stamps: 12,
  orders: [],
  name: '',
};

describe('reducer', () => {
  it('merges identical lines in the cart', () => {
    const add = { type: 'add' as const, line: { itemId: 'nata', qty: 1, options: { topping: 'cinnamon' }, unitPrice: 4.5 } };
    const s = reducer(reducer(base, add), add);
    expect(s.cart).toHaveLength(1);
    expect(s.cart[0].qty).toBe(2);
  });

  it('spends and earns stamps when an order is placed', () => {
    const totals = { usesReward: true, stampsEarned: 3, usesDrinkPerk: true, usesNataPerk: false } as Totals;
    const s = reducer(base, {
      type: 'placeOrder',
      order: { id: 'N1', createdAt: 0, pickup: 'ASAP', name: 'Ana', lines: [], totals },
    });
    expect(s.stamps).toBe(5);
    expect(s.perkUsage.drink).toBe(true);
    expect(s.name).toBe('Ana');
  });
});
