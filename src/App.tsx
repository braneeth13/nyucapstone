import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TabBar from './components/TabBar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderStatus from './pages/OrderStatus';
import Orders from './pages/Orders';
import Club from './pages/Club';
import Rewards from './pages/Rewards';
import Visit from './pages/Visit';
import Me from './pages/Me';

// Full-screen flows hide the tab bar, like a native checkout.
const NO_TABS = [/^\/cart/, /^\/order\//];

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  const tabs = !NO_TABS.some((r) => r.test(pathname));

  return (
    <div className={`shell ${tabs ? 'with-tabs' : ''}`}>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order/:id" element={<OrderStatus />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/club" element={<Club />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="/me" element={<Me />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {tabs && <TabBar />}
    </div>
  );
}
