"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

import { useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import pop1 from '@/assets/Images/Delicious_Food.png';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import LoginPage from "@/Components/LoginPage/LoginPage";
import Image from 'next/image';



const PopupModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const router = useRouter();
  
  const [loginOpen, setLoginOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Memoized styles for better performance
  const getStyles = useCallback(() => {
    return {
      modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '95%' : isTablet ? '85%' : '65%',
        maxWidth: 650,
        bgcolor: 'background.paper',
        borderRadius: '12px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
        p: 0,
        overflow: 'hidden',
        // animation: `${slideUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
        '&:focus-visible': {
          outline: 'none',
        },
      },
      header: {
        p: isMobile ? 2 : 3,
        pb: isMobile ? 1 : 2,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #7ad03a 0%, #5cbf24 100%)',
        color: 'white',
      },
      image: {
        width: '100%',
        height: isMobile ? '25vh' : '35vh',
        objectFit: 'cover',
        objectPosition: 'center',
        transition: 'opacity 0.3s ease',
        opacity: imageLoaded ? 1 : 0,
        backgroundColor: imageLoaded ? 'transparent' : '#f5f5f5',
      },
      content: {
        p: isMobile ? 2 : 3,
        textAlign: 'center',
      },
      buttonGroup: {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'center',
        gap: 2,
        mt: 3,
        mb: 2,
      },
    };
  }, [isMobile, isTablet, imageLoaded]);

  const styles = getStyles();

  // Handle popup display logic
  useEffect(() => {
    const hasShownPopup = sessionStorage.getItem('hasShownPopup');
    if (!hasShownPopup && open !== undefined) {
      sessionStorage.setItem('hasShownPopup', 'true');
    }
  }, [open]);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  const handleNavigation = useCallback((path) => {
    router.push(path);
    handleClose();
  }, [router, handleClose]);

 
  // Preload image for better UX
  useEffect(() => {
    if (!open) return; // Only preload when modal is about to open
    const img = new window.Image();
    img.src = "/MrFranchise_food_background.png";
    img.onload = () => setImageLoaded(true);
  }, [open]);

  return (
    <>
      <Modal 
  open={open} 
  onClose={(event, reason) => {
    if (isMobile && reason === "backdropClick") {
      // Ignore backdrop click on mobile
      return;
    }
    handleClose(event, reason); // allow close otherwise
  }}
  aria-labelledby="popup-title"
  aria-describedby="popup-description"
  sx={{
    backdropFilter: 'blur(3px)',
    // animation: `${fadeIn} 0.3s ease-out`,
  }}
>
        <Box sx={styles.modal}>
          {/* Header Section */}
          <Box sx={styles.header}>
            <Typography
              id="popup-title"
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                fontSize: isMobile ? '1.4rem' : '1.7rem',
                mb: 1,
                lineHeight: 1.2,
              }}
            >
              Franchise Opportunities Await
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                opacity: 0.9,
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Connect with the best food & beverage brands
            </Typography>
          </Box>

          {/* Close Button */}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.2)',
              },
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
            }}
          >
            <CloseIcon fontSize={isMobile ? 'small' : 'medium'} />
          </IconButton>

     
          <Box sx={{ position: 'relative',overflow: 'hidden',width: '100%', height: isMobile ? '25vh' : '35vh' }}>
            <Image 
              src='/MrFranchise_food_background.png' 
              alt="Franchise opportunities" 
              fill={true}
              style={{
                objectFit: 'cover',
              }}
              loading="lazy"
              decoding="async"
            />
            {!imageLoaded && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Loading image...
                </Typography>
              </Box>
            )}
          </Box>

          {/* Content Section */}
          <Box sx={styles.content}>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2, 
                color: 'text.secondary',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Join our network of investors and brands to discover profitable franchise opportunities in the food & beverage industry.
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Action Buttons */}
            <Box sx={styles.buttonGroup}>
              <Button
                variant="contained"
                onClick={() => handleNavigation("/invester_register")}
                sx={{
                  bgcolor: "#7ad03a",
                  "&:hover": { bgcolor: "#5cbf24" },
                  minWidth: isMobile ? '100%' : 200,
                  py: isMobile ? 1 : 1.5,
                  fontWeight: 600,
                  // animation: `${pulse} 2s infinite`,
                  boxShadow: '0 4px 15px rgba(122, 208, 58, 0.3)',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                }}
                fullWidth={isMobile}
              >
                Investor Register
              </Button>

              <Button
                variant="contained"
                onClick={() => handleNavigation("/brand_listing_creation_form")}
                sx={{
                  bgcolor: "#e99830",
                  "&:hover": { bgcolor: "#d18722" },
                  minWidth: isMobile ? '100%' : 200,
                  py: isMobile ? 1 : 1.5,
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(233, 152, 48, 0.3)',
                  fontSize: isMobile ? '0.875rem' : '1rem',
                }}
                fullWidth={isMobile}
              >
                Brand Register
              </Button>
            </Box>

            {/* Login Link */}
            {/* <Typography 
              variant="body2" 
              sx={{ 
                mt: 2, 
                color: 'text.secondary',
                fontSize: isMobile ? '0.8rem' : '0.875rem'
              }}
            >
              Already have an account?{' '}
              <Box
                component="span"
                onClick={openLoginPopup}
                sx={{
                  color: "primary.main",
                  fontWeight: 600,
                  cursor: 'pointer',
                  "&:hover": { textDecoration: 'underline' },
                }}
              >
                Sign In
              </Box>
            </Typography> */}
          </Box>
        </Box>
      </Modal>

      {/* Login Modal */}
      <LoginPage
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={() => setLoginOpen(false)}
      />
    </>
  );
};

export default React.memo(PopupModal);