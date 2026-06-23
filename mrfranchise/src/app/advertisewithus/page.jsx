"use client";

import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Navbar from '@/Components/Navbar/NavBar';
import Footer from '@/Components/Footers/Footer';
import PaymentBrandUpdate from '../../Components/PackageSelection/PaymentBrandUpdate';
import PackageSelection from '../../Components/PackageSelection/PackageSelection';
import PaymentBottomBar from '../../Components/PackageSelection/PaymentBottomBar';
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, IconButton, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AdvertisingPage = () => {
  const dialogScrollRef = useRef(null);
  const sentinelRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [investmentRangeData, setInvestmentRangeData] = useState(null);
  const [statCards, setStatCards] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleAddInvestmentRange = (range, investmentRangeLabel) => {
    setInvestmentRangeData({ range, investmentRangeLabel });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => setInvestmentRangeData(null), 500);
  };

  return (
    <Box mt={13}>
      <Navbar />

      <Box sx={{ p: { xs: 0, sm: 3, md: 4 }, pt: { xs: -3, sm: 4, md: 5 } }}>

        {/* Single PackageSelection — sections become accordions on mobile inside */}
        <PackageSelection
          onAddInvestmentRange={handleAddInvestmentRange}
          onSummaryChange={(cards, amount) => {
            setStatCards(cards);
            setTotalAmount(amount);
          }}
        />

        <Box ref={sentinelRef} sx={{ mt: 1 }} />

        <PaymentBottomBar
          sentinelRef={sentinelRef}
          statCards={statCards}
          totalAmount={totalAmount}
          loading={false}
          handleProceedToPayment={() => {}}
        />
      </Box>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="600"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ backgroundColor: "#f8f9fa", m: 0, p: 2, pr: 6 }}>
          You Are Adding a New Franchise Business Model For This Investment
          Range — {investmentRangeData?.range}
          <Typography variant="subtitle2" color="textSecondary">
            (By adding Franchise Business Model, Your brand view page will display this Investment Range to all Franchise Investors.)
          </Typography>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers ref={dialogScrollRef} sx={{ p: 2 }}>
          <PaymentBrandUpdate
            isEditing={true}
            investmentRangeData={investmentRangeData}
            onDataLoaded={() => {}}
            onSaveSuccess={() => handleCloseModal()}
            scrollContainerRef={dialogScrollRef}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseModal} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>

      <Footer id="footer" />
    </Box>
  );
};

export default AdvertisingPage;
