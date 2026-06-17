// app/franchise-brands/[slug]/page.js

import BrandClient from "./BrandClient";

const SITE_URL = "https://mrfranchise.in";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mrfranchisebackend.mrfranchise.in";

// ISR
export const dynamicParams = true;
export const revalidate = 86400;

// ---------------------------------------------
// slug generator
// ---------------------------------------------

function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ---------------------------------------------
// fetch with timeout
// ---------------------------------------------

async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();

  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,

      next: {
        revalidate: 86400,
      },
    });

    clearTimeout(timer);

    return res;
  } catch (error) {
    clearTimeout(timer);

    return null;
  }
}

// ---------------------------------------------
// Fetch brands
// ---------------------------------------------

async function fetchTopBrands(maxPages = 3) {
  const allBrands = [];

  for (let page = 1; page <= maxPages; page++) {
    try {
      const res = await fetch(
        `${API_BASE}/api/v1/overAllPlatformOnlyMainCategory?page=${page}&limit=50`,

        {
          next: {
            revalidate: 86400,
          },
        },
      );

      const json = await res.json();

      console.log("PAGE", page, json?.data);

      const data = json?.data || {};

      const brands = Array.isArray(data)
        ? data
        : data?.brands || data?.data || data?.results || [];

      allBrands.push(...brands);
    } catch (error) {
      console.log("fetch brand error", error);
    }
  }

  console.log("TOTAL BRANDS", allBrands.length);

  return allBrands;
}

// ---------------------------------------------
// Static URL generation
// ---------------------------------------------

// export async function generateStaticParams() {
//   const brands = await fetchTopBrands(3);

//   const paths = [];

//   const seen = new Set();

//   for (const brand of brands) {
//     const name =
//       brand?.brandDetails?.brandName ||
//       brand?.brandDetails?.companyName ||
//       brand?.brandName ||
//       brand?.companyName;

//     if (!name) continue;

//     const slugName = slugify(name);

//     const slug = `start-your-${slugName}-franchise-business-opportunity_${slugName}`;

//     if (seen.has(slug)) continue;

//     paths.push({
//       slug,
//     });

//     seen.add(slug);
//   }

//   console.log("STATIC GENERATED:", paths);

//   return paths;
// }

// ---------------------------------------------
// Metadata
// ---------------------------------------------

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const fullPath = decodeURIComponent(slug);

  // get only kfc from:
  // start-your-kfc-franchise-business-opportunity_kfc

  const brandSlug = fullPath.includes("_")
    ? fullPath.split("_").pop()
    : fullPath;

  const res = await fetchWithTimeout(
    `${API_BASE}/api/v1/brandlisting/getBrandListingSlug/${brandSlug}`,
  );

  const json = res?.ok ? await res.json() : null;

  const brand = Array.isArray(json?.data) ? json.data[0] : json?.data;

  if (!brand) {
    return {
      title: "Brand Not Found | Mr Franchise",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const name =
    brand?.brandDetails?.brandName ||
    brand?.brandDetails?.companyName ||
    brandSlug;

  const logo = brand?.uploads?.logo || "/default.jpg";

  const url = `${SITE_URL}/franchise-opportunity/${slug}`;

  const title = `Start your ${name} franchise business opportunity | Mr Franchise`;

  const description = `Start your ${name} franchise business. Get franchise cost, investment details, profit margin, ROI, requirements and apply now.`;

  return {
    title,

    description,

    keywords: [
      `${name} franchise`,

      `${name} franchise cost`,

      `${name} franchise business opportunity`,

      "best franchise in India",
    ].join(","),

    alternates: {
      canonical: url,
    },

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

          alt: name,
        },
      ],

      locale: "en_IN",

      type: "website",
    },

    robots: {
      index: true,

      follow: true,

      googleBot: {
        index: true,

        follow: true,
      },
    },
  };
}

// ---------------------------------------------
// Page
// ---------------------------------------------

export default async function Page({ params }) {
  const resolvedParams = await params;

  return <BrandClient slug={resolvedParams.slug} />;
}
