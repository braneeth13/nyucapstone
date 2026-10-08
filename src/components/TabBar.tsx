import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Home', icon: 'M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8Z' },
  { to: '/menu', label: 'Order', icon: 'M4 12a8 8 0 0 1 16 0H4Zm-1 2h18M6 17h12' },
  { to: '/club', label: 'Club', icon: 'M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9Zm11 1h2a2 2 0 0 1 0 4h-2M8 4v2m3-2v2m3-2v2' },
  { to: '/rewards', label: 'Rewards', icon: 'm12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 4Z' },
  { to: '/visit', label: 'Visit', icon: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z' },
];

export default function TabBar() {
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.to === '/'} className="tab">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d={t.icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
