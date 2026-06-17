import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

function AdminBundles() {
  const [bundles, setBundles] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = async () => {
    try {
      const response = await api.getBundles();
      setBundles(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  useEffect(() => {
    let active = true;
    api.getBundles()
      .then((response) => { if (active) setBundles(response.data); })
      .catch((error) => { if (active) setMessage({ type: 'error', text: error.message }); });
    return () => { active = false; };
  }, []);

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este bundle?')) return;
    try {
      const response = await api.deleteBundle(id);
      setMessage({ type: 'success', text: response.message });
      await load();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <>
      <div className="admin-header">
        <div><p className="eyebrow">Paquetes</p><h1>Control de bundles</h1></div>
        <Link className="button-link" to="/admin/bundles/new">Agregar bundle</Link>
      </div>
      {message.text && <p className={`status-message status-${message.type}`}>{message.text}</p>}
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Nombre</th><th>Productos</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Opciones</th></tr></thead>
          <tbody>
            {bundles.map((bundle) => (
              <tr key={bundle.id}>
                <td>{bundle.name}</td><td>{bundle.products}</td><td>{bundle.category || '-'}</td><td>${Number(bundle.price).toFixed(2)}</td><td>{bundle.stock}</td>
                <td className="admin-actions"><Link className="admin-small-link" to={`/admin/bundles/${bundle.id}/edit`}>Editar</Link><button type="button" className="danger-button" onClick={() => remove(bundle.id)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminBundles;
