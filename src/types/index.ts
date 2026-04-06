export interface Product {
  id: string;
  category: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  thumbnail: string | null;
  images: string[] | null;
  color?: string;
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  color: string;
  thumbnail: string | null;
  images: string[] | null;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  reviewer_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}
