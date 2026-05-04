import { useState } from 'react';
import { Link } from 'react-router-dom';
import { wishlist as wishlistApi } from '../../lib/api';
import { useWishlistStore } from '../../store';

const SCORE_COLORS = {
  green: 'text-[#8AAA68]',
  amber: 'text-[#C9A96E]',
  red:   'text-red-400',
};

export default function ProductCard({ product }) {
  const [saved, setSaved] = useState(false);
  const [holding, setHolding] = useState(false);
  const addItem = useWishlistStore((s) => s.addItem);

  const handleSave = async (e, hold = false) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const item = await wishlistApi.save(product.id, hold);
      addItem(item);
      hold ? setHolding(true) : setSaved(true);
    } catch {
      // not logged in — could redirect to login
    }
  };

  const score = product.sustainability_score;
  const scoreColor = score >= 70 ? 'green' : score >= 45 ? 'amber' : 'red';
  const sourceBadge = ['vinted', 'dba'].includes(product.source) ? 'Second-hand' : 'Verified';
  const sourceBadgeStyle = product.source === 'brand_direct' || product.source === 'sellply'
    ? 'bg-[#1E2818] text-[#8AAA68]'
    : 'bg-[#28201A] text-[#C9A96E]';

  return (
    <Link
      to={`/product/${product.id}`}
      className="block bg-[#18160F] hover:bg-[#211E16] transition-colors relative group"
    >
      {/* Image area */}
      <div
        className="aspect-[3/4] relative overflow-hidden flex items-end"
        style={{ background: '#211E16' }}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] tracking-widest text-[#2E2A20] uppercase">
              {product.category || 'Item'}
            </span>
          </div>
        )}

        {/* Source badge */}
        <span className={`absolute top-2.5 left-2.5 text-[8px] px-2 py-0.5 tracking-wider uppercase ${sourceBadgeStyle}`}>
          {sourceBadge}
        </span>

        {/* Save / hold buttons — appear on hover */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => handleSave(e, false)}
            className={`text-[9px] px-2 py-1 tracking-wider uppercase border transition-colors ${
              saved
                ? 'border-[#C9A96E] text-[#C9A96E] bg-[#18160F]'
                : 'border-[#2E2A20] text-[#7A7060] bg-[#18160F] hover:border-[#C9A96E] hover:text-[#C9A96E]'
            }`}
          >
            {saved ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={(e) => handleSave(e, true)}
            className={`text-[9px] px-2 py-1 tracking-wider uppercase border transition-colors ${
              holding
                ? 'border-[#7A7060] text-[#7A7060] bg-[#18160F]'
                : 'border-[#2E2A20] text-[#7A7060] bg-[#18160F] hover:border-[#7A7060]'
            }`}
            title="25-hour hold — come back tomorrow before deciding"
          >
            {holding ? '25h hold ✓' : '25h hold'}
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-3.5">
        <h3 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-base leading-snug mb-0.5 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-[#7A7060] text-[11px] mb-2">
          {product.brand?.name || product.brand_name || 'Unknown brand'}
          {product.size_label && ` · ${product.size_label}`}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[#C9A96E] text-sm font-medium">
            {product.price_dkk?.toLocaleString('da-DK')} kr
          </span>
          {score != null && (
            <span className={`text-[10px] ${SCORE_COLORS[scoreColor]}`}>
              {score}/100
            </span>
          )}
        </div>

        {/* Fibre data if available */}
        {product.fibre_data && product.fibre_data_source !== 'unknown' && (
          <p className="text-[#7A7060] text-[10px] mt-1.5 truncate">
            {Object.entries(product.fibre_data)
              .filter(([k]) => !['origin', 'certified', 'source'].includes(k))
              .sort(([, a], [, b]) => b - a)
              .slice(0, 2)
              .map(([f, p]) => `${p}% ${f}`)
              .join(', ')}
          </p>
        )}
        {(!product.fibre_data || product.fibre_data_source === 'unknown') && (
          <p className="text-[#4A4438] text-[10px] mt-1.5">Fibre data: unknown</p>
        )}
      </div>
    </Link>
  );
}
