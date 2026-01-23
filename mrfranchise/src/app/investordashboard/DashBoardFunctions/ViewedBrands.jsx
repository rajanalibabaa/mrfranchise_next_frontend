"use client";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Visibility } from "@mui/icons-material";
import BrandCard from "./BrandCard";

const ViewedBrands = ({ 
  brands = [],         
  currentPage = 1,
  totalPages,       
  likedStates = {},      
  shortlistedStates = {}, 
  isLoading = false,
  errorMessage = null,
  handlePageChange,
  onPageChange = () => {}   // ✅ callback from parent
}) => {
  // Safe array access and pagination
  const safeBrands = Array.isArray(brands) ? brands : [];
 
 

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography color="error">{errorMessage}</Typography>
      </Box>
    );
  }

  return (
    <>
      {safeBrands.length > 0 ? (
        <>
          <Grid container spacing={3} justifyContent="center">
            {brands.map((item) => {
              if (!item) return null;
              return (
                <Grid item xs={12} sm={6} md={4} lg={2.5} key={item.uuid || Math.random()}>
                  <BrandCard 
                    item={item} 
                    type="viewed"
                    likedStates={likedStates}
                    shortlistedStates={shortlistedStates}
                  />
                </Grid>
              );
            })}
          </Grid>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
              <Pagination
                count={totalPages}
                page={Math.min(currentPage, totalPages)}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1rem',
                    '&.Mui-selected': {
                      fontWeight: 'bold',
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Visibility color="disabled" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6">No viewed brands</Typography>
          <Typography>Brands you view will appear here</Typography>
        </Box>
      )}
    </>
  );
};

export default ViewedBrands;
