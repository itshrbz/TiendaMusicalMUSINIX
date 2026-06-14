import { Link } from 'react-router-dom';

function Library() {
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
          <Link to="/shop">Shop</Link>
          <Link to="/history">History</Link>
          <Link className="btn-nav" to="/cart">Cart</Link>
        </nav>
      </header>

      <main className="container">
        <section className="section">
          <h1>Digital Library</h1>

          <div className="product-grid">
            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Digital Album One</h3>
              <p>Purchased product</p>
              <button type="button">Open</button>
            </div>

            <div className="product-card">
              <div className="image-placeholder">Image</div>
              <h3>Digital Album Two</h3>
              <p>Purchased product</p>
              <button type="button">Open</button>
            </div>
          </div>
        </section>
      </main>

      <hr className="footer-divider" />
      
      <footer className="footer">
        {/* El contenido del footer se mantiene consistente con los componentes previos */}
      </footer>
    </>
  );
}

export default Library;