"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";
import PaymentBrandUpdate from "./PaymentBrandUpdate";
import PackageSelection from "./PackageSelection";
import ExistingPackageDisplay from "./ExistingPackageDisplay";
import useUserLocation from "@/config/useUserLocations";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
        <ExistingPackageDisplay />
        <PackageSelection onAddInvestmentRange={handleAddInvestmentRange} />
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
            (By adding Franchise Business Model, Your brand view page will
            display this Investment Range to all Franchise Investors.)
          </Typography>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
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
            onDataLoaded={() => {}}
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
