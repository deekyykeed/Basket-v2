-- ================================================
-- BASKET V2 - SUPABASE DATABASE SETUP
-- ================================================
-- Run this script in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste this code → Run
-- ================================================

-- 1. Create Categories Table
-- ================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- 2. Create Products Table
-- ================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity_label VARCHAR(50), -- e.g., "x5", "Bunch of 5"
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- 3. Enable Row Level Security (RLS)
-- ================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies (Allow public read access)
-- ================================================
-- Drop policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
DROP POLICY IF EXISTS "Allow public read access to products" ON products;

-- Categories: Allow anyone to read
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  USING (true);

-- Products: Allow anyone to read
CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT
  USING (true);

-- 5. Insert Sample Categories
-- ================================================
INSERT INTO categories (name, icon, slug, display_order) VALUES
  ('Grocery', '🛒', 'grocery', 1),
  ('Restaurants', '🍴', 'restaurants', 2),
  ('Alcohol', '🍷', 'alcohol', 3),
  ('Express', '🚚', 'express', 4),
  ('Retail', '🏪', 'retail', 5)
ON CONFLICT (slug) DO NOTHING;

-- 6. Insert Sample Products (Fresh Finds)
-- ================================================
INSERT INTO products (name, price, quantity_label, image_url, category_id, stock_quantity, featured)
SELECT
  'Banana',
  15.88,
  'Bunch of 5',
  'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
  (SELECT id FROM categories WHERE slug = 'grocery'),
  120,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Banana');

INSERT INTO products (name, price, quantity_label, image_url, category_id, stock_quantity, featured)
SELECT
  'Orange',
  15.88,
  NULL,
  'https://images.unsplash.com/photo-1582979512210-99b6a53386f4?w=400',
  (SELECT id FROM categories WHERE slug = 'grocery'),
  100,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Orange');

INSERT INTO products (name, price, quantity_label, image_url, category_id, stock_quantity, featured)
SELECT
  'Grapes',
  15.88,
  NULL,
  'https://images.unsplash.com/photo-1599819177818-8c1e8c9f7a2e?w=400',
  (SELECT id FROM categories WHERE slug = 'grocery'),
  90,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Grapes');

INSERT INTO products (name, price, quantity_label, image_url, category_id, stock_quantity, featured)
SELECT
  'Lettuce',
  15.88,
  NULL,
  'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400',
  (SELECT id FROM categories WHERE slug = 'grocery'),
  80,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lettuce');

INSERT INTO products (name, price, quantity_label, image_url, category_id, stock_quantity, featured)
SELECT
  'Bread',
  15.88,
  NULL,
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
  (SELECT id FROM categories WHERE slug = 'grocery'),
  60,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bread');

INSERT INTO products (name, price, quantity_label, image_url, category_id, stock_quantity, featured)
SELECT
  'Apple',
  15.88,
  'x5',
  'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
  (SELECT id FROM categories WHERE slug = 'grocery'),
  150,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Apple');

-- 7. Create Updated_at Trigger Function
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 8. Add Triggers to Auto-update updated_at
-- ================================================
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- SETUP COMPLETE!
-- ================================================
-- Next steps:
-- 1. Verify tables were created: Check Tables in Dashboard
-- 2. Verify data was inserted: Run SELECT * FROM categories;
-- 3. Test query: Run SELECT * FROM products WHERE featured = true;
--    You should see 6 products: Banana, Orange, Grapes, Lettuce, Bread, Apple
-- ================================================
