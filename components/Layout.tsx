import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: 'home' | 'agent' | 'listings' | 'about' | 'blog' | 'favorites') => void;
  currentPage: string;
  agent: any | null;
  onLogout: () => void;
  onListPropertyClick: () => void;
  onOpenAuthForListing?: (isRegistering: boolean) => void;
}

export const SystemLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-44 h-44',
    xl: 'w-56 h-56'
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      <svg 
        viewBox="0 0 500 500" 
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle cx="250" cy="250" r="240" fill="#092d87" />
        
        {/* Outer Golden Ring */}
        <circle cx="250" cy="250" r="222" fill="#092d87" stroke="#fbc02d" strokeWidth="12" />
        
        {/* Inner Golden Ring */}
        <circle cx="250" cy="250" r="198" fill="none" stroke="#fbc02d" strokeWidth="7" />
        
        {/* Calabash Gourd Silhouette Outline */}
        <g stroke="#fbc02d" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Top lip rim */}
          <line x1="238" y1="94" x2="262" y2="94" strokeWidth="12" />
          {/* Symmetrical calabash contour */}
          <path d="M241 94 C241 116 244 136 240 148 C232 165 186 182 186 215 C186 248 214 258 250 258 C286 258 314 248 314 215 C314 182 268 165 260 148 C256 136 259 116 259 94" />
          {/* Horizontal waist divider line */}
          <line x1="192" y1="208" x2="308" y2="208" strokeWidth="10" />
        </g>
        
        {/* Brand Text: CALABASH */}
        <text 
          x="250" 
          y="318" 
          textAnchor="middle" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Inter', 'Arial Black', sans-serif" 
          fontWeight="900" 
          fontSize="56" 
          letterSpacing="2.5" 
          fill="#fbc02d"
        >
          CALABASH
        </text>
        
        {/* Brand Text: REAL ESTATE FIRM */}
        <text 
          x="250" 
          y="354" 
          textAnchor="middle" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif" 
          fontWeight="800" 
          fontSize="23" 
          letterSpacing="4" 
          fill="#fbc02d"
        >
          REAL ESTATE FIRM
        </text>
      </svg>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onNavigate, 
  currentPage, 
  agent, 
  onLogout,
  onListPropertyClick,
  onOpenAuthForListing
}) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);

  const handleListPropertyButtonClick = () => {
    if (agent) {
      onListPropertyClick();
    } else {
      setIsAuthPromptOpen(true);
    }
  };

  const handleProceedToAuth = (isRegistering: boolean) => {
    setIsAuthPromptOpen(false);
    if (onOpenAuthForListing) {
      onOpenAuthForListing(isRegistering);
    } else {
      onNavigate('agent');
    }
  };

  const AuthRequiredModal = () => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-blue-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-blue-100 animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-blue-900 to-blue-950 p-6 text-white text-center relative">
          <button 
            onClick={() => setIsAuthPromptOpen(false)}
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
          <div className="mx-auto mb-3 flex items-center justify-center">
            <SystemLogo size="sm" />
          </div>
          <h3 className="text-xl font-bold">Account Required</h3>
          <p className="text-blue-200 text-xs mt-1">To list a property on Calabash Real Estate, you must have an active account.</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start space-x-3 text-amber-900">
            <i className="fas fa-shield-alt text-amber-600 text-lg mt-0.5 shrink-0"></i>
            <p className="text-xs leading-relaxed">
              We require verified accounts to guarantee quality listings and protect buyers and tenants across Sierra Leone.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleProceedToAuth(true)}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-yellow-200 transition-all flex items-center justify-center space-x-2 active:scale-98"
            >
              <i className="fas fa-user-plus"></i>
              <span>Create New Account</span>
            </button>

            <button
              onClick={() => handleProceedToAuth(false)}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 border border-blue-200 active:scale-98"
            >
              <i className="fas fa-sign-in-alt"></i>
              <span>Sign In to Existing Account</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsAuthPromptOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Cancel and Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
            <SystemLogo size="sm" />
            <div>
              <h2 className="text-2xl font-bold mb-0">Get in Touch</h2>
              <p className="text-yellow-400 font-medium text-xs mt-0.5">9 Bawick Street Freetown, Sierra Leone</p>
            </div>
          </div>
        </div>
        <form className="p-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setIsContactModalOpen(false); alert('Thank you! Your inquiry has been sent to our Freetown office at 9 Bawick Street Freetown, Sierra Leone.'); }}>
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
              <option>List a Property</option>
              <option>Investment Advice</option>
              <option>Sell or Rent Property</option>
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
          <div className="pt-2 text-center">
            <a 
              href="https://www.facebook.com/people/Calabash-REAL-Estate-FIRM/61582511864635/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all border border-blue-200"
            >
              <i className="fab fa-facebook text-base text-[#1877F2]"></i>
              <span>Visit our official Facebook Page</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {isContactModalOpen && <ContactModal />}
      {isAuthPromptOpen && <AuthRequiredModal />}

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => onNavigate('home')}
            >
              <SystemLogo size="md" />
              <div className="ml-3 flex flex-col">
                <span className="text-xl font-black tracking-tight text-[#092d87] leading-none group-hover:text-yellow-600 transition-colors">CALABASH</span>
                <span className="text-[10px] font-bold text-yellow-600 tracking-widest leading-none mt-1">REAL ESTATE FIRM</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex space-x-6 items-center">
              <button 
                onClick={() => onNavigate('home')}
                className={`text-sm font-bold transition-colors ${currentPage === 'home' ? 'text-yellow-600' : 'text-slate-600 hover:text-blue-900'}`}
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('listings')}
                className={`text-sm font-bold transition-colors ${currentPage === 'listings' ? 'text-yellow-600' : 'text-slate-600 hover:text-blue-900'}`}
              >
                Properties
              </button>
              <button 
                onClick={() => onNavigate('favorites')}
                className={`text-sm font-bold transition-colors ${currentPage === 'favorites' ? 'text-yellow-600' : 'text-slate-600 hover:text-blue-900'}`}
              >
                Favorites
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className={`text-sm font-bold transition-colors ${currentPage === 'about' ? 'text-yellow-600' : 'text-slate-600 hover:text-blue-900'}`}
              >
                About Us
              </button>
              <button 
                onClick={() => onNavigate('blog')}
                className={`text-sm font-bold transition-colors ${currentPage === 'blog' ? 'text-yellow-600' : 'text-slate-600 hover:text-blue-900'}`}
              >
                Blog
              </button>
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors"
              >
                Contact
              </button>
            </div>

            {/* Action Buttons: List a Property + Account/Login */}
            <div className="flex items-center space-x-3">
              {/* List a Property Button */}
              <button
                onClick={handleListPropertyButtonClick}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all shadow-md shadow-yellow-900/10 active:scale-95 flex items-center space-x-2"
                title="List your property on Calabash Real Estate"
              >
                <i className="fas fa-plus-circle text-yellow-200"></i>
                <span>List a Property</span>
              </button>

              {agent ? (
                <div className="flex items-center space-x-3 border-l border-slate-200 pl-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-semibold text-blue-950">{agent.name}</span>
                    {agent.isAdmin ? (
                      <span className="text-[9px] text-blue-950 bg-yellow-400 px-2 py-0.5 rounded-full font-black uppercase tracking-wider shadow-xs">
                        System Admin
                      </span>
                    ) : (
                      <span className="text-[9px] text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded-full border border-yellow-200 font-bold uppercase tracking-tight">
                        {agent.agency || 'Active Member'}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => onNavigate('agent')}
                    className="p-2 bg-blue-50 text-blue-900 rounded-full hover:bg-blue-100 transition-colors"
                    title={agent.isAdmin ? 'System Management' : 'My Dashboard'}
                  >
                    <i className={`fas ${agent.isAdmin ? 'fa-user-shield text-yellow-700' : 'fa-user-circle'} text-lg`}></i>
                  </button>
                  <button 
                    onClick={onLogout}
                    className="text-xs text-slate-500 hover:text-red-600 transition-colors font-medium"
                    title="Sign Out"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => onNavigate('agent')}
                  className="bg-blue-900 text-yellow-400 px-4 py-2.5 rounded-full text-xs md:text-sm font-bold hover:bg-blue-950 transition-all shadow-sm active:scale-95 border border-blue-800 flex items-center space-x-1.5"
                >
                  <i className="fas fa-user-tie"></i>
                  <span>Account</span>
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
          <div 
            className="mb-8 transform hover:scale-105 transition-transform cursor-pointer" 
            onClick={() => onNavigate('home')}
            title="Calabash Real Estate Firm"
          >
            <SystemLogo size="lg" />
          </div>
          
          <h2 className="text-white font-black text-2xl tracking-widest mb-2 uppercase">Calabash Real Estate Firm</h2>
          <p className="text-yellow-500 font-bold text-base tracking-widest mb-6">9 Bawick Street Freetown, Sierra Leone</p>
          
          <p className="max-w-md mx-auto mb-8 text-sm leading-relaxed text-blue-100/70 italic">
            Building Value. Creating Communities. Securing Futures. A trusted real estate firm committed to delivering reliable property solutions with integrity, professionalism, and excellence in Sierra Leone.
          </p>

          <div className="mb-8">
            <button
              onClick={handleListPropertyButtonClick}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-yellow-900/30 transition-all inline-flex items-center space-x-2 active:scale-95"
            >
              <i className="fas fa-home"></i>
              <span>List Your Property with Us</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 sm:space-x-12 mb-10 text-xs font-black uppercase tracking-widest">
             <button onClick={() => onNavigate('about')} className="hover:text-yellow-500 transition-colors">About Us</button>
             <button onClick={() => onNavigate('blog')} className="hover:text-yellow-500 transition-colors">Blog</button>
             <button onClick={() => onNavigate('listings')} className="hover:text-yellow-500 transition-colors">Listings</button>
             <button onClick={() => onNavigate('favorites')} className="hover:text-yellow-500 transition-colors">Favorites</button>
             <button onClick={() => setIsContactModalOpen(true)} className="hover:text-yellow-500 transition-colors">Contact</button>
          </div>

          <div className="flex justify-center space-x-6 mb-12">
            <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-all text-white"><i className="fab fa-twitter"></i></a>
            <a 
              href="https://www.facebook.com/people/Calabash-REAL-Estate-FIRM/61582511864635/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-[#1877F2] hover:bg-blue-700 flex items-center justify-center hover:text-white transition-all text-white shadow-md"
              title="Calabash REAL Estate FIRM on Facebook"
              aria-label="Calabash Real Estate Firm on Facebook"
            >
              <i className="fab fa-facebook-f text-lg"></i>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-all text-white"><i className="fab fa-instagram"></i></a>
            <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-all text-white"><i className="fab fa-linkedin"></i></a>
          </div>

          <div className="border-t border-blue-900/50 pt-10 w-full">
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-blue-300 opacity-60">
              9 Bawick Street Freetown, Sierra Leone
            </div>
            <div className="mt-3 text-[10px] uppercase font-bold text-blue-400">
              &copy; 2026 Calabash Real Estate Firm. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
