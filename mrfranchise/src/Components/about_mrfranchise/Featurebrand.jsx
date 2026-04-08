"use client";
import React from "react";
import { Box, Typography, Link, } from "@mui/material";

const Featurebrand = () => {
  return (
    
    <Box sx={{
      display: "flex",
      flexDirection: {xs:"column", md:"row"},
      justifyContent:{xs:"center", md:"space-evenly"},
      // gap:2,
      flexWrap: "wrap",
      pl: { xs: 2, md: 8 },
      pr: { xs: 2, md: 8 },
        py: 3, backgroundColor: "#f9f9f9",
    
        }}>
<Box sx={{ width:{xs:"100%", md:"50%" }}}>
      {/* Section 1 */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
        Featured Franchise Brands
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 1 }}
      >
        At MrFranchise, we list carefully selected franchise brands that offer
        strong business potential and structured support systems.
      </Typography>

      <Box sx={{ mb: 1 }}>
        {[
          "Investment details",
          "Business model",
          "ROI and payback period",
          "Expansion plans",
        ].map((item, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
            • {item}
          </Typography>
        ))}
      </Box>

      <Link
        href="/franchise-brands"
        underline="hover"
        sx={{ color: "#ff9900", fontSize: "0.9rem" }}
      >
        👉 View all brands
      </Link>
</Box>


      {/* Divider space */}
      {/* <Box sx={{ mt: 3 }} /> */}

<Box sx={{ width:{xs:"100%", md:"50%" }}}>
      {/* Section 2 */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        How to Start Your Franchise Business in India
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 1 }}
      >
        Starting a franchise business is simple when you follow a structured
        approach:
      </Typography>

      <Box sx={{ mb: 1 ,}}>
        {[
          "Identify your preferred industry",
          "Choose the right investment range",
          "Shortlist franchise opportunities",
          "Connect with the brand",
          "Finalize agreement and launch",
        ].map((step, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 0.5, }}>
            {index + 1}. {step}
          </Typography>
        ))}
        <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 1 }}
      >
       MrFranchise simplifies this entire journey by connecting you directly with brands and providing expert consultation support.
      </Typography>

      <Link
        href="/how-to-start-franchise-business-india"
        underline="hover"
        sx={{ color: "#ff9900", fontSize: "0.9rem" }}
      >
        👉 Complete guide
      </Link>
      </Box>
</Box>

<Box>
      
</Box>


      {/* Divider space */}
      {/* <Box sx={{ mt: 3 }} /> */}
      
<Box sx={{ width:{xs:"100%", md:"50%" }}}>
      {/* Section 3 */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Why MrFranchise.in is the Best Platform for Franchise Opportunities
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 1 }}
      >
      We are more than just a listing platform. MrFranchise is a complete franchise growth ecosystem designed for both investors and brands.
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
        Our Key Advantages:
      </Typography>

      <Box sx={{ mb: 1 }}>
        {[
          "Verified franchise opportunities",
          "Multi-industry listings",
          "Investor-brand matching system",
          "Expert franchise consulting",
          "WhatsApp-based instant communication",
        ].map((item, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
            • {item}
          </Typography>
        ))}
      </Box>

      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 1 }}
      >
       Whether you want to start your franchise business or expand your brand through franchising, we provide end-to-end solutions.
      </Typography>
</Box>

      {/* Divider space */}
      {/* <Box sx={{ mt: 3 }} /> */}

<Box sx={{ width:{xs:"100%", md:"50%" }}}>
      {/* Section 4 */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Latest Franchise Insights & Business Guides
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mb: 1 }}
      >
       Stay updated with the latest trends, investment insights, and expert advice through our blog section.
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
        Popular topics:
      </Typography>

      <Box sx={{ mb: 1 }}>
        {[
          "Best franchise opportunities in India",
          "Low investment business ideas",
          "Franchise vs startup comparison",
        ].map((item, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
            • {item}
          </Typography>
        ))}
      </Box>

      <Link
        href="/blog"
        underline="hover"
        sx={{ color: "#ff9900", fontSize: "0.9rem" }}
      >
        👉 Read blogs
      </Link>

    </Box>
    
    </Box>
  );
};

export default  Featurebrand;