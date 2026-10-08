import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageTop from '../components/PageTop';
import ProductArt from '../components/ProductArt';
import { getItem } from '../data/menu';
import { STORE } from '../data/store';
import { ORDER_STEPS, orderStep, pickupNumber } from '../lib/orderStatus';
import { describeOptions, money } from '../lib/pricing';
import { useApp } from '../state/AppState';

export default function OrderStatus() {
  const { id } = useParams();
  const { state } = useApp();
  const order = state.orders.find((o) => o.id === id);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!order) {
    return (
      <div className="page">
        <PageTop title="Order" back />
        <div className="empty">
          <h2>Order not found</h2>
          <Link to="/menu" className="btn primary">
            Start an order
          </Link>
        </div>
      </div>
    );
  }

  const step = orderStep(order.createdAt, now);
  const ready = step === ORDER_STEPS.length - 1;

  return (
    <div className="page status-page">
      <PageTop title="Order details" right={<Link to="/" className="top-link">Done</Link>} />

      <section className={`block status-card ${ready ? 'ready' : ''}`}>
        <span className="eyebrow">{ready ? 'Ready for pickup' : 'Pickup number'}</span>
        <div className="pickup-no">{pickupNumber(order.id)}</div>
        <p>
          {ready ? `See you at the counter, ${order.name}!` : `Thanks, ${order.name}. We’re on it.`}
          <br />
          <span className="muted">
            {order.pickup} · {STORE.address}
          </span>
        </p>
        <div className="progress-steps">
          {ORDER_STEPS.map((s, i) => (
            <div key={s.label} className={`pstep ${i <= step ? 'done' : ''} ${i === step ? 'current' : ''}`}>
              <span className="pdot" />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="block">
        <ul className="bag-list">
          {order.lines.map((l) => (
            <li key={l.key}>
              <span className="bag-thumb">
                <ProductArt id={l.itemId} size={48} />
              </span>
              <div className="grow">
                <strong>{getItem(l.itemId)?.name}</strong>
                <div className="sub">{describeOptions(l.itemId, l.options)}</div>
              </div>
              <span className="qty">×{l.qty}</span>
              <span className="price">{money(l.unitPrice * l.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="totals">
          {order.totals.discounts.map((d) => (
            <div key={d.label} className="row accent">
              <span>{d.label}</span>
              <span>−{money(d.amount)}</span>
            </div>
          ))}
          <div className="row">
            <span>Tax</span>
            <span>{money(order.totals.tax)}</span>
          </div>
          <div className="row strong">
            <span>Paid</span>
            <span>{money(order.totals.total)}</span>
          </div>
        </div>
      </section>

      <section className="block meta">
        <div className="row">
          <span>Order no.</span>
          <span>{order.id}</span>
        </div>
        <div className="row">
          <span>Placed</span>
          <span>{new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>
        {order.totals.stampsEarned > 0 && (
          <div className="row">
            <span>Stamps earned</span>
            <span>+{order.totals.stampsEarned} ⭐</span>
          </div>
        )}
      </section>

      <a className="btn block" href={STORE.mapsUrl} target="_blank" rel="noreferrer">
        Directions to the shop
      </a>
    </div>
  );
}
