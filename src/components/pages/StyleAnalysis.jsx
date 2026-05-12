import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const API = import.meta.env.VITE_API_URL || 'https://btl-backend-production-f682.up.railway.app/api';
const SESSION_KEY = 'btl_pinterest_session';

// Visual breakdown component
function StyleBreakdown({ breakdown }) {
  if (!breakdown?.items?.length) return null;

  // Group by category
  const byCategory = {};
  for (const item of breakdown.items) {
    const cat = item.subcategory || item.category || 'Other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(item);
  }

  return (
    <div className="space-y-6">
      {Object.entries(byCategory)
        .sort(([, a], [, b]) => b.length - a.length)
        .map(([category, items]) => {
          // Count colours
          const colourCounts = {};
          const fitCounts = {};
          const riseCounts = {};
          
          for (const item of items) {
            if (item.colour) colourCounts[item.colour] = (colourCounts[item.colour] || 0) + 1;
            if (item.fit) fitCounts[item.fit] = (fitCounts[item.fit] || 0) + 1;
            if (item.rise) riseCounts[item.rise] = (riseCounts[item.rise] || 0) + 1;
          }

          const topColours = Object.entries(colourCounts).sort((a,b) => b[1]-a[1]);
          const topFits = Object.entries(fitCounts).sort((a,b) => b[1]-a[1]);
          const topRises = Object.entries(riseCounts).sort((a,b) => b[1]-a[1]);

          return (
            <div key={category} className="border border-[#2E2A20] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-xl capitalize">
                  {category}
                </h3>
                <span className="text-[#C9A96E] text-sm font-medium">{items.length}×</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topColours.length > 0 && (
                  <div>
                    <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A7060] mb-2">Colour</p>
                    {topColours.map(([colour, count]) => (
                      <div key={colour} className="flex items-center justify-between py-1 border-b border-[#1E1C14]">
                        <span className="text-[#A89880] text-xs capitalize">{colour}</span>
                        <span className="text-[#C9A96E] text-xs">{count}×</span>
                      </div>
                    ))}
                  </div>
                )}

                {topFits.length > 0 && (
                  <div>
                    <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A7060] mb-2">Silhouette</p>
                    {topFits.map(([fit, count]) => (
                      <div key={fit} className="flex items-center justify-between py-1 border-b border-[#1E1C14]">
                        <span className="text-[#A89880] text-xs capitalize">{fit}</span>
                        <span className="text-[#C9A96E] text-xs">{count}×</span>
                      </div>
                    ))}
                  </div>
                )}

                {topRises.length > 0 && (
                  <div>
                    <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A7060] mb-2">Rise / Length</p>
                    {topRises.map(([rise, count]) => (
                      <div key={rise} className="flex items-center justify-between py-1 border-b border-[#1E1C14]">
                        <span className="text-[#A89880] text-xs capitalize">{rise}</span>
                        <span className="text-[#C9A96E] text-xs">{count}×</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Show specific combinations */}
              {items.length > 1 && (
                <div className="mt-3 pt-3 border-t border-[#2E2A20]">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A7060] mb-2">Specific combinations</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => {
                      const parts = [item.fit, item.rise, item.colour, item.material].filter(Boolean);
                      if (!parts.length) return null;
                      return (
                        <span key={i} className="text-[10px] text-[#7A7060] border border-[#2E2A20] px-2 py-1">
                          {parts.join(' · ')}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default function StyleAnalysisPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessionKey, setSessionKey] = useState(() => localStorage.getItem(SESSION_KEY) || null);
  const [boards, setBoards] = useState([]);
  const [step, setStep] = useState('connect'); // connect | boards | analysing | results
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pinsAnalysed, setPinsAnalysed] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
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
      if (!res.ok) {
        localStorage.removeItem(SESSION_KEY);
        setSessionKey(null);
        setStep('connect');
        return;
      }
      const data = await res.json();
      setBoards(data.boards || []);
      setStep('boards');
    } catch {
      setStep('connect');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    window.location.href = `${API}/pinterest/auth`;
  };

  const handleAnalyseBoard = async (board) => {
    setSelectedBoard(board);
    setStep('analysing');
    setError('');

    try {
      const res = await fetch(`${API}/pinterest/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_key: sessionKey, board_id: board.id }),
      });
      const data = await res.json();
      
      setAnalysis(data.analysis);
      setProducts(data.results || []);
      setPinsAnalysed(data.pins_found || 0);
      setStep('results');

      // Also search eBay with analysis terms
      if (data.analysis?.search_terms?.length) {
        const ebayQuery = data.analysis.search_terms.slice(0, 3).join(' ');
        fetch(`${API}/ebay/search?q=${encodeURIComponent(ebayQuery)}`)
          .then(r => r.json())
          .then(d => {
            if (d.results?.length) {
              setProducts(prev => [...prev, ...d.results]);
            }
          })
          .catch(() => {});
      }
    } catch (err) {
      setError('Analysis failed. Please try again.');
      setStep('boards');
    }
  };

  // Must be logged in
  if (!user) {
    return (
      <div className="pt-32 text-center px-12">
        <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-4xl mb-4">
          Sign in to analyse your style
        </p>
        <p className="text-[#7A7060] text-sm mb-8 max-w-md mx-auto">
          Your style profile is saved to your account so you don't have to reconnect Pinterest every time.
        </p>
        <button
          onClick={() => navigate('/?login=true')}
          className="px-8 py-3 bg-[#C9A96E] text-[#18160F] text-xs uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors"
        >
          Sign in or create account
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">

      {/* Header */}
      <div className="px-12 py-10 border-b border-[#2E2A20]">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">Style analysis</p>
        <h1 className="font-['Cormorant_Garamond'] text-5xl italic text-[#F0EBE1] font-light">
          What does your Pinterest say?
        </h1>
      </div>

      <div className="px-12 py-10">

        {/* CONNECT */}
        {step === 'connect' && (
          <div className="max-w-xl">
            <p className="text-[#7A7060] text-sm leading-relaxed mb-8">
              Connect your Pinterest board and we'll analyse every pin — silhouette, colour, material, rise, fit — 
              and tell you exactly what you keep coming back to. Then we find those specific items from sustainable sources.
            </p>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button
              onClick={handleConnect}
              className="px-8 py-3.5 bg-[#C9A96E] text-[#18160F] text-xs uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors"
            >
              Connect Pinterest
            </button>
          </div>
        )}

        {/* LOADING BOARDS */}
        {step === 'connect' && loading && (
          <p className="text-[#7A7060] text-sm">Loading your boards...</p>
        )}

        {/* BOARD SELECTION */}
        {step === 'boards' && (
          <div>
            <p className="text-[#7A7060] text-sm mb-6">
              Choose a board to analyse. We'll look at every pin individually — the more pins, the more accurate the analysis.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#2E2A20] border border-[#2E2A20]">
              {boards.map(board => (
                <button
                  key={board.id}
                  onClick={() => handleAnalyseBoard(board)}
                  className="bg-[#18160F] hover:bg-[#211E16] p-5 text-left transition-colors group"
                >
                  <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-base mb-1 group-hover:text-[#C9A96E] transition-colors">
                    {board.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-[#4A4438]">Analyse →</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => { localStorage.removeItem(SESSION_KEY); setSessionKey(null); setStep('connect'); }}
              className="mt-6 text-[#4A4438] text-xs hover:text-[#7A7060] transition-colors"
            >
              Disconnect Pinterest
            </button>
          </div>
        )}

        {/* ANALYSING */}
        {step === 'analysing' && (
          <div className="text-center py-24">
            <div className="inline-block w-8 h-8 border border-[#C9A96E] border-t-transparent rounded-full animate-spin mb-6" />
            <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-2xl mb-3">
              Analysing your board...
            </p>
            <p className="text-[#7A7060] text-sm">
              Reading each pin individually. Looking at silhouette, colour, material, rise, fit.
              This takes about 30 seconds.
            </p>
          </div>
        )}

        {/* RESULTS */}
        {step === 'results' && analysis && (
          <div>
            {/* Summary */}
            <div className="mb-8 p-6 bg-[#211E16] border border-[#2E2A20]">
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-2">
                {pinsAnalysed} pins analysed
              </p>
              <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-3xl font-light mb-3">
                {analysis.summary || analysis.style_vibe || 'Your style'}
              </p>
              {analysis.colours?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {analysis.colours.map((c, i) => (
                    <span key={i} className="text-[10px] text-[#7A7060] border border-[#2E2A20] px-2 py-1 capitalize">{c}</span>
                  ))}
                  {analysis.materials?.map((m, i) => (
                    <span key={i} className="text-[10px] text-[#8AAA68] border border-[#1E2818] px-2 py-1 capitalize">{m}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Detailed breakdown */}
            {analysis.items?.length > 0 && (
              <div className="mb-10">
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-5">
                  Detailed breakdown
                </p>
                <StyleBreakdown breakdown={analysis} />
              </div>
            )}

            {/* Search terms used */}
            {analysis.search_terms?.length > 0 && (
              <div className="mb-10">
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">
                  Searching for
                </p>
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
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-5">
                  {products.length} matches found
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#2E2A20] border border-[#2E2A20]">
                  {products.map((product) => {
                    const priceDKK = product.price_dkk || (product.price ? Math.round(product.price / 100) : null);
                    const isExternal = ['ebay', 'etsy'].includes(product.source);
                    return (
                      <div
                        key={product.id}
                        onClick={() => isExternal ? window.open(product.source_url, '_blank') : null}
                        className="bg-[#18160F] hover:bg-[#211E16] transition-colors cursor-pointer"
                      >
                        <div className="aspect-[3/4] bg-[#211E16] overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-[10px] text-[#2E2A20] uppercase tracking-widest">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3.5">
                          <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-sm leading-snug mb-1 line-clamp-2">{product.title}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[#C9A96E] text-xs">{priceDKK ? `${priceDKK.toLocaleString('da-DK')} kr` : '—'}</span>
                            <span className="text-[10px] text-[#4A4438] uppercase">{product.source}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-10 flex gap-4">
              <button
                onClick={() => setStep('boards')}
                className="px-6 py-3 border border-[#2E2A20] text-[#7A7060] text-xs uppercase tracking-wider hover:border-[#7A7060] transition-colors"
              >
                Try another board
              </button>
              <button
                onClick={() => navigate('/search')}
                className="px-6 py-3 bg-[#C9A96E] text-[#18160F] text-xs uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors"
              >
                Go to search
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
