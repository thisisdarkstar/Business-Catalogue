'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Heart, Share2, Check, Copy, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useFavStore } from '@/stores/favorites';
import { useAuth } from '@/components/AuthProvider';

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
  variants?: { color: string; thumbnail: string | null; images: string[] | null }[];
}

interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(-1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const { favorites, toggleFavorite } = useFavStore();
  const supabase = createClient();

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id, user]);

  const fetchProduct = async () => {
    setLoading(true);
    setSelectedVariant(-1);
    const { data: productData } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (productData) {
      console.log('Product data:', productData);
      console.log('Variants:', productData.variants);
      
      const parsedVariants = typeof productData.variants === 'string' 
        ? JSON.parse(productData.variants) 
        : productData.variants;
      
      setProduct({ ...productData, variants: parsedVariants });
      
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', params.id)
        .order('created_at', { ascending: false });
      
      if (reviewsData) {
        setReviews(reviewsData);
        
        const getGuestIdFromCookie = () => {
          const name = 'review_guest_id=';
          const decodedCookie = decodeURIComponent(document.cookie);
          const ca = decodedCookie.split(';');
          for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
          }
          return null;
        };
        
        const guestId = getGuestIdFromCookie();
        const hasReviewed = reviewsData.some((r: Review) => {
          if (user && r.user_id === user.id) return true;
          if (guestId && r.reviewer_name === guestId) return true;
          return false;
        });
        setAlreadyReviewed(hasReviewed);
      }
    }
    setLoading(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getGuestId = () => {
    const name = 'review_guest_id=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return null;
  };

  const setGuestIdCookie = (guestId: string) => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `review_guest_id=${guestId};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;
    if (alreadyReviewed) return;
    
    setReviewSubmitting(true);
    
    let guestId = getGuestId();
    if (!guestId) {
      guestId = 'guest_' + Math.random().toString(36).substring(2, 15);
      setGuestIdCookie(guestId);
    }
    
    const { error } = await supabase.from('reviews').insert({
      product_id: params.id,
      user_id: user?.id || null,
      reviewer_name: user ? user.email : (reviewerName || guestId),
      rating: reviewRating,
      comment: reviewText,
    });
    
    if (!error) {
      setReviewText('');
      setReviewerName('');
      setAlreadyReviewed(true);
      fetchProduct();
    }
    
    setReviewSubmitting(false);
  };

  const getCurrentImages = () => {
    if (!product) return [];
    
    // If no variant selected (-1) or no variants exist, show default images
    if (selectedVariant === -1 || !product.variants || product.variants.length === 0) {
      return product.thumbnail 
        ? [product.thumbnail, ...(product.images || [])]
        : product.images || [];
    }
    
    // Show selected variant's images
    const selectedVar = product.variants[selectedVariant];
    
    if (selectedVar) {
      const variantImages = selectedVar.thumbnail 
        ? [selectedVar.thumbnail, ...(selectedVar.images || [])]
        : selectedVar.images || [];
      if (variantImages.length > 0) return variantImages;
    }
    
    // Fallback to default images
    return product.thumbnail 
      ? [product.thumbnail, ...(product.images || [])]
      : product.images || [];
  };

  const allImages = getCurrentImages();

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Share2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <Link href="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isFav = favorites.includes(product.id);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary mb-4">
              <img
                src={allImages[selectedImage] || 'https://placehold.co/800x800'}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      idx === selectedImage ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm text-muted-foreground capitalize mb-2">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
              {product.brand && (
                <p className="text-sm text-muted-foreground mb-2">Brand: {product.brand}</p>
              )}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold gradient-text">₹{product.price.toLocaleString()}</p>
                  {product.original_price && product.original_price > product.price && (
                    <p className="text-lg text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{avgRating}</span>
                  <span className="text-sm text-muted-foreground">({reviews.length})</span>
                </div>
              </div>
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Available Sizes:</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className="px-4 py-2 rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variants && product.variants.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Color:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedVariant(-1)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedVariant === -1
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {product.color || 'Default'}
                  </button>
                  {product.variants.map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(idx)}
                      className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                        selectedVariant === idx
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {variant.color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!product.variants || product.variants.length === 0 && product.color && (
              <p className="text-sm text-muted-foreground">Color: {product.color}</p>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => toggleFavorite(product.id)}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
                  isFav 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                    : 'bg-secondary hover:bg-accent'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isFav ? (
                    <motion.div
                      key="filled"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="outline"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Heart className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {isFav ? 'Saved' : 'Save'}
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-secondary hover:bg-accent transition-colors"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="h-5 w-5 text-green-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="share"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-8">Reviews ({reviews.length})</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              
              {alreadyReviewed ? (
                <div className="text-center py-8">
                  <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">You have already reviewed this product.</p>
                  <p className="text-sm text-muted-foreground mt-2">You can only submit one review per product.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-muted-foreground">Your Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`h-5 w-5 transition-colors ${
                              star <= reviewRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <textarea
                    placeholder="Share your thoughts about this product..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
                  />

                  <button
                    onClick={handleSubmitReview}
                    disabled={reviewSubmitting || !reviewText.trim()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {reviewSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Submit Review
                  </button>
                </>
              )}
            </div>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews yet. Be the first to review this product!
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                          <span className="text-sm">{review.reviewer_name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{review.reviewer_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
