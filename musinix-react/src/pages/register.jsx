import React from 'react';
import { Link } from 'react-router-dom';

function Register() {
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
          <h1>Create Account</h1>
          <p>Create your account to buy music products.</p>

          <form className="center-form">
            <label>Full name</label>
            <input type="text" />

            <label>Email</label>
            <input type="email" />

            <label>Phone</label>
            <input type="text" />

            <label>Password</label>
            <input type="password" />

            <label>Confirm password</label>
            <input type="password" />

            <Link className="button-link" to="/verify">Create Account</Link>

            <p>Already have an account? <Link to="/login">Login</Link></p>
          </form>
        </section>
      </main>
    </>
  );
}

export default Register;