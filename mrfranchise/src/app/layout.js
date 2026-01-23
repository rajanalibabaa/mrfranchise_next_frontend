import { Providers } from "@/redux/Providers";
import { VideoControllerProvider } from "@/services/VideoControllerMedia/VideHandlingFunctions";
import GlobalLoader from "@/components/GLobalLoader";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import Script from "next/script";

export const metadata = {
  // Basic Metadata
  title: {
    default: "Your Website Name | Tagline",
    template: "%s | Your Website Name"
  },
  description: "Your comprehensive website description for SEO. Make it compelling and keyword-rich (150-160 characters).",
  keywords: ["keyword1", "keyword2", "keyword3", "your niche", "your service"],
  
  // Author & Publisher
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  creator: "Your Name or Company",
  publisher: "Your Company Name",
  
  // Open Graph (Facebook, LinkedIn)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourwebsite.com",
    siteName: "Your Website Name",
    title: "Your Website Name | Tagline",
    description: "Your comprehensive website description",
    images: [
      {
        url: "https://yourwebsite.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Your Website Preview Image",
      }
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@yourtwitterhandle",
    creator: "@yourtwitterhandle",
    title: "Your Website Name | Tagline",
    description: "Your comprehensive website description",
    images: ["https://yourwebsite.com/twitter-image.jpg"],
  },
  
  // Robots
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
  
  // Verification
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    bing: "your-bing-verification-code",
  },
  
  // Manifest
  manifest: "/manifest.json",
  
  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  
  // Alternate Languages
  alternates: {
    canonical: "https://yourwebsite.com",
    languages: {
      'en-US': 'https://yourwebsite.com/en-US',
      'es-ES': 'https://yourwebsite.com/es-ES',
    },
  },
  
  // Other
  metadataBase: new URL('https://yourwebsite.com'),
  category: 'technology', // or your website category
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXXX');
          `}
        </Script>

        {/* Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `}
        </Script>

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
