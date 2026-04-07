"use client";
import React from 'react'
import {
  Box,
  Typography,
  Link,
  
} from "@mui/material";
const FranchiseJourney = () => {
  return (
  <Box sx={{display:'flex',flexDirection:"row", justifyContent:"space-around", backgroundColor:"#ffffff", py:3, px:2}}>
  <Box>
      {/* CTA Section */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
        Start Your Franchise Journey Today
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
        If you are ready to take the next step, explore the best franchise opportunities in India and connect with top brands through MrFranchise.
      </Typography>

      <Typography sx={{ mb: 2 }}>
        👉{" "}
        <Link
          href="/franchise-opportunities-india"
          underline="hover"
          sx={{ color: "#ff9900", fontSize: "0.9rem" }}
        >
          Browse all opportunities
        </Link>
        <br />
        👉{" "}
        <Link
          href="/contact-us"
          underline="hover"
          sx={{ color: "#ff9900", fontSize: "0.9rem" }}
        >
          Talk to our expert
        </Link>
      </Typography>
</Box>
<Box>
      {/* Consultation Section */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Get Free Franchise Consultation
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
        Not sure where to start? Our experts will help you:
      </Typography>

      <Box sx={{ mb: 1 }}>
        {[
          "Choose the right franchise",
          "Understand investment and ROI",
          "Connect with top brands"
        ].map((item, index) => (
          <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
            • {item}
          </Typography>
        ))}
      </Box>

      <Link
        href="/franchise-consulting"
        underline="hover"
        sx={{ color: "#ff9900", fontSize: "0.9rem" }}
      >
        👉 Get started now
      </Link>
    </Box>
    </Box>
  )
}

export default useMemo( FranchiseJourney);