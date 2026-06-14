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
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/history">History</Link>
        </nav>
      </header>

      <main className="container">
        <section className="invoice-box">
          <h1>Thanks for your order</h1>
          <p>Your purchase was completed successfully.</p>

          <div className="invoice-data">
            <div>
              <h3>Musinix Store</h3>
              <p>Online Music Shop</p>
              <p>Cochabamba, Bolivia</p>
            </div>

            <div>
              <h3>Customer</h3>
              <p>Jairo Marquez</p>
              <p>jairo@email.com</p>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Digital Album</td>
                <td>Digital</td>
                <td>1</td>
                <td>$10.00</td>
              </tr>
              <tr>
                <td>Vinyl Bundle</td>
                <td>Physical</td>
                <td>1</td>
                <td>$25.00</td>
              </tr>
            </tbody>
          </table>

          <div className="total-box">
            <p>Subtotal: $35.00</p>
            <p>Shipping: $5.00</p>
            <h2>Total: $40.00</h2>
          </div>

          <div className="invoice-buttons">
            <button type="button">Download PDF</button>
            <Link className="button-link" to="/shop">Back to shop</Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default Invoice;