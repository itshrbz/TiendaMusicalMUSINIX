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
            {/* Ejemplo de tarjeta de producto - podrías mapear un array aquí en el futuro */}
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
      
      {/* El footer se mantiene consistente con los componentes previos */}
      <footer className="footer">
        {/* ... contenido del footer igual a las versiones anteriores ... */}
      </footer>
    </>
  );
}

export default Products;