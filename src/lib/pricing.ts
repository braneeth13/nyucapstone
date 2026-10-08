import { CLUB_BOX_DISCOUNT, STAMPS_PER_REWARD, getPlan, type PlanId } from '../data/club';
import { NATA_PRICE, getItem } from '../data/menu';
import { STORE } from '../data/store';

export interface CartLine {
  key: string;
  itemId: string;
  qty: number;
  options: Record<string, string>;
  unitPrice: number;
}

export interface PricingContext {
  plan: PlanId | null;
  perksUsedToday: { drink: boolean; nata: boolean };
  stamps: number;
  redeemReward: boolean;
}

export interface Discount {
  label: string;
  amount: number;
}

export interface Totals {
  subtotal: number;
  discounts: Discount[];
  tax: number;
  total: number;
  stampsEarned: number;
  usesDrinkPerk: boolean;
  usesNataPerk: boolean;
  usesReward: boolean;
  /** True when the customer could redeem a reward with this cart. */
  rewardAvailable: boolean;
}

const round = (n: number) => Math.round(n * 100) / 100;

export function unitPriceFor(itemId: string, options: Record<string, string>): number {
  const item = getItem(itemId);
  if (!item) return 0;
  let price = item.price;
  for (const group of item.options ?? []) {
    const choice = group.choices.find((c) => c.id === options[group.id]);
    price += choice?.price ?? 0;
  }
  return round(price);
}

export function computeTotals(lines: CartLine[], ctx: PricingContext): Totals {
  const plan = getPlan(ctx.plan);
  const discounts: Discount[] = [];
  const subtotal = round(lines.reduce((s, l) => s + l.unitPrice * l.qty, 0));
  const totalNatas = lines.reduce((s, l) => s + (getItem(l.itemId)?.natas ?? 0) * l.qty, 0);
  let freeNatas = 0;

  let usesDrinkPerk = false;
  if (plan && !ctx.perksUsedToday.drink) {
    // Cover the priciest eligible drink. Paid add-ons like oat milk are still charged.
    const eligible = lines
      .map((l) => getItem(l.itemId))
      .filter((i) => i?.isDrink && (plan.drinkScope === 'any' || i.espressoBar));
    const best = eligible.reduce((max, i) => Math.max(max, i!.price), 0);
    if (best > 0) {
      discounts.push({ label: `${plan.name}: daily drink`, amount: best });
      usesDrinkPerk = true;
    }
  }

  let usesNataPerk = false;
  if (plan?.dailyNata && !ctx.perksUsedToday.nata && totalNatas > 0) {
    discounts.push({ label: `${plan.name}: daily nata`, amount: NATA_PRICE });
    usesNataPerk = true;
    freeNatas += 1;
  }

  if (plan) {
    const boxTotal = lines
      .filter((l) => l.itemId.startsWith('box-'))
      .reduce((s, l) => s + l.unitPrice * l.qty, 0);
    if (boxTotal > 0) {
      discounts.push({ label: 'Club 10% off boxes', amount: round(boxTotal * CLUB_BOX_DISCOUNT) });
    }
  }

  const rewardAvailable = ctx.stamps >= STAMPS_PER_REWARD && totalNatas > freeNatas;
  const usesReward = ctx.redeemReward && rewardAvailable;
  if (usesReward) {
    discounts.push({ label: 'Reward: free nata', amount: NATA_PRICE });
    freeNatas += 1;
  }

  const discountTotal = Math.min(
    subtotal,
    discounts.reduce((s, d) => s + d.amount, 0),
  );
  const taxable = round(subtotal - discountTotal);
  const tax = round(taxable * STORE.taxRate);

  return {
    subtotal,
    discounts,
    tax,
    total: round(taxable + tax),
    stampsEarned: Math.max(0, totalNatas - freeNatas),
    usesDrinkPerk,
    usesNataPerk,
    usesReward,
    rewardAvailable,
  };
}

export const money = (n: number) => `$${n.toFixed(2)}`;

export function describeOptions(itemId: string, options: Record<string, string>): string {
  const item = getItem(itemId);
  return (item?.options ?? [])
    .map((g) => g.choices.find((c) => c.id === options[g.id])?.label)
    .filter(Boolean)
    .join(' · ');
}
