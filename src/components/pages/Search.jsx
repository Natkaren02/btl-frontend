import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import { useSearchStore } from '../../store';
import ProductCard from '../features/ProductCard';
import SearchBar from '../features/SearchBar';
import FilterPanel from '../features/FilterPanel';
import PinterestConnect from '../features/PinterestConnect';

const API = import.meta.env.VITE_API_URL || 'https://btl-backend-production-f682.up.railway.app/api';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, results, total, loading, error, filters, page, search, updateFilters, setPage } = useSearch();
  const [pinterestAnalysis, setPinterestAnalysis] = useState(null);
  const [externalResults, setExternalResults] = useState([]);
  const [externalLoading, setExternalLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== query) search(q);
  }, []);

  useEffect(() => {
    if (!query || query === 'Your Pinterest style') return;
    searchExternal(query);
  }, [query]);

  const searchExternal = async (q) => {
    setExternalLoading(true);
    try {
      const [etsyRes, ebayRes] = await Promise.allSettled([
        fetch(`${API}/etsy/search?q=${encodeURIComponent(q)}`).then(r => r.json()),
        fetch(`${API}/ebay/search?q=${encodeURIComponent(q)}`).then(r => r.json()),
      ]);

      const etsy = etsyRes.status === 'fulfilled' ? etsyRes.value.results || [] : [];
      const ebay = ebayRes.status === 'fulfilled' ? ebayRes.value.results || [] : [];
      console.log(`External results: Etsy=${etsy.length}, eBay=${ebay.length}`);
      setExternalResults([...etsy, ...ebay]);
    } catch (err) {
      console.error('External search error:', err);
      setExternalResults([]);
    } finally {
      setExternalLoading(false);
    }
  };

  const handleSearch = (q) => {
    search(q);
    setSearchParams({ q });
  };

  const allResults = [
    ...results,
    ...externalResults.filter(e => !results.find(r => r.source_id === e.source_id))
  ];

  return (
    <div className="pt-20 min-h-screen">

      <div className="px-12 py-10 border-b border-[#2E2A20]">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">Personal shopper</p>
        <h1 className="font-['Cormorant_Garamond'] text-5xl italic text-[#F0EBE1] mb-6 font-light">
          Find it.
        </h1>
        <SearchBar onSearch={handleSearch} initialValue={query} />
        <FilterPanel filters={filters} onChange={updateFilters} />
      </div>

      <div className="mx-12 my-6 p-5 border border-[#2E2A20] bg-[#211E16]">
        <PinterestConnect onSuccess={(res, analysis) => {
          useSearchStore.getState().setResults(res, res.length);
          useSearchStore.getState().setQuery('Your Pinterest style');
          setPinterestAnalysis(analysis || null);
          if (analysis?.search_terms?.length) {
            setExternalLoading(true);
            Promise.allSettled([
              fetch(`${API}/etsy/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ search_terms: analysis.search_terms }),
              }).then(r => r.json()),
              fetch(`${API}/ebay/search?q=${encodeURIComponent(analysis.search_terms[0])}`).then(r => r.json()),
            ]).then(([etsy, ebay]) => {
              const etsyR = etsy.status === 'fulfilled' ? etsy.value.results || [] : [];
              const ebayR = ebay.status === 'fulfilled' ? ebay.value.results || [] : [];
              setExternalResults([...etsyR, ...ebayR]);
            }).finally(() => setExternalLoading(false));
          }
        }} />
      </div>

      {pinterestAnalysis && (
        <div className="mx-12 mb-2 px-5 py-3 bg-[#1A1810] border border-[#2E2A20]">
          <p className="text-[#C9A96E] text-xs uppercase tracking-wider mb-1">Your style</p>
          <p className="text-[#F0EBE1] text-sm italic font-['Cormorant_Garamond']">
            {pinterestAnalysis.summary || pinterestAnalysis.overall_vibe}
          </p>
          {pinterestAnalysis.search_terms?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {pinterestAnalysis.search_terms.slice(0, 5).map((term, i) => (
                <span key={i} className="text-[10px] text-[#7A7060] border border-[#2E2A20] px-2 py-0.5">{term}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {query && (
        <div className="px-12 py-4 flex items-center justify-between border-b border-[#2E2A20]">
          <span className="text-[10px] tracking-[0.14em] uppercase text-[#7A7060]">
            {(loading || externalLoading) ? 'Searching...' : `${allResults.length} results for "${query}"`}
          </span>
          <select
            value={filters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="bg-transparent text-[#7A7060] text-xs border border-[#2E2A20] px-3 py-1.5 outline-none"
          >
            <option value="relevance">Most relevant</option>
            <option value="score_desc">Highest score</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      )}

      {error && (
        <div className="mx-12 my-4 p-4 border border-red-900 bg-red-950/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {allResults.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#2E2A20] border border-[#2E2A20] mx-12 my-6">
          {allResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && !externalLoading && query && allResults.length === 0 && (
        <div className="text-center py-24 px-12">
          <p className="font-['Cormorant_Garamond'] text-3xl italic text-[#7A7060] mb-3">
            No results found
          </p>
          <p className="text-[#7A7060] text-sm">
            Try different keywords, or remove some filters.
          </p>
        </div>
      )}

      {!query && (
        <div className="text-center py-24 px-12">
          <p className="font-['Cormorant_Garamond'] text-3xl italic text-[#7A7060] mb-3">
            Search for something
          </p>
          <p className="text-[#7A7060] text-sm">
            Try: dark denim, silk slip dress, cashmere coat, linen trousers
          </p>
        </div>
      )}

      {total > 24 && results.length > 0 && (
        <div className="flex justify-center gap-2 py-10">
          {Array.from({ length: Math.min(5, Math.ceil(total / 24)) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 text-xs border transition-colors ${
                page === p
                  ? 'border-[#C9A96E] text-[#C9A96E]'
                  : 'border-[#2E2A20] text-[#7A7060] hover:border-[#7A7060]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
