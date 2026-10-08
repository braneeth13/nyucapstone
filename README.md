# Nata NYC app

A mobile-first web app (installable PWA) for [Nata](https://www.nata.nyc), the pastel de nata shop at 11 Waverly Place in Greenwich Village.

## Features

- **Order ahead**: menu (natas, boxes, drinks, Lisboa Combo) with options such as topping, milk and temperature, a bag, pickup-time slots generated from store hours, and a mock checkout with live order status.
- **Nata Club subscription** (modeled on Blank Street's membership):
  - *Bica Club* ($29/mo): one bica or galão a day, plus 10% off boxes.
  - *Saudade Club* ($49/mo): any drink and one nata a day, plus 10% off boxes.
  - Perks apply automatically at checkout and reset at midnight New York time.
- **Rewards**: a digital stamp card. Every paid nata earns a stamp, and 10 stamps get a free nata, redeemable at checkout.
- **Visit and story**: open/closed status, weekly hours, directions, call, Instagram, and the founder's story.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173 (also exposed on your LAN, so you can open it on a phone)
npm test         # unit tests for pricing, hours and state
npm run build    # production build in dist/
```

## Structure

```
src/
  data/       menu.ts, club.ts, store.ts: prices, plans, hours and copy (edit these first)
  lib/        pricing.ts (discounts, tax, stamps), hours.ts (NY-time hours, pickup slots)
  state/      AppState.tsx: cart, membership, stamps and orders, saved to localStorage
  components/ Header, TabBar, ItemSheet, Azulejo tile band
  pages/      Home, Menu, Cart, OrderStatus, Club, Rewards, Visit
```

## Placeholders to confirm with the shop

- Only the single nata price ($4.50) and the hours come from public listings. Box, drink and combo prices are estimates.
- Club pricing and perks are a proposal.
- Payment and order status are simulated. Production would need a backend: accounts, a POS integration such as Square or Toast, and Stripe Billing for subscriptions.
