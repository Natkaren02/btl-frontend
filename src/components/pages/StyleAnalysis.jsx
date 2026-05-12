import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const API = import.meta.env.VITE_API_URL || 'https://btl-backend-production-f682.up.railway.app/api';
const SESSION_KEY = 'btl_pinterest_session';

// ── COMPONENTS ────────────────────────────────────────────────────

function ProgressBar({ progress, message }) {
  return (
    <div className="text-center py-24">
      <div className="inline-block w-8 h-8 border border-[#C9A96E] border-t-transparent rounded-full animate-spin mb-8" />
      <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-2xl mb-3">{message}</p>
      <div className="max-w-xs mx-auto h-px bg-[#2E2A20] relative mt-6">
        <div
          className="absolute left-0 top-0 h-px bg-[#C9A96E] transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[#4A4438] text-xs mt-2">{progress}%</p>
    </div>
  );
}

function FormulaGroup({ group, onShop }) {
  const [showItems, setShowItems] = useState(false);

  return (
    <div className="border border-[#2E2A20] overflow-hidden">
      {/* Pin images showing this formula */}
      {group.pins?.filter(Boolean).length > 0 && (
        <div
          className="grid gap-px bg-[#2E2A20]"
          style={{ gridTemplateColumns: `repeat(${Math.min(group.pins.filter(Boolean).length, 4)}, 1fr)` }}
        >
          {group.pins.filter(Boolean).slice(0, 4).map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-[#211E16]">
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      )}

      {/* Generated formula illustration */}
      {group.generated_image && (
        <div className="border-t border-[#2E2A20]">
          <img src={group.generated_image} alt="Outfit formula" className="w-full object-cover max-h-64" />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider text-[#7A7060] mb-1">Outfit formula — saved {group.count}×</p>
            <h3 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-xl leading-snug">
              {group.formula}
            </h3>
          </div>
          <span className="font-['Cormorant_Garamond'] italic text-[#C9A96E] text-4xl ml-4 flex-shrink-0">
            {group.count}×
          </span>
        </div>

        {group.proportions && (
          <p className="text-[#7A7060] text-sm mb-3 leading-relaxed border-l border-[#2E2A20] pl-3">
            {group.proportions}
          </p>
        )}

        {group.balance && (
          <p className="text-[#8AAA68] text-xs mb-4 leading-relaxed">
            ✦ {group.balance}
          </p>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowItems(!showItems)}
            className="text-xs border border-[#2E2A20] text-[#7A7060] px-4 py-2 hover:border-[#7A7060] transition-colors"
          >
            {showItems ? 'Hide breakdown' : 'See item breakdown'}
          </button>
          <button
            onClick={() => onShop(group)}
            className="text-xs bg-[#C9A96E] text-[#18160F] px-4 py-2 hover:bg-[#F0EBE1] transition-colors uppercase tracking-wider"
          >
            Shop this formula
          </button>
        </div>

        {showItems && group.items?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#2E2A20] space-y-2">
            {group.items.map((item, i) => {
              const parts = [item.rise, item.fit, item.length, item.colour, item.material, item.details].filter(Boolean);
              return (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#C9A96E] text-[10px] uppercase tracking-wider w-20 flex-shrink-0 pt-0.5">
                    {item.category}
                  </span>
                  <p className="text-[#A89880] text-xs leading-relaxed capitalize">
                    {item.subcategory} — {parts.join(' · ')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function PinBreakdown({ analysis, onShopItem }) {
  if (!analysis?.items?.length) return null;

  return (
    <div className="space-y-4">
      <div className="mb-6 p-4 bg-[#211E16] border border-[#2E2A20]">
        <p className="text-[10px] uppercase tracking-wider text-[#7A7060] mb-2">Outfit formula</p>
        <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-lg">
          {analysis.outfit_formula || analysis.overall_vibe}
        </p>
        {analysis.balance_notes && (
          <p className="text-[#8AAA68] text-xs mt-2">✦ {analysis.balance_notes}</p>
        )}
      </div>

      {analysis.items.map((item, i) => (
        <div key={i} className="border border-[#2E2A20] p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#C9A96E] mb-1">{item.category}</p>
              <h4 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-lg capitalize">
                {item.subcategory}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            {[
              { label: 'Colour', value: item.colour },
              { label: 'Material', value: item.material },
              { label: 'Fit', value: item.fit },
              { label: 'Rise', value: item.rise },
              { label: 'Length', value: item.length },
              { label: 'Break', value: item.break },
              { label: 'Heel', value: item.heel },
              { label: 'Toe shape', value: item.toe },
              { label: 'Strap', value: item.strap_type },
              { label: 'Hardware', value: item.hardware },
              { label: 'Closure', value: item.closure },
            ].filter(f => f.value && f.value !== 'n/a' && f.value !== 'N/A').map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-wider text-[#4A4438]">{label}</p>
                <p className="text-[#A89880] text-xs capitalize mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {item.details && (
            <p className="text-[#7A7060] text-xs border-t border-[#2E2A20] pt-2 mt-2">
              Details: {item.details}
            </p>
          )}

          <button
            onClick={() => onShopItem(item)}
            className="mt-3 text-xs border border-[#C9A96E] text-[#C9A96E] px-4 py-2 hover:bg-[#C9A96E] hover:text-[#18160F] transition-colors uppercase tracking-wider"
          >
            Find this item
          </button>
        </div>
      ))}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────

export default function StyleAnalysisPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessionKey, setSessionKey] = useState(() => localStorage.getItem(SESSION_KEY) || null);
  const [boards, setBoards] = useState([]);
  const [pins, setPins] = useState([]);
  const [step, setStep] = useState('connect'); // connect | boards | board-analysing | board-results | pins | pin-analysing | pin-results
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boardResult, setBoardResult] = useState(null);
  const [pinResult, setPinResult] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobProgress, setJobProgress] = useState(0);
  const [jobMessage, setJobMessage] = useState('');
  const [shopResults, setShopResults] = useState([]);
  const [shopping, setShopping] = useState(false);
  const [loadingPins, setLoadingPins] = useState(false);

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

  const pollJob = (jobId, onDone, onFail) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API}/pinterest/job/${jobId}`);
        const job = await res.json();
        setJobProgress(job.progress || 0);
        setJobMessage(job.message || '');
        if (job.status === 'done') { clearInterval(interval); onDone(job.result); }
        else if (job.status === 'failed') { clearInterval(interval); onFail(job.error); }
      } catch {}
    }, 3000);
    // Safety timeout 10 minutes
    setTimeout(() => clearInterval(interval), 600000);
  };

  const handleAnalyseBoard = async (board) => {
    setSelectedBoard(board);
    setStep('board-analysing');
    setJobProgress(0);
    setJobMessage('Starting analysis...');
    setError('');

    try {
      const res = await fetch(`${API}/pinterest/analyse-board`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_key: sessionKey, board_id: board.id }),
      });
      const { job_id } = await res.json();
      pollJob(job_id,
        (result) => { setBoardResult(result); setStep('board-results'); },
        (err) => { setError(err || 'Analysis failed'); setStep('boards'); }
      );
    } catch { setError('Failed to start analysis'); setStep('boards'); }
  };

  const handlePickPin = async (board) => {
    setSelectedBoard(board);
    setStep('pins');
    setLoadingPins(true);
    try {
      const res = await fetch(`${API}/pinterest/pins/${sessionKey}/${board.id}`);
      const data = await res.json();
      setPins(data.pins || []);
    } catch { setError('Failed to load pins'); }
    finally { setLoadingPins(false); }
  };

  const handleAnalysePin = async (pin) => {
    setSelectedPin(pin);
    setStep('pin-analysing');
    setJobProgress(0);
    setJobMessage('Examining your pin in detail...');

    try {
      const res = await fetch(`${API}/pinterest/analyse-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_key: sessionKey, pin_image: pin.image }),
      });
      const { job_id } = await res.json();
      pollJob(job_id,
        (result) => { setPinResult(result); setStep('pin-results'); },
        (err) => { setError(err || 'Analysis failed'); setStep('pins'); }
      );
    } catch { setError('Failed to analyse pin'); setStep('pins'); }
  };

  const shopFormula = async (group) => {
    setShopping(true);
    setShopResults([]);
    const query = group.formula;
    try {
      const res = await fetch(`${API}/ebay/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setShopResults(data.results || []);
    } catch {}
    finally { setShopping(false); }
  };

  const shopItem = async (item) => {
    setShopping(true);
    setShopResults([]);
    const query = item.search_query || [item.rise, item.fit, item.colour, item.subcategory].filter(Boolean).join(' ');
    try {
      const res = await fetch(`${API}/ebay/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setShopResults(data.results || []);
    } catch {}
    finally { setShopping(false); }
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

        {/* CONNECT */}
        {step === 'connect' && (
          <div className="max-w-xl">
            <p className="text-[#7A7060] text-sm leading-relaxed mb-8">
              Connect your Pinterest board. We'll analyse every pin — silhouette, colour, material, rise, fit, proportions —
              and identify your recurring outfit formulas. Or pick a single pin and we'll break down every item and find exact sustainable matches.
            </p>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            {loading ? <p className="text-[#7A7060] text-sm">Loading...</p> : (
              <button onClick={() => window.location.href = `${API}/pinterest/auth`}
                className="px-8 py-3.5 bg-[#C9A96E] text-[#18160F] text-xs uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors">
                Connect Pinterest
              </button>
            )}
          </div>
        )}

        {/* BOARDS */}
        {step === 'boards' && (
          <div>
            <p className="text-[#7A7060] text-sm mb-2">Choose what to do with your board:</p>
            <p className="text-[#4A4438] text-xs mb-8">Analyse whole board = find your outfit formulas. Pick a pin = break down one specific outfit.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2E2A20] border border-[#2E2A20] mb-6">
              {boards.map(board => (
                <div key={board.id} className="bg-[#18160F] p-5">
                  <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-base mb-4">{board.name}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleAnalyseBoard(board)}
                      className="flex-1 text-[10px] uppercase tracking-wider border border-[#C9A96E] text-[#C9A96E] px-3 py-2 hover:bg-[#C9A96E] hover:text-[#18160F] transition-colors">
                      Analyse board
                    </button>
                    <button onClick={() => handlePickPin(board)}
                      className="flex-1 text-[10px] uppercase tracking-wider border border-[#2E2A20] text-[#7A7060] px-3 py-2 hover:border-[#7A7060] transition-colors">
                      Pick a pin
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { localStorage.removeItem(SESSION_KEY); setSessionKey(null); setStep('connect'); }}
              className="text-[#4A4438] text-xs hover:text-[#7A7060] transition-colors">
              Disconnect Pinterest
            </button>
          </div>
        )}

        {/* BOARD ANALYSING */}
        {step === 'board-analysing' && (
          <ProgressBar progress={jobProgress} message={jobMessage || 'Analysing your board...'} />
        )}

        {/* BOARD RESULTS */}
        {step === 'board-results' && boardResult && (
          <div>
            <div className="mb-8 p-6 bg-[#211E16] border border-[#2E2A20]">
              <p className="text-[10px] tracking-wider uppercase text-[#7A7060] mb-2">
                {boardResult.pins_analysed} pins analysed
              </p>
              <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-3xl mb-3">{boardResult.summary}</p>
              <div className="flex flex-wrap gap-2">
                {boardResult.dominant_colours?.map((c, i) => (
                  <span key={i} className="text-[10px] text-[#C9A96E] border border-[#C9A96E]/30 px-2 py-1 capitalize">{c}</span>
                ))}
                {boardResult.dominant_materials?.map((m, i) => (
                  <span key={i} className="text-[10px] text-[#8AAA68] border border-[#8AAA68]/30 px-2 py-1 capitalize">{m}</span>
                ))}
              </div>
            </div>

            {boardResult.formula_groups?.length > 0 && (
              <div className="mb-10">
                <p className="text-[10px] tracking-wider uppercase text-[#7A7060] mb-6">Your outfit formulas</p>
                <div className="space-y-6">
                  {boardResult.formula_groups.map((group, i) => (
                    <FormulaGroup key={i} group={group} onShop={shopFormula} />
                  ))}
                </div>
              </div>
            )}

            {/* Shop results */}
            {(shopping || shopResults.length > 0) && (
              <div className="mt-10">
                <p className="text-[10px] tracking-wider uppercase text-[#7A7060] mb-5">
                  {shopping ? 'Finding matches...' : `${shopResults.length} matches found`}
                </p>
                {shopResults.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#2E2A20] border border-[#2E2A20]">
                    {shopResults.filter(p => p.images?.[0]).map((product) => {
                      const priceDKK = product.price_dkk || (product.price ? Math.round(product.price / 100) : null);
                      return (
                        <div key={product.id} onClick={() => window.open(product.source_url, '_blank')}
                          className="bg-[#18160F] hover:bg-[#211E16] transition-colors cursor-pointer">
                          <div className="aspect-[3/4] overflow-hidden bg-[#211E16]">
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="p-3.5">
                            <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-sm line-clamp-2 mb-1">{product.title}</p>
                            <span className="text-[#C9A96E] text-xs">{priceDKK ? `${priceDKK.toLocaleString('da-DK')} kr` : '—'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="mt-10 flex gap-4">
              <button onClick={() => setStep('boards')}
                className="px-6 py-3 border border-[#2E2A20] text-[#7A7060] text-xs uppercase tracking-wider hover:border-[#7A7060] transition-colors">
                Try another board
              </button>
            </div>
          </div>
        )}

        {/* PIN GRID */}
        {step === 'pins' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#7A7060] text-sm">Click a pin to break down every item in the outfit and find exact sustainable matches.</p>
              <button onClick={() => setStep('boards')} className="text-[#4A4438] text-xs hover:text-[#7A7060]">← Back</button>
            </div>
            {loadingPins ? (
              <p className="text-[#7A7060] text-sm">Loading pins...</p>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-px bg-[#2E2A20] border border-[#2E2A20]">
                {pins.filter(p => p.image).map(pin => (
                  <button key={pin.id} onClick={() => handleAnalysePin(pin)}
                    className="aspect-square overflow-hidden bg-[#211E16] hover:opacity-80 transition-opacity relative group">
                    <img src={pin.image} alt={pin.title || ''} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#18160F]/0 group-hover:bg-[#18160F]/40 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] uppercase tracking-wider text-[#F0EBE1] transition-opacity">Analyse</span>
                    </div>
                  </button>
                ))}
                {pins.filter(p => p.image).length === 0 && (
                  <p className="text-[#7A7060] text-sm col-span-6 p-4">No pins with images found in this board.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* PIN ANALYSING */}
        {step === 'pin-analysing' && (
          <div>
            {selectedPin?.image && (
              <div className="flex justify-center mb-8">
                <img src={selectedPin.image} alt="" className="max-h-64 object-contain border border-[#2E2A20]" />
              </div>
            )}
            <ProgressBar progress={jobProgress || 50} message={jobMessage || 'Analysing every item in this outfit...'} />
          </div>
        )}

        {/* PIN RESULTS */}
        {step === 'pin-results' && pinResult && (
          <div>
            <div className="flex gap-6 mb-8">
              {selectedPin?.image && (
                <div className="w-48 flex-shrink-0">
                  <img src={selectedPin.image} alt="" className="w-full object-cover border border-[#2E2A20]" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-[#7A7060] mb-2">Pin breakdown</p>
                <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-2xl mb-2">
                  {pinResult.overall_vibe}
                </p>
                {pinResult.outfit_formula && (
                  <p className="text-[#A89880] text-sm">{pinResult.outfit_formula}</p>
                )}
              </div>
            </div>

            <PinBreakdown analysis={pinResult} onShopItem={shopItem} />

            {(shopping || shopResults.length > 0) && (
              <div className="mt-10">
                <p className="text-[10px] tracking-wider uppercase text-[#7A7060] mb-5">
                  {shopping ? 'Finding exact matches...' : `${shopResults.length} matches found`}
                </p>
                {shopResults.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#2E2A20] border border-[#2E2A20]">
                    {shopResults.filter(p => p.images?.[0]).map((product) => {
                      const priceDKK = product.price_dkk || (product.price ? Math.round(product.price / 100) : null);
                      return (
                        <div key={product.id} onClick={() => window.open(product.source_url, '_blank')}
                          className="bg-[#18160F] hover:bg-[#211E16] transition-colors cursor-pointer">
                          <div className="aspect-[3/4] overflow-hidden bg-[#211E16]">
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="p-3.5">
                            <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-sm line-clamp-2 mb-1">{product.title}</p>
                            <span className="text-[#C9A96E] text-xs">{priceDKK ? `${priceDKK.toLocaleString('da-DK')} kr` : '—'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="mt-10 flex gap-4">
              <button onClick={() => { setStep('pins'); setShopResults([]); }}
                className="px-6 py-3 border border-[#2E2A20] text-[#7A7060] text-xs uppercase tracking-wider hover:border-[#7A7060] transition-colors">
                Pick another pin
              </button>
              <button onClick={() => setStep('boards')}
                className="px-6 py-3 border border-[#2E2A20] text-[#7A7060] text-xs uppercase tracking-wider hover:border-[#7A7060] transition-colors">
                Back to boards
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
