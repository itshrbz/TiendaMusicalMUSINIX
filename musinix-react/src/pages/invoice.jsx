import { Link } from 'react-router-dom';

function Invoice() {
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
        <section className="invoice-box">
          <h1>Gracias por tu compra</h1>
          <p>Tu compra se ha completado correctamente.</p>

          <div className="invoice-data">
            <div>
              <h3>Tienda Musinix</h3>
              <p>Tienda de música en línea</p>
              <p>Cochabamba, Bolivia</p>
            </div>

            <div>
              <h3>Cliente</h3>
              <p>Jairo Marquez</p>
              <p>jairo@email.com</p>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Album Digital</td>
                <td>Digital</td>
                <td>1</td>
                <td>$10.00</td>
              </tr>
              <tr>
                <td>Vinyl Paquete</td>
                <td>Físico</td>
                <td>1</td>
                <td>$25.00</td>
              </tr>
            </tbody>
          </table>

          <div className="total-box">
            <p>Subtotal: $35.00</p>
            <p>Envio: $5.00</p>
            <h2>Total: $40.00</h2>
          </div>

          <div className="invoice-buttons">
            <button type="button">Descargar PDF</button>
            <Link className="button-link" to="/shop">Volver a la tienda</Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default Invoice;