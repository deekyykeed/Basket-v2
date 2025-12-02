# Custom Icons for Basket.W

This folder contains all the custom icons used in the Basket app.

## Required Icon Files

Please add the following PNG icon files to this folder:

### Category Icons (24x24px recommended)
- **grocery.png** - Shopping cart/basket icon for Grocery category
- **restaurant.png** - Fork & knife or restaurant icon for Restaurants category
- **alcohol.png** - Wine glass or bottle icon for Alcohol category
- **express.png** - Truck or delivery icon for Express category
- **retail.png** - Store or shop icon for Retail category

### Header Icons (20x20px recommended)
- **profile.png** - User profile or person icon
- **orders.png** - Clipboard, list, or orders icon

## Icon Specifications

### Format
- **File Type**: PNG (with transparency)
- **Alternative**: SVG files (requires additional setup)

### Size Guidelines
- **Category Icons**: 24x24px to 48x48px
- **Header Icons**: 20x20px to 40x40px
- **Resolution**: 2x or 3x for better display on high-DPI screens

### Design Guidelines
- **Style**: Line icons or simple filled icons work best
- **Color**: Black or dark gray (#000000 or #1a1a1a)
  - The app will handle color theming
- **Background**: Transparent
- **Padding**: Include small padding around the icon (10-15% of canvas)

## Naming Convention

Keep the exact names as listed above:
- ✅ `grocery.png`
- ✅ `restaurant.png`
- ✅ `alcohol.png`
- ✅ `express.png`
- ✅ `retail.png`
- ✅ `profile.png`
- ✅ `orders.png`

❌ Do not use:
- Different names (e.g., `shopping-cart.png`)
- Spaces in names
- Capital letters

## Free Icon Resources

If you need free icons, check out:
- [Feather Icons](https://feathericons.com/) - Simple, beautiful icons
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- [Phosphor Icons](https://phosphoricons.com/) - Flexible icon family
- [Iconoir](https://iconoir.com/) - Simple and definitive icon set
- [Lucide](https://lucide.dev/) - Beautiful & consistent icons

## How to Add Icons

1. Download or create your icon files
2. Ensure they match the naming convention above
3. Place them in this folder (`assets/icons/`)
4. Restart your Expo development server
5. The icons will automatically appear in the app

## Current Status

Currently using emoji placeholders. Replace with actual icon files for production.

## Using SVG Icons (Optional)

If you prefer SVG icons:

1. Save SVG files with the same names (e.g., `grocery.svg`)
2. Update the `ICON_MAP` in `App.js` to use `.svg` extension
3. Replace `<Image>` components with `<SvgUri>` or inline SVG components
4. See react-native-svg documentation for more details

## Troubleshooting

### Icons not showing
- Check file names match exactly (case-sensitive)
- Ensure files are PNG format
- Restart Metro bundler (stop and run `npm start` again)
- Clear cache: `npx expo start -c`

### Icons appear blurry
- Use higher resolution images (@2x or @3x)
- Export at 48x48px or 72x72px for category icons
- Export at 40x40px or 60x60px for header icons

### Wrong icon colors
- Ensure icons are black/dark gray on transparent background
- Avoid using colored icons (the app uses theme colors)
