"use client";
import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
} from "@mui/material";
import Close from "@mui/icons-material/Close";
import { RiBookmark3Fill } from "react-icons/ri";
import axios from "axios";
import { handleShortList } from "@/Api/shortListApi";
import { toggleBrandShortList } from "@/Redux/Slices/GetAllBrandsDataUpdationFile";
import { useDispatch } from "react-redux";
import { getToken, getUserId } from "@/Utils/autherId";
import LoginPage from "@/Components/LoginPage/LoginPage";
import { toggleHomeCardShortlist } from "@/Redux/Slices/TopCardFetchingSlice";
import { toggleBrandShortListfilter } from "@/Redux/Slices/FilterBrandSlice";
import { postView } from "@/Utils/function/view.jsx";
import { openBrandDialog } from "@/Redux/Slices/OpenBrandNewPageSlice.jsx";
import html2canvas from "html2canvas";
import dynamic from "next/dynamic";
const jsPDF = dynamic(() => import("jspdf"), { ssr: false });

const token = getToken();
const userId = getUserId();

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
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const dispatch = useDispatch();
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchBrandDetails = async () => {
      if (!selectedBrands || selectedBrands.length === 0) return;

      setLoading(true);
      try {
        const promises = selectedBrands.map((brand) =>
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brandlisting/getBrandListingByUUID/${brand.uuid}`,
            {
              params: { userId: userId },
            },
          ),
        );

        const responses = await Promise.all(promises);
        const details = responses.map((res) => {
          const data = res.data.data;
          return Array.isArray(data) ? data[0] : data;
        });

        setBrandDetails(details);

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

  const getNestedValue = (obj, path) => {
    try {
      return (
        path.split(".").reduce((o, p) => {
          if (p.includes("[") && p.includes("]")) {
            const prop = p.substring(0, p.indexOf("["));
            const index = parseInt(
              p.substring(p.indexOf("[") + 1, p.indexOf("]")),
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

      setBrandDetails((prev) =>
        prev.map((b) =>
          b.uuid === brandId ? { ...b, isShortListed: !b.isShortListed } : b,
        ),
      );
    } catch (error) {
      console.error("Error toggling shortlist:", error);
    }
  };

  const handleApply = (brand) => {
    postView(brand?.uuid);
    dispatch(openBrandDialog(brand));
  };

  const loadImages = (element) => {
    const images = Array.from(element.querySelectorAll("img"));
    return Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }),
    );
  };

  /**
   * Convert an external image URL to a data URL (blob) to bypass CORS.
   */
  const imageToDataURL = (url) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        try {
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        } catch (err) {
          console.warn("Failed to convert image to data URL:", url, err);
          resolve(null);
        }
      };
      img.onerror = () => {
        console.warn("Failed to load image for PDF:", url);
        resolve(null);
      };
      img.src = url;
    });
  };

//   if (!tableRef.current) return;

//   setPdfGenerating(true);

//   try {
//     const canvas = await html2canvas(tableRef.current, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("landscape", "mm", "a4");

//     const pageWidth = 297;
//     const pageHeight = 210;

//     // fit width
//     let imgWidth = pageWidth;
//     let imgHeight = (canvas.height * imgWidth) / canvas.width;

//     // 👉 if height overflow → shrink to single page
//     if (imgHeight > pageHeight) {
//       const ratio = pageHeight / imgHeight;
//       imgHeight = pageHeight;
//       imgWidth = imgWidth * ratio;
//     }

//     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

//     pdf.save("brand-comparison.pdf");

//   } catch (error) {
//     console.error(error);
//   } finally {
//     setPdfGenerating(false);
//   }
// };
// 1 double page
// const downloadPDF = async () => {
//   if (!tableRef.current) return;

//   setPdfGenerating(true);

//   try {
//     const canvas = await html2canvas(tableRef.current, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("landscape", "mm", "a4");

//     const pageWidth = 297; // A4 landscape width
//     const pageHeight = 210; // A4 landscape height

//     const imgWidth = pageWidth;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     let heightLeft = imgHeight;
//     let position = 0;

//     // First page
//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     // Extra pages
//     while (heightLeft > 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }

//     pdf.save("brand-comparison.pdf");

//   } catch (error) {
//     console.error(error);
//   } finally {
//     setPdfGenerating(false);
//   }
// };
// 2 single page
// const downloadPDF = async () => {

//   if (!tableRef.current) return;

//   setPdfGenerating(true);

//   try {
//     const canvas = await html2canvas(tableRef.current, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("landscape", "mm", "a4");

//     const pageWidth = 297;
//     const pageHeight = 210;

//     let imgWidth = pageWidth;
//     let imgHeight = (canvas.height * imgWidth) / canvas.width;

//     // 👉 if height overflow → scale both
//     if (imgHeight > pageHeight) {
//       const ratio = pageHeight / imgHeight;
//       imgHeight = pageHeight;
//       imgWidth = imgWidth * ratio;
//     }

//     // optional center
//     const x = (pageWidth - imgWidth) / 2;
//     const y = (pageHeight - imgHeight) / 2;

//     pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

//     pdf.save("brand-comparison.pdf");

//   } catch (error) {
//     console.error(error);
//   } finally {
//     setPdfGenerating(false);
//   }
// };

const downloadPDF = async () => {
  if (!tableRef.current) return;

  setPdfGenerating(true);

  const element = tableRef.current;

  // 👉 store original width
  const originalWidth = element.style.width;

  // 👉 force desktop width
  element.style.width = "1400px";

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");

    const pageWidth = 297;
    const pageHeight = 210;

    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight) {
      const ratio = pageHeight / imgHeight;
      imgHeight = pageHeight;
      imgWidth = imgWidth * ratio;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

    pdf.save("MRFRANCHISE-brand-comparison.pdf");

  } catch (error) {
    console.error(error);
  } finally {
    // 👉 restore width
    element.style.width = originalWidth;
    setPdfGenerating(false);
  }
};
 

const basicInfoFields = [
    { label: "Brand Name", field: "brandDetails.brandName" },
    { label: "Company Name", field: "brandDetails.companyName" },
    {
      label: "Established Year",
      field: "brandfranchisedetails.franchiseDetails.establishedYear",
    },
    {
      label: "Total Outlets",
      field: "brandfranchisedetails.franchiseDetails.totalOutlets",
    },
    {
      label: "Company Owned Outlets",
      field: "brandfranchisedetails.franchiseDetails.companyOwnedOutlets",
    },
    {
      label: "Franchise Outlets",
      field: "brandfranchisedetails.franchiseDetails.franchiseOutlets",
    },
    {
      label: "Agreement Period",
      field: "brandfranchisedetails.franchiseDetails.fico[0].agreementPeriod",
    },
    {
      label: "Requirement Support",
      field: "brandfranchisedetails.franchiseDetails.consultationOrAssistance",
    },
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
    { label: "Require Working Capital", field: "requireWorkingCapital" },
    { label: "Margin On Sales", field: "marginOnSales" },
  ];

  brandDetails.map((brand) => {
    const logoUrl = brand.uploads?.logo;
    console.log(brand);
    console.log("Logo URL:", logoUrl);
  });

  return (
    <Box>
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Brand Comparison ({brandDetails.length})
            </Typography>
            <Box>
              {brandDetails.length > 0 && (
                <Button
                  onClick={downloadPDF}
                  disabled={pdfGenerating}
                  sx={{
                    mr: 1,
                    color: "white",
                    bgcolor: "#4caf50",
                    "&:hover": { bgcolor: "#45a049" },
                  }}
                >
                  {pdfGenerating ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Download PDF"
                  )}
                </Button>
              )}
              <IconButton onClick={onClose} sx={{ color: "black" }}>
                <Close />
              </IconButton>
            </Box>
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
            <TableContainer component={Paper} ref={tableRef}>
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
                              src={
                                brand.uploads?.logo
                                  ? `${process.env.NEXT_PUBLIC_API_URL}/api/image-proxy?url=${encodeURIComponent(brand.uploads?.logo)}`
                                  : ""
                              }
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
                            <Tooltip
                              title={
                                brand?.isShortListed
                                  ? "Remove from Shortlist"
                                  : "Add to Shortlist"
                              }
                            >
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleShortList(brand);
                                }}
                                sx={{
                                  position: "absolute",
                                  top: "-10px",
                                  right: "-15px",
                                  padding: 0.5,
                                  color: brand?.isShortListed
                                    ? "#7ef400ff"
                                    : "rgba(0, 0, 0, 0.23)",
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                  borderRadius: "4px",
                                  "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  },
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
                          <Typography
                            display="flex"
                            space="between"
                            flexDirection="row"
                            component={"div"}
                          >
                            <Chip
                              label="Apply Brand"
                              size="small"
                              onClick={() => handleApply(brand)}
                              sx={{
                                mt: 1,
                                bgcolor: "#ff9800",
                                color: "white",
                                "&:hover": { bgcolor: "#fb8c00" },
                              }}
                            />
                            <Chip
                              label="Remove"
                              size="small"
                              onClick={() => onRemoveFromComparison(brand.uuid)}
                              sx={{
                                mt: 1,
                                ml: 1,
                                bgcolor: "#F2211D",
                                color: "white",
                                "&:hover": { bgcolor: "#fb2a00ff" },
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
                        <Typography variant="subtitle2">
                          {field.label}
                        </Typography>
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
                        <Typography variant="subtitle2">
                          {field.label}
                        </Typography>
                      </TableCell>
                      {brandDetails.map((brand) => {
                        const models =
                          brand?.brandfranchisedetails?.franchiseDetails
                            ?.fico || [];
                        const currentIndex =
                          currentModelIndexes[brand.uuid] || 0;
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
                                  fontWeight: field?.label?.includes(
                                    "Investment",
                                  )
                                    ? "bold"
                                    : "normal",
                                }}
                              >
                                {getNestedValue(
                                  currentModel,
                                  field.field.replace(
                                    /^brandfranchisedetails\.franchiseDetails\.fico\[\d+\]\./,
                                    "",
                                  ),
                                )}
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
              setBrandDetails([]);
              setCurrentModelIndexes({});
              onClose();
            }}
            sx={{
              color: "white",
              bgcolor: "#ff9800",
              "&:hover": { bgcolor: "#388e3c" },
            }}
          >
            Close Comparison
          </Button>
        </DialogActions>
      </Dialog>

      {showLogin && (
        <LoginPage open={showLogin} onClose={() => setShowLogin(false)} />
      )}
    </Box>
  );
};

export default BrandComparison;
