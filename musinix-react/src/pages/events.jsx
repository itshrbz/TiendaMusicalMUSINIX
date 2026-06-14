import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function Events() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getEvents()
      .then((response) => setEvents(response.data))
      .catch((error) => setMessage(error.message));
  }, []);

  return (
    <>
      <header className="navbar">
        <div className="logo">✦ Musinix</div>
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
          <p>Eventos cargados desde la API PHP.</p>

          {message && <p className="status-message status-error">{message}</p>}
          {!message && events.length === 0 && <p className="status-message">Loading events...</p>}

          <div className="product-grid">
            {events.map((event) => (
              <article className="product-card" key={event.id}>
                <div className="image-placeholder event-image">{event.type}</div>
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <p>Date: {new Date(`${event.date}T12:00:00`).toLocaleDateString('es-BO')}</p>
                <Link className="button-link" to="/products">View Products</Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Events;
