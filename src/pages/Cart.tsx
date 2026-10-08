import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { STAMPS_PER_REWARD } from '../data/club';
import { getItem } from '../data/menu';
import { pickupSlots } from '../lib/hours';
import { computeTotals, describeOptions, money } from '../lib/pricing';
import { todayUsage, useApp } from '../state/AppState';

export default function Cart() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const slots = useMemo(() => pickupSlots(new Date()), []);
  const [pickup, setPickup] = useState(slots[0]?.id ?? '');
  const [name, setName] = useState(state.name);
  const [redeem, setRedeem] = useState(false);
  const [placing, setPlacing] = useState(false);

  const totals = computeTotals(state.cart, {
    plan: state.plan,
    perksUsedToday: todayUsage(state),
    stamps: state.stamps,
    redeemReward: redeem,
  });

  if (state.cart.length === 0) {
    return (
      <div className="page empty">
        <div className="big-emoji">🥧</div>
        <h1>Your bag is empty</h1>
        <p className="muted">A warm nata is about ten minutes away.</p>
        <Link to="/menu" className="btn primary">
          Browse the menu
        </Link>
      </div>
    );
  }

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    const id = `N${Date.now().toString(36).slice(-5).toUpperCase()}`;
    const slot = slots.find((s) => s.id === pickup);
    // Payment is mocked: a real build would hand off to Stripe or Square here.
    setTimeout(() => {
      dispatch({
        type: 'placeOrder',
        order: {
          id,
          createdAt: Date.now(),
          pickup: slot?.label ?? 'ASAP',
          name: name.trim(),
          lines: state.cart,
          totals,
        },
      });
      navigate(`/order/${id}`, { replace: true });
    }, 700);
  };

  return (
    <form className="page" onSubmit={placeOrder}>
      <h1>Your bag</h1>

      <ul className="cart-list">
        {state.cart.map((line) => {
          const item = getItem(line.itemId);
          if (!item) return null;
          return (
            <li key={line.key} className="cart-line">
              <span className="menu-emoji" aria-hidden="true">
                {item.emoji}
              </span>
              <div className="grow">
                <strong>{item.name}</strong>
                <div className="muted small">{describeOptions(line.itemId, line.options)}</div>
              </div>
              <div className="stepper small">
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'setQty', key: line.key, qty: line.qty - 1 })}
                  aria-label={`Remove one ${item.name}`}
                >
                  −
                </button>
                <span>{line.qty}</span>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'setQty', key: line.key, qty: line.qty + 1 })}
                  aria-label={`Add one ${item.name}`}
                >
                  +
                </button>
              </div>
              <span className="line-price">{money(line.unitPrice * line.qty)}</span>
            </li>
          );
        })}
      </ul>
      <Link to="/menu" className="text-link">
        + Add more
      </Link>

      {!state.plan && (
        <Link to="/club" className="notice link">
          Coming every day? <strong>Nata Club</strong> covers a drink a day, from $29/mo. →
        </Link>
      )}

      {totals.rewardAvailable && (
        <label className="reward-toggle">
          <input type="checkbox" checked={redeem} onChange={(e) => setRedeem(e.target.checked)} />
          <span>
            Use {STAMPS_PER_REWARD} stamps for a <strong>free nata</strong>
            <span className="muted small"> · you have {state.stamps}</span>
          </span>
        </label>
      )}

      <section className="card">
        <h2 className="h3">Pickup</h2>
        <label className="field">
          <span>Name for the order</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Inês"
            autoComplete="given-name"
          />
        </label>
        <label className="field">
          <span>Pickup time</span>
          <select value={pickup} onChange={(e) => setPickup(e.target.value)} required>
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <p className="muted small">11 Waverly Place · grab-and-go, no seating inside.</p>
      </section>

      <section className="card totals">
        <Row label="Subtotal" value={money(totals.subtotal)} />
        {totals.discounts.map((d) => (
          <Row key={d.label} label={d.label} value={`−${money(d.amount)}`} accent />
        ))}
        <Row label="Tax" value={money(totals.tax)} />
        <Row label="Total" value={money(totals.total)} strong />
        {totals.stampsEarned > 0 && (
          <p className="muted small">
            You’ll earn {totals.stampsEarned} {totals.stampsEarned === 1 ? 'stamp' : 'stamps'} ⭐
          </p>
        )}
      </section>

      <button className="btn primary block" disabled={placing || !pickup}>
        {placing ? 'Placing order…' : `Place order · ${money(totals.total)}`}
      </button>
      <p className="muted small center">Demo checkout. No card is charged.</p>
    </form>
  );
}

function Row({ label, value, strong, accent }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <div className={`row ${strong ? 'strong' : ''} ${accent ? 'accent' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
