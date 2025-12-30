
import { Product, Review } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'blazer-estruturado-navy',
    name: 'Blazer Estruturado Navy Royal',
    category: 'Blazers',
    price: 1290,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Um ícone da alfaiataria Mendonça Dreams, com corte milimetricamente ajustado.',
    details: 'Ombros estruturados, forro em cetim italiano e botões banhados em ouro rosé.',
    composition: '80% Lã fria, 20% Seda.',
    sizes: ['36', '38', '40', '42', '44'],
    colors: [{ name: 'Navy', hex: '#002147' }, { name: 'Preto', hex: '#000000' }]
  },
  {
    id: '2',
    slug: 'calca-pantalona-crepe',
    name: 'Calça Pantalona em Crepe',
    category: 'Calças',
    price: 850,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1509556756506-307620d7f139?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Fluidez e sofisticação para transitar do escritório ao jantar de gala.',
    details: 'Cintura alta, bolsos invisíveis e vinco frontal permanente.',
    composition: '100% Crepe de Seda.',
    sizes: ['PP', 'P', 'M', 'G'],
    colors: [{ name: 'Off-White', hex: '#F5F5F5' }, { name: 'Navy', hex: '#002147' }]
  },
  {
    id: '3',
    slug: 'camisa-seda-pura',
    name: 'Camisa de Seda Pura Branca',
    category: 'Camisaria',
    price: 720,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c717658?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'A base luxuosa de qualquer guarda-roupa social.',
    details: 'Punhos duplos, vista oculta e toque aveludado.',
    composition: '100% Seda Mulberry.',
    sizes: ['36', '38', '40', '42'],
    colors: [{ name: 'Branco', hex: '#FFFFFF' }]
  },
  {
    id: '4',
    slug: 'vestido-midi-tubinho',
    name: 'Vestido Midi Tubinho Social',
    category: 'Vestidos',
    price: 1540,
    images: [
      'https://images.unsplash.com/photo-1539109132314-d4a8c77ee2f8?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Design atemporal que valoriza a silhueta com elegância discreta.',
    details: 'Comprimento midi, fenda discreta posterior e fechamento em zíper invisível.',
    composition: '95% Lã, 5% Elastano.',
    sizes: ['38', '40', '42'],
    colors: [{ name: 'Marinho', hex: '#002147' }]
  }
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', userName: 'Alessandra M.', rating: 5, comment: 'O corte do blazer é simplesmente impecável. Vale cada centavo.', date: '11/12/2025' },
  { id: 'r2', userName: 'Beatriz S.', rating: 4, comment: 'Tecido de altíssima qualidade, precisei apenas de um pequeno ajuste na barra.', date: '11/12/2025' }
];

export const CATEGORIES: string[] = ['Todos', 'Blazers', 'Calças', 'Camisaria', 'Vestidos', 'Acessórios'];
