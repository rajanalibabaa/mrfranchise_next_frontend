"use client";
import React from "react";
import { Box, Typography, Link, Grid, Stack } from "@mui/material";

const investmentData = [
  {
    emoji: "💰",
    title: "Franchise Under ₹5 Lakhs",
    desc: "Ideal for first-time entrepreneurs looking for low investment franchise opportunities.",
    link: "/franchise-under-5-lakhs",
  },
  {
    emoji: "💼",
    title: "Franchise Under ₹10 Lakhs",
    desc: "Perfect for small business investors aiming for moderate returns.",
    link: "/franchise-under-10-lakhs",
  },
  {
    emoji: "🏢",
    title: "Franchise Under ₹20 Lakhs",
    desc: "Suitable for expanding entrepreneurs who want to build scalable businesses.",
    link: "/franchise-under-20-lakhs",
  },
  {
    emoji: "🏬",
    title: "Premium Franchise Opportunities",
    desc: "High-investment, high-return business models with established brand recognition.",
    link: "/premium-franchise-opportunities",
  },
];

const ExploreInvestment = () => {
  return (
    <Box
      component="section"
      sx={{
        pl: { xs: 2, md: 8 },
        pr: { xs: 2, md: 8 },
        py: 3,
        backgroundColor: "#f7f7f7",
      }}
    >
      {/* Heading */}
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mt: 1, textAlign: "center" }}
      >
        Franchise Opportunities Based on Investment
      </Typography>

      {/* Intro */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: 300,
          color: "text.primary",
          mb: 2,
          textAlign: "center",
        }}
      >
        Choosing the right investment range is critical when selecting a franchise.
        MrFranchise helps you identify the best franchise opportunities based on your budget.
      </Typography>

      {/* Grid */}
      <Grid display={'grid'} gridTemplateColumns={'repeat(2, 1fr)'} gap={1} spacing={2} margin="0 auto" justifyContent="center">
        {investmentData.map((item, index) => (
          <Grid item xs={12} sm={12} md={6} key={index} mb={2.5}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#dedede",
                border: "1px solid #e0e0e0",
                height: "90%",
                
              }}
            >
              {/* Title */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {item.emoji} {item.title}
                </Typography>
              </Stack>

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

export default ExploreInvestment;