import { Link } from 'react-router-dom';

function BundleDetail() {
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
          <Link to="/shop">Bundles</Link>
          <Link to="/products">Products</Link>
          <Link className="btn-nav" to="/cart">Cart</Link>
        </nav>
      </header>

      <main className="container">
        <section className="detail-layout">
          <div className="detail-image">
            Image
          </div>

          <div className="detail-info">
            <h1>Rock Bundle</h1>
            <p>Includes: Digital Album, Vinyl Album and Poster</p>
            <p>Category: Rock</p>
            <p>This bundle includes multiple music products in one package.</p>

            <h2>$30.00</h2>

            <div className="detail-buttons">
              <button type="button">Add to Cart</button>
              <button type="button">Add to Favorites</button>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Products Included</h2>

          <div className="product-grid">
            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Digital Album</h3>
              <p>Digital product</p>
            </div>

            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Vinyl Album</h3>
              <p>Physical product</p>
            </div>
          </div>
        </section>
      </main>

      <hr className="footer-divider" />
      
      <footer className="footer">
        {/* El contenido del footer se mantiene consistente con las versiones anteriores */}
      </footer>
    </>
  );
}

export default BundleDetail;