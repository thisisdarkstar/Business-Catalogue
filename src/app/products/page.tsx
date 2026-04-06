'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, X, Star, Heart, ShoppingBag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useFavStore } from '@/stores/favorites';

interface Product {
  id: string;
  category: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  thumbnail: string | null;
  images: string[] | null;
  brand?: string;
  sizes?: string[];
  color?: string;
  featured?: boolean;
  created_at: string;
}

const categories = [
  { name: 'All', slug: '' },
  { name: "Men's", slug: 'mens' },
  { name: "Women's", slug: 'womens' },
  { name: 'Kids', slug: 'kids' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Formal', slug: 'formal' },
  { name: 'Casual', slug: 'casual' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const { favorites, toggleFavorite } = useFavStore();
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, [category, priceRange, search]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
    
    const { data } = await query;
    if (data) {
      const filtered = data.filter(p => 
        !search || 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      );
      setProducts(filtered);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Our Collection</h1>
          <p className="text-muted-foreground">Browse our premium shoe selection</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-accent transition-colors"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-4 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-secondary rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setCategory(cat.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      category === cat.slug
                        ? 'gradient-bg text-white'
                        : 'bg-secondary hover:bg-accent'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Price Range (₹)</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Min</label>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="0"
                  />
                </div>
                <span className="mt-5 text-muted-foreground">-</span>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Max</label>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="10000"
                  />
                </div>
              </div>
              <button
                onClick={() => setPriceRange([0, 10000])}
                className="mt-2 text-sm text-primary hover:underline"
              >
                Reset Price
              </button>
            </div>
          </motion.div>
        )}

        {!showFilters && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  category === cat.slug
                    ? 'gradient-bg text-white'
                    : 'bg-secondary hover:bg-accent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product, idx: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/products/${product.id}`}>
                  <div className="group bg-card rounded-2xl border border-border overflow-hidden card-hover">
                    <div className="relative aspect-square bg-secondary">
                      <img
                        src={product.thumbnail || product.images?.[0] || 'https://placehold.co/400x400'}
                        alt={product.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(product.id);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-all hover:bg-white ${favorites.includes(product.id) ? 'opacity-100' : ''}`}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground capitalize mb-1">{product.category}</p>
                      <h3 className="font-semibold mb-2 line-clamp-1">{product.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold gradient-text">₹{product.price.toLocaleString()}</p>
                          {product.original_price && product.original_price > product.price && (
                            <p className="text-sm text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>4.5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
