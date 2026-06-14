import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await api.sendContact(form);
      setStatus({ type: 'success', message: response.message });
      setForm(initialForm);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="logo">✦ Musinix</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/contact">Contact</Link>
          <Link className="btn-nav" to="/login">Login</Link>
        </nav>
      </header>

      <main className="container">
        <section className="section">
          <h1>Contact Us</h1>
          <p>El formulario guarda los mensajes mediante el backend PHP.</p>

          <div className="contact-box">
            <div className="contact-info">
              <h2>Get in touch with us today</h2>
              <p>support@musinix.com</p>
              <p>+591 70000000</p>
              <p>Cochabamba, Bolivia</p>
            </div>

            <form className="form-box" onSubmit={handleSubmit}>
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" value={form.name} onChange={handleChange} required />

              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} required />

              <label htmlFor="contact-phone">Phone</label>
              <input id="contact-phone" name="phone" type="text" value={form.phone} onChange={handleChange} />

              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} required />

              {status.message && (
                <p className={`status-message status-${status.type}`}>{status.message}</p>
              )}

              <button type="submit" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default Contact;
