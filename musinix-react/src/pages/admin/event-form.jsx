import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';

const emptyForm = { name: '', description: '', type: 'Promoción', discount: '', start_date: '', end_date: '' };

function AdminEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api.getEvent(id)
      .then((response) => {
        const event = response.data;
        setForm({ ...emptyForm, ...event, start_date: event.start_date || event.date || '', end_date: event.end_date || event.date || '' });
      })
      .catch((error) => setMessage(error.message));
  }, [editing, id]);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      if (editing) await api.updateEvent(id, form);
      else await api.createEvent(form);
      navigate('/admin/events');
    } catch (error) {
      setMessage(error.message);
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-header"><div><p className="eyebrow">Eventos JSX</p><h1>{editing ? 'Editar evento' : 'Registrar evento'}</h1></div></div>
      {message && <p className="status-message status-error">{message}</p>}
      <div className="register-layout">
        <form className="form-box" onSubmit={submit}>
          <label>Nombre</label><input name="name" value={form.name} onChange={change} required />
          <label>Tipo</label><input name="type" value={form.type} onChange={change} />
          <label>Descripción</label><textarea name="description" value={form.description} onChange={change} />
          <label>Porcentaje de descuento</label><input name="discount" type="number" min="0" max="100" value={form.discount} onChange={change} required />
          <label>Fecha de inicio</label><input name="start_date" type="date" value={form.start_date} onChange={change} required />
          <label>Fecha de fin</label><input name="end_date" type="date" value={form.end_date} onChange={change} required />
          <div className="admin-form-buttons"><button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar evento'}</button><button type="button" className="secondary-button" onClick={() => navigate('/admin/events')}>Cancelar</button></div>
        </form>
        <article className="preview-card"><div className="image-placeholder event-image">{form.type || 'Evento'}</div><h3>{form.name || 'Vista previa del evento'}</h3><p>{form.description || 'Descripción del evento'}</p><p>{Number(form.discount || 0)}% de descuento</p></article>
      </div>
    </>
  );
}

export default AdminEventForm;
