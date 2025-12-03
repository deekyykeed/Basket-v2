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
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access for Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

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
-- PART 11: INSERT DEMO PRODUCTS
-- ================================================
-- NOTE: After uploading images to Storage → product-images bucket,
-- replace the image URLs below with your actual product image URLs
-- URL format: https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/YOUR_IMAGE_NAME.jpg

INSERT INTO products (name, price, quantity_label, image_url, category_id, stock_quantity, is_available, featured)
VALUES
  -- Row 1
  (
    'Fresh Tomato',
    15.88,
    'x5',
    'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/tomato.jpg',
    (SELECT id FROM categories WHERE slug = 'grocery'),
    100,
    true,
    true
  ),
  (
    'Green Lettuce',
    12.50,
    NULL,
    'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/lettuce.jpg',
    (SELECT id FROM categories WHERE slug = 'grocery'),
    80,
    true,
    true
  ),
  (
    'Banana Bunch',
    18.99,
    'x5',
    'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/banana.jpg',
    (SELECT id FROM categories WHERE slug = 'grocery'),
    120,
    true,
    true
  ),
  (
    'Fresh Broccoli',
    22.00,
    NULL,
    'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/broccoli.jpg',
    (SELECT id FROM categories WHERE slug = 'grocery'),
    60,
    true,
    true
  ),

  -- Row 2
  (
    'Red Grapes',
    25.99,
    '500g',
    'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/grapes.jpg',
    (SELECT id FROM categories WHERE slug = 'grocery'),
    90,
    true,
    true
  ),
  (
    'Sweet Mango',
    19.99,
    'x2',
    'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/mango.jpg',
    (SELECT id FROM categories WHERE slug = 'grocery'),
    75,
    true,
    true
  ),
  (
    'Watermelon',
    45.00,
    '1 whole',
    'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/watermelon.jpg',
    (SELECT id FROM categories WHERE slug = 'grocery'),
    50,
    true,
    true
  ),
  (
    'Red Apple',
    20.50,
    'x6',
    'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/apple.jpg',
    (SELECT id FROM categories WHERE slug = 'grocery'),
    150,
    true,
    true
  ),

  -- Row 3
  (
    'Fresh Carrot',
    14.99,
    '1kg',
    'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/carrot.jpg',
    (SELECT id FROM categories WHERE slug = 'grocery'),
    110,
    true,
    true
  ),
  (
    'Orange',
    16.50,
    'x4',
    'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/orange.jpg',
    (SELECT id FROM categories WHERE slug = 'grocery'),
    95,
    true,
    true
  ),
  (
    'Strawberries',
    28.99,
    '250g',
    'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/strawberry.jpg',
    (SELECT id FROM categories WHERE slug = 'grocery'),
    65,
    true,
    true
  ),
  (
    'Blueberries',
    32.00,
    '200g',
    'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/blueberry.jpg',
    (SELECT id FROM categories WHERE slug = 'grocery'),
    45,
    true,
    true
  );

-- ================================================
-- SETUP COMPLETE!
-- ================================================
-- Next steps:
-- 1. Run this entire SQL script in Supabase SQL Editor
-- 2. Go to Storage → You should see 'product-images' bucket
-- 3. Upload your product images to the bucket
-- 4. Update the image URLs in the INSERT statements above
-- 5. Or add new products with SQL like:
--    INSERT INTO products (name, price, image_url, category_id, stock_quantity, featured)
--    VALUES (
--      'Product Name',
--      29.99,
--      'https://wqefcyeislvrgqsxouzn.supabase.co/storage/v1/object/public/product-images/your-image.jpg',
--      (SELECT id FROM categories WHERE slug = 'grocery'),
--      100,
--      true
--    );
-- ================================================
