"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";
import LoginPage from "@/Components/LoginPage/LoginPage";
import BrandPackageLeadDashboard from "@/Components/marketPlace_manualLead_enquiry/packagesDetailsLeadsCount";

import useLeadFilters from "@/Components/marketPlace_manualLead_enquiry/Filter_manual_lead_search";
import SearchBar from "@/Components/marketPlace_manualLead_enquiry/SearchBar_leadmarketPlace";
import FilterPanel from "@/Components/marketPlace_manualLead_enquiry/FilterPanel_make_investormarketplace";
import LeadCard from "@/Components/marketPlace_manualLead_enquiry/LeadCard_marketplace";
import LeadDetailDialog from "@/Components/marketPlace_manualLead_enquiry/marketLead_view_LeadDetailDialog";
import CaptchaDialog from "@/Components/marketPlace_manualLead_enquiry/CaptchaDialog";

// ─── Auth Helpers ─────────────────────────────────────────────────────────────
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem("accessToken"));
};

const isBrandUser = () => {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem("brandUUID"));
};

const generateCaptcha = () => {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 6; i++)
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

export default function InstantApplyPage() {
  // ─── Filter Hook ────────────────────────────────────────────────────────────
  const {
    leads,
    filtered,
    loading,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    activeFilterCount,
    clearAllFilters,
  } = useLeadFilters();

  // ─── UI State ────────────────────────────────────────────────────────────────
  const [showFilters, setShowFilters] = useState(false);

  // ─── Detail Dialog ───────────────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // ─── Auth / Captcha ──────────────────────────────────────────────────────────
  const [showLogin, setShowLogin] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaText, setCaptchaText] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [pendingLead, setPendingLead] = useState(null);

  const refreshCaptcha = () => setCaptchaText(generateCaptcha());

  const handleUnlock = (item) => {
    if (!isLoggedIn()) {
      setPendingLead(item);
      setShowLogin(true);
      return;
    }
    if (!isBrandUser()) {
      window.alert(
        "You are an investor. Only brand users can unlock and view these details."
      );
      return;
    }
    setPendingLead(item);
    setCaptchaText(generateCaptcha());
    setCaptchaInput("");
    setShowCaptcha(true);
  };

  const onLoginSuccess = () => {
    setShowLogin(false);
    if (!isBrandUser()) {
      window.alert(
        "You are an investor. Only brand users can unlock and view these details."
      );
      return;
    }
    setCaptchaText(generateCaptcha());
    setCaptchaInput("");
    setShowCaptcha(true);
  };

  const verifyCaptcha = () => {
    if (captchaInput.trim() !== captchaText) {
      alert("Invalid Captcha. Please try again.");
      setCaptchaText(generateCaptcha());
      setCaptchaInput("");
      return;
    }
    setShowCaptcha(false);
    setSelected(pendingLead);
    setDialogOpen(true);
  };

  return (
    <>
      <Navbar />

      <Box sx={{ minHeight: "100vh", mt: 18 }}>
        {/* Dashboard Summary */}
        <BrandPackageLeadDashboard />

        {/* Loading Bar */}
        {loading && (
          <LinearProgress
            sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}
          />
        )}

        {/* Main Content */}
        <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>
          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFilterCount={activeFilterCount}
            clearAllFilters={clearAllFilters}
          />

          {/* Filter Panel */}
          {showFilters && (
            <FilterPanel
              showFilters={showFilters}
              filters={filters}
              setFilters={setFilters}
              leads={leads}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilterCount={activeFilterCount}
            />
          )}

          {/* Results Count */}
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" fontWeight={600} color="#64748b">
              Showing{" "}
              <Box component="span" fontWeight={800} color="#ff9800">
                {filtered.length}
              </Box>{" "}
              of {leads.length} leads
            </Typography>
          </Box>

          {/* Lead Cards Grid */}
          <Grid container spacing={3}>
            {/* Empty State */}
            {filtered.length === 0 && !loading && (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 6,
                    textAlign: "center",
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <SearchIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
                  <Typography variant="h6" color="#64748b" fontWeight={600}>
                    No leads found
                  </Typography>
                  <Typography variant="body2" color="#94a3b8" mt={1}>
                    Try adjusting your filters or search query
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={clearAllFilters}
                    sx={{
                      mt: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "#ff9800",
                      color: "#ff9800",
                    }}
                  >
                    Clear Filters
                  </Button>
                </Paper>
              </Grid>
            )}

            {/* Cards */}
            {filtered.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item._id || index}>
                <LeadCard item={item} index={index} onUnlock={handleUnlock} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Footer />

      {/* ─── Dialogs ─────────────────────────────────────────────────────────── */}
      <LeadDetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selected={selected}
      />

      <CaptchaDialog
        open={showCaptcha}
        captchaText={captchaText}
        captchaInput={captchaInput}
        setCaptchaInput={setCaptchaInput}
        onRefresh={refreshCaptcha}
        onVerify={verifyCaptcha}
        onClose={() => setShowCaptcha(false)}
      />

      <LoginPage
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={onLoginSuccess}
      />
    </>
  );
}