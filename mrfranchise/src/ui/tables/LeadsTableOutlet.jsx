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
} from "@mui/material";

const LeadsTableOutlet = ({
  leads,
  loadMore,
  hasMore = false,
  loading = false,
  pagination,
  dateFilter = [],
  selectedPackage,
  selectedFilter,
  selectedDateFilter,
  leadsFilter,
  handlePackageClick,
  handleReset,
  isReset,
}) => {
  const observer = useRef();
  const lastRowRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return (
    <Paper sx={{ padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
        {/* {selectedPackage?.packageType !== "free" && (
          <FormControl size="small" sx={{ width: 180 }}>
            <Select
              value={selectedFilter}
              onChange={(e) =>
                handlePackageClick(selectedPackage, "match", e.target.value)
              }
              displayEmpty
            >
              <MenuItem value="" disabled>
                Leads Match Filter
              </MenuItem>
              {leadsFilter.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )} */}

        {selectedPackage?.isActive && (
          <FormControl size="small" sx={{ width: 180 }}>
            <Select
              value={selectedDateFilter}
              onChange={(e) =>
                handlePackageClick(selectedPackage, "date", e.target.value)
              }
              displayEmpty
            >
              <MenuItem value="" disabled>
                Date Filter
              </MenuItem>
              {dateFilter.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* {selectedPackage?.packageType !== "free" && (
          <Button onClick={handleReset}>
            {isReset ? <CircularProgress size={14} /> : "Reset"}
          </Button>
        )} */}
      </Box>

      <TableContainer style={{ maxHeight: "50vh", overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f1f1f1" }}>
              <TableCell sx={{ fontWeight: 800 }}>Investor Name</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Mobile</TableCell>
              {/* <TableCell sx={{ fontWeight: 800 }}>Match Type</TableCell> */}
              <TableCell sx={{ fontWeight: 800 }}>Receive At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {leads?.length > 0 ? (
              leads.map((lead, index) => (
                <TableRow
                  key={lead._id || lead.sentAt || index}
                  ref={index === leads.length - 1 ? lastRowRef : null}
                >
                  <TableCell>{lead.investorName}</TableCell>
                  <TableCell>{lead.investorEmail}</TableCell>
                  <TableCell>{lead.investorMobile}</TableCell>
                  {/* <TableCell>{lead.matchType}</TableCell> */}
                  <TableCell>
                    {new Date(lead.sentAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="7" align="center">
                  No leads.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div style={{ textAlign: "center", padding: "10px" }}>
          {loading && <CircularProgress size={24} />}

          {pagination?.totalRecords > 0 && (
            <p>
              {pagination.totalRecords} investors — Page{" "}
              {pagination.currentPage + 1} / {pagination.totalPages}
            </p>
          )}
        </div>
      </TableContainer>
    </Paper>
  );
};

export default LeadsTableOutlet;
