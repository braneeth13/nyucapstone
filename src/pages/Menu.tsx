import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CartBar from '../components/CartBar';
import { Chevron, PinIcon } from '../components/Icons';
import ItemSheet from '../components/ItemSheet';
import ProductArt from '../components/ProductArt';
import { getPlan } from '../data/club';
import { CATEGORIES, MENU, getItem, type MenuItem } from '../data/menu';
import { STORE } from '../data/store';
import { openStatus } from '../lib/hours';
import { money } from '../lib/pricing';
import { useApp } from '../state/AppState';

const SECTIONS: { id: string; label: string; items: MenuItem[] }[] = [
  { id: 'popular', label: 'Popular', items: MENU.filter((m) => m.tags?.length) },
  ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, items: MENU.filter((m) => m.category === c.id) })),
];

export default function Menu() {
  const { state } = useApp();
  const [params, setParams] = useSearchParams();
  const [active, setActive] = useState(SECTIONS[0].id);
  const listRef = useRef<HTMLDivElement>(null);
  const status = openStatus(new Date());
  const plan = getPlan(state.plan);
  const selected = getItem(params.get('item') ?? '');

  // Highlight the sidebar category whose section is at the top of the list.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onScroll = () => {
      const top = list.scrollTop + 8;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(`sec-${s.id}`);
        if (el && el.offsetTop - list.offsetTop <= top) current = s.id;
      }
      setActive(current);
    };
    list.addEventListener('scroll', onScroll, { passive: true });
    return () => list.removeEventListener('scroll', onScroll);
  }, []);

  const jump = (id: string) => {
    const list = listRef.current;
    const el = document.getElementById(`sec-${id}`);
    if (list && el) list.scrollTo({ top: el.offsetTop - list.offsetTop, behavior: 'smooth' });
    setActive(id);
  };

  return (
    <div className="menu-page">
      <div className="menu-top">
        <Link to="/visit" className="menu-store">
          <PinIcon />
          <div className="grow">
            <strong>{STORE.address}</strong>
            <span className={status.open ? 'ok' : 'off'}>{status.label}</span>
          </div>
          <Chevron />
        </Link>
        <div className="mode-toggle" role="tablist" aria-label="Order type">
          <span className="on" role="tab" aria-selected="true">
            Pick up
          </span>
          <span className="disabled" role="tab" aria-selected="false" title="Coming soon">
            Delivery
          </span>
        </div>
        {plan && <div className="perk-strip">☕ {plan.name} perks apply at checkout</div>}
      </div>

      <div className="menu-body">
        <nav className="menu-side" aria-label="Categories">
          {SECTIONS.map((s) => (
            <button key={s.id} className={active === s.id ? 'on' : ''} onClick={() => jump(s.id)}>
              {s.label}
            </button>
          ))}
        </nav>

        <div className="menu-list" ref={listRef}>
          {SECTIONS.map((s) => (
            <section key={s.id} id={`sec-${s.id}`}>
              <h2 className="menu-sec-title">{s.label}</h2>
              {s.items.map((item) => (
                <button key={`${s.id}-${item.id}`} className="product" onClick={() => setParams({ item: item.id })}>
                  <span className="product-thumb">
                    <ProductArt id={item.id} size={76} />
                  </span>
                  <span className="product-info">
                    <strong>{item.name}</strong>
                    {item.tags && (
                      <span className="tags">
                        {item.tags.map((t) => (
                          <em key={t}>{t}</em>
                        ))}
                      </span>
                    )}
                    <span className="product-desc">{item.description}</span>
                    <span className="product-foot">
                      <span className="price">{money(item.price)}</span>
                      <span className="plus" aria-hidden="true">
                        +
                      </span>
                    </span>
                  </span>
                </button>
              ))}
            </section>
          ))}
          <div className="menu-end">Prices include no tax. Baked fresh at 11 Waverly Place.</div>
        </div>
      </div>

      <CartBar />
      {selected && <ItemSheet item={selected} onClose={() => setParams({}, { replace: true })} />}
    </div>
  );
}
