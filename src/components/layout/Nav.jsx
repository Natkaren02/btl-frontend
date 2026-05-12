import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Auth from '../features/Auth';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Search' },
    { to: '/style', label: 'My style' },
    { to: '/how-it-works', label: 'How it works' },
    { to: '/about', label: 'About' },
    { to: '/for-brands', label: 'For brands' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 transition-all duration-300 ${
        scrolled ? 'py-4 bg-[#18160F]/92 backdrop-blur-md border-b border-[#2E2A20]' : 'py-6'
      }`}>
        <Link to="/" className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-xl tracking-wide">
          BeyondTheLabel
        </Link>

        <ul className="hidden md:flex gap-10 list-none">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`text-[11px] tracking-[0.14em] uppercase transition-colors ${
                  location.pathname === to ? 'text-[#C9A96E]' : 'text-[#7A7060] hover:text-[#F0EBE1]'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/wardrobe"
                className="hidden md:block text-[11px] tracking-[0.14em] uppercase text-[#7A7060] hover:text-[#F0EBE1] transition-colors"
              >
                Wardrobe
              </Link>
              <button
                onClick={handleLogout}
                className="text-[11px] tracking-[0.12em] uppercase px-5 py-2.5 border border-[#2E2A20] text-[#7A7060] hover:border-[#7A7060] hover:text-[#F0EBE1] transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowAuth(true)}
                className="hidden md:block text-[11px] tracking-[0.14em] uppercase text-[#7A7060] hover:text-[#F0EBE1] transition-colors"
              >
                Log in
              </button>
              <Link
                to="/search"
                className="text-[11px] tracking-[0.12em] uppercase px-5 py-2.5 border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#18160F] transition-colors"
              >
                Start searching
              </Link>
            </>
          )}

          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-5 h-px bg-[#7A7060] transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-px bg-[#7A7060] transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-[#7A7060] transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#18160F] border-b border-[#2E2A20] md:hidden">
            {links.map(({ to, label }) => (
              <Link key={to} to={to} className="block px-12 py-4 text-[11px] tracking-[0.14em] uppercase text-[#7A7060] border-b border-[#2E2A20] hover:text-[#F0EBE1]">
                {label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/wardrobe" className="block px-12 py-4 text-[11px] tracking-[0.14em] uppercase text-[#7A7060] border-b border-[#2E2A20]">Wardrobe</Link>
                <button onClick={handleLogout} className="block w-full text-left px-12 py-4 text-[11px] tracking-[0.14em] uppercase text-[#7A7060]">Log out</button>
              </>
            ) : (
              <button onClick={() => { setShowAuth(true); setMenuOpen(false); }} className="block w-full text-left px-12 py-4 text-[11px] tracking-[0.14em] uppercase text-[#7A7060]">
                Log in / Sign up
              </button>
            )}
          </div>
        )}
      </nav>

      {showAuth && (
        <Auth
          onClose={() => setShowAuth(false)}
          onSuccess={(user) => setUser(user)}
        />
      )}
    </>
  );
}
