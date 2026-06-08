import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Shipping() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Inicializar el mapa
    const centroInicial = [-17.3935, -66.1570];
    mapRef.current = L.map('map').setView(centroInicial, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapRef.current);

    // Crear marcador arrastrable
    markerRef.current = L.marker(centroInicial, { draggable: true }).addTo(mapRef.current);

    const actualizarInputs = (lat, lng) => {
      document.getElementById('lat-display').value = lat.toFixed(6);
      document.getElementById('lng-display').value = lng.toFixed(6);
    };

    actualizarInputs(centroInicial[0], centroInicial[1]);

    markerRef.current.on('dragend', (e) => {
      const posicion = markerRef.current.getLatLng();
      actualizarInputs(posicion.lat, posicion.lng);
    });

    mapRef.current.on('click', (e) => {
      markerRef.current.setLatLng(e.latlng);
      actualizarInputs(e.latlng.lat, e.latlng.lng);
    });

    // Limpieza al desmontar
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Ubicación guardada:\nLat: ${document.getElementById('lat-display').value}\nLng: ${document.getElementById('lng-display').value}`);
  };

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
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      <main className="checkout-container">
        <h1 className="page-title">Envío</h1>

        <div className="checkout-layout">
          <form className="shipping-form" onSubmit={handleSubmit}>
            <div>
              <h2 className="section-subtitle">Información del destinatario</h2>
              <p style={{ fontSize: '14px', color: '#757575', marginBottom: '20px' }}>Ingresa los datos de quién recibirá el paquete físico.</p>
            </div>

            <div className="form-group">
              <label htmlFor="fullname">Nombre de quien recibe</label>
              <input type="text" id="fullname" placeholder="Ej. Cristian Soria" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Teléfono de contacto</label>
                <input type="tel" id="phone" placeholder="Ej. +591 71234567" required />
              </div>
              <div className="form-group">
                <label htmlFor="shipping-method">Método de entrega</label>
                <select id="shipping-method">
                  <option value="standard">Envío Estándar (3-5 días)</option>
                  <option value="express">Envío Exprés (24 horas)</option>
                </select>
              </div>
            </div>

            <div className="map-box-wrapper">
              <label>Ubicación exacta de entrega</label>
              <p className="map-instruction">Haz clic en cualquier punto del mapa o arrastra el marcador para fijar tu ubicación exacta de entrega.</p>
              
              <div id="map" style={{ height: '300px', width: '100%' }}></div>

              <div className="form-row" style={{ marginTop: '15px' }}>
                <div className="form-group">
                  <label>Latitud elegida</label>
                  <input type="text" id="lat-display" placeholder="Marcando en el mapa..." readOnly />
                </div>
                <div className="form-group">
                  <label>Longitud elegida</label>
                  <input type="text" id="lng-display" placeholder="Marcando en el mapa..." readOnly />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="references">Referencias adicionales</label>
              <textarea id="references" rows="3" placeholder="Ej. Edificio Las Torres, Departamento 4B. Portón de color negro."></textarea>
            </div>
            
            {/* Botón movido fuera del formulario si es necesario, o manejado vía onSubmit */}
          </form>

          <div className="order-summary">
            <h3 className="summary-title">Tu Pedido</h3>
            <div className="summary-row">
              <span>Mili Bundle (Físico)</span>
              <span>$95.00</span>
            </div>
            <div className="summary-row">
              <span>Gorillaz Pack (Digital)</span>
              <span>$95.00</span>
            </div>
            <div className="summary-row" style={{ borderTop: '1px dashed #e0e0e0', paddingTop: '15px', marginTop: '15px' }}>
              <span>Subtotal</span>
              <span>$190.00</span>
            </div>
            <div className="summary-row">
              <span>Costo de envío</span>
              <span>$0.00</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>$190.00</span>
            </div>
            <button type="button" className="btn-submit" onClick={handleSubmit}>Continuar al Pago</button>
          </div>
        </div>
      </main>
      {/* Footer omitido por brevedad, igual a los anteriores */}
    </>
  );
}

export default Shipping;