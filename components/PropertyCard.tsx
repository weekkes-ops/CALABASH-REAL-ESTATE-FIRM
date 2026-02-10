
import React, { useState } from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

// Conversion Rate Constant (Simulated)
const USD_TO_SLE = 22.8; 

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isSaved, onToggleSave }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const galleryImages = property.images && property.images.length > 0 
    ? property.images 
    : [property.image];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const formatPrice = (val: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: 0,
    }).format(val).replace('SLE', 'Le');
  };

  const displayPrices = () => {
    const mainPrice = property.price;
    const mainCurrency = property.currency || 'USD';
    
    let otherPrice: number;
    let otherCurrency: string;

    if (mainCurrency === 'USD') {
      otherPrice = mainPrice * USD_TO_SLE;
      otherCurrency = 'SLE';
    } else {
      otherPrice = mainPrice / USD_TO_SLE;
      otherCurrency = 'USD';
    }

    return {
      primary: formatPrice(mainPrice, mainCurrency),
      secondary: formatPrice(otherPrice, otherCurrency)
    };
  };

  const prices = displayPrices();

  const PropertyDetailsModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-100 animate-in slide-in-from-bottom-8 duration-500 no-scrollbar">
        {/* Gallery Header */}
        <div className="relative h-[450px] overflow-hidden bg-slate-900 group">
          <img 
            src={galleryImages[activeImageIndex]} 
            alt={`${property.title} - view ${activeImageIndex + 1}`}
            className="w-full h-full object-cover animate-in fade-in zoom-in-105 duration-700"
          />
          
          {/* Gallery Controls */}
          {galleryImages.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all z-20"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all z-20"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
              
              {/* Pagination Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {galleryImages.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                    className={`h-1.5 rounded-full transition-all ${idx === activeImageIndex ? 'w-8 bg-yellow-600 shadow-lg' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Top Actions */}
          <div className="absolute top-6 right-6 flex items-center space-x-3 z-30">
            {onToggleSave && (
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleSave(property.id); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isSaved ? 'bg-yellow-600 text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/40'
                }`}
              >
                <i className={`${isSaved ? 'fas' : 'far'} fa-heart`}></i>
              </button>
            )}
            <button 
              onClick={() => {
                setIsDetailsModalOpen(false);
                setActiveImageIndex(0);
              }}
              className="w-10 h-10 bg-blue-950/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-blue-950/40 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="absolute bottom-6 left-8 z-20">
            <span className="px-4 py-2 bg-yellow-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
              For {property.type}
            </span>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        </div>
        
        <div className="p-8 md:p-12">
          {/* Thumbnails row */}
          {galleryImages.length > 1 && (
            <div className="flex space-x-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    idx === activeImageIndex ? 'border-yellow-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center text-slate-400 text-sm font-medium mb-2">
                <i className="fas fa-map-marker-alt mr-2 text-yellow-600"></i>
                {property.location}
              </div>
              <h2 className="text-4xl font-extrabold text-blue-950 leading-tight">{property.title}</h2>
            </div>
            <div className="bg-blue-50 px-8 py-4 rounded-2xl border border-blue-100 text-right">
              <div className="text-3xl font-black text-blue-900">
                {prices.primary}
                {property.type === 'Rent' && <span className="text-sm font-bold text-blue-400">/mo</span>}
              </div>
              <div className="text-sm font-bold text-yellow-600">
                ≈ {prices.secondary}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-center">
              <i className="fas fa-bed text-blue-900 text-xl mb-2"></i>
              <div className="text-2xl font-bold text-blue-950">{property.beds}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Bedrooms</div>
            </div>
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-center">
              <i className="fas fa-bath text-blue-900 text-xl mb-2"></i>
              <div className="text-2xl font-bold text-blue-950">{property.baths}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Bathrooms</div>
            </div>
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-center">
              <i className="fas fa-ruler-combined text-blue-900 text-xl mb-2"></i>
              <div className="text-2xl font-bold text-blue-950">{property.sqft}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Square Ft</div>
            </div>
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-center">
              <i className="fas fa-calendar-alt text-yellow-600 text-xl mb-2"></i>
              <div className="text-xl font-bold text-blue-950">Listed</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">In Freetown</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-bold text-blue-950 mb-4 border-b pb-4">Description</h3>
                <p className="text-slate-600 leading-relaxed text-lg italic whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>

              {property.features && property.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-blue-950 mb-4 border-b pb-4">Key Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {property.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <i className="fas fa-check-circle text-yellow-600"></i>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-950 mb-4 border-b pb-4">Contact Agent</h3>
              <div className="bg-blue-900 rounded-3xl p-6 text-white text-center border border-blue-800 shadow-xl">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
                  <i className="fas fa-user-tie text-2xl text-yellow-500"></i>
                </div>
                <h4 className="font-bold text-lg">Calabash Elite Agent</h4>
                <p className="text-blue-100 text-sm mb-6 italic opacity-80">Sierra Leone's Trusted Expert.</p>
                <button 
                  onClick={() => { setIsDetailsModalOpen(false); alert('Directing you to agent contact...'); }}
                  className="w-full py-3 bg-yellow-600 text-white font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-xl active:scale-95"
                >
                  Request Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isDetailsModalOpen && <PropertyDetailsModal />}
      <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setIsDetailsModalOpen(true)}>
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              property.type === 'Sale' ? 'bg-blue-900 text-yellow-500 border border-blue-800' : 'bg-emerald-600 text-white'
            }`}>
              For {property.type}
            </span>
          </div>
          {onToggleSave && (
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleSave(property.id); }}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 shadow-lg ${
                isSaved ? 'bg-yellow-600 text-white' : 'bg-white/80 backdrop-blur-md text-blue-900 hover:bg-white'
              }`}
            >
              <i className={`${isSaved ? 'fas' : 'far'} fa-heart`}></i>
            </button>
          )}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start gap-1">
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50">
              <span className="text-xl font-bold text-blue-900">
                {prices.primary}{property.type === 'Rent' ? '/mo' : ''}
              </span>
            </div>
            <div className="bg-yellow-600/90 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-[10px] font-bold">
              ≈ {prices.secondary}
            </div>
          </div>
          
          {/* Quick view indicator */}
          <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-white text-blue-900 px-4 py-2 rounded-full text-sm font-bold shadow-xl">
              <i className="fas fa-expand-alt mr-2"></i> View Details
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center text-slate-500 text-xs font-medium mb-2">
            <i className="fas fa-map-marker-alt mr-1.5 text-yellow-600"></i>
            {property.location}
          </div>
          <h3 className="text-xl font-bold text-blue-950 mb-3 group-hover:text-yellow-600 transition-colors">
            {property.title}
          </h3>
          
          <div className="flex justify-between items-center py-4 border-t border-slate-100 mt-4">
            <div className="flex items-center space-x-4 text-slate-600 text-sm">
              <div className="flex items-center">
                <i className="fas fa-bed mr-1.5 text-blue-900/50"></i>
                <span className="font-semibold">{property.beds}</span>
              </div>
              <div className="flex items-center border-l border-slate-200 pl-4">
                <i className="fas fa-bath mr-1.5 text-blue-900/50"></i>
                <span className="font-semibold">{property.baths}</span>
              </div>
              <div className="flex items-center border-l border-slate-200 pl-4">
                <i className="fas fa-ruler-combined mr-1.5 text-blue-900/50"></i>
                <span className="font-semibold">{property.sqft}</span> <span className="text-[10px] ml-1 uppercase">SqFt</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsDetailsModalOpen(true)}
            className="w-full mt-2 py-3 bg-blue-50 text-blue-900 font-bold rounded-xl hover:bg-yellow-600 hover:text-white transition-all duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </>
  );
};

export default PropertyCard;
