"use client";

import { Suspense } from "react";
import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";
import Loading from "../allcategorypage/allbrandlisting/loading";

// Dynamic import for better code splitting
const BrandListNew = dynamic(
  () => import("../../Components/allbarndviewpage/brandListAllbrands"),
  {
    loading: () => <Loading />,
    ssr: true,
  }
);




export default function BrandCategoryViewPage() {
  const params = useParams();
  const slug = params.slug;
  
   

  const slugToEncoded = decodeURIComponent(slug);

  

 

  return (
    <>
    

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
            <BrandListNew />
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