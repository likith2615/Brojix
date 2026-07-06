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
import ClientDashboard from './pages/ClientDashboard';
import { Toaster } from 'sonner';
import { useDocumentMetadata } from './hooks/useDocumentMetadata';

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

function Home({ defaultSection }) {
  const metadata = {
    portfolio: {
      title: "Projects | BROJIX — AI Tools, Web Apps & Real-World Software",
      description: "Explore projects by Chippe Likith Kumar — including AI-powered travel planners, web applications, and developer tools built with modern tech stacks.",
      canonicalUrl: "https://brojix.netlify.app/projects",
    },
    contact: {
      title: "Contact | BROJIX — Collaborate with Chippe Likith Kumar",
      description: "Get in touch with Chippe Likith Kumar for collaborations, freelance projects, or just to talk tech. Developer based in Andhra Pradesh, India.",
      canonicalUrl: "https://brojix.netlify.app/contact",
    },
    default: {
      title: "BROJIX | Chippe Likith Kumar — Developer & Product Builder",
      description: "BROJIX is the portfolio of Chippe Likith Kumar — a developer building AI-powered products and real-world software. Explore projects, skills, and contact.",
      canonicalUrl: "https://brojix.netlify.app/",
    }
  };

  const currentMeta = metadata[defaultSection] || metadata.default;

  useDocumentMetadata({
    title: currentMeta.title,
    description: currentMeta.description,
    canonicalUrl: currentMeta.canonicalUrl,
    ogTitle: currentMeta.title,
    ogDescription: currentMeta.description,
    ogUrl: currentMeta.canonicalUrl,
  });

  useEffect(() => {
    if (defaultSection) {
      setTimeout(() => {
        const element = document.getElementById(defaultSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [defaultSection]);

  return (
    <main>
      {/* Exactly ONE h1 per page, keyword-rich */}
      <h1 className="sr-only">
        {defaultSection === 'portfolio' 
          ? "Projects — AI Tools & Real-World Software" 
          : defaultSection === 'contact' 
          ? "Let's Collaborate" 
          : "Chippe Likith Kumar — Developer & Product Builder"}
      </h1>
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
        <Route path="/" element={<Home defaultSection={null} />} />
        <Route path="/projects" element={<Home defaultSection="portfolio" />} />
        <Route path="/contact" element={<Home defaultSection="contact" />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
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
