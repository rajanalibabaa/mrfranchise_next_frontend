// app/expandyourbrand/page.tsx   (or .jsx)
import dynamic from "next/dynamic";
import { Box, Typography } from "@mui/material";
// This is the ONLY correct way in 2025–2026
const ExpandYourBrandClient = dynamic(
  () => import("@/Components/ExpandYourBrand/ExpandYourBrandClient"),
  {
    // ssr: false, // ← This saves your build
    loading: () => (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#fffbe7",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Typography variant="h5" color="text.secondary">
          Loading MrFranchise Expansion Portal...
        </Typography>
      </Box>
    ),
  }
);

export default function ExpandYourBrandPage() {
  return <ExpandYourBrandClient />;
}

// Generate metadata (optional but recommended)
export const metadata = {
  title: "Expand Your Brand with MrFranchise.in | Franchise Your Business",
  description:
    "Turn your successful business into a scalable franchise. Get expert help with franchise model, legal docs, investor outreach & nationwide expansion.",
};