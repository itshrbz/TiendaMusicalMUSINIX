import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';

const emptyForm = { title: '', artist: '', album: '', genre: '', duration: '', price: '', cover_url: '', audio_url: '', active: '1' };

function AdminSongForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api.getSong(id)
      .then((response) => setForm({ ...emptyForm, ...response.data, active: String(response.data.active) }))
      .catch((error) => setMessage(error.message));
  }, [editing, id]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      if (editing) await api.updateSong(id, form);
      else await api.createSong(form);
      navigate('/admin/songs');
    } catch (error) {
      setMessage(error.message);
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-header"><div><p className="eyebrow">API de canciones</p><h1>{editing ? 'Editar canción' : 'Registrar canción'}</h1></div></div>
      {message && <p className="status-message status-error">{message}</p>}
      <div className="register-layout">
        <form className="form-box" onSubmit={submit}>
          <label>Título</label><input name="title" value={form.title} onChange={change} required />
          <label>Artista</label><input name="artist" value={form.artist} onChange={change} required />
          <label>Álbum</label><input name="album" value={form.album} onChange={change} />
          <label>Género</label><input name="genre" value={form.genre} onChange={change} />
          <label>Duración</label><input name="duration" placeholder="3:45" value={form.duration} onChange={change} />
          <label>Precio</label><input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required />
          <label>URL de portada</label><input name="cover_url" value={form.cover_url} onChange={change} />
          <label>URL del audio</label><input name="audio_url" value={form.audio_url} onChange={change} />
          <label>Estado</label><select name="active" value={form.active} onChange={change}><option value="1">Activa</option><option value="0">Inactiva</option></select>
          <div className="admin-form-buttons"><button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar canción'}</button><button type="button" className="secondary-button" onClick={() => navigate('/admin/songs')}>Cancelar</button></div>
        </form>
        <article className="preview-card">
          <div className="image-placeholder product-image" style={form.cover_url ? { backgroundImage: `url(${form.cover_url})` } : undefined}>{!form.cover_url && 'Portada'}</div>
          <h3>{form.title || 'Vista previa de la canción'}</h3><p>{form.artist || 'Artista'}</p><p>{form.album || 'Álbum'} · {form.duration || '0:00'}</p>
        </article>
      </div>
    </>
  );
}

export default AdminSongForm;
