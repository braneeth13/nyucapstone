import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import TabBar from './components/TabBar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderStatus from './pages/OrderStatus';
import Club from './pages/Club';
import Rewards from './pages/Rewards';
import Visit from './pages/Visit';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <div className="shell">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order/:id" element={<OrderStatus />} />
          <Route path="/club" element={<Club />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <TabBar />
    </div>
  );
}
