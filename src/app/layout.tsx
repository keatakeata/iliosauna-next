import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${montserrat.variable} font-sans antialiased`}>
          <ErrorBoundary>
            <SupabaseProvider>
              <CartProvider>
                <AnalyticsProvider>
                  {children}
                </AnalyticsProvider>
                <CartDrawer />
              </CartProvider>
            </SupabaseProvider>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
