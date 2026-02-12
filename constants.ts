
import { Product, Review } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '94916f5d-b763-4cf8-b281-ca83c6b4143a',
    slug: 'calca-social-alfaiataria',
    name: 'Calça social Alfaiataria',
    category: 'Calças',
    price: 69.99,
    images: [
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/bw8tle33p6a-1768690695875.jpeg',
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/d2pn9ulo7h-1768690725732.jpeg'
    ],
    description: 'Eleve o seu estilo com a nossa Calça Pantalona em Alfaiataria. Com um corte impecável e design atemporal, esta peça foi desenhada para oferecer o equilíbrio perfeito entre elegância e conforto.',
    details: 'A modelagem de cintura alta valoriza a silhueta, enquanto as pregas frontais adicionam um toque de sofisticação e movimento ao caminhar. O tecido estruturado garante um caimento perfeito, sem marcar, tornando-a a escolha ideal tanto para compor looks de trabalho quanto para produções noturnas mais elaboradas. Possui passantes para cinto, permitindo ainda mais versatilidade no ajuste e no estilo.',
    composition: '95% Poliéster, 5% Elastano.',
    sizes: ['P', 'M', 'G'],
    colors: [{ name: 'Preta', hex: '#000000' }, { name: 'Azul Marinho', hex: '#232561' }, { name: 'Marrom', hex: '#ad7b25' }]
  },
  {
    id: 'e3101700-2c33-4719-956c-16c949aef499',
    slug: 'camisa-social-oversized-boxy',
    name: 'Camisa Social Oversized Boxy',
    category: 'Camisaria',
    price: 34.99,
    images: [
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/tb6n3lppc09-1768691086467.png',
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/jgqd7s9hlrp-1768691193980.png',
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/qroscljdv7r-1768691220238.jpg',
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/ejw392lv4da-1768691228878.jpeg'
    ],
    description: 'A Camisa Oversized é a peça-chave para quem busca um visual moderno e descomplicado. Selecionada por sua modelagem generosa e caimento impecável, esta peça une o conforto do algodão de alta qualidade à sofisticação do estilo "minimal chique".',
    details: 'Toque suave e frescor garantidos pelas fibras naturais. Costuras reforçadas e gola com estrutura preservada. Corte "boyfriend style" adaptado para o público feminino.',
    composition: '',
    sizes: ['UNICO'],
    colors: [{ name: 'Branca', hex: '#ffffff' }, { name: 'Azul', hex: '#161499' }, { name: 'Preta', hex: '#000000' }]
  },
  {
    id: 'e548c672-cbd4-4b22-9ee2-5638b00ab25f',
    slug: 'colete-alfaiataria',
    name: 'Colete Alfaiataria',
    category: 'Blazers',
    price: 64.99,
    images: [
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/q5l54pej13a-1768692174495.jpeg',
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/7b38attbgf-1768692200988.jpg',
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/mjbck00pl2l-1768692237850.jpeg',
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/2lu09d3qsi5-1768692252483.jpeg'
    ],
    description: 'A peça que faltava para transformar o seu look. Este colete de alfaiataria traz a elegância da costura clássica com um toque de modernidade. Com modelagem acinturada e decote em V, ele valoriza o colo e alonga a silhueta.',
    details: 'Modelagem: Alfaiataria estruturada com pontas frontais (bico) que afinam a cintura. Fechamento: 3 botões centrais forrados no próprio tecido. Decote: Em "V". Bolsos: Possui dois bolsos frontais decorativos (estilo welt pocket) que mantêm a limpeza visual da peça sem criar volume. Forro: Sim, peça forrada para melhor acabamento e conforto.',
    composition: 'Tecido Principal: 96% Poliéster, 4% Elastano (Crepe Alfaiataria). Forro: 100% Poliéster.',
    sizes: ['P', 'G'],
    colors: [{ name: 'Preto', hex: '#000000' }, { name: 'Bege', hex: '#d9bb68' }]
  },
  {
    id: 'f0430c18-1ef8-425e-a4d1-3220087d8a2f',
    slug: 'short-alfaiataria',
    name: 'Short Alfaiataria',
    category: 'Calças',
    price: 64.99,
    images: [
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/1h8guma02qfh-1768691566179.jpeg',
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/h575f9t5shg-1768691584136.jpeg',
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/yym123cax1-1768691617429.jpeg',
      'https://wavuppjtbvckhdjyxoyh.supabase.co/storage/v1/object/public/products/products/1agz19mj463-1768691632605.jpeg'
    ],
    description: 'A união perfeita entre frescor e sofisticação. Nossa Bermuda em Alfaiataria foi desenhada para a mulher moderna que busca elegância mesmo nos dias de temperatura elevada. Com cintura alta e modelagem soltinha nas pernas, ela oferece conforto absoluto sem perder a postura de uma peça social. As pregas frontais garantem um caimento estruturado e moderno, ideal para compor looks com blazers, camisas de linho ou regatas de seda. Uma peça curinga que transita do escritório ao passeio de fim de semana com facilidade.',
    details: 'Modelagem: Corte reto com leve abertura evasê (pernas soltas), que não aperta a coxa. Cintura: Alta, desenhada para valorizar a silhueta. Fechamento: Frontal com zíper e colchete/botão interno (acabamento clean, botão aparente dourado). Funcionalidade: Possui bolsos laterais estilo faca (funcionais) e passantes para cinto. Acabamento: Pregas frontais estratégicas que alongam o visual e disfarçam o quadril.',
    composition: 'Composição: 96% Poliéster, 4% Elastano. Toque: Tecido encorpado, com toque macio e que não amassa com facilidade.',
    sizes: ['P', 'M', 'G'],
    colors: [{ name: 'Preta', hex: '#000000' }, { name: 'Bege', hex: '#c6a576' }, { name: 'Verde Musgo', hex: '#5a9671' }]
  },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', userName: 'Alessandra M.', rating: 5, comment: 'O corte do blazer é simplesmente impecável. Vale cada centavo.', date: '11/12/2025' },
  { id: 'r2', userName: 'Beatriz S.', rating: 4, comment: 'Tecido de altíssima qualidade, precisei apenas de um pequeno ajuste na barra.', date: '11/12/2025' }
];

export const CATEGORIES: string[] = ['Todos', 'Blazers', 'Calças', 'Camisaria', 'Vestidos', 'Acessórios'];
