import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Language, Translation } from '../types';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translation['nav'];
  onNavigate: (page: 'home' | 'token' | 'utility' | 'games' | 'exchange') => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, t, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLang = () => {
    setLang(lang === 'es' ? 'en' : 'es');
  };

  const handleNavigation = (target: string) => {
    if (target === 'home') {
      onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'token') {
      onNavigate('token');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'utility') {
      onNavigate('utility');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'games') {
      onNavigate('games');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'exchange') {
      onNavigate('exchange');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // For sections on the home page if any remain
      onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setIsOpen(false);
  };

  const navLinks = [
    { name: t.home, id: 'home' },
    { name: t.token, id: 'token' },
    { name: t.utility, id: 'utility' },
    { name: t.games, id: 'games' },
    { name: t.exchange, id: 'exchange' },
  ];

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-black/40 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer" 
              onClick={() => handleNavigation('home')}
            >
              BLESSING
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavigation(link.id)}
                  className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer bg-transparent border-none"
                >
                  {link.name}
                </button>
              ))}
              <button 
                onClick={toggleLang}
                className="flex items-center gap-1 text-blue-400 border border-blue-400/30 px-3 py-1 rounded-full hover:bg-blue-400/10 transition-colors ml-4"
              >
                <Globe size={14} />
                <span className="uppercase text-xs font-bold">{lang}</span>
              </button>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.id)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-lg font-medium w-full text-left"
              >
                {link.name}
              </button>
            ))}
             <button 
                onClick={() => { toggleLang(); setIsOpen(false); }}
                className="w-full text-left flex items-center gap-2 text-blue-400 px-3 py-2 mt-2"
              >
                <Globe size={16} />
                <span className="uppercase font-bold">Cambiar a {lang === 'es' ? 'EN' : 'ES'}</span>
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;