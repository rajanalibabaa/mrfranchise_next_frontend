import React from "react";

const API_BASE = "http://localhost:5000";
const SITE_URL = "http://localhost:5000";

// Server fetch
async function getBrandData(slug) {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/brandlisting/getBrandListingSlug/${slug}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return Array.isArray(json?.data) ? json.data[0] : json.data;
  } catch {
    return null;
  }
}

// ✅ FIX: params must be awaited
export async function generateMetadata({ params }) {
  const { slug } = await params; // ⭐ THIS IS THE FIX
//   const decodedSlug = slug;

  const brand = await getBrandData(slug);
  const brandName = brand?.
brandDetails?.slug
console.log(brand
);

  if (!brand) {
    return {
      title: "Brand Not Found | Mr Franchise",
      description: "This franchise brand does not exist.",
      robots: "noindex",
    };
  }

  const title = `${brandName} Franchise Opportunity | Mr Franchise`;
  const description =`Start your own ${brandName} franchise. Investment, ROI & expansion details.`;
  const keywords = [
    brandName,
    `${brandName} franchise`,
    "franchise business",
    "franchise opportunity",
  ]

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${SITE_URL}/brands/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/brands/${slug}`,
      siteName: "Mr Franchise",
      images: [
        {
          url: brand?.uploads?.logo || "/default-brand.png",
          width: 1200,
          height: 630,
          alt: brandName,
        },
      ],
      type: "website",
    },
  };
}

export default function BrandLayout({ children }) {
  return <>{children}</>;
}
