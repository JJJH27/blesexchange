import React from 'react';
import { Translation } from '../types';
import { Send } from 'lucide-react';

interface ContactFooterProps {
  tContact: Translation['contact'];
  tFooter: Translation['footer'];
}

const ContactFooter: React.FC<ContactFooterProps> = ({ tContact, tFooter }) => {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contact Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">{tContact.title}</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">{tContact.subtitle}</p>
          
          <div className="flex justify-center gap-6">
            <a 
              href="https://t.me/BlessingLightning/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              <Send size={28} className="-ml-1" /> {/* Telegram usually looks better slightly offset */}
            </a>
            <a 
              href="https://x.com/Blessingbles05" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-16 h-16 bg-black border border-gray-700 rounded-full flex items-center justify-center text-white hover:border-white hover:scale-110 transition-all duration-300 shadow-lg"
            >
              {/* X Logo SVG */}
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>{tFooter.copyright}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <span className="hover:text-white cursor-pointer">Privacy Policy</span>
             <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;