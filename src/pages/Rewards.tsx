import { Link } from 'react-router-dom';
import PageTop from '../components/PageTop';
import { STAMPS_PER_REWARD } from '../data/club';
import { useApp } from '../state/AppState';

export default function Rewards() {
  const { state } = useApp();
  const filled = state.stamps % STAMPS_PER_REWARD;
  const rewards = Math.floor(state.stamps / STAMPS_PER_REWARD);

  return (
    <div className="page">
      <PageTop title="Rewards" back />

      <section className="stamp-card" aria-label={`${filled} of ${STAMPS_PER_REWARD} stamps`}>
        <div className="stamp-head">
          <span className="club-mark">
            nata<span>.</span>
          </span>
          <span>Cartão de fidelidade</span>
        </div>
        <div className="stamp-count">
          <strong>{filled}</strong>/{STAMPS_PER_REWARD}
        </div>
        <div className="stamps">
          {Array.from({ length: STAMPS_PER_REWARD }, (_, i) => (
            <span key={i} className={`stamp ${i < filled ? 'on' : ''}`}>
              {i < filled ? '' : i + 1}
            </span>
          ))}
        </div>
      </section>

      {rewards > 0 ? (
        <section className="block reward-ready">
          <strong>
            {rewards} free {rewards === 1 ? 'nata' : 'natas'} ready
          </strong>
          <span>Switch it on at checkout.</span>
          <Link to="/menu" className="btn primary small">
            Use now
          </Link>
        </section>
      ) : (
        <p className="center muted">{STAMPS_PER_REWARD - filled} more natas until your next free one.</p>
      )}

      <section className="block how">
        <h2 className="sec-title">How it works</h2>
        <ol>
          <li>
            <strong>Order a nata</strong>
            <span>Every tart you pay for, including boxes and combos, earns one stamp.</span>
          </li>
          <li>
            <strong>Collect 10 stamps</strong>
            <span>Your card fills up automatically. There’s nothing to scan.</span>
          </li>
          <li>
            <strong>Enjoy one on us</strong>
            <span>Turn on the reward at checkout and a nata is free.</span>
          </li>
        </ol>
      </section>
    </div>
  );
}
