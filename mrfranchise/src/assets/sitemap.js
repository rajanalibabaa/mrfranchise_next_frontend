const SITE_URL = "https://mrfranchise.in";

export default async function sitemap() {
  let urls = [];

  // ✅ STATIC PAGES
  urls.push(
    { url: SITE_URL, lastModified: new Date(), priority: 1 },
    { url: `${SITE_URL}/all-franchise-brands`, lastModified: new Date(), priority: 0.9 },
    { url: `${SITE_URL}/food-and-beverages-franchise-opportunities`, lastModified: new Date(), priority: 0.9 },
    { url: `${SITE_URL}/others-franchise-opportunities `, lastModified: new Date(), priority: 0.9 },
    { url: `${SITE_URL}/retail-franchise-opportunities `, lastModified: new Date(), priority: 0.9 },


    { url: `${SITE_URL}/brand_listing_creation_form`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/aboutpage`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE_URL}/contactus`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE_URL}/expandyourbrand`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE_URL}/investfranchise`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE_URL}/advertisewithus`, lastModified: new Date(), priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), priority: 0.8 },
    { url: `${SITE_URL}/privacypolicy`, lastModified: new Date(), priority: 0.6 }
  );

  let page = 1;
  let hasNextPage = true;
  const limit = 20;

  while (hasNextPage) {
    const res = await fetch(
      `http://localhost:5000/api/v1/overAllPlatformOnlyMainCategory?page=${page}&limit=${limit}`
    );

    if (!res.ok) {
      console.warn(`sitemap: failed to fetch page ${page} (status ${res.status})`);
      break;
    }

    const json = await res.json();

    // 🔥 HANDLE BOTH API STRUCTURES
    const data = json?.data ?? {};
    const brands = Array.isArray(data)
      ? data
      : data?.brands || [];

    const pagination = data?.pagination ?? json?.pagination ?? {};

    urls.push(
      ...brands
        .filter((b) => b?.slug)
        .map((brand) => ({
          url: `${SITE_URL}/franchise-brands/${brand.slug}`,
          lastModified: new Date(),
          priority: 0.8,
        }))
    );

    if (pagination?.hasNext !== undefined) {
      hasNextPage = pagination.hasNext;
    } else if (pagination?.hasNextPage !== undefined) {
      hasNextPage = pagination.hasNextPage;
    } else if (pagination?.totalPages !== undefined) {
      hasNextPage = page < pagination.totalPages;
    } else {
      hasNextPage = false;
    }

    page += 1;
  }

  return urls;
}