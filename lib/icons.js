// Inline SVG icon definitions
// Paste your SVG code here and convert to React Native SVG components

import React from 'react';
import Svg, { Path } from 'react-native-svg';

// Category Icons - Replace with your SVG code
export const GroceryIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M6.331 8H17.67a2 2 0 0 1 1.977 2.304l-1.255 8.152A3 3 0 0 1 15.426 21H8.574a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152A2 2 0 0 1 6.331 8z" strokeWidth="2" />
    <Path d="M9 11V6a3 3 0 0 1 6 0v5" strokeWidth="2" />
  </Svg>
);

export const RestaurantIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Paste your restaurant SVG path here */}
    <Path d="M12 3v18M3 12h18" strokeWidth="2" />
  </Svg>
);

export const AlcoholIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Paste your alcohol SVG path here */}
    <Path d="M12 3v18M3 12h18" strokeWidth="2" />
  </Svg>
);

export const ExpressIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Paste your express/truck SVG path here */}
    <Path d="M12 3v18M3 12h18" strokeWidth="2" />
  </Svg>
);

export const RetailIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Paste your retail/store SVG path here */}
    <Path d="M12 3v18M3 12h18" strokeWidth="2" />
  </Svg>
);

// Header Icons
export const ProfileIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Paste your profile SVG path here */}
    <Path d="M10 2v16M2 10h16" strokeWidth="2" />
  </Svg>
);

export const OrdersIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {/* Paste your orders/clipboard SVG path here */}
    <Path d="M10 2v16M2 10h16" strokeWidth="2" />
  </Svg>
);

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

// Fallback emoji if icons aren't rendering
export const EMOJI_FALLBACKS = {
  profile: '👤',
  orders: '📋',
};
