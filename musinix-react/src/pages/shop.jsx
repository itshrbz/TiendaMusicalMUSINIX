import React from 'react';
import { Link } from 'react-router-dom';

function Bundles() {
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
          <Link to="/events">Events</Link>
          <Link to="/contact">Contact</Link>
          <Link className="btn-nav" to="/cart">Cart</Link>
        </nav>
      </header>

      <main className="container">
        <section className="section">
          <h1>Bundles</h1>

          <div className="product-grid">
            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>All Books Bundle</h3>
              <p>$25.00</p>
              <Link className="button-link" to="/bundle-detail">View Details</Link>
            </div>

            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Phone The Wall Bundle</h3>
              <p>$30.00</p>
              <Link className="button-link" to="/bundle-detail">View Details</Link>
            </div>

            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Ruby Set Bundle</h3>
              <p>$15.00</p>
              <Link className="button-link" to="/bundle-detail">View Details</Link>
            </div>

            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Clothes Bundle</h3>
              <p>$20.00</p>
              <Link className="button-link" to="/bundle-detail">View Details</Link>
            </div>
          </div>
        </section>
      </main>

      <hr className="footer-divider" />

      <footer className="footer">
        {/* El contenido del footer se mantiene consistente */}
      </footer>
    </>
  );
}

export default Bundles;