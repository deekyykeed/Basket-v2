# CLAUDE.md — AI Assistant Guide for Basket-v2

This file provides context and conventions for AI assistants (Claude, Copilot, etc.) working in this repository.

---

## Project Overview

**Basket-v2** is a React Native (Expo) e-commerce application — a subscription-based grocery/delivery marketplace. Users can browse products by category, add items to a basket, manage authentication, and eventually place orders with recurring delivery schedules.

- **Framework**: React Native 0.81.5 with Expo 54
- **Language**: JavaScript (ES6+, no TypeScript)
- **Backend**: Supabase (PostgreSQL + Auth + PostgREST)
- **Target Platforms**: iOS, Android, Web

---

## Repository Structure

```
Basket-v2/
├── App.js                      # Root application component — main state, layout, data fetching
├── index.js                    # Expo entry point (registers App)
├── theme.js                    # Light & dark theme color definitions
├── babel.config.js             # Babel config (expo preset + reanimated plugin)
├── metro.config.js             # Metro bundler (SVG transformer)
├── app.json                    # Expo app configuration
├── package.json                # Dependencies and npm scripts
├── supabase-setup.sql          # Database schema + sample data
│
├── components/
│   ├── Basket.js               # Floating basket/cart UI
│   ├── ProductCard.js          # Individual product tile
│   ├── ProductGrid.js          # FlatList grid of ProductCards
│   ├── ProductDetailsSheet.js  # Bottom sheet: product detail view
│   ├── SearchBar.js            # Search input + basket price display
│   ├── CategoryFilter.js       # Horizontal scroll category buttons
│   ├── AuthSheet.js            # Bottom sheet: sign-in / sign-up
│   ├── SimpleSheet.js          # Reusable bottom sheet wrapper
│   ├── Profile.js              # User profile view
│   └── CircularProgress.js     # Circular progress indicator
│
├── lib/
│   ├── supabase.js             # Supabase client initialization
│   ├── auth.js                 # Auth utility functions
│   └── icons.js                # Icon components + category icon mappings
│
└── assets/
    ├── fonts/                  # FamiljenGrotesk, Rubik, Fortnite.ttf
    ├── icons/                  # SVG icons organized by category
    │   ├── produce/
    │   ├── restaurants/
    │   ├── drinks/
    │   ├── snacks/
    │   ├── retail/
    │   ├── search/
    │   └── notifications/
    └── images/
```

---

## Development Commands

```bash
npm start           # Start Expo dev server (Expo Go / dev builds)
npm run android     # Launch on Android emulator or device
npm run ios         # Launch on iOS simulator or device
npm run web         # Launch web version in browser
```

There is no `npm test` — **no test framework is configured**. Do not attempt to run tests.

---

## Key Architecture Decisions

### State Management
- **All global state lives in `App.js`** (products, basket, auth user, loading states, active category, search query).
- State is passed down via props — no Redux, Zustand, or Context API is used.
- `AsyncStorage` persists the basket across sessions (`BASKET_STORAGE_KEY`).
- If state complexity grows, introduce React Context before reaching for an external library.

### Component Pattern
- All components are **functional components with hooks** (`useState`, `useEffect`, `useMemo`, `useRef`).
- Bottom sheets (ProductDetailsSheet, AuthSheet) use `forwardRef` so `App.js` can call `.open()` / `.close()` on them.
- Components are **mostly presentational** — logic lives in `App.js` or `lib/`.

### Navigation
- There is **no navigation library** (no React Navigation, Expo Router). The app is single-screen.
- Modals and overlays use `@gorhom/bottom-sheet`.

### Styling
- Use **React Native `StyleSheet.create()`** — no CSS-in-JS libraries.
- Colors come from `theme.js`. Always reference theme values rather than hardcoding hex codes.
- The primary color palette:
  - Light background: `#FBF9F5`
  - Dark background: `#252623`
  - Primary text (light): `#000000`
  - Primary text (dark): `#ffffff`
- Layout uses flexbox. Portrait orientation is locked.

### Icons
- Primary icon library: **Hugeicons** (`@hugeicons/react-native`, `@hugeicons/core-free-icons`).
- Category icons use custom SVGs stored in `assets/icons/<category>/`.
- SVG files are imported as React components via `react-native-svg-transformer`.
- Helper mappings live in `lib/icons.js`.

### Fonts
- **FamiljenGrotesk** — primary UI font (Regular, Medium, SemiBold, Bold).
- **Rubik** — secondary font.
- **Fortnite.ttf** — used for price display only.
- Fonts are loaded via `expo-font` in `App.js` before rendering.

---

## Database (Supabase)

### Tables

**`categories`**
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | VARCHAR(50) | e.g. "Grocery" |
| `icon` | VARCHAR(10) | Emoji fallback |
| `slug` | VARCHAR(50) | Unique identifier |
| `display_order` | INTEGER | Sort order |
| `is_active` | BOOLEAN | Visibility toggle |

**`products`**
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | VARCHAR(100) | Display name |
| `description` | TEXT | Product details |
| `price` | DECIMAL(10,2) | In local currency |
| `quantity_label` | VARCHAR(50) | e.g. "x5", "Bunch of 5" |
| `image_url` | TEXT | External image URL |
| `category_id` | UUID | FK → categories |
| `stock_quantity` | INTEGER | Inventory count |
| `is_available` | BOOLEAN | In-stock flag |
| `featured` | BOOLEAN | Shows in "Fresh Finds" |

Row Level Security (RLS) is enabled on both tables with **public read-only** access. Write operations require authentication.

### Supabase Client
The client is initialized in `lib/supabase.js`. Credentials are currently hardcoded — do not commit new hardcoded secrets. If refactoring, use `expo-constants` or a `.env` file with `babel-plugin-transform-inline-environment-variables`.

---

## Authentication

Auth is handled through Supabase Auth (`lib/auth.js`):
- Email/password sign-up and sign-in
- Google OAuth
- Apple OAuth
- Session persistence via `AsyncStorage`

Auth state changes are observed with `supabase.auth.onAuthStateChange()` in `App.js`.

The `AuthSheet` component is a bottom sheet form that handles both sign-in and sign-up flows.

---

## Code Conventions

### Naming
| Entity | Convention | Example |
|---|---|---|
| Components | PascalCase | `ProductCard`, `AuthSheet` |
| Functions / variables | camelCase | `addToBasket`, `fetchProducts` |
| Constants | SCREAMING_SNAKE_CASE | `BASKET_STORAGE_KEY` |
| Files | PascalCase (components), camelCase (utils) | `ProductCard.js`, `auth.js` |

### Import Order
```js
// 1. React / React Native
import React, { useState } from 'react';
import { View, Text } from 'react-native';

// 2. Third-party libraries
import { BottomSheetModal } from '@gorhom/bottom-sheet';

// 3. Local components
import ProductCard from './components/ProductCard';

// 4. Local utilities / lib
import { supabase } from './lib/supabase';
```

### Async / Error Handling
- Use `try/catch` for all async operations.
- Log errors with `console.error()`.
- Show user-facing error messages in the UI where appropriate.
- Do not swallow errors silently.

### Performance
- Use `useMemo` for derived data (e.g. filtered products list).
- Use `useRef` for non-state values and imperative handles.
- Prefer `FlatList` over `ScrollView` for dynamic lists.

---

## What NOT to Do

- **Do not add TypeScript** — this is a JavaScript project. Do not rename files to `.ts`/`.tsx` or add type annotations.
- **Do not install a navigation library** without discussion — the single-screen architecture is intentional for now.
- **Do not add a global state library** (Redux, Zustand, Jotai) without discussion — use React Context first.
- **Do not hardcode colors** — always use values from `theme.js`.
- **Do not commit Supabase credentials or secrets** — they already exist in the file; don't add new ones.
- **Do not create test files** — there is no test runner configured. If tests are needed, set up Jest + React Native Testing Library first.
- **Do not change the portrait lock** in `app.json` without explicit instruction.
- **Do not use CSS-in-JS** (styled-components, emotion, etc.) — use `StyleSheet.create()`.

---

## Common Tasks

### Adding a New Component
1. Create `components/MyComponent.js` as a functional component.
2. Use `StyleSheet.create()` for styles at the bottom of the file.
3. Reference colors from `theme.js`.
4. Import and wire it up in `App.js` or the appropriate parent.

### Adding a New Category Icon
1. Place SVG files in `assets/icons/<category>/` (active and inactive variants).
2. Import them in `lib/icons.js`.
3. Add the mapping to the icon lookup object.
4. See `CUSTOM_ICONS_SETUP.md` for details.

### Adding a Database Column
1. Write the `ALTER TABLE` SQL and test it in the Supabase dashboard.
2. Update `supabase-setup.sql` to reflect the new schema.
3. Update any relevant query in `App.js` or `lib/`.

### Modifying the Basket
- Basket state: `basket` (array of `{ product, quantity }`) in `App.js`.
- Key functions: `addToBasket`, `removeFromBasket`, `updateQuantity`, `clearBasket`.
- Basket is persisted to `AsyncStorage` on every change.

---

## External Documentation

- [Expo Docs](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Gorhom Bottom Sheet](https://gorhom.dev/react-native-bottom-sheet/)
- [Hugeicons React Native](https://www.npmjs.com/package/@hugeicons/react-native)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

## Git Workflow

- Main production branch: `main` / `master`
- Feature branches: `claude/<description>-<id>` (for AI-assisted changes)
- Commits are GPG-signed with an SSH key.
- Write descriptive commit messages that explain *why*, not just *what*.
