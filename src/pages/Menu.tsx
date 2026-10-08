import { useState } from 'react';
import { Link } from 'react-router-dom';
import ItemSheet from '../components/ItemSheet';
import { CATEGORIES, MENU, type MenuItem } from '../data/menu';
import { getPlan } from '../data/club';
import { money } from '../lib/pricing';
import { cartCount, useApp } from '../state/AppState';

export default function Menu() {
  const { state } = useApp();
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const plan = getPlan(state.plan);
  const count = cartCount(state);

  return (
    <div className="page">
      <h1>Order ahead</h1>
      <p className="muted">Pick up at 11 Waverly Place. Baked fresh all day.</p>

      {plan && (
        <div className="notice">
          ☕ {plan.name} member: your daily {plan.dailyNata ? 'drink and nata are' : 'drink is'} applied
          at checkout.
        </div>
      )}

      <nav className="cat-nav">
        {CATEGORIES.map((c) => (
          <a key={c.id} href={`#${c.id}`}>
            {c.label}
          </a>
        ))}
      </nav>

      {CATEGORIES.map((cat) => (
        <section key={cat.id} id={cat.id} className="menu-section">
          <h2>{cat.label}</h2>
          <ul className="menu-list">
            {MENU.filter((m) => m.category === cat.id).map((item) => (
              <li key={item.id}>
                <button className="menu-item" onClick={() => setSelected(item)}>
                  <span className="menu-emoji" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span className="menu-text">
                    <strong>
                      {item.name}
                      {item.seasonal && <em className="tag">Seasonal</em>}
                    </strong>
                    <span className="muted small">{item.description}</span>
                  </span>
                  <span className="menu-price">{money(item.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {count > 0 && (
        <Link to="/cart" className="floating-cta btn primary">
          View bag · {count} {count === 1 ? 'item' : 'items'}
        </Link>
      )}

      {selected && <ItemSheet item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
