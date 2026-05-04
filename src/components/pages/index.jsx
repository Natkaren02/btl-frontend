import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="min-h-screen grid md:grid-cols-2 items-center px-12 gap-12">
        <div className="pt-12">
          <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-8 flex items-center gap-4">
            <span className="inline-block w-8 h-px bg-[#C9A96E]" />
            Sustainable fashion, finally findable
          </p>
          <h1 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] font-light leading-none mb-8" style={{ fontSize: 'clamp(4rem,10vw,9rem)' }}>
            Beyond<br />the <span className="text-[#C9A96E]">label.</span>
          </h1>
          <p className="text-[#7A7060] text-base max-w-md mb-10 leading-relaxed">
            One search across second-hand platforms and verified independent brands.
            Matched to your actual style — not a description of it.
          </p>
          <div className="flex gap-4">
            <Link to="/search" className="px-8 py-4 bg-[#C9A96E] text-[#18160F] text-[11px] tracking-[0.14em] uppercase hover:bg-[#F0EBE1] transition-colors">
              Start searching
            </Link>
            <Link to="/how-it-works" className="px-8 py-4 border border-[#2E2A20] text-[#7A7060] text-[11px] tracking-[0.14em] uppercase hover:border-[#7A7060] hover:text-[#F0EBE1] transition-colors">
              How it works
            </Link>
          </div>
        </div>
        <div className="hidden md:grid grid-cols-2 gap-2 pt-24 pb-12">
          {['Verified · 780 kr', 'Second-hand · 320 kr', 'Verified · 1,100 kr'].map((label, i) => (
            <div
              key={i}
              className={`bg-[#211E16] border border-[#2E2A20] relative ${i === 0 ? 'row-span-2' : ''}`}
              style={{ aspectRatio: i === 0 ? '2/3' : '3/4' }}
            >
              <span className="absolute bottom-3 left-3 text-[9px] tracking-wider uppercase text-[#7A7060] bg-[#18160F]/70 px-2 py-1">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Ticker */}
      <div className="border-y border-[#2E2A20] py-3.5 overflow-hidden">
        <div className="flex gap-12 animate-[ticker_22s_linear_infinite] whitespace-nowrap" style={{ width: 'max-content' }}>
          {['Verified independent brands', 'Second-hand · Vinted · DBA', 'Visual style matching', 'Fibre transparency', 'No greenwashing', 'Copenhagen · Nordic · Europe'].concat(['Verified independent brands', 'Second-hand · Vinted · DBA', 'Visual style matching', 'Fibre transparency', 'No greenwashing', 'Copenhagen · Nordic · Europe']).map((t, i) => (
            <span key={i} className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] inline-flex items-center gap-3">
              {t} <span className="text-[#C9A96E] text-[8px]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Steps */}
      <section className="px-12 py-24 border-b border-[#2E2A20]">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">How it works</p>
            <h2 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-5xl font-light">Find what you actually want</h2>
          </div>
          <Link to="/how-it-works" className="text-[11px] tracking-[0.12em] uppercase text-[#7A7060] border border-[#2E2A20] px-5 py-2.5 hover:text-[#F0EBE1] hover:border-[#7A7060] transition-colors">
            Full walkthrough →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#2E2A20] border border-[#2E2A20]">
          {[
            ['01', 'Connect your Pinterest', 'The app reads your pins as images — not as a text description. Visual matching, not keyword matching.'],
            ['02', 'Search everywhere at once', 'One query searches Vinted, DBA, Sellply, and verified independent sustainable brands simultaneously.'],
            ['03', 'See what\'s actually in it', 'Sustainability score and fibre composition on every item. Unknown is marked unknown — never guessed.'],
            ['04', 'Buy with intention', 'Optional 25-hour hold. Wardrobe tracker. Re-list when done. The full circular loop in one place.'],
          ].map(([num, title, desc]) => (
            <div key={num} className="bg-[#18160F] p-8">
              <p className="font-['Cormorant_Garamond'] italic text-7xl text-[#2E2A20] leading-none mb-5">{num}</p>
              <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-lg mb-3">{title}</p>
              <p className="text-[#7A7060] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-12 py-24 border-b border-[#2E2A20]">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">What makes it different</p>
        <h2 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-5xl font-light mb-16">
          Built around the problem,<br /><span className="text-[#C9A96E]">not around sales</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#2E2A20] border border-[#2E2A20]">
          {[
            ['◎', 'Visual style matching', 'Pinterest board → image embeddings → products matched by shape and silhouette, not keywords. Low-rise stays low-rise.'],
            ['✦', 'No fast fashion', 'We do not integrate fast fashion retailers — even those with sustainability sub-ranges. Every brand is independently verified.'],
            ['⌁', 'Small brands, front and centre', 'Independent sustainable labels are the platform\'s heart. Brands under 2M DKK revenue are verified for free.'],
            ['◈', 'Honest fibre data', 'Fibre composition on every item. Where data is unavailable — marked unknown. Never estimated, never invented.'],
            ['⟳', 'The circular loop', 'Wardrobe tracker, cost-per-wear, 25-hour wishlist hold, and direct Vinted re-listing. Full lifecycle in one place.'],
            ['◇', 'No advertising', 'Brands appear because they are verified — not because they paid for placement. Revenue from subscriptions and affiliate fees only.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="bg-[#18160F] p-8 hover:bg-[#211E16] transition-colors">
              <span className="text-xl text-[#C9A96E] block mb-4">{icon}</span>
              <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-lg mb-3">{title}</p>
              <p className="text-[#7A7060] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="px-12 py-32 text-center">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-8">Our position</p>
        <h2 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] font-light mb-8 mx-auto" style={{ fontSize: 'clamp(2rem,5vw,4rem)', maxWidth: '800px' }}>
          Sustainable fashion shouldn't require expertise, extra time, or extra money to access.
        </h2>
        <p className="text-[#7A7060] text-base max-w-xl mx-auto mb-12 leading-relaxed">
          The barrier is not awareness. People know about fast fashion's impact.
          The barrier is friction. BeyondTheLabel removes the friction.
        </p>
        <Link to="/search" className="px-10 py-4 bg-[#C9A96E] text-[#18160F] text-[11px] tracking-[0.14em] uppercase hover:bg-[#F0EBE1] transition-colors">
          Start searching
        </Link>
      </section>
    </div>
  );
}

// HowItWorks.jsx
export function HowItWorks() {
  const steps = [
    { num: '01', title: 'Set up your style profile', body: 'Tell us your size, budget, and whether you\'re looking for second-hand, new, or both. Then connect your Pinterest board — or skip this and search directly. Either works.', callout: 'The Pinterest connection is optional but changes everything. Instead of describing your style in words — which consistently produces wrong results — the app reads your board visually. Low-rise stays low-rise.' },
    { num: '02', title: 'How the visual matching works', body: 'When you connect Pinterest, each pinned image is processed by a visual model (CLIP by OpenAI — open source). The model encodes the shape, silhouette, colour palette, and texture of each image as a numerical vector — without converting it to words first. Product images are encoded the same way. Matching is image-to-image: the most visually similar products rise to the top.', callout: 'This is why it works when text search fails. Describing "low-rise dark wide-leg jeans" returns high-waisted trousers. Showing the image returns the correct silhouette — because the model compares shapes, not keywords.' },
    { num: '03', title: 'One search, everywhere at once', body: 'A single search queries Vinted and DBA for second-hand listings, and simultaneously searches our curated directory of verified independent sustainable brands. We do not integrate fast fashion retailers — even those with sustainability filters. Self-reported sustainability claims without independent verification do not meet our threshold.', callout: null },
    { num: '04', title: 'Understanding what you\'re looking at', body: 'Every result shows a sustainability score (0–100), fibre composition where available, and the data source. For second-hand items, fibre data is retrieved via brand-product lookup. Where data is unavailable, it is marked unknown — never estimated, never invented.', callout: 'Transparency about what we don\'t know is itself a form of integrity. A platform that shows a sustainability score for every item without disclosing the source is doing greenwashing, not sustainability.' },
    { num: '05', title: 'Buying with intention', body: 'BeyondTheLabel includes tools designed to reduce overconsumption — not because we think you shouldn\'t buy clothes, but because the platform is built around the full lifecycle of a garment, not just the purchase moment.', callout: null, list: ['Wardrobe tracker — log what you own. Before a search, check if you already have something similar. A gentle nudge, not a block.', 'Cost-per-wear — tracks how often you wear each item. Makes the real value of quality vs fast fashion visible over time.', '25-hour wishlist hold (opt-in) — save something, come back tomorrow. Optional, for users who want the space to decide.', 'Re-list — done with something? List it on Vinted directly from the app. Clothes stay in circulation, not landfill.'] },
  ];

  return (
    <div className="pt-20">
      <div className="px-12 py-16 border-b border-[#2E2A20]">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">The full walkthrough</p>
        <h1 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-6xl font-light">
          How <span className="text-[#C9A96E]">BeyondTheLabel</span> works
        </h1>
      </div>
      <div className="px-12 py-12">
        {steps.map(({ num, title, body, callout, list }) => (
          <div key={num} className="grid md:grid-cols-4 gap-8 py-16 border-b border-[#2E2A20] last:border-0">
            <div>
              <p className="font-['Cormorant_Garamond'] italic text-[#2E2A20] text-9xl font-light leading-none">{num}</p>
            </div>
            <div className="md:col-span-3">
              <h2 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-3xl font-light mb-5">{title}</h2>
              <p className="text-[#7A7060] text-sm leading-relaxed mb-5 max-w-2xl">{body}</p>
              {list && (
                <ul className="space-y-4 mb-5">
                  {list.map((item, i) => (
                    <li key={i} className="flex gap-4 text-sm">
                      <span className="text-[#C9A96E] flex-shrink-0 mt-0.5">—</span>
                      <span className="text-[#7A7060]">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {callout && (
                <div className="border-l-2 border-[#C9A96E] pl-5 bg-[#211E16] py-4 pr-5">
                  <p className="text-[#7A7060] text-sm italic leading-relaxed">{callout}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// About.jsx
export function About() {
  const team = [
    ['ZL', 'Zoe Lafeuille', 'Strategy & Market Development'],
    ['LB', 'Lova Bergman', 'Sustainability & Brand Verification'],
    ['JI', 'Justin Inglisa', 'Business Model & Commercial Partnerships'],
    ['PK', 'Panagiota Katsoulari', 'Consumer Research & Stakeholder Analysis'],
    ['AV', 'Amelie von Allwörden', 'Operations & Supply Chain'],
    ['NM', 'Natasha Karen Madsen', 'Product Design & User Experience'],
  ];

  return (
    <div className="pt-20">
      <div className="px-12 py-16 border-b border-[#2E2A20]">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">Who we are</p>
        <h1 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-6xl font-light max-w-2xl leading-tight">
          Built by people who couldn't find <span className="text-[#C9A96E]">the clothes they wanted.</span>
        </h1>
      </div>

      <section className="px-12 py-20 border-b border-[#2E2A20] grid md:grid-cols-2 gap-16">
        <div>
          <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-8">The numbers</p>
          {[
            ['73%', 'of consumers want to buy more sustainably but find it too difficult'],
            ['3×', 'faster second-hand market growth vs fast fashion projected next decade'],
            ['0', 'fast fashion retailers in our results. Ever.'],
            ['Free', 'verification for independent brands under 2M DKK — because small shouldn\'t mean disadvantaged'],
          ].map(([num, label]) => (
            <div key={num} className="py-5 border-t border-[#2E2A20]">
              <p className="font-['Cormorant_Garamond'] italic text-[#C9A96E] text-5xl font-light mb-1">{num}</p>
              <p className="text-[#7A7060] text-sm">{label}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-8">Our position</p>
          <p className="text-[#7A7060] text-sm leading-relaxed mb-5">Sustainable fashion is not a niche. It is what fashion should be. The reason it is not the default is not because people don't care — it's because the systems around it are broken. Greenwashing is legal. Second-hand has become expensive. Genuinely responsible small brands are invisible next to fast fashion marketing budgets.</p>
          <p className="text-[#7A7060] text-sm leading-relaxed mb-5">BeyondTheLabel does not preach. It does not guilt people into different choices. It makes the better choice easier to find, easier to trust, and easier to afford.</p>
          <p className="text-[#7A7060] text-sm leading-relaxed">The platform is designed for the full lifecycle of a garment — not just the purchase moment. Because fashion that lasts, is worn, and eventually passed on is not a compromise. It is what clothing should be.</p>
        </div>
      </section>

      <section className="px-12 py-20" id="team">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-10">The team</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#2E2A20] border border-[#2E2A20]">
          {team.map(([initials, name, role]) => (
            <div key={name} className="bg-[#18160F] p-6">
              <div className="w-10 h-10 border border-[#2E2A20] flex items-center justify-center font-['Cormorant_Garamond'] italic text-[#C9A96E] mb-4">
                {initials}
              </div>
              <p className="text-[#F0EBE1] text-sm mb-1">{name}</p>
              <p className="text-[#7A7060] text-xs">{role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ForBrands.jsx
export function ForBrands() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ brand_name: '', contact_email: '', website_url: '', annual_revenue_band: '', sustainability_statement: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/brands/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch { setSubmitted(true); }
  };

  return (
    <div className="pt-20">
      <div className="px-12 py-16 border-b border-[#2E2A20] grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">For independent sustainable brands</p>
          <h1 className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-5xl font-light mb-6 leading-tight">
            Get discovered by people who <span className="text-[#C9A96E]">actually care.</span>
          </h1>
          <p className="text-[#7A7060] text-sm leading-relaxed mb-8">BeyondTheLabel puts verified independent sustainable brands in front of style-conscious consumers who are actively searching for what you make. No competing with fast fashion ad budgets. No self-reported sustainability claims.</p>
        </div>
        <div className="border border-[#2E2A20] bg-[#211E16] p-8">
          <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-5">Why BeyondTheLabel</p>
          {['Your products appear alongside second-hand results — capturing users at different price points.', 'Verified badge builds trust with consumers who\'ve been burned by greenwashing before.', 'No advertising. You appear because you qualify — not because you outspend someone.', 'Visual matching surfaces your products to users whose aesthetic is genuinely aligned with what you make.'].map((p, i) => (
            <div key={i} className="flex gap-3 mb-4 last:mb-0">
              <span className="text-[#C9A96E] flex-shrink-0">—</span>
              <p className="text-[#7A7060] text-sm">{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tiers */}
      <section className="px-12 py-20 border-b border-[#2E2A20]" id="free">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-10">Verification & pricing</p>
        <div className="grid md:grid-cols-3 gap-px bg-[#2E2A20] border border-[#2E2A20]">
          {[
            { price: 'Free', name: 'Small brand programme', desc: 'For brands under 2M DKK annual revenue. Full verification, verified badge, directory listing, visual matching — at no cost. You shouldn\'t be penalised for being small.', highlight: true },
            { price: '4,800 kr / yr', name: 'Standard partner', desc: 'Full verification + priority placement in search + performance dashboard + annual re-verification included.' },
            { price: '12,000 kr / yr', name: 'Premier', desc: 'Everything in Standard + featured brand profile + editorial placements + consumer insight reports + dedicated account contact.' },
          ].map(({ price, name, desc, highlight }) => (
            <div key={name} className={`p-8 ${highlight ? 'bg-[#211E16] border border-[#5C6B45]/40' : 'bg-[#18160F]'}`}>
              <p className="font-['Cormorant_Garamond'] italic text-4xl font-light mb-2" style={{ color: highlight ? '#8AAA68' : '#C9A96E' }}>{price}</p>
              <p className="text-[10px] tracking-[0.12em] uppercase text-[#7A7060] mb-4">{name}</p>
              <div className="w-full h-px bg-[#2E2A20] mb-4" />
              <p className="text-[#7A7060] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Criteria */}
      <section className="px-12 py-20 border-b border-[#2E2A20]" id="criteria">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-3">Verification criteria</p>
        <p className="text-[#7A7060] text-sm max-w-2xl mb-10">Our criteria are public, consistent, and applied equally. There is no "close enough". Brands that don't qualify are told why, and can reapply when they meet the criteria.</p>
        <div className="grid md:grid-cols-2 gap-px bg-[#2E2A20] border border-[#2E2A20]">
          {[
            ['Material transparency', 'Full fibre composition of all products disclosed, with origin of primary materials evidenced.'],
            ['No primary synthetics', 'Products must not be primarily composed of virgin polyester, nylon, or acrylic. Recycled synthetics considered with documentation.'],
            ['Supply chain visibility', 'Brands must be able to name their manufacturers and demonstrate at minimum Tier 1 supply chain knowledge.'],
            ['Certifications (where claimed)', 'Any certification cited (GOTS, OEKO-TEX, B Corp etc.) must be current and verifiable.'],
            ['No active greenwashing', 'Brands making sustainability claims that cannot be evidenced are not eligible.'],
            ['Annual re-verification', 'Verification is not permanent. Brands are re-assessed annually and can lose verified status if standards drop.'],
          ].map(([title, desc]) => (
            <div key={title} className="bg-[#18160F] p-6">
              <p className="text-[#F0EBE1] text-sm mb-2">{title}</p>
              <p className="text-[#7A7060] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application form */}
      <section className="px-12 py-20">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[#7A7060] mb-10">Apply for verification</p>
        {submitted ? (
          <div className="border border-[#2E2A20] p-10 max-w-xl text-center">
            <p className="font-['Cormorant_Garamond'] italic text-[#F0EBE1] text-3xl mb-3">Application received</p>
            <p className="text-[#7A7060] text-sm">We'll review your submission and be in touch within 5 working days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5 max-w-2xl">
            {[
              { name: 'brand_name', label: 'Brand name', required: true },
              { name: 'contact_email', label: 'Contact email', type: 'email', required: true },
              { name: 'website_url', label: 'Website', type: 'url' },
            ].map(({ name, label, type = 'text', required }) => (
              <div key={name} className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.14em] uppercase text-[#7A7060]">{label}</label>
                <input
                  type={type}
                  required={required}
                  value={form[name]}
                  onChange={(e) => setForm(f => ({ ...f, [name]: e.target.value }))}
                  className="bg-[#211E16] border border-[#2E2A20] text-[#F0EBE1] text-sm px-4 py-3 outline-none focus:border-[#7A7060]"
                />
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.14em] uppercase text-[#7A7060]">Annual revenue</label>
              <select
                value={form.annual_revenue_band}
                onChange={(e) => setForm(f => ({ ...f, annual_revenue_band: e.target.value }))}
                className="bg-[#211E16] border border-[#2E2A20] text-[#F0EBE1] text-sm px-4 py-3 outline-none"
              >
                <option value="">Select</option>
                <option value="under_2m">Under 2M DKK (free tier)</option>
                <option value="2m_10m">2M – 10M DKK</option>
                <option value="10m_50m">10M – 50M DKK</option>
                <option value="over_50m">Over 50M DKK</option>
              </select>
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.14em] uppercase text-[#7A7060]">Tell us about your sustainability practices</label>
              <textarea
                required
                rows={4}
                value={form.sustainability_statement}
                onChange={(e) => setForm(f => ({ ...f, sustainability_statement: e.target.value }))}
                className="bg-[#211E16] border border-[#2E2A20] text-[#F0EBE1] text-sm px-4 py-3 outline-none focus:border-[#7A7060] resize-y"
              />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="px-8 py-3.5 bg-[#C9A96E] text-[#18160F] text-[11px] tracking-[0.14em] uppercase hover:bg-[#F0EBE1] transition-colors">
                Submit application
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
