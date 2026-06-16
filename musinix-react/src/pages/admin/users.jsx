import { useEffect, useState } from 'react';
import { api } from '../../services/api';

const emptyForm = { name: '', email: '', password: '', role: 'user', status: 'active' };

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [storage, setStorage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    try {
      const response = await api.getUsers();
      setUsers(response.data);
      setStorage(response.storage);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  useEffect(() => {
    let active = true;
    api.getUsers()
      .then((response) => {
        if (active) {
          setUsers(response.data);
          setStorage(response.storage);
        }
      })
      .catch((error) => { if (active) setMessage({ type: 'error', text: error.message }); });
    return () => { active = false; };
  }, []);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const edit = (user) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, status: user.status });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const response = editingId
        ? await api.updateUser(editingId, form)
        : await api.createUser(form);
      setMessage({ type: 'success', text: response.message });
      reset();
      await loadUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      const response = await api.deleteUser(id);
      setMessage({ type: 'success', text: response.message });
      await loadUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <>
      <div className="admin-header">
        <div><p className="eyebrow">Base de datos de usuarios</p><h1>Control de usuarios</h1><p>Fuente actual: {storage || 'cargando...'}</p></div>
      </div>

      <form className="admin-inline-form" onSubmit={submit}>
        <input name="name" placeholder="Nombre" value={form.name} onChange={change} required />
        <input name="email" type="email" placeholder="Correo" value={form.email} onChange={change} required />
        <input name="password" type="password" placeholder={editingId ? 'Nueva contraseña (opcional)' : 'Contraseña mínima 8 caracteres'} value={form.password} onChange={change} required={!editingId} />
        <select name="role" value={form.role} onChange={change}><option value="user">Usuario</option><option value="admin">Administrador</option></select>
        <select name="status" value={form.status} onChange={change}><option value="active">Activo</option><option value="inactive">Inactivo</option></select>
        <button type="submit" disabled={saving}>{saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Registrar'}</button>
        {editingId && <button type="button" className="secondary-button" onClick={reset}>Cancelar</button>}
      </form>

      {message.text && <p className={`status-message status-${message.type}`}>{message.text}</p>}

      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Opciones</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.status}</td>
                <td className="admin-actions"><button type="button" onClick={() => edit(user)}>Editar</button><button type="button" className="danger-button" onClick={() => remove(user.id)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminUsers;
