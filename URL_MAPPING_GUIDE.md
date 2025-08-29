# URL Mapping Guide - Local to Production

## Important: Keep URLs Identical
To ensure seamless deployment from local to production, ALL URLs must match exactly between:
- **Local:** http://localhost:3005
- **Production:** https://iliosauna.com

## Current URL Structure

### Public Pages
| Page | Local URL | Production URL | Status |
|------|-----------|----------------|--------|
| Home | http://localhost:3005/ | https://iliosauna.com/ | ✅ Active |
| Saunas | http://localhost:3005/saunas | https://iliosauna.com/saunas | ✅ Active |
| Our Story | http://localhost:3005/our-story | https://iliosauna.com/our-story | ✅ Active |
| Journal | http://localhost:3005/journal | https://iliosauna.com/journal | ✅ Active |
| Contact | http://localhost:3005/contact | https://iliosauna.com/contact | ✅ Active |
| Products | http://localhost:3005/products | https://iliosauna.com/products | ✅ Active |

### E-commerce Pages
| Page | Local URL | Production URL | Status |
|------|-----------|----------------|--------|
| Checkout | http://localhost:3005/checkout | https://iliosauna.com/checkout | ✅ Active |

### Authentication Pages (Clerk)
| Page | Local URL | Production URL | Status |
|------|-----------|----------------|--------|
| Sign In | http://localhost:3005/sign-in | https://iliosauna.com/sign-in | ✅ Active |
| Sign Up | http://localhost:3005/sign-up | https://iliosauna.com/sign-up | ✅ Active |

### Account/Dashboard Pages (Protected)
| Page | Local URL | Production URL | Status |
|------|-----------|----------------|--------|
| Account Dashboard | http://localhost:3005/account | https://iliosauna.com/account | ✅ Active |
| Orders | http://localhost:3005/account/orders | https://iliosauna.com/account/orders | ✅ Active |
| Order Details | http://localhost:3005/account/orders/[id] | https://iliosauna.com/account/orders/[id] | ✅ Active |
| Profile | http://localhost:3005/account/profile | https://iliosauna.com/account/profile | 🚧 Needs Implementation |
| Support | http://localhost:3005/account/support | https://iliosauna.com/account/support | 🚧 Needs Implementation |

### API Routes
| Endpoint | Local URL | Production URL | Status |
|----------|-----------|----------------|--------|
| Contact Form | http://localhost:3005/api/contact | https://iliosauna.com/api/contact | ✅ Active |
| GHL Integration | http://localhost:3005/api/ghl | https://iliosauna.com/api/ghl | ✅ Active |

## Pages to Develop

### Enhanced Dashboard Features
1. **Account Dashboard** (`/account`)
   - Add overview widgets
   - Recent orders summary
   - Quick actions panel
   - Profile completion status

2. **Profile Page** (`/account/profile`)
   - Personal information
   - Shipping addresses
   - Billing information
   - Communication preferences

3. **Support Page** (`/account/support`)
   - Contact support
   - FAQs
   - Order tracking
   - Documentation/Manuals

4. **Wishlist** (`/account/wishlist`)
   - Saved products
   - Price alerts
   - Share functionality

5. **Settings** (`/account/settings`)
   - Account settings
   - Security settings
   - Notification preferences

## Development Guidelines

### 1. URL Consistency Rules
- **Never** use different URLs between local and production
- **Always** use lowercase URLs with hyphens (kebab-case)
- **Avoid** query parameters for main navigation
- **Keep** URL structure shallow (max 3 levels deep)

### 2. File Structure Must Match URLs
```
src/app/
├── account/
│   ├── page.tsx (Dashboard)
│   ├── profile/
│   │   └── page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── support/
│   │   └── page.tsx
│   ├── wishlist/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
```

### 3. Testing URLs Before Deployment
1. Test all routes locally at http://localhost:3005
2. Verify no 404 errors
3. Check that protected routes redirect to sign-in
4. Ensure API routes return correct responses

### 4. Environment Variables
Ensure these match between local and production:
- `NEXT_PUBLIC_SITE_URL` (if used)
- All API endpoints
- External service URLs

## Deployment Checklist
- [ ] All URLs work locally exactly as they will in production
- [ ] No hardcoded localhost URLs in code
- [ ] Environment variables properly configured
- [ ] All new pages have proper SEO metadata
- [ ] Protected routes have authentication checks
- [ ] API routes have proper error handling
- [ ] Mobile responsiveness tested for all new pages

## Common Pitfalls to Avoid
1. **Don't hardcode URLs** - Use relative paths or environment variables
2. **Don't create test routes** - Use `/test` only in development, remove before deployment
3. **Don't change URL structure** - Once deployed, changing URLs breaks SEO and user bookmarks
4. **Don't forget middleware** - Ensure authentication middleware covers all protected routes

## Next Steps for Development
1. Implement `/account/profile` page
2. Implement `/account/support` page
3. Enhance `/account` dashboard with widgets
4. Add `/account/wishlist` functionality
5. Create `/account/settings` page