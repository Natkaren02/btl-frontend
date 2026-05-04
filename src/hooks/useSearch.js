import { useCallback, useEffect } from 'react';
import { useSearchStore } from '../store';
import { search as searchApi } from '../lib/api';

export function useSearch() {
  const {
    query, results, total, loading, error, filters, page,
    setQuery, setFilters, setPage, setResults, setLoading, setError, reset,
  } = useSearchStore();

  const doSearch = useCallback(async (q, f = filters, p = page) => {
    if (!q?.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const params = {
        q: q.trim(),
        page: p,
        limit: 24,
        ...(f.sources?.length ? { sources: f.sources.join(',') } : {}),
        ...(f.category ? { category: f.category } : {}),
        ...(f.size_eu ? { size_eu: f.size_eu } : {}),
        ...(f.min_price ? { min_price: f.min_price } : {}),
        ...(f.max_price ? { max_price: f.max_price } : {}),
        ...(f.min_score ? { min_score: f.min_score } : {}),
        sort: f.sort || 'relevance',
      };

      const data = await searchApi.query(params);
      setResults(data.results, data.pagination.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page, setLoading, setError, setResults]);

  // Re-search when filters or page change (if there's an active query)
  useEffect(() => {
    if (query) doSearch(query, filters, page);
  }, [filters, page]);

  const search = useCallback((q) => {
    setQuery(q);
    setPage(1);
    doSearch(q, filters, 1);
  }, [setQuery, setPage, doSearch, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    // doSearch will fire from the useEffect above
  }, [setFilters]);

  return {
    query, results, total, loading, error, filters, page,
    search, updateFilters, setPage, reset,
  };
}
