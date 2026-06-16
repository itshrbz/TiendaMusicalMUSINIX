import { useEffect, useState } from 'react';
import { api } from '../../services/api';

function AdminSales() {
  const [sales, setSales] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getSales()
      .then((response) => setSales(response.data))
      .catch((error) => setMessage(error.message));
  }, []);

  return (
    <>
      <div className="admin-header"><div><p className="eyebrow">Administración</p><h1>Historial de ventas</h1></div></div>
      {message && <p className="status-message status-error">{message}</p>}
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Pedido</th><th>Usuario</th><th>Producto</th><th>Tipo</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.order_number}</td><td>{sale.user}</td><td>{sale.product}</td><td>{sale.type}</td>
                <td>${Number(sale.total).toFixed(2)}</td><td><span className="admin-badge">{sale.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminSales;
