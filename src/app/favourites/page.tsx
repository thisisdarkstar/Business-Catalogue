'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, ArrowRight } from 'lucide-react';
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
}

export default function FavouritesPage() {
  const { favorites } = useFavStore();
  const [favProducts, setFavProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setFavProducts([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('products')
        .select('*')
        .in('id', favorites);

      setFavProducts(data || []);
      setLoading(false);
    };

    fetchFavorites();
  }, [favorites]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Favourites</h1>
        
        {favProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No favourites yet</h2>
            <p className="text-muted-foreground mb-6">Save your favorite products to view them here</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all"
            >
              <ShoppingBag className="h-5 w-5" />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favProducts.map((product, idx) => (
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
                      <div className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground capitalize mb-1">{product.category}</p>
                      <h3 className="font-semibold mb-2 line-clamp-1">{product.title}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold gradient-text">₹{product.price.toLocaleString()}</p>
                        {product.original_price && product.original_price > product.price && (
                          <p className="text-sm text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</p>
                        )}
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
