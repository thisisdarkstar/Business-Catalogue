'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

interface Product {
  id: string;
  category: string;
  title: string;
  description: string | null;
  price: number;
  thumbnail: string | null;
  images: string[] | null;
  featured?: boolean;
}

const categories = [
  { name: "Men's", slug: 'mens', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop' },
  { name: "Women's", slug: 'womens', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop' },
  { name: 'Kids', slug: 'kids', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=500&fit=crop' },
  { name: 'Sports', slug: 'sports', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=500&fit=crop' },
  { name: 'Formal', slug: 'formal', image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=500&fit=crop' },
  { name: 'Casual', slug: 'casual', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=500&fit=crop' },
];

export default function Hero() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(5);
    
    if (data && data.length > 0) {
      setProducts(data);
    } else {
      const { data: fallback } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (fallback) setProducts(fallback);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [products.length]);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-foreground/10 rounded-full blur-3xl animate-float stagger-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-secondary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Premium Footwear Collection</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Step Into <br />
              <span className="gradient-text">Style</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg">
              Discover our curated collection of premium shoes for every occasion. 
              Comfort meets style in every step.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25 group"
              >
                Shop Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-secondary text-foreground font-semibold hover:bg-accent transition-all"
              >
                <ShoppingBag className="h-5 w-5" />
                Browse Collection
              </Link>
            </div>

            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold gradient-text">200+</p>
                <p className="text-sm text-muted-foreground">Styles</p>
              </div>
              <div>
                <p className="text-3xl font-bold gradient-text">4.9</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
              <div>
                <p className="text-3xl font-bold gradient-text">50k+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-secondary/50 to-accent">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : products.length > 0 ? (
                <>
                  <img
                    src={products[currentSlide].thumbnail || products[currentSlide].images?.[0]}
                    alt={products[currentSlide].title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white/80 text-sm mb-1 capitalize">{products[currentSlide].category}</p>
                    <h3 className="text-white text-2xl font-bold mb-2">{products[currentSlide].title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-white text-xl font-semibold">₹{products[currentSlide].price.toLocaleString()}</p>
                      <Link
                        href={`/products/${products[currentSlide].id}`}
                        className="p-3 rounded-xl bg-white/20 backdrop-blur hover:bg-white/30 transition-all"
                      >
                        <ArrowRight className="h-5 w-5 text-white" />
                      </Link>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white text-sm">
                    Featured
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No products yet</p>
                    <Link href="/admin/products/new" className="text-primary hover:underline mt-2 inline-block">
                      Add your first product
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {products.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + products.length) % products.length)}
                  className="p-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {products.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentSlide ? 'w-8 bg-primary' : 'bg-border'
                    }`}
                  />
                ))}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % products.length)}
                  className="p-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Link href="/products" className="text-primary font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative block h-48 rounded-2xl overflow-hidden card-hover"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-lg font-bold">{cat.name}</h3>
                    <p className="text-white/70 text-sm">Shop Now</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
