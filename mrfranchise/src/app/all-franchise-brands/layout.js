const SITE_URL = "https://mrfranchise.in";
const SITE_NAME = "Mr Franchise";
const PAGE_PATH = "/all-franchise-brands";
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

export const metadata = {
  // Title Configuration
  title: {
    default:
      "All Franchise Opportunities in India 2026 | 1000+ Verified Brands | Mr Franchise",
    template: "%s | Mr Franchise - India's #1 Franchise Marketplace",
  },

  // Enhanced Description
  description:
    "Discover 1000+ verified franchise opportunities in India across Food & Beverages, Retail, Education, Healthcare, Fitness, Beauty & more. Compare investment costs (₹5L to ₹5Cr+), ROI, profit margins, area requirements & apply directly. Get franchise cost details, contact numbers, and expert guidance. Start your franchise business journey with India's most trusted franchise marketplace.",

  // Comprehensive Keywords
  keywords: [
    // Primary Keywords
    "franchise opportunities in india",
    "all franchise brands in india",
    "franchise business opportunities india",
    "best franchise in india",
    "top franchise opportunities 2024",

    // Investment-based
    "low investment franchise india",
    "high profit franchise business",
    "franchise under 5 lakh",
    "franchise under 10 lakh",
    "franchise under 20 lakh",
    "best franchise to invest in india",

    // Category-based
    "food franchise opportunities india",
    "retail franchise india",
    "education franchise opportunities",
    "healthcare franchise india",
    "fitness franchise opportunities",
    "beauty salon franchise",
    "cafe franchise india",
    "restaurant franchise opportunities",
    "clothing franchise india",
    "pharmacy franchise",

    // Action-based
    "buy franchise in india",
    "franchise for sale india",
    "start franchise business",
    "how to get franchise in india",
    "franchise application online",

    // Location-based
    "franchise opportunities in delhi",
    "franchise opportunities in mumbai",
    "franchise opportunities in bangalore",
    "franchise opportunities in pune",
    "franchise business in tier 2 cities",

    // Marketplace
    "franchise marketplace india",
    "franchise portal india",
    "mr franchise india",
    "verified franchise opportunities",
    "trusted franchise brands",

    // Business type
    "home based franchise",
    "online franchise business",
    "franchise without office",
    "mobile franchise business",

    // Profitability
    "most profitable franchise in india",
    "high return franchise business",
    "franchise roi calculator",
    "franchise profit margin",

    // Brand specific
    "international franchise in india",
    "indian franchise brands",
    "popular franchise in india",
    "emerging franchise opportunities",
  ].join(", "),

  // Author & Publisher
  authors: [{ name: "Mr Franchise Team" }],
  publisher: "Mr Franchise",
  creator: "Mr Franchise",

  // Canonical URL
  alternates: {
    canonical: CANONICAL_URL,
  },

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

  // Open Graph (Enhanced)
  openGraph: {
    title:
      "All Franchise Opportunities in India 2024 | 1000+ Verified Brands | Mr Franchise",
    description:
      "Discover India's largest collection of verified franchise opportunities. Browse 1000+ brands across 20+ categories. Compare investment (₹5L-₹5Cr+), ROI, area requirements & apply instantly. Get expert franchise guidance from Mr Franchise - India's #1 Franchise Marketplace.",
    url: CANONICAL_URL,
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-all-franchises.jpg`,
        width: 1200,
        height: 630,
        alt: "All Franchise Opportunities in India - Mr Franchise",
        type: "image/jpeg",
      },
      {
        url: `${SITE_URL}/mrfranchise_logo.avif`,
        width: 800,
        height: 600,
        alt: "Mr Franchise Logo",
      },
    ],
  },

  // Twitter Card (Enhanced)
  twitter: {
    card: "summary_large_image",
    site: "@mrfranchise",
    creator: "@mrfranchise",
    title:
      "1000+ Franchise Opportunities in India | Compare & Apply | Mr Franchise",
    description:
      "Browse India's largest franchise marketplace. 1000+ verified brands across Food, Retail, Education, Healthcare & more. Compare costs, ROI & apply directly.",
    images: [`${SITE_URL}/og-all-franchises.jpg`],
  },

  // Verification Tags
  verification: {
    google: "",
  },

  // Additional Meta Tags
  other: {
    // Category Information
    "franchise:total_brands": "1000+",
    "franchise:categories": "20+",
    "franchise:min_investment": "₹5 Lakhs",
    "franchise:max_investment": "₹5 Crores+",
    "franchise:country": "India",

    // Business Information
    "business:type": "Franchise Marketplace",
    "business:category": "All Categories",

    // Mobile App Deep Link (if applicable)
    "al:android:url": "mrfranchise://allbrands",
    "al:android:package": "com.mrfranchise.app",
    "al:android:app_name": "Mr Franchise",
    "al:ios:url": "mrfranchise://allbrands",
    "al:ios:app_store_id": "123456789",
    "al:ios:app_name": "Mr Franchise",

    // Rating (if applicable)
    rating: "4.5",
    "rating:scale": "5",

    // Geographic Target
    "geo.region": "IN",
    "geo.placename": "India",

    // Language
    language: "English",
    "content-language": "en-IN",
  },

  // App Links (if you have a mobile app)
  appLinks: {
    android: {
      package: "com.mrfranchise.app",
      url: "mrfranchise://allbrands",
      app_name: "Mr Franchise",
    },
    ios: {
      url: "mrfranchise://allbrands",
      app_store_id: "123456789",
      app_name: "Mr Franchise",
    },
  },

  // Classification
  category: "Business & Franchise Opportunities",
};

const generateStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Website
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: "India's #1 Franchise Marketplace",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },

      // CollectionPage
      {
        "@type": "CollectionPage",
        "@id": `${CANONICAL_URL}#collectionpage`,
        url: CANONICAL_URL,
        name: "All Franchise Opportunities in India",
        description:
          "Browse 1000+ verified franchise opportunities across all categories in India",
        isPartOf: {
          "@id": `${SITE_URL}#website`,
        },
        about: {
          "@type": "Thing",
          name: "Franchise Opportunities",
          description:
            "Business franchise opportunities across multiple industries",
        },
        breadcrumb: {
          "@id": `${CANONICAL_URL}#breadcrumb`,
        },
      },

      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL_URL}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "All Categories",
            item: `${SITE_URL}/allcategorypage`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "All Franchise Brands",
            item: CANONICAL_URL,
          },
        ],
      },

      // Organization
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/mrfranchise_logo.avif`,
          width: 250,
          height: 60,
        },
        description: "India's largest and most trusted franchise marketplace",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
          addressLocality: "India",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-XXXXXXXXXX",
          contactType: "Customer Service",
          availableLanguage: ["English", "Hindi"],
          areaServed: "IN",
        },
        sameAs: [
          "https://www.facebook.com/mrfranchise",
          "https://www.instagram.com/mrfranchise",
          "https://www.linkedin.com/company/mrfranchise",
          "https://twitter.com/mrfranchise",
          "https://www.youtube.com/@mrfranchise",
        ],
      },

      // ItemList (for franchise categories)
      {
        "@type": "ItemList",
        "@id": `${CANONICAL_URL}#itemlist`,
        name: "Franchise Categories",
        description: "Browse franchise opportunities by category",
        numberOfItems: 20,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Food & Beverage Franchise",
            url: `${SITE_URL}/category/food-beverage`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Retail Franchise",
            url: `${SITE_URL}/category/retail`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Education Franchise",
            url: `${SITE_URL}/category/education`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Healthcare Franchise",
            url: `${SITE_URL}/category/healthcare`,
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Fitness Franchise",
            url: `${SITE_URL}/category/fitness`,
          },
          {
            "@type": "ListItem",
            position: 6,
            name: "Beauty & Salon Franchise",
            url: `${SITE_URL}/category/beauty-salon`,
          },
          {
            "@type": "ListItem",
            position: 7,
            name: "Cafe & Coffee Franchise",
            url: `${SITE_URL}/category/cafe-coffee`,
          },
          {
            "@type": "ListItem",
            position: 8,
            name: "Automotive Franchise",
            url: `${SITE_URL}/category/automotive`,
          },
        ],
      },

      // FAQPage
      {
        "@type": "FAQPage",
        "@id": `${CANONICAL_URL}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How many franchise opportunities are available on Mr Franchise?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Mr Franchise features over 1000+ verified franchise opportunities across 20+ categories including Food & Beverage, Retail, Education, Healthcare, Fitness, and more. We continuously update our listings with new franchise brands.",
            },
          },
          {
            "@type": "Question",
            name: "What is the minimum investment required to start a franchise in India?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Franchise investments on Mr Franchise range from as low as ₹5 lakhs to ₹5 crores and above. The investment varies based on the brand, category, location, and business model. You can filter franchises by investment range to find options that match your budget.",
            },
          },
          {
            "@type": "Question",
            name: "How can I apply for a franchise on Mr Franchise?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can apply for any franchise by clicking on the brand listing, filling out the inquiry form with your details, and submitting it. The brand will receive your application and contact you directly with further information about the franchise opportunity.",
            },
          },
          {
            "@type": "Question",
            name: "Are all franchises on Mr Franchise verified?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, Mr Franchise verifies all franchise listings before publishing them on our platform. We ensure that the brands listed are legitimate and provide accurate information about investment, ROI, and franchise terms.",
            },
          },
          {
            "@type": "Question",
            name: "Which are the most profitable franchise categories in India?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The most profitable franchise categories in India include Food & Beverage (QSR, Cafe, Cloud Kitchen), Education (Coaching, Preschool), Healthcare (Pharmacy, Diagnostic), Fitness (Gym, Yoga), and Retail (Fashion, Grocery). Profitability depends on location, investment, and operational efficiency.",
            },
          },
          {
            "@type": "Question",
            name: "Can I get franchise opportunities for tier 2 and tier 3 cities?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, many franchise brands on Mr Franchise are actively expanding to tier 2 and tier 3 cities. You can filter franchises by location preference and find opportunities suitable for your city. Smaller cities often have lower investment and operational costs.",
            },
          },
        ],
      },
    ],
  };
};

export default function BrandListingLayout({ children }) {
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

      {/* Content */}
      {children}
    </>
  );
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};
