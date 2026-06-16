const API_URL = import.meta.env.VITE_API_URL
  || 'http://localhost/TiendaMusicalMUSINIX/backend/api.php';

async function request(resource, { method = 'GET', params = {}, body } = {}) {
  const url = new URL(API_URL);
  url.searchParams.set('resource', resource);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('El backend no devolvió una respuesta JSON válida.');
  }

  if (!response.ok || !result.ok) {
    throw new Error(result.message || 'Ocurrió un error al consultar el backend.');
  }

  return result;
}

export const api = {
  health: () => request('health'),
  getDashboard: () => request('dashboard'),

  getProducts: (filters = {}) => request('products', { params: filters }),
  getProduct: (id) => request('products', { params: { id } }),
  createProduct: (data) => request('products', { method: 'POST', body: data }),
  updateProduct: (id, data) => request('products', { method: 'PUT', params: { id }, body: data }),
  deleteProduct: (id) => request('products', { method: 'DELETE', params: { id } }),

  getEvents: (filters = {}) => request('events', { params: filters }),
  getEvent: (id) => request('events', { params: { id } }),
  createEvent: (data) => request('events', { method: 'POST', body: data }),
  updateEvent: (id, data) => request('events', { method: 'PUT', params: { id }, body: data }),
  deleteEvent: (id) => request('events', { method: 'DELETE', params: { id } }),

  getBundles: (filters = {}) => request('bundles', { params: filters }),
  getBundle: (id) => request('bundles', { params: { id } }),
  createBundle: (data) => request('bundles', { method: 'POST', body: data }),
  updateBundle: (id, data) => request('bundles', { method: 'PUT', params: { id }, body: data }),
  deleteBundle: (id) => request('bundles', { method: 'DELETE', params: { id } }),

  getSales: () => request('sales'),

  getUsers: (filters = {}) => request('users', { params: filters }),
  getUser: (id) => request('users', { params: { id } }),
  createUser: (data) => request('users', { method: 'POST', body: data }),
  updateUser: (id, data) => request('users', { method: 'PUT', params: { id }, body: data }),
  deleteUser: (id) => request('users', { method: 'DELETE', params: { id } }),

  getSongs: (filters = {}) => request('songs', { params: filters }),
  getSong: (id) => request('songs', { params: { id } }),
  createSong: (data) => request('songs', { method: 'POST', body: data }),
  updateSong: (id, data) => request('songs', { method: 'PUT', params: { id }, body: data }),
  deleteSong: (id) => request('songs', { method: 'DELETE', params: { id } }),

  sendContact: (data) => request('contact', { method: 'POST', body: data }),
  saveShipping: (data) => request('shipping', { method: 'POST', body: data }),
  searchAddress: (query) => request('geocode', { params: { q: query } }),
  reverseGeocode: (lat, lon) => request('reverse', { params: { lat, lon } }),
};
