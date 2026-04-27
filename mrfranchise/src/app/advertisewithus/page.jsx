"use client";

import { useState } from 'react';
import Box from '@mui/material/Box';
import Navbar from '@/Components/Navbar/NavBar';
import Footer from '@/Components/Footers/Footer';
import PaymentBrandUpdate from './PaymentBrandUpdate';
import PackageSelection from './PackageSelection';
import useUserLocation  from '@/config/useUserLocations';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AdvertisingPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [investmentRangeData, setInvestmentRangeData] = useState(null);

  const handleAddInvestmentRange = (range, investmentRangeLabel) => {
    setInvestmentRangeData({ range, investmentRangeLabel });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => setInvestmentRangeData(null), 500); // Clean up after close
  };

  return (
    <Box>
      <Navbar />

      <Box sx={{ p: 3 }}>
        <PackageSelection onAddInvestmentRange={handleAddInvestmentRange} />
        
      </Box>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="600"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ backgroundColor: '#f8f9fa', m: 0, p: 2, pr: 6 }}>
          Add New Investment Range — {investmentRangeData?.range}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 2 }}>
         <PaymentBrandUpdate
  isEditing={true}
  investmentRangeData={investmentRangeData}
  onDataLoaded={() => {
   
  }}
  onSaveSuccess={() => {
    handleCloseModal();
  }}
/>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseModal} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
      

    </Box>
  );
};

export default AdvertisingPage;