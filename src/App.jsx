import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import { Home, HowItWorks, About, ForBrands } from './components/pages/index.jsx';
import Search from './components/pages/Search';
import Wardrobe from './components/pages/Wardrobe';
import ProductDetail from './components/pages/ProductDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#18160F] text-[#F0EBE1] font-light">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/for-brands" element={<ForBrands />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
