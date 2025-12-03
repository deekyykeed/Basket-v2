-- ================================================
-- BASKET V2 - SIMPLIFIED SETUP (Tables & Products Only)
-- ================================================
-- Use this if storage bucket and policies already exist
-- ================================================

-- Drop and recreate tables
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ================================================
-- CREATE CATEGORIES TABLE
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

-- Add indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);
CREATE INDEX idx_categories_order ON categories(display_order);

-- ================================================
-- CREATE PRODUCTS TABLE
-- ================================================
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity_label VARCHAR(50),
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_created ON products(created_at DESC);

-- ================================================
-- ENABLE ROW LEVEL SECURITY
-- ================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ================================================
-- CREATE RLS POLICIES
-- ================================================
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read access to products" ON products;
CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT
  USING (true);

-- ================================================
-- INSERT CATEGORIES
-- ================================================
INSERT INTO categories (name, icon, slug, display_order) VALUES
  ('Grocery', '🛒', 'grocery', 1),
  ('Restaurants', '🍴', 'restaurants', 2),
  ('Alcohol', '🍷', 'alcohol', 3),
  ('Express', '🚚', 'express', 4),
  ('Retail', '🏪', 'retail', 5);

-- ================================================
-- CREATE HELPER FUNCTIONS
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ================================================
-- ADD TRIGGERS
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
-- INSERT DEMO PRODUCTS
-- ================================================
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
