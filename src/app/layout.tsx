import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";

// Force dynamic rendering globally to prevent DataCloneError
export const dynamic = 'force-dynamic';
import { ClerkProviderWrapper } from "@/components/ClerkProviderWrapper";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { Analytics } from "@vercel/analytics/next";
import { SupabaseProvider } from "@/components/SupabaseProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Ilio Sauna - Premium Cedar Saunas | Vancouver Island & BC",
  description: "Experience luxury outdoor saunas crafted with BC cedar. Transform your backyard into a wellness retreat with our premium cedar barrel and cabin saunas.",
  keywords: "cedar sauna, outdoor sauna, barrel sauna, cabin sauna, Vancouver Island, BC, wellness, luxury sauna",
  icons: {
    icon: "/ilio-logo-light.svg",
    shortcut: "/ilio-logo-light.svg",
    apple: "/ilio-logo-light.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-FHGM890ENW"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-FHGM890ENW');
        `}
      </Script>
      <body className="font-sans antialiased" suppressHydrationWarning={true}>
        <ErrorBoundary>
          <ClerkProviderWrapper>
            <SupabaseProvider>
              <CartProvider>
                {children}
                <CartDrawer />
              </CartProvider>
            </SupabaseProvider>
          </ClerkProviderWrapper>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
