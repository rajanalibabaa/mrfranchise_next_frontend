"use client";
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
// import Lottie from 'lottie-web/build/player/lottie_light'; 
import Lottie from "lottie-react"

import loadingAnimation from '@/assets/videos/Animation - 1750051841214.json';

const GlobalLoader = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);

  // Memoize the Lottie configuration to prevent recreation on every render
  const lottieConfig = useMemo(() => ({
    animationData: loadingAnimation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      progressiveLoad: true,
    }
  }), []);

  // Early return if not loading (before any DOM calculations)
  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1300,
        backdropFilter: 'blur(2px)',
        pointerEvents: 'none',
        // Hardware acceleration for smoother animations
        transform: 'translateZ(0)',
        willChange: 'opacity',
      }}
    >
      <Box sx={{
        width: { xs: 150, sm: 200, md: 250 }, // Reduced sizes for better performance
        height: { xs: 150, sm: 200, md: 250 },
        // Contain the animation to prevent layout shifts
        contain: 'strict',
      }}>
        <Lottie 
          {...lottieConfig}
          style={{
            width: '100%',
            height: '100%',
            // Optimizations for smoother animation
            willChange: 'transform',
            transform: 'translateZ(0)',
            // Reduce animation quality slightly for performance
            rendererSettings: {
              ...lottieConfig.rendererSettings,
              quality: 'medium',
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default React.memo(GlobalLoader);