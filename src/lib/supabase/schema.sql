-- Database Schema for Shoe Catalog

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  title text not null,
  description text,
  price numeric not null,
  original_price numeric,
  thumbnail text,
  images text[],
  brand text,
  sizes text[],
  color text,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews Table
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  reviewer_name text,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table products enable row level security;
alter table reviews enable row level security;

-- Products Policies
create policy "Anyone can view products" on products for select using (true);
create policy "Admin can insert products" on products for insert with check (true);
create policy "Admin can update products" on products for update using (true);
create policy "Admin can delete products" on products for delete using (true);

-- Reviews Policies
-- Everyone can view reviews
create policy "Anyone can view reviews" on reviews for select using (true);
-- Anyone (guests or logged in) can insert reviews
create policy "Anyone can insert reviews" on reviews for insert with check (true);

-- Storage Policies (for 'psh_catalouges' bucket)
-- Only authenticated users can upload and delete
create policy "Public can view images" on storage.objects for select using (bucket_id = 'psh_catalouges');
create policy "Authenticated can upload images" on storage.objects for insert with check (bucket_id = 'psh_catalouges' and auth.role() = 'authenticated');
create policy "Authenticated can delete images" on storage.objects for delete using (bucket_id = 'psh_catalouges' and auth.role() = 'authenticated');

-- Indexes
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_featured on products(featured);
create index if not exists idx_reviews_product_id on reviews(product_id);
