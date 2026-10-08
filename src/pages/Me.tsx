import { Link } from 'react-router-dom';
import { Chevron } from '../components/Icons';
import PageTop from '../components/PageTop';
import { STAMPS_PER_REWARD, getPlan } from '../data/club';
import { STORE } from '../data/store';
import { useApp } from '../state/AppState';

export default function Me() {
  const { state } = useApp();
  const plan = getPlan(state.plan);
  const filled = state.stamps % STAMPS_PER_REWARD;
  const initial = (state.name || 'N').charAt(0).toUpperCase();

  return (
    <div className="page me-page">
      <PageTop />
      <section className="me-head">
        <span className="avatar">{initial}</span>
        <div>
          <h1>{state.name || 'Guest'}</h1>
          <span className="lvl">{plan ? plan.name : 'Member'}</span>
        </div>
      </section>

      <section className="me-stats">
        <Link to="/rewards">
          <strong>{filled}</strong>
          <span>Stamps</span>
        </Link>
        <Link to="/rewards">
          <strong>{Math.floor(state.stamps / STAMPS_PER_REWARD)}</strong>
          <span>Rewards</span>
        </Link>
        <Link to="/orders">
          <strong>{state.orders.length}</strong>
          <span>Orders</span>
        </Link>
      </section>

      <Link to="/club" className="me-club">
        <div>
          <strong>{plan ? plan.name : 'Join Nata Club'}</strong>
          <span>{plan ? 'Manage your membership' : 'A drink a day, from $29/mo'}</span>
        </div>
        <Chevron />
      </Link>

      <section className="block list">
        <Row to="/rewards" label="Stamp card" />
        <Row to="/orders" label="Order history" />
        <Row to="/visit" label="Store & hours" />
        <Row to="/visit#story" label="Our story" />
      </section>

      <section className="block list">
        <a href={STORE.instagram} target="_blank" rel="noreferrer" className="list-row">
          Instagram <span className="muted">@nata.nyc</span>
        </a>
        <a href={STORE.phoneHref} className="list-row">
          Call the shop <span className="muted">{STORE.phone}</span>
        </a>
      </section>

      <p className="fine">Nata NYC · demo app · v0.2</p>
    </div>
  );
}

function Row({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="list-row">
      {label}
      <Chevron />
    </Link>
  );
}
