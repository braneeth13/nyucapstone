import { Link } from 'react-router-dom';
import { computeTotals, money } from '../lib/pricing';
import { cartCount, todayUsage, useApp } from '../state/AppState';

/** Floating dark bag bar shown above the tab bar while ordering. */
export default function CartBar() {
  const { state } = useApp();
  const count = cartCount(state);
  if (count === 0) return null;
  const totals = computeTotals(state.cart, {
    plan: state.plan,
    perksUsedToday: todayUsage(state),
    stamps: state.stamps,
    redeemReward: false,
  });
  const saved = totals.discounts.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="cartbar">
      <Link to="/cart" className="cartbar-bag" aria-label={`Bag, ${count} items`}>
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Zm3 0V7a4 4 0 0 1 8 0v1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <span className="cartbar-count">{count}</span>
      </Link>
      <Link to="/cart" className="cartbar-sum">
        <strong>{money(totals.subtotal - Math.min(saved, totals.subtotal))}</strong>
        {saved > 0 && <span>Saved {money(Math.min(saved, totals.subtotal))}</span>}
      </Link>
      <Link to="/cart" className="cartbar-go">
        Checkout
      </Link>
    </div>
  );
}
