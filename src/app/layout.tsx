import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";

// Force dynamic rendering globally to prevent DataCloneError
export const dynamic = 'force-dynamic';
import { ClerkProviderWrapper } from "@/components/ClerkProviderWrapper";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SupabaseProvider } from "@/components/SupabaseProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import StructuredData from "@/components/StructuredData";
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
  metadataBase: new URL('https://iliosauna.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Ilio Sauna - Premium Cedar Saunas | Vancouver Island & BC",
    description: "Expertly crafted on Vancouver Island British Columbia Canada. Transform your backyard into a wellness retreat.",
    url: 'https://iliosauna.com',
    siteName: 'Ilio Sauna',
    images: [
      {
        url: '/ilio-logo-light.svg',
        width: 1200,
        height: 630,
        alt: 'Ilio Sauna Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ilio Sauna - Premium Cedar Saunas",
    description: "Expertly crafted on Vancouver Island British Columbia Canada. Transform your backyard into a wellness retreat.",
    images: ['/ilio-logo-light.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
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
        <SpeedInsights />
      </body>
    </html>
  );
}
