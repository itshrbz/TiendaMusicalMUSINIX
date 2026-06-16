import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = async () => {
    try {
      const response = await api.getEvents();
      setEvents(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  useEffect(() => {
    let active = true;
    api.getEvents()
      .then((response) => { if (active) setEvents(response.data); })
      .catch((error) => { if (active) setMessage({ type: 'error', text: error.message }); });
    return () => { active = false; };
  }, []);

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este evento?')) return;
    try {
      const response = await api.deleteEvent(id);
      setMessage({ type: 'success', text: response.message });
      await load();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <>
      <div className="admin-header">
        <div><p className="eyebrow">Promociones</p><h1>Eventos y descuentos</h1></div>
        <Link className="button-link" to="/admin/events/new">Agregar evento</Link>
      </div>
      {message.text && <p className={`status-message status-${message.type}`}>{message.text}</p>}
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Evento</th><th>Descripción</th><th>Descuento</th><th>Inicio</th><th>Fin</th><th>Opciones</th></tr></thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.name}</td><td>{event.description}</td><td>{Number(event.discount || 0)}%</td><td>{event.start_date || event.date}</td><td>{event.end_date || event.date}</td>
                <td className="admin-actions"><Link className="admin-small-link" to={`/admin/events/${event.id}/edit`}>Editar</Link><button type="button" className="danger-button" onClick={() => remove(event.id)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminEvents;
