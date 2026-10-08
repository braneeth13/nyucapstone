import { describe, expect, it } from 'vitest';
import { computeTotals, unitPriceFor, type CartLine, type PricingContext } from './pricing';

const line = (itemId: string, qty = 1, options: Record<string, string> = {}): CartLine => ({
  key: itemId,
  itemId,
  qty,
  options,
  unitPrice: unitPriceFor(itemId, options),
});

const guest: PricingContext = {
  plan: null,
  perksUsedToday: { drink: false, nata: false },
  stamps: 0,
  redeemReward: false,
};

describe('computeTotals', () => {
  it('charges NYC sales tax and earns a stamp per nata', () => {
    const t = computeTotals([line('nata', 2), line('box-6')], guest);
    expect(t.subtotal).toBe(33);
    expect(t.tax).toBe(2.93);
    expect(t.total).toBe(35.93);
    expect(t.stampsEarned).toBe(8);
  });

  it('adds option surcharges to the unit price', () => {
    expect(unitPriceFor('galao', { milk: 'oat', temp: 'iced' })).toBe(5.75);
  });

  it('Bica Club covers an espresso-bar drink but not other drinks', () => {
    const ctx = { ...guest, plan: 'bica' as const };
    expect(computeTotals([line('matcha-lemonade')], ctx).usesDrinkPerk).toBe(false);
    const t = computeTotals([line('matcha-lemonade'), line('galao', 1, { milk: 'oat' })], ctx);
    expect(t.discounts).toEqual([{ label: 'Bica Club: daily drink', amount: 5 }]);
  });

  it('Saudade Club covers the priciest drink plus one nata, once per day', () => {
    const ctx = { ...guest, plan: 'saudade' as const };
    const cart = [line('bica'), line('matcha-lemonade'), line('nata', 3)];
    const t = computeTotals(cart, ctx);
    expect(t.discounts.map((d) => d.amount)).toEqual([6.5, 4.5]);
    expect(t.stampsEarned).toBe(2);

    const used = computeTotals(cart, { ...ctx, perksUsedToday: { drink: true, nata: true } });
    expect(used.discounts).toEqual([]);
  });

  it('gives members 10% off boxes', () => {
    const t = computeTotals([line('box-6')], { ...guest, plan: 'bica' });
    expect(t.discounts).toEqual([{ label: 'Club 10% off boxes', amount: 2.4 }]);
  });

  it('redeems a reward only with 10 stamps and a nata left to cover', () => {
    const ctx = { ...guest, stamps: 10, redeemReward: true };
    expect(computeTotals([line('bica')], ctx).usesReward).toBe(false);
    const t = computeTotals([line('nata')], ctx);
    expect(t.usesReward).toBe(true);
    expect(t.total).toBe(0);
    expect(t.stampsEarned).toBe(0);
    expect(computeTotals([line('nata')], { ...ctx, stamps: 9 }).usesReward).toBe(false);
  });
});
