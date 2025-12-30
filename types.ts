
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  details: string;
  composition: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferences?: UserPreferences;
}

export interface UserPreferences {
  newsletter: boolean;
  smsNotifications: boolean;
  stylePreference: 'Classic' | 'Modern' | 'Avant-garde' | 'Minimalist';
  language: 'pt-BR' | 'en';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
