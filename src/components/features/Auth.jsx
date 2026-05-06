import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export { supabase };

export default function Auth({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email to confirm your account.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess?.(data.user);
        onClose?.();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18160F]/90 backdrop-blur-sm">
      <div className="bg-[#18160F] border border-[#2E2A20] p-10 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#4A4438] hover:text-[#F0EBE1] text-xl"
        >
          ×
        </button>

        <h2 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-3xl mb-1">
          {mode === 'login' ? 'Welcome back.' : 'Create account.'}
        </h2>
        <p className="text-[#7A7060] text-sm mb-8">
          {mode === 'login' ? 'Log in to access your wardrobe and saved items.' : 'Start saving items, tracking your wardrobe, and connecting Pinterest.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-[0.14em] uppercase text-[#7A7060]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-[#211E16] border border-[#2E2A20] text-[#F0EBE1] text-sm px-4 py-3 outline-none focus:border-[#7A7060]"
              placeholder="your@email.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-[0.14em] uppercase text-[#7A7060]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-[#211E16] border border-[#2E2A20] text-[#F0EBE1] text-sm px-4 py-3 outline-none focus:border-[#7A7060]"
              placeholder={mode === 'signup' ? 'Minimum 6 characters' : '••••••••'}
              minLength={6}
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}
          {message && <p className="text-[#8AAA68] text-xs">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="py-3 bg-[#C9A96E] text-[#18160F] text-[11px] tracking-[0.14em] uppercase hover:bg-[#F0EBE1] transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className="text-[#7A7060] text-xs mt-6 text-center">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage(''); }}
            className="text-[#C9A96E] hover:text-[#F0EBE1] transition-colors"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
