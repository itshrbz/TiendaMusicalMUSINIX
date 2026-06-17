import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { api } from '../services/api';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const initialPosition = { lat: -17.3935, lng: -66.1570 };

function Shipping() {
  const navigate = useNavigate();
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [position, setPosition] = useState(initialPosition);
  const [address, setAddress] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    recipient_name: '',
    phone: '',
    shipping_method: 'standard',
    references: '',
  });

  const updatePosition = async (lat, lng, findAddress = true) => {
    const nextPosition = { lat: Number(lat), lng: Number(lng) };
    setPosition(nextPosition);
    markerRef.current?.setLatLng([nextPosition.lat, nextPosition.lng]);

    if (findAddress) {
      try {
        const response = await api.reverseGeocode(nextPosition.lat, nextPosition.lng);
        setAddress(response.data.display_name);
      } catch {
        setAddress('No se pudo obtener la dirección escrita. Las coordenadas sí fueron seleccionadas.');
      }
    }
  };

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) {
      return undefined;
    }

    const map = L.map(mapElementRef.current).setView([initialPosition.lat, initialPosition.lng], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([initialPosition.lat, initialPosition.lng], {
      draggable: true,
      title: 'Ubicación de entrega',
      alt: 'Marcador de ubicación de entrega',
    }).addTo(map);

    marker.on('dragend', () => {
      const next = marker.getLatLng();
      updatePosition(next.lat, next.lng);
    });

    map.on('click', (event) => {
      updatePosition(event.latlng.lat, event.latlng.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;
    updatePosition(initialPosition.lat, initialPosition.lng);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  const handleFieldChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleAddressSearch = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      const response = await api.searchAddress(search);
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setStatus({ type: 'error', message: 'No se encontraron resultados en Bolivia.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  const selectSearchResult = (result) => {
    setAddress(result.display_name);
    setSearch(result.display_name);
    setSearchResults([]);
    updatePosition(result.lat, result.lon, false);
    mapRef.current?.setView([result.lat, result.lon], 17);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await api.saveShipping({
        ...form,
        address,
        latitude: position.lat,
        longitude: position.lng,
      });
      setStatus({ type: 'success', message: response.message });
      sessionStorage.setItem('musinixShipping', JSON.stringify(response.data));
      navigate('/payment');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setSaving(false);
    }
  };

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

      <main className="checkout-container">
        <h1 className="page-title">Envío</h1>

        <div className="checkout-layout">
          <form className="shipping-form" onSubmit={handleSubmit}>
            <div>
              <h2 className="section-subtitle">Información del destinatario</h2>
              <p className="form-help">Ingresa los datos de quien recibirá el paquete físico.</p>
            </div>

            <div className="form-group">
              <label htmlFor="recipient-name">Nombre de quien recibe</label>
              <input id="recipient-name" name="recipient_name" type="text" value={form.recipient_name} onChange={handleFieldChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Teléfono de contacto</label>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleFieldChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="shipping-method">Método de entrega</label>
                <select id="shipping-method" name="shipping_method" value={form.shipping_method} onChange={handleFieldChange}>
                  <option value="standard">Envío Estándar (3-5 días)</option>
                  <option value="express">Envío Exprés (24 horas)</option>
                </select>
              </div>
            </div>

            <div className="map-box-wrapper">
              <label>Ubicación exacta de entrega</label>
              <p className="map-instruction">Busca una dirección o selecciona un punto directamente en el mapa.</p>

              <div className="map-search-row">
                <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ej. Plaza Colón, Cochabamba" />
                <button type="button" onClick={handleAddressSearch}>Buscar</button>
              </div>

              {searchResults.length > 0 && (
                <div className="map-results">
                  {searchResults.map((result) => (
                    <button key={`${result.lat}-${result.lon}`} type="button" onClick={() => selectSearchResult(result)}>
                      {result.display_name}
                    </button>
                  ))}
                </div>
              )}

              <div ref={mapElementRef} id="map" />

              <div className="selected-address">
                <strong>Dirección seleccionada:</strong>
                <span>{address || 'Seleccionando dirección...'}</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Latitud elegida</label>
                  <input type="text" value={position.lat.toFixed(6)} readOnly />
                </div>
                <div className="form-group">
                  <label>Longitud elegida</label>
                  <input type="text" value={position.lng.toFixed(6)} readOnly />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="references">Referencias adicionales</label>
              <textarea id="references" name="references" rows="3" value={form.references} onChange={handleFieldChange} />
            </div>

            {status.message && <p className={`status-message status-${status.type}`}>{status.message}</p>}
            <button type="submit" className="btn-submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Continuar al Pago'}
            </button>
          </form>

          <div className="order-summary">
            <h3 className="summary-title">Tu Pedido</h3>
            <div className="summary-row"><span>Mili Bundle</span><span>$95.00</span></div>
            <div className="summary-row"><span>Gorillaz Pack</span><span>$95.00</span></div>
            <div className="summary-row total"><span>Total</span><span>$190.00</span></div>
          </div>
        </div>
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
          <p>Tienda de música en línea</p>
        </div>

        <div>
          <h4>Soporte</h4>
          <Link to="/contact" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Contacto
          </Link>
          <Link to="/shipping" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            Envío
          </Link>
          <Link to="/payment" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            Pago
          </Link>
        </div>

        <div>
          <h4>Compania</h4>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Sobre nosotros
          </Link>
          <Link to="/events" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Eventos
          </Link>
          <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08"></polygon><polygon points="12 22.08 21 17.08 21 6.92 12 12 12 22.08"></polygon><polygon points="12 12 21 6.92 12 1.92 3 6.92 12 12"></polygon></svg>
            Paquetes
          </Link>
        </div>

        <div>
          <h4>Siguenos</h4>
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

export default Shipping;
