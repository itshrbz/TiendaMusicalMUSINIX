import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

function ProductDetail() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id') || '1';
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.getProduct(productId);
        setProduct(response.data);
      } catch (error) {
        setMessage(error.message);
      }
    };

    loadProduct();
  }, [productId]);

  return (
    <>
      <header className="navbar">
        <div className="logo">✦ Musinix</div>
        <nav>
          <Link to="/">Principal</Link>
          <Link to="/products">Productos</Link>
          <Link to="/shop">Tienda de Paquetes</Link>
          <Link to="/events">Eventos</Link>
          <Link to="/contact">Contacto</Link>
          <Link to="/library">Biblioteca</Link>
          <Link to="/profile">Perfil</Link>
          <Link to="/admin">Admin</Link>
          <Link className="btn-nav" to="/login">Iniciar Sesión</Link>
        </nav>
      </header>

      <main className="container">
        {message && <p className="status-message status-error">{message}</p>}
        {!product && !message && <p className="status-message">Cargando producto...</p>}

        {product && (
          <section className="detail-layout">
            <div
              className="detail-image product-image"
              style={{ backgroundImage: `url(${product.image})` }}
              aria-label={product.name}
            />

            <div className="detail-info">
              <p className="eyebrow">{product.format}</p>
              <h1>{product.name}</h1>
              <p>{product.artist}</p>
              <p>{product.description}</p>
              <p>Stock: {product.stock}</p>
              <h2>${Number(product.price).toFixed(2)}</h2>

              <div className="detail-buttons">
                <Link className="button-link" to="/cart">Agregar al Carrito</Link>
                <Link className="button-link secondary-button" to="/products">Volver a Productos</Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default ProductDetail;
