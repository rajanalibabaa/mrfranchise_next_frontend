"use client";
import React,{useEffect , useState} from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";

const ApplyDrawer = ({
  open,
  onClose,
  isMobile,
  isTablet,
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  isSubmitting,
  locationData,
  investmentRanges,
  investmentTimings,
  readyToInvestOptions,
  selectedBrand,
  userData,
}) => {
  
    const [expanded, setExpanded] = useState(false);

 // Prefill form with userData when available
  useEffect(() => {
    if (userData && open) {
      setFormData((prev) => ({
        ...prev,
        fullName: userData.firstName || "",
        investorEmail: userData.email || "",
        mobileNumber: userData.mobileNumber || "",
      }));
    }
  }, [userData, open, setFormData]);

  // console.log('userdata ', userData)
  return (
    <Drawer
      anchor={isMobile || isTablet ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomLeftRadius: isMobile ? 0 : 16,
          maxHeight: isMobile ? "80vh" : isTablet ? "70vh" : "94vh",
          width: isMobile ? "100%" : isTablet ? "80%" : 430,
          overflow: "auto",
          mx: "auto",
          backgroundColor: "#f9f9f9",
        },
      }}
    >
      <Box sx={{ pl: isMobile ? 2 : 2,pt: isMobile ? 2 : 1.5, pr: isMobile ? 2 : 2}}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
             <Box>
          <Typography variant="h6" fontWeight={700} mb={0.1} color="#26d466" >
            Chat with {selectedBrand[0]?.brandDetails?.brandName}
             </Typography>
             <Typography fontSize="0.7rem" color="black">
               <b> Brand Category: </b>
                {
                  selectedBrand[0]?.brandfranchisedetails?.franchiseDetails
                    ?.brandCategories?.sub
                }
              </Typography>
            </Box>
          <IconButton aria-label="close" onClick={onClose}>
            <Close color="error" />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid
            spacing={2}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: 1.5,
            }}
          >
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={ formData.fullName || userData?.firstName || ""}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="investorEmail"
                value={ formData.investorEmail || userData?.email || ""}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobileNumber"
                value={ formData.mobileNumber || userData?.mobileNumber || ""}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              />
            </Grid>
            Where you want to start
            {/* State Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              >
                {locationData.states.map((state, i) => (
                  <MenuItem key={i} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* District Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Cities"
                name="district"
                value={formData.district}
                onChange={handleChange}
                // required
                variant="outlined"
                size="small"
                disabled={!formData.state}
              >
                {locationData.districts.map((district, i) => (
                  <MenuItem key={i} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* City Dropdown */}
            {/*<Grid item xs={12}>
               <TextField
                select
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                // required
                variant="outlined"
                size="small"
                disabled={!formData.district}
              >
                {locationData.cities.map((city, i) => (
                  <MenuItem key={i} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField> 

             
            </Grid>*/}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Investment Range"
                name="investmentRange"
                value={formData.investmentRange}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              >
                {investmentRanges.map((range, i) => (
                  <MenuItem key={i} value={range}>
                    {range}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Plan to Invest"
                name="planToInvest"
                value={formData.planToInvest}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              >
                {investmentTimings.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Ready to Invest"
                name="readyToInvest"
                value={formData.readyToInvest}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              >
                {readyToInvestOptions.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  mt: 0.5,
                  backgroundColor: "#25d366",
                  py: 1.5,
                  fontSize: "1rem",
                  "&:disabled": {
                    background: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{ mr: 2 }}
                    />
                    Submitting...
                  </>
                ) : (
                  "Message Now 🚀"
                )}
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ mt: 0 }}>
            {/* aimer: Instantly rendered */}
      <Box
            sx={{
              // ml: { xs: 2, md: 10.5 },
              // mr: { xs: 2, md: 10.5 },
              // mb: 4,
              mt: 0,
              p: 2,
              // borderRadius: "12px",
              // bgcolor: "rgba(255, 255, 255, 1)",
            }}
          >
            <Typography
              variant="caption"
              fontSize={9}
              color="#212121"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: expanded ? "unset" : 1, // one line when collapsed
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                whiteSpace: expanded ? "normal" : "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <span style={{ color: "#f44336", fontWeight: 600 }}>
                Disclaimer:{" "}
              </span>
              Mr Franchise and the site sponsors accept no liability for the accuracy
              of any information contained on this site or on other linked sites. We
              recommend you take advice from a lawyer, accountant and franchise
              consultant experienced in franchising before you commit yourself. It is
              user's responsibility to satisfy yourself as to the accuracy and
              reliability of the information supplied. Please read the terms &
              conditions on MrFranchise.in
            </Typography>
      
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{
                mt: 0.5,
                p: 0,
                minWidth: "auto",
                fontSize: "9px",
                textTransform: "none",
                color: "#ba1212ff",
                textDecoration: "underline",
              }}
            >
              {expanded ? "Less" : "Expand More"}
            </Button>
          </Box>
      {/* <Disclimer/> */}
      
          </Grid>
        </form>
      </Box>
    </Drawer>
  );
};

export default ApplyDrawer;
