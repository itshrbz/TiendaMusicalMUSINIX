import { Link } from 'react-router-dom';

function Payment() {
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
        <section className="section">
          <h1>Pago</h1>

          <div className="cart-layout">
            <form className="form-box">
              <h2>Tarjeta de Crédito o Débito</h2>

              <label>Nombre del titular de la tarjeta</label>
              <input type="text" />

              <label>Número de tarjeta</label>
              <input type="text" />

              <label>Fecha de vencimiento</label>
              <input type="text" />

              <label>CVV</label>
              <input type="text" />
            </form>

            <div className="summary-box">
              <h2>Resumen del Pago</h2>
              <p>Productos: $35.00</p>
              <p>Envío: $5.00</p>
              <h3>Total: $40.00</h3>
              <Link className="button-link" to="/invoice">Confirmar Pago</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Payment;