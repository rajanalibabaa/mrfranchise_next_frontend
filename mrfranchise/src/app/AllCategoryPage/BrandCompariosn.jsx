"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Tooltip,
  Chip,
} from "@mui/material";
import Close from "@mui/icons-material/Close";
import { RiBookmark3Fill } from "react-icons/ri";
import axios from "axios";
import { handleShortList } from "@/Api/shortListApi";
import { toggleBrandShortList } from "@/Redux/Slices/GetAllBrandsDataUpdationFile";
import { useDispatch } from "react-redux";
import { token, userId } from "@/Utils/autherId";
import LoginPage from "@/Components/LoginPage/LoginPage";
import { toggleHomeCardShortlist } from "@/Redux/Slices/TopCardFetchingSlice";
import { toggleBrandShortListfilter } from "@/Redux/Slices/FilterBrandSlice";
import { postView } from "@/Utils/function/view.jsx";
import { openBrandDialog } from "@/Redux/Slices/OpenBrandNewPageSlice.jsx";
 
 
const BrandComparison = ({
  open,
  onClose,
  selectedBrands,
  onRemoveFromComparison,
}) => {
  const [currentModelIndexes, setCurrentModelIndexes] = useState({});
  const [brandDetails, setBrandDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const dispatch = useDispatch();
 
//   useEffect(() => {
//     const fetchBrandDetails = async () => {
//       if ( selectedBrands.length === 0) return;
 
//       setLoading(true);
//       try {
//         const promises = selectedBrands.map((brand) =>
//   axios.get(`https://mrfranchisebackend.mrfranchise.in/api/v1/brandlisting/getBrandListingByUUID/${brand.uuid}`, {
//     params: {
//       userId: userId
//     }
//   })
// );
       
 
//         const responses = await Promise.all(promises);
 
//         // Flatten each response's data if it's an array
//         const details = responses.map((res) => {
//           const data = res.data.data;
 
 
//           return Array.isArray(data) ? data[0] : data;
//         });
 
//         setBrandDetails(details); // Now this will be an array of objects, not arrays
 
//         // Initialize current model indexes
//         const indexes = {};
//         details.forEach((brand) => {
//           if (brand?.uuid) indexes[brand.uuid] = 0;
//         });
//         setCurrentModelIndexes(indexes);
//       } catch (error) {
//         console.error("❌ Error fetching brand details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchBrandDetails();
//   }, [selectedBrands]);
 
  // ...existing code...
useEffect(() => {
  const fetchBrandDetails = async () => {
    if (!selectedBrands || selectedBrands.length === 0) return;

    setLoading(true);
    try {
      const promises = selectedBrands.map((brand) =>
        axios.get(`https://mrfranchisebackend.mrfranchise.in/api/v1/brandlisting/getBrandListingByUUID/${brand.uuid}`, {
          params: {
            userId: userId
          }
        })
      );

      const responses = await Promise.all(promises);

      // Flatten each response's data if it's an array
      const details = responses.map((res) => {
        const data = res.data.data;

        return Array.isArray(data) ? data[0] : data;
      });

      setBrandDetails(details); // Now this will be an array of objects, not arrays

      // Initialize current model indexes
      const indexes = {};
      details.forEach((brand) => {
        if (brand?.uuid) indexes[brand.uuid] = 0;
      });
      setCurrentModelIndexes(indexes);
    } catch (error) {
      console.error("❌ Error fetching brand details:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchBrandDetails();
}, [selectedBrands]);
// ...existing code...

  const getNestedValue = (obj, path) => {
    try {
      return (
        path.split(".").reduce((o, p) => {
          if (p.includes("[") && p.includes("]")) {
            const prop = p.substring(0, p.indexOf("["));
            const index = parseInt(
              p.substring(p.indexOf("[") + 1, p.indexOf("]"))
            );
            return o && o[prop] ? o[prop][index] : null;
          }
          return o ? o[p] : null;
        }, obj) ?? "-"
      );
    } catch (e) {
      return "-";
    }
  };
 
  const handleToggleShortList = async (brand) => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    try {
      const brandId = brand.uuid;
      dispatch(toggleBrandShortList(brandId));
      dispatch(toggleHomeCardShortlist(brandId));
      dispatch(toggleBrandShortListfilter(brandId));
      await handleShortList(brandId);
     
      // Update local state
      setBrandDetails(prev =>
        prev.map(b =>
          b.uuid === brandId ? { ...b, isShortListed: !b.isShortListed } : b
        )
      );
    } catch (error) {
      console.error("Error toggling shortlist:", error);
    }
  };
 
 
 const handleApply = (brand) => {
       postView(brand?.uuid);
       dispatch(openBrandDialog(brand));
     };
 
 
 
 
 
  const basicInfoFields = [
    { label: "Brand Name", field: "brandDetails.brandName" },
    { label: "Company Name", field: "brandDetails.companyName" },
    { label: "Established Year", field: "brandfranchisedetails.franchiseDetails.establishedYear" },
    { label: "Total Outlets", field: "brandfranchisedetails.franchiseDetails.totalOutlets" },
    {
      label: "Company Owned Outlets",
      field: "brandfranchisedetails.franchiseDetails.companyOwnedOutlets",
    },
    { label: "Franchise Outlets", field: "brandfranchisedetails.franchiseDetails.franchiseOutlets" },
    {
      label: "Agreement Period",
      field: "brandfranchisedetails.franchiseDetails.fico[0].agreementPeriod",
    },
    { label: "Requirement Support", field: "brandfranchisedetails.franchiseDetails.consultationOrAssistance" },
  ];
 
  const franchiseModelFields = [
    { label: "Franchise Model", field: "franchiseModel" },
    { label: "Franchise Type", field: "franchiseType" },
    { label: "Area Required (sq.ft)", field: "areaRequired" },
    { label: "Investment Range", field: "investmentRange" },
    { label: "Franchise Fee", field: "franchiseFee" },
    { label: "Royalty Fee", field: "royaltyFee" },
    { label: "Break Even Period", field: "breakEven" },
    { label: "ROI", field: "roi" },
    { label: "Interior Cost", field: "interiorCost" },
    { label: "Other Costs", field: "otherCost" },
    { label: "Stock Investment", field: "stockInvestment" },
    { label: "Pay Back Period", field: "payBackPeriod" },
    { label: "Require Working Captial", field: "requireWorkingCapital" },
    { label: "Margin On Sales", field: "marginOnSales" },
  ];
 
  return (
    <Box>
      <Box>
      </Box>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "80vh",
            height: "90vh",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#f5f5f5",
            color: "Black",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Brand Comparison ({brandDetails.length})
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "black" }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                Loading brand details...
              </Typography>
            </Box>
          ) : brandDetails.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                No brands selected for comparison
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold", width: "200px" }}>
                      Feature
                    </TableCell>
                    {brandDetails.map((brand) => (
                      <TableCell
                        key={brand.uuid}
                        align="center"
                        sx={{ width: `${80 / brandDetails.length}%` }}
                      >
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          mt={2}
                          position="relative"
                        >
                          <Box position="relative">
                            <Avatar
                              variant="square"
                              src={brand.uploads?.logo || ""}
                              alt={brand.brandDetails?.brandName}
                              sx={{
                                width: 100,
                                height: 80,
                                borderRadius: "8px",
                                mb: 1,
                                border: "2px solid #ff9800",
                                bgcolor: "white",
                                p: 0.5,
                              }}
                            />
                           
                            <Tooltip title={brand?.isShortListed ? "Remove from Shortlist" : "Add to Shortlist"}>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleShortList(brand);
                                }}
                                sx={{
                                  position: 'absolute',
                                  top: '-10px',
                                  right: '-15px',
                                  padding: 0.5,
                                  color: brand?.isShortListed ? "#7ef400ff" : "rgba(0, 0, 0, 0.23)",
                                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                  borderRadius: '4px',
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                  }
                                }}
                                size="small"
                              >
                                <RiBookmark3Fill size={23} />
                              </IconButton>
                            </Tooltip>
                          </Box>
 
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", color: "#4caf50" }}
                          >
                            {brand.brandDetails?.brandName || "-"}
                          </Typography>
                          <Typography display='flex' space='between' flexDirection='row' component={'div'}>
                                                      <Chip label="Apply Brand" size="small" onClick={() => handleApply(brand)} sx={{ mt: 1, bgcolor: "#ff9800", color: "white", "&:hover": { bgcolor: "#fb8c00", }, }} />
 
                          <Chip
                            label="Remove"
                            size="small"
                            onClick={() => onRemoveFromComparison(brand.uuid)}
                            sx={{
                              mt: 1,
                              bgcolor: "#F2211D",
                              color: "white",
                              "&:hover": {
                                bgcolor: "#fb2a00ff",
                              },
                            }}
                          />
                          </Typography>
                         
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {basicInfoFields.map((field) => (
                    <TableRow key={field.label} hover>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}
                      >
                        <Typography variant="subtitle2">{field.label}</Typography>
                      </TableCell>
                      {brandDetails.map((brand) => {
                        let value = getNestedValue(brand, field.field);
 
                        if (
                          field.label === "Requirement Support" &&
                          Array.isArray(value)
                        ) {
                          value = value.join(", ");
                        }
 
                        return (
                          <TableCell
                            key={`${brand.uuid}-${field.field}`}
                            align="center"
                            sx={{
                              borderLeft: "1px solid #e0e0e0",
                              bgcolor:
                                field.label === "Brand Name"
                                  ? "#f5f5f5"
                                  : "white",
                            }}
                          >
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
 
                  {franchiseModelFields.map((field) => (
                    <TableRow key={field.label} hover>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ bgcolor: "#f9f9f9", fontWeight: "bold" }}
                      >
                        <Typography variant="subtitle2">{field.label}</Typography>
                      </TableCell>
                      {brandDetails.map((brand) => {
                        const models = brand?.brandfranchisedetails?.franchiseDetails?.fico || [];
                        const currentIndex = currentModelIndexes[brand.uuid] || 0;
                        const currentModel = models[currentIndex];
 
                        return (
                          <TableCell
                            key={`${brand.uuid}-${field.field}-${currentIndex}`}
                            align="center"
                            sx={{
                              borderLeft: "1px solid #e0e0e0",
                              bgcolor: "white",
                            }}
                          >
                            {currentModel ? (
                              <Typography
                                sx={{
                                  color:
                                    field?.label?.includes("Fee") ||
                                    field?.label?.includes("Cost")
                                      ? "#ff9800"
                                      : "inherit",
                                  fontWeight: field?.label?.includes("Investment")
                                    ? "bold"
                                    : "normal",
                                }}
                              >
                                {getNestedValue(currentModel, field.field.replace(/^brandfranchisedetails\.franchiseDetails\.fico\[\d+\]\./, ''))}
                              </Typography>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions
          sx={{ bgcolor: "#f5f5f5", position: "sticky", bottom: 0, zIndex: 1 }}
        >
          <Button
  onClick={() => {
    setBrandDetails([]); // clear brand details
    setCurrentModelIndexes({}); // reset indexes
    onClose(); // then close the dialog
  }}
  sx={{
    color: "white",
    bgcolor: "#ff9800",
    "&:hover": {
      bgcolor: "#388e3c",
    },
  }}
>
  Close Comparison
</Button>
 
        </DialogActions>
      </Dialog>
 
      {/* Login Dialog */}
      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Box>
  );
};
 
export default BrandComparison;
 