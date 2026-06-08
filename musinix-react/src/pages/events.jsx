import React from 'react';
import { Link } from 'react-router-dom';

function Events() {
  return (
    <>
      <header className="navbar">
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'translateY(-1px)' }}>
            <path d="M12 2V22M2 12H22M19.07 4.93L4.93 19.07M19.07 19.07L4.93 4.93" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Musinix
        </div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/shop">Bundles</Link>
          <Link to="/contact">Contact</Link>
          <Link className="btn-nav" to="/cart">Cart</Link>
        </nav>
      </header>

      <main className="container">
        <section className="section">
          <h1>Events and Offers</h1>
          <p>Find discounts, music events and special offers.</p>

          <div className="product-grid">
            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Music Week</h3>
              <p>15% discount on digital albums.</p>
              <p>Date: 10/06/2026</p>
              <button type="button">View Products</button>
            </div>

            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Vinyl Day</h3>
              <p>Special offers on vinyl products.</p>
              <p>Date: 12/06/2026</p>
              <button type="button">View Products</button>
            </div>

            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Bundle Festival</h3>
              <p>Discounts on selected bundles.</p>
              <p>Date: 15/06/2026</p>
              <button type="button">View Products</button>
            </div>

            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>New Releases</h3>
              <p>Discover the newest music products.</p>
              <p>Date: 17/06/2026</p>
              <button type="button">View Products</button>
            </div>
          </div>
        </section>
      </main>

      <hr className="footer-divider" />
      
      <footer className="footer">
        {/* El contenido del footer se mantiene consistente con el resto de la aplicación */}
      </footer>
    </>
  );
}

export default Events;