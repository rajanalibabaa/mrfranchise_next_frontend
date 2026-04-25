// app/page.js

import HomeBannerSec from "../Components/HomePages/HomeBannerSec";


const SITE_URL =  "https://mrfranchise.in";
const SITE_NAME = "Mr Franchise India";
const CURRENT_YEAR = new Date().getFullYear();


export const metadata = {
  metadataBase: new URL(SITE_URL),

  // Title Configuration
  title: {
    default: `Franchise Opportunities in India | Buy Franchise Business |${SITE_NAME} – India's #1 Franchise & Business Opportunities Marketplace | Top Franchise Brands in ${CURRENT_YEAR}`,
    template: `%s | ${SITE_NAME} - Buy, Sell & Invest in Franchises`,
  },

  // Enhanced Description
  description:
    `Discover top franchise opportunities in India across food, retail, education, services & more. Buy franchise business with low investment and connect with brands instantly via WhatsApp.`,

  // Comprehensive Keywords
  keywords: [
    // Brand Keywords
    "mr franchise india",
    "mrfranchise",
    "mr franchise marketplace",
    "mr franchise official",
    
    // Primary Keywords
    "franchise opportunities in india",
    "business opportunities india",
    "franchise marketplace india",
    "best franchise in india",
    "top franchise opportunities",
    
    // Action Keywords
    "buy franchise in india",
    "sell franchise in india",
    "franchise for sale",
    "business for sale india",
    "invest in franchise",
    "franchise investment opportunities",
    
    // Investment-based Keywords
    "low investment franchise",
    "franchise under 5 lakh",
    "franchise under 10 lakh",
    "high profit franchise business",
    "best franchise to invest",
    "franchise business ideas",
    
    // Category Keywords
    "food franchise opportunities",
    "retail franchise india",
    "education franchise",
    "healthcare franchise",
    "beauty salon franchise",
    "fitness franchise",
    "cafe franchise",
    "restaurant franchise",
    
    // Location Keywords
    "franchise opportunities in delhi",
    "franchise opportunities in mumbai",
    "franchise opportunities in bangalore",
    "franchise in tier 2 cities",
    
    // Business Type Keywords
    "home based franchise",
    "online franchise business",
    "franchise without investment",
    "franchise dealership",
    "distributorship opportunities",
    
    // Comparison Keywords
    "compare franchise opportunities",
    "franchise cost comparison",
    "franchise roi calculator",
    "best franchise brands india",
    
    // B2B Keywords
    "sell my business india",
    "business brokers india",
    "franchise consultants india",
    "business valuation india",
    
    // Long-tail Keywords
    "how to start a franchise business in india",
    "which franchise is best in india",
    "most profitable franchise in india",
    "franchise opportunities for women",
    "franchise business without office",
  ].join(", "),

  // Authors & Publisher
  authors: [
    { name: SITE_NAME, url: SITE_URL },
    { name: "Mr Franchise Team" }
  ],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  // Application Details
  applicationName: SITE_NAME,
  generator: "Next.js 14",
  referrer: "origin-when-cross-origin",

  // Robots Configuration
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Verification Tags
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_ID,
    
  },

  // Open Graph (Enhanced)
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} – Franchise & Business Opportunities Marketplace`,
    description:
      "Explore 10,000+ verified franchise and business opportunities in India. Compare investment costs, ROI, and connect with franchise owners. Buy, sell, and grow your business with India's most trusted franchise marketplace.",
    images: [
      {
        url: `${SITE_URL}/mrfranchise_logo.avif`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} – Franchise Marketplace`,
        type: "image/jpeg",
      },
      {
        url: `${SITE_URL}/mrfranchise_logo.avif`,
        width: 800,
        height: 800,
        alt: `${SITE_NAME} Logo`,
        type: "image/png",
      },
    ],
  },

  // Twitter Card (Enhanced)
  twitter: {
    card: "summary_large_image",
    site: "@mrfranchise",
    creator: "@mrfranchise",
    title: `${SITE_NAME} – 10,000+ Franchise & Business Opportunities`,
    description:
      "India's largest franchise marketplace. Compare 10,000+ verified franchises, investment costs, ROI & apply instantly. Buy, sell & invest in franchises.",
    images: [`${SITE_URL}/og-home.jpg`],
  },

  // Canonical & Alternate Languages
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
      "hi-IN": `${SITE_URL}/hi`, // If you have Hindi version
    },
  },

  // PWA Manifest
  manifest: "/manifest.json",

  // Icons (Enhanced)
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },

  // App Links (if you have mobile app)
  appLinks: {
    android: {
      package: "com.mrfranchise.app",
      url: "mrfranchise://home",
      app_name: SITE_NAME,
    },
    ios: {
      url: "mrfranchise://home",
      app_store_id: "123456789",
      app_name: SITE_NAME,
    },
  },

 

  // Category
  category: "Franchise & Business Opportunities Marketplace",

  // Classification
  classification: "Business, Franchise, Opportunities, Marketplace",
};

/* ============================
   STRUCTURED DATA
============================ */
const generateStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Website
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        "url": SITE_URL,
        "name": SITE_NAME,
        "description": "India's #1 Franchise & Business Opportunities Marketplace",
        "publisher": {
          "@id": `${SITE_URL}#organization`,
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${SITE_URL}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        ],
        "inLanguage": "en-IN",
      },

      // Organization
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        "name": SITE_NAME,
        "alternateName": "Mr Franchise",
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "@id": `${SITE_URL}#logo`,
          "url": `${SITE_URL}/mrfranchise_logo.avif`,
          "contentUrl": `${SITE_URL}/mrfranchise_logo.avif`,
          "width": 250,
          "height": 60,
          "caption": SITE_NAME,
        },
        "image": {
          "@id": `${SITE_URL}#logo`,
        },
        "description": "India's largest and most trusted franchise & business opportunities marketplace with 10,000+ verified listings",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN",
          "addressLocality": "India",
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+91-9841323388",
            "contactType": "Customer Service",
            "email": "support@mrfranchise.in",
            "availableLanguage": ["English", "Hindi"],
            "areaServed": "IN",
          },
          {
            "@type": "ContactPoint",
            "contactType": "Sales",
            "email": "sales@mrfranchise.in",
            "availableLanguage": ["English", "Hindi"],
            "areaServed": "IN",
          },
        ],
        "sameAs": [
          "https://www.facebook.com/mrfranchise",
          "https://www.instagram.com/mrfranchise",
          "https://www.linkedin.com/company/mrfranchise",
          "https://twitter.com/mrfranchise",
          "https://www.youtube.com/@mrfranchise",
        ],
      },

      // WebPage
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}#webpage`,
        "url": SITE_URL,
        "name": `${SITE_NAME} – India's #1 Franchise & Business Opportunities Marketplace`,
        "description": "Discover 10,000+ verified franchise opportunities across 50+ categories. Compare investment, ROI & apply directly.",
        "isPartOf": {
          "@id": `${SITE_URL}#website`,
        },
        "about": {
          "@id": `${SITE_URL}#organization`,
        },
        "primaryImageOfPage": {
          "@id": `${SITE_URL}#primaryimage`,
        },
        "inLanguage": "en-IN",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [SITE_URL],
          },
        ],
      },

      // ImageObject
      {
        "@type": "ImageObject",
        "@id": `${SITE_URL}#primaryimage`,
        "url": `${SITE_URL}/og-home.jpg`,
        "contentUrl": `${SITE_URL}/og-home.jpg`,
        "width": 1200,
        "height": 630,
        "caption": `${SITE_NAME} – Franchise Marketplace`,
      },

      // ItemList (Categories)
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}#categories`,
        "name": "Franchise Categories",
        "description": "Browse franchise opportunities by category",
        "numberOfItems": 8,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Food & Beverage Franchise",
            "url": `${SITE_URL}/all-franchise-brands/food-beverages`,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Retail Franchise",
            "url": `${SITE_URL}/all-franchise-brands/retail`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Education Franchise",
            "url": `${SITE_URL}/all-franchise-brands/education`,
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Healthcare Franchise",
            "url": `${SITE_URL}/all-franchise-brands/healthcare`,
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Fitness Franchise",
            "url": `${SITE_URL}/all-franchise-brands/fitness`,
          },
          {
            "@type": "ListItem",
            "position": 6,
            "name": "Beauty & Salon Franchise",
            "url": `${SITE_URL}/all-franchise-brands/beauty-salon`,
          },
          {
            "@type": "ListItem",
            "position": 7,
            "name": "Cafe & Coffee Franchise",
            "url": `${SITE_URL}/all-franchise-brands/cafe-coffee`,
          },
          {
            "@type": "ListItem",
            "position": 8,
            "name": "Automotive Franchise",
            "url": `${SITE_URL}/all-franchise-brands/automotive`,
          },
        ],
      },

      // FAQPage
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Mr Franchise India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr Franchise India is India's largest and most trusted franchise and business opportunities marketplace. We connect franchise seekers with 10,000+ verified franchise opportunities across 50+ categories including Food & Beverage, Retail, Education, Healthcare, and more. Our platform helps you compare investment costs, ROI, and connect directly with franchise owners.",
            },
          },
          {
            "@type": "Question",
            "name": "How many franchise opportunities are available on Mr Franchise?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr Franchise features over 10,000+ verified franchise opportunities across 50+ categories. Our listings include popular brands like Zomato, Swiggy, Domino's, McDonald's, Subway, and many more. We regularly update our database with new franchise opportunities.",
            },
          },
          {
            "@type": "Question",
            "name": "What is the minimum investment required to start a franchise?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Franchise investments on Mr Franchise range from as low as ₹50,000 to ₹5 Crores and above. The investment varies based on the brand, category, location, and business model. We have franchise opportunities for every budget - from low investment home-based franchises to large-scale retail and QSR franchises.",
            },
          },
          {
            "@type": "Question",
            "name": "How do I apply for a franchise on Mr Franchise?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Applying for a franchise on Mr Franchise is simple: 1) Browse our franchise listings, 2) Select your preferred brand, 3) Fill out the inquiry form with your details, 4) Submit your application. The franchise owner will receive your application and contact you directly with detailed information about investment, requirements, and the application process.",
            },
          },
          {
            "@type": "Question",
            "name": "Are all franchises on Mr Franchise verified?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, all franchise listings on Mr Franchise go through a verification process before being published. We verify the authenticity of franchise brands, validate their business credentials, and ensure accurate information about investment, ROI, and terms. This makes Mr Franchise India's most trusted franchise marketplace.",
            },
          },
          {
            "@type": "Question",
            "name": "Can I sell my business on Mr Franchise?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Mr Franchise is not just a franchise marketplace but also a platform to sell businesses. If you own a franchise or any business and want to sell it, you can list it on our platform. We connect you with genuine buyers and investors across India.",
            },
          },
        ],
      },
    ],
  };
};

/* ============================
   VIEWPORT (Next.js 14+)
============================ */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

/* ============================
   PAGE COMPONENT
============================ */
export default function Home() {
  const structuredData = generateStructuredData();

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
  <link rel="icon" href="/mrfranchise_logo.avif" type="image/jpeg" />

      {/* Preconnect for Performance */}
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

      {/* Page Content */}
      <HomeBannerSec />
    </>
  );
}