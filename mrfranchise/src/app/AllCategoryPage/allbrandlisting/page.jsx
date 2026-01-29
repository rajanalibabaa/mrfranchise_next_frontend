

//server side rendering 

import { Suspense } from "react";
import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";
import Loading from "./loading";
import BrandListClient from "./brandlistClient";

// Dynamic import for better code splitting
const BrandListNew = dynamic(
  () => import("@/app/allcategorypage/brandListAllbrands"),
  {
    loading: () => <Loading />,
    ssr: true,
  }
);






export default async function BrandCategoryViewPage({ searchParams }) {
  // Extract filters from URL
  const initialFilters = {
    subcat: searchParams?.subcat || "",
    state: searchParams?.state || "",
    investmentRange: searchParams?.investmentRange || "",
    maincat: searchParams?.maincat || "",
    childcat: searchParams?.childcat || "",
    searchTerm: searchParams?.searchTerm || "",
  };

  
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Franchise Brands Directory",
            description: "Explore all franchise opportunities across India",
            url: "https://mrfranchise.in/AllCategoryPage/allbrandlisting",
            mainEntity: {
              "@type": "ItemList",
              name: "Franchise Brands",
              description: "List of franchise opportunities",
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://mrfranchise.in",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "All Brands",
                  item: "https://mrfranchise.in/AllCategoryPage/allbrandlisting",
                },
              ],
            },
          }),
        }}
      />

      {/* Navbar */}
      <NavbarWrapper />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          mt: { xs: "70px", sm: "12px" },
          mx: { xs: 1, md: 2 },
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Suspense fallback={<Loading />}>
          <BrandListClient initialFilters={initialFilters}>
            <BrandListNew />
          </BrandListClient>
        </Suspense>
      </Box>

      {/* Footer */}
      <Footer />
    </>
  );
}

// Separate client wrapper for Navbar (handles responsive logic)
function NavbarWrapper() {
  return <Navbar />;
}
