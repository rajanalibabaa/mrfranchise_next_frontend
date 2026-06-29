"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  MenuItem,
  Stack,
  InputAdornment,
  IconButton,
  Divider,
  Avatar,
  Badge,
  Paper,
  Fade,
  Tooltip,
  LinearProgress,
  useTheme,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SortIcon from "@mui/icons-material/Sort";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DateRangeIcon from "@mui/icons-material/DateRange";
import Footer from "@/Components/Footers/Footer";
import Navbar from "@/Components/Navbar/NavBar";

const API = "http://localhost:5000/api/v1/instantapply/all?page=1&limit=100";

export default function InstantApplyPage() {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    industry: "",
    category: "",
    investment: "",
    state: "",
    district: "",
    sort: "",
    date: "",
    dateFrom: "",
    dateTo: "",
  });

  const theme = useTheme();

  const fetchLeads = () => {
    setLoading(true);
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        setLeads(data.data || data);
        setFiltered(data.data || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    let data = [...leads];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (x) =>
          x.investorName?.toLowerCase().includes(q) ||
          x.investorEmail?.toLowerCase().includes(q) ||
          x.investorPhone?.includes(q) ||
          x.industry?.toLowerCase().includes(q) ||
          x.state?.toLowerCase().includes(q) ||
          x.district?.toLowerCase().includes(q) ||
          x.category?.toLowerCase().includes(q),
      );
    }

    if (filters.industry)
      data = data.filter((x) => x.industry === filters.industry);
    if (filters.category)
      data = data.filter((x) => x.category === filters.category);
    if (filters.investment)
      data = data.filter((x) => x.investmentRange === filters.investment);
    if (filters.state) data = data.filter((x) => x.state === filters.state);
    if (filters.district)
      data = data.filter((x) => x.district === filters.district);

    // Preset date filter
    if (filters.date) {
      const now = new Date();
      let days =
        filters.date === "3"
          ? 3
          : filters.date === "7"
            ? 7
            : filters.date === "30"
              ? 30
              : 90;
      data = data.filter((item) => {
        const created = new Date(item.createdAt);
        const diff = (now - created) / (1000 * 60 * 60 * 24);
        return diff <= days;
      });
    }

    // Custom date range
    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      data = data.filter((item) => new Date(item.createdAt) >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      data = data.filter((item) => new Date(item.createdAt) <= to);
    }

    // Sorting
    if (filters.sort === "asc") {
      data.sort((a, b) =>
        (a.investorName || "").localeCompare(b.investorName || ""),
      );
    } else if (filters.sort === "desc") {
      data.sort((a, b) =>
        (b.investorName || "").localeCompare(a.investorName || ""),
      );
    } else if (filters.sort === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sort === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFiltered(data);
  }, [filters, leads, searchQuery]);

  const activeFilterCount = useMemo(() => {
    return (
      Object.values(filters).filter((v) => v !== "").length +
      (searchQuery.trim() ? 1 : 0)
    );
  }, [filters, searchQuery]);

  const clearAllFilters = () => {
    setFilters({
      industry: "",
      category: "",
      investment: "",
      state: "",
      district: "",
      sort: "",
      date: "",
      dateFrom: "",
      dateTo: "",
    });
    setSearchQuery("");
  };

  const maskPhone = (phone) =>
    phone ? phone.slice(0, 2) + "••••••" + phone.slice(-2) : "N/A";
  const maskName = (name) =>
    name ? name.slice(0, 2) + "••••••" + name.slice(-2) : "N/A";
  const maskEmail = (email) => {
    if (!email) return "N/A";
    const [name, domain] = email.split("@");
    return name.slice(0, 2) + "•••••@" + domain;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    if (!name) return "#6366f1";
    const colors = [
      "#6366f1",
      "#8b5cf6",
      "#06b6d4",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#ec4899",
      "#3b82f6",
      "#14b8a6",
      "#f97316",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++)
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const stats = useMemo(() => {
    const industries = new Set(leads.map((l) => l.industry).filter(Boolean));
    const states = new Set(leads.map((l) => l.state).filter(Boolean));
    const today = new Date();
    const todayCount = leads.filter((l) => {
      const d = new Date(l.createdAt);
      return d.toDateString() === today.toDateString();
    }).length;
    return {
      total: leads.length,
      filtered: filtered.length,
      industries: industries.size,
      states: states.size,
      today: todayCount,
    };
  }, [leads, filtered]);

  const detailFields = [
    { key: "investorName", label: "Investor Name", icon: <PersonIcon /> },
    { key: "investorPhone", label: "Phone", icon: <PhoneIcon /> },
    { key: "investorEmail", label: "Email", icon: <EmailIcon /> },
    { key: "industry", label: "Industry", icon: <BusinessIcon /> },
    { key: "category", label: "Category", icon: <CategoryIcon /> },
    {
      key: "investmentRange",
      label: "Investment Range",
      icon: <AttachMoneyIcon />,
    },
    { key: "state", label: "State", icon: <LocationOnIcon /> },
    { key: "district", label: "District", icon: <LocationOnIcon /> },
    { key: "createdAt", label: "Applied On", icon: <CalendarTodayIcon /> },
  ];

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          // background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #f0f4f8 100%)",
          mt: 18,
        }}
      >
        {loading && (
          <LinearProgress
            sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}
          />
        )}

        {/* HEADER */}

        {/* CONTENT */}
        <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>
          {/* SEARCH & FILTER TOGGLE */}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={0}
            justifyContent={"space-evenly"}
            alignItems="center"
          >
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                letterSpacing: "-0.5px",
                background: "linear-gradient(90deg, #ff9800, #e5c511)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Investor Enquiry Leads
            </Typography>{" "}
            <TextField
              placeholder="Search by name, email, phone, industry, state,Cat,Dist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery("")}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  background: "#f8fafc",
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "&:hover fieldset": { borderColor: "#6366f1 !important" },
                  minWidth: "500px",
                },
              }}
            />
            <Badge badgeContent={activeFilterCount} color="primary">
              <Button
                variant={showFilters ? "contained" : "outlined"}
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  minWidth: 130,
                  ...(showFilters
                    ? {
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        },
                      }
                    : {
                        borderColor: "#6366f1",
                        color: "#6366f1",
                      }),
                }}
              >
                Filters
              </Button>
            </Badge>
            {activeFilterCount > 0 && (
              <Button
                variant="text"
                startIcon={<ClearAllIcon />}
                onClick={clearAllFilters}
                sx={{
                  textTransform: "none",
                  color: "#ef4444",
                  fontWeight: 600,
                  minWidth: 120,
                }}
              >
                Clear All
              </Button>
            )}
          </Stack>

          {/* FILTERS PANEL */}
          {showFilters && (
            <Fade in={showFilters}>
              <Paper
                elevation={0}
                sx={{
                  mb: 3,
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  color="#475569"
                  mb={2}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FilterListIcon fontSize="small" /> Advanced Filters
                </Typography>
                <Grid container spacing={2}>
                  {[
                    {
                      key: "industry",
                      label: "Industry",
                      icon: <BusinessIcon fontSize="small" />,
                    },
                    {
                      key: "category",
                      label: "Category",
                      icon: <CategoryIcon fontSize="small" />,
                    },
                    {
                      key: "investment",
                      label: "Investment",
                      icon: <AttachMoneyIcon fontSize="small" />,
                    },
                    {
                      key: "state",
                      label: "State",
                      icon: <LocationOnIcon fontSize="small" />,
                    },
                    {
                      key: "district",
                      label: "District",
                      icon: <LocationOnIcon fontSize="small" />,
                    },
                  ].map(({ key, label, icon }) => (
                    <Grid key={key}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label={label}
                        value={filters[key]}
                        onChange={(e) =>
                          setFilters({ ...filters, [key]: e.target.value })
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {icon}
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        }}
                        sx={{
                          maxWidth: "100px",
                        }}
                      >
                        <MenuItem value="">All</MenuItem>
                        {[
                          ...new Set(
                            leads.map(
                              (x) =>
                                x[
                                  key === "investment" ? "investmentRange" : key
                                ],
                            ),
                          ),
                        ]
                          .filter(Boolean)
                          .sort()
                          .map((v) => (
                            <MenuItem key={v} value={v}>
                              {v}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                  ))}

                  {/* Date Preset */}
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Quick Date"
                      value={filters.date}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          date: e.target.value,
                          dateFrom: "",
                          dateTo: "",
                        })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarTodayIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 },
                      }}
                    >
                      <MenuItem value="">All Time</MenuItem>
                      <MenuItem value="3">Last 3 Days</MenuItem>
                      <MenuItem value="7">Last 7 Days</MenuItem>
                      <MenuItem value="30">Last 30 Days</MenuItem>
                      <MenuItem value="90">Last 90 Days</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Custom Date Range */}
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="From Date"
                      value={filters.dateFrom}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          dateFrom: e.target.value,
                          date: "",
                        })
                      }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DateRangeIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label="To Date"
                      value={filters.dateTo}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          dateTo: e.target.value,
                          date: "",
                        })
                      }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DateRangeIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 ,minWidth:'150px'},
                      }}
                    />
                  </Grid>

                  {/* Sort */}
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Sort By"
                      value={filters.sort}
                      onChange={(e) =>
                        setFilters({ ...filters, sort: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SortIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2,minWidth:'150px' },
                      }}
                    >
                      <MenuItem value="">Default</MenuItem>
                      <MenuItem value="asc">
                        <Stack direction="row" alignItems="center" gap={1}>
                          <ArrowUpwardIcon fontSize="small" /> Name A–Z
                        </Stack>
                      </MenuItem>
                      <MenuItem value="desc">
                        <Stack direction="row" alignItems="center" gap={1}>
                          <ArrowDownwardIcon fontSize="small" /> Name Z–A
                        </Stack>
                      </MenuItem>
                      <MenuItem value="newest">Newest First</MenuItem>
                      <MenuItem value="oldest">Oldest First</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                {/* Active Filter Chips */}
                {activeFilterCount > 0 && (
                  <Stack
                    direction="row"
                    spacing={1}
                    mt={2}
                    flexWrap="wrap"
                    useFlexGap
                  >
                    {searchQuery && (
                      <Chip
                        label={`Search: "${searchQuery}"`}
                        onDelete={() => setSearchQuery("")}
                        size="small"
                        sx={{
                          background: alpha("#6366f1", 0.1),
                          color: "#6366f1",
                          fontWeight: 600,
                        }}
                      />
                    )}
                    {Object.entries(filters)
                      .filter(([, v]) => v)
                      .map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${key}: ${value}`}
                          onDelete={() => setFilters({ ...filters, [key]: "" })}
                          size="small"
                          sx={{
                            background: alpha("#6366f1", 0.1),
                            color: "#6366f1",
                            fontWeight: 600,
                          }}
                        />
                      ))}
                  </Stack>
                )}
              </Paper>
            </Fade>
          )}

          {/* RESULTS COUNT */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" fontWeight={600} color="#64748b">
              Showing {filtered.length} of {leads.length} leads
            </Typography>
          </Box>

          {/* CARDS */}
          <Grid container spacing={3}>
            {filtered.length === 0 && !loading && (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 6,
                    textAlign: "center",
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <SearchIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
                  <Typography variant="h6" color="#64748b" fontWeight={600}>
                    No leads found
                  </Typography>
                  <Typography variant="body2" color="#94a3b8" mt={1}>
                    Try adjusting your filters or search query
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={clearAllFilters}
                    sx={{
                      mt: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Clear Filters
                  </Button>
                </Paper>
              </Grid>
            )}

            {filtered.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={item._id || index}>
                <Fade in timeout={300 + index * 50}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      height: "100%",
                      maxHeight: "300px",
                      maxWidth: "300px",
                      border: "1px solid transparent",
                      background:
                        "linear-gradient(white, white) padding-box, linear-gradient(135deg, #f1f5f9, #e2e8f0) border-box",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                      transition: "all 0.3s ease-in-out",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                        background:
                          "linear-gradient(white, white) padding-box, linear-gradient(135deg, #ff9800, #10d406) border-box",
                      },
                    }}
                    onClick={() => {
                      setSelected(item);
                      setOpen(true);
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 3,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* Header: Avatar, Name, Date */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            background: `linear-gradient(135deg, ${getAvatarColor(item.investorName)}, ${alpha(getAvatarColor(item.investorName), 0.7)})`,
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(item.investorName)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Tooltip title={item.investorName}>
                            <Typography
                              fontWeight={700}
                              fontSize={17}
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: "#1e293b",
                              }}
                            >
                              {maskName(item.investorName)}
                            </Typography>
                          </Tooltip>
                          <Typography
                            variant="caption"
                            color="#64748b"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <CalendarTodayIcon sx={{ fontSize: 12 }} />
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-CA",
                            )}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Masked Info */}
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <PhoneIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                          <Typography
                            variant="body2"
                            color="#475569"
                            fontFamily="monospace"
                            fontSize={13}
                          >
                            Phone : {maskPhone(item.investorPhone)}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <EmailIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                          <Typography
                            variant="body2"
                            color="#475569"
                            fontFamily="monospace"
                            fontSize={13}
                            noWrap
                          >
                            Email : {maskEmail(item.investorEmail)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<VisibilityIcon />}
                        sx={{
                          mt: 1.5,
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          color: "#fff",
                          background:
                            "linear-gradient(135deg, #ff9800, #ff9800)",
                          boxShadow: "none",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #ff990080, #ff9900ae)",
                            // boxShadow: `0 6px 12px ${alpha("#6366f1", 0.3)}`,
                            transform: "translateY(-2px)",
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(item);
                          setOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* DETAIL DIALOG */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
            },
          }}
        >
          {selected && (
            <>
              {/* Dialog Header */}
              <Box
                sx={{
                  background: "linear-gradient(135deg, #0f172a, #1e293b)",
                  color: "#fff",
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background: `linear-gradient(135deg, ${getAvatarColor(selected.investorName)}, ${alpha(getAvatarColor(selected.investorName), 0.6)})`,
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  {getInitials(selected.investorName)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {selected.investorName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Applied on{" "}
                    {new Date(selected.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setOpen(false)}
                  sx={{ color: "#94a3b8" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <DialogContent sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                  {detailFields.map(({ key, label, icon }) => {
                    const value = selected[key];
                    if (!value) return null;
                    return (
                      <Box
                        key={key}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          py: 1.5,
                          px: 2,
                          borderRadius: 2,
                          mb: 1,
                          "&:hover": { background: "#f8fafc" },
                          transition: "background 0.2s",
                        }}
                      >
                        <Box
                          sx={{
                            color: "#6366f1",
                            mr: 2,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="caption"
                            color="#94a3b8"
                            fontWeight={600}
                            textTransform="uppercase"
                            letterSpacing={0.5}
                          >
                            {label}
                          </Typography>
                          <Typography
                            fontWeight={600}
                            color="#1e293b"
                            fontSize={15}
                          >
                            {key === "createdAt"
                              ? new Date(value).toLocaleString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : String(value)}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}

                  {/* Extra fields not in detailFields */}
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="#64748b"
                    mb={1.5}
                  >
                    All Data
                  </Typography>
                  {Object.entries(selected)
                    .filter(
                      ([key]) =>
                        ![
                          "_id",
                          "__v",
                          "investorId",
                          "brandId",
                          "city",
                          "brandName",
                          "status",
                          "uuid",
                          "brandsSent",
                          "updatedAt",
                        ].includes(key) &&
                        !detailFields.find((f) => f.key === key),
                    )
                    .map(([key, value]) => (
                      <Box
                        key={key}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 1,
                          px: 2,
                          borderRadius: 2,
                          mb: 0.5,
                          "&:hover": { background: "#f8fafc" },
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="#64748b"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {key.replace(/([A-Z])/g, " $1")}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="#1e293b"
                          fontWeight={500}
                          sx={{
                            textAlign: "right",
                            maxWidth: "60%",
                            wordBreak: "break-word",
                          }}
                        >
                          {String(value)}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </DialogContent>

              <DialogActions sx={{ p: 2, borderTop: "1px solid #e2e8f0" }}>
                <Button
                  onClick={() => setOpen(false)}
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    background: "red",
                    borderColor: "#e2e8f0",
                    color: "#ffffff",
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
      <Footer />
    </>
  );
}
