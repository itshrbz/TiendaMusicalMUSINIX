import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';

const emptyForm = {
  name: '', artist: '', category: '', format: 'Digital', price: '', stock: '', description: '', image: '',
};

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api.getProduct(id)
      .then((response) => setForm({ ...emptyForm, ...response.data }))
      .catch((error) => setMessage(error.message));
  }, [editing, id]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      if (editing) await api.updateProduct(id, form);
      else await api.createProduct(form);
      navigate('/admin/products');
    } catch (error) {
      setMessage(error.message);
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-header"><div><p className="eyebrow">Productos JSX</p><h1>{editing ? 'Editar producto' : 'Registrar producto'}</h1></div></div>
      {message && <p className="status-message status-error">{message}</p>}
      <div className="register-layout">
        <form className="form-box" onSubmit={submit}>
          <label>Nombre</label><input name="name" value={form.name} onChange={change} required />
          <label>Artista</label><input name="artist" value={form.artist} onChange={change} required />
          <label>Categoría</label><input name="category" value={form.category} onChange={change} />
          <label>Formato</label><select name="format" value={form.format} onChange={change}><option>Digital</option><option>Vinyl</option><option>CD</option><option>Cassette</option></select>
          <label>Precio</label><input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required />
          <label>Stock</label><input name="stock" type="number" min="0" value={form.stock} onChange={change} required />
          <label>URL de imagen</label><input name="image" value={form.image} onChange={change} />
          <label>Descripción</label><textarea name="description" value={form.description} onChange={change} />
          <div className="admin-form-buttons"><button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar producto'}</button><button type="button" className="secondary-button" onClick={() => navigate('/admin/products')}>Cancelar</button></div>
        </form>
        <article className="preview-card">
          <div className="image-placeholder product-image" style={form.image ? { backgroundImage: `url(${form.image})` } : undefined}> {!form.image && 'Imagen'} </div>
          <h3>{form.name || 'Vista previa del producto'}</h3>
          <p>{form.artist || 'Nombre del artista'}</p><p>{form.format} · ${Number(form.price || 0).toFixed(2)}</p>
        </article>
      </div>
    </>
  );
}

export default AdminProductForm;
