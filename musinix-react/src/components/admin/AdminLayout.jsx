import { NavLink, Outlet } from 'react-router-dom';

const menu = [
  ['Dashboard', '/admin/dashboard'],
  ['Ventas', '/admin/sales'],
  ['Usuarios', '/admin/users'],
  ['Productos', '/admin/products'],
  ['Canciones', '/admin/songs'],
  ['Bundles', '/admin/bundles'],
  ['Eventos', '/admin/events'],
];

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>Musinix Admin</h2>
        {menu.map(([label, path]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {label}
          </NavLink>
        ))}
        <NavLink to="/">Volver a la tienda</NavLink>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
