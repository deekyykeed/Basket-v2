// Hugeicons integration for Basket app
import React from 'react';
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
  FilterIcon,
  HeartIcon,
  Add01Icon,
  MinusSignIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';

// Category Icon Components
export const GroceryIcon = (props) => (
  <HugeiconsIcon icon={ShoppingBasket01Icon} {...props} />
);

export const RestaurantIcon = (props) => (
  <HugeiconsIcon icon={Restaurant01Icon} {...props} />
);

export const AlcoholIcon = (props) => (
  <HugeiconsIcon icon={ShoppingBag01Icon} {...props} />
);

export const ExpressIcon = (props) => (
  <HugeiconsIcon icon={DeliveryTruck01Icon} {...props} />
);

export const RetailIcon = (props) => (
  <HugeiconsIcon icon={Store01Icon} {...props} />
);

// Bottom Control Center Icons
export const HomeIcon = (props) => (
  <HugeiconsIcon icon={Home01Icon} {...props} />
);

export const SearchIcon = (props) => (
  <HugeiconsIcon icon={Search01Icon} {...props} />
);

export const CartIcon = (props) => (
  <HugeiconsIcon icon={ShoppingCart01Icon} {...props} />
);

export const FavoritesIcon = (props) => (
  <HugeiconsIcon icon={HeartIcon} {...props} />
);

export const ProfileIcon = (props) => (
  <HugeiconsIcon icon={User01Icon} {...props} />
);

export const MenuIcon = (props) => (
  <HugeiconsIcon icon={Menu01Icon} {...props} />
);

export const FilterIcon = (props) => (
  <HugeiconsIcon icon={FilterIcon} {...props} />
);

// Bottom Sheet Icons
export const PlusIcon = (props) => (
  <HugeiconsIcon icon={Add01Icon} {...props} />
);

export const MinusIcon = (props) => (
  <HugeiconsIcon icon={MinusSignIcon} {...props} />
);

export const CloseIcon = (props) => (
  <HugeiconsIcon icon={Cancel01Icon} {...props} />
);

export const CheckmarkIcon = (props) => (
  <HugeiconsIcon icon={CheckmarkCircle01Icon} {...props} />
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
