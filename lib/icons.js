// Icon loader with fallbacks for SVG icons
// This file safely loads custom SVG icons and provides emoji fallbacks if files are missing

// Try to load SVG icon files, use null if they don't exist
const loadIcon = (path) => {
  try {
    return require(path);
  } catch (e) {
    return null;
  }
};

// Category icons - Add your custom SVG icon files to assets/icons/
export const CATEGORY_ICONS = {
  '🛒': loadIcon('../assets/icons/grocery.svg'),
  '🍴': loadIcon('../assets/icons/restaurant.svg'),
  '🍷': loadIcon('../assets/icons/alcohol.svg'),
  '🚚': loadIcon('../assets/icons/express.svg'),
  '🏪': loadIcon('../assets/icons/retail.svg'),
};

// Header icons - Add your custom SVG icon files to assets/icons/
export const HEADER_ICONS = {
  profile: loadIcon('../assets/icons/profile.svg'),
  orders: loadIcon('../assets/icons/orders.svg'),
};

// Fallback emoji if SVG icon files are missing
export const EMOJI_FALLBACKS = {
  profile: '👤',
  orders: '📋',
};
