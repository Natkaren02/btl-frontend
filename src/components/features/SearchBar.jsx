import { useState } from 'react';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl mb-5">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="dark wide-leg denim, silk slip dress, cashmere coat..."
        className="flex-1 bg-[#211E16] border border-[#2E2A20] border-r-0 text-[#F0EBE1] px-5 py-3.5 text-sm outline-none placeholder-[#4A4438] focus:border-[#7A7060]"
      />
      <button
        type="submit"
        className="px-7 py-3.5 bg-[#C9A96E] text-[#18160F] text-[11px] tracking-[0.14em] uppercase font-medium hover:bg-[#F0EBE1] transition-colors whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
}
