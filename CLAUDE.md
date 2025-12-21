# CLAUDE.md - AI Assistant Guide for Basket v2

This document provides comprehensive guidance for AI assistants working with the Basket v2 codebase. It covers architecture, conventions, workflows, and best practices.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Directory Structure](#directory-structure)
4. [Architecture & Patterns](#architecture--patterns)
5. [Code Conventions](#code-conventions)
6. [State Management](#state-management)
7. [Data & Database](#data--database)
8. [Component Guide](#component-guide)
9. [Development Workflows](#development-workflows)
10. [Common Tasks](#common-tasks)
11. [Testing & Debugging](#testing--debugging)
12. [Important Notes](#important-notes)

---

## 🎯 Project Overview

**Basket v2** is a subscription-based grocery delivery marketplace built with React Native and Expo.

### Business Model
- Monthly subscription with weekly deliveries (every Friday)
- Single-screen marketplace design
- Tap to add products to basket
- Category-based product browsing

### Current State
- ✅ Product browsing with search and filtering
- ✅ Basket management with persistence
- ✅ User authentication (email + OAuth)
- ✅ Profile management
- ✅ Light/dark theme support
- 🔜 Checkout and subscription billing
- 🔜 Order management and delivery scheduling

---

## 🛠 Tech Stack

### Core Framework
- **React**: 19.1.0
- **React Native**: 0.81.5
- **Expo**: ~54.0.25 (with New Architecture enabled)
- **Node**: Compatible with latest LTS

### Backend & Authentication
- **Supabase**: 2.86.0
  - PostgreSQL database with RLS
  - Real-time subscriptions
  - Email + OAuth authentication (Google, Apple)
- **AsyncStorage**: Local storage for basket persistence

### UI & Interaction
- **@gorhom/bottom-sheet**: 4.6.4 (modal sheets)
- **react-native-gesture-handler**: 2.30.0
- **react-native-reanimated**: 4.2.1 (animations)
- **expo-haptics**: 15.0.8 (tactile feedback)
- **@hugeicons/react-native**: 1.0.9 (4,400+ icons)

### Typography & Assets
- **Custom Font**: FamiljenGrotesk (Regular, Medium, SemiBold, Bold + Italic variants)
- **SVG Support**: react-native-svg + transformer

---

## 📁 Directory Structure

```
Basket-v2/
├── App.js                          # Main app orchestrator (607 lines)
├── index.js                        # Expo root registration
├── package.json                    # Dependencies and scripts
├── app.json                        # Expo configuration
├── theme.js                        # Light/dark theme definitions
├── babel.config.js                 # Babel config (includes reanimated plugin)
├── metro.config.js                 # Metro bundler (SVG transformer)
│
├── lib/                            # Utility libraries
│   ├── supabase.js                # Supabase client initialization
│   ├── auth.js                    # Auth functions (157 lines)
│   └── icons.js                   # Icon component mappings
│
├── components/                     # React components
│   ├── Basket.js                  # Floating basket/control center (429 lines)
│   ├── ProductDetailsSheet.js     # Product details modal (226 lines)
│   ├── AuthSheet.js               # Sign in/up modal (383 lines)
│   └── Profile.js                 # User profile modal (287 lines)
│
├── assets/                        # Static assets
│   ├── fonts/                    # FamiljenGrotesk font files (8 variants)
│   ├── icons/                    # Custom icon assets
│   └── *.png                     # App icons and splash screens
│
└── Documentation/                 # Developer guides
    ├── README.md
    ├── SUPABASE_SETUP_INSTRUCTIONS.md
    ├── CUSTOM_ICONS_SETUP.md
    ├── INLINE_SVG_GUIDE.md
    └── supabase-setup.sql        # Database schema
```

---

## 🏗 Architecture & Patterns

### Application Architecture

**Single-Screen Design**
- No navigation library (no React Navigation/Expo Router)
- No tab bar or stack navigation
- All functionality on one screen (`App.js`)
- Modal navigation via bottom sheets

**Component Hierarchy**
```
App.js (Root)
├── SafeAreaView
│   ├── StatusBar
│   ├── Profile Button (top-right)
│   ├── ScrollView (main content)
│   │   ├── Section Header
│   │   └── Product Grid (2-column)
│   └── Basket Component (floating bottom)
├── ProductDetailsSheet (modal)
├── AuthSheet (modal)
└── Profile (modal)
```

### State Architecture

**Centralized State in App.js**
- All state managed via React Hooks (useState, useEffect, useRef)
- No Redux, Zustand, or Context API
- 27 state variables for data, UI, and auth
- Derived state calculated on-demand

**Data Flow**
1. Mount → Fetch categories & products from Supabase
2. Auth listener → Update user state
3. Basket changes → Auto-save to AsyncStorage
4. Pull-to-refresh → Refetch all data

### Styling Approach

**StyleSheet API** (not CSS-in-JS)
- Each component has `StyleSheet.create()` at bottom
- Theme values passed as props
- Dynamic color scheme via `useColorScheme()`
- No Tailwind, Styled Components, or NativeWind

---

## 📝 Code Conventions

### Naming Conventions

```javascript
// Variables and functions
const productCount = 10;
const handleProductPress = () => {};

// Components (PascalCase)
const ProductCard = () => {};

// Constants (UPPERCASE)
const BASKET_STORAGE_KEY = '@basket_products';
const CATEGORY_ICONS = { grocery: '🛒' };

// Files
App.js              // Components: PascalCase
auth.js             // Utilities: camelCase
ProductDetailsSheet.js  // Component files match component name
```

### File Organization Rules

1. **Component Structure**
   ```javascript
   // Imports
   import React, { useState } from 'react';
   import { View } from 'react-native';

   // Component
   const Component = ({ props }) => {
     const [state, setState] = useState();

     const handleAction = () => {
       // Event handlers
     };

     return <View>{/* JSX */}</View>;
   };

   // Styles at bottom
   const styles = StyleSheet.create({
     container: { /* ... */ },
   });

   export default Component;
   ```

2. **Import Order**
   - React imports first
   - React Native core imports
   - Third-party libraries
   - Local imports (components, lib, theme)

3. **StyleSheet Placement**
   - Always at the bottom of the file
   - After component definition
   - Before export statement

### Error Handling Pattern

```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    const { data, error } = await supabase.from('table').select('*');
    if (error) throw error;
    setState(data);
  } catch (error) {
    console.error('Error:', error.message);
    setState([]);  // Always provide fallback
  } finally {
    setLoading(false);
  }
};
```

**Key Principles:**
- ✅ Try-catch around all async operations
- ✅ Log errors to console with descriptive prefix
- ✅ Provide UI fallbacks (empty arrays, empty states)
- ✅ Use finally blocks to clean up loading states
- ✅ Haptic feedback for user-facing errors

### Haptic Feedback Convention

```javascript
import * as Haptics from 'expo-haptics';

// Light: Navigation, toggles, minor interactions
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium: Add to basket, button presses, major actions
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Heavy: Long press, drag start
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// Success: Successful form submission, authentication
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Error: Failed operations, validation errors
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

---

## 🔄 State Management

### State Variables in App.js

```javascript
// Data State
const [categories, setCategories] = useState([]);        // Categories from DB
const [products, setProducts] = useState([]);            // Products from DB
const [basketProducts, setBasketProducts] = useState([]);// Basket items
const [selectedProduct, setSelectedProduct] = useState(null);

// UI State
const [loading, setLoading] = useState(true);            // Initial load
const [refreshing, setRefreshing] = useState(false);     // Pull-to-refresh
const [activeTab, setActiveTab] = useState('home');      // Future navigation
const [activeCategory, setActiveCategory] = useState(null);
const [searchQuery, setSearchQuery] = useState('');

// Auth State
const [user, setUser] = useState(null);                  // Current user object

// Refs (no re-renders)
const bottomSheetRef = useRef(null);     // Product details sheet
const authSheetRef = useRef(null);       // Auth sheet
const profileSheetRef = useRef(null);    // Profile sheet
```

### Derived State Pattern

**DO NOT** store calculated values in state. Derive them on-demand:

```javascript
// ✅ GOOD: Derive on-demand
const filteredProducts = products.filter(product => {
  if (activeCategory && product.category_id !== activeCategory) return false;
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    return product.name.toLowerCase().includes(query) ||
           product.description.toLowerCase().includes(query);
  }
  return true;
});

const totalPrice = basketProducts.reduce((sum, item) =>
  sum + (item.price * item.quantity), 0
);

// ❌ BAD: Don't store derived state
const [filteredProducts, setFilteredProducts] = useState([]);
const [totalPrice, setTotalPrice] = useState(0);
```

### State Persistence

**Basket Persistence** (App.js:118-127)
```javascript
// Auto-save basket to AsyncStorage on every change
useEffect(() => {
  const saveBasket = async () => {
    try {
      await AsyncStorage.setItem(
        BASKET_STORAGE_KEY,
        JSON.stringify(basketProducts)
      );
    } catch (error) {
      console.error('Error saving basket:', error);
    }
  };
  saveBasket();
}, [basketProducts]);

// Load basket on mount
useEffect(() => {
  const loadBasket = async () => {
    const stored = await AsyncStorage.getItem(BASKET_STORAGE_KEY);
    if (stored) setBasketProducts(JSON.parse(stored));
  };
  loadBasket();
}, []);
```

**Auth Persistence** (App.js:92-105)
```javascript
// Listen to auth state changes
useEffect(() => {
  const { data: { subscription } } = onAuthStateChange(async (event, session) => {
    setUser(session?.user || null);

    if (event === 'SIGNED_IN') {
      console.log('User signed in:', session.user.email);
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
    }
  });

  return () => subscription?.unsubscribe();
}, []);
```

---

## 💾 Data & Database

### Database Schema

**Supabase Tables**

#### categories
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
name            TEXT NOT NULL
icon            TEXT (emoji character)
slug            TEXT UNIQUE NOT NULL
display_order   INTEGER DEFAULT 0
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
```

**Categories**: Grocery (🛒), Restaurants (🍴), Alcohol (🍷), Express (🚚), Retail (🏪)

#### products
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
name            TEXT NOT NULL
description     TEXT
price           DECIMAL(10,2) NOT NULL
quantity_label  TEXT (e.g., "x5", "Bunch of 5")
image_url       TEXT
category_id     UUID REFERENCES categories(id)
stock_quantity  INTEGER DEFAULT 0
is_available    BOOLEAN DEFAULT true
featured        BOOLEAN DEFAULT false
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
```

**Row Level Security (RLS)**: Enabled on both tables with public read access

### Data Fetching Patterns

**Fetching Data** (App.js:130-162)
```javascript
const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    setCategories(data || []);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    setCategories([]);
  }
};

const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setProducts(data || []);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    setProducts([]);
  }
};
```

**Filtering Strategy**
- Fetch all featured products once
- Apply filters client-side (search, category)
- No pagination currently implemented
- Pull-to-refresh refetches all data

### Authentication Functions

Location: `/lib/auth.js`

```javascript
// Email/Password
await signUp(email, password, fullName)
await signIn(email, password)
await signOut()

// OAuth
await signInWithGoogle()
await signInWithApple()

// Session
const user = await getCurrentUser()
const session = await getSession()
await updateProfile({ full_name: 'New Name' })

// Auth listener
const { data: { subscription } } = onAuthStateChange((event, session) => {
  // Handle SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED
});
```

---

## 🧩 Component Guide

### App.js (Main Orchestrator)

**Purpose**: Root component managing all app state and data flow

**Key Responsibilities:**
- Fetch and manage categories/products
- Handle authentication state
- Manage basket operations
- Control bottom sheet refs
- Apply theme based on color scheme

**Important Functions:**
```javascript
handleProductPress(product)        // Add product to basket
handleProductLongPress(product)    // Show product details sheet
handleBasketItemPress(item)        // Increase quantity
handleBasketItemLongPress(item)    // Remove or decrease quantity
handleRefresh()                    // Pull-to-refresh
handleProfilePress()               // Show auth or profile sheet
```

**Prop Passing:**
```javascript
<Basket
  products={basketProducts}
  theme={theme}
  onItemPress={handleBasketItemPress}
  onItemLongPress={handleBasketItemLongPress}
  // ... search, category, etc.
/>
```

---

### Basket.js (Floating Control Center)

**Location**: `/components/Basket.js` (429 lines)

**Features:**
- Collapsed mode: Horizontal scroll of basket items
- Expanded mode: Grid view with search and category filters
- Search bar with clear button
- Category filter chips
- Total price display
- Empty state messaging

**Props:**
```javascript
{
  products,              // Array of basket items
  theme,                 // Theme object (colors, text)
  onItemPress,          // Handle tap (increase qty)
  onItemLongPress,      // Handle long press (remove/decrease)
  searchQuery,          // Search string
  onSearchChange,       // Search callback
  activeCategory,       // Active category ID
  onCategoryChange,     // Category filter callback
  categories            // All categories
}
```

**Styling:**
- Position: Absolute, bottom: 14, left: 14, right: 14
- zIndex: 1000 (always on top)
- Height: 140px collapsed, dynamic when expanded
- Border radius: 20px

---

### ProductDetailsSheet.js

**Location**: `/components/ProductDetailsSheet.js` (226 lines)

**Purpose**: Modal bottom sheet for detailed product view

**Features:**
- Product image display
- Quantity controls (+ / -)
- Dynamic price calculation
- Stock information
- Add to basket with quantity
- Haptic feedback on interactions

**Usage:**
```javascript
const bottomSheetRef = useRef(null);

// Show sheet
bottomSheetRef.current?.snapToIndex(0);

// Component
<ProductDetailsSheet
  ref={bottomSheetRef}
  product={selectedProduct}
  theme={theme}
  onAddToBasket={(product, quantity) => {
    // Add product with quantity to basket
  }}
/>
```

**Snap Points**: ['75%'] - Takes up 75% of screen height

---

### AuthSheet.js

**Location**: `/components/AuthSheet.js` (383 lines)

**Purpose**: Authentication modal (sign in / sign up)

**Features:**
- Toggle between sign-in and sign-up modes
- Email/password validation
- Error message display
- OAuth buttons (Google, Apple)
- Loading states
- KeyboardAvoidingView for mobile keyboards

**Usage:**
```javascript
const authSheetRef = useRef(null);

<AuthSheet
  ref={authSheetRef}
  theme={theme}
  onAuthSuccess={(user) => {
    console.log('User authenticated:', user);
    authSheetRef.current?.close();
  }}
/>
```

**Form Validation:**
- Email: Must contain '@' and '.'
- Password: Minimum 6 characters
- Full name: Required for sign-up

---

### Profile.js

**Location**: `/components/Profile.js` (287 lines)

**Purpose**: User profile modal (requires authenticated user)

**Features:**
- Profile header with avatar placeholder
- Account statistics (orders, favorites)
- Menu items (placeholder for future features)
- Settings section
- Sign-out functionality

**Usage:**
```javascript
<Profile
  ref={profileSheetRef}
  user={user}
  theme={theme}
  onSignOut={async () => {
    await signOut();
    profileSheetRef.current?.close();
  }}
/>
```

**User Data:**
- `user.email` - Email address
- `user.user_metadata.full_name` - Display name
- `user.id` - User UUID

---

## 🔧 Development Workflows

### Running the App

```bash
# Install dependencies
npm install

# Start development server
npm start

# Or run on specific platform
npm run android    # Android emulator/device
npm run ios        # iOS simulator/device
npm run web        # Web browser
```

### Expo Development

1. Start server: `npm start`
2. Scan QR code with Expo Go app (physical device)
3. Or press 'a' for Android, 'i' for iOS emulator
4. Hot reload enabled - changes appear automatically

### Supabase Setup

See `SUPABASE_SETUP_INSTRUCTIONS.md` for full guide:

1. Get credentials from supabase.com
2. Update `/lib/supabase.js` with URL and anon key
3. Run `supabase-setup.sql` in Supabase SQL Editor
4. Verify tables exist: `categories` (5 rows), `products` (8 rows)

### Making Code Changes

**For New Features:**
1. ✅ Read relevant files first (App.js, component files)
2. ✅ Understand existing patterns before modifying
3. ✅ Follow established conventions (StyleSheet, naming, etc.)
4. ✅ Add haptic feedback for user interactions
5. ✅ Include loading states and error handling
6. ✅ Test on both light and dark themes
7. ✅ Avoid over-engineering - keep it simple

**For Bug Fixes:**
1. ✅ Identify the component/function causing the issue
2. ✅ Check console logs for error messages
3. ✅ Test in Expo Go to reproduce
4. ✅ Fix and verify the issue is resolved
5. ✅ Ensure no regressions in other features

### Git Workflow

```bash
# Current branch: claude/add-claude-documentation-VR5Ix
git status
git add .
git commit -m "Descriptive commit message"
git push -u origin claude/add-claude-documentation-VR5Ix
```

**Commit Message Conventions:**
- Use present tense: "Add feature" not "Added feature"
- Be descriptive: Explain what and why
- Examples:
  - "Add user authentication with Supabase"
  - "Fix basket total calculation rounding error"
  - "Refactor basket component for better performance"

---

## 🎯 Common Tasks

### Adding a New Product Feature

**Example: Add favorite/wishlist functionality**

1. **Add state in App.js**
   ```javascript
   const [favorites, setFavorites] = useState([]);
   ```

2. **Create database table in Supabase**
   ```sql
   CREATE TABLE favorites (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id),
     product_id UUID REFERENCES products(id),
     created_at TIMESTAMPTZ DEFAULT now()
   );
   ```

3. **Add favorite toggle function**
   ```javascript
   const toggleFavorite = async (productId) => {
     try {
       const isFavorite = favorites.some(f => f.product_id === productId);

       if (isFavorite) {
         // Remove from favorites
         await supabase.from('favorites')
           .delete()
           .eq('user_id', user.id)
           .eq('product_id', productId);
       } else {
         // Add to favorites
         await supabase.from('favorites')
           .insert({ user_id: user.id, product_id: productId });
       }

       // Refetch favorites
       fetchFavorites();

       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
     } catch (error) {
       console.error('Error toggling favorite:', error);
       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
     }
   };
   ```

4. **Add UI button to product card**
   ```javascript
   <TouchableOpacity onPress={() => toggleFavorite(product.id)}>
     <HeartIcon filled={isFavorite} />
   </TouchableOpacity>
   ```

---

### Adding a New Bottom Sheet Modal

**Example: Add order history sheet**

1. **Create component file**
   ```bash
   touch components/OrderHistory.js
   ```

2. **Component structure**
   ```javascript
   import React, { forwardRef } from 'react';
   import BottomSheet from '@gorhom/bottom-sheet';

   const OrderHistory = forwardRef(({ theme, orders }, ref) => {
     return (
       <BottomSheet
         ref={ref}
         index={-1}
         snapPoints={['85%']}
         enablePanDownToClose
       >
         {/* Content */}
       </BottomSheet>
     );
   });

   export default OrderHistory;
   ```

3. **Add ref in App.js**
   ```javascript
   const orderHistoryRef = useRef(null);
   ```

4. **Add to JSX**
   ```javascript
   <OrderHistory
     ref={orderHistoryRef}
     theme={theme}
     orders={userOrders}
   />
   ```

5. **Trigger from button**
   ```javascript
   <TouchableOpacity onPress={() => orderHistoryRef.current?.snapToIndex(0)}>
     <Text>View Orders</Text>
   </TouchableOpacity>
   ```

---

### Modifying Theme Colors

**Location**: `/theme.js`

```javascript
export const themes = {
  light: {
    background: '#fbf9f5',    // Main background
    text: '#000000',          // Primary text
    card: '#FDFDF7',          // Card background
    border: '#e5e5e5',        // Borders
    // Add new color
    accent: '#22c55e',        // Green accent
  },
  dark: {
    background: '#252623',
    text: '#ffffff',
    card: '#232323',
    border: '#404040',
    accent: '#22c55e',
  },
};
```

**Usage in components:**
```javascript
const Component = ({ theme }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>Hello</Text>
    </View>
  );
};
```

---

### Adding Search/Filter Logic

**Client-Side Filtering** (App.js pattern):

```javascript
// In App.js or component
const filteredData = data.filter(item => {
  // Multiple filter conditions
  let matches = true;

  // Search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    matches = matches && (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (activeCategory) {
    matches = matches && item.category_id === activeCategory;
  }

  // Status filter
  if (activeStatus) {
    matches = matches && item.status === activeStatus;
  }

  return matches;
});
```

---

## 🧪 Testing & Debugging

### No Automated Tests

**Current State:**
- ❌ No Jest, Vitest, or testing framework
- ❌ No unit tests or integration tests
- ✅ Manual testing via Expo Go

**For AI Assistants:**
- Always test changes manually in Expo Go
- Check both light and dark themes
- Test on iOS and Android if possible
- Verify error states and edge cases

### Debugging Approach

**Console Logging:**
```javascript
console.log('Data fetched:', data);
console.error('Error:', error.message);
console.warn('Warning: Missing data');
```

**Expo DevTools:**
- Open in browser when running `npm start`
- View console logs in terminal
- Use React DevTools for component inspection

**Common Issues:**

1. **"Cannot read property of undefined"**
   - Add null checks: `data?.property`
   - Provide default values: `data || []`

2. **"Network request failed"**
   - Check Supabase credentials in `/lib/supabase.js`
   - Verify internet connection
   - Check Supabase project is running

3. **Images not loading**
   - Verify `image_url` is publicly accessible
   - Test URL in browser first
   - Check CORS settings if using custom domain

4. **Bottom sheet not opening**
   - Verify ref is defined: `useRef(null)`
   - Check `snapToIndex(0)` is called correctly
   - Ensure component is rendered in JSX

---

## ⚠️ Important Notes

### What to AVOID

**❌ Don't Over-Engineer**
- No need for Redux/Zustand - hooks are sufficient
- Don't add TypeScript unless explicitly requested
- Don't create abstractions for one-time use
- Don't add testing libraries unless requested
- Keep solutions simple and focused

**❌ Don't Break Existing Patterns**
- Don't use inline styles when StyleSheet exists
- Don't add CSS-in-JS libraries
- Don't introduce new navigation libraries
- Don't change the single-screen architecture
- Don't remove haptic feedback

**❌ Don't Ignore Conventions**
- Always use camelCase/PascalCase appropriately
- Don't skip error handling
- Don't forget loading states
- Don't mix styling approaches
- Don't commit without testing

### What to ALWAYS DO

**✅ Before Making Changes**
- Read the relevant component files first
- Understand existing patterns
- Check for similar implementations
- Review error handling approach

**✅ When Writing Code**
- Follow StyleSheet pattern for styling
- Add haptic feedback for interactions
- Include try-catch for async operations
- Provide loading states
- Add console logs for debugging
- Test on both themes

**✅ When Creating Components**
- Use functional components with hooks
- Accept theme as prop
- Place StyleSheet at bottom
- Include prop types in comments if complex
- Add clear function names with handle* prefix

**✅ When Working with Data**
- Always provide fallback values
- Check for null/undefined
- Log errors with descriptive messages
- Use Supabase query patterns from existing code

---

## 📚 Additional Resources

### Documentation Files
- `README.md` - Project overview and features
- `SUPABASE_SETUP_INSTRUCTIONS.md` - Database setup guide
- `CUSTOM_ICONS_SETUP.md` - Icon usage guide
- `INLINE_SVG_GUIDE.md` - SVG implementation guide
- `supabase-setup.sql` - Database schema SQL

### External Documentation
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [@gorhom/bottom-sheet](https://gorhom.github.io/react-native-bottom-sheet/)
- [Hugeicons](https://hugeicons.com/)

### Key Files to Reference
- `App.js:130-162` - Data fetching pattern
- `App.js:194-212` - Basket operations
- `Basket.js:145-185` - Component toggle logic
- `lib/auth.js` - All authentication functions
- `theme.js` - Theme system

---

## 🎨 Design Principles

### User Experience
- **Immediate feedback** - Haptics confirm every action
- **No confirmation dialogs** - Trust user intent (tap to add)
- **Persistent basket** - Never lose items
- **Pull-to-refresh** - Simple data reload
- **Empty states** - Guide users when no data

### Code Quality
- **Readability over cleverness** - Clear code beats compact code
- **Consistency** - Follow established patterns
- **Error resilience** - Handle failures gracefully
- **Performance** - Derive state, avoid unnecessary re-renders
- **Simplicity** - No premature optimization

### Mobile-First
- **Touch targets** - Minimum 44x44 points for buttons
- **Safe areas** - Respect notches and system UI
- **Haptics** - Tactile feedback for engagement
- **Gestures** - Pan to close sheets, long-press for details
- **Responsive** - Works on all screen sizes

---

**Version**: 1.0.0
**Last Updated**: 2025-12-21
**Maintained By**: AI Assistants working with this codebase

---

## Quick Reference

```javascript
// State management
const [state, setState] = useState(initial);

// Supabase query
const { data, error } = await supabase.from('table').select('*');

// Haptic feedback
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Bottom sheet
bottomSheetRef.current?.snapToIndex(0);  // Open
bottomSheetRef.current?.close();         // Close

// Theme usage
<View style={[styles.container, { backgroundColor: theme.background }]}>

// Error handling
try { /* async */ } catch (error) { console.error('Error:', error); }
```

---

This document should be your primary reference when working with the Basket v2 codebase. Always refer to it before making significant changes.
