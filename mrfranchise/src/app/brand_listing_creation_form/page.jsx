import React from "react";
import BrandRegisterForm from "@/Components/brand_listing_components/mainregisterform";


export const metadata = {
  title: "Brand Registration | Join Mr Franchise as a Brand Partner",
  description:
    "Register your brand on Mr Franchise and connect with serious franchise investors across India. Free brand registration, fast approval, and maximum visibility.",

  keywords: [
    "brand registration",
    "franchise brand registration",
    "list franchise brand",
    "join mr franchise",
    "brand partner registration",
    "franchise listing platform",
    "sell franchise india",
  ],

  alternates: {
    canonical: "https://mrfranchise.in/brand_listing_creation_form",
  },

  openGraph: {
    title: "Brand Registration | Become a Brand Partner on Mr Franchise",
    description:
      "List your franchise brand on Mr Franchise and reach verified investors. Fast onboarding, dedicated dashboard, and nationwide exposure.",
    url: "https://mrfranchise.in/brand_listing_creation_form",
    siteName: "Mr Franchise",
    type: "website",
    images: [
      {
        url: "https://mrfranchise.in/mrfranchise_logo.avif",
        width: 1200,
        height: 630,
        alt: "Brand Registration - Mr Franchise",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Brand Registration | Mr Franchise",
    description:
      "Register your franchise brand and reach thousands of investors across India.",
    images: ["https://mrfranchise.in/mrfranchise_logo.avif"],
  },

  icons: {
    icon: "/mrfranchise_logo.avif",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const BrandRegisterPage = () => {
  return(
    <>
      <BrandRegisterForm />;

    </>
  )
  
  
};

export default BrandRegisterPage;
