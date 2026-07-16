import ClientPage from "../ClientPage";

export const dynamic = "force-static";
export const revalidate = 86400;

const API =
  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/filter/getAllBrandsAndFilter`;



function deslugifyCategory(slug) {
  return slug
    ?.replace("-franchise-opportunities", "")
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}



function deslugifySubCategory(slug) {
  return slug
    ?.replace(/-franchise-opportunities$/, "")
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}




async function getSubCategoryBrands(mainCategory, subCategory) {
  let page = 1;
  let all = [];

  while (true) {
    const res = await fetch(
      `${API}?maincat=${encodeURIComponent(
        mainCategory
      )}&subcat=${encodeURIComponent(subCategory)}&page=${page}`,
      { next: { revalidate: 86400 } }
    );

    const json = await res.json();
    const brands = json?.data?.brands || [];
    const pagination = json?.data?.pagination;

    all.push(...brands);

    if (!pagination?.hasNext) break;
    page++;
  }

//   console.log(`🔥 SUB TOTAL ${mainCategory} / ${subCategory}:`, all.length);
  return all;
}


export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug, subslug } = resolvedParams;

  const mainName = deslugifyCategory(slug);
  const subName = deslugifySubCategory(subslug);

  const url = `https://mrfranchise.in/${slug}/${subslug}`;

  return {
    title: `${subName} Franchise Opportunities in India 2026 | ${mainName}`,
    description: `Explore top ${subName} franchise opportunities under ${mainName} with investment, ROI, and profit details.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${subName} Franchise Opportunities | ${mainName}`,
      description: `Find best ${subName} franchises in India under ${mainName}.`,
      url: url,
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
   🔥 SUB CATEGORY PAGE
   =============================== */
export default async function SubPage({ params }) {
  const resolvedParams = await params;
  const { slug, subslug } = resolvedParams;

  const mainName = deslugifyCategory(slug);
  const subName = deslugifySubCategory(subslug);

//   console.log("🔥 MAIN:", mainName, "| SUB:", subName);

  const brands = await getSubCategoryBrands(mainName, subName);

  return (
    <ClientPage
      slug={slug}
      subslug={subslug}
      brands={brands}
      maincat={mainName}
      subcat={subName}
    />
  );
}