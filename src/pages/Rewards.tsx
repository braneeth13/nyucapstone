import { Link } from 'react-router-dom';
import { STAMPS_PER_REWARD } from '../data/club';
import { money } from '../lib/pricing';
import { useApp } from '../state/AppState';

export default function Rewards() {
  const { state } = useApp();
  const filled = state.stamps % STAMPS_PER_REWARD;
  const rewards = Math.floor(state.stamps / STAMPS_PER_REWARD);

  return (
    <div className="page">
      <h1>Rewards</h1>
      <p className="muted">Every nata you buy earns a stamp. Ten stamps get you a free nata.</p>

      <section className="stamp-card" aria-label={`${filled} of ${STAMPS_PER_REWARD} stamps`}>
        <div className="stamp-card-head">
          <span className="wordmark small">
            nata<span>.</span>
          </span>
          <span>Cartão de fidelidade</span>
        </div>
        <div className="stamps">
          {Array.from({ length: STAMPS_PER_REWARD }, (_, i) => (
            <span key={i} className={`stamp ${i < filled ? 'on' : ''}`}>
              {i < filled ? '🥧' : i + 1}
            </span>
          ))}
        </div>
        <p className="stamp-foot">
          {STAMPS_PER_REWARD - filled} more until your next free nata
        </p>
      </section>

      {rewards > 0 && (
        <div className="notice success">
          🎉 You have {rewards} free {rewards === 1 ? 'nata' : 'natas'} ready. Redeem at checkout.
        </div>
      )}

      <section>
        <h2>Order history</h2>
        {state.orders.length === 0 ? (
          <p className="muted">
            No orders yet. <Link to="/menu">Start your first one →</Link>
          </p>
        ) : (
          <ul className="history">
            {state.orders.slice(0, 20).map((o) => (
              <li key={o.id}>
                <Link to={`/order/${o.id}`}>
                  <span>
                    <strong>#{o.id}</strong>
                    <span className="muted small"> · {new Date(o.createdAt).toLocaleDateString()}</span>
                  </span>
                  <span>
                    {money(o.totals.total)}
                    {o.totals.stampsEarned > 0 && <span className="muted small"> · +{o.totals.stampsEarned}⭐</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
