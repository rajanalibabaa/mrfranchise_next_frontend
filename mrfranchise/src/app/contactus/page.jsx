import ContactForm from "./contactus_client.jsx";

export const metadata = {
  title: "Contact MrFranchise | Franchise Consulting Company in Chennai",
  description: "Get in touch with MrFranchise, a leading franchise consulting company in Chennai. Contact us for franchise expansion, investor onboarding, and expert franchise consultation across India.",
  keywords: [
    "contact mrfranchise",
    "franchise consulting company in chennai contact",
    "franchise consultants chennai",
    "franchise business enquiry",
    "mr franchise contact",
  ],
  alternates: {
    canonical: "https://mrfranchise.in/contactus",
  },
  robots: {  
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Contact MrFranchise | Franchise Consulting Company in Chennai",
    description: "Reach out to MrFranchise for franchise consulting, expansion strategy, and investor onboarding services across India.",
    url: "https://mrfranchise.in/contactus",
    siteName: "MrFranchise",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact MrFranchise – Franchise Consulting Experts",
    description: "Talk to our franchise experts today. Fast response, free consultation.",
  },
};

export default function ContactPage() {
  return <ContactForm />;
}