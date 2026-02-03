"use client";

import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  styled,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  FormControl,
  InputLabel,
  Chip,
  TextField,
  useTheme,
} from "@mui/material";
import {
  InfoOutlined,
  CloudUpload,
  VideoCameraBack,
  Description,
  PhotoCamera,
  ErrorOutline,
  CheckCircle,
  Delete,
} from "@mui/icons-material";
import { flex, grid, width } from "@mui/system";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[1],
}));

const UploadButton = styled(Button)(({ theme }) => ({
  height: 56,
  marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.warning.main,
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
}));

const FilePreviewImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: 4,
});

const Uploads = ({
  data = {},
  errors = {},
  onChange,
  gstNumber,
  pancardNumber,
  onGstNumberChange,
  awardText = [],
  onAwardTextChange,
  onPancardNumberChange,
}) => {
  const theme = useTheme();
  const safeData = data || {};
  const safeOnChange = onChange || (() => {});

  const [awardsData, setAwardsData] = useState(safeData.awards || []);
  const [currentAward, setCurrentAward] = useState({
    text: "",
    documents: [],
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFileChange =
    (field, options = {}) =>
    (e) => {
      const { maxFiles = Infinity, allowedTypes = [], maxSize = 5 } = options;
      const files = Array.from(e.target.files || []);

      // Validate file types
      const validFiles = files.filter((file) => {
        if (!file || !file.type) return false;
        if (allowedTypes.length === 0) return true;
        return allowedTypes.some((type) => file.type.includes(type));
      });

      // Validate file size (in MB)
      const sizeValidFiles = validFiles.filter(
        (file) => file.size <= maxSize * 1024 * 1024
      );

      if (sizeValidFiles.length < validFiles.length) {
        alert(`Some files exceed the maximum size of ${maxSize}MB`);
      }

      // Validate number of files
      const currentFiles = safeData[field] || [];
      const totalFiles = currentFiles.length + sizeValidFiles.length;

      if (totalFiles > maxFiles) {
        alert(`Maximum ${maxFiles} file(s) allowed for this field`);
        return;
      }

      const updatedFiles = [...currentFiles, ...sizeValidFiles];
      safeOnChange({ [field]: updatedFiles });
    };

  const handleRemoveFile = (field, index) => {
    const updatedFiles = [...(safeData[field] || [])];
    updatedFiles.splice(index, 1);
    safeOnChange({ [field]: updatedFiles });
  };

  const createObjectURL = (file) => {
    if (!file) return "";
    try {
      if (file instanceof Blob) {
        return URL.createObjectURL(file);
      }
      return "";
    } catch (error) {
      console.error("Error creating object URL:", error);
      return "";
    }
  };

  const handleAwardTextChange = (e) => {
    setCurrentAward((prev) => ({
      ...prev,
      text: e.target.value,
    }));
  };

  const handleAwardFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentAward((prev) => ({
        ...prev,
        document: file,
      }));
    }
  };

  const handleAddAward = () => {
    if (!currentAward.text || !currentAward.document) return;

    // Update award text in parent
    const updatedAwardTexts = [...awardText, currentAward.text];
    onAwardTextChange(updatedAwardTexts);

    // Update award documents in parent
    const updatedAwardDocs = [...(data.awardDoc || []), currentAward.document];
    onChange({ awardDoc: updatedAwardDocs });

    // Reset form
    setCurrentAward({
      text: "",
      document: null,
    });
  };

  const handleAwardRemove = (index) => {
    // Remove from both text and documents arrays
    const updatedAwardTexts = awardText.filter((_, i) => i !== index);
    onAwardTextChange(updatedAwardTexts);

    const updatedAwardDocs = (data.awardDoc || []).filter(
      (_, i) => i !== index
    );
    onChange({ awardDoc: updatedAwardDocs });
  };

  return (
    // <Box sx={{ maxWidth: 1200, margin: "0 auto", p: { xs: 2, md: 3 } }}>
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
      {/* Section 1: Brand Identity */}

      {/* Section 1: Brand Identity */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Brand Identity
          <Tooltip
            title={
              <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                Drag and drop your logo here or click to upload
              </span>
            }
            placement="right-start"
            arrow
            enterTouchDelay={0}
          >
            <IconButton
              size="small"
              sx={{
                color: "warning.main",
                "&:hover": {
                  backgroundColor: "info.main",
                  color: "white",
                },
                marginLeft: "5px",
              }}
            >
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>{" "}
        </SectionTitle>

        <Grid
          spacing={3}
          sx={{ display: { md: "flex" } }}
          justifyContent={"space-evenly"}
        >
          {/* Brand Logo */}
          <Grid item xs={12} md={6}>
            <Typography textAlign={"center"} mb={1} variant="body2">
              Brand Logo
            </Typography>
            <FormControl fullWidth>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  // width: "100%", // Make it full width of the grid item
                  width: { md: "568px" , }, // Limit width on medium screens
                }}
              >
                <UploadButton
                  component="label"
                  color="success"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                >
                  Upload Logo
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // ✅ Auto-clear the error when a new file is chosen
                        if (errors?.brandLogo) errors.brandLogo = "";

                        // ✅ Proceed with your validation and upload logic
                        handleFileChange("brandLogo", {
                          maxFiles: 1,
                          allowedTypes: ["image/jpeg", "image/png"],
                          maxSize: 2,
                        })(e);
                      }
                    }}
                  />
                </UploadButton>
                <Typography
                  variant="caption"
                  color={errors.brandLogo ? "error" : "textSecondary"}
                >
                  {errors.brandLogo ||
                    "(Accepted formats: JPEG, PNG up to 2MB)"}
                </Typography>

                {safeData.brandLogo?.length > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={safeData.brandLogo[0].name}
                      onDelete={() => handleRemoveFile("brandLogo", 0)}
                      deleteIcon={<CheckCircle fontSize="small" />}
                      variant="outlined"
                      color="success"
                    />
                    <IconButton
                      onClick={() => handleRemoveFile("brandLogo", 0)}
                      color="error"
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </FormControl>
          </Grid>

          {/* Promotion Videos */}
          <Grid item xs={12} md={6} sx={{ mt: { md: 0, xs: 3 } }}>
            <Typography textAlign={"center"} mb={1} variant="body2">
              Franchise Promotion Video
            </Typography>
            <FormControl fullWidth>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  // width: "100%", // Make it full width of the grid item
                  width: { md: "568px" }, // Limit width on medium screens
                }}
              >
                <UploadButton
                  component="label"
                  variant="outlined"
                  color="success"
                  startIcon={<VideoCameraBack />}
                >
                  Upload Video
                  <VisuallyHiddenInput
                    type="file"
                    accept="video/mp4,video/quicktime"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // 🔹 Auto-clear the error when user reselects a new video
                        if (errors?.franchisePromotionVideo)
                          errors.franchisePromotionVideo = "";

                        // 🔹 Continue your existing file validation logic
                        handleFileChange("franchisePromotionVideo", {
                          maxFiles: 1,
                          allowedTypes: ["video/mp4", "video/quicktime"],
                          maxSize: 25, // MB
                        })(e);
                      }
                    }}
                  />
                </UploadButton>
                <Typography
                  variant="caption"
                  color={
                    errors.franchisePromotionVideo ? "error" : "textSecondary"
                  }
                >
                  {errors.franchisePromotionVideo ||
                    "Accepted formats: MP4, Quicktime Video (up to 25MB)"}
                </Typography>
                {safeData.franchisePromotionVideo?.length > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={safeData.franchisePromotionVideo[0].name}
                      onDelete={() =>
                        handleRemoveFile("franchisePromotionVideo", 0)
                      }
                      deleteIcon={<CheckCircle fontSize="small" />}
                      variant="outlined"
                      color="success"
                    />
                    <IconButton
                      onClick={() =>
                        handleRemoveFile("franchisePromotionVideo", 0)
                      }
                      color="error"
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Section 2: Company Credentials */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Company Credentials
          <Tooltip
            title={
              <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                Drag and drop your logo here or click to upload
              </span>
            }
            placement="right-start"
            arrow
            enterTouchDelay={0}
          >
            <IconButton
              size="small"
              sx={{
                color: "warning.main",
                "&:hover": {
                  backgroundColor: "info.main",
                  color: "white",
                },
                marginLeft: "5px",
              }}
            >
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>{" "}
        </SectionTitle>

        <Grid
          sx={{ display: { md: "flex" } }}
          justifyContent={"space-evenly"}
          spacing={3}
        >
          {/* PAN Details */}
          <Grid item xs={12} md={6} sx={{ mr: { md: 2 } }}>
            <TextField
              label="PAN Number"
              fullWidth
              value={pancardNumber || ""}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                // 🔹 Update the input value
                onPancardNumberChange(value);

                // 🔹 Auto-clear the error as soon as user retypes
                if (errors?.pancardNumber) errors.pancardNumber = "";
              }}
              error={Boolean(errors.pancardNumber)}
              helperText={errors.pancardNumber || "Format: AAAAA9999A"}
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 10,
                pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
                title:
                  "PAN must be in format: AAAAA9999A (5 letters, 4 digits, 1 letter)",
                style: { textTransform: "uppercase", letterSpacing: "1px" },
              }}
            />

            <InputLabel shrink sx={{ mb: 1 }}>
              PAN Card Upload
            </InputLabel>
            <UploadButton
              component="label"
              variant="outlined"
              startIcon={<Description />}
              fullWidth
              color="success"
            >
              Upload PAN Card
              <VisuallyHiddenInput
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // ✅ Auto-clear the error when a new file is chosen
                    if (errors?.pancard) errors.pancard = "";

                    // ✅ Proceed with your validation and upload logic
                    handleFileChange("pancard", {
                      maxFiles: 1,
                      allowedTypes: [
                        "application/pdf",
                        "image/jpeg",
                        "image/png",
                      ],
                      maxSize: 1,
                    })(e);
                  }
                }}
              />
            </UploadButton>
            <Typography
              variant="caption"
              color={errors.pancard ? "error" : "textSecondary"}
            >
              {errors.pancard || "Accepted formats: PDF, JPEG, PNG (up to 1MB)"}
            </Typography>
            {safeData.pancard?.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={safeData.pancard[0].name}
                  onDelete={() => handleRemoveFile("pancard", 0)}
                  deleteIcon={<CheckCircle fontSize="small" />}
                  variant="outlined"
                  color="success"
                />
                <IconButton
                  onClick={() => handleRemoveFile("pancard", 0)}
                  color="error"
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Grid>

          {/* GST Details */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ mt: { xs: 3, md: 0 }, ml: { md: 2 } }}
          >
            <TextField
              label="GST Number"
              fullWidth
              value={gstNumber || ""}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();

                // 🔹 Update the input value
                onGstNumberChange(value);

                // 🔹 Auto-clear the error as soon as user retypes
                if (errors?.gstNumber) errors.gstNumber = "";
              }}
              error={!!errors.gstNumber}
              helperText={errors.gstNumber || "Format: 22AAAAA0000A1Z5"}
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 15,
                pattern:
                  "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
                title:
                  "GST must be in format: 22AAAAA0000A1Z5 (15 characters, uppercase)",
                style: { textTransform: "uppercase", letterSpacing: "1px" },
              }}
            />

            <InputLabel shrink sx={{ mb: 1 }}>
              GST Certificate Upload
            </InputLabel>
            <UploadButton
              component="label"
              variant="outlined"
              startIcon={<Description />}
              fullWidth
              color="success"
            >
              Upload GST Certificate
              <VisuallyHiddenInput
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // ✅ Auto-clear the error when a new file is chosen
                    if (errors?.gstCertificate) errors.gstCertificate = "";

                    // ✅ Proceed with your validation and upload logic
                    handleFileChange("gstCertificate", {
                      maxFiles: 1,
                      allowedTypes: [
                        "application/pdf",
                        "image/jpeg",
                        "image/png",
                      ],
                      maxSize: 1,
                    })(e);
                  }
                }}
              />
            </UploadButton>
            <Typography
              variant="caption"
              color={errors.gstCertificate ? "error" : "textSecondary"}
            >
              {errors.gstCertificate ||
                "Accepted formats: PDF, JPEG, PNG (up to 1MB)"}
            </Typography>

            {safeData.gstCertificate?.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={safeData.gstCertificate[0].name}
                  onDelete={() => handleRemoveFile("gstCertificate", 0)}
                  deleteIcon={<CheckCircle fontSize="small" />}
                  variant="outlined"
                  color="success"
                />
                <IconButton
                  onClick={() => handleRemoveFile("gstCertificate", 0)}
                  color="error"
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Section 3: Brand Images */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Store / Branch / Images
          <Tooltip
            title={
              <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                <strong>Brand Images</strong> <br />
                Accepted formats: JPEG, PNG (up to 1MB)
              </span>
            }
            placement="right-start"
            arrow
            enterTouchDelay={0}
          >
            <IconButton
              size="small"
              sx={{
                color: "warning.main",
                "&:hover": {
                  backgroundColor: "info.main",
                  color: "white",
                },
                marginLeft: "5px",
              }}
            >
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>{" "}
        </SectionTitle>

        <Grid
          container
          spacing={3}
          sx={{ display: { md: "flex" } }}
          justifyContent={"space-evenly"}
        >
          {/* Exterior Images */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  // width: "100%", // Make it full width of the grid item
                  width: { md: "568px" }, // Limit width on medium screens
                }}
              >
                <UploadButton
                  component="label"
                  variant="outlined"
                  color="success"
                  fullWidth
                  startIcon={<PhotoCamera />}
                >
                  Upload Exterior Images
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        // ✅ Auto-clear the error when new files are chosen
                        if (errors?.exteriorOutlet) errors.exteriorOutlet = "";
                        if (errors?.exteriorOutletCount)
                          errors.exteriorOutletCount = "";

                        // ✅ Proceed with your validation and upload logic
                        handleFileChange("exteriorOutlet", {
                          maxFiles: 5,
                          allowedTypes: ["image/jpeg", "image/png"],
                          maxSize: 5,
                        })(e);
                      }
                    }}
                  />
                </UploadButton>

                <Typography
                  variant="caption"
                  color={
                    errors.exteriorOutlet || errors.exteriorOutletCount
                      ? "error"
                      : "textSecondary"
                  }
                  sx={{ mt: -1 }}
                >
                  {errors.exteriorOutlet ||
                    errors.exteriorOutletCount ||
                    "Accepted formats: JPEG, PNG (up to total 5MB)"}
                </Typography>

                {safeData.exteriorOutlet?.length > 0 && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        "&::-webkit-scrollbar": { height: "6px" },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "divider",
                          borderRadius: "3px",
                        },
                      }}
                    >
                      {safeData.exteriorOutlet.map((file, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: "relative",
                            flexShrink: 0,
                            width: "100px",
                            height: "100px",
                          }}
                        >
                          {createObjectURL(file) && (
                            <FilePreviewImage
                              src={createObjectURL(file)}
                              alt={`Exterior ${index + 1}`}
                              loading="lazy"
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 1,
                              }}
                            />
                          )}
                          <IconButton
                            onClick={() =>
                              handleRemoveFile("exteriorOutlet", index)
                            }
                            color="error"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              backgroundColor: "rgba(255,255,255,0.8)",
                              "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.9)",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                    <Typography
                      variant="caption"
                      color={
                        safeData.exteriorOutlet.length < 3 ? "error" : "success"
                      }
                      sx={{ display: "flex", alignItems: "center", mt: 1 }}
                    >
                      {safeData.exteriorOutlet.length < 3 ? (
                        <>
                          <ErrorOutline fontSize="small" sx={{ mr: 0.5 }} />
                          {3 - safeData.exteriorOutlet.length} more required
                        </>
                      ) : (
                        <>
                          <CheckCircle fontSize="small" sx={{ mr: 0.5 }} />
                          Minimum requirement met
                        </>
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </FormControl>
          </Grid>

          {/* Interior Images */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  // width: "100%", // Make it full width of the grid item
                  width: { md: "568px" }, // Limit width on medium screens
                }}
              >
                <UploadButton
                  component="label"
                  variant="outlined"
                  fullWidth
                  color="success"
                  startIcon={<PhotoCamera />}
                  sx={{ height: "56px" }}
                >
                  Upload Interior Images
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        // ✅ Auto-clear the error when new files are chosen
                        if (errors?.interiorOutlet) errors.interiorOutlet = "";
                        if (errors?.interiorOutletCount)
                          errors.interiorOutletCount = "";

                        // ✅ Proceed with your validation and upload logic
                        handleFileChange("interiorOutlet", {
                          maxFiles: 5,
                          allowedTypes: ["image/jpeg", "image/png"],
                          maxSize: 5,
                        })(e);
                      }
                    }}
                  />
                </UploadButton>

                <Typography
                  variant="caption"
                  color={
                    errors.interiorOutlet || errors.interiorOutletCount
                      ? "error"
                      : "textSecondary"
                  }
                  sx={{ mt: -1 }}
                >
                  {errors.interiorOutlet ||
                    errors.interiorOutletCount ||
                    "Accepted formats: JPEG, PNG (up to total 5MB)"}
                </Typography>

                {safeData.interiorOutlet?.length > 0 && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        overflowX: "auto",
                        py: 1,
                        "&::-webkit-scrollbar": { height: "6px" },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "divider",
                          borderRadius: "3px",
                        },
                      }}
                    >
                      {safeData.interiorOutlet.map((file, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: "relative",
                            flexShrink: 0,
                            width: "100px",
                            height: "100px",
                          }}
                        >
                          {createObjectURL(file) && (
                            <FilePreviewImage
                              src={createObjectURL(file)}
                              alt={`Interior ${index + 1}`}
                              loading="lazy"
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 1,
                              }}
                            />
                          )}
                          <IconButton
                            onClick={() =>
                              handleRemoveFile("interiorOutlet", index)
                            }
                            color="error"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              backgroundColor: "rgba(255,255,255,0.8)",
                              "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.9)",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                    <Typography
                      variant="caption"
                      color={
                        safeData.interiorOutlet.length < 3 ? "error" : "success"
                      }
                      sx={{ display: "flex", alignItems: "center", mt: 1 }}
                    >
                      {safeData.interiorOutlet.length < 3 ? (
                        <>
                          <ErrorOutline fontSize="small" sx={{ mr: 0.5 }} />
                          {3 - safeData.interiorOutlet.length} more required
                        </>
                      ) : (
                        <>
                          <CheckCircle fontSize="small" sx={{ mr: 0.5 }} />
                          Minimum requirement met
                        </>
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Section 4: Awards & Recognitions */}
      <StyledPaper sx={{ p: 3 }}>
        <SectionTitle variant="h6">
          Award Description & Documents
          <Tooltip
            title={
              <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                <strong>Brand Images</strong> <br />
                Accepted formats: JPEG, PNG ( up to 1MB )
              </span>
            }
            placement="right-start"
            arrow
            enterTouchDelay={0} // makes it responsive on mobile too
          >
            <IconButton
              size="small"
              sx={{
                // p: 0.8,
                color: "warning.main",
                // backgroundColor: 'info.light',
                "&:hover": {
                  backgroundColor: "info.main",
                  color: "white",
                },
                marginLeft: "5px",
                // borderRadius: '50%',
              }}
            >
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>{" "}
        </SectionTitle>

        <Grid
          container
          spacing={2}
          sx={{ display: { md: "flex", xs: "grid" } }}
        >
          {/* Award Description Field */}
          <Grid item>
            <TextField
              label="Award Description"
              value={currentAward.text}
              onChange={handleAwardTextChange}
              sx={{ width: { xs: "100%", md: 900 } }}
              error={!currentAward.text && formSubmitted}
              helperText={
                !currentAward.text && formSubmitted
                  ? "Award description is required"
                  : ""
              }
            />
          </Grid>

          {/* Document Upload with Error Handling */}
          <Grid item>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <UploadButton
                component="label"
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "green",
                  color: "#5a8f29",
                  "&:hover": {
                    backgroundColor: "rgba(122, 208, 58, 0.08)",
                    borderColor: "#5db024",
                  },
                  ...(!currentAward.document && formSubmitted
                    ? {
                        borderColor: "error.main",
                        color: "error.main",
                      }
                    : {}),
                }}
                startIcon={<CloudUpload />}
              >
                Upload Document
                <VisuallyHiddenInput
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleAwardFileChange}
                />
              </UploadButton>

              {/* Document name and error message */}
              <Box sx={{ mt: 0.5, minHeight: 24 }}>
                {currentAward.document ? (
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    {currentAward.document.name}
                  </Typography>
                ) : (
                  formSubmitted && (
                    <Typography variant="caption" sx={{ color: "error.main" }}>
                      Please upload a document
                    </Typography>
                  )
                )}
              </Box>
            </Box>
          </Grid>

          {/* Add Button */}
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                py: 2,
                backgroundColor: "#7ad03a",
                "&:hover": { backgroundColor: "#5db024" },
                "&:disabled": { backgroundColor: "#e0e0e0" },
              }}
              onClick={() => {
                setFormSubmitted(true);
                handleAddAward();
              }}
              disabled={!currentAward.text || !currentAward.document}
            >
              Add Award
            </Button>
          </Grid>
        </Grid>

        {/* Display existing awards */}
        {awardText.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Document</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {awardText.map((text, index) => (
                    <TableRow key={index}>
                      <TableCell>{text}</TableCell>
                      <TableCell>
                        {data.awardDoc && data.awardDoc[index]
                          ? data.awardDoc[index].name
                          : "No document"}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleAwardRemove(index)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </StyledPaper>

      {/* Section 5: Business Plan */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Business Plan (Optional)
          <Tooltip
            title={
              <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                <span style={{ fontWeight: "bold" }}>Business Plan: </span>
                You can upload your business plan in PDF, DOC, or DOCX format.
              </span>
            }
            placement="right-start"
            arrow
            enterTouchDelay={0}
          >
            <IconButton
              size="small"
              sx={{
                color: "warning.main",
                "&:hover": {
                  backgroundColor: "info.main",
                  color: "white",
                },
                marginLeft: "5px",
              }}
            >
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>{" "}
        </SectionTitle>

        <Grid sx={{ ml: { md: 5, xs: 0 }, mr: { md: 5, xs: 0 } }}>
          <UploadButton
            fullWidth
            component="label"
            variant="outlined"
            size="small"
            color="success"
            startIcon={<Description />}
          >
            Upload (PDF JPEG, PNG)
            <VisuallyHiddenInput
              type="file"
              accept=".pdf,.doc,.docx,"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // ✅ Auto-clear the error when a new file is chosen
                  if (errors?.businessPlan) errors.businessPlan = "";

                  // ✅ Proceed with your validation and upload logic
                  handleFileChange("businessPlan", {
                    maxFiles: 1,
                    allowedTypes: [
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ],
                    maxSize: 1,
                  })(e);
                }
              }}
            />
          </UploadButton>
          <Typography
            variant="caption"
            color={errors.businessPlan ? "error" : "textSecondary"}
          >
            {errors.businessPlan ||
              "Accepted formats: PDF, DOC, DOCX (up to 10MB)"}
          </Typography>

          {safeData.businessPlan?.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
              <Description color="primary" />
              <Typography variant="body2">
                {safeData.businessPlan[0].name}
              </Typography>
              <IconButton
                onClick={() => handleRemoveFile("businessPlan", 0)}
                size="small"
                color="error"
                sx={{ ml: "auto" }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Grid>
      </StyledPaper>
    </Box>
  );
};

export default Uploads;
