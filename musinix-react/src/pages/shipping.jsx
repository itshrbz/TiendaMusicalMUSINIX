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
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/contact">Contact</Link>
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
    </>
  );
}

export default Shipping;
