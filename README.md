# PSH Shoe Catalog

A modern, responsive shoe catalog built with Next.js 15, Supabase, and Tailwind CSS.

## Features

- 📦 Product catalog with categories and filtering
- 🔍 Search functionality
- 💰 Price filtering
- 🎨 Color variants for products
- ⭐ Product reviews and ratings
- ❤️ Favorites (saved locally)
- 🌙 Dark/Light theme toggle
- 👤 User authentication (email + Google)
- 🔧 Admin panel for managing products
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

### Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
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
  variants jsonb,
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
create policy "Anyone can view reviews" on reviews for select using (true);
create policy "Anyone can insert reviews" on reviews for insert with check (true);

-- Storage Policies (create bucket named 'psh_catalouges' first)
create policy "Public can view images" on storage.objects for select using (bucket_id = 'psh_catalouges');
create policy "Authenticated can upload images" on storage.objects for insert with check (bucket_id = 'psh_catalouges' and auth.role() = 'authenticated');
create policy "Authenticated can delete images" on storage.objects for delete using (bucket_id = 'psh_catalouges' and auth.role() = 'authenticated');

-- Indexes
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_featured on products(featured);
create index if not exists idx_reviews_product_id on reviews(product_id);
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

- **Frontend:** Next.js 15, React, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **State Management:** Zustand
- **Icons:** Lucide React

## License

MIT
