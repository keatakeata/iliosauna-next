# API Error 500/413 Fix Documentation

## Problem
The account dashboard page was causing two critical API errors:
1. **Error 500**: Overloaded - Too many requests/complexity
2. **Error 413**: Request size exceeds model context window

## Root Causes Identified

### 1. Excessive Icon Imports
- **Before**: 46 icon imports from lucide-react
- **After**: Reduced to 15 essential icons only
- **Impact**: Reduced bundle size and parsing complexity

### 2. Emoji Usage
- **Before**: Using emojis (🏔️, 🌲, 🌿) for product images
- **After**: Replaced with proper Lucide icons (Package, Home, Sparkles)
- **Policy**: No emojis anywhere in the codebase

### 3. CSS Variable Conflicts
- **Before**: Global CSS variables conflicting with shadcn variables
- **After**: Created isolated `account-theme.css` with scoped variables
- **Solution**: Using `.account-container` wrapper for isolation

### 4. Missing Tailwind Configuration
- **Before**: No tailwind.config.ts file (using Tailwind v4)
- **After**: Created proper configuration with theme extensions
- **Impact**: Proper CSS generation and reduced runtime processing

## Files Changed

1. **src/app/account/page.tsx**
   - Reduced icon imports from 46 to 15
   - Removed all emoji usage
   - Added `.account-container` wrapper
   - Simplified component structure

2. **src/app/account/account-theme.css** (NEW)
   - Isolated CSS variables for account section
   - Light/dark mode support
   - Luxury-focused animations

3. **tailwind.config.ts** (NEW)
   - Proper Tailwind v4 configuration
   - Theme extensions for shadcn
   - Dark mode configuration

4. **src/components/ThemeProvider.tsx** (NEW)
   - Theme state management
   - System/light/dark mode support
   - localStorage persistence

5. **src/app/account/config.ts** (NEW)
   - Configuration limits to prevent overload
   - Theme settings for tweakcn compatibility

## Prevention Guidelines

### DO's
- ✅ Limit icon imports to < 20 per component
- ✅ Use isolated CSS scoping for complex pages
- ✅ Keep component complexity minimal
- ✅ Use proper icons from Lucide React
- ✅ Test with `npm run dev` after major changes

### DON'Ts
- ❌ Never use emojis in code
- ❌ Avoid importing entire icon libraries
- ❌ Don't mix global and local CSS variables
- ❌ Avoid deeply nested component structures
- ❌ Don't create components > 500 lines

## Testing
After changes:
1. Run `npm run dev`
2. Navigate to http://localhost:3006/account
3. Check console for errors
4. Verify all icons render correctly
5. Test light/dark mode toggle

## Luxury Design Principles
- Minimal, sophisticated icons only
- Muted color palettes (grays, subtle accents)
- Clean typography with proper spacing
- No decorative emojis or playful elements
- Professional, high-end aesthetic

## Tweakcn Editor Compatibility
The account dashboard now supports the tweakcn theme editor at:
https://tweakcn.com/editor/theme

Variables are properly scoped and can be customized without affecting global styles.