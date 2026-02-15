import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TokenSection from './components/TokenSection';
import UtilitySection from './components/UtilitySection';
import GamesSection from './components/GamesSection';
import ExchangeSection from './components/ExchangeSection';
import Features from './components/Features';
import Dapps from './components/Dapps';
import CommerceSection from './components/CommerceSection';
import ContactFooter from './components/ContactFooter';
import { translations } from './constants';
import { Language } from './types';

type Page = 'home' | 'token' | 'utility' | 'games' | 'exchange';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('es');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const t = translations[lang];

  return (
    <div className="relative min-h-screen text-white selection:bg-blue-500 selection:text-white">
      
      {/* Fixed Background with Overlay */}
      <div className="fixed inset-0 -z-10">
         <div 
           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: `url('./fondominer.jpg')` }}
         ></div>
         {/* Dark overlay to ensure text readability - Opacity reduced to 60% for better background clarity */}
         <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[1px]"></div>
         {/* Gradient overlay for depth */}
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/40 to-gray-900"></div>
      </div>

      <Navbar 
        lang={lang} 
        setLang={setLang} 
        t={t.nav} 
        onNavigate={setCurrentPage} 
      />
      
      <main>
        {currentPage === 'home' ? (
          <>
            <Hero t={t.hero} />
            <Features t={t.features} />
            <Dapps tStaking={t.staking} tPrediction={t.prediction} />
            <CommerceSection t={t.commerce} />
          </>
        ) : currentPage === 'utility' ? (
          <UtilitySection t={t.utilitySection} />
        ) : currentPage === 'games' ? (
          <GamesSection t={t.gamesSection} />
        ) : currentPage === 'exchange' ? (
          <ExchangeSection t={t.exchangeSection} />
        ) : (
          <TokenSection t={t.tokenSection} />
        )}
      </main>

      <ContactFooter tContact={t.contact} tFooter={t.footer} />
    </div>
  );
};

export default App;