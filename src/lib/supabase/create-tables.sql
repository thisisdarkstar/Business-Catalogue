-- Create Products table (run in Supabase SQL Editor)

create table products (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  title text not null,
  description text,
  price numeric not null,
  thumbnail text,
  images text[],
  brand text,
  sizes text[],
  color text,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table products enable row level security;

-- Everyone can view products
create policy "Anyone can view products" on products for select using (true);

-- Admin insert/update/delete (using service role bypasses RLS)
create policy "Admin can insert" on products for insert with check (true);
create policy "Admin can update" on products for update using (true);
create policy "Admin can delete" on products for delete using (true);

-- Indexes
create index idx_products_category on products(category);
create index idx_products_featured on products(featured);
