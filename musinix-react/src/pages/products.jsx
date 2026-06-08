import React from 'react';
import { Link } from 'react-router-dom';

function Products() {
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
          <Link className="btn-nav" to="/cart">Cart</Link>
        </nav>
      </header>

      <main className="container">
        <section className="section">
          <h1>Music Catalog</h1>
          <p>Explore digital and physical music products.</p>

          <div className="filters">
            <input type="text" placeholder="Search product" />
            <select>
              <option>All formats</option>
              <option>Digital</option>
              <option>Physical</option>
              <option>Vinyl</option>
              <option>CD</option>
            </select>
            <button>Search</button>
          </div>

          <div className="product-grid">
            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Digital Album</h3>
              <p>Format: Digital</p>
              <p>$10.00</p>
              <Link className="button-link" to="/product-detail">View Details</Link>
            </div>

            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Vinyl Album</h3>
              <p>Format: Physical</p>
              <p>$25.00</p>
              <Link className="button-link" to="/product-detail">View Details</Link>
            </div>

            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Classic CD</h3>
              <p>Format: CD</p>
              <p>$15.00</p>
              <Link className="button-link" to="/product-detail">View Details</Link>
            </div>

            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Cassette Edition</h3>
              <p>Format: Cassette</p>
              <p>$12.00</p>
              <Link className="button-link" to="/product-detail">View Details</Link>
            </div>
          </div>
        </section>
      </main>

      <hr className="footer-divider" />

      <footer className="footer">
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V22M2 12H22M19.07 4.93L4.93 19.07M19.07 19.07L4.93 4.93" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Musinix
          </h3>
          <p>Online music shop</p>
        </div>

        <div>
          <h4>Customer Support</h4>
          <Link to="/contact" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Contact
          </Link>
          <Link to="/shipping" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            Shipping
          </Link>
          <Link to="/payment" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            Payment
          </Link>
        </div>

        <div>
          <h4>Company</h4>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            About us
          </Link>
          <Link to="/events" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Events
          </Link>
          <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08"></polygon><polygon points="12 22.08 21 17.08 21 6.92 12 12 12 22.08"></polygon><polygon points="12 12 21 6.92 12 1.92 3 6.92 12 12"></polygon></svg>
            Bundles
          </Link>
        </div>

        <div>
          <h4>Follow us</h4>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            Instagram
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            Facebook
          </a>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
            Twitter
          </a>
        </div>
      </footer>
    </>
  );
}

export default Products;