-- ================================================
-- BASKET V2 - SUPABASE DATABASE SETUP
-- ================================================
-- Run this script in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste this code → Run
-- ================================================

-- ================================================
-- PART 1: DROP EXISTING TABLES (Clean slate)
-- ================================================
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ================================================
-- PART 2: CREATE STORAGE BUCKET FOR PRODUCT IMAGES
-- ================================================
-- Note: This creates a public bucket for product images
-- You'll upload images via the Supabase Dashboard → Storage

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- PART 3: STORAGE POLICIES FOR PUBLIC ACCESS
-- ================================================
-- Allow anyone to read images
CREATE POLICY "Public Access for Product Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload images (optional - for future admin panel)
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update images (optional - for future admin panel)
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images (optional - for future admin panel)
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ================================================
-- PART 4: CREATE CATEGORIES TABLE
-- ================================================
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_order ON categories(display_order);

-- ================================================
-- PART 5: CREATE PRODUCTS TABLE
-- ================================================
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity_label VARCHAR(50), -- e.g., "x5", "Bunch of 5", "1kg"
  image_url TEXT NOT NULL, -- Full URL from storage bucket
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_created ON products(created_at DESC);

-- ================================================
-- PART 6: ENABLE ROW LEVEL SECURITY
-- ================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ================================================
-- PART 7: CREATE RLS POLICIES
-- ================================================
-- Categories: Allow anyone to read
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  USING (true);

-- Products: Allow anyone to read
CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT
  USING (true);

-- ================================================
-- PART 8: INSERT CATEGORIES
-- ================================================
INSERT INTO categories (name, icon, slug, display_order) VALUES
  ('Grocery', '🛒', 'grocery', 1),
  ('Restaurants', '🍴', 'restaurants', 2),
  ('Alcohol', '🍷', 'alcohol', 3),
  ('Express', '🚚', 'express', 4),
  ('Retail', '🏪', 'retail', 5)
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- PART 9: CREATE HELPER FUNCTIONS
-- ================================================
-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ================================================
-- PART 10: ADD TRIGGERS
-- ================================================
-- Trigger for categories
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- SETUP COMPLETE!
-- ================================================
-- Next steps:
-- 1. Verify tables: Check 'Table Editor' in Dashboard
-- 2. Verify storage bucket: Go to Storage → You should see 'product-images' bucket
-- 3. Upload product images:
--    - Go to Storage → product-images
--    - Upload your product images
--    - Copy the public URL for each image
-- 4. Insert products with image URLs:
--    Example:
--    INSERT INTO products (name, price, image_url, category_id, stock_quantity, featured)
--    VALUES (
--      'Fresh Tomato',
--      15.88,
--      'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/tomato.jpg',
--      (SELECT id FROM categories WHERE slug = 'grocery'),
--      100,
--      true
--    );
-- ================================================
