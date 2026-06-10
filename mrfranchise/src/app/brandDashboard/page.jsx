"use client";

import React, { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import axios from "axios";

import BrandHeader from "@/Components/BrandProfile_Component/BrandDashboardController/BrandDashboardFiles/BrandHeader";
import DashboardTabs from "@/Components/BrandProfile_Component/BrandDashboardController/BrandDashboardFiles/DashboardTabs";
import LeadDetailDialog from "@/Components/BrandProfile_Component/BrandDashboardController/BrandDashboardFiles/LeadDetailDialog";

import BrandListingController from "./brand_listing_controller/page.jsx";
import BrandSearchUs from "./brandsearchus/page.jsx";
import BrandRequestHandle from "./brandrequesthandle/page.jsx";
import PaymentPackageUpgrade from "./paymentpackageupgrade/page.jsx";
import ContactMappingForLeads from "./domesticContactMapping/page.jsx";

import Sidebar from "./Sidebar_page";
import { getUserId } from "@/Utils/autherId";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
const userId = getUserId();

const BrandDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [activePage, setActivePage] = useState("dashboard");

  const [brandData, setBrandData] = useState({});
  const [applyData, setApplyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Leads, setLeads] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const brandUUID =
    userId || useSelector((state) => state.auth.brandUUID);

  const token = useSelector(
    (state) => state.auth.AccessToken
  );

  const fetchData = async () => {
    if (!brandUUID || !token) return;

    try {
      setLoading(true);
      setError(null);

      const brandApiCall = axios.get(
        `${API_BASE_URL}/brandlisting/getBrandById/${brandUUID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const applyApiCall = axios.get(
        `${API_BASE_URL}/instantapply/getInstantApplyLocationLeadControllerById/${brandUUID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const leadsApiCall = axios.get(
        `${API_BASE_URL}/instantapply/leads/brand-all-industries/${brandUUID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const [brandRes, applyRes, leadsRes] =
        await Promise.allSettled([
          brandApiCall,
          applyApiCall,
          leadsApiCall,
        ]);

      if (
        brandRes.status === "fulfilled" &&
        brandRes.value.data?.success
      ) {
        setBrandData(
          brandRes.value.data.data || {}
        );
      }

      if (
        applyRes.status === "fulfilled" &&
        applyRes.value.data?.success
      ) {
        setApplyData(
          applyRes.value.data.data || []
        );
      }

      if (leadsRes.status === "fulfilled") {
        const leadsResponse =
          leadsRes.value.data;

        if (
          leadsResponse?.data?.data &&
          Array.isArray(
            leadsResponse.data.data
          )
        ) {
          setLeads(leadsResponse.data.data);
        } else {
          setLeads([]);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [brandUUID, token]);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailDialogOpen(true);
  };

  const renderContent = () => {
    switch (activePage) {
      case "brandListing":
        return <BrandListingController />;

      case "reachUs":
        return <BrandSearchUs />;

      case "actionManager":
        return <BrandRequestHandle />;

      case "packageUpgrade":
        return <PaymentPackageUpgrade />;  

      case "ContactMappingForLeads":
        return <ContactMappingForLeads brandOwnerId="80469c64-efe0-4ef1-891c-86c033f46d91" />;

      case "dashboard":
      default:
        return (
          <>
            <BrandHeader brandData={brandData} />

            <DashboardTabs
              brandData={brandData}
              loading={loading}
              error={error}
              onRetry={fetchData}
              onViewDetails={
                handleViewDetails
              }
            />

            <LeadDetailDialog
              open={detailDialogOpen}
              onClose={() =>
                setDetailDialogOpen(false)
              }
              selectedItem={selectedItem}
            />
          </>
        );
    }
  };

return (
  <Box
    sx={{
      display: "flex",
      height: "97vh",
      overflow: "hidden",
      bgcolor: "#f8f9fa",
    }}
  >
    <Sidebar
      activePage={activePage}
      setActivePage={setActivePage}
    />

    {/* Only this section scrolls */}
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        p: { xs: 1, md: 6 },
        mt: { xs: "64px", md: 0 },
      }}
    >
      {renderContent()}
    </Box>
  </Box>
);
};

export default BrandDashboard;