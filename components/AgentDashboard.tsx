
import React, { useState, useRef } from 'react';
import { Agent, Property } from '../types';
import { generatePropertyDescription } from '../services/geminiService';

interface AgentDashboardProps {
  agent: Agent;
  onAddProperty: (property: Property) => void;
  onUpdateProperty: (property: Property) => void;
  onArchiveProperty: (id: string) => void;
  agentProperties: Property[];
}

const AgentDashboard: React.FC<AgentDashboardProps> = ({ 
  agent, 
  onAddProperty, 
  onUpdateProperty,
  onArchiveProperty,
  agentProperties 
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      sqft: prop.sqft.toString(),
      location: prop.location,
      description: prop.description,
      features: prop.features ? prop.features.join(', ') : '',
      image: prop.image
    });
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
      sqft: Number(formData.sqft),
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

    setViewMode('list');
    setEditingPropertyId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950">Agent Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage Sierra Leonean properties and leads.</p>
        </div>
        {viewMode === 'list' && (
          <button 
            onClick={handleStartCreate}
            className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-yellow-100 hover:bg-yellow-700 transition-all active:scale-95"
          >
            <i className="fas fa-plus mr-2"></i> Create New Listing
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm border-l-4 border-l-blue-900">
          <div className="text-blue-900 font-bold text-4xl mb-1">{agentProperties.length}</div>
          <div className="text-slate-500 font-medium text-sm">Active Listings</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm border-l-4 border-l-yellow-600">
          <div className="text-yellow-600 font-bold text-4xl mb-1">12</div>
          <div className="text-slate-500 font-medium text-sm">Leads This Month</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm border-l-4 border-l-blue-900">
          <div className="text-blue-900 font-bold text-4xl mb-1">4.9</div>
          <div className="text-slate-500 font-medium text-sm">Agent Rating</div>
        </div>
      </div>

      {viewMode === 'form' ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-blue-950">
              {editingPropertyId ? 'Edit Property Listing' : 'List a New Property'}
            </h2>
            <button 
              onClick={() => setViewMode('list')}
              className="text-slate-400 hover:text-blue-900"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Currency</label>
                  <select 
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value as any})}
                    className="w-full px-2 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all bg-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="SLE">SLE (Le)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Beds</label>
                <input type="number" value={formData.beds} onChange={(e) => setFormData({...formData, beds: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Baths</label>
                <input type="number" value={formData.baths} onChange={(e) => setFormData({...formData, baths: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sq Ft</label>
                <input type="number" value={formData.sqft} onChange={(e) => setFormData({...formData, sqft: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Key Features (comma separated)</label>
              <input 
                type="text" 
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                placeholder="e.g. Ocean View, Backup Generator, Gated Security"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
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
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the property in detail. Mention Sierra Leonean comforts..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4 space-x-4">
               <button 
                type="button"
                onClick={() => setViewMode('list')}
                className="px-8 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-blue-900 text-yellow-500 px-10 py-4 rounded-xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-950 transition-all transform active:scale-95 border border-blue-800"
              >
                {editingPropertyId ? 'Update Listing' : 'Publish Listing'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-blue-950">Your Active Listings</h2>
          {agentProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agentProperties.map(prop => (
                <div key={prop.id} className="bg-white border border-slate-200 p-4 rounded-2xl flex gap-4 shadow-sm hover:shadow-md transition-shadow group">
                  <img src={prop.image} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-blue-950 group-hover:text-yellow-600 transition-colors">{prop.title}</h3>
                      <span className="text-blue-900 font-bold text-sm">
                        {prop.currency === 'SLE' ? 'Le' : '$'}{prop.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{prop.description}</p>
                    <div className="flex space-x-3 mt-3">
                      <button 
                        onClick={() => handleStartEdit(prop)}
                        className="text-[10px] font-bold text-blue-900 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                      >
                        <i className="fas fa-edit mr-1"></i> Edit
                      </button>
                      <button 
                        onClick={() => onArchiveProperty(prop.id)}
                        className="text-[10px] font-bold text-red-500 uppercase tracking-wider bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                      >
                        <i className="fas fa-archive mr-1"></i> Archive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border-2 border-dashed border-blue-50 rounded-3xl">
              <div className="text-blue-100 text-5xl mb-4"><i className="fas fa-home"></i></div>
              <h3 className="text-slate-600 font-semibold text-lg">No listings yet</h3>
              <p className="text-slate-400 text-sm mt-1">Start by clicking the "Create New Listing" button.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
