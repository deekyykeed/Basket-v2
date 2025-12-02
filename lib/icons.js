// SVG icon loader - Loads SVG files from assets/icons/ folder
// metro.config.js is configured to convert SVG files to React components

// Import SVG files - These will be converted to React components by react-native-svg-transformer
// If files don't exist yet, they'll show as null and fallback to emoji

let GroceryIcon, RestaurantIcon, AlcoholIcon, ExpressIcon, RetailIcon;
let ProfileIcon, OrdersIcon;

try { GroceryIcon = require('../assets/icons/grocery.svg').default; } catch (e) { GroceryIcon = null; }
try { RestaurantIcon = require('../assets/icons/restaurant.svg').default; } catch (e) { RestaurantIcon = null; }
try { AlcoholIcon = require('../assets/icons/alcohol.svg').default; } catch (e) { AlcoholIcon = null; }
try { ExpressIcon = require('../assets/icons/express.svg').default; } catch (e) { ExpressIcon = null; }
try { RetailIcon = require('../assets/icons/retail.svg').default; } catch (e) { RetailIcon = null; }
try { ProfileIcon = require('../assets/icons/profile.svg').default; } catch (e) { ProfileIcon = null; }
try { OrdersIcon = require('../assets/icons/orders.svg').default; } catch (e) { OrdersIcon = null; }

// Icon mapping for categories (using emoji as key from database)
export const CATEGORY_ICONS = {
  '🛒': GroceryIcon,
  '🍴': RestaurantIcon,
  '🍷': AlcoholIcon,
  '🚚': ExpressIcon,
  '🏪': RetailIcon,
};

// Header icon mapping
export const HEADER_ICONS = {
  profile: ProfileIcon,
  orders: OrdersIcon,
};

// Fallback emoji if SVG files are missing
export const EMOJI_FALLBACKS = {
  profile: '👤',
  orders: '📋',
};
