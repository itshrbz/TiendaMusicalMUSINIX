import { Link } from 'react-router-dom';

function Profile() {
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
          <Link to="/library">Library</Link>
          <Link to="/history">History</Link>
          <Link className="btn-nav" to="/login">Logout</Link>
        </nav>
      </header>

      <main className="container">
        <section className="form-section">
          <h1>User Profile</h1>
          <p>Manage your personal information.</p>

          <form className="center-form">
            <label>Full name</label>
            <input type="text" defaultValue="Jairo Marquez" />

            <label>Email</label>
            <input type="email" defaultValue="jairo@email.com" />

            <label>Phone</label>
            <input type="text" defaultValue="+591 70000000" />

            <label>Default city</label>
            <input type="text" defaultValue="Cochabamba" />

            <button type="button">Save Changes</button>
          </form>
        </section>
      </main>
    </>
  );
}

export default Profile;