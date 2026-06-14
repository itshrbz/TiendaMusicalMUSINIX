import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [format, setFormat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadProducts = async (filters = {}) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await api.getProducts(filters);
      setProducts(response.data);
    } catch (error) {
      setProducts([]);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    api.getProducts()
      .then((response) => {
        if (active) {
          setProducts(response.data);
        }
      })
      .catch((error) => {
        if (active) {
          setProducts([]);
          setMessage(error.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadProducts({ search, format });
  };

  return (
    <>
      <header className="navbar">
        <div className="logo">✦ Musinix</div>
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
          <p>Productos cargados desde el backend PHP.</p>

          <form className="filters" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search product"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select value={format} onChange={(event) => setFormat(event.target.value)}>
              <option value="all">All formats</option>
              <option value="digital">Digital</option>
              <option value="vinyl">Vinyl</option>
              <option value="cd">CD</option>
              <option value="cassette">Cassette</option>
            </select>
            <button type="submit">Search</button>
          </form>

          {message && <p className="status-message status-error">{message}</p>}
          {loading && <p className="status-message">Loading products...</p>}

          {!loading && !message && (
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product.id}>
                  <div
                    className="image-placeholder product-image"
                    style={{ backgroundImage: `url(${product.image})` }}
                    aria-label={product.name}
                  />
                  <h3>{product.name}</h3>
                  <p>{product.artist}</p>
                  <p>Format: {product.format}</p>
                  <p>${Number(product.price).toFixed(2)}</p>
                  <Link className="button-link" to={`/product-detail?id=${product.id}`}>
                    View Details
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Products;
