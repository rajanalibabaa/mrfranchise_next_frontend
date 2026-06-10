"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Card, Typography, TextField, Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const API = "http://localhost:5000/api/v1";

// ── Shared input style for STATE panel ──
const stateInputSx = {
  "& .MuiInputBase-input": {
    fontSize: 13,
    fontWeight: 600,
    py: 0.8,
    px: 1,
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
  },
};

// ── Shared input style for DISTRICT table ──
const districtInputSx = {
  "& .MuiInputBase-input": {
    fontSize: 12,
    fontWeight: 600,
    py: 0.6,
    px: 1,
  },
  width: "100%",
};

export default function BrandContactMapping({ brandOwnerId }) {
  const [states, setStates] = useState([]);
  const [stateContactMap, setStateContactMap] = useState({});
  const [districtsMap, setDistrictsMap] = useState({});
  const [selectedState, setSelectedState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [districtLoading, setDistrictLoading] = useState(false);

  useEffect(() => {
    if (brandOwnerId) fetchStates();
  }, [brandOwnerId]);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/domestic-contact-mapping-states/${brandOwnerId}`);
      const statesData = res.data?.data?.states || [];
      const initialContacts = {};
      statesData.forEach((s) => {
        initialContacts[s.state] = {
          email: s.email || "",
          mobileNumber: s.mobileNumber || "",
          whatsappNumber: s.whatsappNumber || "",
        };
      });
      setStates(statesData);
      setStateContactMap(initialContacts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStateField = (stateName, field, value) => {
    setStateContactMap((prev) => ({
      ...prev,
      [stateName]: { ...prev[stateName], [field]: value },
    }));
  };

  const saveStateContact = async (stateName) => {
    try {
      const contact = stateContactMap[stateName] || {};
      await axios.put(`${API}/domestic-contact-mapping-update`, {
        brandOwnerId,
        state: stateName,
        email: contact.email,
        mobileNumber: contact.mobileNumber,
        whatsappNumber: contact.whatsappNumber,
      });
      alert(`${stateName} Updated Successfully`);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDistricts = async (stateName) => {
    setSelectedState(stateName);
    if (districtsMap[stateName]) return;
    try {
      setDistrictLoading(true);
      const res = await axios.get(
        `${API}/domestic-contact-mapping/districts/${brandOwnerId}/${encodeURIComponent(stateName)}`
      );
      setDistrictsMap((prev) => ({
        ...prev,
        [stateName]: res.data?.data?.districts || [],
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setDistrictLoading(false);
    }
  };

  const updateDistrictField = (stateName, districtIndex, field, value) => {
    setDistrictsMap((prev) => ({
      ...prev,
      [stateName]: prev[stateName].map((d, i) =>
        i === districtIndex ? { ...d, [field]: value } : d
      ),
    }));
  };

  const saveDistrict = async (stateName, district) => {
    try {
      await axios.put(`${API}/domestic-contact-mapping-update`, {
        brandOwnerId,
        state: stateName,
        district: district.district,
        email: district.email,
        mobileNumber: district.mobileNumber,
        whatsappNumber: district.whatsappNumber,
      });
      alert(`${district.district} Updated Successfully`);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyEmail    = (v) => alert(`Verify Email: ${v}`);
  const verifyMobile   = (v) => alert(`Verify Mobile: ${v}`);
  const verifyWhatsapp = (v) => alert(`Verify WhatsApp: ${v}`);

  // ── Compact district cell: input stacked above verify ──
  const InputVerifyCell = ({ value, onChange, onVerify }) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <TextField
        size="small"
        value={value}
        onChange={onChange}
        sx={districtInputSx}
      />
      <Button
        variant="contained"
        size="small"
        onClick={onVerify}
        sx={{
          fontSize: 10,
          py: 0.3,
          px: 1,
          minWidth: 0,
          lineHeight: 1.4,
          textTransform: "none",
          backgroundColor: "#d38122",
          color: "#ffffff",
         
          
        }}
      >
        Verify
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 2, p: 2, height: "90vh" }}>

      {/* ══════════════════════════════
           LEFT PANEL — States
      ══════════════════════════════ */}
      <Card sx={{ width: 310, overflowY: "auto", flexShrink: 0 }}>

        <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
          <Typography fontWeight={700} fontSize={15}>States</Typography>
        </Box>

        {states.map((stateItem) => {
          const stateName  = stateItem.state;
          const contact    = stateContactMap[stateName] || {};
          const isSelected = selectedState === stateName;

          return (
            <Box
              key={stateName}
              sx={{
                borderBottom: "1px solid #eee",
                backgroundColor: isSelected ? "#f0f4ff" : "#fff",
                p: 2,
              }}
            >

              {/* State name + arrow */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Box>
                  <Typography fontWeight={700} fontSize={14}>{stateName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Districts: {stateItem.districtCount}
                  </Typography>
                </Box>
                <Button
                  variant={isSelected ? "contained" : "outlined"}
                  size="small"
                  onClick={() => fetchDistricts(stateName)}
                  sx={{ minWidth: 36, px: 1 }}
                >
                  Districts <ArrowForwardIosIcon sx={{ fontSize: 12, ml: 0.5 }} />
                </Button>
              </Box>

              {/* ── Email ── */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, display: "block", mb: 0.4 }}
              >
                Email
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1.2 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={contact.email}
                  onChange={(e) => updateStateField(stateName, "email", e.target.value)}
                  sx={stateInputSx}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => verifyEmail(contact.email)}
                  sx={{ whiteSpace: "nowrap", fontSize: 11, px: 1.5, textTransform: "none",  backgroundColor: "#d38122",
          color: "#ffffff", }}
                >
                  Verify
                </Button>
              </Box>

              {/* ── Mobile ── */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, display: "block", mb: 0.4 }}
              >
                Mobile Number
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1.2 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={contact.mobileNumber}
                  onChange={(e) => updateStateField(stateName, "mobileNumber", e.target.value)}
                  sx={stateInputSx}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => verifyMobile(contact.mobileNumber)}
                  sx={{ whiteSpace: "nowrap", fontSize: 11, px: 1.5, textTransform: "none",  backgroundColor: "#d38122",
          color: "#ffffff", }}
                >
                  Verify
                </Button>
              </Box>

              {/* ── WhatsApp ── */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, display: "block", mb: 0.4 }}
              >
                WhatsApp Number
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1.8 }}>
                <TextField
                  size="small"
                  fullWidth
                  value={contact.whatsappNumber}
                  onChange={(e) => updateStateField(stateName, "whatsappNumber", e.target.value)}
                  sx={stateInputSx}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => verifyWhatsapp(contact.whatsappNumber)}
                  sx={{ whiteSpace: "nowrap", fontSize: 11, px: 1.5, textTransform: "none",  backgroundColor: "#d38122",
          color: "#ffffff", }}
                >
                  Verify
                </Button>
              </Box>

              {/* ── Save ── */}
              <Button
                variant="contained"
                color="success"
                size="small"
                fullWidth
                sx={{ textTransform: "none", fontWeight: 600, fontSize: 13 }}
                onClick={() => saveStateContact(stateName)}
              >
                Save
              </Button>

            </Box>
          );
        })}
      </Card>

      {/* ══════════════════════════════
           RIGHT PANEL — Districts
      ══════════════════════════════ */}
      <Card sx={{ flex: 1, p: 2, overflowY: "auto", minWidth: 0 }}>

        {!selectedState ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Typography color="text.secondary">← Select a state to view districts</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h6" fontWeight={700} mb={2}>
              {selectedState} — Districts
            </Typography>

            {districtLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>

                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell sx={{ width: "14%", fontWeight: 700, fontSize: 12 }}>District</TableCell>
                      <TableCell sx={{ width: "24%", fontWeight: 700, fontSize: 12 }}>Email</TableCell>
                      <TableCell sx={{ width: "20%", fontWeight: 700, fontSize: 12 }}>Mobile</TableCell>
                      <TableCell sx={{ width: "20%", fontWeight: 700, fontSize: 12 }}>WhatsApp</TableCell>
                      <TableCell sx={{ width: "10%", fontWeight: 700, fontSize: 12, textAlign: "center" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(districtsMap[selectedState] || []).map((district, districtIndex) => (
                      <TableRow
                        key={district.district}
                        sx={{ verticalAlign: "top", "&:hover": { backgroundColor: "#fafafa" } }}
                      >

                        <TableCell sx={{ fontWeight: 600, fontSize: 12, pt: 1.5, wordBreak: "break-word" }}>
                          {district.district}
                        </TableCell>

                        <TableCell sx={{ py: 1 }}>
                          <InputVerifyCell
                            value={district.email || ""}
                            onChange={(e) => updateDistrictField(selectedState, districtIndex, "email", e.target.value)}
                            onVerify={() => verifyEmail(district.email)}
                          />
                        </TableCell>

                        <TableCell sx={{ py: 1 }}>
                          <InputVerifyCell
                            value={district.mobileNumber || ""}
                            onChange={(e) => updateDistrictField(selectedState, districtIndex, "mobileNumber", e.target.value)}
                            onVerify={() => verifyMobile(district.mobileNumber)}
                          />
                        </TableCell>

                        <TableCell sx={{ py: 1 }}>
                          <InputVerifyCell
                            value={district.whatsappNumber || ""}
                            onChange={(e) => updateDistrictField(selectedState, districtIndex, "whatsappNumber", e.target.value)}
                            onVerify={() => verifyWhatsapp(district.whatsappNumber)}
                          />
                        </TableCell>

                        <TableCell sx={{ py: 1, textAlign: "center" }}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => saveDistrict(selectedState, district)}
                            sx={{
                              fontSize: 11,
                              py: 0.5,
                              px: 1.5,
                              minWidth: 0,
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Save
                          </Button>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Card>

    </Box>
  );
}