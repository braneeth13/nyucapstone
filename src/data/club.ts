// Subscription program modeled on Blank Street's membership: a flat monthly fee
// covering one drink per day, with an upper tier that adds a daily nata.
// Prices are placeholders for the business to set.
export type PlanId = 'bica' | 'saudade';

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  tagline: string;
  perks: string[];
  /** Which drinks the daily drink perk covers. */
  drinkScope: 'espresso-bar' | 'any';
  dailyNata: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'bica',
    name: 'Bica Club',
    price: 29,
    tagline: 'Your daily espresso, already covered.',
    perks: [
      'One bica or galão every day',
      '10% off every box of natas',
      'Skip the line with order-ahead',
    ],
    drinkScope: 'espresso-bar',
    dailyNata: false,
  },
  {
    id: 'saudade',
    name: 'Saudade Club',
    price: 49,
    tagline: 'A drink and a nata, every single day.',
    perks: [
      'Any drink on the menu, once a day',
      'One free pastel de nata, once a day',
      '10% off every box of natas',
      'First taste of new seasonal drinks',
    ],
    drinkScope: 'any',
    dailyNata: true,
  },
];

export const CLUB_BOX_DISCOUNT = 0.1;
export const STAMPS_PER_REWARD = 10;

export function getPlan(id: PlanId | null | undefined): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
