
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: 'home' | 'agent' | 'listings' | 'about' | 'blog' | 'favorites') => void;
  currentPage: string;
  agent: any | null;
  onLogout: () => void;
}

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-48 h-48'
  };

  return (
    <div className={`${dimensions[size]} rounded-full bg-[#1e3a8a] border-[3px] border-[#eab308] flex flex-col items-center justify-center text-center p-1 relative overflow-hidden shadow-inner`}>
      {/* Double Gold Ring Inner */}
      <div className="absolute inset-0.5 rounded-full border border-[#eab308] opacity-50 pointer-events-none"></div>
      
      {/* Calabash Pot Icon (SVG) */}
      <svg 
        viewBox="0 0 100 100" 
        className={`${size === 'lg' ? 'w-20' : 'w-6'} mb-0.5`}
        fill="none" 
        stroke="#eab308" 
        strokeWidth="4"
      >
        <path d="M50 15 L50 35 M40 35 L60 35 C65 35 80 45 80 65 C80 85 65 90 50 90 C35 90 20 85 20 65 C20 45 35 35 40 35" strokeLinecap="round" />
        <line x1="30" y1="62" x2="70" y2="62" strokeWidth="2" />
      </svg>
      
      {/* Brand Text */}
      <div className="flex flex-col items-center leading-none">
        <span className={`${size === 'lg' ? 'text-2xl' : 'text-[8px]'} font-black text-[#eab308] tracking-wider`}>CALABASH</span>
        <span className={`${size === 'lg' ? 'text-[10px]' : 'text-[4px]'} font-bold text-[#eab308] tracking-widest mt-0.5`}>REAL ESTATE FIRM</span>
        {size === 'lg' && (
          <div className="mt-2 flex flex-col items-center">
             <span className="text-[7px] text-[#eab308] opacity-90 font-medium">No 11 Dillet Street</span>
             <span className="text-[7px] text-[#eab308] opacity-90 font-medium uppercase tracking-widest">Freetown</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPage, agent, onLogout }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const ContactModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-blue-100 animate-in zoom-in-95 duration-300">
        <div className="bg-[#1e3a8a] p-8 text-white relative">
          <button 
            onClick={() => setIsContactModalOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
          <div className="flex items-center space-x-4">
            <Logo size="sm" />
            <div>
              <h2 className="text-2xl font-bold mb-0">Get in Touch</h2>
              <p className="text-blue-100 text-xs opacity-80">Serving Freetown with integrity since 2024.</p>
            </div>
          </div>
        </div>
        <form className="p-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setIsContactModalOpen(false); alert('Thank you! Your inquiry has been sent to our Freetown office.'); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all text-sm" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
              <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all text-sm" placeholder="john@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all text-sm bg-white">
              <option>Property Inquiry</option>
              <option>Investment Advice</option>
              <option>Sell My Property</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
            <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all text-sm resize-none" placeholder="How can we help you today?"></textarea>
          </div>
          <button type="submit" className="w-full bg-yellow-600 text-white py-4 rounded-xl font-bold hover:bg-yellow-700 transition-all shadow-lg shadow-yellow-200">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {isContactModalOpen && <ContactModal />}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => onNavigate('home')}
            >
              <Logo size="md" />
              <div className="ml-3 flex flex-col">
                <span className="text-xl font-black tracking-tight text-[#1e3a8a] leading-none group-hover:text-yellow-600 transition-colors">CALABASH</span>
                <span className="text-[10px] font-bold text-[#eab308] tracking-widest leading-none mt-1">REAL ESTATE FIRM</span>
              </div>
            </div>

            <div className="hidden md:flex space-x-6">
              <button 
                onClick={() => onNavigate('home')}
                className={`text-sm font-bold transition-colors ${currentPage === 'home' ? 'text-yellow-600' : 'text-slate-500 hover:text-blue-900'}`}
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('listings')}
                className={`text-sm font-bold transition-colors ${currentPage === 'listings' ? 'text-yellow-600' : 'text-slate-500 hover:text-blue-900'}`}
              >
                Properties
              </button>
              <button 
                onClick={() => onNavigate('favorites')}
                className={`text-sm font-bold transition-colors ${currentPage === 'favorites' ? 'text-yellow-600' : 'text-slate-500 hover:text-blue-900'}`}
              >
                Favorites
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className={`text-sm font-bold transition-colors ${currentPage === 'about' ? 'text-yellow-600' : 'text-slate-500 hover:text-blue-900'}`}
              >
                About Us
              </button>
              <button 
                onClick={() => onNavigate('blog')}
                className={`text-sm font-bold transition-colors ${currentPage === 'blog' ? 'text-yellow-600' : 'text-slate-500 hover:text-blue-900'}`}
              >
                Blog
              </button>
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="text-sm font-bold text-slate-500 hover:text-blue-900 transition-colors"
              >
                Contact
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {agent ? (
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-blue-950">{agent.name}</span>
                    <span className="text-[10px] text-yellow-600 bg-yellow-50 px-1.5 rounded-full border border-yellow-100 font-bold uppercase tracking-tighter">Authorized Agent</span>
                  </div>
                  <button 
                    onClick={() => onNavigate('agent')}
                    className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <i className="fas fa-user-tie text-blue-800"></i>
                  </button>
                  <button 
                    onClick={onLogout}
                    className="text-sm text-slate-500 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => onNavigate('agent')}
                  className="bg-blue-900 text-yellow-500 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-950 transition-all shadow-sm active:scale-95 border border-blue-800"
                >
                  Agent Portal
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-blue-950 text-blue-200/60 py-16 mt-20 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="mb-8 transform hover:scale-105 transition-transform cursor-pointer" onClick={() => onNavigate('home')}>
            <Logo size="lg" />
          </div>
          
          <h2 className="text-white font-black text-2xl tracking-widest mb-2 uppercase">Calabash Real Estate Firm</h2>
          <p className="text-yellow-500 font-bold text-sm tracking-widest mb-6">No 11 Dillet Street, Freetown</p>
          
          <p className="max-w-md mx-auto mb-10 text-sm leading-relaxed text-blue-100/70 italic">
            Building Value. Creating Communities. Securing Futures. A trusted real estate firm committed to delivering reliable property solutions with integrity, professionalism, and excellence in Sierra Leone.
          </p>

          <div className="flex justify-center space-x-12 mb-10 text-xs font-black uppercase tracking-widest">
             <button onClick={() => onNavigate('about')} className="hover:text-yellow-500 transition-colors">About Us</button>
             <button onClick={() => onNavigate('blog')} className="hover:text-yellow-500 transition-colors">Blog</button>
             <button onClick={() => onNavigate('listings')} className="hover:text-yellow-500 transition-colors">Listings</button>
             <button onClick={() => onNavigate('favorites')} className="hover:text-yellow-500 transition-colors">Favorites</button>
             <button onClick={() => setIsContactModalOpen(true)} className="hover:text-yellow-500 transition-colors">Contact</button>
          </div>

          <div className="flex justify-center space-x-6 mb-12">
            <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-all text-white"><i className="fab fa-twitter"></i></a>
            <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-all text-white"><i className="fab fa-facebook"></i></a>
            <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-all text-white"><i className="fab fa-instagram"></i></a>
            <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-all text-white"><i className="fab fa-linkedin"></i></a>
          </div>

          <div className="border-t border-blue-900/50 pt-10 w-full">
            <div className="text-[9px] uppercase tracking-[0.4em] font-bold text-blue-300 opacity-50">
              Professionalism • Transparency • Integrity
            </div>
            <div className="mt-4 text-[10px] uppercase font-bold text-blue-400">
              &copy; 2024 Calabash Real Estate Firm. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
