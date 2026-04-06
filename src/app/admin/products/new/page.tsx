'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';

const categories = ['mens', 'womens', 'kids', 'sports', 'formal', 'casual'];

const sizeOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

const colorOptions = [
  'Black', 'White', 'Brown', 'Nude', 'Tan', 'Red', 'Blue', 'Pink', 
  'Purple', 'Green', 'Orange', 'Grey', 'Navy', 'Beige', 'Gold', 'Silver'
];

export default function NewProductPage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('mens');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [color, setColor] = useState('');
  const [showColorSuggestions, setShowColorSuggestions] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [newSize, setNewSize] = useState('');
  
  // Color variants state
  const [showVariantsSection, setShowVariantsSection] = useState(false);
  const [newVariantColor, setNewVariantColor] = useState('');
  const [variantThumbnail, setVariantThumbnail] = useState<string | null>(null);
  const [variantImages, setVariantImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<{color: string; thumbnail: string | null; images: string[] | null}[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const brandInputRef = useRef<HTMLInputElement>(null);
  const variantImageInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const savedBrands = localStorage.getItem('productBrands');
    if (savedBrands) {
      setBrandSuggestions(JSON.parse(savedBrands));
    }
  }, []);

  const saveBrandToHistory = (brandName: string) => {
    if (!brandName.trim()) return;
    const updated = [brandName, ...brandSuggestions.filter(b => b.toLowerCase() !== brandName.toLowerCase())].slice(0, 10);
    setBrandSuggestions(updated);
    localStorage.setItem('productBrands', JSON.stringify(updated));
  };

  const filteredBrandSuggestions = brandSuggestions.filter(b => 
    b.toLowerCase().includes(brand.toLowerCase())
  );

  const filteredColorSuggestions = colorOptions.filter(c => 
    c.toLowerCase().includes(color.toLowerCase())
  );

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Bucket name from Supabase - exact name with space
    const bucketName = 'psh_catalouges';
    
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Upload error:', error);
        alert(`Upload failed: ${error.message}`);
        return null;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (e: any) {
      console.error('Upload exception:', e);
      alert(`Upload failed: ${e.message || 'Unknown error'}`);
      return null;
    }
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setThumbnail(url);
    setUploading(false);
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setUploading(true);
    const newImages: string[] = [];
    
    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) newImages.push(url);
    }
    
    setImages([...images, ...newImages]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size].sort((a, b) => parseFloat(a) - parseFloat(b))
    );
  };

  const addCustomSize = () => {
    if (newSize.trim() && !selectedSizes.includes(newSize.trim())) {
      setSelectedSizes(prev => [...prev, newSize.trim()].sort((a, b) => parseFloat(a) - parseFloat(b)));
      setNewSize('');
    }
  };

  const handleVariantImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setUploading(true);
    const newImages: string[] = [];
    
    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) newImages.push(url);
    }
    
    setVariantImages([...variantImages, ...newImages]);
    setUploading(false);
  };

  const addVariant = () => {
    if (!newVariantColor.trim()) return;
    if (variantImages.length === 0) {
      alert('Please add at least one image for the variant');
      return;
    }
    
    setVariants([...variants, {
      color: newVariantColor.trim(),
      thumbnail: variantImages[0] || null,
      images: variantImages.length > 0 ? variantImages : null
    }]);
    
    setNewVariantColor('');
    setVariantThumbnail(null);
    setVariantImages([]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !category) return;
    
    if (brand.trim()) {
      saveBrandToHistory(brand.trim());
    }
    
    setLoading(true);
    
    console.log('Submitting with variants:', JSON.stringify(variants));
    
    const productData: any = {
      title,
      description,
      category,
      price: parseFloat(price),
      original_price: originalPrice ? parseFloat(originalPrice) : null,
      thumbnail,
      images: images.length > 0 ? images : null,
      brand: brand || null,
      color: color || null,
      sizes: selectedSizes.length > 0 ? selectedSizes : null,
      featured,
    };
    
    if (variants.length > 0) {
      productData.variants = JSON.stringify(variants);
    }
    
    const { error } = await supabase.from('products').insert(productData);
    
    if (!error) {
      router.push('/admin');
    } else {
      console.error('Insert error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/');
    }
  }, [authLoading, isAdmin, router]);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-12 px-2 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-6 md:p-8"
        >
          <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Product Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter product title"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Original Price (₹)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Brand</label>
                <input
                  type="text"
                  ref={brandInputRef}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  onFocus={() => setShowBrandSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
                  placeholder="Enter brand name"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <AnimatePresence>
                  {showBrandSuggestions && filteredBrandSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-auto"
                    >
                      {filteredBrandSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setBrand(suggestion);
                            setShowBrandSuggestions(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-secondary transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  onFocus={() => setShowColorSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowColorSuggestions(false), 200)}
                  placeholder="Select or type color"
                  list="color-suggestions"
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <datalist id="color-suggestions">
                  {colorOptions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div className="flex items-end">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Mark as Featured</label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Available Sizes</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {sizeOptions.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedSizes.includes(size)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                  placeholder="Add custom size"
                  className="flex-1 px-4 py-2 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={addCustomSize}
                  className="px-4 py-2 rounded-xl bg-secondary hover:bg-accent transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              {selectedSizes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedSizes.map(size => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {size}
                      <button type="button" onClick={() => toggleSize(size)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail Image</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleThumbnailChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                {thumbnail ? (
                  <div className="relative inline-block">
                    <img src={thumbnail} alt="Thumbnail" className="h-40 w-40 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setThumbnail(null); }}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : uploading ? (
                  <Loader2 className="h-10 w-10 mx-auto animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload thumbnail</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Images</label>
              <input
                type="file"
                onChange={handleImagesChange}
                accept="image/*"
                multiple
                className="hidden"
                id="images-input"
              />
              <div
                onClick={() => document.getElementById('images-input')?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                {images.length > 0 ? (
                  <div className="flex flex-wrap gap-4 justify-center">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`Image ${idx + 1}`} className="h-24 w-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <div className="h-24 w-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                ) : uploading ? (
                  <Loader2 className="h-10 w-10 mx-auto animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload multiple images</p>
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <button
                type="button"
                onClick={() => setShowVariantsSection(!showVariantsSection)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-secondary border border-border hover:bg-accent transition-colors"
              >
                <span className="font-medium">Color Variants (Optional)</span>
                <Plus className={`h-5 w-5 transition-transform ${showVariantsSection ? 'rotate-45' : ''}`} />
              </button>
              
              {showVariantsSection && (
                <div className="mt-4 p-4 bg-secondary/50 rounded-xl border border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    Add different color variants for the same product. Each variant can have its own images.
                  </p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={newVariantColor}
                        onChange={(e) => setNewVariantColor(e.target.value)}
                        placeholder="Color name (e.g. Red)"
                        list="color-suggestions-variant"
                        className="w-full px-4 py-2 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <datalist id="color-suggestions-variant">
                        {colorOptions.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>
                    <input
                      type="file"
                      ref={variantImageInputRef}
                      onChange={handleVariantImageChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="variant-images-input"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('variant-images-input')?.click()}
                      className="px-4 py-2 rounded-xl bg-secondary border border-border hover:bg-accent transition-colors flex items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Images
                    </button>
                    <button
                      type="button"
                      onClick={addVariant}
                      disabled={!newVariantColor.trim() || variantImages.length === 0}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-colors disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {variantImages.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Images for "{newVariantColor}":</p>
                      <div className="flex gap-2 flex-wrap">
                        {variantImages.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img src={img} alt="" className="w-20 h-20 sm:w-16 sm:h-16 rounded-lg object-cover" />
                            <button
                              type="button"
                              onClick={() => setVariantImages(variantImages.filter((_, i) => i !== idx))}
                              className="absolute -top-2 -right-2 p-1.5 sm:p-1 rounded-full bg-destructive text-destructive-foreground"
                            >
                              <X className="h-4 w-4 sm:h-3 sm:w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {variants.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                      {variants.map((variant, idx) => (
                        <div key={idx} className="relative bg-secondary rounded-lg p-4 sm:p-3 border border-border">
                          <button
                            type="button"
                            onClick={() => removeVariant(idx)}
                            className="absolute -top-2 -right-2 p-2 sm:p-1 rounded-full bg-destructive text-destructive-foreground"
                          >
                            <X className="h-4 w-4 sm:h-3 sm:w-3" />
                          </button>
                          <div className="flex items-center gap-2 mb-3 sm:mb-2">
                            <div className="w-5 h-5 sm:w-4 sm:h-4 rounded-full border border-border" style={{ backgroundColor: variant.color.toLowerCase() }} />
                            <span className="text-base sm:text-sm font-medium capitalize">{variant.color}</span>
                          </div>
                          <div className="flex gap-3 sm:gap-2 flex-wrap">
                            {variant.thumbnail && (
                              <div className="relative">
                                <img src={variant.thumbnail} alt={variant.color} className="w-20 h-20 sm:w-14 sm:h-14 rounded object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newVariants = [...variants];
                                    newVariants[idx] = { ...newVariants[idx], thumbnail: null };
                                    setVariants(newVariants);
                                  }}
                                  className="absolute -top-2 -right-2 p-2 sm:p-1.5 rounded-full bg-destructive text-destructive-foreground"
                                >
                                  <X className="h-4 w-4 sm:h-3 sm:w-3" />
                                </button>
                              </div>
                            )}
                            {variant.images?.map((img, i) => (
                              <div key={i} className="relative">
                                <img src={img} alt="" className="w-20 h-20 sm:w-14 sm:h-14 rounded object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newVariants = [...variants];
                                    newVariants[idx] = { 
                                      ...newVariants[idx], 
                                      images: newVariants[idx].images?.filter((_: any, imgIdx: number) => imgIdx !== i) || null 
                                    };
                                    setVariants(newVariants);
                                  }}
                                  className="absolute -top-2 -right-2 p-2 sm:p-1.5 rounded-full bg-destructive text-destructive-foreground"
                                >
                                  <X className="h-4 w-4 sm:h-3 sm:w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl gradient-bg text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Product...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
