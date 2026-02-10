
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PropertyCard from './components/PropertyCard';
import AgentAuth from './components/AgentAuth';
import AgentDashboard from './components/AgentDashboard';
import { Property, Agent, BlogPost } from './types';
import { initialProperties, initialBlogPosts } from './store/mockData';

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80",
    title: "Building Value.",
    subtitle: "Creating Communities."
  },
  {
    url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80",
    title: "Luxury Living.",
    subtitle: "In the heart of Freetown."
  },
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
    title: "Modern Design.",
    subtitle: "Sierra Leone's finest."
  },
  {
    url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1920&q=80",
    title: "Beachfront Bliss.",
    subtitle: "Aberdeen & Lumley favorites."
  }
];

const HeroSlideshow: React.FC<{ onExplore: () => void; onAgentPortal: () => void }> = ({ onExplore, onAgentPortal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-blue-950">
      {/* Slides */}
      {HERO_IMAGES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.url}
            className="absolute inset-0 w-full h-full object-cover brightness-[0.35] scale-105"
            alt={slide.title}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl animate-in fade-in zoom-in-95 duration-700">
        <span className="inline-block px-4 py-2 bg-yellow-600/20 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-yellow-500/30">
          Trusted Expertise in Sierra Leone
        </span>
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
          {HERO_IMAGES[currentIndex].title} <span className="text-yellow-500 italic block md:inline">{HERO_IMAGES[currentIndex].subtitle}</span>
        </h1>
        <p className="text-xl text-blue-50 mb-10 max-w-3xl mx-auto font-light leading-relaxed opacity-90">
          A trusted real estate firm committed to delivering reliable property solutions with integrity, professionalism, and excellence.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button 
            onClick={onExplore}
            className="px-10 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-yellow-900/20 active:scale-95 text-lg w-full md:w-auto"
          >
            Discover Properties
          </button>
          <button 
            onClick={onAgentPortal}
            className="px-10 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 font-bold rounded-xl transition-all active:scale-95 text-lg w-full md:w-auto"
          >
            Agent Portal
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-10 z-20 flex items-center justify-center space-x-4">
        <button 
          onClick={prevSlide}
          className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white hover:bg-yellow-600 hover:border-yellow-600 transition-all"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        <div className="flex space-x-2">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-yellow-500 w-8' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white hover:bg-yellow-600 hover:border-yellow-600 transition-all"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'agent' | 'listings' | 'about' | 'blog' | 'favorites'>('listings');
  const [agent, setAgent] = useState<Agent | null>(null);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Sale' | 'Rent'>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minBeds, setMinBeds] = useState<string>('0');
  const [minBaths, setMinBaths] = useState<string>('0');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const savedAgent = localStorage.getItem('estate_agent');
    if (savedAgent) setAgent(JSON.parse(savedAgent));
    
    const savedFavorites = localStorage.getItem('estate_favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

    const savedProps = localStorage.getItem('estate_properties');
    if (savedProps) {
        // Merge saved props with initial ones to ensure consistency, filtering out duplicates by ID
        const saved = JSON.parse(savedProps) as Property[];
        const merged = [...saved];
        initialProperties.forEach(p => {
            if (!merged.find(m => m.id === p.id)) merged.push(p);
        });
        setProperties(merged);
    }
  }, []);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id];
      localStorage.setItem('estate_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const handleLogin = (newAgent: Agent) => {
    setAgent(newAgent);
    localStorage.setItem('estate_agent', JSON.stringify(newAgent));
    setCurrentPage('agent');
  };

  const handleLogout = () => {
    setAgent(null);
    localStorage.removeItem('estate_agent');
    setCurrentPage('home');
  };

  const handleAddProperty = (prop: Property) => {
    const updated = [prop, ...properties];
    setProperties(updated);
    localStorage.setItem('estate_properties', JSON.stringify(updated));
    setCurrentPage('listings');
  };

  const handleUpdateProperty = (updatedProp: Property) => {
    const updated = properties.map(p => p.id === updatedProp.id ? updatedProp : p);
    setProperties(updated);
    localStorage.setItem('estate_properties', JSON.stringify(updated));
  };

  const handleArchiveProperty = (id: string) => {
    const updated = properties.filter(p => p.id !== id);
    setProperties(updated);
    localStorage.setItem('estate_properties', JSON.stringify(updated));
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || p.type === filterType;
    const matchesMinPrice = minPrice === '' || p.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || p.price <= Number(maxPrice);
    const matchesBeds = p.beds >= Number(minBeds);
    const matchesBaths = p.baths >= Number(minBaths);
    return matchesSearch && matchesType && matchesMinPrice && matchesMaxPrice && matchesBeds && matchesBaths;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setMinPrice('');
    setMaxPrice('');
    setMinBeds('0');
    setMinBaths('0');
  };

  const navigateToPost = (post: BlogPost) => {
    setSelectedBlogPost(post);
  };

  const resetBlogView = () => {
    setSelectedBlogPost(null);
    setCurrentPage('blog');
  };

  const handlePageChange = (page: 'home' | 'agent' | 'listings' | 'about' | 'blog' | 'favorites') => {
    setSelectedBlogPost(null);
    setCurrentPage(page);
  };

  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <Layout 
      onNavigate={handlePageChange} 
      currentPage={currentPage} 
      agent={agent} 
      onLogout={handleLogout}
    >
      {currentPage === 'home' && (
        <div className="animate-in fade-in duration-700">
          <HeroSlideshow 
            onExplore={() => setCurrentPage('listings')} 
            onAgentPortal={() => setCurrentPage('agent')} 
          />
          <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-extrabold text-blue-950">Who We Are</h2>
                <div className="w-20 h-1 bg-yellow-600"></div>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Calabash Real Estate Company is built on a strong foundation of trust, market expertise, and customer satisfaction. With deep knowledge of local and regional property markets, we bridge the gap between opportunity and ownership.
                </p>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Our team combines industry insight with personalized service to ensure every transaction is transparent, efficient, and rewarding.
                </p>
                <button 
                  onClick={() => setCurrentPage('about')}
                  className="mt-4 text-blue-900 font-bold hover:text-yellow-600 flex items-center transition-colors"
                >
                  Learn more about our history <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&w=800&q=80" className="rounded-3xl shadow-2xl border border-blue-50" alt="Modern Architecture" />
              </div>
            </div>
          </section>
        </div>
      )}

      {currentPage === 'about' && (
        <div className="animate-in fade-in duration-700 pb-20">
          <section className="bg-blue-900 py-24 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-5xl font-extrabold mb-6">About <span className="text-yellow-500">Calabash</span></h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto opacity-80">Sierra Leone's leading firm for Building Value and Securing Futures.</p>
            </div>
          </section>
          <section className="py-24 max-w-6xl mx-auto px-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
               <div className="text-slate-600 leading-relaxed space-y-4">
                 <p>Calabash Real Estate Company was founded on the principles of integrity and professional excellence. We recognized a need for a modern, transparent real estate firm in Sierra Leone.</p>
                 <p>We bridge the gap between local opportunity and ownership, ensuring every client makes a confident, informed decision.</p>
               </div>
               <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" className="rounded-3xl shadow-xl" alt="Office space" />
             </div>
          </section>
        </div>
      )}

      {currentPage === 'blog' && (
        <div className="animate-in fade-in duration-700 pb-20 min-h-[60vh]">
          {selectedBlogPost ? (
            <div className="animate-in slide-in-from-bottom-8 duration-500">
              <section className="relative h-[400px]">
                <img src={selectedBlogPost.image} className="w-full h-full object-cover brightness-50" alt={selectedBlogPost.title} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="max-w-4xl px-4 text-center">
                    <span className="px-3 py-1 bg-yellow-600 text-white text-[10px] font-bold uppercase rounded-full tracking-wider mb-4 inline-block">
                      {selectedBlogPost.category}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white">{selectedBlogPost.title}</h1>
                  </div>
                </div>
              </section>
              <div className="max-w-3xl mx-auto px-4 py-16">
                <button 
                  onClick={resetBlogView}
                  className="mb-10 text-blue-900 font-bold flex items-center hover:text-yellow-600 transition-colors"
                >
                  <i className="fas fa-arrow-left mr-2"></i> Back to Blog
                </button>
                <div className="flex items-center text-slate-400 text-sm mb-10 border-b border-slate-100 pb-6">
                  <div className="flex items-center mr-6">
                    <i className="fas fa-user-circle mr-2 text-blue-900"></i> {selectedBlogPost.author}
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt mr-2 text-yellow-600"></i> {selectedBlogPost.date}
                  </div>
                </div>
                <div className="prose prose-lg prose-blue-950 max-w-none text-slate-700 leading-relaxed italic">
                  {/* Since content is simple text in mock data, we just render it. In real app, could be markdown or rich text */}
                  {selectedBlogPost.content}
                </div>
                <div className="mt-16 p-10 bg-blue-950 rounded-[3rem] text-white">
                  <h3 className="text-2xl font-bold mb-4">Interested in more insights?</h3>
                  <p className="text-blue-100/70 mb-8">Sign up for our newsletter to receive the latest market trends and property tips directly in your inbox.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input type="email" placeholder="Your email address" className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-yellow-500" />
                    <button className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl transition-all">Subscribe</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <section className="bg-blue-50/50 py-24 border-b border-blue-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h1 className="text-5xl font-extrabold text-blue-950 mb-6">Calabash <span className="text-yellow-600">Blog</span></h1>
                  <p className="text-xl text-slate-500 max-w-2xl mx-auto">Insights, trends, and expert advice for the Sierra Leonean real estate market.</p>
                </div>
              </section>
              <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {initialBlogPosts.map(post => (
                    <div key={post.id} className="group bg-white rounded-3xl border border-blue-50 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col">
                      <div className="h-56 overflow-hidden relative shrink-0">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-blue-900 text-yellow-500 text-[10px] font-bold uppercase rounded-full tracking-wider border border-blue-800">{post.category}</span>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                          <i className="fas fa-calendar-alt mr-1.5 text-yellow-600"></i> {post.date}
                        </div>
                        <h2 className="text-xl font-bold text-blue-950 mb-4 group-hover:text-yellow-600 transition-colors leading-tight">{post.title}</h2>
                        <p className="text-slate-500 text-sm mb-6 line-clamp-3">{post.excerpt}</p>
                        <div className="mt-auto">
                          <button 
                            onClick={() => navigateToPost(post)}
                            className="text-blue-900 font-bold flex items-center hover:text-yellow-600 transition-all"
                          >
                            Read Article <i className="fas fa-chevron-right ml-2 text-xs"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      )}

      {currentPage === 'listings' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-blue-950 tracking-tight">Browse <span className="text-yellow-600">Listings</span></h1>
            <p className="text-slate-500 mt-4 text-xl">Find your next chapter in Sierra Leone among our curated properties.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-blue-50 shadow-sm flex flex-col gap-6 mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-center w-full">
              <div className="relative flex-1 w-full">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-blue-200"></i>
                <input 
                  type="text" 
                  placeholder="Search location, title..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-blue-50 bg-blue-50/20 focus:bg-white focus:ring-2 focus:ring-yellow-500 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2 w-full md:w-auto overflow-x-auto">
                {['All', 'Sale', 'Rent'].map((type) => (
                  <button 
                    key={type}
                    onClick={() => setFilterType(type as any)}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${
                      filterType === type 
                      ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-100' 
                      : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                    }`}
                  >
                    {type === 'All' ? 'All Listings' : `For ${type}`}
                  </button>
                ))}
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center space-x-2 ${
                    showFilters ? 'bg-blue-950 text-white' : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <i className="fas fa-filter"></i>
                  <span>Filters</span>
                </button>
              </div>
            </div>
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-blue-50/30 rounded-2xl border border-blue-50 animate-in zoom-in-95 duration-200">
                <div>
                  <label className="block text-xs font-bold text-blue-900/60 uppercase mb-2 tracking-wider">Min Price</label>
                  <input type="number" placeholder="Any" className="w-full px-4 py-2 rounded-xl border border-blue-100 outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-sm" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-900/60 uppercase mb-2 tracking-wider">Max Price</label>
                  <input type="number" placeholder="Any" className="w-full px-4 py-2 rounded-xl border border-blue-100 outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-sm" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-900/60 uppercase mb-2 tracking-wider">Min Bedrooms</label>
                  <select className="w-full px-4 py-2 rounded-xl border border-blue-100 outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-sm" value={minBeds} onChange={(e) => setMinBeds(e.target.value)}>
                    <option value="0">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-900/60 uppercase mb-2 tracking-wider">Min Bathrooms</label>
                  <select className="w-full px-4 py-2 rounded-xl border border-blue-100 outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-sm" value={minBaths} onChange={(e) => setMinBaths(e.target.value)}>
                    <option value="0">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option>
                  </select>
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <button onClick={resetFilters} className="text-yellow-600 text-xs font-bold hover:underline">Clear All Filters</button>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProperties.length > 0 ? (
              filteredProperties.map(prop => (
                <PropertyCard 
                  key={prop.id} 
                  property={prop} 
                  isSaved={favorites.includes(prop.id)}
                  onToggleSave={handleToggleFavorite}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-search-minus text-3xl text-blue-200"></i>
                </div>
                <h3 className="text-2xl font-bold text-blue-950">No properties found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters.</p>
                <button onClick={resetFilters} className="mt-6 text-yellow-600 font-bold hover:underline">Reset filters</button>
              </div>
            )}
          </div>
        </div>
      )}

      {currentPage === 'favorites' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-top-4 duration-500 min-h-[60vh]">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-blue-950 tracking-tight">Your <span className="text-yellow-600">Favorites</span></h1>
            <p className="text-slate-500 mt-4 text-xl">The properties you've kept an eye on.</p>
          </div>
          
          {favoriteProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {favoriteProperties.map(prop => (
                <PropertyCard 
                  key={prop.id} 
                  property={prop} 
                  isSaved={true}
                  onToggleSave={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="far fa-heart text-3xl text-blue-200"></i>
              </div>
              <h3 className="text-2xl font-bold text-blue-950">No favorites yet</h3>
              <p className="text-slate-500 mt-2">Start exploring our listings and click the heart icon on properties you love.</p>
              <button 
                onClick={() => setCurrentPage('listings')}
                className="mt-8 px-8 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-950 transition-all shadow-lg active:scale-95"
              >
                Browse Properties
              </button>
            </div>
          )}
        </div>
      )}

      {currentPage === 'agent' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          {!agent ? (
            <AgentAuth onLogin={handleLogin} />
          ) : (
            <AgentDashboard 
              agent={agent} 
              onAddProperty={handleAddProperty} 
              onUpdateProperty={handleUpdateProperty}
              onArchiveProperty={handleArchiveProperty}
              agentProperties={properties.filter(p => p.agentId === agent.id)}
            />
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;
