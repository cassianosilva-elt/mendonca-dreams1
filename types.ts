
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
  videoUrl?: string;
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
  gender?: 'female' | 'male' | 'other';
  shoppingFor?: 'self' | 'gift';
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
  isAdmin?: boolean;
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

// Admin Types
export interface ProductInventory {
  id: string;
  productId: string;
  productName: string;
  colorName: string;
  size: string;
  quantity: number;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
  stripePaymentId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface ProductFormData {
  name: string;
  slug: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  details: string;
  composition: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  videoUrl?: string;
  inventory?: {
    colorName: string;
    size: string;
    quantity: number;
  }[];
}
