
import { Property, BlogPost } from '../types';

export const initialProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Hill Station Villa',
    description: 'A luxurious 5-bedroom villa located in the serene Hill Station area of Freetown. Offers breathtaking views of the city and the Atlantic coastline, featuring high ceilings and modern Sierra Leonean architecture.',
    price: 350000,
    currency: 'USD',
    type: 'Sale',
    beds: 5,
    baths: 4,
    sqft: 4500,
    location: 'Hill Station, Freetown',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687940-47a04b629733?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    agentId: 'system',
    createdAt: new Date().toISOString(),
    features: ['Ocean View', 'Backup Generator', '24/7 Security', 'Swimming Pool', 'Large Veranda']
  },
  {
    id: '2',
    title: 'Aberdeen Beachfront Apartment',
    description: 'Stunning 3-bedroom apartment right on the Aberdeen strip. Perfect for expatriates or professionals looking for proximity to the beach and Freetown\'s best restaurants.',
    price: 2500,
    currency: 'USD',
    type: 'Rent',
    beds: 3,
    baths: 2,
    sqft: 1800,
    location: 'Aberdeen, Freetown',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
    ],
    agentId: 'system',
    createdAt: new Date().toISOString(),
    features: ['Beachfront Access', 'Underground Parking', 'Air Conditioning', 'Modern Kitchen', 'Elevator']
  },
  {
    id: '3',
    title: 'Spacious Family Home in Lumley',
    description: 'A beautiful and secure family home in the heart of Lumley. Features a large compound, backup generator room, and modern interior finishings suitable for large families.',
    price: 150000,
    currency: 'SLE',
    type: 'Sale',
    beds: 4,
    baths: 3,
    sqft: 3200,
    location: 'Lumley, Freetown',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80'
    ],
    agentId: 'system',
    createdAt: new Date().toISOString(),
    features: ['Gated Compound', 'Borehole Water', 'Staff Quarters', 'Solar Inverter Ready', 'Fruit Trees']
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Navigating Property Taxes in Sierra Leone',
    excerpt: 'Understanding the legal framework of land ownership and tax obligations for residential and commercial properties in Freetown.',
    content: 'Full content about Sierra Leone property taxes...',
    author: 'Calabash Legal Team',
    date: 'March 15, 2024',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    category: 'Legal Advice'
  },
  {
    id: 'blog-2',
    title: 'Why Hill Station is Freetown\'s Top Investment Spot',
    excerpt: 'Exploring the rapid development and appreciation of property values in the cool hills of Freetown.',
    content: 'Full content about Hill Station investment...',
    author: 'Market Analyst',
    date: 'March 10, 2024',
    image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=800&q=80',
    category: 'Market Trends'
  },
  {
    id: 'blog-3',
    title: 'Top 5 Questions to Ask Before Buying Land',
    excerpt: 'Crucial due diligence steps every Sierra Leonean property buyer should take to avoid land disputes.',
    content: 'Full content about land buying questions...',
    author: 'Calabash Advisory',
    date: 'March 05, 2024',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    category: 'Buyer Guide'
  }
];
