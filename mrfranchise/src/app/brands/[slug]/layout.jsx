import React from "react";


const API_BASE =  `${process.env.NEXT_PUBLIC_API_URL}`;
const SITE_URL =  "https://mrfranchise.in";

export const dynamic = "force-dynamic";
// const REVALIDATE_TIME = 3600; // 1 hour



/**
 * Fetches brand data from API
 * @param {string} slug - Brand slug
 * @returns {Promise<Object|null>} Brand data or null
 */
async function getBrandData(slug) {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/brandlisting/getBrandListingSlug/${slug}`,
      { 
        next: { revalidate: 3600 }, // ✅ cache for 1 hour
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch brand: ${slug}, Status: ${res.status}`);
      return null;
    }

    const json = await res.json();
    return Array.isArray(json?.data) ? json.data[0] : json.data;
  } catch (error) {
    console.error(`Error fetching brand data for slug: ${slug}`, error);
    return null;
  }
}

/**
 * Generates SEO-optimized title for brand
 * @param {string} brandName - Brand name
 * @returns {string} SEO title
 */
function generateSEOTitle(brandName) {
  return `${brandName} Franchise | Top Franchise Opportunities | Best Franchise Business Opportunities`;
}

/**
 * Generates SEO-optimized description for brand
 * @param {string} brandName - Brand name
 * @returns {string} SEO description
 */
function generateSEODescription(brandName) {
  return `Own your ${brandName} franchise. Get the ${brandName} franchising information including start-up costs, franchise fees, requirements, growth history and more. Join ${brandName} franchise and be on your way to owning and running a successful franchise business. The Startup Costs, ROI, Ideal Investor Profile and explore the franchise in ${brandName}.`;
}

/**
 * Generates SEO keywords for brand
 * @param {string} brandName - Brand name
 * @returns {string} Comma-separated keywords
 */
function generateSEOKeywords(brandName) {
  const keywords = [
    `${brandName} franchise in India`,
    `${brandName} franchise cost`,
    `${brandName} franchise contact number`,
    `how to get ${brandName} franchise`,
    `${brandName} franchise profit`,
    `${brandName} franchise enquiry`,
    `${brandName} franchise requirements`,
    `${brandName} franchise apply`,
    `${brandName} franchise fee`,
    `${brandName} franchise monthly income`,
    `${brandName} franchise reviews`,
    `${brandName} franchise opportunity`,
    `${brandName} franchise business`,
    "best franchise opportunities in India",
    "top franchise business",
    "franchise investment",
  ];

  return keywords.join(", ");
}

/**
 * Formats brand name from various sources
 * @param {Object} brand - Brand data object
 * @returns {string} Formatted brand name
 */
function getBrandName(brand) {
  return (
    brand?.brandDetails?.brandName ||
    brand?.brandDetails?.companyName ||
    brand?.brandDetails?.slug ||
    "Unknown Brand"
  );
}

/**
 * Gets brand logo URL
 * @param {Object} brand - Brand data object
 * @returns {string} Logo URL
 */
function getBrandLogo(brand) {
  return brand?.uploads?.logo || DEFAULT_BRAND_IMAGE;
}

/**
 * Gets brand location information
 * @param {Object} brand - Brand data object
 * @returns {string} Location string
 */
function getBrandLocation(brand) {
  const city = brand?.brandDetails?.city;
  const state = brand?.brandDetails?.state;
  const country = brand?.brandDetails?.country;

  const locations = [city, state, country].filter(Boolean);
  return locations.length > 0 ? locations.join(", ") : "India";
}

/**
 * Gets investment range text
 * @param {Object} brand - Brand data object
 * @returns {string|null} Investment range
 */
function getInvestmentRange(brand) {
  return brand?.brandfranchisedetails?.investmentRange || null;
}

/**
 * Generates structured data (JSON-LD) for SEO
 * @param {Object} brand - Brand data
 * @param {string} slug - Brand slug
 * @returns {Object} Structured data object
 */
function generateStructuredData(brand, slug) {
  const brandName = getBrandName(brand);
  const logo = getBrandLogo(brand);
  const location = getBrandLocation(brand);
  const investment = getInvestmentRange(brand);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": brandName,
    "image": logo,
    "description": generateSEODescription(brandName),
    "url": `${SITE_URL}/brands/${slug}`,
    "logo": logo,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location,
      "addressCountry": "IN"
    },
    "priceRange": investment || "$$",
    "aggregateRating": brand?.rating ? {
      "@type": "AggregateRating",
      "ratingValue": brand.rating,
      "reviewCount": brand.reviewCount || 1
    } : undefined,
  };
}


/**
 * Generates metadata for brand pages
 * @param {Object} params - Route parameters
 * @returns {Promise<Object>} Next.js metadata object
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const brand = await getBrandData(slug);

  // Handle brand not found
  if (!brand) {
    return {
      title: "Brand Not Found | Mr Franchise",
      description: "This franchise brand does not exist or is no longer available.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const brandName = getBrandName(brand);
  const logo = getBrandLogo(brand);
  const location = getBrandLocation(brand);
  const investment = getInvestmentRange(brand);

  // SEO optimized metadata
  const title = generateSEOTitle(brandName);
  const description = generateSEODescription(brandName);
  const keywords = generateSEOKeywords(brandName);
  const canonicalUrl = `${SITE_URL}/brands/${slug}`;

  return {
    title,
    description,
    keywords,
    
    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Mr Franchise",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: logo,
          width: 1200,
          height: 630,
          alt: `${brandName} Franchise Logo`,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [logo],
      creator: "@mrfranchise",
    },

    // Additional metadata
    other: {
      "franchise-name": brandName,
      "franchise-location": location,
      "franchise-investment": investment || "Contact for details",
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}



/**
 * Brand layout component with structured data
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Object} props.params - Route parameters
 * @returns {JSX.Element} Layout component
 */
export default async function BrandLayout({ children, params }) {
  const { slug } = await params;
  const brand = await getBrandData(slug);

  // Generate structured data for SEO
  const structuredData = brand ? generateStructuredData(brand, slug) : null;
const logo = brand?.uploads?.logo
  return (
    <>
      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
          {/* <link rel="icon" href={logo} type="image/jpeg" /> */}
</>
      )}

      {/* Page Content */}
      {children}
    </>
  );
}



/**
 * Generates static params for pre-rendering popular brands
 * Uncomment and customize if you want static generation
 */
// export async function generateStaticParams() {
//   try {
//     let allBrands = [];
//     let page = 1;
//     const limit = 20; // backend default
//     let hasMore = true;

//     while (hasMore) {
//       const res = await fetch(
//         `http://localhost:5000/api/v1/filter/getAllBrandsAndFilter?page=${page}&limit=${limit}`,
//         { cache: "no-store" }
//       );

//       const json = await res.json();

//       const brands = Array.isArray(json?.data?.brands)
//         ? json.data.brands
//         : [];

//       allBrands.push(...brands);

//       // STOP when API returns less than limit
//       if (brands.length < limit) {
//         hasMore = false;
//       } else {
//         page++;
//       }
//     }

//     console.log("Total brands exported:", allBrands.length);

//     return allBrands.map((brand) => ({
//       slug:
//         brand.slug ||
//         brand.brandname
//           ?.toLowerCase()
//           .replace(/\s+/g, "-")
//           .replace(/[^a-z0-9-]/g, "") ||
//         String(brand.uuid),
//     }));
//   } catch (error) {
//     console.error("Failed to generate static params:", error);
//     return [];
//   }
// }
