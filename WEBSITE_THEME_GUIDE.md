# Ilio Sauna Website - Theme & Styling Guide

## Brand Identity
**Luxury Finnish-inspired sauna wellness brand with minimalist, premium aesthetic**

## Color Palette

### Primary Colors
- **Primary Orange**: `#BF5813` - Main brand color for CTAs and accents
- **Primary Hover**: `#A04810` - Darker variant for hover states
- **Dark Brown**: `#1D140B` - Footer and dark sections
- **Light Cream**: `#F8F4EB` - Soft backgrounds
- **Warm Gray**: `#8B7D6B` - Text and subtle elements
- **Soft White**: `#FAF8F5` - Near-white backgrounds
- **Accent Cedar**: `#8B5A3C` - Wood-inspired accent color

### Supporting Colors
- **Text Dark**: `#111827` - Headlines and primary text
- **Text Gray**: `#6B7280` - Body text
- **Light Gray**: `#D1D5DB` - Borders and dividers
- **Background Light**: `#F9FAFB` - Section backgrounds

## Typography

### Font Families
- **Primary**: `'Segoe UI', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif`
- **Accent**: `'Cardo', serif` (for special elements)

### Font Characteristics
- **Ultra-light weight (100-300)** for headlines - Creates elegant, premium feel
- **Wide letter spacing (0.05em - 0.2em)** - Adds breathing room
- **Large font sizes** for impact:
  - H1: `clamp(2rem, 5vw, 3.5rem)`
  - H2: `56px` desktop, responsive scaling
  - H3: `clamp(1.25rem, 3vw, 1.5rem)`

## Design Principles

### 1. **Minimalism & Space**
- Generous padding and margins
- Clean layouts with ample white space
- Section padding: 80px desktop / 60px tablet / 40px mobile

### 2. **Subtle Animations**
- Smooth transitions: `cubic-bezier(0.4, 0, 0.2, 1)`
- Fade-in effects with translateY
- Hover states with gentle transforms
- No jarring or fast animations

### 3. **Premium Feel**
- Soft shadows: `0 4px 20px rgba(0,0,0,0.1)`
- Rounded corners: `4px` to `12px`
- Subtle hover effects with elevation
- Glass morphism on navbar scroll

### 4. **Photography Style**
- High-quality sauna and wellness imagery
- Warm, inviting tones
- Natural lighting emphasis
- Fixed background attachments for parallax

## Component Styling Patterns

### Buttons
```css
- Primary: Orange background, white text, subtle shadow on hover
- Secondary: Transparent with border, inverts on hover
- Rounded corners: 4px
- Padding: 0.75rem 2rem
- Letter spacing: 0.05em
```

### Cards
```css
- White background
- Soft shadows: 0 2px 10px rgba(0,0,0,0.08)
- Hover: translateY(-4px) with increased shadow
- Border radius: 8-12px
```

### Navigation
```css
- Transparent initially
- Glass morphism on scroll
- Fixed position with 70px height
- Smooth backdrop-filter transitions
```

## Aceternity UI Integration Guidelines

When adding Aceternity components, ensure:

1. **Color Adaptation**
   - Replace default colors with brand palette
   - Use `#BF5813` for primary actions
   - Use `#8B7D6B` for subtle elements

2. **Animation Speed**
   - Slow down animations to match site's calm pace
   - Use `ease-out` timing functions
   - Increase duration for smoother feel

3. **Typography Matching**
   - Apply ultra-light font weights
   - Add letter-spacing to match brand
   - Use clamp() for responsive sizing

4. **Shadow & Depth**
   - Keep shadows subtle and soft
   - Use warm shadow tones (brown-tinted)
   - Maintain consistent elevation system

5. **Spacing Consistency**
   - Follow established spacing variables
   - Maintain generous padding
   - Respect section spacing patterns

## Example Aceternity Component Adaptation

```tsx
// Before (Aceternity default)
<Card className="bg-black text-white">

// After (Ilio themed)
<Card className="bg-white text-gray-600 shadow-[0_4px_20px_rgba(191,88,19,0.1)]">
```

## Mobile Responsiveness
- Touch-friendly tap targets (min 44px)
- Simplified animations on mobile
- Adjusted typography scales
- Single column layouts below 768px