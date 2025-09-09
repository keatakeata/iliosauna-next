// Account Dashboard Configuration
// Prevents API overload by limiting component complexity

export const ACCOUNT_CONFIG = {
  // Limit icon imports to essential ones only
  MAX_ICON_IMPORTS: 15,
  
  // Disable animations that cause re-renders
  ENABLE_ANIMATIONS: false,
  
  // Limit data fetching
  MAX_ORDERS_DISPLAY: 3,
  
  // Use simplified components
  USE_MINIMAL_MODE: true,
  
  // Theme configuration for tweakcn compatibility
  THEME: {
    light: {
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(224 71.4% 4.1%)',
      card: 'hsl(0 0% 100%)',
      cardForeground: 'hsl(224 71.4% 4.1%)',
      primary: 'hsl(220.9 39.3% 11%)',
      primaryForeground: 'hsl(210 20% 98%)',
      secondary: 'hsl(220 14.3% 95.9%)',
      secondaryForeground: 'hsl(220.9 39.3% 11%)',
      muted: 'hsl(220 14.3% 95.9%)',
      mutedForeground: 'hsl(220 8.9% 46.1%)',
      border: 'hsl(220 13% 91%)',
      input: 'hsl(220 13% 91%)',
      ring: 'hsl(224 71.4% 4.1%)',
    },
    dark: {
      background: 'hsl(224 71.4% 4.1%)',
      foreground: 'hsl(210 20% 98%)',
      card: 'hsl(224 71.4% 4.1%)',
      cardForeground: 'hsl(210 20% 98%)',
      primary: 'hsl(210 20% 98%)',
      primaryForeground: 'hsl(220.9 39.3% 11%)',
      secondary: 'hsl(215 27.9% 16.9%)',
      secondaryForeground: 'hsl(210 20% 98%)',
      muted: 'hsl(215 27.9% 16.9%)',
      mutedForeground: 'hsl(217.9 10.6% 64.9%)',
      border: 'hsl(215 27.9% 16.9%)',
      input: 'hsl(215 27.9% 16.9%)',
      ring: 'hsl(216 12.2% 83.9%)',
    }
  }
};