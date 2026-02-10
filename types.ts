
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'USD' | 'SLE';
  type: 'Rent' | 'Sale';
  beds: number;
  baths: number;
  sqft: number;
  location: string;
  image: string; // Cover image
  images?: string[]; // Gallery images
  agentId: string;
  createdAt: string;
  features: string[];
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  agency: string;
  authorized: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export interface UserState {
  agent: Agent | null;
  properties: Property[];
}
