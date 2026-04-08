"use client";
import React from "react";
import { Box, Typography, Link, Grid } from "@mui/material";

const locationData = [
  {
    title: "Franchise Opportunities in Chennai",
    desc: "Chennai is one of the fastest-growing markets for franchise businesses, offering excellent opportunities across food, retail, and service sectors.",
    link: "/franchise-opportunities-chennai",
  },
  {
    title: "Franchise Opportunities in Bangalore",
    desc: "Known for its startup ecosystem and high spending capacity, Bangalore is ideal for premium franchise brands.",
    link: "/franchise-opportunities-bangalore",
  },
  {
    title: "Franchise Opportunities in Hyderabad",
    desc: "A rapidly developing city with increasing demand for organized retail and food chains.",
    link: "/franchise-opportunities-hyderabad",
  },
  {
    title: "Franchise Opportunities in Mumbai",
    desc: "India’s financial capital offers high footfall and premium market opportunities.",
    link: "/franchise-opportunities-mumbai",
  },
];

const ExploreLocation = () => {
  return (
    <Box
      component="section"
      sx={{
        pl: { xs: 2, md: 8 },
      pr: { xs: 2, md: 8 },
        py: 3,
        backgroundColor: "#dedede",
      }}
    >
      {/* Heading */}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 , textAlign:"center"}}>
        Franchise Opportunities by Location
      </Typography>

      {/* Intro */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: 300,
          color: "text.primary",
          mb: 2,
          textAlign:{xs:"justify", md:" center"}
        }}
      >
        Location plays a crucial role in franchise success. Explore franchise
        opportunities in your preferred city and find the best business options.
      </Typography>

      {/* Grid */}
      <Grid container justifyContent={'center'} spacing={2}>
        {locationData.map((item, index) => (
          <Grid item xs={12} sm={12} key={index}sx={{width:"500px",gap:5, display:"flex", justifyContent:'center' }}>
            <Box sx={{ mb: 2 }}>
              
              {/* Title */}
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
                📍 {item.title}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                {item.desc}
              </Typography>

              {/* Link */}
              <Link
                href={item.link}
                underline="hover"
                sx={{
                  color: "#ff9900",
                  fontSize: "0.9rem",
                }}
              >
                 Explore {item.title}
              </Link>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ExploreLocation;