// app/all-franchise-brands/[slug]/page.js

import ClientPage from "./ClientPage";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}`;
const SITE_URL = "https://mrfranchise.in";
const SITE_NAME = "Mr Franchise";
export const dynamic = "force-dynamic";

const CATEGORY_CONFIG = {
  "food-beverages": {
    title: "Food & Beverages",
    icon: "🍔",
    description: "Quick Service Restaurants, Cloud Kitchens, Cafes, Bakeries",
    keywords: [
      "restaurant franchise",
      "cloud kitchen franchise",
      "cafe franchise",
      "QSR franchise",
      "food delivery franchise",
    ],
    investment: "₹5L - ₹50L",
    avgROI: "25-35%",
    popular: true,
  },
  "bakery-confectionery": {
    title: "Bakery & Confectionery",
    icon: "🎂",
    description:
      "Bakery shops, Cake shops, Confectionery stores, Dessert outlets",
    keywords: [
      "bakery franchise",
      "cake shop franchise",
      "confectionery franchise",
      "dessert franchise",
    ],
    investment: "₹3L - ₹20L",
    avgROI: "30-40%",
    popular: true,
  },
  retail: {
    title: "Retail",
    icon: "🛍️",
    description: "Fashion, Grocery, Electronics, Lifestyle stores",
    keywords: [
      "retail franchise",
      "clothing franchise",
      "grocery franchise",
      "lifestyle franchise",
    ],
    investment: "₹5L - ₹50L",
    avgROI: "20-30%",
    popular: true,
  },
  education: {
    title: "Education",
    icon: "📚",
    description:
      "Preschools, Coaching centers, Online education, Skill development",
    keywords: [
      "preschool franchise",
      "coaching franchise",
      "education franchise",
      "e-learning franchise",
    ],
    investment: "₹5L - ₹30L",
    avgROI: "30-45%",
    popular: true,
  },
  healthcare: {
    title: "Healthcare",
    icon: "🏥",
    description: "Pharmacy, Diagnostic centers, Clinics, Wellness centers",
    keywords: [
      "pharmacy franchise",
      "diagnostic franchise",
      "clinic franchise",
      "healthcare franchise",
    ],
    investment: "₹10L - ₹50L",
    avgROI: "25-35%",
    popular: true,
  },
  fitness: {
    title: "Fitness & Wellness",
    icon: "💪",
    description: "Gyms, Yoga centers, Fitness studios, Sports facilities",
    keywords: [
      "gym franchise",
      "yoga franchise",
      "fitness franchise",
      "sports franchise",
    ],
    investment: "₹8L - ₹40L",
    avgROI: "30-40%",
    popular: false,
  },
  "beauty-salon": {
    title: "Beauty & Salon",
    icon: "💇",
    description: "Beauty salons, Spa, Wellness centers, Grooming studios",
    keywords: [
      "salon franchise",
      "beauty franchise",
      "spa franchise",
      "grooming franchise",
    ],
    investment: "₹5L - ₹25L",
    avgROI: "35-45%",
    popular: true,
  },
  automotive: {
    title: "Automotive",
    icon: "🚗",
    description: "Car service, Bike service, Spare parts, Accessories",
    keywords: [
      "car service franchise",
      "automotive franchise",
      "bike service franchise",
    ],
    investment: "₹10L - ₹50L",
    avgROI: "20-30%",
    popular: false,
  },
  "cafe-coffee": {
    title: "Cafe & Coffee",
    icon: "☕",
    description: "Coffee shops, Tea cafes, Specialty beverages",
    keywords: [
      "coffee franchise",
      "cafe franchise",
      "tea franchise",
      "beverage franchise",
    ],
    investment: "₹5L - ₹30L",
    avgROI: "30-40%",
    popular: true,
  },
  "home-services": {
    title: "Home Services",
    icon: "🏠",
    description: "Cleaning, Pest control, Repair, Maintenance",
    keywords: [
      "home services franchise",
      "cleaning franchise",
      "pest control franchise",
    ],
    investment: "₹3L - ₹15L",
    avgROI: "40-50%",
    popular: false,
  },
};

function toTitleCase(str) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getCategoryConfig(slug) {
  return CATEGORY_CONFIG[slug] || null;
}

async function getCategoryData(slug) {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/filter/getAllBrandsAndFilter?maincat=${encodeURIComponent(toTitleCase(slug))}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      console.error(`Failed to fetch category: ${slug}, Status: ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error(`Error fetching category data for slug: ${slug}`, error);
    return null;
  }
}

function generateSEOTitle(categoryName, config, brandCount) {
  const countText = brandCount ? `${brandCount}+ ` : "";
  const yearText = new Date().getFullYear();

  if (config?.popular) {
    return `${countText}${categoryName} Franchise Opportunities in India ${yearText} | Investment, Cost & ROI | ${SITE_NAME}`;
  }

  return `${categoryName} Franchise Opportunities in India | Best ${categoryName} Franchise Brands | ${SITE_NAME}`;
}

function generateSEODescription(categoryName, config) {
  const investment = config?.investment || "varies";
  const roi = config?.avgROI || "competitive";
  const description = config?.description || "various business models";

  return `Explore verified ${categoryName} franchise opportunities in India. Investment: ${investment}. Average ROI: ${roi}. Browse top ${categoryName} franchise brands including ${description}. Get complete details on franchise cost, profit margins, area requirements, training & support. Compare investment options and apply directly. Start your ${categoryName} franchise business with India's most trusted franchise marketplace.`;
}

function generateSEOKeywords(categoryName, slug, config) {
  const categoryKeywords = config?.keywords || [];

  const baseKeywords = [
    // Primary category keywords
    `${categoryName} franchise`,
    `${categoryName} franchise in India`,
    `${categoryName} franchise opportunities`,
    `${categoryName} franchise cost`,
    `best ${categoryName} franchise`,
    `top ${categoryName} franchise in India`,

    // Investment-based
    `low investment ${categoryName} franchise`,
    `${categoryName} franchise under 10 lakh`,
    `${categoryName} franchise investment`,
    `${categoryName} franchise fees`,

    // Action-based
    `how to start ${categoryName} franchise`,
    `${categoryName} franchise apply`,
    `${categoryName} franchise application`,
    `buy ${categoryName} franchise`,

    // Location-based
    `${categoryName} franchise in delhi`,
    `${categoryName} franchise in mumbai`,
    `${categoryName} franchise in bangalore`,
    `${categoryName} franchise in pune`,

    // Profitability
    `${categoryName} franchise profit`,
    `${categoryName} franchise roi`,
    `${categoryName} franchise profit margin`,
    `profitable ${categoryName} franchise`,

    // Requirements
    `${categoryName} franchise requirements`,
    `${categoryName} franchise area required`,
    `${categoryName} franchise eligibility`,

    // General franchise keywords
    "franchise opportunities in india",
    "best franchise business in india",
    "franchise marketplace india",
    "verified franchise opportunities",
    "mr franchise india",

    // Category-specific keywords
    ...categoryKeywords,
  ];

  return baseKeywords.join(", ");
}

function generateStructuredData(categoryName, slug, config, brandCount) {
  const canonicalUrl = `${SITE_URL}/all-franchise-brands/${slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      // CollectionPage
      {
        "@type": "CollectionPage",
        "@id": `${canonicalUrl}#collectionpage`,
        url: canonicalUrl,
        name: `${categoryName} Franchise Opportunities in India`,
        description: generateSEODescription(categoryName, config),
        isPartOf: {
          "@id": `${SITE_URL}#website`,
        },
        breadcrumb: {
          "@id": `${canonicalUrl}#breadcrumb`,
        },
        numberOfItems: brandCount || 0,
      },

      // BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
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
            name: "All Brands",
            item: `${SITE_URL}/all-franchise-brands`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: categoryName,
            item: canonicalUrl,
          },
        ],
      },

      // ItemList
      {
        "@type": "ItemList",
        "@id": `${canonicalUrl}#itemlist`,
        name: `${categoryName} Franchise Brands`,
        description: `List of verified ${categoryName} franchise opportunities`,
        numberOfItems: brandCount || 0,
      },

      // OfferCatalog
      {
        "@type": "OfferCatalog",
        "@id": `${canonicalUrl}#offercatalog`,
        name: `${categoryName} Franchise Opportunities`,
        description: `Browse ${categoryName} franchise opportunities with investment details`,
        itemListElement: config
          ? [
              {
                "@type": "Offer",
                category: categoryName,
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "INR",
                  price: config.investment,
                },
              },
            ]
          : [],
      },

      // FAQPage
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the investment required for a ${categoryName} franchise in India?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: config?.investment
                ? `The investment for a ${categoryName} franchise in India typically ranges from ${config.investment}. However, the exact cost varies based on the brand, location, outlet size, and franchise model. Mr Franchise lists franchises across various investment ranges to suit different budgets.`
                : `The investment for a ${categoryName} franchise varies based on the brand and location. You can find detailed investment information for each franchise on Mr Franchise.`,
            },
          },
          {
            "@type": "Question",
            name: `Which are the best ${categoryName} franchise opportunities in India?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The best ${categoryName} franchise opportunities include established brands with proven business models, strong ROI, and comprehensive support systems. On Mr Franchise, you can compare top ${categoryName} franchise brands based on investment, profitability, area requirements, and growth potential.`,
            },
          },
          {
            "@type": "Question",
            name: `What is the average ROI for ${categoryName} franchises?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: config?.avgROI
                ? `The average ROI for ${categoryName} franchises in India is typically ${config.avgROI}. However, actual returns depend on factors like location, operations, marketing, and brand strength. Successful franchisees often see returns within 18-36 months.`
                : `The ROI for ${categoryName} franchises varies based on multiple factors. Check individual franchise listings on Mr Franchise for specific ROI details.`,
            },
          },
          {
            "@type": "Question",
            name: `How to apply for a ${categoryName} franchise on Mr Franchise?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `To apply for a ${categoryName} franchise on Mr Franchise: 1) Browse the category listings, 2) Click on your preferred brand, 3) Fill out the inquiry form with your details, 4) Submit your application. The brand will contact you directly with franchise details, requirements, and next steps.`,
            },
          },
          {
            "@type": "Question",
            name: `What are the requirements to start a ${categoryName} franchise?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Requirements for a ${categoryName} franchise typically include adequate investment capital, suitable commercial space, business acumen, and commitment to brand standards. Specific requirements vary by brand and may include minimum area, location criteria, educational qualifications, and prior business experience.`,
            },
          },
        ],
      },
    ],
  };
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const categoryName = toTitleCase(slug);
  const config = getCategoryConfig(slug);

  // Fetch category data for brand count
  const categoryData = await getCategoryData(slug);
  const brandCount = categoryData?.brands?.length || categoryData?.total || 0;

  const canonicalUrl = `${SITE_URL}/all-franchise-brands/${slug}`;

  // Generate SEO content
  const title = generateSEOTitle(categoryName, config, brandCount);
  const description = generateSEODescription(categoryName, config);
  const keywords = generateSEOKeywords(categoryName, slug, config);

  return {
    title,
    description,
    keywords,

    // Authors & Publisher
    authors: [{ name: `${SITE_NAME} Team` }],
    publisher: SITE_NAME,
    creator: SITE_NAME,

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Robots
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

    // Open Graph
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-${slug}.jpg`,
          width: 1200,
          height: 630,
          alt: `${categoryName} Franchise Opportunities in India`,
          type: "image/jpeg",
        },
        {
          url: `${SITE_URL}/logo.png`,
          width: 800,
          height: 600,
          alt: `${SITE_NAME} Logo`,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      site: "@mrfranchise",
      creator: "@mrfranchise",
      title,
      description: `Find the best ${categoryName} franchise opportunities in India. ${brandCount ? `${brandCount}+ verified brands.` : ""} Compare investment, ROI & apply now.`,
      images: [`${SITE_URL}/og-${slug}.jpg`],
    },

    // Additional Meta
    other: {
      "franchise:category": categoryName,
      "franchise:total_brands": brandCount.toString(),
      "franchise:investment_range": config?.investment || "varies",
      "franchise:avg_roi": config?.avgROI || "competitive",
      "franchise:country": "India",
      "category:icon": config?.icon || "📊",
      "category:popular": config?.popular ? "true" : "false",
    },

    // Category
    category: `${categoryName} Franchise Opportunities`,
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const categoryName = toTitleCase(slug);
  const config = getCategoryConfig(slug);

  // Fetch category data
  const categoryData = await getCategoryData(slug);
  const brandCount = categoryData?.brands?.length || categoryData?.total || 0;

  // Generate structured data
  const structuredData = generateStructuredData(
    categoryName,
    slug,
    config,
    brandCount,
  );

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <link rel="icon" href="/logo.png" type="image/jpeg" />

      {/* Page Content */}
      <ClientPage slug={slug} />
    </>
  );
}
