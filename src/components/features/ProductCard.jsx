import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { wishlist as wishlistApi } from '../../lib/api';
import { useWishlistStore } from '../../store';

const SCORE_COLORS = {
  green: 'text-[#8AAA68]',
  amber: 'text-[#C9A96E]',
  red:   'text-red-400',
};

const SOURCE_LABELS = {
  vinted: 'Vinted',
  dba: 'DBA',
  ebay: 'eBay',
  etsy: 'Etsy',
  brand_direct: 'Verified brand',
  sellply: 'Verified brand',
};

export default function ProductCard({ product }) {
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const addItem = useWishlistStore((s) => s.addItem);

  const isExternal = ['ebay', 'etsy'].includes(product.source);

  const handleClick = () => {
    if (isExternal) {
      window.open(product.source_url, '_blank');
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      const item = await wishlistApi.save(product.id, false);
      addItem(item);
      setSaved(true);
    } catch {}
  };

  const score = product.sustainability_score;
  const scoreColor = score >= 70 ? 'green' : score >= 45 ? 'amber' : 'red';
  const isSecondHand = ['vinted', 'dba', 'ebay'].includes(product.source);
  const sourceBadge = isSecondHand ? 'Second-hand' : 'Verified';
  const sourceBadgeStyle = isSecondHand
    ? 'bg-[#28201A] text-[#C9A96E]'
    : 'bg-[#1E2818] text-[#8AAA68]';

  const priceDKK = product.price_dkk || (product.price ? Math.round(product.price / 100) : null);

  return (
    <div
      onClick={handleClick}
      className="block bg-[#18160F] hover:bg-[#211E16] transition-colors relative group cursor-pointer"
    >
      <div className="aspect-[3/4] relative overflow-hidden flex items-end bg-[#211E16]">
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

        <span className={`absolute top-2.5 left-2.5 text-[8px] px-2 py-0.5 tracking-wider uppercase ${sourceBadgeStyle}`}>
          {SOURCE_LABELS[product.source] || sourceBadge}
        </span>

        {!isExternal && (
          <button
            onClick={handleSave}
            className={`absolute top-2.5 right-2.5 text-[9px] px-2 py-1 tracking-wider uppercase border transition-colors opacity-0 group-hover:opacity-100 ${
              saved
                ? 'border-[#C9A96E] text-[#C9A96E] bg-[#18160F]'
                : 'border-[#2E2A20] text-[#7A7060] bg-[#18160F] hover:border-[#C9A96E] hover:text-[#C9A96E]'
            }`}
          >
            {saved ? 'Saved' : 'Save'}
          </button>
        )}

        {isExternal && (
          <span className="absolute top-2.5 right-2.5 text-[9px] px-2 py-1 tracking-wider uppercase border border-[#2E2A20] text-[#7A7060] bg-[#18160F] opacity-0 group-hover:opacity-100">
            View →
          </span>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-base leading-snug mb-0.5 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-[#7A7060] text-[11px] mb-2">
          {product.brand?.name || product.brand_name || SOURCE_LABELS[product.source] || ''}
          {product.size_label && ` · ${product.size_label}`}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[#C9A96E] text-sm font-medium">
            {priceDKK ? `${priceDKK.toLocaleString('da-DK')} kr` : '—'}
          </span>
          {score != null && (
            <span className={`text-[10px] ${SCORE_COLORS[scoreColor]}`}>
              {score}/100
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

