import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';

const emptyForm = { name: '', products: '', category: '', price: '', stock: '', description: '' };

function AdminBundleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api.getBundle(id)
      .then((response) => setForm({ ...emptyForm, ...response.data }))
      .catch((error) => setMessage(error.message));
  }, [editing, id]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      if (editing) await api.updateBundle(id, form);
      else await api.createBundle(form);
      navigate('/admin/bundles');
    } catch (error) {
      setMessage(error.message);
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-header"><div><p className="eyebrow">Bundles JSX</p><h1>{editing ? 'Editar bundle' : 'Registrar bundle'}</h1></div></div>
      {message && <p className="status-message status-error">{message}</p>}
      <div className="register-layout">
        <form className="form-box" onSubmit={submit}>
          <label>Nombre</label><input name="name" value={form.name} onChange={change} required />
          <label>Productos incluidos</label><input name="products" value={form.products} onChange={change} required />
          <label>Categoría</label><input name="category" value={form.category} onChange={change} />
          <label>Precio</label><input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required />
          <label>Stock</label><input name="stock" type="number" min="0" value={form.stock} onChange={change} required />
          <label>Descripción</label><textarea name="description" value={form.description} onChange={change} />
          <div className="admin-form-buttons"><button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar bundle'}</button><button type="button" className="secondary-button" onClick={() => navigate('/admin/bundles')}>Cancelar</button></div>
        </form>
        <article className="preview-card"><div className="image-placeholder">Bundle</div><h3>{form.name || 'Vista previa del bundle'}</h3><p>{form.products || 'Productos incluidos'}</p><p>${Number(form.price || 0).toFixed(2)}</p></article>
      </div>
    </>
  );
}

export default AdminBundleForm;
