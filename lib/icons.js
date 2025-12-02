// Icon loader with fallbacks
// This file safely loads custom icons and provides emoji fallbacks if files are missing

// Try to load icon files, use null if they don't exist
const loadIcon = (path) => {
  try {
    return require(path);
  } catch (e) {
    return null;
  }
};

// Category icons - Replace with your custom PNG icons
export const CATEGORY_ICONS = {
  '🛒': loadIcon('../assets/icons/grocery.png'),
  '🍴': loadIcon('../assets/icons/restaurant.png'),
  '🍷': loadIcon('../assets/icons/alcohol.png'),
  '🚚': loadIcon('../assets/icons/express.png'),
  '🏪': loadIcon('../assets/icons/retail.png'),
};

// Header icons - Replace with your custom PNG icons
export const HEADER_ICONS = {
  profile: loadIcon('../assets/icons/profile.png'),
  orders: loadIcon('../assets/icons/orders.png'),
};

// Fallback emoji if icon files are missing
export const EMOJI_FALLBACKS = {
  profile: '👤',
  orders: '📋',
};
