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
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/cart">Cart</Link>
        </nav>
      </header>

      <main className="container">
        <section className="section">
          <h1>Payment</h1>

          <div className="cart-layout">
            <form className="form-box">
              <h2>Credit or Debit Card</h2>

              <label>Card holder name</label>
              <input type="text" />

              <label>Card number</label>
              <input type="text" />

              <label>Expiration date</label>
              <input type="text" />

              <label>CVV</label>
              <input type="text" />
            </form>

            <div className="summary-box">
              <h2>Payment Summary</h2>
              <p>Products: $35.00</p>
              <p>Shipping: $5.00</p>
              <h3>Total: $40.00</h3>
              <Link className="button-link" to="/invoice">Confirm Payment</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Payment;