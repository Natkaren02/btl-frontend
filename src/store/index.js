import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── AUTH STORE ────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('btl_token', token);
        set({ user, token });
      },
      clearAuth: () => {
        localStorage.removeItem('btl_token');
        set({ user: null, token: null });
      },
    }),
    { name: 'btl-auth', partialize: (s) => ({ user: s.user }) }
  )
);

// ── SEARCH STORE ──────────────────────────────────────────────────
export const useSearchStore = create((set, get) => ({
  query: '',
  results: [],
  total: 0,
  loading: false,
  error: null,
  filters: {
    sources: ['second-hand', 'verified-brands'],
    category: '',
    size_eu: '',
    min_price: '',
    max_price: '',
    min_score: '',
    sort: 'relevance',
  },
  page: 1,

  setQuery: (query) => set({ query }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters }, page: 1 })),
  setPage: (page) => set({ page }),
  setResults: (results, total) => set({ results, total }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ query: '', results: [], total: 0, page: 1, error: null }),
}));

// ── WARDROBE STORE ────────────────────────────────────────────────
export const useWardrobeStore = create((set) => ({
  items: [],
  loading: false,
  setItems: (items) => set({ items }),
  addItem: (item) => set((s) => ({ items: [item, ...s.items] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  updateItem: (id, updates) => set((s) => ({
    items: s.items.map((i) => i.id === id ? { ...i, ...updates } : i),
  })),
  setLoading: (loading) => set({ loading }),
}));

// ── WISHLIST STORE ────────────────────────────────────────────────
export const useWishlistStore = create((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((s) => ({ items: [item, ...s.items] })),
  removeItem: (productId) => set((s) => ({
    items: s.items.filter((i) => i.product_id !== productId),
  })),
  isWishlisted: (productId) => {
    const { items } = useWishlistStore.getState();
    return items.some((i) => i.product_id === productId);
  },
}));
