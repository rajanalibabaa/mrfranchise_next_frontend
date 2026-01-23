"use client";
import { useState } from 'react';
import Box from '@mui/material/Box';
import MembershipSelection from './MembershipPayment';
// import BannerAdsSelection from './PaymentPAge/HomePageAdsLeads';
// import PaymentPage from './PaymentPage';
import Navbar from '@/Components/Navbar/NavBar';
import Footer from '@/Components/Footers/Footer';
// import { useNavigate, useLocation } from 'react-router-dom';

// const steps = ['Select Membership', 'Banner Ads', 'Payment'];

const AdvertisingPage = ({ handleSubmit, onBack }) => {
  // const [activeStep, setActiveStep] = useState(0);
  // const [membership, setMembership] = useState(null);
  // const [banners, setBanners] = useState([]);
  // const theme = useTheme();
  // const navigate = useNavigate();
  // const location = useLocation();

  // const handleMembershipSelect = (selectedMembership) => {
  //   setMembership(selectedMembership);
  //   handleNext();
  // };
  
  // const handleBannerSelect = (selectedBanners) => {
  //   setBanners(selectedBanners);
  //   handleNext();
  // };
  
  // const handlePaymentSubmit = (paymentData) => {
  //   // console.log('Payment submitted:', paymentData);
  //   alert('Payment successful! Thank you for your purchase.');
  // };

  // const handleNext = () => {
  //   setActiveStep((prevStep) => prevStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevStep) => prevStep - 1);
  // };
  // const handleGoToHome = () => {
  //   navigate('/');
  // };
  // const handleSkip = () => {
  //   if (activeStep === 1) {
  //     setBanners([]); 
  //   }
  //   handleNext();
  // };

  // const getStepContent = (step) => {
  //   switch (step) {
  //     case 0:
  //       return ;
  //     case 1:
  //       return (
  //         <PaymentPage 
  //           membership={membership}
  //           onSubmit={handleSubmit}
  //           banners={banners}
  //           onBack={handleBack}
  //           formData={formData}
  //         />
  //       );
  //     default:
  //       throw new Error('Unknown step');
  //   }
  // };

  return (
    <Box>
      <Box><Navbar /></Box>
  
      {/* Back to Form Button */}
  
          <MembershipSelection handleSubmit={handleSubmit} onBack={onBack} />
      {/* <Container > */}
        <Box>
          {/* <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              textAlign: 'center',
              mb: 4,
              background: 'linear-gradient(90deg, #ffad33, #6fff00fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}
          >
            Advertising Membership
          </Typography> */}
          
          {/* <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              '& .MuiStepConnector-line': {
                borderColor: theme.palette.divider
              }
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-completed': {
                        color: theme.palette.success.main,
                      },
                      '&.Mui-active': {
                        color: theme.palette.primary.main,
                      },
                    }
                  }}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: '0.875rem',
                      '&.Mui-active, &.Mui-completed': {
                        color: theme.palette.primary.main,
                      },
                    },
                    cursor: 'pointer', // visually indicate click
                    transition: 'transform 0.18s',
                    '&:hover': {
                      transform: 'scale(1.07)',
                      color: theme.palette.primary.main,
                    }
                  }}
                  onClick={() => setActiveStep(index)}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper> */}
        
          {/* <Box >
            {getStepContent(activeStep)}
          </Box> */}

         
        </Box>
      {/* </Container> */}
      <Box><Footer /></Box>
    </Box>
  );
};
export default AdvertisingPage;
