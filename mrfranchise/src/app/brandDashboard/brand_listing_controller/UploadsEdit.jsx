"use client";
import React, { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { useTheme,styled } from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import CloudUpload from "@mui/icons-material/CloudUpload";
import VideoCameraBack from "@mui/icons-material/VideoCameraBack";
import Description from "@mui/icons-material/Description";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";

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

const UploadsEdit = ({
  data = {},
  files = {},
  errors = {},
  onChange,
  onArrayChange,
  onFileChange,
  onRemoveFile,
  onAwardDelete,
  isEditing = false,
}) => {
  const theme = useTheme();
  const [editAwardIndex, setEditAwardIndex] = useState(null);
  const [currentAward, setCurrentAward] = useState({
    awardDescription: "",
    awardImage: null,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [imageErrors, setImageErrors] = useState({
    exteriorOutlet: "",
    interiorOutlet: "",
  });

  // Convert string URLs to file-like objects for consistent handling
  const normalizeFileData = (field) => {
    if (!data[field]) return [];

    if (!Array.isArray(data[field])) {
      const item = data[field];
      if (typeof item === "string") {
        return [
          {
            url: item,
            name: item.split("/").pop(),
            type:
              item.split(".").pop().toLowerCase() === "pdf"
                ? "application/pdf"
                : item.split(".").pop().toLowerCase() === "mp4"
                ? "video/mp4"
                : "image/jpeg",
          },
        ];
      }
      return [item];
    }

    return data[field].map((item) => {
      if (typeof item === "string") {
        return {
          url: item,
          name: item.split("/").pop(),
          type:
            item.split(".").pop().toLowerCase() === "pdf"
              ? "application/pdf"
              : item.split(".").pop().toLowerCase() === "mp4"
              ? "video/mp4"
              : "image/jpeg",
        };
      }
      return item;
    });
  };

  const [normalizedData, setNormalizedData] = useState({
    brandLogo: normalizeFileData("brandLogo"),
    franchisePromotionVideo: normalizeFileData("franchisePromotionVideo"),
    pancard: normalizeFileData("pancard"),
    gstCertificate: normalizeFileData("gstCertificate"),
    exteriorOutlet: normalizeFileData("exteriorOutlet"),
    interiorOutlet: normalizeFileData("interiorOutlet"),
    businessPlan: normalizeFileData("businessPlan"),
    awards: data.awards
      ? Array.isArray(data.awards)
        ? data.awards.map((award, idx) => ({
            ...award,
            awardImage:
              typeof award.awardImage === "string"
                ? {
                    url: award.awardImage,
                    name: award.awardImage.split("/").pop(),
                    type: "application/pdf",
                  }
                : award.awardImage,
            originalIndex: idx,
          }))
        : []
      : [],
  });

  useEffect(() => {
    if (!isEditing) {
      setEditAwardIndex(null);
      setCurrentAward({ awardDescription: "", awardImage: null });
    }
  }, [isEditing]);

  useEffect(() => {
    setNormalizedData({
      brandLogo: normalizeFileData("brandLogo"),
      franchisePromotionVideo: normalizeFileData("franchisePromotionVideo"),
      pancard: normalizeFileData("pancard"),
      gstCertificate: normalizeFileData("gstCertificate"),
      exteriorOutlet: normalizeFileData("exteriorOutlet"),
      interiorOutlet: normalizeFileData("interiorOutlet"),
      businessPlan: normalizeFileData("businessPlan"),
      awards: data.awards
        ? data.awards.map((award, idx) => ({
            ...award,
            awardImage:
              typeof award.awardImage === "string"
                ? {
                    url: award.awardImage,
                    name: award.awardImage.split("/").pop(),
                    type: "application/pdf",
                  }
                : award.awardImage,
            originalIndex: idx,
          }))
        : [],
    });
  }, [data]);

  useEffect(() => {
    setImageErrors({
      exteriorOutlet:
        normalizedData.exteriorOutlet.length < 3
          ? "Minimum 3 images required for exterior images"
          : "",
      interiorOutlet:
        normalizedData.interiorOutlet.length < 3
          ? "Minimum 3 images required for interior images"
          : "",
    });
  }, [
    normalizedData.exteriorOutlet.length,
    normalizedData.interiorOutlet.length,
  ]);

  const handleFileUpload =
    (field, options = {}) =>
    (e) => {
      if (!isEditing) return;
      const { maxFiles = Infinity, allowedTypes = [], maxSize = 5 } = options;
      const newFiles = Array.from(e.target.files || []);

      const currentFiles = normalizedData[field] || [];
      const totalFiles = currentFiles.length + newFiles.length;

      if (totalFiles > maxFiles) {
        setImageErrors((prev) => ({
          ...prev,
          [field]: `Maximum ${maxFiles} file(s) allowed for this field`,
        }));
        return;
      }

      const validFiles = newFiles.filter((file) => {
        if (!file || !file.type) return false;
        if (allowedTypes.length === 0) return true;
        return allowedTypes.some((type) => file.type.includes(type));
      });

      const sizeValidFiles = validFiles.filter(
        (file) => file.size <= maxSize * 1024 * 1024
      );

      if (sizeValidFiles.length < validFiles.length) {
        alert(`Some files exceed the maximum size of ${maxSize}MB`);
      }

      const updatedFiles = [...currentFiles, ...sizeValidFiles];
      setNormalizedData((prev) => ({ ...prev, [field]: updatedFiles }));

      onFileChange(field, sizeValidFiles);
    };

  const handleRemoveUploadedFile = (field, index) => {
    if (!isEditing) return;

    const currentFiles = normalizedData[field] || [];
    const addedLength = files[field]?.length || 0;
    const currentLength = currentFiles.length;
    const firstNewIndex = currentLength - addedLength;

    const updatedFiles = [...currentFiles];
    const removedFile = updatedFiles.splice(index, 1)[0];

    let fileUrl = null;
    if (index < firstNewIndex) {
      fileUrl = typeof removedFile === "string" ? removedFile : removedFile.url;
      onRemoveFile(field, null, fileUrl);
    } else {
      const newIndex = index - firstNewIndex;
      onRemoveFile(field, newIndex);
    }

    setNormalizedData((prev) => ({ ...prev, [field]: updatedFiles }));
  };

  const createObjectURL = (file) => {
    if (!file) return "";
    try {
      if (file instanceof Blob || file instanceof File) {
        return URL.createObjectURL(file);
      }
      if (file.url) {
        return file.url;
      }
      return file;
    } catch (error) {
      console.error("Error creating object URL:", error);
      return "";
    }
  };

  const handleAwardTextChange = (e) => {
    setCurrentAward((prev) => ({
      ...prev,
      awardDescription: e.target.value,
    }));
  };

  const handleAwardFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentAward((prev) => ({
        ...prev,
        awardImage: file,
      }));
    }
  };

  const handleAddAward = () => {
    if (!currentAward.awardDescription || !currentAward.awardImage) {
      setFormSubmitted(true);
      return;
    }

    const updatedAwards = [...normalizedData.awards];

    if (editAwardIndex !== null) {
      updatedAwards[editAwardIndex] = {
        awardDescription: currentAward.awardDescription,
        awardImage: currentAward.awardImage,
      };
    } else {
      updatedAwards.push({
        awardDescription: currentAward.awardDescription,
        awardImage: currentAward.awardImage,
      });
    }

    setNormalizedData((prev) => ({ ...prev, awards: updatedAwards }));

    onArrayChange(
      "awards",
      updatedAwards.map((award) => ({
        awardDescription: award.awardDescription,
        awardImage: award.awardImage,
      }))
    );

    if (currentAward.awardImage instanceof File) {
      onFileChange("awardDoc", [currentAward.awardImage]);
    }

    setCurrentAward({ awardDescription: "", awardImage: null });
    setEditAwardIndex(null);
    setFormSubmitted(false);
  };

  const handleEditAward = (index) => {
    const award = normalizedData.awards[index];
    setCurrentAward({
      awardDescription: award.awardDescription,
      awardImage: award.awardImage,
    });
    setEditAwardIndex(index);
  };

  const handleDeleteAward = (index) => {
    const currentAwards = normalizedData.awards || [];
    const addedLength = files.awardDoc?.length || 0;
    const currentLength = currentAwards.length;
    const firstNewIndex = currentLength - addedLength;

    const updatedAwards = [...currentAwards];
    const removedAward = updatedAwards.splice(index, 1)[0];

    setNormalizedData((prev) => ({ ...prev, awards: updatedAwards }));

    onArrayChange(
      "awards",
      updatedAwards.map((award) => ({
        awardDescription: award.awardDescription,
        awardImage: award.awardImage,
      }))
    );

    if (index < firstNewIndex) {
      onAwardDelete(index);
    } else {
      const newIndex = index - firstNewIndex;
      onRemoveFile("awardDoc", newIndex);
    }
  };

  const handleCancelEdit = () => {
    setCurrentAward({ awardDescription: "", awardImage: null });
    setEditAwardIndex(null);
    setFormSubmitted(false);
  };

  const getFileDisplayName = (file) => {
    if (!file) return "";
    if (typeof file === "string") return file.split("/").pop();
    if (file.name) return file.name;
    if (file.url) return file.url.split("/").pop();
    return "File";
  };

  const isImageFile = (file) => {
    if (!file) return false;
    const type =
      typeof file === "string"
        ? file.split(".").pop().toLowerCase()
        : file.type
        ? file.type.split("/")[0]
        : file.url
        ? file.url.split(".").pop().toLowerCase()
        : "";
    return ["jpg", "jpeg", "png", "gif"].includes(type) || type === "image";
  };

  const isVideoFile = (file) => {
    if (!file) return false;
    const type =
      typeof file === "string"
        ? file.split(".").pop().toLowerCase()
        : file.type
        ? file.type.split("/")[0]
        : file.url
        ? file.url.split(".").pop().toLowerCase()
        : "";
    return ["mp4", "mov", "avi"].includes(type) || type === "video";
  };

  const isPdfFile = (file) => {
    if (!file) return false;
    const type =
      typeof file === "string"
        ? file.split(".").pop().toLowerCase()
        : file.type
        ? file.type.split("/")[1]
        : file.url
        ? file.url.split(".").pop().toLowerCase()
        : "";
    return type === "pdf" || (file.type && file.type.includes("pdf"));
  };

  return (
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
      {/* Brand Identity */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Brand Identity
          <Tooltip
            title="Drag and drop your logo here or click to upload"
            placement="right-start"
            arrow
            enterTouchDelay={0}
          >
            <IconButton
              size="small"
              sx={{
                color: "warning.main",
                "&:hover": { backgroundColor: "info.main", color: "white" },
                marginLeft: "5px",
              }}
            >
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>
        <Grid
          container
          spacing={3}
          sx={{ display: { md: "flex" } }}
          justifyContent={"space-evenly"}
        >
          <Grid item xs={12} md={6}>
            <Typography textAlign={"center"} mb={1} variant="body2">
              Brand Logo
            </Typography>
            <FormControl fullWidth>
              <Box sx={{ width: { md: "400px" } }}>
                <UploadButton
                  component="label"
                  color="success"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  disabled={!isEditing}
                >
                  Upload Logo
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileUpload("brandLogo", {
                      maxFiles: 1,
                      allowedTypes: ["image/jpeg", "image/png"],
                      maxSize: 2,
                    })}
                  />
                </UploadButton>
                <Typography
                  variant="caption"
                  color={errors.brandLogo ? "error" : "textSecondary"}
                >
                  {errors.brandLogo ||
                    "(Accepted formats: JPEG, PNG up to 2MB)"}
                </Typography>
                {normalizedData.brandLogo?.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    {isImageFile(normalizedData.brandLogo[0]) ? (
                      <>
                        <img
                          src={createObjectURL(normalizedData.brandLogo[0])}
                          alt="Brand Logo"
                          loading="lazy"
                          style={{
                            height: 60,
                            borderRadius: 4,
                            border: "1px solid #ccc",
                            padding: 4,
                          }}
                        />
                        {isEditing && (
                          <IconButton
                            onClick={() =>
                              handleRemoveUploadedFile("brandLogo", 0)
                            }
                            color="error"
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </>
                    ) : (
                      <>
                        <Chip
                          label={getFileDisplayName(
                            normalizedData.brandLogo[0]
                          )}
                          onDelete={
                            isEditing
                              ? () => handleRemoveUploadedFile("brandLogo", 0)
                              : undefined
                          }
                          deleteIcon={<CheckCircle fontSize="small" />}
                          variant="outlined"
                          color="success"
                        />
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} sx={{ mt: { md: 0, xs: 3 } }}>
            <Typography textAlign={"center"} mb={1} variant="body2">
              Franchise Promotion Video
            </Typography>
            <FormControl fullWidth>
              <Box sx={{ width: { md: "400px" } }}>
                <UploadButton
                  component="label"
                  variant="outlined"
                  color="success"
                  startIcon={<VideoCameraBack />}
                  disabled={!isEditing}
                >
                  Upload Video
                  <VisuallyHiddenInput
                    type="file"
                    accept="video/mp4,video/quicktime"
                    onChange={handleFileUpload("franchisePromotionVideo", {
                      maxFiles: 1,
                      allowedTypes: ["video/mp4", "video/quicktime"],
                      maxSize: 25,
                    })}
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
                {normalizedData.franchisePromotionVideo?.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    {isVideoFile(normalizedData.franchisePromotionVideo[0]) ? (
                      <>
                        <video
                          src={createObjectURL(
                            normalizedData.franchisePromotionVideo[0]
                          )}
                          controls
                          style={{ width: 200, borderRadius: 4 }}
                        />
                        {isEditing && (
                          <IconButton
                            onClick={() =>
                              handleRemoveUploadedFile(
                                "franchisePromotionVideo",
                                0
                              )
                            }
                            color="error"
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </>
                    ) : (
                      <>
                        <Chip
                          label={getFileDisplayName(
                            normalizedData.franchisePromotionVideo[0]
                          )}
                          onDelete={
                            isEditing
                              ? () =>
                                  handleRemoveUploadedFile(
                                    "franchisePromotionVideo",
                                    0
                                  )
                              : undefined
                          }
                          deleteIcon={<CheckCircle fontSize="small" />}
                          variant="outlined"
                          color="success"
                        />
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Company Credentials */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Company Credentials
          <Tooltip
            title="Upload your company credentials documents"
            placement="right-start"
            arrow
            enterTouchDelay={0}
          >
            <IconButton
              size="small"
              sx={{
                color: "warning.main",
                "&:hover": { backgroundColor: "info.main", color: "white" },
                marginLeft: "5px",
              }}
            >
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>
        <Grid
          container
          spacing={3}
          sx={{ display: { md: "flex" } }}
          justifyContent={"space-evenly"}
        >
          <Grid item xs={12} md={6} sx={{ mr: { md: 2 } }}>
            <TextField
              label="PAN Number"
              fullWidth
              value={data.pancardNumber || ""}
              onChange={(e) =>
                onChange("pancardNumber", e.target.value.toUpperCase())
              }
              error={!!errors.pancardNumber}
              helperText={errors.pancardNumber}
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 10,
                pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
                title: "PAN must be in format: AAAAA9999A",
              }}
              disabled={!isEditing}
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
              disabled={!isEditing}
            >
              Upload PAN Card
              <VisuallyHiddenInput
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={handleFileUpload("pancard", {
                  maxFiles: 1,
                  allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
                  maxSize: 1,
                })}
              />
            </UploadButton>
            <Typography
              variant="caption"
              color={errors.pancard ? "error" : "textSecondary"}
            >
              {errors.pancard || "Accepted formats: PDF, JPEG, PNG (up to 1MB)"}
            </Typography>
            {normalizedData.pancard?.length > 0 && (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                {isImageFile(normalizedData.pancard[0]) ? (
                  <>
                    <Box
                      component="img"
                      src={createObjectURL(normalizedData.pancard[0])}
                      alt="PAN Preview"
                      loading="lazy"
                      sx={{
                        width: 100,
                        borderRadius: 1,
                        border: "1px solid #ccc",
                      }}
                    />
                    {isEditing && (
                      <IconButton
                        onClick={() => handleRemoveUploadedFile("pancard", 0)}
                        color="error"
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </>
                ) : (
                  <>
                    <Chip
                      label={getFileDisplayName(normalizedData.pancard[0])}
                      onDelete={
                        isEditing
                          ? () => handleRemoveUploadedFile("pancard", 0)
                          : undefined
                      }
                      deleteIcon={<CheckCircle fontSize="small" />}
                      variant="outlined"
                      color="success"
                    />
                  </>
                )}
              </Box>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ mt: { xs: 3, md: 0 }, ml: { md: 2 } }}
          >
            <TextField
              label="GST Number"
              fullWidth
              value={data.gstNumber || ""}
              onChange={(e) =>
                onChange("gstNumber", e.target.value.toUpperCase())
              }
              error={!!errors.gstNumber}
              helperText={errors.gstNumber}
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 15,
                pattern:
                  "[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}",
                title: "GST must be in format: 22AAAAA0000A1Z5",
              }}
              disabled={!isEditing}
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
              disabled={!isEditing}
            >
              Upload GST Certificate
              <VisuallyHiddenInput
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={handleFileUpload("gstCertificate", {
                  maxFiles: 1,
                  allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
                  maxSize: 1,
                })}
              />
            </UploadButton>
            <Typography
              variant="caption"
              color={errors.gstCertificate ? "error" : "textSecondary"}
            >
              {errors.gstCertificate ||
                "Accepted formats: PDF, JPEG, PNG (up to 1MB)"}
            </Typography>
            {normalizedData.gstCertificate?.length > 0 && (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                {isImageFile(normalizedData.gstCertificate[0]) ? (
                  <>
                    <Box
                      component="img"
                      src={createObjectURL(normalizedData.gstCertificate[0])}
                      alt="GST Certificate"
                      loading="lazy"
                      sx={{
                        width: 100,
                        borderRadius: 1,
                        border: "1px solid #ccc",
                      }}
                    />
                    {isEditing && (
                      <IconButton
                        onClick={() =>
                          handleRemoveUploadedFile("gstCertificate", 0)
                        }
                        color="error"
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </>
                ) : (
                  <>
                    <Chip
                      label={getFileDisplayName(
                        normalizedData.gstCertificate[0]
                      )}
                      onDelete={
                        isEditing
                          ? () => handleRemoveUploadedFile("gstCertificate", 0)
                          : undefined
                      }
                      deleteIcon={<CheckCircle fontSize="small" />}
                      variant="outlined"
                      color="success"
                    />
                  </>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Brand Images */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Store / Branch / Images
          <Tooltip
            title={
              <span>
                <strong>Brand Images</strong> <br /> Accepted formats: JPEG, PNG
                (up to 1MB)
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
                "&:hover": { backgroundColor: "info.main", color: "white" },
                marginLeft: "5px",
              }}
            >
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>

        {/* Exterior Images */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Exterior Images (Minimum 3, Maximum 5)
            </Typography>
            {imageErrors.exteriorOutlet && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {imageErrors.exteriorOutlet}
              </Alert>
            )}
            <FormControl fullWidth>
              <UploadButton
                component="label"
                variant="outlined"
                color="success"
                fullWidth
                startIcon={<PhotoCamera />}
                disabled={
                  !isEditing || normalizedData.exteriorOutlet?.length >= 5
                }
              >
                Upload Exterior Images
                <VisuallyHiddenInput
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleFileUpload("exteriorOutlet", {
                    maxFiles: 5,
                    allowedTypes: ["image/jpeg", "image/png"],
                    maxSize: 5,
                  })}
                />
              </UploadButton>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mt: -1 }}
              >
                Accepted formats: JPEG, PNG (up to total 5MB)
              </Typography>
              {normalizedData.exteriorOutlet?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      overflowX: "auto",
                      py: 1,
                      "&::-webkit-scrollbar": { height: "6px" },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "divider",
                        borderRadius: "3px",
                      },
                    }}
                  >
                    {normalizedData.exteriorOutlet.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          flexShrink: 0,
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <FilePreviewImage
                          src={createObjectURL(file)}
                          alt={`Exterior ${index + 1}`}
                          loading="lazy"
                        />
                        {isEditing && (
                          <IconButton
                            onClick={() =>
                              handleRemoveUploadedFile("exteriorOutlet", index)
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
                        )}
                      </Box>
                    ))}
                  </Box>
                  <Typography
                    variant="caption"
                    color={
                      normalizedData.exteriorOutlet.length < 3
                        ? "error"
                        : "success"
                    }
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    {normalizedData.exteriorOutlet.length < 3 ? (
                      <>
                        <ErrorOutline fontSize="small" sx={{ mr: 0.5 }} />
                        {3 - normalizedData.exteriorOutlet.length} more required
                      </>
                    ) : (
                      <>
                        <CheckCircle fontSize="small" sx={{ mr: 0.5 }} />
                        Minimum requirement met (
                        {normalizedData.exteriorOutlet.length}/5)
                      </>
                    )}
                  </Typography>
                </Box>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {/* Interior Images */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Interior Images (Minimum 3, Maximum 5)
            </Typography>
            {imageErrors.interiorOutlet && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {imageErrors.interiorOutlet}
              </Alert>
            )}
            <FormControl fullWidth>
              <UploadButton
                component="label"
                variant="outlined"
                fullWidth
                color="success"
                startIcon={<PhotoCamera />}
                sx={{ height: "56px" }}
                disabled={
                  !isEditing || normalizedData.interiorOutlet?.length >= 5
                }
              >
                Upload Interior Images
                <VisuallyHiddenInput
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleFileUpload("interiorOutlet", {
                    maxFiles: 5,
                    allowedTypes: ["image/jpeg", "image/png"],
                    maxSize: 5,
                  })}
                />
              </UploadButton>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mt: -1 }}
              >
                Accepted formats: JPEG, PNG (up to total 5MB)
              </Typography>
              {normalizedData.interiorOutlet?.length > 0 && (
                <Box sx={{ mt: 2 }}>
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
                    {normalizedData.interiorOutlet.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          flexShrink: 0,
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <FilePreviewImage
                          src={createObjectURL(file)}
                          alt={`Interior ${index + 1}`}
                          loading="lazy"
                        />
                        {isEditing && (
                          <IconButton
                            onClick={() =>
                              handleRemoveUploadedFile("interiorOutlet", index)
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
                        )}
                      </Box>
                    ))}
                  </Box>
                  <Typography
                    variant="caption"
                    color={
                      normalizedData.interiorOutlet.length < 3
                        ? "error"
                        : "success"
                    }
                    sx={{ display: "flex", alignItems: "center", mt: 1 }}
                  >
                    {normalizedData.interiorOutlet.length < 3 ? (
                      <>
                        <ErrorOutline fontSize="small" sx={{ mr: 0.5 }} />
                        {3 - normalizedData.interiorOutlet.length} more required
                      </>
                    ) : (
                      <>
                        <CheckCircle fontSize="small" sx={{ mr: 0.5 }} />
                        Minimum requirement met (
                        {normalizedData.interiorOutlet.length}/5)
                      </>
                    )}
                  </Typography>
                </Box>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      {/* Awards & Recognitions */}
      <StyledPaper sx={{ p: 3 }}>
        <SectionTitle variant="h6">
          Award Description & Documents
          <Tooltip
            title="Add awards and recognition documents"
            placement="right-start"
            arrow
            enterTouchDelay={0}
          >
            <IconButton
              size="small"
              sx={{
                color: "warning.main",
                "&:hover": { backgroundColor: "info.main", color: "white" },
                marginLeft: "5px",
              }}
            >
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>
        {isEditing && (
          <Grid
            container
            spacing={2}
            sx={{ display: { md: "flex", xs: "grid" } }}
          >
            <Grid item>
              <TextField
                label="Award Description"
                value={currentAward.awardDescription}
                onChange={handleAwardTextChange}
                sx={{ width: { xs: "100%", md: 900 } }}
                error={!currentAward.awardDescription && formSubmitted}
                helperText={
                  !currentAward.awardDescription && formSubmitted
                    ? "Award description is required"
                    : ""
                }
              />
            </Grid>
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
                    ...(!currentAward.awardImage && formSubmitted
                      ? { borderColor: "error.main", color: "error.main" }
                      : {}),
                  }}
                  startIcon={<CloudUpload />}
                  disabled={editAwardIndex !== null}
                >
                  Upload Document
                  <VisuallyHiddenInput
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleAwardFileChange}
                  />
                </UploadButton>
                <Box sx={{ mt: 0.5, minHeight: 24 }}>
                  {currentAward.awardImage ? (
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      {getFileDisplayName(currentAward.awardImage)}
                    </Typography>
                  ) : (
                    formSubmitted && (
                      <Typography
                        variant="caption"
                        sx={{ color: "error.main" }}
                      >
                        Please upload a document
                      </Typography>
                    )
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                aria-label="add"
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
                disabled={
                  !currentAward.awardDescription || !currentAward.awardImage
                }
              >
                {editAwardIndex !== null ? "Update Award" : "Add Award"}
              </Button>
              {editAwardIndex !== null && (
                <Button
                  variant="outlined"
                  aria-label="cancel"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </Grid>
          </Grid>
        )}
        {normalizedData.awards?.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Document</TableCell>
                    {isEditing && <TableCell>Action</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {normalizedData.awards.map((award, index) => (
                    <TableRow key={index}>
                      <TableCell>{award.awardDescription}</TableCell>
                      <TableCell>
                        {award.awardImage ? (
                          isPdfFile(award.awardImage) ? (
                            <a
                              href={createObjectURL(award.awardImage)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Document
                            </a>
                          ) : (
                            getFileDisplayName(award.awardImage)
                          )
                        ) : (
                          "No document"
                        )}
                      </TableCell>
                      {isEditing && (
                        <TableCell>
                          <IconButton onClick={() => handleEditAward(index)}>
                            <Edit color="primary" />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteAward(index)}>
                            <Delete color="error" />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </StyledPaper>

      {/* Business Plan */}
      <StyledPaper>
        <SectionTitle variant="h6">
          Business Plan (Optional)
          <Tooltip
            title="You can upload your business plan in PDF, DOC, or DOCX format"
            placement="right-start"
            arrow
            enterTouchDelay={0}
          >
            <IconButton
              size="small"
              sx={{
                color: "warning.main",
                "&:hover": { backgroundColor: "info.main", color: "white" },
                marginLeft: "5px",
              }}
            >
              <InfoOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </SectionTitle>
        <Grid sx={{ ml: { md: 5, xs: 0 }, mr: { md: 5, xs: 0 } }}>
          <UploadButton
            fullWidth
            component="label"
            variant="outlined"
            size="small"
            color="success"
            startIcon={<Description />}
            disabled={!isEditing}
          >
            Upload (PDF, DOC, DOCX)
            <VisuallyHiddenInput
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload("businessPlan", {
                maxFiles: 1,
                allowedTypes: [
                  "application/pdf",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ],
                maxSize: 1,
              })}
            />
          </UploadButton>
          <Typography
            variant="caption"
            color={errors.businessPlan ? "error" : "textSecondary"}
          >
            {errors.businessPlan ||
              "Accepted formats: PDF, DOC, DOCX (up to 10MB)"}
          </Typography>
          {normalizedData.businessPlan?.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
              <Description color="primary" />
              <Typography variant="body2">
                {getFileDisplayName(normalizedData.businessPlan[0])}
              </Typography>
              <IconButton
                component="a"
                href={createObjectURL(normalizedData.businessPlan[0])}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                size="small"
                title="View Business Plan"
              >
                <Visibility fontSize="small" />
              </IconButton>
              {isEditing && (
                <IconButton
                  onClick={() => handleRemoveUploadedFile("businessPlan", 0)}
                  size="small"
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Box>
          )}
        </Grid>
      </StyledPaper>
    </Box>
  );
};

export default UploadsEdit;
