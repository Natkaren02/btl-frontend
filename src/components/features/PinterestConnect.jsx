import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || '/api';
const SESSION_KEY = 'btl_pinterest_session';

export default function PinterestConnect({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState([]);
  const [sessionKey, setSessionKey] = useState(() => localStorage.getItem(SESSION_KEY) || null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('idle');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [pins, setPins] = useState([]);
  const [loadingPins, setLoadingPins] = useState(false);

  // On mount — check if we have a saved session and load boards
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('pinterest');
    const session = params.get('session');

    if (status === 'success' && session) {
      // Fresh connection from Pinterest redirect
      localStorage.setItem(SESSION_KEY, session);
      setSessionKey(session);
      window.history.replaceState({}, '', '/search');
      loadBoards(session);
    } else if (status === 'error') {
      setError('Pinterest connection failed. Please try again.');
      window.history.replaceState({}, '', '/search');
    } else if (sessionKey) {
      // Returning user — load boards from saved session
      loadBoards(sessionKey);
    }
  }, []);

  const loadBoards = async (session) => {
    try {
      const res = await fetch(`${API}/pinterest/boards/${session}`);
      if (!res.ok) {
        // Session expired — clear it
        localStorage.removeItem(SESSION_KEY);
        setSessionKey(null);
        setStep('idle');
        return;
      }
      const data = await res.json();
      setBoards(data.boards || []);
      setConnected(true);
      setStep('boards');
    } catch {
      setStep('idle');
    }
  };

  const handleConnect = () => {
    setLoading(true);
    window.location.href = `${API}/pinterest/auth`;
  };

  const handleDisconnect = () => {
    localStorage.removeItem(SESSION_KEY);
    setSessionKey(null);
    setConnected(false);
    setBoards([]);
    setStep('idle');
    setSelectedBoard(null);
    setPins([]);
  };

  const handleSelectBoard = (board) => {
    setSelectedBoard(board);
    setStep('mode');
  };

  const handleWholeBoard = async () => {
    setStep('matching');
    try {
      const res = await fetch(`${API}/pinterest/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_key: sessionKey, board_id: selectedBoard.id }),
      });
      const data = await res.json();
      onSuccess?.(data.results || []);
      setStep('done');
    } catch {
      setError('Matching failed.');
      setStep('mode');
    }
  };

  const handlePickPin = async () => {
    setStep('pins');
    setLoadingPins(true);
    try {
      const res = await fetch(`${API}/pinterest/pins/${sessionKey}/${selectedBoard.id}`);
      const data = await res.json();
      setPins(data.pins || []);
    } catch {
      setError('Failed to load pins.');
    } finally {
      setLoadingPins(false);
    }
  };

  const handleSelectPin = async (pin) => {
    setStep('matching');
    try {
      const res = await fetch(`${API}/pinterest/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_key: sessionKey, board_id: selectedBoard.id, pin_id: pin.id }),
      });
      const data = await res.json();
      onSuccess?.(data.results || []);
      setStep('done');
    } catch {
      setError('Matching failed.');
      setStep('pins');
    }
  };

  if (step === 'idle') {
    return (
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-lg mb-1">
            Connect your Pinterest board
          </p>
          <p className="text-[#7A7060] text-sm">
            Visual matching — the app reads your pins as images, not descriptions.
          </p>
        </div>
        <button
          onClick={handleConnect}
          disabled={loading}
          className="px-4 py-2 bg-[#C9A96E] text-[#18160F] text-xs uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors disabled:opacity-50 flex-shrink-0"
        >
          {loading ? 'Connecting...' : 'Connect Pinterest'}
        </button>
        {error && <p className="text-red-400 text-xs w-full">{error}</p>}
      </div>
    );
  }

  if (step === 'boards') {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between">
          <p className="text-[#8AAA68] text-xs uppercase tracking-wider">Pinterest connected ✓ — select a board</p>
          <button onClick={handleDisconnect} className="text-[#4A4438] text-xs hover:text-[#7A7060] transition-colors">Disconnect</button>
        </div>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {boards.map(board => (
            <button
              key={board.id}
              onClick={() => handleSelectBoard(board)}
              className="px-3 py-1.5 border border-[#2E2A20] text-xs text-[#7A7060] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors whitespace-nowrap"
            >
              {board.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'mode') {
    return (
      <div className="flex flex-col gap-3 w-full">
        <p className="text-[#8AAA68] text-xs uppercase tracking-wider">Board: {selectedBoard?.name}</p>
        <div className="flex gap-3 flex-wrap">
          <button onClick={handleWholeBoard} className="px-4 py-2.5 border border-[#C9A96E] text-[#C9A96E] text-xs uppercase tracking-wider hover:bg-[#C9A96E] hover:text-[#18160F] transition-colors">
            Analyse whole board
          </button>
          <button onClick={handlePickPin} className="px-4 py-2.5 border border-[#2E2A20] text-[#7A7060] text-xs uppercase tracking-wider hover:border-[#7A7060] hover:text-[#F0EBE1] transition-colors">
            Pick a specific pin
          </button>
          <button onClick={() => setStep('boards')} className="text-[#4A4438] text-xs hover:text-[#7A7060] transition-colors">← Change board</button>
        </div>
      </div>
    );
  }

  if (step === 'pins') {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between">
          <p className="text-[#8AAA68] text-xs uppercase tracking-wider">Pick a pin to match</p>
          <button onClick={() => setStep('mode')} className="text-[#4A4438] text-xs hover:text-[#7A7060]">← Back</button>
        </div>
        {loadingPins ? (
          <p className="text-[#7A7060] text-xs">Loading pins...</p>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 max-h-56 overflow-y-auto">
            {pins.map(pin => (
              <button
                key={pin.id}
                onClick={() => handleSelectPin(pin)}
                className="aspect-square overflow-hidden border border-[#2E2A20] hover:border-[#C9A96E] transition-colors"
                title={pin.title}
              >
                {pin.image ? (
                  <img src={pin.image} alt={pin.title || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#211E16] flex items-center justify-center">
                    <span className="text-[8px] text-[#4A4438]">No img</span>
                  </div>
                )}
              </button>
            ))}
            {!loadingPins && pins.length === 0 && (
              <p className="text-[#7A7060] text-xs col-span-8">No pins found in this board.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (step === 'matching') {
    return (
      <div className="flex items-center gap-3">
        <span className="inline-block w-4 h-4 border border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#7A7060] text-sm">Analysing your style...</p>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="flex items-center gap-4 flex-wrap">
        <p className="text-[#8AAA68] text-sm">✓ Matched to your style</p>
        <button onClick={() => setStep('boards')} className="text-[#7A7060] text-xs border border-[#2E2A20] px-3 py-1.5 hover:border-[#7A7060] transition-colors">
          Try another board
        </button>
        <button onClick={handleDisconnect} className="text-[#4A4438] text-xs hover:text-[#7A7060] transition-colors">
          Disconnect Pinterest
        </button>
      </div>
    );
  }

  return null;
}
