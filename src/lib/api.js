// All API calls go through this client
// This makes it easy to swap the backend URL and handle errors consistently

const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('btl_token');
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

// ── SEARCH ────────────────────────────────────────────────────────
export const search = {
  query: (params) => request(`/search?${new URLSearchParams(params)}`),
  similar: (productId) => request(`/search/similar/${productId}`),
};

// ── BRANDS ───────────────────────────────────────────────────────
export const brands = {
  list: (params = {}) => request(`/brands?${new URLSearchParams(params)}`),
  get: (slug) => request(`/brands/${slug}`),
  apply: (data) => request('/brands/apply', { method: 'POST', body: data }),
};

// ── USERS ─────────────────────────────────────────────────────────
export const users = {
  me: () => request('/users/me'),
  update: (data) => request('/users/me', { method: 'PATCH', body: data }),
  connectPinterest: (boardUrl) => request('/users/pinterest', { method: 'POST', body: { board_url: boardUrl } }),
  pinterestResults: () => request('/users/pinterest/results'),
};

// ── WARDROBE ─────────────────────────────────────────────────────
export const wardrobe = {
  list: () => request('/wardrobe'),
  add: (item) => request('/wardrobe', { method: 'POST', body: item }),
  logWear: (id) => request(`/wardrobe/${id}/wear`, { method: 'PATCH' }),
  remove: (id) => request(`/wardrobe/${id}`, { method: 'DELETE' }),
  similar: (name, category) => request(`/wardrobe/similar?name=${encodeURIComponent(name)}&category=${category || ''}`),
};

// ── WISHLIST ──────────────────────────────────────────────────────
export const wishlist = {
  list: () => request('/wishlist'),
  save: (productId, hold = false) => request('/wishlist', { method: 'POST', body: { product_id: productId, hold } }),
  remove: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),
};
