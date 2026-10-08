import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getItem } from '../data/menu';
import { describeOptions, money } from '../lib/pricing';
import { useApp } from '../state/AppState';

const STEPS = [
  { label: 'Order received', after: 0 },
  { label: 'In the oven', after: 15_000 },
  { label: 'Ready for pickup', after: 45_000 },
];

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
      <div className="page empty">
        <h1>Order not found</h1>
        <Link to="/menu" className="btn primary">
          Start an order
        </Link>
      </div>
    );
  }

  // Simulated progress so the demo shows the full flow; a real build would poll the POS.
  const elapsed = now - order.createdAt;
  const current = STEPS.filter((s) => elapsed >= s.after).length - 1;
  const ready = current === STEPS.length - 1;

  return (
    <div className="page">
      <div className={`status-hero ${ready ? 'ready' : ''}`}>
        <div className="big-emoji">{ready ? '🎉' : '🔥'}</div>
        <h1>{ready ? `Ready, ${order.name}!` : `Thanks, ${order.name}!`}</h1>
        <p>
          Order <strong>#{order.id}</strong> · {order.pickup}
        </p>
      </div>

      <ol className="steps">
        {STEPS.map((s, i) => (
          <li key={s.label} className={i <= current ? 'done' : ''}>
            <span className="dot" />
            {s.label}
          </li>
        ))}
      </ol>

      <section className="card">
        <h2 className="h3">Receipt</h2>
        {order.lines.map((l) => (
          <div key={l.key} className="row">
            <span>
              {l.qty}× {getItem(l.itemId)?.name}
              <span className="muted small"> {describeOptions(l.itemId, l.options)}</span>
            </span>
            <span>{money(l.unitPrice * l.qty)}</span>
          </div>
        ))}
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
          <span>Total</span>
          <span>{money(order.totals.total)}</span>
        </div>
        {order.totals.stampsEarned > 0 && (
          <p className="muted small">+{order.totals.stampsEarned} stamps added to your card ⭐</p>
        )}
      </section>

      <div className="btn-row">
        <Link to="/visit" className="btn">
          Directions
        </Link>
        <Link to="/" className="btn primary">
          Done
        </Link>
      </div>
    </div>
  );
}
