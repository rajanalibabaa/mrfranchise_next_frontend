const API =
  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/filter/getAllBrandsAndFilter`;

export async function getAllBrands() {
  let page = 1;
  let allBrands = [];

  try {
    while (true) {
      const res = await fetch(`${API}?page=${page}`, {
        next: { revalidate: 86400 },
      });

      if (!res.ok) {
        console.error("❌ API ERROR:", res.status);
        break;
      }

      const json = await res.json();

      // ✅ FIXED STRUCTURE
      if (
        !json ||
        !json.data ||
        !Array.isArray(json.data.brands)
      ) {
        console.error("❌ INVALID API RESPONSE:", json);
        break;
      }

      const brands = json.data.brands;
      const pagination = json.data.pagination;

      allBrands.push(...brands);

      // console.log(`✅ Page ${page}: ${brands.length}`);

      if (!pagination?.hasNext) break;

      page++;
    }

    // console.log("🔥 TOTAL BRANDS:", allBrands.length);

    return allBrands;
  } catch (error) {
    console.error("❌ FETCH ERROR:", error);
    return [];
  }
}