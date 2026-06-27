"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import LeadsTableOutlet from "@/ui/tables/LeadsTableOutlet";
import { getUserId } from "@/Utils/autherId";
import ErrorPopup from "@/ui/popup/ErrorPopup";

const userId = getUserId();

const Leads = () => {
  const { search } = useParams();
  const query = new URLSearchParams(search);
  const id = query.get("id") || userId;

  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [brandInfo, setBrandInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const [error, setError] = useState("");

  const handleAxiosError = (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong. Try again.";
    setError(msg);
  };

  const fetchLeads = async (brandId) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/v1/instantapply/getSentLeadsByBrandIdEnquires`,
        { brandId }
      );

      const responseData = res?.data;
      console.log("===responsedata", responseData);

      if (responseData?.success) {
        const dataArray = responseData?.data || [];

        // Extract all brandsSent entries with parent investor info
        const allLeads = [];

        dataArray.forEach((item) => {
          const brandsSent = item?.brandsSent || [];
          brandsSent.forEach((sent) => {
            allLeads.push({
              _id: sent._id,
              investorName: item.investorName,
              investorEmail: item.investorEmail,
              investorPhone: item.investorPhone,
              investorId: item.investorId,
              city: item.city,
              state: item.state,
              district: item.district,
              industry: item.industry,
              category: item.category,
              investmentRange: item.investmentRange,
              planToInvest: item.planToInvest,
              readyToInvest: item.readyToInvest,
              status: item.status,
              brandName: sent.brandName,
              brandEmail: sent.brandEmail,
              brandId: sent.brandId,
              emailSent: sent.emailSent,
              emailSentAt: sent.emailSentAt,
            });
          });
        });

        // Sort by latest emailSentAt
        allLeads.sort(
          (a, b) => new Date(b.emailSentAt) - new Date(a.emailSentAt)
        );

        setLeads(allLeads);
        setFilteredLeads(allLeads);
        setBrandInfo(dataArray[0] || null);
      } else {
        setError("Failed to fetch leads.");
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  // Date filter logic
  const handleDateFilter = (days) => {
    setSelectedDateFilter(days);
    if (!days) {
      setFilteredLeads(leads);
      return;
    }
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - Number(days));
    const filtered = leads.filter(
      (lead) => new Date(lead.emailSentAt) >= cutoff
    );
    setFilteredLeads(filtered);
  };

  const handleReset = () => {
    setSelectedDateFilter("");
    setFilteredLeads(leads);
  };

  useEffect(() => {
    fetchLeads(id);
  }, [id]);

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={1}>
      <LeadsTableOutlet
        leads={filteredLeads}
        totalLeads={leads.length}
        dateFilter={[
          { label: "Last 3 days", value: 3 },
          { label: "Last 7 days", value: 7 },
          { label: "Last 30 days", value: 30 },
        ]}
        selectedDateFilter={selectedDateFilter}
        onDateFilter={handleDateFilter}
        onReset={handleReset}
        loading={loading}
      />

      {error && (
        <ErrorPopup
          message={error}
          open={Boolean(error)}
          onClose={() => setError("")}
        />
      )}
    </Box>
  );
};

export default Leads;