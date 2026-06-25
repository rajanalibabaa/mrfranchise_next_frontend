import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, Button, Card, CardContent, Divider, Grid, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const UpgradeListingPopup = ({ open, onClose, pkg, item }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3, mx: 2, maxHeight: "90vh", overflow: "hidden" } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2, backgroundColor: "#dbeafe", borderBottom: "1px solid #e0e0e0" }}>
        <Box>
          <Typography fontWeight={700} fontSize="1rem" color="#111">Listing Package Details</Typography>
          <Typography fontSize="0.7rem" color="#757575">Upgrade Information</Typography>
        </Box>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" sx={{ color: "#9e9e9e" }} /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2, overflowY: "auto" }}>
        <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <StorefrontIcon sx={{ color: "#fb8c00", mr: 1 }} />
              <Typography variant="h6" fontWeight={700} color="#111">Package Information</Typography>
            </Box>
            <Divider sx={{ mb: 1.5 }} />
            <Grid container spacing={1.5}>
              <Grid item xs={6}><Typography variant="caption" color="#757575">Package Name</Typography><Typography variant="body2" fontWeight={600} color="#111">{pkg?.packagesName || "N/A"}</Typography></Grid>
              <Grid item xs={6}><Typography variant="caption" color="#757575">Package Type</Typography><Typography variant="body2" fontWeight={600} color="#111">{pkg?.packagesType || "Listing"}</Typography></Grid>
              <Grid item xs={6}><Typography variant="caption" color="#757575">Investment Range</Typography><Typography variant="body2" fontWeight={600} color="#111">{item?.investmetRageLabel || "N/A"}</Typography></Grid>
              <Grid item xs={6}><Typography variant="caption" color="#757575">Validity</Typography><Typography variant="body2" fontWeight={600} color="#111">{pkg?.validityDays || "N/A"} Days</Typography></Grid>
            </Grid>
          </CardContent>
        </Card>

        {item?.investmentranges && item.investmentranges.length > 0 && (
          <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <AttachMoneyIcon sx={{ color: "#4cb04f", mr: 1 }} />
                <Typography variant="h6" fontWeight={700} color="#111">Current Investment Ranges</Typography>
              </Box>
              <Divider sx={{ mb: 1.5 }} />
              {item.investmentranges.map((range, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#fb8c00" gutterBottom>{range.selectedPlanInvestmetrange}</Typography>
                  {range.selectedPlanStateAndDistrict && range.selectedPlanStateAndDistrict.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="#757575" gutterBottom>Selected States/Districts:</Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                        {range.selectedPlanStateAndDistrict.map((location, locIdx) => {
                          const locationName = typeof location === "object" ? location.state : location;
                          return <Chip key={locIdx} label={locationName} size="small" variant="outlined" sx={{ fontSize: "0.7rem", height: 24 }} />;
                        })}
                      </Box>
                    </Box>
                  )}
                  {idx < item.investmentranges.length - 1 && <Divider sx={{ my: 1.5 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        )}

        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <CalendarTodayIcon sx={{ color: "#1565c0", mr: 1 }} />
              <Typography variant="h6" fontWeight={700} color="#111">Additional Details</Typography>
            </Box>
            <Divider sx={{ mb: 1.5 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <StorefrontIcon sx={{ fontSize: 18, color: "#757575" }} />
                <Box><Typography variant="caption" color="#757575">Total States Covered</Typography><Typography variant="body2" fontWeight={600} color="#111">{item?.investmentranges?.reduce((total, range) => total + (range.selectedPlanStateAndDistrict?.length || 0), 0) || 0}</Typography></Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AttachMoneyIcon sx={{ fontSize: 18, color: "#757575" }} />
                <Box><Typography variant="caption" color="#757575">Total Investment Ranges</Typography><Typography variant="body2" fontWeight={600} color="#111">{item?.investmentranges?.length || 0}</Typography></Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </DialogContent>

      <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
        <Button fullWidth variant="contained" onClick={onClose} sx={{ py: 1.5, fontWeight: 700, fontSize: "0.95rem", textTransform: "none", borderRadius: 2, backgroundColor: "#fb8c00", "&:hover": { backgroundColor: "#e65100" } }}>Close</Button>
      </Box>
    </Dialog>
  );
};

export default UpgradeListingPopup;