const fs = require('fs');
const path = require('path');

// Simple redirect component for disabled pages
const redirectComponent = `import { redirect } from 'next/navigation';

// Temporarily redirect to home when Clerk/E-commerce is disabled
// Original page saved with .disabled.tsx extension
export default function Page() {
  const clerkEnabled = process.env.NEXT_PUBLIC_CLERK_ENABLED === 'true';
  
  if (!clerkEnabled) {
    redirect('/');
  }
  
  return null;
}
`;

// List of account pages to disable
const accountPages = [
  'src/app/account/orders/page.tsx',
  'src/app/account/orders/[id]/page.tsx',
  'src/app/account/profile/page.tsx',
  'src/app/account/wishlist/page.tsx',
  'src/app/account/settings/page.tsx',
  'src/app/account/preparation/page.tsx',
  'src/app/account/concierge/page.tsx',
  'src/app/account/order-details/page.tsx',
  'src/app/account/page.tsx',
  'src/app/account/journey/page.tsx',
  'src/app/account/resources/page.tsx',
  'src/app/account/support/page.tsx'
];

console.log('Disabling account pages for build...\n');

accountPages.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  const disabledPath = fullPath.replace('.tsx', '.disabled.tsx');
  
  if (fs.existsSync(fullPath)) {
    try {
      // Read original content
      const originalContent = fs.readFileSync(fullPath, 'utf8');
      
      // Only process if it uses Clerk
      if (originalContent.includes('@clerk/nextjs') || originalContent.includes('useUser')) {
        // Save original as .disabled.tsx
        if (!fs.existsSync(disabledPath)) {
          fs.writeFileSync(disabledPath, originalContent);
          console.log(`✓ Backed up: ${filePath} -> ${filePath.replace('.tsx', '.disabled.tsx')}`);
        }
        
        // Replace with redirect component
        fs.writeFileSync(fullPath, redirectComponent);
        console.log(`✓ Disabled: ${filePath}`);
      }
    } catch (error) {
      console.error(`✗ Error processing ${filePath}:`, error.message);
    }
  }
});

console.log('\n✅ Account pages disabled. Build should now work.');
console.log('To re-enable: Run enable-account-pages.js when ready for e-commerce.');