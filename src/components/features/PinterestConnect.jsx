import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || '/api';

export default function PinterestConnect({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState([]);
  const [sessionKey, setSessionKey] = useState(null);
  const [matching, setMatching] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('pinterest');
    const session = params.get('session');

    if (status === 'success' && session) {
      setSessionKey(session);
      window.history.replaceState({}, '', '/search');
      // Fetch boards using session key
      fetch(`${API}/pinterest/boards/${session}`)
        .then(r => r.json())
        .then(data => {
          setBoards(data.boards || []);
          setConnected(true);
        })
        .catch(() => setError('Failed to load boards'));
    } else if (status === 'error') {
      setError('Pinterest connection failed. Please try again.');
      window.history.replaceState({}, '', '/search');
    }
  }, []);

  const handleConnect = () => {
    setLoading(true);
    window.location.href = `${API}/pinterest/auth`;
  };

  const handleMatchBoard = async (board) => {
    setMatching(true);
    try {
      const res = await fetch(`${API}/pinterest/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_key: sessionKey, board_id: board.id }),
      });
      const data = await res.json();
      onSuccess?.(data.results || []);
    } catch (err) {
      setError('Matching failed. Please try again.');
    } finally {
      setMatching(false);
    }
  };

  if (connected && boards.length > 0) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-[#8AAA68] text-xs uppercase tracking-wider">
          Pinterest connected ✓ — choose a board to match
        </p>
        <div className="flex flex-wrap gap-2">
          {boards.map(board => (
            <button
              key={board.id}
              onClick={() => handleMatchBoard(board)}
              disabled={matching}
              className="px-3 py-1.5 border border-[#2E2A20] text-xs text-[#7A7060] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors disabled:opacity-50"
            >
              {matching ? 'Matching...' : board.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-red-400 text-xs">{error}</p>
        <button onClick={handleConnect} className="px-4 py-2 bg-[#C9A96E] text-[#18160F] text-xs uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors">
          Try again
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="px-4 py-2 bg-[#C9A96E] text-[#18160F] text-xs uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors disabled:opacity-50"
    >
      {loading ? 'Connecting...' : 'Connect Pinterest'}
    </button>
  );
}

