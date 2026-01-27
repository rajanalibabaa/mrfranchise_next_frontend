import { Providers } from "@/redux/Providers";
import { VideoControllerProvider } from "@/services/VideoControllerMedia/VideHandlingFunctions";
import GlobalLoader from "@/components/GLobalLoader";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      
      <body>
        
        <ReactQueryProvider>
        <Providers>
          <VideoControllerProvider>
            {children}
            <GlobalLoader />
          </VideoControllerProvider>
        </Providers>
        </ReactQueryProvider>
      </body>
    </html>
  );
}



