import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { wishlist as wishlistApi } from '../../lib/api';
import WardrobeSimilarNudge from '../features/WardrobeSimilarNudge';

const SCORE_LABELS = {
  high: { label: 'Excellent', color: 'text-[#8AAA68]' },
  mid:  { label: 'Moderate', color: 'text-[#C9A96E]' },
  low:  { label: 'Limited', color: 'text-red-400' },
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [holding, setHolding] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    // Fetch single product from search endpoint
    fetch(`/api/search?q=${id}&limit=1`)
      .then((r) => r.json())
      .then((data) => {
        const found = data.results?.find((p) => p.id === id) || data.results?.[0];
        setProduct(found || null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (hold = false) => {
    try {
      await wishlistApi.save(id, hold);
      hold ? setHolding(true) : setSaved(true);
    } catch { /* not logged in */ }
  };

  if (loading) return <div className="pt-32 text-center text-[#7A7060]">Loading...</div>;
  if (!product) return (
    <div className="pt-32 text-center">
      <p className="font-['Cormorant_Garamond'] italic text-[#7A7060] text-3xl mb-4">Product not found</p>
      <Link to="/search" className="text-[#C9A96E] text-sm underline">Back to search</Link>
    </div>
  );

  const score = product.sustainability_score;
  const scoreLevel = score >= 70 ? 'high' : score >= 45 ? 'mid' : 'low';
  const isSecondHand = ['vinted', 'dba'].includes(product.source);
  const images = product.images || [];

  return (
    <div className="pt-20 min-h-screen">
      <div className="px-12 py-10">
        <Link to="/search" className="text-[10px] tracking-[0.14em] uppercase text-[#7A7060] hover:text-[#F0EBE1] transition-colors mb-8 block">
          ← Back to results
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Images */}
          <div>
            <div className="aspect-[3/4] bg-[#211E16] mb-3 overflow-hidden">
              {images[imgIdx] ? (
                <img src={images[imgIdx]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#2E2A20] text-xs uppercase tracking-widest">
                  No image
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-16 h-16 overflow-hidden border ${imgIdx === i ? 'border-[#C9A96E]' : 'border-[#2E2A20]'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-[10px] tracking-[0.14em] uppercase text-[#7A7060] mb-2">
              {isSecondHand ? 'Second-hand' : 'Verified brand'} · {product.source?.toUpperCase()}
            </p>
            <h1 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-4xl font-light mb-2 leading-tight">
              {product.title}
            </h1>
            <p className="text-[#7A7060] text-sm mb-6">
              {product.brand?.name || product.brand_name || 'Unknown brand'}
              {product.size_label && ` · Size ${product.size_label}`}
            </p>

            <p className="text-[#C9A96E] text-3xl font-['Cormorant_Garamond'] italic mb-8">
              {product.price_dkk?.toLocaleString('da-DK')} kr
            </p>

            {/* Wardrobe nudge */}
            <WardrobeSimilarNudge productName={product.title} category={product.category} />

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <a
                href={product.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 text-center text-[11px] tracking-[0.14em] uppercase bg-[#C9A96E] text-[#18160F] hover:bg-[#F0EBE1] transition-colors"
              >
                View on {product.source === 'vinted' ? 'Vinted' : product.source === 'dba' ? 'DBA' : 'brand site'} →
              </a>
            </div>
            <div className="flex gap-3 mb-10">
              <button
                onClick={() => handleSave(false)}
                className={`flex-1 py-2.5 text-[10px] tracking-[0.12em] uppercase border transition-colors ${
                  saved ? 'border-[#C9A96E] text-[#C9A96E]' : 'border-[#2E2A20] text-[#7A7060] hover:border-[#C9A96E] hover:text-[#C9A96E]'
                }`}
              >
                {saved ? 'Saved ✓' : 'Save'}
              </button>
              <button
                onClick={() => handleSave(true)}
                className={`flex-1 py-2.5 text-[10px] tracking-[0.12em] uppercase border transition-colors ${
                  holding ? 'border-[#7A7060] text-[#7A7060]' : 'border-[#2E2A20] text-[#7A7060] hover:border-[#7A7060]'
                }`}
              >
                {holding ? '25h hold active ✓' : '25-hour hold'}
              </button>
            </div>

            {/* Sustainability score */}
            <div className="border border-[#2E2A20] p-5 mb-5">
              <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A7060] mb-3">Sustainability score</p>
              <div className="flex items-end gap-4 mb-3">
                <span className={`font-['Cormorant_Garamond'] italic text-5xl font-light ${SCORE_LABELS[scoreLevel].color}`}>
                  {score ?? '—'}
                </span>
                <span className={`text-xs pb-2 ${SCORE_LABELS[scoreLevel].color}`}>{SCORE_LABELS[scoreLevel].label}</span>
              </div>
              <div className="w-full h-px bg-[#2E2A20] mb-1">
                <div
                  className="h-px bg-[#8AAA68] transition-all"
                  style={{ width: `${score ?? 0}%` }}
                />
              </div>
              <p className="text-[#4A4438] text-[10px] mt-1">Score based on source, fibre composition, and brand certifications.</p>
            </div>

            {/* Fibre data */}
            <div className="border border-[#2E2A20] p-5">
              <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A7060] mb-3">Fibre composition</p>
              {product.fibre_data && product.fibre_data_source !== 'unknown' ? (
                <>
                  {Object.entries(product.fibre_data)
                    .filter(([k]) => !['origin', 'certified', 'source'].includes(k))
                    .sort(([, a], [, b]) => b - a)
                    .map(([fibre, pct]) => (
                      <div key={fibre} className="flex items-center gap-3 py-1.5 border-b border-[#1E1C14] last:border-0">
                        <div className="w-16 h-px bg-[#2E2A20] relative">
                          <div className="absolute left-0 top-0 h-px bg-[#8AAA68]" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[#7A7060] text-xs w-8">{pct}%</span>
                        <span className="text-[#F0EBE1] text-xs capitalize">{fibre}</span>
                      </div>
                    ))
                  }
                  {product.fibre_data.origin && (
                    <p className="text-[#7A7060] text-[11px] mt-3">Origin: {product.fibre_data.origin}</p>
                  )}
                  <p className="text-[#4A4438] text-[10px] mt-2">
                    Source: {product.fibre_data_source === 'brand_provided' ? 'Provided by brand' : 'Derived from brand product lookup'}
                  </p>
                </>
              ) : (
                <p className="text-[#4A4438] text-sm italic">
                  Fibre data unknown for this listing. This is common for second-hand items where the seller has not listed the composition.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
