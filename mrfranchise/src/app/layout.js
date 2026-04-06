import { Providers } from "@/Redux/Providers";
import { VideoControllerProvider } from "@/services/VideoControllerMedia/VideHandlingFunctions";
import GlobalLoader from "@/Components/GLobalLoader";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import Script from "next/script";
import RefreshSync from "@/Components/Refresh/RefreshSync";
import ThemeRegistry from "@/Utils/ThemeRegistry";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
