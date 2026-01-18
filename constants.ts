
import { Product, Review } from './types';

export const PRODUCTS: Product[] = [];

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', userName: 'Alessandra M.', rating: 5, comment: 'O corte do blazer é simplesmente impecável. Vale cada centavo.', date: '11/12/2025' },
  { id: 'r2', userName: 'Beatriz S.', rating: 4, comment: 'Tecido de altíssima qualidade, precisei apenas de um pequeno ajuste na barra.', date: '11/12/2025' }
];

export const CATEGORIES: string[] = ['Todos', 'Blazers', 'Calças', 'Camisaria', 'Vestidos', 'Acessórios'];
