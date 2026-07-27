"use client";
import React from "react";
import {
  Box,
  Typography,
  Link,
  Grid,
  Stack,
  Divider,
} from "@mui/material";

const industries = [
  {
    emoji: "🍔",
    title: "Food Franchise Opportunities",
    desc: "The food industry is one of the most profitable and evergreen sectors in franchising. If you're planning to start your food franchise, you can explore options like QSR brands, cloud kitchens, cafes, and casual dining concepts.",
    points: [
      "Low investment food franchise",
      "Fast food franchise opportunities",
      "Cafe franchise in India",
    ],
    link: "/food-and-beverages/?maincat=Food%20%26%20Beverages",
  },
  {
    emoji: "🛍",
    title: "Retail Franchise Opportunities",
    desc: "Retail franchising offers strong growth potential with high customer demand. From fashion to electronics, retail businesses continue to expand across India.",
    points: [
      "Clothing and apparel",
      "Supermarkets and convenience stores",
      "Specialty retail outlets",
    ],
    link: "/retail/?maincat=Retail",
  },
  {
    emoji: "💇",
    title: "Salon & Beauty Franchise Opportunities",
    desc: "The beauty and wellness industry is booming, making it an excellent choice for investors looking to start your salon franchise.",
    points: [
      "Unisex salons",
      "Beauty clinics",
      "Spa and wellness centers",
    ],
    link: "/salon-franchise-india",
  },
  {
    emoji: "🎓",
    title: "Education Franchise Opportunities",
    desc: "Education franchises provide stable and long-term income opportunities. If you want to start your education franchise, options include:",
    points: [
      "Preschool franchises",
      "Coaching centers",
      "Skill development institutes",
    ],
    link: "/education/?maincat=Education",
  },
  {
    emoji: "🏥",
    title: "Healthcare & Fitness Franchise Opportunities",
    desc: "Healthcare and fitness are high-demand sectors with consistent growth.",
    points: [
      "Diagnostic centers",
      "Fitness gyms",
      "Wellness clinics",
    ],
    link: "/healthcare-franchise-india",
  },
  {
    emoji: "🚗",
    title: "Automotive Franchise Opportunities",
    desc: "The automotive industry offers diverse franchise options, from car dealerships to service centers.",
    points: [
      "Car dealerships",
      "Auto repair shops",
      "Car wash and detailing services",
    ],
    link: "/automobile/?maincat=Automobile",
  }
];

const ExploreIndustry = () => {
  return (
   <Box
  component="section"
  sx={{
    position: 'relative', // Required for ::before to stay within bounds
    pl: { xs: 2, md: 8 },
    pr: { xs: 2, md: 8 },
    py: 3,
    backgroundImage: 'url(/mrfranchise_franchise_discussion.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    color: '#fff', // Ensure text is visible over the dark overlay
    '&::before': {
      content: '""', // Must be an empty string in quotes
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1, // Keeps overlay behind text but above image
    },
    // Ensures children (text/content) appear above the overlay
    '& > *': {
      position: 'relative',
      zIndex: 2,
    },
  }}
>
      {/* Heading */}
      <Typography
        variant="h6"
        fontWeight="bold"
        color="white"
        sx={{ mt: 1, textAlign: "center" }}
      >
        Explore Franchise Opportunities by Industry
      </Typography>

      {/* Intro */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: 300,
          color: "white",
          mb: 2,
          textAlign: { xs: "justify", md: "center" },
        }}
      >
        At MrFranchise, we offer a wide range of industry-specific franchise
        opportunities tailored to different investment capacities and business
        interests.
      </Typography>

      {/* Grid */}
      <Grid container justifyContent="center" spacing={2}>
        {industries.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            key={index}
            sx={{
              width: { xs: "100%", md: "600px" },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "700px",
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f7f7f7",
                border: "1px solid #e0e0e0",
              }}
            >
              {/* Title */}
              <Stack direction="row"  spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="body1" color="black" sx={{ fontWeight: "bold" }}>
                 {item.title}
                </Typography>
              </Stack>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1 , textAlign:{ xs: 'justify', md: 'left' }}}
              >
                {item.desc}
              </Typography>

              {/* Popular options */}
              <Box sx={{ mb: 1.5, pl: 2 }}>
                {item.points.map((point, i) => (
                  <Typography
                    key={i}
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      mb: 0.25,
                      position: "relative",
                      "&:before": {
                        content: '"•"',
                        position: "absolute",
                        left: "-14px",
                        color: "#ff9900",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    {point}
                  </Typography>
                ))}
              </Box>

              {/* Link */}
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                
                underline="hover"
                sx={{
                  color: "#ff9900",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontWeight: 500,
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

export default ExploreIndustry;