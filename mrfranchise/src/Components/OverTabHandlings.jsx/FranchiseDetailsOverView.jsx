// FranchiseDetailsTable.jsx
"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Typography,
} from "@mui/material";
import { Fade } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
const FranchiseDetailsTable = ({ ficoDetails, formatCurrency }) => {
  const containerRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [hasHoveredOnce, setHasHoveredOnce] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const handleUserScrollStart = () => {
    setIsUserScrolling(true);
  };

  const handleUserScrollEnd = () => {
    setIsUserScrolling(false);
  };

  const handleMouseEnter = () => {
    if (!hasHoveredOnce) {
      setHasHoveredOnce(true);
    }
  };
  const MobileRow = ({ label, value }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        py: 0.4,
        borderBottom: "1px solid #eee",
        gap: 3,
      }}
    >
      <Typography
        fontSize="0.75rem"
        fontWeight={600}
        color="text.secondary"
        sx={{
          height: 30,
          width: 80,
          backgroundColor: "white",
          border: "1px solid #e0e0e0",
          borderLeft: { xs: "4px solid #7ad03a", sm: "5px solid #7ad03a" },
          borderRadius: "4px",
          color: "#000000ff",
          fontWeight: 500,
          // display: "flex",
          // alignItems: "center",
          pl: { xs: 1.5, sm: 2 },
          fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
          "&:hover": {
            backgroundColor: "#ffffffff",
            color: "#000000ff",
            borderLeft: "2px solid #5fb52a",
          },
        }}
      >
        {label}
      </Typography>
      <Typography
        fontSize="0.75rem"
        fontWeight={500}
        // textAlign="right"
        color="text.primary"
        sx={{
          height: 30,
          width: 150,
          backgroundColor: "white",
          border: "1px solid #e0e0e0",
          borderLeft: "5px solid #ff9900",
          borderRadius: "4px",
          color: "#000000ff",
          fontWeight: 500,
          // display: "flex",
          // alignItems: "center",
          pl: { xs: 1.5, sm: 2 },
          fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
          "&:hover": {
            backgroundColor: "#ffffffff",
            color: "#000000ff",
            borderLeft: "2px solid #5fb52a",
          },
        }}
      >
        {value || "N/A"}
      </Typography>
    </Box>
  );

  const tableData = ficoDetails.map((model) => ({
    model: model.franchiseModel,
    type: model.franchiseType,
    investment: model.investmentRange,
    area: model.areaRequired,
    agreement: model.agreementPeriod ? `${model.agreementPeriod} yrs` : "N/A",
    franchiseFee: model.franchiseFee
      ? formatCurrency(model.franchiseFee)
      : "N/A",
    interiorCost: model.interiorCost
      ? formatCurrency(model.interiorCost)
      : "N/A",
    stock: model.stockInvestment
      ? formatCurrency(model.stockInvestment)
      : "N/A",
    otherCosts: model.otherCost ? formatCurrency(model.otherCost) : "N/A",
    workingCapital: model.requireWorkingCapital
      ? formatCurrency(model.requireWorkingCapital)
      : "N/A",
    royaltyFee: model.royaltyFee || "N/A",
    breakEven: model.breakEven || "N/A",
    roi: model.roi ? `${model.roi}%` : "N/A",
    payback: model.payBackPeriod || "N/A",
    margin: model.marginOnSales ? `${model.marginOnSales}%` : "N/A",
  }));

  const columns = [
    { label: "Business Opportunites", key: "model" },
    { label: "Business Model", key: "type" },
    { label: "Investment", key: "investment" },
    { label: "Area", key: "area" },
    { label: "Agreement", key: "agreement" },
    { label: "Franchise Fee", key: "franchiseFee" },
    { label: "Interior Cost", key: "interiorCost" },
    { label: "Stock", key: "stock" },
    { label: "Other Costs", key: "otherCosts" },
    { label: "Working Capital", key: "workingCapital" },
    { label: "Royalty Fee", key: "royaltyFee" },
    { label: "Break Even", key: "breakEven" },
    { label: "ROI", key: "roi" },
    { label: "Payback", key: "payback" },
    { label: "Margin", key: "margin" },
  ];

  const visibleColumns = columns.filter((col) =>
    tableData.some((row) => row[col.key] && row[col.key] !== "N/A"),
  );

  return (
    <Box sx={{ mb: 2, mt: 1 }}>
    

      <TableContainer
        ref={containerRef}
        sx={{
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
          // border: "3px solid #ff9800",
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "calc(100vh - 300px)",
          WebkitOverflowScrolling: "touch", // smooth touch scroll
          cursor: "grab", // show grab cursor
          "&:active": { cursor: "grabbing" },
          "&::-webkit-scrollbar": {
            height: "5px",
            backgroundColor: "#ffffffff",
            borderRadius: "7px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#7cd13b",

            borderRadius: "7px",
          },
        }}
        onTouchStart={handleUserScrollStart}
        onTouchEnd={handleUserScrollEnd}
        onMouseEnter={handleMouseEnter}
        onMouseDown={(e) => {
          const el = containerRef.current;
          el.isDown = true;
          el.startX = e.pageX - el.offsetLeft;
          el.scrollLeftStart = el.scrollLeft;
        }}
        onMouseLeave={() => {
          const el = containerRef.current;
          el.isDown = false;
        }}
        onMouseUp={() => {
          const el = containerRef.current;
          el.isDown = false;
        }}
        onMouseMove={(e) => {
          const el = containerRef.current;
          if (!el.isDown) return;
          e.preventDefault();
          const x = e.pageX - el.offsetLeft;
          const walk = (x - el.startX) * 1; // scroll speed
          el.scrollLeft = el.scrollLeftStart - walk;
        }}
      >
        {isMobile && (
          <Box sx={{ mt: 1 }}>
            {tableData.map((row, index) => (
              <Fade in key={index} timeout={index * 100}>
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    // width: "100%",
                    height: 400,
                    borderRadius: 2,
                    backgroundColor: "#ffffff",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <Typography
                    fontWeight={700}
                    fontSize="0.85rem"
                    sx={{ mb: 1, color: "#7cd13b" }}
                  >
                    Franchise Details
                  </Typography>

                  {visibleColumns.map((col) => (
                    <MobileRow
                      key={col.key}
                      label={col.label}
                      value={row[col.key]}
                    />
                  ))}
                </Box>
              </Fade>
            ))}
          </Box>
        )}
        {!isMobile && (
          <Table
            stickyHeader
            sx={{
              minWidth: "100%",
              tableLayout: "auto", // Changed to auto for better content-based sizing
            }}
          >
            <TableHead>
              <TableRow>
              
                {visibleColumns.map((col, i) => (
                  <TableCell
                    key={col.key}
                    align="center"
                    sx={{
                      backgroundColor: "#7cd13b",
                      color: "black",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      padding: "12px 16px",
                      borderBottom: "none",
                      whiteSpace: "nowrap",
                      minWidth: i === 0 ? "180px" : "120px", // Match cell widths
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <Fade in key={index} timeout={index * 100}>
                  <TableRow hover>
                    {visibleColumns.map((col, j) => (
                      <TableCell
                        key={col.key}
                        align="center"
                        sx={{
                          borderBottom: "1px solid rgba(0,0,0,0.05)",
                          padding: "16px",
                          minWidth: j === 0 ? "180px" : "170px",
                          maxWidth: "200px",
                          wordBreak: "break-word",
                          // backgroundColor: "#eedbbcff",
                          backgroundColor: "#ffffffff",
                          fontWeight:
                            (col.key === "roi" && row.roi !== "N/A") ||
                            (col.key === "margin" && row.margin !== "N/A")
                              ? 700
                              : "inherit",
                          color:
                            col.key === "roi" && parseFloat(row.roi) > 20
                              ? "success.main"
                              : col.key === "margin" &&
                                  parseFloat(row.margin) > 30
                                ? "success.main"
                                : "black",
                        }}
                      >
                        {row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fade>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default FranchiseDetailsTable;
