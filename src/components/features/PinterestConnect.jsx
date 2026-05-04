import { useState } from 'react';
import { users as usersApi } from '../../lib/api';

export default function PinterestConnect({ onSuccess }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('idle'); // idle | input | loading | done

  const handleConnect = async () => {
    if (!url.trim()) return;
    if (!url.includes('pinterest.')) {
      setError('Please enter a Pinterest board URL');
      return;
    }

    setLoading(true);
    setError('');
    setStep('loading');

    try {
      const results = await usersApi.connectPinterest(url.trim());
      setStep('done');
      onSuccess?.(results);
    } catch (err) {
      setError(err.message || 'Failed to connect Pinterest. Check the board is public.');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="text-[#8AAA68] text-xs px-4 py-2 border border-[#1E2818]">
        Pinterest connected ✓
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="text-[#7A7060] text-xs px-4 py-2 border border-[#2E2A20] flex items-center gap-2">
        <span className="inline-block w-3 h-3 border border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
        Analysing your board...
      </div>
    );
  }

  if (step === 'input') {
    return (
      <div className="flex flex-col gap-2 min-w-[320px]">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://pinterest.com/username/board-name"
            className="flex-1 bg-[#18160F] border border-[#2E2A20] text-[#F0EBE1] text-xs px-3 py-2 outline-none placeholder-[#4A4438] focus:border-[#7A7060]"
            onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
            autoFocus
          />
          <button
            onClick={handleConnect}
            disabled={loading}
            className="px-4 py-2 bg-[#C9A96E] text-[#18160F] text-xs uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors disabled:opacity-50"
          >
            Analyse
          </button>
        </div>
        {error && <p className="text-red-400 text-[11px]">{error}</p>}
        <p className="text-[#4A4438] text-[10px]">
          Board must be public. The visual model reads your pins as images — no text description needed.
        </p>
      </div>
    );
  }

  // idle state — just a button
  return (
    <button
      onClick={() => setStep('input')}
      className="px-4 py-2 bg-[#C9A96E] text-[#18160F] text-xs uppercase tracking-wider hover:bg-[#F0EBE1] transition-colors"
    >
      Connect Pinterest
    </button>
  );
}
