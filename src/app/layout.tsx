import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ClerkProviderWrapper } from "@/components/ClerkProviderWrapper";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
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
    icon: "https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689c087f5bea48c9fcffec3e.svg",
    shortcut: "https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689c087f5bea48c9fcffec3e.svg",
    apple: "https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689c087f5bea48c9fcffec3e.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning={true}>
        <ErrorBoundary>
          <ClerkProviderWrapper>
            <SupabaseProvider>
              <CartProvider>
                <AnalyticsProvider>
                  {children}
                </AnalyticsProvider>
                <CartDrawer />
              </CartProvider>
            </SupabaseProvider>
          </ClerkProviderWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
