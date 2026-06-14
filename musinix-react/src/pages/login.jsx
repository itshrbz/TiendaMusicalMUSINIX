import { Link } from 'react-router-dom';

function Login() {
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
        </nav>
      </header>

      <main className="container">
        <section className="form-section">
          <h1>Login</h1>
          <p>Enter your account to continue.</p>

          <form className="center-form">
            <label>Email</label>
            <input type="email" />

            <label>Password</label>
            <input type="password" />

            <Link className="button-link" to="/profile">Login</Link>

            <p>Do not have an account? <Link to="/register">Register</Link></p>
          </form>
        </section>
      </main>
    </>
  );
}

export default Login;