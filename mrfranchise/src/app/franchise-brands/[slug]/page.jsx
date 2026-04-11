import BrandClient from "./BrandClient";

const SITE_URL = "https://mrfranchise.in";

export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ FIXED
// console.log("slug data",slug);
const fullPath = decodeURIComponent(slug);
 // 1. Extract the brand name for the API call
  let brandNameForApi = fullPath;
  if (fullPath.includes('_')) {
    brandNameForApi = fullPath.split('_').pop(); 
  }


  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brandlisting/getBrandListingSlug/${brandNameForApi}`,
    { next: { revalidate: 3600 } }
  );

  const json = await res.json();
  const brand = Array.isArray(json?.data) ? json.data[0] : json.data;
  // console.log('brand data',brand);
  

  if (!brand) {
    return {
      title: "Brand Not Found | Mr Franchise",
      description: "This franchise brand does not exist.",
      robots: { index: false, follow: false },
    };
  }

  const name =
    brand?.brandDetails?.brandName ||
    brand?.brandDetails?.companyName ||
    slug;

  const logo = brand?.uploads?.logo || "/default.jpg";

  const title = `Start your ${name} franchise in India | Mr Franchise`;

  const description = `Start your ${name} franchise in India. Get complete details like investment cost, profit margin, ROI, franchise fee, requirements, and contact details. Apply now to own ${name} franchise opportunity and grow your business.`;

  const keywords = [
    `${name} franchise`,
    `${name} franchise cost`,
    `${name} franchise investment`,
    `${name} franchise profit`,
    `${name} franchise apply`,
    `${name} franchise contact number`,
    `${name} franchise requirements`,
    `${name} business opportunity`,
    "best franchise in India",
    "low investment franchise",
    "high profit franchise",
  ].join(", ");

  const url = `${SITE_URL}/franchise-brands/${slug}`;

  return {
    title,
    description,
    keywords,

    // ✅ Canonical (VERY IMPORTANT)
    alternates: {
      canonical: url,
    },

    // ✅ Open Graph (Facebook, WhatsApp)
    openGraph: {
      title,
      description,
      url,
      siteName: "Mr Franchise",
      images: [
        {
          url: logo,
          width: 1200,
          height: 630,
          alt: `${name} Franchise`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },

    // ✅ Twitter SEO
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [logo],
    },

    // ✅ Robots (Google crawling)
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}


export default async function Page({ params }) {
  const resolvedParams = await params;
  return <BrandClient slug={resolvedParams.slug} />;
} 