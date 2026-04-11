import { Providers } from "@/Redux/Providers";
import { VideoControllerProvider } from "@/services/VideoControllerMedia/VideHandlingFunctions";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import Script from "next/script";
import RefreshSync from "@/Components/Refresh/RefreshSync";
import ThemeRegistry from "@/Utils/ThemeRegistry";
export const metadata = {
  title: "Franchise Opportunities in India | Buy Franchise Business | Mr Franchise India – India's #1 Franchise & Business Opportunities Marketplace | Top Franchise Brands in 2024",
  description: "Discover top franchise opportunities in India across food, retail, education, services & more. Buy franchise business with low investment and connect with brands instantly via WhatsApp.",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/mrfranchise_logo.avif",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Franchise Opportunities in India | Buy Franchise Business | Mr Franchise India – India's #1 Franchise & Business Opportunities Marketplace | Top Franchise Brands in 2024</title>
        <meta name="description" content="Discover top franchise opportunities in India across food, retail, education, services & more. Buy franchise business with low investment and connect with brands instantly via WhatsApp." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/mrfranchise_logo.avif" type="image/jpeg" />
        <link rel="preconnect" href="https://pub-172d0514c5be40ae8cb05f4bd8a1c0ee.r2.dev/" />
      </head>
      <body>
        {/* Scripts */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
        />

        <Script
          id="ga-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />

        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>

        {/* Providers (FIXED ORDER) */}
        <ThemeRegistry>
          <ReactQueryProvider>
            <Providers>
              <VideoControllerProvider>
                <RefreshSync />
                {children}
              </VideoControllerProvider>
            </Providers>
          </ReactQueryProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
