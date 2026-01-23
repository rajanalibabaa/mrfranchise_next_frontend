// app/AllCategoryPage/allbrandlisting/layout.js

export const metadata = {
  title: "Explore All Franchise Brands | Mr Franchise",
  description:
    "Discover top franchise opportunities across India. Filter by category, investment range, location and find the perfect business opportunity for you.",
  keywords: [
    "franchise opportunities",
    "business franchise India",
    "low investment franchise",
    "food franchise",
    "retail franchise",
    "service franchise",
  ],
  openGraph: {
    title: "Explore All Franchise Brands | Mr Franchise",
    description:
      "Find the best franchise opportunities across India with filters for investment, location, and category.",
    url: "https://fb.mrfranchise.in/AllCategoryPage/allbrandlisting",
    siteName: "Mr Franchise",
    images: [
      {
        url: "https://fb.mrfranchise.in/og-image-brands.jpg",
        width: 1200,
        height: 630,
        alt: "Franchise Brands",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore All Franchise Brands",
    description: "Discover top franchise opportunities across India",
    images: ["https://fb.mrfranchise.in/og-image-brands.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://fb.mrfranchise.in/AllCategoryPage/allbrandlisting",
  },
};

export default function BrandListingLayout({ children }) {
  return <>{children}</>;
}