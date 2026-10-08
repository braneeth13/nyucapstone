import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageTop from '../components/PageTop';
import ProductArt from '../components/ProductArt';
import { PinIcon } from '../components/Icons';
import { STAMPS_PER_REWARD } from '../data/club';
import { getItem } from '../data/menu';
import { STORE } from '../data/store';
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
  const saved = totals.subtotal + totals.tax - totals.total;

  if (state.cart.length === 0) {
    return (
      <div className="page">
        <PageTop title="Bag" back />
        <div className="empty">
          <ProductArt id="nata" size={120} />
          <h2>Your bag is empty</h2>
          <p>A warm nata is about ten minutes away.</p>
          <Link to="/menu" className="btn primary">
            Go to menu
          </Link>
        </div>
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
        order: { id, createdAt: Date.now(), pickup: slot?.label ?? 'ASAP', name: name.trim(), lines: state.cart, totals },
      });
      navigate(`/order/${id}`, { replace: true });
    }, 700);
  };

  return (
    <form className="page checkout" onSubmit={placeOrder}>
      <PageTop title="Confirm order" back />

      <section className="block">
        <div className="store-row flat">
          <PinIcon />
          <div className="grow">
            <strong>Pick up · {STORE.address}</strong>
            <span>Grab-and-go, no seating inside</span>
          </div>
        </div>
        <label className="field-row">
          <span>Pickup time</span>
          <select value={pickup} onChange={(e) => setPickup(e.target.value)} required>
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field-row">
          <span>Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="For the order" autoComplete="given-name" />
        </label>
      </section>

      <section className="block">
        <ul className="bag-list">
          {state.cart.map((line) => {
            const item = getItem(line.itemId);
            if (!item) return null;
            return (
              <li key={line.key}>
                <span className="bag-thumb">
                  <ProductArt id={item.id} size={52} />
                </span>
                <div className="grow">
                  <strong>{item.name}</strong>
                  <div className="sub">{describeOptions(line.itemId, line.options)}</div>
                  <div className="price">{money(line.unitPrice * line.qty)}</div>
                </div>
                <div className="stepper small">
                  <button type="button" onClick={() => dispatch({ type: 'setQty', key: line.key, qty: line.qty - 1 })} aria-label={`Remove one ${item.name}`}>
                    −
                  </button>
                  <span>{line.qty}</span>
                  <button type="button" onClick={() => dispatch({ type: 'setQty', key: line.key, qty: line.qty + 1 })} aria-label={`Add one ${item.name}`}>
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <Link to="/menu" className="add-more">
          + Add more items
        </Link>
      </section>

      <section className="block">
        {!state.plan && (
          <Link to="/club" className="line-row">
            <span className="badge-ico">☕</span>
            <span className="grow">
              Nata Club
              <small>Get a drink a day from $29/mo</small>
            </span>
            <span className="muted">Join ›</span>
          </Link>
        )}
        <label className={`line-row ${totals.rewardAvailable ? '' : 'disabled'}`}>
          <span className="badge-ico">⭐</span>
          <span className="grow">
            Free nata reward
            <small>
              {totals.rewardAvailable
                ? `Use ${STAMPS_PER_REWARD} of your ${state.stamps} stamps`
                : `${state.stamps % STAMPS_PER_REWARD}/${STAMPS_PER_REWARD} stamps collected`}
            </small>
          </span>
          <input type="checkbox" className="switch" checked={redeem && totals.rewardAvailable} disabled={!totals.rewardAvailable} onChange={(e) => setRedeem(e.target.checked)} />
        </label>
      </section>

      <section className="block totals">
        <Row label="Subtotal" value={money(totals.subtotal)} />
        {totals.discounts.map((d) => (
          <Row key={d.label} label={d.label} value={`−${money(d.amount)}`} accent />
        ))}
        <Row label="Tax" value={money(totals.tax)} />
        {totals.stampsEarned > 0 && <p className="earn">You’ll earn {totals.stampsEarned} ⭐ with this order</p>}
      </section>

      <p className="fine">Demo checkout. No card is charged.</p>

      <div className="paybar">
        <div>
          <strong>{money(totals.total)}</strong>
          {saved > 0.004 && <span>Saved {money(saved)}</span>}
        </div>
        <button className="btn primary" disabled={placing || !pickup}>
          {placing ? 'Placing…' : 'Place order'}
        </button>
      </div>
    </form>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`row ${accent ? 'accent' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
