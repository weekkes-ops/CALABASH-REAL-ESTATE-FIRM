import React, { useState, useRef } from 'react';
import { Agent, Property, BlogPost } from '../types';
import { generatePropertyDescription } from '../services/geminiService';
import { AgentAnalytics } from './AgentAnalytics';

interface AgentDashboardProps {
  agent: Agent;
  onAddProperty: (property: Property) => void;
  onUpdateProperty: (property: Property) => void;
  onArchiveProperty: (id: string) => void;
  agentProperties: Property[];
  allProperties?: Property[];
  blogPosts?: BlogPost[];
  onAddBlogPost?: (post: BlogPost) => void;
  onDeleteBlogPost?: (id: string) => void;
  initialViewMode?: 'list' | 'form';
}

const AgentDashboard: React.FC<AgentDashboardProps> = ({ 
  agent, 
  onAddProperty, 
  onUpdateProperty,
  onArchiveProperty,
  agentProperties,
  allProperties = [],
  blogPosts = [],
  onAddBlogPost,
  onDeleteBlogPost,
  initialViewMode = 'list'
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'form'>(initialViewMode);
  const [activeTab, setActiveTab] = useState<'listings' | 'analytics' | 'blogs'>('listings');
  const [adminShowAll, setAdminShowAll] = useState(true);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin blog post generation state inside property form
  const [publishAsBlog, setPublishAsBlog] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Property Spotlight');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogSuccessMessage, setBlogSuccessMessage] = useState<string | null>(null);

  // Quick Blog Generator modal for any property in the list
  const [quickBlogProperty, setQuickBlogProperty] = useState<Property | null>(null);
  const [quickBlogData, setQuickBlogData] = useState({
    title: '',
    category: 'Property Spotlight',
    excerpt: '',
    content: ''
  });
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    currency: 'USD' as 'USD' | 'SLE',
    type: 'Sale' as 'Sale' | 'Rent',
    beds: '1',
    baths: '1',
    sqft: '',
    location: '',
    description: '',
    features: '',
    image: ''
  });

  const propertiesToDisplay = agent.isAdmin 
    ? (adminShowAll ? allProperties : agentProperties) 
    : agentProperties;

  const handleAIHelp = async () => {
    if (!formData.title || !formData.location) {
      alert("Please fill in Title and Location first for AI to generate context.");
      return;
    }
    
    setIsGenerating(true);
    const featuresArr = formData.features.split(',').map(f => f.trim()).filter(f => f);
    
    const description = await generatePropertyDescription({
      title: formData.title,
      price: Number(formData.price),
      beds: Number(formData.beds),
      baths: Number(formData.baths),
      location: formData.location + ', Sierra Leone',
      features: featuresArr
    });
    
    setFormData(prev => ({ ...prev, description: description || '' }));
    setIsGenerating(false);
  };

  // Helper to construct a blog post draft from form parameters
  const generateBlogDraftFromParameters = () => {
    const loc = formData.location || 'Sierra Leone';
    const titleVal = formData.title || 'Prime Real Estate Opportunity';
    const priceFormatted = `${formData.currency === 'SLE' ? 'Le ' : '$'}${Number(formData.price || 0).toLocaleString()}`;
    const featuresText = formData.features || 'prime location, secure environment, modern finishing';

    const draftTitle = `Spotlight: ${titleVal} in ${loc}`;
    const draftExcerpt = `An exclusive market feature on this ${formData.beds}-bed ${formData.baths}-bath ${formData.type.toLowerCase()} property in ${loc}, offered at ${priceFormatted}.`;
    
    const draftContent = `
Calabash Real Estate is proud to spotlight an outstanding property opportunity located in the vibrant setting of ${loc}. 

### Property Overview
- **Title**: ${titleVal}
- **Transaction Type**: For ${formData.type}
- **Asking Price**: ${priceFormatted}
- **Configuration**: ${formData.beds} Bedroom(s) | ${formData.baths} Bathroom(s)
${formData.sqft ? `- **Floor Space**: Approximately ${formData.sqft} sq ft` : ''}
- **Key Features**: ${featuresText}

### Location & Lifestyle
Nestled in ${loc}, this property offers residents access to top Sierra Leonean neighborhood amenities, accessible transport routes, and dependable infrastructure. Whether you are looking for an executive residence or an astute long-term property investment, this listing represents top-tier value in the current market.

### Description
${formData.description || 'This property stands out for its thoughtful layout, quality craftsmanship, and reliable living comforts.'}

### About Calabash Real Estate Firm
To arrange an exclusive private viewing or request full documentation, contact our advisory team or visit our headquarters at 9 Bawick Street Freetown, Sierra Leone.
    `.trim();

    setBlogTitle(draftTitle);
    setBlogExcerpt(draftExcerpt);
    setBlogContent(draftContent);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartCreate = () => {
    setEditingPropertyId(null);
    setFormData({
      title: '',
      price: '',
      currency: 'USD',
      type: 'Sale',
      beds: '1',
      baths: '1',
      sqft: '',
      location: '',
      description: '',
      features: '',
      image: ''
    });
    setPublishAsBlog(false);
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    setViewMode('form');
  };

  const handleStartEdit = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setFormData({
      title: prop.title,
      price: prop.price.toString(),
      currency: prop.currency || 'USD',
      type: prop.type,
      beds: prop.beds.toString(),
      baths: prop.baths.toString(),
      sqft: prop.sqft ? prop.sqft.toString() : '',
      location: prop.location,
      description: prop.description,
      features: prop.features ? prop.features.join(', ') : '',
      image: prop.image
    });
    setPublishAsBlog(false);
    setViewMode('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const imgToUse = formData.image || `https://picsum.photos/seed/${formData.title}/800/600`;
    const featuresArr = formData.features.split(',').map(f => f.trim()).filter(f => f);

    const propertyData: Property = {
      id: editingPropertyId || Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      currency: formData.currency,
      type: formData.type,
      beds: Number(formData.beds),
      baths: Number(formData.baths),
      sqft: Number(formData.sqft || 0),
      location: formData.location,
      image: imgToUse,
      agentId: agent.id,
      createdAt: editingPropertyId 
        ? agentProperties.find(p => p.id === editingPropertyId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      features: featuresArr
    };

    if (editingPropertyId) {
      onUpdateProperty(propertyData);
    } else {
      onAddProperty(propertyData);
    }

    // If Admin opted to create a Blog Post based on form parameters
    if (agent.isAdmin && publishAsBlog && onAddBlogPost) {
      const formattedDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const newBlogPost: BlogPost = {
        id: 'post-' + Math.random().toString(36).substr(2, 8),
        title: blogTitle.trim() || `Spotlight: ${propertyData.title} in ${propertyData.location}`,
        category: blogCategory,
        author: agent.name || 'Calabash Admin',
        date: formattedDate,
        image: imgToUse,
        excerpt: blogExcerpt.trim() || `Exclusive feature on ${propertyData.title} in ${propertyData.location}. Listed at ${propertyData.currency === 'SLE' ? 'Le ' : '$'}${propertyData.price.toLocaleString()}.`,
        content: blogContent.trim() || propertyData.description
      };

      onAddBlogPost(newBlogPost);
      setBlogSuccessMessage(`Listing saved and Blog Post "${newBlogPost.title}" successfully published to the Calabash Blog!`);
      setTimeout(() => setBlogSuccessMessage(null), 5000);
    }

    setViewMode('list');
    setEditingPropertyId(null);
  };

  const handleOpenQuickBlogModal = (prop: Property) => {
    setQuickBlogProperty(prop);
    const priceFormatted = `${prop.currency === 'SLE' ? 'Le ' : '$'}${prop.price.toLocaleString()}`;
    const draftTitle = `Spotlight: ${prop.title} in ${prop.location}`;
    const draftExcerpt = `Featured look at this stunning ${prop.beds}-bed ${prop.baths}-bath ${prop.type.toLowerCase()} opportunity in ${prop.location}.`;
    const draftContent = `
Calabash Real Estate is excited to feature this prime property in ${prop.location}.

### Listing Highlights
- **Title**: ${prop.title}
- **Price**: ${priceFormatted} (${prop.type})
- **Accommodations**: ${prop.beds} Beds | ${prop.baths} Baths
${prop.sqft ? `- **Area**: ${prop.sqft} sq ft` : ''}
- **Key Features**: ${prop.features?.join(', ') || 'Modern living spaces, secure neighborhood'}

### Property Details
${prop.description}

### Inquiries & Visits
For private viewings and verified property documents, visit Calabash Real Estate Firm at 9 Bawick Street Freetown, Sierra Leone or contact our office.
    `.trim();

    setQuickBlogData({
      title: draftTitle,
      category: 'Property Spotlight',
      excerpt: draftExcerpt,
      content: draftContent
    });
  };

  const handlePublishQuickBlog = () => {
    if (!quickBlogProperty || !onAddBlogPost) return;

    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newPost: BlogPost = {
      id: 'post-' + Math.random().toString(36).substr(2, 8),
      title: quickBlogData.title.trim() || `Spotlight: ${quickBlogProperty.title}`,
      category: quickBlogData.category,
      author: agent.name || 'Calabash Admin',
      date: formattedDate,
      image: quickBlogProperty.image,
      excerpt: quickBlogData.excerpt.trim() || quickBlogProperty.description.slice(0, 120) + '...',
      content: quickBlogData.content.trim() || quickBlogProperty.description
    };

    onAddBlogPost(newPost);
    setQuickBlogProperty(null);
    setBlogSuccessMessage(`Blog Post "${newPost.title}" published successfully!`);
    setTimeout(() => setBlogSuccessMessage(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Blog Success Alert */}
      {blogSuccessMessage && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center space-x-3">
            <i className="fas fa-check-circle text-emerald-600 text-xl"></i>
            <span className="text-sm font-bold">{blogSuccessMessage}</span>
          </div>
          <button onClick={() => setBlogSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Quick Blog Modal for Admin */}
      {quickBlogProperty && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-blue-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-blue-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="bg-blue-900 text-white p-6 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <i className="fas fa-newspaper text-yellow-400 text-xl"></i>
                <div>
                  <h3 className="font-bold text-lg">Create Blog Post from Property</h3>
                  <p className="text-blue-200 text-xs">Publish a featured market article for: {quickBlogProperty.title}</p>
                </div>
              </div>
              <button onClick={() => setQuickBlogProperty(null)} className="text-white/70 hover:text-white">
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blog Post Title</label>
                <input 
                  type="text"
                  value={quickBlogData.title}
                  onChange={(e) => setQuickBlogData({ ...quickBlogData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select 
                    value={quickBlogData.category}
                    onChange={(e) => setQuickBlogData({ ...quickBlogData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm bg-white"
                  >
                    <option>Property Spotlight</option>
                    <option>Market Insight</option>
                    <option>Luxury Showcase</option>
                    <option>Investment Guide</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Author</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={agent.name} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Article Excerpt</label>
                <textarea 
                  rows={2}
                  value={quickBlogData.excerpt}
                  onChange={(e) => setQuickBlogData({ ...quickBlogData, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Article Content</label>
                <textarea 
                  rows={7}
                  value={quickBlogData.content}
                  onChange={(e) => setQuickBlogData({ ...quickBlogData, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm font-mono text-xs leading-relaxed"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3 shrink-0">
              <button 
                onClick={() => setQuickBlogProperty(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handlePublishQuickBlog}
                className="px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center space-x-2 active:scale-95"
              >
                <i className="fas fa-paper-plane"></i>
                <span>Publish to Blog</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-3xl font-extrabold text-blue-950">
              {agent.isAdmin ? 'System Management Portal' : 'Member Property Dashboard'}
            </h1>
            {agent.isAdmin ? (
              <span className="bg-yellow-500 text-blue-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm flex items-center space-x-1">
                <i className="fas fa-shield-alt text-xs"></i>
                <span>Administrator</span>
              </span>
            ) : (
              <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Authorized User
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm">
            {agent.isAdmin 
              ? 'Full administrator privileges: manage system properties, publish blog posts from listing parameters, and review analytics.' 
              : 'Manage your property listings and client leads in Sierra Leone.'}
          </p>
        </div>

        {viewMode === 'list' && (
          <button 
            onClick={handleStartCreate}
            className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-yellow-900/10 hover:bg-yellow-700 transition-all active:scale-95 text-sm"
          >
            <i className="fas fa-plus-circle mr-2"></i> List a Property
          </button>
        )}
      </div>

      {/* Admin Tabs */}
      {viewMode === 'list' && agent.isAdmin && (
        <div className="flex space-x-2 border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'listings'
                ? 'border-yellow-600 text-blue-950'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <i className="fas fa-building"></i>
            <span>System Listings ({allProperties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'blogs'
                ? 'border-yellow-600 text-blue-950'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <i className="fas fa-newspaper"></i>
            <span>Blog Posts ({blogPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'analytics'
                ? 'border-yellow-600 text-blue-950'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <i className="fas fa-chart-line"></i>
            <span>Market Analytics</span>
          </button>
        </div>
      )}

      {/* Metrics Row */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm border-l-4 border-l-blue-900">
            <div className="text-blue-900 font-black text-4xl mb-1">
              {agent.isAdmin ? allProperties.length : agentProperties.length}
            </div>
            <div className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
              {agent.isAdmin ? 'Total System Listings' : 'My Active Listings'}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm border-l-4 border-l-yellow-600">
            <div className="text-yellow-600 font-black text-4xl mb-1">
              {agent.isAdmin ? blogPosts.length : '12'}
            </div>
            <div className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
              {agent.isAdmin ? 'Published Blog Articles' : 'Client Inquiries'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm border-l-4 border-l-blue-900">
            <div className="text-blue-900 font-black text-4xl mb-1">
              {agent.isAdmin ? 'Full' : 'Authorized'}
            </div>
            <div className="text-slate-500 font-semibold text-xs uppercase tracking-wider">
              System Access Level
            </div>
          </div>
        </div>
      )}

      {/* Form View: List / Edit a Property */}
      {viewMode === 'form' ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-blue-950">
                {editingPropertyId ? 'Edit Property Listing' : 'List a Property'}
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                {agent.isAdmin 
                  ? 'Administrator listing: enter property parameters and optionally generate a featured blog post.'
                  : 'Enter property parameters to list your property on Calabash Real Estate.'}
              </p>
            </div>
            <button 
              onClick={() => setViewMode('list')}
              className="text-slate-400 hover:text-blue-900 p-2"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Property Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Modern Villa in Hill Station"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                />
              </div>

              {/* Image Upload Section */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Property Photo</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-100 rounded-2xl p-4 text-center cursor-pointer hover:border-yellow-500 transition-all bg-blue-50/20 group"
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {formData.image ? (
                    <div className="relative group/img">
                      <img src={formData.image} className="h-48 w-full object-cover rounded-xl" alt="Preview" />
                      <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center rounded-xl transition-all">
                        <span className="text-white font-bold">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <i className="fas fa-cloud-upload-alt text-blue-200 text-3xl mb-2 group-hover:text-yellow-600"></i>
                      <p className="text-slate-400 text-sm">Click to upload property photo</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                <input 
                  required
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. Aberdeen, Freetown"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Price</label>
                  <input 
                    required
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Currency</label>
                  <select 
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value as any})}
                    className="w-full px-2 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all bg-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="SLE">SLE (Le)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Listing Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all bg-white"
                >
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Beds</label>
                  <input type="number" value={formData.beds} onChange={(e) => setFormData({...formData, beds: e.target.value})} className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Baths</label>
                  <input type="number" value={formData.baths} onChange={(e) => setFormData({...formData, baths: e.target.value})} className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sq Ft</label>
                  <input type="number" value={formData.sqft} onChange={(e) => setFormData({...formData, sqft: e.target.value})} className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Key Features (comma separated)</label>
              <input 
                type="text" 
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                placeholder="e.g. Ocean View, Backup Generator, 24/7 Security"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-slate-700">Property Description</label>
                <button 
                  type="button"
                  onClick={handleAIHelp}
                  disabled={isGenerating}
                  className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center border border-blue-100"
                >
                  {isGenerating ? (
                    <><i className="fas fa-circle-notch fa-spin mr-2"></i> Generating...</>
                  ) : (
                    <><i className="fas fa-magic mr-2 text-yellow-600"></i> Write with Gemini AI</>
                  )}
                </button>
              </div>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the property in detail. Mention Sierra Leonean comforts..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              ></textarea>
            </div>

            {/* ADMIN ONLY: Blog Post generation based on listing parameters */}
            {agent.isAdmin && (
              <div className="p-6 bg-gradient-to-br from-amber-50 to-blue-50/50 rounded-2xl border border-amber-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-700 flex items-center justify-center font-bold">
                      <i className="fas fa-feather-alt"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-950 text-sm">Admin: Publish Blog Post from this Listing</h3>
                      <p className="text-xs text-slate-500">Only administrators can generate and publish blog articles.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={publishAsBlog} 
                      onChange={(e) => {
                        setPublishAsBlog(e.target.checked);
                        if (e.target.checked && !blogTitle) {
                          generateBlogDraftFromParameters();
                        }
                      }} 
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>

                {publishAsBlog && (
                  <div className="space-y-4 pt-4 border-t border-amber-200 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-900 uppercase">Blog Post Configuration</span>
                      <button
                        type="button"
                        onClick={generateBlogDraftFromParameters}
                        className="text-xs text-yellow-700 hover:text-yellow-800 font-bold underline flex items-center space-x-1"
                      >
                        <i className="fas fa-sync-alt text-[10px]"></i>
                        <span>Re-sync with Form Parameters</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Article Headline</label>
                        <input 
                          type="text"
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          placeholder="Headline for blog post..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Blog Category</label>
                        <select 
                          value={blogCategory}
                          onChange={(e) => setBlogCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm bg-white"
                        >
                          <option>Property Spotlight</option>
                          <option>Market Insight</option>
                          <option>Luxury Showcase</option>
                          <option>Investment Guide</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Article Summary / Excerpt</label>
                      <input 
                        type="text"
                        value={blogExcerpt}
                        onChange={(e) => setBlogExcerpt(e.target.value)}
                        placeholder="Short summary displayed on the blog card..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Article Body</label>
                      <textarea 
                        rows={6}
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        placeholder="Detailed article text..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none text-xs font-mono bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4 space-x-4">
              <button 
                type="button"
                onClick={() => setViewMode('list')}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-yellow-900/10 transition-all active:scale-95 text-sm flex items-center space-x-2"
              >
                <i className="fas fa-check"></i>
                <span>{editingPropertyId ? 'Update Listing' : 'Publish Property Listing'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List Mode: Listings / Blogs / Analytics */
        <div className="space-y-8">
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-blue-950">
                    {agent.isAdmin 
                      ? (adminShowAll ? 'All Registered Properties' : 'My Personal Listings') 
                      : 'My Listed Properties'}
                  </h2>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {propertiesToDisplay.length} Total
                  </span>
                </div>

                {agent.isAdmin && (
                  <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setAdminShowAll(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        adminShowAll ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      All System Properties ({allProperties.length})
                    </button>
                    <button
                      onClick={() => setAdminShowAll(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        !adminShowAll ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      My Own ({agentProperties.length})
                    </button>
                  </div>
                )}
              </div>

              {propertiesToDisplay.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {propertiesToDisplay.map(prop => (
                    <div key={prop.id} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <img src={prop.image} className="w-full sm:w-28 h-28 rounded-xl object-cover shrink-0" alt={prop.title} />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-blue-950 text-base">{prop.title}</h3>
                            <span className="text-yellow-600 font-extrabold text-sm shrink-0 ml-2">
                              {prop.currency === 'SLE' ? 'Le' : '$'}{prop.price.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center">
                            <i className="fas fa-map-marker-alt text-yellow-600 mr-1.5"></i>
                            <span>{prop.location}</span>
                            <span className="mx-2">•</span>
                            <span>{prop.beds} Beds, {prop.baths} Baths</span>
                          </p>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{prop.description}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                          {/* Admin: Quick Create Blog Post from this Property */}
                          {agent.isAdmin && (
                            <button 
                              onClick={() => handleOpenQuickBlogModal(prop)}
                              className="text-xs font-bold text-yellow-800 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded-lg transition-colors flex items-center border border-yellow-200"
                              title="Generate and publish a blog article for this property"
                            >
                              <i className="fas fa-feather-alt mr-1.5 text-yellow-600"></i>
                              <span>Publish to Blog</span>
                            </button>
                          )}

                          <button 
                            onClick={() => handleStartEdit(prop)}
                            className="text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors flex items-center"
                          >
                            <i className="fas fa-edit mr-1"></i> Edit
                          </button>

                          <button 
                            onClick={() => onArchiveProperty(prop.id)}
                            className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors flex items-center ml-auto"
                          >
                            <i className="fas fa-trash-alt mr-1"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
                  <i className="fas fa-home text-slate-300 text-5xl mb-4"></i>
                  <h3 className="text-slate-700 font-bold text-lg">No properties to display</h3>
                  <p className="text-slate-400 text-sm mt-1">Click "List a Property" to add a new property listing.</p>
                </div>
              )}
            </div>
          )}

          {/* Admin Blog Management Tab */}
          {activeTab === 'blogs' && agent.isAdmin && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-blue-950">Published Blog Articles</h2>
                  <p className="text-xs text-slate-500">Only administrators have access to blog publishing and management.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map(post => (
                  <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="h-40 overflow-hidden relative">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-blue-900 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
                        <h3 className="font-bold text-blue-950 text-sm mt-1 mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-3">{post.excerpt}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[11px] font-medium text-slate-500">By {post.author}</span>
                      {onDeleteBlogPost && (
                        <button
                          onClick={() => onDeleteBlogPost(post.id)}
                          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1"
                        >
                          <i className="fas fa-trash-alt"></i>
                          <span>Delete Post</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && agent.isAdmin && (
            <AgentAnalytics 
              agentProperties={allProperties} 
              onSelectPropertyForEdit={handleStartEdit} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
