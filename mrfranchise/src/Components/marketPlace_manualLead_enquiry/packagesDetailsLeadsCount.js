"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SendIcon from "@mui/icons-material/Send";
import InventoryIcon from "@mui/icons-material/Inventory";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const BRAND_OWNER_ID = localStorage.getItem("brandUUID") || "";
export default function BrandPackageLeadDashboard() {
  const [loading, setLoading] = useState(true);
  const [packageData, setPackageData] = useState(null);

  const getPackageDetails = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brand-packages-plans/active-lead-details/${BRAND_OWNER_ID}`,
      );

      setPackageData(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPackageDetails();
  }, []);

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

  return (
    <Box sx={{ mt: 4 }}>
      <Card
        sx={{
          borderRadius: 4,
          background: "linear-gradient(135deg,#0F172A,#1E3A8A)",
          color: "#fff",
          mb: 4,
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            Active Lead Package
          </Typography>

          <Typography mt={1}>{packageData.packageName}</Typography>

          <Chip
            label={packageData.packageType}
            sx={{
              mt: 2,
              bgcolor: "#10B981",
              color: "#fff",
              fontWeight: 700,
            }}
          />
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
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
          <Card sx={{ borderRadius: 3 }}>
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
          <Card sx={{ borderRadius: 3 }}>
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
