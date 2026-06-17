import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

function AdminSongs() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState('');
  const [storage, setStorage] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const load = async (filters = {}) => {
    try {
      const response = await api.getSongs(filters);
      setSongs(response.data);
      setStorage(response.storage);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  useEffect(() => {
    let active = true;
    api.getSongs()
      .then((response) => {
        if (active) {
          setSongs(response.data);
          setStorage(response.storage);
        }
      })
      .catch((error) => { if (active) setMessage({ type: 'error', text: error.message }); });
    return () => { active = false; };
  }, []);

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar esta canción?')) return;
    try {
      const response = await api.deleteSong(id);
      setMessage({ type: 'success', text: response.message });
      await load();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <>
      <div className="admin-header">
        <div><p className="eyebrow">API PHP de canciones</p><h1>Canciones</h1><p>Fuente actual: {storage || 'cargando...'}</p></div>
        <Link className="button-link" to="/admin/songs/new">Agregar canción</Link>
      </div>

      <form className="admin-search" onSubmit={(event) => { event.preventDefault(); load({ search }); }}>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por título, artista o álbum" />
        <button type="submit">Buscar</button>
        <button type="button" className="secondary-button" onClick={() => { setSearch(''); load(); }}>Limpiar</button>
      </form>

      {message.text && <p className={`status-message status-${message.type}`}>{message.text}</p>}
      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Título</th><th>Artista</th><th>Álbum</th><th>Género</th><th>Duración</th><th>Precio</th><th>Opciones</th></tr></thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id}>
                <td>{song.title}</td><td>{song.artist}</td><td>{song.album || '-'}</td><td>{song.genre || '-'}</td><td>{song.duration || '-'}</td><td>${Number(song.price).toFixed(2)}</td>
                <td className="admin-actions"><Link className="admin-small-link" to={`/admin/songs/${song.id}/edit`}>Editar</Link><button type="button" className="danger-button" onClick={() => remove(song.id)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminSongs;
