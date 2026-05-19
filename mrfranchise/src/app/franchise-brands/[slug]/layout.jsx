import React from "react";


const API_BASE =  `${process.env.NEXT_PUBLIC_API_URL}`;
const SITE_URL =  "https://mrfranchise.in";

// export const dynamic = "force-dynamic";
export const revalidate = 3600;

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
    "url": `${SITE_URL}/franchise-brands/${slug}`,
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

function cleanSlug(slug) {
  return slug
    ?.toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60); // 🔥 VERY IMPORTANT (keep small)
}

export async function generateStaticParams() {
  try {
    let allSlugs = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await fetch(
        `https://mrfranchisebackend.mrfranchise.in/api/v1/overAllPlatformOnlyMainCategory?page=${page}&limit=20`,
        { next: { revalidate: 3600 } }
      );

      if (!res.ok) break;

      const json = await res.json();

      const data = json?.data ?? {};
      const brands = Array.isArray(data) ? data : data?.brands || [];

      // ✅ Extract slug
       const slugs = brands
      .filter((b) => b?.slug)
      .map((b) => ({
        slug: cleanSlug(b.slug), // ✅ MUST USE THIS
      }));

      allSlugs.push(...slugs);

      // ✅ Pagination logic
      const pagination = data?.pagination ?? json?.pagination ?? {};

      if (pagination?.hasNext !== undefined) {
        hasMore = pagination.hasNext;
      } else if (pagination?.hasNextPage !== undefined) {
        hasMore = pagination.hasNextPage;
      } else if (pagination?.totalPages !== undefined) {
        hasMore = page < pagination.totalPages;
      } else {
        hasMore = false;
      }

      page += 1;
    }

    // console.log("✅ Total slugs generated:", allSlugs.length);

    return allSlugs;
  } catch (error) {
    console.error("❌ Static params error:", error);
    return [];
  }
}
