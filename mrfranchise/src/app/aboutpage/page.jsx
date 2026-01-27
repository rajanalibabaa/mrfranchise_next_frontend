// ❌ DO NOT add "use client" here
import AboutUs from "./aboutus_client";

export const metadata = {
  title:
    "About MrFranchise – Leading Franchise Consulting Company in Chennai, India",

  description:
    "MrFranchise is a trusted franchise consulting company in Chennai helping brands expand across India through structured franchise models, investor onboarding, and scalable growth strategies.",

  keywords: [
    "franchise consulting company in chennai",
    "franchise consultants in india",
    "franchise expansion services",
    "franchise business consultants",
    "franchise development company",
    "mr franchise",
  ],

  alternates: {
    canonical: "https://mrfranchise.in/aboutpage",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title:
      "About MrFranchise | Franchise Consulting Company in Chennai & India",
    description:
      "Trusted franchise consultants helping businesses scale across India through franchise expansion, investor onboarding, and proven growth strategies.",
    url: "https://mrfranchise.in/aboutpage",
    siteName: "MrFranchise",
    type: "website",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "About MrFranchise – Franchise Consulting Company in Chennai",
    description:
      "Helping brands scale across India with franchise expansion and investor onboarding.",
  },
};

export default function Page() {
  return <AboutUs />;
}
