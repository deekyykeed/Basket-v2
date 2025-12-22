// Hugeicons integration for Basket app
import React from 'react';
import { Text } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ShoppingBasket01Icon,
  Restaurant01Icon,
  Store01Icon,
  DeliveryTruck01Icon,
  ShoppingBag01Icon,
  User01Icon,
  ShoppingCart01Icon,
  Search01Icon,
  Home01Icon,
  Menu01Icon,
  FilterIcon as FilterIconCore,
  HeartIcon,
  Add01Icon,
  MinusSignIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  ArrowExpand01Icon,
} from '@hugeicons/core-free-icons';

const SafeHugeiconsIcon = ({ icon, fallback, ...props }) => {
  // HugeiconsIcon expects `icon` to be an array (it calls `.map()` internally).
  // If the icon export is missing/undefined (version mismatch), render a safe fallback.
  if (!Array.isArray(icon)) {
    const size = typeof props.size === 'number' ? props.size : 24;
    const color = typeof props.color === 'string' ? props.color : '#000';

    if (!fallback) return null;
    return (
      <Text style={{ fontSize: size, color, lineHeight: Math.round(size * 1.1) }}>
        {fallback}
      </Text>
    );
  }

  return <HugeiconsIcon icon={icon} {...props} />;
};

// Category Icon Components
export const GroceryIcon = (props) => (
  <SafeHugeiconsIcon icon={ShoppingBasket01Icon} fallback="🛒" {...props} />
);

export const RestaurantIcon = (props) => (
  <SafeHugeiconsIcon icon={Restaurant01Icon} fallback="🍴" {...props} />
);

export const AlcoholIcon = (props) => (
  <SafeHugeiconsIcon icon={ShoppingBag01Icon} fallback="🍷" {...props} />
);

export const ExpressIcon = (props) => (
  <SafeHugeiconsIcon icon={DeliveryTruck01Icon} fallback="🚚" {...props} />
);

export const RetailIcon = (props) => (
  <SafeHugeiconsIcon icon={Store01Icon} fallback="🏪" {...props} />
);

// Bottom Control Center Icons
export const HomeIcon = (props) => (
  <SafeHugeiconsIcon icon={Home01Icon} fallback="🏠" {...props} />
);

export const SearchIcon = (props) => (
  <SafeHugeiconsIcon icon={Search01Icon} fallback="🔍" {...props} />
);

export const CartIcon = (props) => (
  <SafeHugeiconsIcon icon={ShoppingCart01Icon} fallback="🛒" {...props} />
);

export const FavoritesIcon = (props) => (
  <SafeHugeiconsIcon icon={HeartIcon} fallback="❤️" {...props} />
);

export const ProfileIcon = (props) => (
  <SafeHugeiconsIcon icon={User01Icon} fallback="👤" {...props} />
);

export const MenuIcon = (props) => (
  <SafeHugeiconsIcon icon={Menu01Icon} fallback="☰" {...props} />
);

export const FilterIcon = (props) => (
  <SafeHugeiconsIcon icon={FilterIconCore} fallback="⚙️" {...props} />
);

// Bottom Sheet Icons
export const PlusIcon = (props) => (
  <SafeHugeiconsIcon icon={Add01Icon} fallback="＋" {...props} />
);

export const MinusIcon = (props) => (
  <SafeHugeiconsIcon icon={MinusSignIcon} fallback="−" {...props} />
);

export const CloseIcon = (props) => (
  <SafeHugeiconsIcon icon={Cancel01Icon} fallback="✕" {...props} />
);

export const CheckmarkIcon = (props) => (
  <SafeHugeiconsIcon icon={CheckmarkCircle01Icon} fallback="✓" {...props} />
);

export const ExpandIcon = (props) => (
  <SafeHugeiconsIcon icon={ArrowExpand01Icon} fallback="⤢" {...props} />
);

// Icon mapping for categories (using emoji as key from database)
export const CATEGORY_ICONS = {
  '🛒': GroceryIcon,
  '🍴': RestaurantIcon,
  '🍷': AlcoholIcon,
  '🚚': ExpressIcon,
  '🏪': RetailIcon,
};

// Bottom navigation icons
export const BOTTOM_NAV_ICONS = {
  home: HomeIcon,
  search: SearchIcon,
  cart: CartIcon,
  favorites: FavoritesIcon,
  profile: ProfileIcon,
};

// Fallback emoji if icons aren't rendering
export const EMOJI_FALLBACKS = {
  home: '🏠',
  search: '🔍',
  cart: '🛒',
  favorites: '❤️',
  profile: '👤',
};
