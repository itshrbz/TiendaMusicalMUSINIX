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
  getProducts: (filters = {}) => request('products', { params: filters }),
  getProduct: (id) => request('products', { params: { id } }),
  getEvents: () => request('events'),
  sendContact: (data) => request('contact', { method: 'POST', body: data }),
  saveShipping: (data) => request('shipping', { method: 'POST', body: data }),
  searchAddress: (query) => request('geocode', { params: { q: query } }),
  reverseGeocode: (lat, lon) => request('reverse', { params: { lat, lon } }),
};
