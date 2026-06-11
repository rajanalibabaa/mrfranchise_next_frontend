"use client";
import React, { useRef, useCallback } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  FormControl,
  Button,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const LeadsTableOutlet = ({
  leads = [],
  totalLeads = 0,
  loadMore,
  hasMore = false,
  loading = false,
  dateFilter = [],
  selectedDateFilter,
  onDateFilter,
  onReset,
}) => {
  const observer = useRef();

  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && loadMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Paper sx={{ padding: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Investor Leads{" "}
          <Chip
            label={`Total: ${totalLeads}`}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {/* Date Filter */}
          <FormControl size="small" sx={{ width: 180 }}>
            <Select
              value={selectedDateFilter}
              onChange={(e) => onDateFilter(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Filter by Date
              </MenuItem>
              {dateFilter.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Reset Button */}
          {selectedDateFilter && (
            <Button
              variant="outlined"
              size="small"
              onClick={onReset}
              color="secondary"
            >
              Reset
            </Button>
          )}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer style={{ maxHeight: "60vh", overflow: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {[
                "#",
                "Name",
                "Email",
                "Phone",
                "State",
                "Investment Range",
                "Industry",
                // "Email Sent",
                "Email Sent At",
              ].map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    fontWeight: 800,
                    backgroundColor: "#f1f5f9",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {leads.length > 0 ? (
              leads.map((lead, index) => (
                <TableRow
                  key={lead._id || index}
                  ref={index === leads.length - 1 ? lastRowRef : null}
                  hover
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                  }}
                >
                  {/* # */}
                  <TableCell>{index + 1}</TableCell>

                  {/* Investor Name */}
                  <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                    {lead.investorName || "—"}
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <Tooltip title={lead.investorEmail || ""}>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 180,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {lead.investorEmail || "—"}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  {/* Phone */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {lead.investorPhone || "—"}
                  </TableCell>

                  {/* City / State */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {[lead.state].filter(Boolean).join(", ") || "—"}
                  </TableCell>

                  {/* Investment Range */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Chip
                      label={lead.investmentRange || "—"}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 160,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lead.industry || "—"}
                    </Typography>
                  </TableCell>

                  {/* Email Sent Status
                  <TableCell align="center">
                    {lead.emailSent ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <CancelIcon color="error" fontSize="small" />
                    )}
                  </TableCell> */}

                  {/* Email Sent At */}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(lead.emailSentAt)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No leads found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Loading */}
        {loading && (
          <Box textAlign="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </TableContainer>

      {/* Footer Count */}
      {leads.length > 0 && (
        <Box sx={{ mt: 1, textAlign: "right" }}>
          <Typography variant="caption" color="text.secondary">
            Showing {leads.length} of {totalLeads} leads
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default LeadsTableOutlet;