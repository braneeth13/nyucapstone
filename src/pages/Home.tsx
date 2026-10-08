import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chevron, PinIcon } from '../components/Icons';
import ProductArt from '../components/ProductArt';
import { STAMPS_PER_REWARD, getPlan } from '../data/club';
import { MENU } from '../data/menu';
import { STORE } from '../data/store';
import { openStatus } from '../lib/hours';
import { money } from '../lib/pricing';
import { todayUsage, useApp } from '../state/AppState';

const SLIDES = [
  { art: 'nata', tone: 'custard', kicker: 'Baked every 20 minutes', title: 'Warm from\nthe oven', to: '/menu' },
  { art: 'galao', tone: 'azul', kicker: 'Nata Club', title: 'A coffee a day,\nfrom $29/mo', to: '/club' },
  { art: 'seasonal', tone: 'ink', kicker: 'Seasonal special', title: 'Autumn in\nLisbon', to: '/menu' },
];

const RECOMMENDED = ['nata', 'lisboa-combo', 'matcha-lemonade', 'chai-cold-brew', 'box-6'];

export default function Home() {
  const { state } = useApp();
  const navigate = useNavigate();
  const status = openStatus(new Date());
  const plan = getPlan(state.plan);
  const usage = todayUsage(state);
  const filled = state.stamps % STAMPS_PER_REWARD;

  return (
    <div className="home">
      <Banner />

      <section className="home-panel">
        <Link to="/me" className="member-row">
          <div>
            <div className="member-hi">{state.name ? `Olá, ${state.name}` : 'Olá! Welcome to Nata'}</div>
            <div className="member-sub">
              {plan ? (
                <>
                  <span className="lvl">{plan.name}</span>
                  {usage.drink ? 'Daily drink used' : 'Daily drink ready'}
                </>
              ) : (
                <>
                  <span className="lvl muted-lvl">Member</span>
                  {filled}/{STAMPS_PER_REWARD} stamps to a free nata
                </>
              )}
            </div>
          </div>
          <Chevron />
        </Link>

        <div className="entry-grid">
          <Link to="/menu" className="entry">
            <div>
              <strong>Pick up</strong>
              <span>Order ahead, skip the line</span>
            </div>
            <ProductArt id="nata" size={64} />
          </Link>
          <Link to="/club" className="entry">
            <div>
              <strong>Nata Club</strong>
              <span>{plan ? 'Your perks today' : 'A coffee a day'}</span>
            </div>
            <ProductArt id="bica" size={64} />
          </Link>
        </div>

        <Link to="/visit" className="store-row">
          <PinIcon />
          <div className="grow">
            <strong>{STORE.address}</strong>
            <span className={status.open ? 'ok' : 'off'}>{status.label}</span>
          </div>
          <Chevron />
        </Link>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>Recommended</h2>
          <Link to="/menu">Menu</Link>
        </div>
        <div className="h-scroll">
          {RECOMMENDED.map((id) => {
            const item = MENU.find((m) => m.id === id)!;
            return (
              <button key={id} className="rec-card" onClick={() => navigate(`/menu?item=${id}`)}>
                <div className="rec-art">
                  <ProductArt id={id} size={96} />
                  {item.tags?.[0] && <span className="rec-tag">{item.tags[0]}</span>}
                </div>
                <strong>{item.name}</strong>
                <span className="rec-price">{money(item.price)}</span>
              </button>
            );
          })}
        </div>
      </section>

      <Link to="/visit" className="story-teaser">
        <span className="eyebrow">Our story</span>
        <p>A Lisbon native, an NYU alum, and one pastry done exactly right.</p>
        <span className="link-arrow">Read more →</span>
      </Link>
    </div>
  );
}

function Banner() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener('scroll', onScroll, { passive: true });
    const timer = setInterval(() => {
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % SLIDES.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    }, 5000);
    return () => {
      el.removeEventListener('scroll', onScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="banner">
      <div className="banner-brand">
        nata<span>.</span>
      </div>
      <div className="banner-track" ref={ref}>
        {SLIDES.map((s) => (
          <Link key={s.title} to={s.to} className={`slide tone-${s.tone}`}>
            <span className="slide-kicker">{s.kicker}</span>
            <span className="slide-title">{s.title}</span>
            <span className="slide-art">
              <ProductArt id={s.art} size={210} />
            </span>
          </Link>
        ))}
      </div>
      <div className="dots">
        {SLIDES.map((s, i) => (
          <span key={s.title} className={i === index ? 'on' : ''} />
        ))}
      </div>
    </div>
  );
}
