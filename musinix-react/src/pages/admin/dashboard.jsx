import { useEffect, useState } from 'react';
import { api } from '../../services/api';

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getDashboard()
      .then((response) => setData(response.data))
      .catch((error) => setMessage(error.message));
  }, []);

  return (
    <>
      <div className="admin-header">
        <div>
          <p className="eyebrow">Panel administrativo React</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      {message && <p className="status-message status-error">{message}</p>}
      {!data && !message && <p className="status-message">Cargando resumen...</p>}

      {data && (
        <>
          <div className="admin-stat-grid">
            <article className="info-card"><h3>Ventas totales</h3><p>${Number(data.total_sales).toFixed(2)}</p></article>
            <article className="info-card"><h3>Usuarios</h3><p>{data.users} registrados</p></article>
            <article className="info-card"><h3>Productos</h3><p>{data.products} productos</p></article>
            <article className="info-card"><h3>Canciones</h3><p>{data.songs} canciones</p></article>
          </div>

          <p className="admin-storage-note">Almacenamiento de usuarios y canciones: <strong>{data.database}</strong></p>

          <section className="section admin-section">
            <h2>Actividad reciente</h2>
            <div className="table-wrapper">
              <table className="table">
                <thead><tr><th>Fecha</th><th>Actividad</th><th>Responsable</th></tr></thead>
                <tbody>
                  {data.recent_activity.map((item, index) => (
                    <tr key={`${item.date}-${index}`}>
                      <td>{item.date}</td><td>{item.activity}</td><td>{item.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default AdminDashboard;
