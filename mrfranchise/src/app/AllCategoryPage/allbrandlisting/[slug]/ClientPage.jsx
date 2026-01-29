"use client";

import { Suspense } from "react";
import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";
import Loading from "../loading";
import BrandListClient from "../brandlistClient";

// Dynamic import for better code splitting
const BrandListNew = dynamic(
  () => import("../../../../Components/allbarndviewpage/brandListAllbrands"),
  {
    loading: () => <Loading />,
    ssr: true,
  }
);




export default function BrandCategoryViewPage() {
  const params = useParams();
  const slug = params?.slug || "all"; // fallback slug
  // Convert slug back to readable category
  const categoryName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()); // optional capitalization

  // Prepare initial filters for BrandListClient
  const initialFilters = {
    subcat: categoryName !== "All" ? categoryName : "",
    state: "",
    investmentRange: "",
    maincat: "",
    childcat: "",
    searchTerm: "",
    page: 1,
    limit: 20,
  };

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