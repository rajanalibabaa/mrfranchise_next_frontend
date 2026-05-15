import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Paper,
  Button,
} from "@mui/material";

const BrandPackagesComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const brandOwnerId = localStorage.getItem("accessToken")
  console.log("Brand Owner ID:", brandOwnerId);

  // ================= FETCH API =================
  const fetchPackages = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5000/api/v1/brand-packages-plans/get/${brandOwnerId}`
      );

      setData(response.data.data || response.data);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Failed to fetch package data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // ================= STATUS =================
  const getStatus = (item) => {
    if (item.isActive && !item.isPending) {
      return {
        label: "ACTIVE",
        color: "#15803d",
        bg: "#dcfce7",
      };
    }

    if (item.isPending) {
      return {
        label: "PENDING FOR APPROVAL",
        color: "#b45309",
        bg: "#fef3c7",
      };
    }

    return {
      label: "INACTIVE",
      color: "#6b7280",
      bg: "#f3f4f6",
    };
  };

  // ================= PACKAGE COLOR =================
  const getPackageColor = (type) => {
    switch (type) {
      case "FREE":
        return "#16a34a";

      case "LISTING":
        return "#7c3aed";

      case "LEAD":
        return "#2563eb";

      default:
        return "#111827";
    }
  };

  // ================= DATE FORMAT =================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ================= UPGRADE CLICK =================
  const handleUpgrade = (pkg, item) => {
    console.log("Upgrade Package :", {
      packageType: pkg.packagesType,
      packageName: pkg.packagesName,
      item,
    });
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        background: "#f4f7fb",
        minHeight: "100vh",
      }}
    >
      {/* TITLE */}
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
        color="#111827"
      >
        Brand Packages Summary
      </Typography>

      <Paper
        elevation={0}
        sx={{
          width: "fit-content",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        {/* ================= TABLE HEADER ================= */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "90px 180px 170px 70px 90px 160px 95px 95px 90px",
            background: "#16a34a",
            color: "#fff",
            px: 2,
            py: 1.5,
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography
            fontWeight="bold"
            fontSize="12px"
          >
            Type
          </Typography>

          <Typography
            fontWeight="bold"
            fontSize="12px"
          >
            Package
          </Typography>

          <Typography
            fontWeight="bold"
            fontSize="12px"
          >
            Investment Group
          </Typography>

          <Typography
            fontWeight="bold"
            fontSize="12px"
          >
            Leads
          </Typography>

          <Typography
            fontWeight="bold"
            fontSize="12px"
          >
            Remaining Leads
          </Typography>

          <Typography
            fontWeight="bold"
            fontSize="12px"
          >
            Status
          </Typography>

          <Typography
            fontWeight="bold"
            fontSize="12px"
          >
            Start
          </Typography>

          <Typography
            fontWeight="bold"
            fontSize="12px"
          >
            End
          </Typography>

          <Typography
            fontWeight="bold"
            fontSize="12px"
          >
            Action
          </Typography>
        </Box>

        {/* ================= TABLE BODY ================= */}
        {data?.packages?.map((pkg, packageIndex) =>
          pkg?.InvestmetPackages?.map((item, idx) => {
            const status = getStatus(item);

            return (
              <Box
                key={`${packageIndex}-${idx}`}
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "90px 180px 170px 70px 90px 160px 95px 95px 90px",
                  px: 1.5,
                  py: 1.3,
                  gap: 1,
                  alignItems: "center",
                  borderBottom:
                    "1px solid #f1f5f9",

                  "&:hover": {
                    background: "#f9fafb",
                  },
                }}
              >
                {/* PACKAGE TYPE */}
                <Chip
                  label={pkg.packagesType}
                  size="small"
                  sx={{
                    width: "75px",
                    height: "24px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    background:
                      getPackageColor(
                        pkg.packagesType
                      ),
                    color: "#fff",
                  }}
                />

                {/* PACKAGE NAME */}
                <Box>
                  <Typography
                    fontWeight="700"
                    fontSize="12px"
                    color="#111827"
                  >
                    {pkg.packagesName}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "10px",
                      color: "#6b7280",
                    }}
                  >
                    {pkg.planUniqueId}
                  </Typography>
                </Box>

                {/* INVESTMENT GROUP */}
                <Typography
                  fontWeight="600"
                  fontSize="12px"
                  color="#111827"
                >
                  {item.InvestmetRageLabel || "-"}
                </Typography>

                {/* TOTAL LEADS */}
                <Typography
                  fontWeight="600"
                  fontSize="12px"
                >
                  {item.TotalLeads || 0}
                </Typography>

                {/* REMAINING */}
                <Typography
                  fontWeight="600"
                  fontSize="12px"
                  color={
                    item.remainingLeads > 0
                      ? "#16a34a"
                      : "#dc2626"
                  }
                >
                  {item.remainingLeads || 0}
                </Typography>

                {/* STATUS */}
                <Chip
                  label={status.label}
                  size="small"
                  sx={{
                    width: "145px",
                    height: "24px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    background: status.bg,
                    color: status.color,
                  }}
                />

                {/* START DATE */}
                <Typography
                  fontSize="11px"
                  fontWeight="500"
                >
                  {item.isPending
                    ? "-"
                    : formatDate(
                        item.PackageStartDate
                      )}
                </Typography>

                {/* END DATE */}
                <Typography
                  fontSize="11px"
                  fontWeight="500"
                >
                  {item.isPending
                    ? "-"
                    : formatDate(
                        item.PackageEndDate
                      )}
                </Typography>

                {/* ACTION */}
                <Button
                  variant="contained"
                  size="small"
                  onClick={() =>
                    handleUpgrade(pkg, item)
                  }
                  sx={{
                    minWidth: "75px",
                    height: "28px",
                    fontSize: "11px",
                    textTransform: "none",
                    borderRadius: "6px",
                    background:
                      "linear-gradient(135deg,#2563eb,#3b82f6)",
                    boxShadow: "none",
                    fontWeight: "600",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#1d4ed8,#2563eb)",
                      boxShadow: "none",
                    },
                  }}
                >
                  Upgrade
                </Button>
              </Box>
            );
          })
        )}
      </Paper>
    </Box>
  );
};

export default BrandPackagesComponent;