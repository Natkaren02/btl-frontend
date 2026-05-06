import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || '/api';
const PINTEREST_APP_ID = import.meta.env.VITE_PINTEREST_APP_ID;

export default function PinterestConnect({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState([]);
  const [token, setToken] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [matching, setMatching] = useState(false);
  const [connected, setConnected] = useState(false);

  // Check if Pinterest just redirected back with success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('pinterest');
    const tokenParam = params.get('token');
    const boardsParam = params.get('boards');

    if (status === 'success' && tokenParam) {
      const parsedBoards = JSON.parse(decodeURIComponent(boardsParam || '[]'));
      setToken(decodeURIComponent(tokenParam));
      setBoards(parsedBoards);
      setConnected(true);

      // Clean URL
      window.history.replaceState({}, '', '/search');
    }
  }, []);

  const handleConnect = () => {
    setLoading(true);
    // Redirect to backend Pinterest OAuth
    window.location.href = `${API}/pinterest/auth`;
  };

  const handleMatchBoard = async (board) => {
    setSelectedBoard(board.id);
    setMatching(true);
    try {
      const res = await fetch(`${API}/pinterest/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: token, board_id: board.id }),
      });
      const data = await res.json();
      onSuccess?.(data.results || []);
    } catch (err) {
      console.error('Match error:', err);
    } finally {
      setMatching(false);
    }
  };

  // Show board selector after connecting
  if (connected && boards.length > 0) {
    return (
      <div className="flex flex-col gap-3 min-w-[320px]">
        <p className="text-[#8AAA68] text-xs uppercase tracking-wider">
          Pinterest connected ✓ — choose a board to match
        </p>
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
          {boards.map(board => (
            <button
              key={board.id}
              onClick={() => handleMatchBoard(board)}
              disabled={matching}
              className={`text-left px-3 py-2 border text-xs transition-colors ${
                selectedBoard === board.id
                  ? 'border-[#C9A96E] text-[#C9A96E] bg-[#211E16]'
                  : 'border-[#2E2A20] text-[#7A7060] hover:border-[#C9A96E] hover:text-[#C9A96E]'
              }`}
            >
              {matching && selectedBoard === board.id ? 'Matching...' : board.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (connected && boards.length === 0) {
    return (
      <div className="text-[#7A7060] text-xs px-4 py-2 border border-[#2E2A20]">
        Connected — no public boards found
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

