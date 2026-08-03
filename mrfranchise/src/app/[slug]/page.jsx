import ClientPage from "./ClientPage";

export const dynamic = "force-static";
export const revalidate = 86400;

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/filter/getAllBrandsAndFilter`;

function deslugifyCategory(slug) {
  const specialWords = {
    fmcg: "FMCG",
  };

  return slug
    ?.replace("-franchise-opportunities", "")
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();
      return (
        specialWords[lower] ||
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );
    })
    .join(" ");
}

function deslugifySubCategory(slug) {
  return slug
    ?.replace(/-franchise$/, "")
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function getCategoryBrands(category, subcategory) {
  let page = 1;
  let all = [];

  while (true) {
    // ─── if subcategory exists → filter by both ───
    const url = subcategory
      ? `${API}?maincat=${encodeURIComponent(
          category,
        )}&subcat=${encodeURIComponent(subcategory)}&page=${page}`
      : `${API}?maincat=${encodeURIComponent(category)}&page=${page}`;

    const res = await fetch(url, { next: { revalidate: 86400 } });

    const json = await res.json();
    const brands = json?.data?.brands || [];
    const pagination = json?.data?.pagination;

    all.push(...brands);

    if (!pagination?.hasNext) break;
    page++;
  }

  // console.log(`🔥 TOTAL ${category} / ${subcategory ?? "ALL"}:`, all.length);
  return all;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug, subslug } = resolvedParams;

  const mainName = deslugifyCategory(slug);
  const subName = subslug ? deslugifySubCategory(subslug) : null;

  const url = subslug
    ? `https://mrfranchise.in/${slug}/${subslug}`
    : `https://mrfranchise.in/${slug}`;

  const title = subName
    ? `${subName} Franchise Opportunities in India 2026 | ${mainName}`
    : `${mainName} Franchise Opportunities in India 2026`;

  const description = subName
    ? `Explore top ${subName} franchise opportunities under ${mainName} with investment, ROI, and profit details.`
    : `Discover best ${mainName} franchise opportunities with investment, ROI, and profit details.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Mr Franchise",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/* ===============================
   🔥 MAIN PAGE
   =============================== */
export default async function Page({ params }) {
  const resolvedParams = await params;
  const { slug, subslug } = resolvedParams;

  // 🔥 Convert slug → real names
  const mainName = deslugifyCategory(slug);
  const subName = subslug ? deslugifySubCategory(subslug) : null;

  // console.log("🔥 MAIN:", mainName, "| SUB:", subName ?? "NONE");

  // 🔥 Fetch brands — pass sub only if exists
  const brands = await getCategoryBrands(mainName, subName);

  return (
    <ClientPage
      slug={slug}
      subslug={subslug ?? null}
      brands={brands}
      maincat={mainName}
      subcat={subName}
    />
  );
}
