// "use client"
// import React, { lazy, Suspense, useEffect,useRef } from "react";
// // import SEO from "../../Components/SEO/Seo";
// import Navbar from "@/Components/Navbar/NavBar";
// import { Box, CircularProgress } from "@mui/material";
// import { useMediaQuery } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// // import { useLocation, useNavigate } from 'react-router-dom';
// // 
// import {useRouter,useSearchParams} from 'next/navigation'
// import { useDispatch } from 'react-redux';
// import { setFilter } from '@/Redux/Slices/FilterBrandSlice';
// import Footer from "@/Components/Footers/Footer.jsx";

// // Lazy load the BrandList component
// const BrandListNew = lazy(() => import("@/app/AllCategoryPage/BrandListAllbrands.jsx").then((module) => ({ default: module.default })));

// function BrandCategoryViewPage() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const searchParams = useSearchParams();
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const hasDispatched  = useRef(false);

 
//  useEffect(() => {
//     if (!searchParams || hasDispatched .current) return;
// const params = Object.fromEntries(searchParams.entries());
//     const filtersMap = [
//       "subcat",
//       "state",
//       "investmentRange",
//       "maincat",
//       "childcat",
//       "searchTerm",
//     ];
// let hasAnyFilter = false;

//     filtersMap.forEach((key) => {
//       const value = searchParams.get(key);
//       if (value) {
//         dispatch(setFilter({ filterName: key, value:params[key] }));
//         hasAnyFilter = true;
//       }
//     });
// hasDispatched .current = true;

//     // ✅ OPTIONAL: clean URL AFTER storing in Redux
//     const queryString = new URLSearchParams(params).toString();

// router.replace(
//   `/AllCategoryPage/allbrandlisting?${queryString}`
// );
//   }, [searchParams, dispatch, router]);

 

//   return (
//     <>
      

//       {isMobile && (
//         <Box
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             zIndex: 1000,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Navbar />
//         </Box>
//       )}

//       {!isMobile && <Navbar />}
      
//       <Box
//         component="main"
//         sx={{
//           mt: "12px",
//           ml: "12px",
//           minHeight: "calc(100vh - 64px)",
//           position: "relative",
//         }}
//       >
//         <Suspense
//           fallback={
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "200px",
//               }}
//             >
//               <CircularProgress />
//             </Box>
//           }
//         >
//           <BrandListNew />
//         </Suspense>
//       </Box>
//       <Footer />
//     </>
//   );
// }

// export default BrandCategoryViewPage

// app/AllCategoryPage/allbrandlisting/page.js


//server side rendering 

import { Suspense } from "react";
import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";
import Loading from "./loading";
import BrandListClient from "./BrandListClient";

// Dynamic import for better code splitting
const BrandListNew = dynamic(
  () => import("@/app/AllCategoryPage/BrandListAllbrands"),
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