"use client";
import React, { useEffect, useState } from "react";
import {  useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import axios from "axios";
import BrandHeader from "@/Components/BrandProfile_Component/BrandDashboardController/BrandDashboardFiles/BrandHeader";
import DashboardTabs from "@/Components/BrandProfile_Component/BrandDashboardController/BrandDashboardFiles/DashboardTabs";
import LeadDetailDialog from "@/Components/BrandProfile_Component/BrandDashboardController/BrandDashboardFiles/LeadDetailDialog";
import {  getUserId } from "@/Utils/autherId";
import Sidebar from "./Sidebar_page";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;
const userId = getUserId();
const BrandDashboard = ({ selectedSection, sectionContent }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [brandData, setBrandData] = useState({});
  const [applyData, setApplyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Leads, setLeads] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const brandUUID = userId ||useSelector((state) => state.auth.brandUUID);
  const token = useSelector((state) => state.auth.AccessToken);

  const fetchData = async () => {
    if (!brandUUID || !token) return;
    
    try {
      setLoading(true);
      setError(null);

      const brandApiCall = axios.get(`${API_BASE_URL}/brandlisting/getBrandById/${brandUUID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const applyApiCall = axios.get(
        `${API_BASE_URL}/instantapply/getInstantApplyLocationLeadControllerById/${brandUUID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const leadsApiCall = axios.get(
        `${API_BASE_URL}/instantapply/leads/brand-all-industries/${brandUUID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const [brandRes, applyRes, leadsRes] = await Promise.allSettled([brandApiCall, applyApiCall, leadsApiCall]);

      if (brandRes.status === 'fulfilled' && brandRes.value.data?.success) {
        setBrandData(brandRes.value.data.data || {});
        // console.log("===brandData===: ",brandRes.value.data.data )
      } else {
        console.warn('Brand data fetch failed');
        setBrandData({});
      }

      if (applyRes.status === 'fulfilled' && applyRes.value.data?.success) {
        setApplyData(applyRes.value.data.data || []);
      } else {
        console.warn('Apply data fetch failed');
        setApplyData([]);
      }

      if (leadsRes.status === 'fulfilled') {
        const leadsResponse = leadsRes.value.data;
        if (leadsResponse?.data?.data && Array.isArray(leadsResponse.data.data)) {
          setLeads(leadsResponse.data.data);
        } else if (leadsResponse?.data && Array.isArray(leadsResponse.data)) {
          setLeads(leadsResponse.data);
        } else if (leadsResponse?.success && Array.isArray(leadsResponse.data)) {
          setLeads(leadsResponse.data);
        } else {
          setLeads([]);
        }
      } else {
        setLeads([]);
      }

    } catch (err) {
      console.error('Unexpected error in fetchData:', err);
      setError(err.response?.data?.message || "Failed to load data.");
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

  if (selectedSection) {
    return sectionContent[selectedSection];
  }

  // console.log("brandData :",brandData)

  return (
    <>
     
    <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row" ,justifyContent: "space-evenly", alignItems: "flex-start", minHeight: "100vh" }}>
  <Sidebar/>    
           
      <Box sx={{ px: isMobile ? 1 : 3,display: "flex", flexDirection: isMobile ? "column" : "column" , width: "100%", mt: 3 }}>
        
          
               <BrandHeader brandData={brandData} />

        <DashboardTabs
          brandData={brandData}
          loading={loading}
          error={error}
          onRetry={fetchData}
          onViewDetails={handleViewDetails}
        />
        
        <LeadDetailDialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          selectedItem={selectedItem}
        />
          
      </Box>
    </Box>
    </>
  );
};

export default BrandDashboard;