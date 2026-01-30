// app/all-franchise-brands/loading.js
'use client';
import { Box, Skeleton, Grid } from "@mui/material";

export default function Loading() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header Skeleton */}
      <Skeleton
        variant="rectangular"
        height={60}
        sx={{ mb: 2, borderRadius: 2 }}
      />

      {/* Filter Bar Skeleton */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rounded" width={120} height={40} />
        ))}
      </Box>

      {/* Brand Cards Skeleton */}
      <Grid container spacing={3}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
                bgcolor: "#fff",
              }}
            >
              <Skeleton variant="rectangular" height={180} />
              <Box sx={{ p: 2 }}>
                <Skeleton variant="text" width="70%" height={28} />
                <Skeleton variant="text" width="50%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Skeleton variant="rounded" width={60} height={24} />
                  <Skeleton variant="rounded" width={80} height={24} />
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}