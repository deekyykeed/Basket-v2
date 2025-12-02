# 📁 How to Add Your SVG Icon Files

Your app is now configured to load SVG files from the `/assets/icons/` folder!

## ✅ What's Ready

- ✅ Metro bundler configured for SVG files
- ✅ Icon loader set up with safe fallbacks
- ✅ App will show emojis until you add SVG files
- ✅ No crashes if files are missing

## 📂 File Location

Add your SVG files to this folder:
```
assets/icons/
```

## 📋 Required Files (Exact Names)

Upload these 7 SVG files with **exact names** (lowercase, no spaces):

### Category Icons (24x24 viewBox)
1. `grocery.svg` - Shopping cart/basket icon
2. `restaurant.svg` - Fork/knife or restaurant icon
3. `alcohol.svg` - Wine glass icon
4. `express.svg` - Truck/delivery icon
5. `retail.svg` - Store/shop icon

### Header Icons (20x20 viewBox)
6. `profile.svg` - User/profile icon
7. `orders.svg` - Clipboard/orders icon

## 🚀 How to Upload

### On Windows (Your Local Machine):

1. **Navigate to the icons folder:**
   ```
   C:\Users\Khadzika\OneDrive\Desktop\Basket v2\assets\icons\
   ```

2. **Copy your 7 SVG files to this folder**
   - Make sure file names are exact (lowercase)
   - `grocery.svg`, `restaurant.svg`, `alcohol.svg`, etc.

3. **Restart the development server with cache clear:**
   ```bash
   # Stop the current server (Ctrl+C)
   npx expo start -c
   ```

4. **Done!** Your icons will automatically appear in the app

## ✏️ Renaming Files

If your SVG files have different names, rename them:

**Before:**
```
shopping-cart.svg
fork-knife.svg
wine-glass.svg
truck.svg
store.svg
user.svg
clipboard.svg
```

**After (Required names):**
```
grocery.svg
restaurant.svg
alcohol.svg
express.svg
retail.svg
profile.svg
orders.svg
```

## 🎨 SVG File Requirements

### File Format
- Must be `.svg` extension
- Valid SVG format

### Recommended Structure
```xml
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="..." stroke="#000000" stroke-width="2"/>
</svg>
```

### Best Practices
- **viewBox**: Use `viewBox` instead of fixed width/height
- **Color**: Black (#000000) or `currentColor` for theming
- **Clean SVG**: Remove IDs, descriptions, titles, metadata
- **Stroke Width**: 1.5-2px works well
- **Simple**: Fewer paths = better performance

### Cleaning Your SVG (Optional)

If your SVG has extra metadata, you can clean it:

1. Open SVG in text editor
2. Remove these if present:
   - `<desc>` tags
   - `<title>` tags
   - `id="..."` attributes
   - `<metadata>` tags
   - Comments `<!-- ... -->`
3. Keep only the `<svg>` tag and path/shape elements

**Example - Before:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Shopping-Bag" height="24" width="24">
  <desc>Shopping Bag Icon</desc>
  <title>Shopping Bag</title>
  <path d="..." stroke-width="2"></path>
</svg>
```

**Example - After (Cleaned):**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <path d="..." stroke-width="2"/>
</svg>
```

## 🔄 How It Works

1. You place SVG files in `/assets/icons/`
2. `metro.config.js` converts SVG files to React components
3. `lib/icons.js` loads the SVG components
4. `App.js` renders them in the UI
5. If file is missing, emoji fallback shows

## ✅ Verification Checklist

After adding files, check:

- [ ] 7 SVG files in `/assets/icons/` folder
- [ ] File names are exact (lowercase, .svg extension)
- [ ] Files are valid SVG format
- [ ] Restarted dev server with cache clear (`npx expo start -c`)
- [ ] Icons appear in app (not emojis)

## 🐛 Troubleshooting

### Still seeing emojis?
1. Check file names are **exactly** as listed above
2. Ensure files are in `/assets/icons/` folder (not a subfolder)
3. Clear cache: `npx expo start -c`
4. Check Metro bundler output for errors

### Metro bundler errors?
1. Verify `metro.config.js` exists in project root
2. Check `react-native-svg-transformer` is installed: `npm list react-native-svg-transformer`
3. Try reinstalling: `npm install react-native-svg-transformer`
4. Restart with clean cache: `npx expo start -c`

### Icons look wrong?
1. Check SVG viewBox (should be `0 0 24 24` for categories, `0 0 20 20` for header)
2. Remove fixed width/height from `<svg>` tag
3. Use `stroke="#000000"` or `stroke="currentColor"`
4. Simplify SVG (combine paths, remove groups)

### One icon not showing?
1. Check that specific file name
2. Open the SVG file and verify it's valid SVG
3. Try re-saving the file
4. Check file permissions (should be readable)

## 📱 Testing

After adding icons:
1. Launch app: `npx expo start`
2. Press `i` for iOS or `a` for Android
3. Check all 5 category icons display
4. Check both header icons display
5. Icons should have proper sizing and spacing

## 🎓 Next Steps

Once icons are working:
1. ✅ Add Supabase credentials to `/lib/supabase.js`
2. ✅ Run SQL setup script in Supabase dashboard
3. ✅ Test data fetching from database
4. 🚀 Your app is ready!

---

**Current Status:** Waiting for your 7 SVG files in `/assets/icons/` folder!

**File Checklist:**
- [ ] grocery.svg
- [ ] restaurant.svg
- [ ] alcohol.svg
- [ ] express.svg
- [ ] retail.svg
- [ ] profile.svg
- [ ] orders.svg
