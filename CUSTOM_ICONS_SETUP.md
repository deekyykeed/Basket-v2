# 🎨 Custom Icons Setup Guide

Your app is now configured to use custom PNG icons instead of emojis!

## ✅ What's Been Set Up

1. **Icon folder created**: `/assets/icons/`
2. **Icon loader configured**: Safely loads icons with emoji fallbacks
3. **App.js updated**: Uses custom icons for categories and header
4. **react-native-svg installed**: For future SVG support

## 📋 Required Icon Files

Add these 7 PNG files to the `/assets/icons/` folder:

### Category Icons (24x24px recommended)
```
assets/icons/grocery.png       - Shopping cart icon
assets/icons/restaurant.png    - Fork/knife or restaurant icon
assets/icons/alcohol.png        - Wine glass icon
assets/icons/express.png        - Truck/delivery icon
assets/icons/retail.png         - Store/shop icon
```

### Header Icons (20x20px recommended)
```
assets/icons/profile.png        - User/profile icon
assets/icons/orders.png         - Clipboard/orders icon
```

## 🎯 Quick Start

### Option 1: Use Free Icon Libraries

Download icons from these free resources:

1. **[Feather Icons](https://feathericons.com/)** (Recommended)
   - Clean, simple line icons
   - Download as PNG or SVG
   - Suggested icons:
     - `shopping-cart` → grocery.png
     - `coffee` → restaurant.png
     - `wine` → alcohol.png
     - `truck` → express.png
     - `shopping-bag` → retail.png
     - `user` → profile.png
     - `clipboard` → orders.png

2. **[Heroicons](https://heroicons.com/)**
   - Beautiful outline and solid variants
   - MIT license (free to use)

3. **[Phosphor Icons](https://phosphoricons.com/)**
   - Flexible icon family with 6 weights

### Option 2: Export from Design Tools

If you're using Figma, Sketch, or Adobe XD:

1. Design or find your icons
2. Export each icon as PNG:
   - Size: 24x24px (categories) or 20x20px (header)
   - Resolution: @2x or @3x for retina displays
   - Color: Black (#000000) on transparent background
   - Format: PNG with transparency
3. Rename to match required names
4. Place in `/assets/icons/`

## 📦 Installation Steps

### Step 1: Download/Create Icons
Get your 7 icon files ready (see resources above)

### Step 2: Add to Project
```bash
# On your computer, navigate to project folder
cd "C:\Users\Khadzika\OneDrive\Desktop\Basket v2"

# Place your icon files in assets/icons/
# Copy:
#   grocery.png
#   restaurant.png
#   alcohol.png
#   express.png
#   retail.png
#   profile.png
#   orders.png
```

### Step 3: Verify File Names
Ensure exact names (lowercase, no spaces):
- ✅ `grocery.png`
- ❌ `Grocery.png`
- ❌ `shopping-cart.png`

### Step 4: Restart App
```bash
# Stop the current server (Ctrl+C)
# Clear cache and restart
npx expo start -c
```

## 🎨 Icon Specifications

### Size Guidelines
- **Category icons**: 24x24px to 48x48px
- **Header icons**: 20x20px to 40x40px
- **For retina displays**: Use 48x48px (@2x) or 72x72px (@3x)

### Design Guidelines
- **Color**: Black (#000000) or dark gray (#1a1a1a)
- **Background**: Transparent (no background)
- **Style**: Line icons or simple filled shapes
- **Stroke**: 1.5-2px stroke width for line icons
- **Padding**: Leave 10-15% padding around icon

### Example Export Settings (Figma)
1. Select icon frame
2. Export settings:
   - Format: PNG
   - Size: 2x (for 48x48px from 24x24px frame)
   - Include in export: ✓
3. Download and rename

## 🔄 Current Behavior

**Right now (without custom icons):**
- App shows emoji fallbacks (🛒, 🍴, 🍷, etc.)
- Everything works normally

**After adding custom icons:**
- App automatically uses your PNG icons
- Styled with proper containers and spacing
- Consistent look across the app

## 🛠️ Advanced: Using SVG Icons

If you prefer SVG format:

### Step 1: Add SVG Files
Save SVG files with same names (e.g., `grocery.svg`)

### Step 2: Update Icon Loader
Edit `/lib/icons.js`:
```javascript
// Change .png to .svg
'🛒': loadIcon('../assets/icons/grocery.svg'),
```

### Step 3: Use SVG Component
Update `App.js` to use `react-native-svg` components instead of `Image`

## 🐛 Troubleshooting

### Icons not appearing
**Problem**: Still seeing emojis after adding PNG files

**Solutions**:
1. Check file names match exactly (case-sensitive)
2. Ensure files are in `/assets/icons/` folder
3. Clear Metro cache: `npx expo start -c`
4. Restart development server

### Icons are blurry
**Problem**: Icons look pixelated or blurry

**Solutions**:
1. Use higher resolution (@2x or @3x)
2. Export at 48x48px instead of 24x24px
3. Use vector formats (SVG) for perfect scaling

### App crashes after adding icons
**Problem**: App shows error when loading icons

**Solutions**:
1. Verify all 7 icon files exist
2. Check file format is PNG (not JPG or other)
3. Ensure transparent background (not white)
4. Try with just one icon first to isolate issue

### Icons have wrong color
**Problem**: Icons don't match app theme

**Solutions**:
1. Use black icons on transparent background
2. App will handle theming automatically
3. Avoid using colored icons

## 📱 Testing Checklist

After adding icons, verify:
- [ ] All 5 category icons display correctly
- [ ] Both header icons (profile & orders) display correctly
- [ ] Icons have proper spacing and sizing
- [ ] Icons look good in both light and dark mode
- [ ] Icons load quickly without flickering
- [ ] No console errors in terminal

## 🎓 Next Steps

Once icons are working:
1. ✅ Complete Supabase setup (add credentials)
2. ✅ Test data fetching from database
3. ✅ Customize colors and styling
4. 🚀 Add more features!

## 📞 Need Help?

If you're stuck:
1. Check the `/assets/icons/README.md` file
2. Verify icon files are in correct folder
3. Review console for error messages
4. Share error message for troubleshooting

---

**Current Status**: Icon infrastructure ready. Add your 7 PNG files to start using custom icons!
