"use client";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import  Favorite  from "@mui/icons-material/Favorite";
import BrandCard from "./BrandCard";
import { useMemo } from "react"; 

const LikedTab = ({ 
  items = [], 
  isLoading, 
  errorMessage, 
  currentPage = 1, 
  totalPages = 1,
  handlePageChange,
  likedStates = {},
  shortlistedStates = {},
  onViewDetails,
  onToggleLike,
  onToggleShortlist,
  isPaginating
}) => {
   const sortedItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    
    return [...items].reverse();
  }, [items]);

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
      {isPaginating && <LinearProgress sx={{ width: '100%', mb: 2 }} />}
    {sortedItems.length > 0 ? (
        <>
          <Grid container spacing={3} justifyContent="center">
           {sortedItems.map((item) =>(
              <Grid item xs={12} sm={6} md={4} lg={2.5} key={item?.uuid || Math.random()}>
                <BrandCard 
                  item={item} 
                  type="liked"
                  likedStates={likedStates}
                  shortlistedStates={shortlistedStates}
                  onViewDetails={onViewDetails}
                  onToggleLike={onToggleLike}
                  onToggleShortlist={onToggleShortlist}
                />
              </Grid>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ py: 10, textAlign: 'center' }}>
          <Favorite color="disabled" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6">No liked brands yet</Typography>
          <Typography>Like brands to save them for later</Typography>
        </Box>
      )}
    </>
  );
};

export default LikedTab;