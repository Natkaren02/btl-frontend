import { useEffect, useState } from 'react';
import { useWardrobeStore } from '../../store';
import { wardrobe as wardrobeApi } from '../../lib/api';

export default function Wardrobe() {
  const { items, setItems, updateItem, removeItem, loading, setLoading } = useWardrobeStore();
  const [view, setView] = useState('grid'); // grid | list
  const [sortBy, setSortBy] = useState('recent'); // recent | cpw | worn | score

  useEffect(() => {
    setLoading(true);
    wardrobeApi.list()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogWear = async (id) => {
    try {
      const updated = await wardrobeApi.logWear(id);
      updateItem(id, updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this item from your wardrobe?')) return;
    try {
      await wardrobeApi.remove(id);
      removeItem(id);
    } catch (err) {
      console.error(err);
    }
  };

  const sorted = [...items].sort((a, b) => {
    if (sortBy === 'cpw') return (a.cost_per_wear ?? 99999) - (b.cost_per_wear ?? 99999);
    if (sortBy === 'worn') return (b.times_worn ?? 0) - (a.times_worn ?? 0);
    if (sortBy === 'score') return (b.sustainability_score ?? 0) - (a.sustainability_score ?? 0);
    return 0; // recent (default order from API)
  });

  // Stats
  const totalItems = items.length;
  const totalSpend = items.reduce((s, i) => s + (i.purchase_price ?? 0), 0) / 100;
  const avgCpw = items.filter(i => i.cost_per_wear).reduce((s, i, _, arr) => s + i.cost_per_wear / arr.length, 0);
  const avgScore = items.filter(i => i.sustainability_score).reduce((s, i, _, arr) => s + i.sustainability_score / arr.length, 0);

  return (
    <div className="pt-20 min-h-screen">

      {/* Header */}
      <div className="px-12 py-10 border-b border-[#2E2A20]">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">Your wardrobe</p>
        <h1 className="font-['Cormorant_Garamond'] text-5xl italic text-[#F0EBE1] mb-6 font-light">
          What you own.
        </h1>

        {/* Stats row */}
        <div className="flex gap-px bg-[#2E2A20] border border-[#2E2A20] max-w-2xl">
          {[
            { label: 'Items', value: totalItems },
            { label: 'Total spent', value: `${totalSpend.toLocaleString('da-DK', { maximumFractionDigits: 0 })} kr` },
            { label: 'Avg cost/wear', value: avgCpw ? `${Math.round(avgCpw)} kr` : '—' },
            { label: 'Avg score', value: avgScore ? `${Math.round(avgScore)}/100` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex-1 bg-[#18160F] p-4">
              <div className="font-['Cormorant_Garamond'] italic text-[#C9A96E] text-2xl font-light mb-0.5">{value}</div>
              <div className="text-[10px] uppercase tracking-wider text-[#7A7060]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="px-12 py-4 border-b border-[#2E2A20] flex items-center justify-between">
        <div className="flex gap-2">
          {['recent', 'cpw', 'worn', 'score'].map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`text-[10px] px-3 py-1.5 border uppercase tracking-wider transition-colors ${
                sortBy === s
                  ? 'border-[#C9A96E] text-[#C9A96E]'
                  : 'border-[#2E2A20] text-[#7A7060] hover:border-[#7A7060]'
              }`}
            >
              {s === 'cpw' ? 'Cost/wear' : s === 'recent' ? 'Recent' : s === 'worn' ? 'Most worn' : 'Score'}
            </button>
          ))}
        </div>
        <button
          onClick={() => {/* add item modal */}}
          className="text-[10px] px-4 py-1.5 bg-[#C9A96E] text-[#18160F] uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors"
        >
          + Add item
        </button>
      </div>

      {/* Items */}
      {loading ? (
        <div className="text-center py-24 text-[#7A7060] text-sm">Loading wardrobe...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-['Cormorant_Garamond'] text-3xl italic text-[#7A7060] mb-3">Your wardrobe is empty</p>
          <p className="text-[#7A7060] text-sm mb-6">Add items you own to track cost-per-wear and avoid buying duplicates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#2E2A20] border border-[#2E2A20] mx-12 my-6">
          {sorted.map((item) => (
            <div key={item.id} className="bg-[#18160F] group relative">
              {/* Image */}
              <div className="aspect-[3/4] bg-[#211E16] flex items-center justify-center">
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  : <span className="text-[10px] text-[#2E2A20] uppercase tracking-widest">{item.category}</span>
                }
              </div>

              {/* Info */}
              <div className="p-3.5">
                <h3 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-sm leading-snug mb-0.5 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-[#7A7060] text-[11px] mb-2">{item.brand || '—'}</p>

                <div className="flex items-center justify-between text-[10px] mb-2">
                  <span className="text-[#C9A96E]">
                    {item.cost_per_wear ? `${item.cost_per_wear} kr/wear` : item.price_dkk ? `${item.price_dkk} kr` : '—'}
                  </span>
                  <span className="text-[#7A7060]">{item.times_worn || 0} wears</span>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleLogWear(item.id)}
                    className="flex-1 text-[9px] py-1.5 border border-[#2E2A20] text-[#7A7060] uppercase tracking-wider hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors"
                  >
                    Log wear
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-[9px] px-2 py-1.5 border border-[#2E2A20] text-[#4A4438] hover:border-red-900 hover:text-red-400 transition-colors"
                    title="Remove from wardrobe"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
