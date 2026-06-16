import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';

import BundleDetail from './pages/bundle-detail';
import Cart from './pages/cart';
import Contact from './pages/contact';
import Events from './pages/events';
import History from './pages/history';
import Home from './pages/home';
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

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/dashboard';
import AdminSales from './pages/admin/sales';
import AdminUsers from './pages/admin/users';
import AdminProducts from './pages/admin/products';
import AdminProductForm from './pages/admin/product-form';
import AdminSongs from './pages/admin/songs';
import AdminSongForm from './pages/admin/song-form';
import AdminBundles from './pages/admin/bundles';
import AdminBundleForm from './pages/admin/bundle-form';
import AdminEvents from './pages/admin/events';
import AdminEventForm from './pages/admin/event-form';

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

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="songs" element={<AdminSongs />} />
          <Route path="songs/new" element={<AdminSongForm />} />
          <Route path="songs/:id/edit" element={<AdminSongForm />} />
          <Route path="bundles" element={<AdminBundles />} />
          <Route path="bundles/new" element={<AdminBundleForm />} />
          <Route path="bundles/:id/edit" element={<AdminBundleForm />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="events/new" element={<AdminEventForm />} />
          <Route path="events/:id/edit" element={<AdminEventForm />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
