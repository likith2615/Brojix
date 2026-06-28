import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import Portfolio from './components/Portfolio';
import Trust from './components/Trust';
import Policies from './components/Policies';
import Contact from './components/Contact';
import Footer from './components/Footer';
import HeroBackground from './components/HeroBackground';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from 'sonner';

function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small timeout to ensure the DOM has rendered the new route
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}

function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <HowItWorks />
      <Portfolio />
      <Trust />
      <Policies />
      <Contact />
    </main>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname === '/admin';

  return (
    <div className="relative overflow-x-hidden min-h-screen text-white">
      <div className="ambient-bg"></div>
      <HeroBackground />
      {!isAdminPath && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {!isAdminPath && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollHandler />
      <Toaster position="top-right" theme="dark" richColors />
      <AppContent />
    </Router>
  );
}

export default App;
