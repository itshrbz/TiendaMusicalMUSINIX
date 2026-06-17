import { Link } from 'react-router-dom';

function Verification() {
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
        <section className="form-section">
          <h1>Verificación de Cuenta</h1>
          <p>Ingresa el código de verificación enviado a tu correo electrónico.</p>

          <form className="center-form">
            <label>Código de verificación</label>
            <input type="text" />

            <button type="button">Verificar Cuenta</button>

            <p><Link to="/login">Volver al inicio de sesión</Link></p>
          </form>
        </section>
      </main>
    </>
  );
}

export default Verification;