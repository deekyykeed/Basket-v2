import { supabase } from './supabase';

/**
 * Favorites table schema (SQL to run in Supabase):
 *
 * CREATE TABLE favorites (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
 *   product_id UUID NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   UNIQUE(user_id, product_id)
 * );
 *
 * CREATE INDEX idx_favorites_user_id ON favorites(user_id);
 *
 * -- Row Level Security
 * ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Users can view their own favorites"
 *   ON favorites FOR SELECT
 *   USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can insert their own favorites"
 *   ON favorites FOR INSERT
 *   WITH CHECK (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can delete their own favorites"
 *   ON favorites FOR DELETE
 *   USING (auth.uid() = user_id);
 */

/**
 * Get all favorites for the current user
 */
export const getFavorites = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', userId);

    if (error) throw error;
    return { data: data?.map(f => f.product_id) || [], error: null };
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    return { data: [], error };
  }
};

/**
 * Add a product to favorites
 */
export const addFavorite = async (userId, productId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, product_id: productId }])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    return { data: null, error };
  }
};

/**
 * Remove a product from favorites
 */
export const removeFavorite = async (userId, productId) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    return { error };
  }
};

/**
 * Check if a product is favorited
 */
export const isFavorite = async (userId, productId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return { isFavorite: !!data, error: null };
  } catch (error) {
    console.error('Error checking favorite:', error.message);
    return { isFavorite: false, error };
  }
};
