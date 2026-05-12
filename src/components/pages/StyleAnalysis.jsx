import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const API = import.meta.env.VITE_API_URL || 'https://btl-backend-production-f682.up.railway.app/api';
const SESSION_KEY = 'btl_pinterest_session';

function Bar({ count, max }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-[#2E2A20] relative">
        <div className="absolute left-0 top-0 h-px bg-[#C9A96E] transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[#C9A96E] text-xs w-6 text-right">{count}×</span>
    </div>
  );
}

function CategoryCard({ cat }) {
  const maxColour = cat.colours[0]?.count || 1;
  const maxFit = cat.fits[0]?.count || 1;

  return (
    <div className="border border-[#2E2A20] overflow-hidden">
      {/* Pin images for this category */}
      {cat.images?.length > 0 && (
        <div className="grid gap-px bg-[#2E2A20]" style={{ gridTemplateColumns: `repeat(${Math.min(cat.images.length, 4)}, 1fr)` }}>
          {cat.images.slice(0, 4).map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-[#211E16]">
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      )}
      <div className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-xl capitalize mb-0.5">
            {cat.name}
          </h3>
          <p className="text-[10px] uppercase tracking-wider text-[#7A7060]">{cat.count} pins</p>
        </div>
        <span className="font-['Cormorant_Garamond'] italic text-[#C9A96E] text-4xl">{cat.count}×</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cat.colours.length > 0 && (
          <div>
            <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A7060] mb-3">Colour</p>
            <div className="space-y-2">
              {cat.colours.slice(0, 6).map(({ value, count }) => (
                <div key={value}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#A89880] text-xs capitalize">{value}</span>
                  </div>
                  <Bar count={count} max={maxColour} />
                </div>
              ))}
            </div>
          </div>
        )}

        {cat.fits.length > 0 && (
          <div>
            <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A7060] mb-3">Silhouette / Fit</p>
            <div className="space-y-2">
              {cat.fits.slice(0, 6).map(({ value, count }) => (
                <div key={value}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#A89880] text-xs capitalize">{value}</span>
                  </div>
                  <Bar count={count} max={maxFit} />
                </div>
              ))}
            </div>
          </div>
        )}

        {cat.rises?.filter(r => r.value).length > 0 && (
          <div>
            <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A7060] mb-3">Rise</p>
            <div className="space-y-2">
              {cat.rises.filter(r => r.value).slice(0, 4).map(({ value, count }) => (
                <div key={value}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#A89880] text-xs capitalize">{value}</span>
                  </div>
                  <Bar count={count} max={cat.rises[0]?.count || 1} />
                </div>
              ))}
            </div>
          </div>
        )}

        {cat.materials?.filter(m => m.value).length > 0 && (
          <div>
            <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A7060] mb-3">Material</p>
            <div className="space-y-2">
              {cat.materials.filter(m => m.value).slice(0, 4).map(({ value, count }) => (
                <div key={value}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#A89880] text-xs capitalize">{value}</span>
                  </div>
                  <Bar count={count} max={cat.materials[0]?.count || 1} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Specific combinations */}
      {cat.items?.length > 1 && (
        <div className="mt-4 pt-4 border-t border-[#2E2A20]">
          <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A7060] mb-2">Specific combinations pinned</p>
          <div className="flex flex-wrap gap-1.5">
            {cat.items.map((item, i) => {
              const parts = [item.rise, item.fit, item.colour, item.material, item.details].filter(Boolean);
              if (!parts.length) return null;
              return (
                <span key={i} className="text-[10px] text-[#7A7060] border border-[#2E2A20] px-2 py-1 capitalize">
                  {parts.join(' · ')}
                </span>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default function StyleAnalysisPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessionKey, setSessionKey] = useState(() => localStorage.getItem(SESSION_KEY) || null);
  const [boards, setBoards] = useState([]);
  const [step, setStep] = useState('connect');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pinsAnalysed, setPinsAnalysed] = useState(0);
  const [analysingText, setAnalysingText] = useState('Reading your pins...');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('pinterest');
    const session = params.get('session');
    if (status === 'success' && session) {
      localStorage.setItem(SESSION_KEY, session);
      setSessionKey(session);
      window.history.replaceState({}, '', '/style');
      loadBoards(session);
    } else if (status === 'error') {
      setError('Pinterest connection failed. Please try again.');
      window.history.replaceState({}, '', '/style');
    } else if (sessionKey) {
      loadBoards(sessionKey);
    }
  }, []);

  const loadBoards = async (session) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/pinterest/boards/${session}`);
      if (!res.ok) { localStorage.removeItem(SESSION_KEY); setSessionKey(null); setStep('connect'); return; }
      const data = await res.json();
      setBoards(data.boards || []);
      setStep('boards');
    } catch { setStep('connect'); }
    finally { setLoading(false); }
  };

  const handleConnect = () => { window.location.href = `${API}/pinterest/auth`; };

  const handleAnalyseBoard = async (board) => {
    setSelectedBoard(board);
    setStep('analysing');
    setError('');
    setAnalysingText('Starting analysis...');

    try {
      // Start the job
      const res = await fetch(`${API}/pinterest/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_key: sessionKey, board_id: board.id }),
      });
      const { job_id, pins_found } = await res.json();
      setPinsAnalysed(pins_found || 0);

      // Poll for completion
      const poll = setInterval(async () => {
        try {
          const jobRes = await fetch(`${API}/pinterest/job/${job_id}`);
          const job = await jobRes.json();

          setAnalysingText(`${job.message || 'Analysing...'}`);

          if (job.status === 'done') {
            clearInterval(poll);
            const { analysis, products } = job.result;
            setAnalysis(analysis);
            setProducts(products || []);
            setPinsAnalysed(analysis.pins_analysed || pins_found);
            setStep('results');

            // Also search eBay with style terms
            if (analysis.search_terms?.length) {
              const ebayQuery = analysis.search_terms.slice(0, 3).join(' ');
              fetch(`${API}/ebay/search?q=${encodeURIComponent(ebayQuery)}`)
                .then(r => r.json())
                .then(d => { if (d.results?.length) setProducts(prev => [...prev, ...d.results]); })
                .catch(() => {});
            }
          } else if (job.status === 'failed') {
            clearInterval(poll);
            setError(job.error || 'Analysis failed. Please try again.');
            setStep('boards');
          }
        } catch {
          // Keep polling on network errors
        }
      }, 3000);

      // Safety timeout after 5 minutes
      setTimeout(() => {
        clearInterval(poll);
        if (step === 'analysing') {
          setError('Analysis timed out. Please try again with a smaller board.');
          setStep('boards');
        }
      }, 300000);

    } catch (err) {
      setError('Failed to start analysis. Please try again.');
      setStep('boards');
    }
  };

  if (!user) {
    return (
      <div className="pt-32 text-center px-12">
        <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-4xl mb-4">Sign in to analyse your style</p>
        <p className="text-[#7A7060] text-sm mb-8 max-w-md mx-auto">Your style profile is saved to your account.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#C9A96E] text-[#18160F] text-xs uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors">
          Sign in or create account
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="px-12 py-10 border-b border-[#2E2A20]">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">Style analysis</p>
        <h1 className="font-['Cormorant_Garamond'] text-5xl italic text-[#F0EBE1] font-light">
          What does your Pinterest say?
        </h1>
      </div>

      <div className="px-12 py-10">

        {step === 'connect' && (
          <div className="max-w-xl">
            <p className="text-[#7A7060] text-sm leading-relaxed mb-8">
              Connect your Pinterest board and we'll analyse every pin — silhouette, colour, material, rise, fit —
              and tell you exactly what you keep coming back to. Then we find those exact items from sustainable sources.
            </p>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            {loading ? (
              <p className="text-[#7A7060] text-sm">Loading...</p>
            ) : (
              <button onClick={handleConnect} className="px-8 py-3.5 bg-[#C9A96E] text-[#18160F] text-xs uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors">
                Connect Pinterest
              </button>
            )}
          </div>
        )}

        {step === 'boards' && (
          <div>
            <p className="text-[#7A7060] text-sm mb-6">Choose a board. We'll look at up to 20 pins individually — the more pins, the better the analysis.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#2E2A20] border border-[#2E2A20] mb-6">
              {boards.map(board => (
                <button
                  key={board.id}
                  onClick={() => handleAnalyseBoard(board)}
                  className="bg-[#18160F] hover:bg-[#211E16] p-5 text-left transition-colors group"
                >
                  <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-base mb-1 group-hover:text-[#C9A96E] transition-colors">{board.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#4A4438]">Analyse →</p>
                </button>
              ))}
            </div>
            <button onClick={() => { localStorage.removeItem(SESSION_KEY); setSessionKey(null); setStep('connect'); }} className="text-[#4A4438] text-xs hover:text-[#7A7060] transition-colors">
              Disconnect Pinterest
            </button>
          </div>
        )}

        {step === 'analysing' && (
          <div className="text-center py-24">
            <div className="inline-block w-8 h-8 border border-[#C9A96E] border-t-transparent rounded-full animate-spin mb-6" />
            <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-2xl mb-3">{analysingText}</p>
            <p className="text-[#7A7060] text-sm">Analysing up to 20 pins individually. Takes about 30–60 seconds.</p>
          </div>
        )}

        {step === 'results' && analysis && (
          <div>
            {/* Summary header */}
            <div className="mb-10 p-6 bg-[#211E16] border border-[#2E2A20]">
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-2">
                {pinsAnalysed} pins analysed · {analysis.items?.length || 0} items identified
              </p>
              <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-3xl font-light mb-4">
                {analysis.summary}
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.dominant_colours?.map((c, i) => (
                  <span key={i} className="text-[10px] text-[#C9A96E] border border-[#C9A96E]/30 px-2 py-1 capitalize">{c}</span>
                ))}
                {analysis.dominant_materials?.map((m, i) => (
                  <span key={i} className="text-[10px] text-[#8AAA68] border border-[#8AAA68]/30 px-2 py-1 capitalize">{m}</span>
                ))}
              </div>
            </div>

            {/* Detailed breakdown per category */}
            {analysis.category_breakdown?.length > 0 && (
              <div className="mb-12">
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-6">What you pin, in detail</p>
                <div className="space-y-4">
                  {analysis.category_breakdown.slice(0, 8).map((cat, i) => (
                    <CategoryCard key={i} cat={cat} />
                  ))}
                </div>
              </div>
            )}

            {/* Search terms */}
            {analysis.search_terms?.length > 0 && (
              <div className="mb-10">
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">Searching for</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.search_terms.map((term, i) => (
                    <span key={i} className="text-[11px] text-[#7A7060] border border-[#2E2A20] px-3 py-1.5">{term}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {products.length > 0 && (
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-5">{products.length} matches found</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#2E2A20] border border-[#2E2A20]">
                  {products.filter(p => p.images?.[0]).map((product) => {
                    const priceDKK = product.price_dkk || (product.price ? Math.round(product.price / 100) : null);
                    const isExternal = ['ebay', 'etsy'].includes(product.source);
                    return (
                      <div
                        key={product.id}
                        onClick={() => isExternal ? window.open(product.source_url, '_blank') : null}
                        className="bg-[#18160F] hover:bg-[#211E16] transition-colors cursor-pointer group"
                      >
                        <div className="aspect-[3/4] bg-[#211E16] overflow-hidden relative">
                          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
                          {isExternal && (
                            <div className="absolute inset-0 bg-[#18160F]/0 group-hover:bg-[#18160F]/20 transition-colors flex items-center justify-center">
                              <span className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-wider text-[#F0EBE1] border border-[#F0EBE1] px-3 py-1.5 transition-opacity">View →</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3.5">
                          <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-sm leading-snug mb-1 line-clamp-2">{product.title}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[#C9A96E] text-xs">{priceDKK ? `${priceDKK.toLocaleString('da-DK')} kr` : '—'}</span>
                            <span className="text-[8px] text-[#4A4438] uppercase tracking-wider">{product.source}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-10 flex gap-4">
              <button onClick={() => setStep('boards')} className="px-6 py-3 border border-[#2E2A20] text-[#7A7060] text-xs uppercase tracking-wider hover:border-[#7A7060] transition-colors">
                Try another board
              </button>
              <button onClick={() => navigate('/search')} className="px-6 py-3 bg-[#C9A96E] text-[#18160F] text-xs uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors">
                Go to search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
