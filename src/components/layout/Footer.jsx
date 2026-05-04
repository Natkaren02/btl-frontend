import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[#2E2A20] px-12 pt-12 pb-8 mt-20">
      <div className="flex flex-wrap justify-between gap-10 mb-12">
        <div>
          <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-2xl mb-3">BeyondTheLabel</p>
          <p className="text-[#7A7060] text-sm max-w-xs leading-relaxed">
            Sustainable fashion, found. Verified independent brands and second-hand, in one honest search.
          </p>
        </div>
        <div className="flex gap-16">
          {[
            { heading: 'Platform', links: [
              { to: '/search', label: 'Search' },
              { to: '/how-it-works', label: 'How it works' },
              { to: '/wardrobe', label: 'Wardrobe tracker' },
            ]},
            { heading: 'Brands', links: [
              { to: '/for-brands', label: 'Get verified' },
              { to: '/for-brands#criteria', label: 'Verification criteria' },
              { to: '/for-brands#free', label: 'Small brand programme' },
            ]},
            { heading: 'Company', links: [
              { to: '/about', label: 'About us' },
              { to: '/about#team', label: 'The team' },
              { href: 'mailto:hello@beyondthelabel.dk', label: 'Contact' },
            ]},
          ].map(({ heading, links }) => (
            <div key={heading}>
              <p className="text-[10px] tracking-[0.14em] uppercase text-[#7A7060] mb-4">{heading}</p>
              <ul className="space-y-2 list-none">
                {links.map(({ to, href, label }) => (
                  <li key={label}>
                    {to ? (
                      <Link to={to} className="text-[#7A7060] text-sm hover:text-[#F0EBE1] transition-colors">
                        {label}
                      </Link>
                    ) : (
                      <a href={href} className="text-[#7A7060] text-sm hover:text-[#F0EBE1] transition-colors">
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center pt-6 border-t border-[#2E2A20]">
        <p className="text-[#7A7060] text-xs tracking-wider">© 2026 BeyondTheLabel · Copenhagen</p>
        <p className="text-[#7A7060] text-xs">Built by people who couldn't find the clothes they wanted.</p>
      </div>
    </footer>
  );
}
