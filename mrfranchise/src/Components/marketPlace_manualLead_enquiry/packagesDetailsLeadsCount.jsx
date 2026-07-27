"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography, Grid, Chip, CircularProgress, Stack } from "@mui/material"; 
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; 
import SendIcon from "@mui/icons-material/Send";
import InventoryIcon from "@mui/icons-material/Inventory";

const getBrandOwnerId = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("brandUUID");
};

export default function BrandPackageLeadDashboard() {
  const [brandOwnerId, setBrandOwnerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [packageData, setPackageData] = useState(null);

  const getPackageDetails = async (id) => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brand-packages-plans/active-lead-details/${id}`
      );

      setPackageData(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = getBrandOwnerId();
    setBrandOwnerId(id);

    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getPackageDetails(id);
  }, []);

  if (!brandOwnerId) {
    // Investor or no brandUUID -> render nothing
    return null;
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!packageData) {
    return null;
  }

  return (
 <Box sx={{ mt: 4 }}>
      

      <Grid container justifyContent={"space-evenly"} spacing={3}>
        <Grid>
          <Card
        sx={{
          borderRadius: 4,
          background: "linear-gradient(135deg,#0F172A,#1E3A8A)",
          color: "#fff",
          minWidth:'220px',
          mb: 4,
        }}
      >
        <CardContent>
          <Typography >
            Active Lead Package
          </Typography>

          <Typography >{packageData.packageName}</Typography>

          <Chip
            label={packageData.packageType}
            sx={{
              // mt: 2,
              bgcolor: "#10B981",
              color: "#fff",
              fontWeight: 700,
            }}
          />
        </CardContent>
      </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{  borderRadius: 4,
          background: "linear-gradient(135deg,#0F172A,#1E3A8A)",
          color: "#fff",
          minWidth:'220px',
          mb: 4, }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Total Leads</Typography>

                <InventoryIcon color="primary" />
              </Stack>

              <Typography mt={2} variant="h4" fontWeight="bold">
                {packageData.totalLeads}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{  borderRadius: 4,
          background: "linear-gradient(135deg,#0F172A,#1E3A8A)",
          color: "#fff",
          minWidth:'220px',
          mb: 4, }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Sent Leads</Typography>

                <SendIcon color="success" />
              </Stack>

              <Typography mt={2} variant="h4" fontWeight="bold" color="green">
                {packageData.sendingLeads}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{  borderRadius: 4,
          background: "linear-gradient(135deg,#0F172A,#1E3A8A)",
          color: "#fff",
          minWidth:'220px',
          mb: 4, }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Remaining Leads</Typography>

                <TrendingUpIcon color="warning" />
              </Stack>

              <Typography mt={2} variant="h4" fontWeight="bold" color="orange">
                {packageData.remainingLeads}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
      );
}