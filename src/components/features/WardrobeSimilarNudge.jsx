import { useEffect, useState } from 'react';
import { wardrobe as wardrobeApi } from '../../lib/api';

export default function WardrobeSimilarNudge({ productName, category }) {
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    if (!productName) return;
    wardrobeApi.similar(productName, category)
      .then((res) => setSimilar(res.similar || []))
      .catch(() => {});
  }, [productName, category]);

  if (!similar.length) return null;

  return (
    <div className="border border-[#C9A96E]/30 bg-[#211E16] p-4 mb-4">
      <p className="text-[10px] tracking-[0.12em] uppercase text-[#C9A96E] mb-2">
        You might already own something similar
      </p>
      <div className="flex gap-3">
        {similar.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            {item.image_url && (
              <img src={item.image_url} alt={item.name} className="w-8 h-8 object-cover" />
            )}
            <span className="text-[#7A7060] text-xs">{item.name}</span>
          </div>
        ))}
      </div>
      <p className="text-[#4A4438] text-[10px] mt-2">
        Check your wardrobe before buying — not a block, just a nudge.
      </p>
    </div>
  );
}
