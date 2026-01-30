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
  

  return (
    <Box>
      <Box><Navbar /></Box>
  
      {/* Back to Form Button */}
  
          <MembershipSelection handleSubmit={handleSubmit} onBack={onBack} />
      {/* <Container > */}
        <Box>
         

         
        </Box>
      {/* </Container> */}
      <Box><Footer /></Box>
    </Box>
  );
};
export default AdvertisingPage;
