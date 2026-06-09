"use client";

import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Navbar from '@/Components/Navbar/NavBar';
import Footer from '@/Components/Footers/Footer';
import PaymentBrandUpdate from './PaymentBrandUpdate';
import PackageSelection from './PackageSelection';
import PaymentBottomBar from './PaymentBottomBar';
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
  const [statCards, setStatCards] = useState([]);      // ← lift state up from PackageSelection
  const [totalAmount, setTotalAmount] = useState(0);   // ← lift state up from PackageSelection

  const handleAddInvestmentRange = (range, investmentRangeLabel) => {
    setInvestmentRangeData({ range, investmentRangeLabel });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTimeout(() => setInvestmentRangeData(null), 500);
  };

  return (
    <Box>
      <Navbar />

      <Box sx={{ p: 3 }}>

        {/* PackageSelection renders the plan cards + Selected Plan Summary table */}
        <PackageSelection
          onAddInvestmentRange={handleAddInvestmentRange}
          
          onSummaryChange={(cards, amount) => {   // ← PackageSelection calls this when selection changes
            setStatCards(cards);
            setTotalAmount(amount);
          }}
        />

        {/* 
          ↓ sentinel sits RIGHT HERE — after the summary table,
            before the footer. Bar will render inline here,
            then go fixed as user scrolls up, then park here again near footer.
        */}
        <Box ref={sentinelRef} sx={{ mt: 2 }} />

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
