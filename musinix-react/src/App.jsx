import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';

// Importación de componentes desde la carpeta 'pages'
import BundleDetail from './pages/bundle-detail';
import Cart from './pages/cart';
import Contact from './pages/contact';
import Events from './pages/events';
import History from './pages/history';
import Home from './pages/home'; // Asegúrate de tener este componente creado
import Invoice from './pages/invoice';
import Library from './pages/library';
import Login from './pages/login';
import Payment from './pages/payment';
import ProductDetail from './pages/product-detail';
import Products from './pages/products';
import Profile from './pages/profile';
import Register from './pages/register';
import Shipping from './pages/shipping';
import Shop from './pages/shop';
import Support from './pages/support';
import Verify from './pages/verify';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bundle-detail" element={<BundleDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Navigate to="/shipping" replace />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<Events />} />
        <Route path="/history" element={<History />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/library" element={<Library />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/support" element={<Support />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </Router>
  );
}

export default App;