-- ================================================
-- BASKET V2 - MULTI-VENDOR MARKETPLACE SCHEMA
-- ================================================
-- Run this script in your Supabase SQL Editor
-- This replaces the original single-store schema
-- ================================================

-- 1. Create Stores Table
-- ================================================
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stores_owner ON stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(is_active);

-- 2. Create Categories Table (dynamic, AI-generated)
-- ================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(10), -- emoji icon, can be auto-assigned
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- 3. Create Products Table
-- ================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT, -- can be AI-generated later
  price DECIMAL(10, 2) NOT NULL,
  quantity_label VARCHAR(50), -- e.g., "x5", "Bunch of 5"
  image_url TEXT, -- primary display image (AI-processed later)
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  -- AI metadata (populated by Gemini later)
  ai_description TEXT, -- AI-generated description
  ai_processed BOOLEAN DEFAULT false,
  ai_processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- 4. Create Product Images Table (multiple angles per product)
-- ================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL, -- original uploaded image
  processed_url TEXT, -- AI-cleaned image (Gemini output)
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- 5. Create Tags Table (AI-generated keywords/terms)
-- ================================================
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- 6. Create Product Tags Junction Table
-- ================================================
CREATE TABLE IF NOT EXISTS product_tags (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_product_tags_product ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag_id);

-- 7. Enable Row Level Security
-- ================================================
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies
-- ================================================

-- Stores: anyone can read active stores, owners can manage their own
DROP POLICY IF EXISTS "Public read stores" ON stores;
CREATE POLICY "Public read stores"
  ON stores FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Owners manage stores" ON stores;
CREATE POLICY "Owners manage stores"
  ON stores FOR ALL
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Categories: anyone can read
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories"
  ON categories FOR SELECT
  USING (true);

-- Products: anyone can read available products, store owners manage theirs
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products"
  ON products FOR SELECT
  USING (is_available = true);

DROP POLICY IF EXISTS "Store owners manage products" ON products;
CREATE POLICY "Store owners manage products"
  ON products FOR ALL
  USING (
    store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

-- Product images: anyone can read, store owners manage via product ownership
DROP POLICY IF EXISTS "Public read product images" ON product_images;
CREATE POLICY "Public read product images"
  ON product_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Store owners manage product images" ON product_images;
CREATE POLICY "Store owners manage product images"
  ON product_images FOR ALL
  USING (
    product_id IN (
      SELECT p.id FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE s.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    product_id IN (
      SELECT p.id FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE s.owner_id = auth.uid()
    )
  );

-- Tags: anyone can read
DROP POLICY IF EXISTS "Public read tags" ON tags;
CREATE POLICY "Public read tags"
  ON tags FOR SELECT
  USING (true);

-- Product tags: anyone can read, store owners manage via product ownership
DROP POLICY IF EXISTS "Public read product tags" ON product_tags;
CREATE POLICY "Public read product tags"
  ON product_tags FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Store owners manage product tags" ON product_tags;
CREATE POLICY "Store owners manage product tags"
  ON product_tags FOR ALL
  USING (
    product_id IN (
      SELECT p.id FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE s.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    product_id IN (
      SELECT p.id FROM products p
      JOIN stores s ON p.store_id = s.id
      WHERE s.owner_id = auth.uid()
    )
  );

-- 9. Storage bucket for product images
-- ================================================
-- Run these in separate SQL statements if needed:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- 10. Updated_at Trigger Function
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

-- Add triggers
DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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

-- 11. Seed default categories
-- ================================================
-- These are starter categories. The AI pipeline will create new ones
-- as products are added that don't fit existing categories.
INSERT INTO categories (name, slug, icon, display_order) VALUES
  ('Produce', 'produce', '🥕', 1),
  ('Meals', 'meals', '🍴', 2),
  ('Drinks', 'drinks', '🍷', 3),
  ('Snacks', 'snacks', '🍿', 4),
  ('Retail', 'retail', '🛍️', 5)
ON CONFLICT (slug) DO NOTHING;

-- ================================================
-- SCHEMA READY
-- ================================================
-- Product upload flow:
-- 1. Store owner uploads images → stored in product-images bucket
-- 2. Creates product with name + price + raw image URLs
-- 3. (Later) Supabase Edge Function sends images to Gemini
-- 4. Gemini returns: clean image, description, category, tags
-- 5. Product updated with AI-generated data
-- ================================================
