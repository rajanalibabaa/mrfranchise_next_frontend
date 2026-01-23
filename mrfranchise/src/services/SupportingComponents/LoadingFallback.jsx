import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingFallback = () => (
  <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    gap: 2
  }}>
    <CircularProgress size={60} color="warning" />
    {/* <Typography variant="body1">Loading application...</Typography> */}
  </Box>
);

export default LoadingFallback;