import { Link } from 'react-router-dom';
import { cartCount, useApp } from '../state/AppState';

export default function Header() {
  const { state } = useApp();
  const count = cartCount(state);
  return (
    <header className="header">
      <Link to="/" className="wordmark" aria-label="Nata home">
        nata<span>.</span>
      </Link>
      <Link to="/cart" className="cart-button" aria-label={`Cart, ${count} items`}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Zm3 0V7a4 4 0 0 1 8 0v1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        {count > 0 && <span className="badge">{count}</span>}
      </Link>
    </header>
  );
}
