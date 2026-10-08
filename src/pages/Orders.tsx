import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTop from '../components/PageTop';
import ProductArt from '../components/ProductArt';
import { ORDER_STEPS, orderStep } from '../lib/orderStatus';
import { money } from '../lib/pricing';
import { useApp } from '../state/AppState';

export default function Orders() {
  const { state } = useApp();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="page">
      <PageTop title="Orders" />
      {state.orders.length === 0 ? (
        <div className="empty">
          <ProductArt id="box-2" size={120} />
          <h2>No orders yet</h2>
          <p>Your orders will show up here.</p>
          <Link to="/menu" className="btn primary">
            Order now
          </Link>
        </div>
      ) : (
        <ul className="order-list">
          {state.orders.map((o) => {
            const step = orderStep(o.createdAt, now);
            const done = step === ORDER_STEPS.length - 1;
            const qty = o.lines.reduce((s, l) => s + l.qty, 0);
            return (
              <li key={o.id}>
                <Link to={`/order/${o.id}`} className="order-card">
                  <div className="order-head">
                    <span>Pick up · 11 Waverly Place</span>
                    <span className={done ? 'muted' : 'live'}>{done ? 'Ready' : ORDER_STEPS[step].label}</span>
                  </div>
                  <div className="order-arts">
                    {o.lines.slice(0, 4).map((l) => (
                      <span key={l.key} className="bag-thumb">
                        <ProductArt id={l.itemId} size={44} />
                      </span>
                    ))}
                    <div className="order-sum">
                      <strong>{money(o.totals.total)}</strong>
                      <span>
                        {qty} {qty === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>
                  <div className="order-foot">{new Date(o.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
