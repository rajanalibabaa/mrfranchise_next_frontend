"use client";


import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";


const categories = [
  {
    title: "Food and Beverage Franchise",
    maincat: "Food & Beverages",
    items: [
      "Quick Service Restaurants (QSR) Franchise",
      "Tea, Coffee & Cafe Chains Franchise",
      "Bakery, Confectionery & Traditional Sweets Franchise",
      "Fine Dining & Casual Dining Restaurants Franchise",
      "Cloud Kitchens & Food Delivery Franchise",
      "Ice Cream & Frozen Desserts Franchise",
      "Bars, Pubs & Lounges Franchise",
      "Juice, Smoothie & Health Beverages Franchise",
    ],
  },
  {
    title: "Retail Franchise",
    maincat: "Retail",
    items: [
      "Apparel & Fashion Retail Franchise",
      "Footwear & Accessories Franchise",
      "Electronics & Appliances Franchise",
      "Grocery & Supermarket Franchise",
      "Health, Pharmacy & Wellness Franchise",
      "Beauty, Cosmetics & Personal Care Franchise",
      "Jewellery & Luxury Retail Franchise",
      "Furniture, Home & Lifestyle Franchise",
      "Kids, Baby & Toy Stores Franchise",
      "Books, Stationery & Gifts Franchise",
      "Sports, Fitness & Outdoor Retail Franchise",
      "Specialty & Niche Retail Franchise"
    ],
  },
  {
    title: "Education Franchise",
    maincat: "Education",
    items: [
      "Pre-School & Early Childhood Education Franchise",
      "K-12 School Education Franchise",
      "Coaching & Test Preparation Franchise",
      "Higher Education & Professional Colleges Franchise",
      "Skill Development & Vocational Training Franchise",
      "IT, Digital & Tech Training Franchise",
      "Creative Arts & Media Education Franchise",
      "Language & Personality Development Franchise",
      "Health, Medical & Paramedical Education Franchise",
      "Sports, Fitness & Physical Education Franchise",
      "Special Education & Inclusive Learning Franchise"
    ],
  },
  {
    title: "Automobile Franchise",
    maincat: "Automobile",
    items: ["Automobile Sales & Dealerships Franchise", "Electric Vehicles (EV) Franchise", "Automobile Service & Repair Franchise", "Car Care, Detailing & Accessories Franchise","Mobility, Rental & Fleet Services Franchise","Spare Parts & Components Franchise","Tyres, Batteries & Consumables Franchise",
        "Commercial Vehicles & Industrial Mobility Franchise"
    ],
  },
  {
    title: "Service Franchise",
    maincat: "Service",
    items: [
      "Business & Professional Services Franchise",
      "Home & Facility Services Franchise",
      "IT & Digital Services Franchise",
      "Financial & Insurance Services Franchise",
      "Healthcare & Wellness Services Franchise",
      "Beauty, Lifestyle & Personal Care Franchise",
      "Logistics, Transport & Mobility Franchise",
      "Hospitality, Events & Entertainment Franchise",
      "Real Estate & Property Services Franchise",
      "Security, Manpower & Staffing Franchise",
      "Repair, Maintenance & Technical Services Franchise"
    ],
  }
 
];

const BusinessOpportunities = () => {
  const theme = useTheme();

  // Detect screen size
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Track expanded categories
  const [expanded, setExpanded] = useState({});

  const handleToggle = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        pl: { xs: 2, md: 8 },
        pr: { xs: 2, md: 8 },
        py:{ xs: 1, md: 3 },
      }}
    >
      {/* Heading */}
      <Typography
        // variant={{ xs: "h2", md: "h3" }}
        // fontWeight="bold"
        fontSize={{xs:'0.9 rem',md:"1.3rem"}}
        fontWeight={"bold"}
        sx={{ mb: 2, color: "#333", textAlign: "center" }}
      >
        Franchise Business Opportunities
      </Typography>

      {/* Grid */}
      <Grid  spacing={1.3} >
        {categories.map((cat, index) => {
          const isExpanded = expanded[index];

          // Show only 3 items on mobile/tablet
          const visibleItems = isMobileOrTablet
            ? isExpanded
              ? cat.items
              : cat.items.slice(0, 3)
            : cat.items;

          return (
            <Grid item xs={3} sm={6} md={3} key={index}>
              {/* Category Title */}
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ mb: 0.5, color: "#444" }}
              >
                {cat.title}
              </Typography>

             <Box
  sx={{
    display: "flex",
    flexWrap: "wrap", // allows items to move to next row
    gap: 1, // spacing between items
  }}
>
  {visibleItems.map((item, i) => {
    const subcatParam = item.replace(/ Franchise$/, "");

    return (
      <Link
        key={i}
        href={`/all-franchise-brands/?maincat=${encodeURIComponent(
          cat.maincat
        )}&subcat=${encodeURIComponent(subcatParam)}`}
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
        sx={{
          color: "#555",
          cursor: "pointer",
          variant: "body2", 
          fontSize: { xs: "1.0rem", md: "0.95rem" },
          "&:hover": {
            color: "#000",
            textDecoration: "underline",
          },
        }}
      >
        {item} |
      </Link>
    );
  })}
</Box>
   

              {/* View More / View Less (Only Mobile/Tablet) */}
              {isMobileOrTablet && cat.items.length > 3 && (
                <Typography
                  onClick={() => handleToggle(index)}
                  sx={{
                    cursor: "pointer",
                    color: "#ff9900",
                      fontSize: { xs: "1.0rem", md: "0.7rem" },
                    fontWeight: 500,
                    mt: 1,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {isExpanded ? "View Less" : "View More"}
                </Typography>
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default BusinessOpportunities;