export interface Product {
  id: string;
  category: string;
  title: string;
  description: string | null;
  price: number;
  thumbnail: string | null;
  images: string[] | null;
  brand?: string;
  sizes?: string[];
  color?: string;
  featured?: boolean;
  created_at: string;
  updated_at: string;
}

export const products: Product[] = [
  // Men's Shoes
  {
    id: 'm1',
    category: 'mens',
    title: "Premium Leather Oxford Shoes",
    description: 'Handcrafted genuine leather oxford shoes with premium finish. Perfect for formal occasions and business wear.',
    price: 4999,
    thumbnail: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1613987876442-82aac58a19c5?w=800&h=800&fit=crop',
    ],
    brand: 'Royal Footwear',
    sizes: ['7', '8', '9', '10', '11'],
    color: 'Black',
    featured: true,
    created_at: '2025-10-01T10:00:00Z',
    updated_at: '2025-10-01T10:00:00Z',
  },
  {
    id: 'm2',
    category: 'casual',
    title: "Classic White Leather Sneakers",
    description: 'Timeless white leather sneakers with cushioned insole for all-day comfort.',
    price: 3499,
    thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop',
    ],
    brand: 'Urban Step',
    sizes: ['7', '8', '9', '10', '11', '12'],
    color: 'White',
    created_at: '2025-10-02T10:00:00Z',
    updated_at: '2025-10-02T10:00:00Z',
  },
  {
    id: 'm3',
    category: 'sports',
    title: "Professional Running Shoes",
    description: 'Lightweight running shoes with advanced cushioning technology for peak performance.',
    price: 5999,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    ],
    brand: 'SportX',
    sizes: ['6', '7', '8', '9', '10', '11'],
    color: 'Red/Black',
    featured: true,
    created_at: '2025-10-03T10:00:00Z',
    updated_at: '2025-10-03T10:00:00Z',
  },
  {
    id: 'm4',
    category: 'formal',
    title: "Executive Slip-On Loafers",
    description: 'Elegant slip-on loafers perfect for office wear and formal events.',
    price: 4299,
    thumbnail: 'https://images.unsplash.com/photo-1582897085656-c636d4141bcc?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1582897085656-c636d4141bcc?w=800&h=800&fit=crop',
    ],
    brand: 'Executive',
    sizes: ['7', '8', '9', '10', '11'],
    color: 'Brown',
    created_at: '2025-10-04T10:00:00Z',
    updated_at: '2025-10-04T10:00:00Z',
  },

  // Women's Shoes
  {
    id: 'w1',
    category: 'womens',
    title: "Elegant Stiletto Heels",
    description: 'Classic stiletto heels with comfortable padded insole. Perfect for parties and formal events.',
    price: 2999,
    thumbnail: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop',
    ],
    brand: 'Feminine Step',
    sizes: ['4', '5', '6', '7', '8'],
    color: 'Nude',
    featured: true,
    created_at: '2025-10-05T10:00:00Z',
    updated_at: '2025-10-05T10:00:00Z',
  },
  {
    id: 'w2',
    category: 'casual',
    title: "Comfortable Ballet Flats",
    description: 'Soft ballet flats with elastic band for easy fit. Lightweight and comfortable for daily wear.',
    price: 1999,
    thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
    ],
    brand: 'Comfy Feet',
    sizes: ['4', '5', '6', '7', '8'],
    color: 'Pink',
    created_at: '2025-10-06T10:00:00Z',
    updated_at: '2025-10-06T10:00:00Z',
  },
  {
    id: 'w3',
    category: 'sports',
    title: "Women Training Sneakers",
    description: 'Versatile training sneakers with excellent grip and support for gym and workouts.',
    price: 3799,
    thumbnail: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',
    ],
    brand: 'FitLife',
    sizes: ['4', '5', '6', '7', '8'],
    color: 'Purple',
    created_at: '2025-10-07T10:00:00Z',
    updated_at: '2025-10-07T10:00:00Z',
  },
  {
    id: 'w4',
    category: 'formal',
    title: "Classic Pumps Heels",
    description: 'Timeless pumps with block heel for stability and style. Perfect for office wear.',
    price: 2499,
    thumbnail: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467634?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518049362265-d5b2a6467634?w=800&h=800&fit=crop',
    ],
    brand: 'Elegance',
    sizes: ['4', '5', '6', '7', '8'],
    color: 'Black',
    created_at: '2025-10-08T10:00:00Z',
    updated_at: '2025-10-08T10:00:00Z',
  },

  // Kids Shoes
  {
    id: 'k1',
    category: 'kids',
    title: "Kids Light-Up Sneakers",
    description: 'Fun LED light-up sneakers with comfortable fit. Durable for active kids.',
    price: 1499,
    thumbnail: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&h=800&fit=crop',
    ],
    brand: 'Kids Joy',
    sizes: ['1', '2', '3', '4', '5'],
    color: 'Blue',
    created_at: '2025-10-09T10:00:00Z',
    updated_at: '2025-10-09T10:00:00Z',
  },
  {
    id: 'k2',
    category: 'kids',
    title: "School Canvas Shoes",
    description: 'Breathable canvas shoes perfect for school. Easy to clean and maintain.',
    price: 899,
    thumbnail: 'https://images.unsplash.com/photo-1596870230751-ebdfce989e97?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1596870230751-ebdfce989e97?w=800&h=800&fit=crop',
    ],
    brand: 'School Pro',
    sizes: ['1', '2', '3', '4'],
    color: 'White',
    created_at: '2025-10-10T10:00:00Z',
    updated_at: '2025-10-10T10:00:00Z',
  },

  // Sports Shoes
  {
    id: 's1',
    category: 'sports',
    title: "Pro Basketball Shoes",
    description: 'High-top basketball shoes with ankle support and superior grip.',
    price: 6999,
    thumbnail: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop',
    ],
    brand: 'Court King',
    sizes: ['7', '8', '9', '10', '11', '12'],
    color: 'White/Orange',
    created_at: '2025-10-11T10:00:00Z',
    updated_at: '2025-10-11T10:00:00Z',
  },
  {
    id: 's2',
    category: 'sports',
    title: "Trail Hiking Boots",
    description: 'Durable hiking boots with waterproof membrane and rugged outsole.',
    price: 5499,
    thumbnail: 'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=800&h=800&fit=crop',
    ],
    brand: 'TrekMaster',
    sizes: ['6', '7', '8', '9', '10', '11'],
    color: 'Brown',
    created_at: '2025-10-12T10:00:00Z',
    updated_at: '2025-10-12T10:00:00Z',
  },

  // More Men's
  {
    id: 'm5',
    category: 'mens',
    title: "Chelsea Boots",
    description: 'Classic chelsea boots in premium leather. Perfect for winter and formal occasions.',
    price: 5799,
    thumbnail: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&h=800&fit=crop',
    ],
    brand: 'Heritage',
    sizes: ['7', '8', '9', '10', '11'],
    color: 'Dark Brown',
    created_at: '2025-10-13T10:00:00Z',
    updated_at: '2025-10-13T10:00:00Z',
  },
  {
    id: 'm6',
    category: 'casual',
    title: "Canvas Slip-On Shoes",
    description: 'Lightweight canvas slip-ons for casual everyday wear.',
    price: 1299,
    thumbnail: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop',
    ],
    brand: 'EasyWear',
    sizes: ['7', '8', '9', '10', '11'],
    color: 'Navy Blue',
    created_at: '2025-10-14T10:00:00Z',
    updated_at: '2025-10-14T10:00:00Z',
  },

  // More Women's
  {
    id: 'w5',
    category: 'womens',
    title: "Ankle Boots",
    description: 'Trendy ankle boots with block heel. Perfect for pairing with dresses or jeans.',
    price: 3999,
    thumbnail: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop',
    ],
    brand: 'Style Hub',
    sizes: ['4', '5', '6', '7', '8'],
    color: 'Black',
    created_at: '2025-10-15T10:00:00Z',
    updated_at: '2025-10-15T10:00:00Z',
  },
  {
    id: 'w6',
    category: 'casual',
    title: "Platform Sandals",
    description: 'Trendy platform sandals with comfortable strap design.',
    price: 1799,
    thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
    ],
    brand: 'Summer Vibes',
    sizes: ['4', '5', '6', '7', '8'],
    color: 'Tan',
    created_at: '2025-10-16T10:00:00Z',
    updated_at: '2025-10-16T10:00:00Z',
  },
];
