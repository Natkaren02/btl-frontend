export default function FilterPanel({ filters, onChange }) {
  const sources = [
    { value: 'second-hand', label: 'Second-hand' },
    { value: 'verified-brands', label: 'Verified brands' },
  ];

  const categories = [
    { value: '', label: 'All' },
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'shoes', label: 'Shoes' },
  ];

  const toggleSource = (source) => {
    const current = filters.sources || [];
    const next = current.includes(source)
      ? current.filter((s) => s !== source)
      : [...current, source];
    onChange({ sources: next });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Source toggles */}
      {sources.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => toggleSource(value)}
          className={`text-[10px] px-3 py-1.5 border uppercase tracking-wider transition-colors ${
            filters.sources?.includes(value)
              ? 'border-[#C9A96E] text-[#C9A96E]'
              : 'border-[#2E2A20] text-[#7A7060] hover:border-[#7A7060]'
          }`}
        >
          {label}
        </button>
      ))}

      <div className="w-px h-5 bg-[#2E2A20]" />

      {/* Category filter */}
      {categories.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange({ category: value })}
          className={`text-[10px] px-3 py-1.5 border uppercase tracking-wider transition-colors ${
            filters.category === value
              ? 'border-[#C9A96E] text-[#C9A96E]'
              : 'border-[#2E2A20] text-[#7A7060] hover:border-[#7A7060]'
          }`}
        >
          {label}
        </button>
      ))}

      <div className="w-px h-5 bg-[#2E2A20]" />

      {/* Price */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min kr"
          value={filters.min_price || ''}
          onChange={(e) => onChange({ min_price: e.target.value })}
          className="w-20 bg-[#211E16] border border-[#2E2A20] text-[#F0EBE1] text-[11px] px-2 py-1.5 outline-none"
        />
        <span className="text-[#4A4438] text-xs">—</span>
        <input
          type="number"
          placeholder="Max kr"
          value={filters.max_price || ''}
          onChange={(e) => onChange({ max_price: e.target.value })}
          className="w-20 bg-[#211E16] border border-[#2E2A20] text-[#F0EBE1] text-[11px] px-2 py-1.5 outline-none"
        />
      </div>

      {/* Size */}
      <input
        type="text"
        placeholder="EU size"
        value={filters.size_eu || ''}
        onChange={(e) => onChange({ size_eu: e.target.value })}
        className="w-20 bg-[#211E16] border border-[#2E2A20] text-[#F0EBE1] text-[11px] px-2 py-1.5 outline-none"
      />
    </div>
  );
}
