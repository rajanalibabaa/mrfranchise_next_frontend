import ClientPage from "../ClientPage";

export const dynamic = "force-static";
export const revalidate = 86400;

const API =
  "http://localhost:5000/api/v1/filter/getAllBrandsAndFilter";

/* ===============================
   🔧 SLUG HELPERS - MAIN
   =============================== */
function slugifyCategory(cat) {
  return (
    cat
      ?.toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .trim() + "-franchise-opportunities"
  );
}

function deslugifyCategory(slug) {
  return slug
    ?.replace("-franchise-opportunities", "")
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ===============================
   🔧 SLUG HELPERS - SUB
   =============================== */
function slugifySubCategory(sub) {
  return (
    sub
      ?.toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .trim() + "-franchise-opportunities"
  );
}

function deslugifySubCategory(slug) {
  return slug
    ?.replace(/-franchise-opportunities$/, "")
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ===============================
   🔧 FETCH ALL BRANDS
   =============================== */
async function getAllBrands() {
  let page = 1;
  let allBrands = [];

  while (true) {
    const res = await fetch(`${API}?page=${page}`, {
      next: { revalidate: 86400 },
    });

    const json = await res.json();
    const brands = json?.data?.brands || [];
    const pagination = json?.data?.pagination;

    allBrands.push(...brands);

    // console.log(`✅ [SUB] Page ${page}: ${brands.length}`);

    if (!pagination?.hasNext) break;
    page++;
  }

//   console.log("🔥 [SUB] TOTAL BRANDS:", allBrands.length);
  return allBrands;
}

/* ===============================
   🔧 FETCH BY MAIN + SUB
   =============================== */
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

/* ===============================
   🔥 GENERATE STATIC PARAMS
   SUB CATEGORIES ONLY
   =============================== */
// export async function generateStaticParams() {
//   const brands = await getAllBrands();

//   // ✅ Use Set to avoid duplicate main+sub combos
//   const subSet = new Set();

//   brands.forEach((b) => {
//     const main = b?.brandCategories?.main;
//     const subs = b?.brandCategories?.sub;

//     if (!main) return;

//     // ✅ Handle sub as array or single string
//     const subList = Array.isArray(subs)
//       ? subs
//       : subs
//       ? [subs]
//       : [];

//     subList.forEach((sub) => {
//       if (sub) subSet.add(`${main}||${sub}`);
//     });
//   });

//   const params = Array.from(subSet).map((key) => {
//     const [main, sub] = key.split("||");
//     return {
//       slug: slugifyCategory(main),
//       subslug: slugifySubCategory(sub),
//     };
//   });

// //   console.log("🔥 TOTAL SUB STATIC PARAMS:", params.length);

//   // ✅ Output will look like:
//   // { slug: "food-and-beverages-franchise-opportunities", subslug: "pizza-franchise" }
//   // { slug: "food-and-beverages-franchise-opportunities", subslug: "burger-franchise" }
//   // { slug: "retail-franchise-opportunities", subslug: "clothing-franchise" }

//   return params;
// }

/* ===============================
   🔥 SEO METADATA
   =============================== */
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