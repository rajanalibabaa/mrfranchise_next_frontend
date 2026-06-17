const SITE_URL = "https://mrfranchise.in";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mrfranchisebackend.mrfranchise.in";

function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Fetch all pages
async function getAllBrands() {
  let allBrands = [];

  let page = 1;

  let totalPages = 1;

  try {
    while (page <= totalPages) {
      const res = await fetch(
        `${API_BASE}/api/v1/overAllPlatformOnlyMainCategory?page=${page}&limit=20`,
        {
          next: {
            revalidate: 86400,
          },
        },
      );

      const json = await res.json();

      const data = json?.data || {};

      const brands = Array.isArray(data)
        ? data
        : data?.brands || data?.data || data?.results || [];

      allBrands.push(...brands);

      totalPages =
        json?.pagination?.totalPages || data?.pagination?.totalPages || 1;

      console.log(`Sitemap page ${page}/${totalPages} : ${brands.length}`);

      page++;
    }

    console.log("TOTAL BRANDS:", allBrands.length);

    return allBrands;
  } catch (error) {
    console.log("SITEMAP ERROR", error);

    return [];
  }
}

export default async function sitemap() {
  const brands = await getAllBrands();

  const brandUrls = brands
    .map((brand) => {
      const name =
        brand?.brandDetails?.brandName ||
        brand?.brandDetails?.companyName ||
        brand?.brandName ||
        brand?.companyName ||
        brand?.name;

      if (!name) {
        console.log("NAME NOT FOUND", brand);

        return null;
      }

      const slugName = slugify(name);

      const slug = `start-your-${slugName}-franchise-business-opportunity_${slugName}`;

      return {
        url: `${SITE_URL}/franchise-brands/${slug}`,

        lastModified: new Date(),

        changeFrequency: "weekly",

        priority: 0.8,
      };
    })
    .filter(Boolean);

  return [
    {
      url: SITE_URL,

      lastModified: new Date(),

      changeFrequency: "daily",

      priority: 1,
    },

    ...brandUrls,
  ];
}
