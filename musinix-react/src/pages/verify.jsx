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
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </header>

      <main className="container">
        <section className="form-section">
          <h1>Account Verification</h1>
          <p>Enter the verification code sent to your email.</p>

          <form className="center-form">
            <label>Verification code</label>
            <input type="text" />

            <button type="button">Verify Account</button>

            <p><Link to="/login">Back to login</Link></p>
          </form>
        </section>
      </main>
    </>
  );
}

export default Verification;