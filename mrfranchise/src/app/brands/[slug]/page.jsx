// app/franchise-brands/[slug]/page.js

import BrandClient from "./BrandClient";

const SITE_URL = "https://mrfranchise.in";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ;

// ISR
export const dynamicParams = true;
export const revalidate = 86400;


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

  const url = `${SITE_URL}/brands/${slug}`;

  const title = `${name} Business Opportunity`;

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


export default async function Page({ params }) {
  const resolvedParams = await params;

  return <BrandClient slug={resolvedParams.slug} />;
}
