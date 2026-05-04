import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import { wardrobe as wardrobeApi, wishlist as wishlistApi } from '../../lib/api';
import ProductCard from '../features/ProductCard';
import SearchBar from '../features/SearchBar';
import FilterPanel from '../features/FilterPanel';
import PinterestConnect from '../features/PinterestConnect';
import WardrobeSimilarNudge from '../features/WardrobeSimilarNudge';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, results, total, loading, error, filters, page, search, updateFilters, setPage } = useSearch();
  const [showPinterest, setShowPinterest] = useState(true);

  // Pick up ?q= from URL on load
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== query) search(q);
  }, []);

  const handleSearch = (q) => {
    search(q);
    setSearchParams({ q });
  };

  return (
    <div className="pt-20 min-h-screen">

      {/* Search hero */}
      <div className="px-12 py-10 border-b border-[#2E2A20]">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">Personal shopper</p>
        <h1 className="font-['Cormorant_Garamond'] text-5xl italic text-[#F0EBE1] mb-6 font-light">
          Find it.
        </h1>
        <SearchBar onSearch={handleSearch} initialValue={query} />
        <FilterPanel filters={filters} onChange={updateFilters} />
      </div>

      {/* Pinterest connect prompt */}
      {showPinterest && !query && (
        <div className="mx-12 my-6 p-5 border border-[#2E2A20] bg-[#211E16] flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-lg mb-1">
              Connect your Pinterest board
            </p>
            <p className="text-[#7A7060] text-sm">
              Visual matching — the app reads your pins as images, not descriptions.
              Low-rise stays low-rise.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <PinterestConnect onSuccess={(res) => console.log('Pinterest results:', res)} />
            <button
              onClick={() => setShowPinterest(false)}
              className="text-[#7A7060] text-xs border border-[#2E2A20] px-4 py-2 hover:text-[#F0EBE1] transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {query && (
        <div className="px-12 py-4 flex items-center justify-between border-b border-[#2E2A20]">
          <span className="text-[10px] tracking-[0.14em] uppercase text-[#7A7060]">
            {loading ? 'Searching...' : `${total} results for "${query}"`}
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

      {/* Results grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#2E2A20] border border-[#2E2A20] mx-12 my-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && query && results.length === 0 && (
        <div className="text-center py-24 px-12">
          <p className="font-['Cormorant_Garamond'] text-3xl italic text-[#7A7060] mb-3">
            No results found
          </p>
          <p className="text-[#7A7060] text-sm">
            Try different keywords, or remove some filters.
          </p>
        </div>
      )}

      {/* No query yet */}
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

      {/* Pagination */}
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
