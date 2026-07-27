"use client";

import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import { useDispatch } from "react-redux";
import { openBrandDialog } from "../../../Redux/Slices/OpenBrandNewPageSlice";

const AppliedTab = ({
  items = [],
  isLoading = false,
  errorMessage = "",
  currentPage = 1,
  totalPages = 1,
  handlePageChange,
  isPaginating = false,
}) => {
  const dispatch = useDispatch();

  // console.log("AppliedTab Rendered with items:", items);

  const handleViewDetails = (brandId) => {
    if (brandId) {
      dispatch(openBrandDialog(brandId));
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography color="error">
          {errorMessage}
        </Typography>
      </Box>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No applied brands available
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          borderRadius: 3,
          overflowX: "auto",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><b>Brand Name</b></TableCell>
              {/* <TableCell><b>Investor Name</b></TableCell> */}
              {/* <TableCell><b>Email</b></TableCell> */}
              {/* <TableCell><b>Phone</b></TableCell> */}
              <TableCell><b>Investment Range</b></TableCell>
              {/* <TableCell><b>Plan To Invest</b></TableCell> */}
              {/* <TableCell><b>Ready To Invest</b></TableCell> */}
              <TableCell><b>Industry</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              {/* <TableCell><b>Location</b></TableCell> */}
              {/* <TableCell><b>Status</b></TableCell> */}
              <TableCell><b>Applied Date</b></TableCell>
              {/* <TableCell align="center"><b>Action</b></TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item, index) => (
              <TableRow hover key={item?._id || index}>
                <TableCell>
                  <Typography fontWeight={400}>
                    {item?.brandName || "-"}
                  </Typography>
                </TableCell>
                {/* <TableCell>{item?.investorName || "-"}</TableCell> */}
                {/* <TableCell>{item?.investorEmail || "-"}</TableCell> */}
                {/* <TableCell>{item?.investorPhone || "-"}</TableCell> */}
                <TableCell>{item?.investmentRange || "-"}</TableCell>
                {/* <TableCell>{item?.planToInvest || "-"}</TableCell> */}
                {/* <TableCell>{item?.readyToInvest || "-"}</TableCell> */}
                <TableCell>{item?.industry || "-"}</TableCell>
                <TableCell>{item?.category || "-"}</TableCell>
                {/* <TableCell>
                  <Typography variant="body2">
                    {item?.city || "-"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item?.district || "-"}, {item?.state || "-"}
                  </Typography>
                </TableCell> */}
                  {/* <TableCell>
                    <Chip
                      size="small"
                      label={item?.status || "new"}
                      color={
                        item?.status === "deal completed"
                          ? "success"
                          : item?.status === "follow-up"
                          ? "warning"
                          : item?.status === "not interested"
                          ? "error"
                          : "primary"
                      }
                    />
                  </TableCell> */}
                <TableCell>
                  {item?.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-IN")
                    : "-"}
                </TableCell>
                {/* <TableCell align="center">
                  <Tooltip title="View Brand">
                    <IconButton
                      color="warning"
                      onClick={() => handleViewDetails(item?.brandId)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
          }}
        >
          {/* <Pagination
            page={currentPage}
            count={totalPages}
            color="primary"
            onChange={(event, page) => {
              if (handlePageChange) {
                handlePageChange(page);
              }
            }}
          /> */}
        </Box>
      )}
    </>
  );
};

export default AppliedTab;