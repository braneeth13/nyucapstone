import { Link } from 'react-router-dom';
import Azulejo from '../components/Azulejo';
import { STAMPS_PER_REWARD, getPlan } from '../data/club';
import { MENU } from '../data/menu';
import { STORE } from '../data/store';
import { openStatus } from '../lib/hours';
import { money } from '../lib/pricing';
import { todayUsage, useApp } from '../state/AppState';

export default function Home() {
  const { state, dispatch } = useApp();
  const status = openStatus(new Date());
  const plan = getPlan(state.plan);
  const usage = todayUsage(state);
  const nata = MENU.find((m) => m.id === 'nata')!;
  const combo = MENU.find((m) => m.id === 'lisboa-combo')!;
  const lastOrder = state.orders[0];
  const greeting = state.name ? `Olá, ${state.name}` : 'Olá!';

  const quickAdd = (itemId: string, options: Record<string, string> = {}) => {
    const item = MENU.find((m) => m.id === itemId)!;
    dispatch({ type: 'add', line: { itemId, qty: 1, options, unitPrice: item.price } });
  };

  return (
    <div className="page home">
      <section className="hero">
        <p className={`pill ${status.open ? 'open' : 'closed'}`}>{status.label}</p>
        <h1>{greeting}</h1>
        <p className="hero-sub">{STORE.tagline}.</p>
        <div className="hero-tart" aria-hidden="true">
          <div className="tart">
            <span className="blister b1" />
            <span className="blister b2" />
            <span className="blister b3" />
          </div>
        </div>
        <Link to="/menu" className="btn primary">
          Order for pickup
        </Link>
      </section>

      <Azulejo />

      <section className="quick">
        <h2>Quick add</h2>
        <div className="quick-grid">
          <QuickCard emoji={nata.emoji} title={nata.name} price={money(nata.price)} onAdd={() => quickAdd('nata', { topping: 'cinnamon' })} />
          <QuickCard emoji={combo.emoji} title={combo.name} price={money(combo.price)} onAdd={() => quickAdd('lisboa-combo')} />
        </div>
      </section>

      {plan ? (
        <Link to="/club" className="card club-card member">
          <div className="eyebrow">{plan.name}</div>
          <strong>Today’s perks</strong>
          <div className="perk-row">
            <span className={usage.drink ? 'used' : ''}>☕ Drink {usage.drink ? 'used' : 'ready'}</span>
            {plan.dailyNata && (
              <span className={usage.nata ? 'used' : ''}>🥧 Nata {usage.nata ? 'used' : 'ready'}</span>
            )}
          </div>
        </Link>
      ) : (
        <Link to="/club" className="card club-card">
          <div className="eyebrow">New · Nata Club</div>
          <strong>A coffee a day for $29/month.</strong>
          <span className="muted">Daily drink, 10% off boxes, and a nata a day on Saudade. →</span>
        </Link>
      )}

      <Link to="/rewards" className="card stamp-mini">
        <div>
          <div className="eyebrow">Rewards</div>
          <strong>
            {state.stamps % STAMPS_PER_REWARD}/{STAMPS_PER_REWARD} stamps
          </strong>
          <div className="muted small">Every nata earns a stamp. 10 stamps = a free nata.</div>
        </div>
        <div className="progress" aria-hidden="true">
          <span style={{ width: `${((state.stamps % STAMPS_PER_REWARD) / STAMPS_PER_REWARD) * 100}%` }} />
        </div>
      </Link>

      {lastOrder && (
        <Link to={`/order/${lastOrder.id}`} className="card">
          <div className="eyebrow">Last order</div>
          <strong>#{lastOrder.id}</strong> · {money(lastOrder.totals.total)}
        </Link>
      )}
    </div>
  );
}

function QuickCard({ emoji, title, price, onAdd }: { emoji: string; title: string; price: string; onAdd: () => void }) {
  return (
    <div className="quick-card">
      <span className="quick-emoji" aria-hidden="true">
        {emoji}
      </span>
      <strong>{title}</strong>
      <span className="muted small">{price}</span>
      <button className="btn small" onClick={onAdd} aria-label={`Add ${title} to bag`}>
        + Add
      </button>
    </div>
  );
}
