"use client";
import React from 'react'
import {
  Box,
  Typography,
  Link,
  
} from "@mui/material";
const FranchiseJourney = () => {
  return (
  <Box sx={{display:'flex',flexDirection:{"xs":"column", "md":"row"}, justifyContent:"space-around",backgroundImage:"url(/Mrfranchise_HomePage_consulting.jpg)", backgroundSize:"contain", backgroundRepeat:"no-repeat", backgroundPosition:"center", backgroundAttachment:"fixed", py:3, px:2}}>
  <Box>
      {/* CTA Section */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
        Start Your Franchise Journey Today
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
        If you are ready to take the next step, explore the best franchise opportunities<br/> in India and connect with top brands through MrFranchise.
      </Typography>

      <Typography sx={{ mb: 2 }}>
        👉{" "}
        <Link
          href={window.open("/all-franchise-brands", "_blank")} // Open in new tab
          underline="hover"
          sx={{ color: "#000000", fontSize: "0.9rem", cursor: "pointer" }}
        >
          Browse all opportunities
        </Link>
        <br />
        👉{" "}
        <Link
          href={window.open("/contactus", "_blank")} // Open in new tab
          underline="hover"
          sx={{ color: "#000000", fontSize: "0.9rem", cursor: "pointer" }}
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
        href={window.open("https://consulting.mrfranchise.in", "_blank")} // Open in new tab
        underline="hover"
        sx={{ color: "#000000", fontSize: "0.9rem" , cursor: "pointer" }}
      >
        👉 Get started now
      </Link>
    </Box>
    </Box>
  )
}

export default  FranchiseJourney;