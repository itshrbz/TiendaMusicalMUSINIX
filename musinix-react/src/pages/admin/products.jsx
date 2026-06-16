import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = async () => {
    try {
      const response = await api.getProducts();
      setProducts(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  useEffect(() => {
    let active = true;
    api.getProducts()
      .then((response) => { if (active) setProducts(response.data); })
      .catch((error) => { if (active) setMessage({ type: 'error', text: error.message }); });
    return () => { active = false; };
  }, []);

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      const response = await api.deleteProduct(id);
      setMessage({ type: 'success', text: response.message });
      await load();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <>
      <div className="admin-header">
        <div><p className="eyebrow">Catálogo</p><h1>Inventario de productos</h1></div>
        <Link className="button-link" to="/admin/products/new">Agregar producto</Link>
      </div>
      {message.text && <p className={`status-message status-${message.type}`}>{message.text}</p>}
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Producto</th><th>Artista</th><th>Formato</th><th>Precio</th><th>Stock</th><th>Opciones</th></tr></thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td><td>{product.artist}</td><td>{product.format}</td>
                <td>${Number(product.price).toFixed(2)}</td><td>{product.stock}</td>
                <td className="admin-actions">
                  <Link className="admin-small-link" to={`/admin/products/${product.id}/edit`}>Editar</Link>
                  <button type="button" className="danger-button" onClick={() => remove(product.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminProducts;
