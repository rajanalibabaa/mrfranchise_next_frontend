"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import Business from "@mui/icons-material/Business";
import Favorite from "@mui/icons-material/Favorite";
import AssignmentTurnedIn from "@mui/icons-material/AssignmentTurnedIn";
import Bookmark from "@mui/icons-material/Bookmark";
import Close from "@mui/icons-material/Close";

import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { api } from "@/Api/api";
import { fetchShortListedById } from "@/Redux/Slices/shortlistslice";
import { fetchLikedBrandsById } from "@/Redux/Slices/likeSlice";
import { fetchViewBrandsById, removeviewBrand } from "@/Redux/Slices/viewSlice";
import { handleShortList } from "@/Api/shortListApi";
import { likeApiFunction } from "@/Api/likeApi";
import StatCard from "./DashBoardFunctions/StatCard";
import ViewedBrands from "./DashBoardFunctions/ViewedBrands";
import LikedTab from "./DashBoardFunctions/LikedTab";
import AppliedTab from "./DashBoardFunctions/AppliedTab";
import ShortlistedTab from "./DashBoardFunctions/ShortlistedTab";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [appliedBrands, setAppliedBrands] = useState([]);
  const [likedStates, setLikedStates] = useState({});
  const [shortlistedStates, setShortlistedStates] = useState({});
  const [removeMsg, setRemoveMsg] = useState("");
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isPaginating, setIsPaginating] = useState(false);

  // ✅ NEW: Track initial data loading separately from tab switching
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const investorUUID = useSelector((state) => state.auth?.investorUUID);
  const AccessToken = useSelector((state) => state.auth?.AccessToken);
  const shortListState = useSelector((state) => state.shortList);
  const likedBrandsState = useSelector((state) => state.likedBrands);
  const viewBrandsState = useSelector((state) => state.viewBrands);

  const { brands: viewedBrands, pagination: viewPagination } = viewBrandsState;
  const shortlistedBrands = Array.isArray(shortListState.brands)
    ? shortListState.brands
    : [];
  const likedBrands = Array.isArray(likedBrandsState.brands)
    ? likedBrandsState.brands
    : [];

  // ✅ FIX: Separate loading states per tab instead of one global isLoading
  const getTabLoading = useCallback(
    (tab) => {
      if (isPaginating) return true;
      switch (tab) {
        case 0:
          return viewBrandsState.isLoading;
        case 1:
          return likedBrandsState.isLoading;
        case 2:
          return false; // Applied brands loaded locally
        case 3:
          return shortListState.isLoading;
        default:
          return false;
      }
    },
    [
      isPaginating,
      viewBrandsState.isLoading,
      likedBrandsState.isLoading,
      shortListState.isLoading,
    ]
  );

  const errorMessage =
    likedBrandsState.error || shortListState.error || viewBrandsState.error;

  const stats = useMemo(
    () => ({
      totalViews: viewPagination?.totalItems || 0,
      totalLikes: likedBrandsState.pagination?.total || 0,
      totalApplications: appliedBrands.length || 0,
      totalShortlisted: shortListState.pagination?.total || 0,
    }),
    [viewPagination, likedBrandsState, appliedBrands, shortListState]
  );

  const loadAppliedBrands = useCallback(async () => {
    if (!investorUUID) return;

    // console.log("Fetching applied brands for investorUUID:", investorUUID);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/instantapply`,
        { applyId: investorUUID },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data?.data || [];
      // console.log("===appliedResdata===", data); 
      setAppliedBrands(data);
    } catch (err) {
      console.error("Error fetching applied brands:", err);
      setAppliedBrands([]);
    }
  }, [investorUUID]);

  const fetchData = useCallback(async () => {
    if (!investorUUID || !AccessToken) return;

    try {
      // ✅ Use isInitialLoading for first load, not isPaginating
      setIsInitialLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AccessToken}`,
        },
      };

      const userRes = await axios.get(
        `${api.user.get.investor}/${investorUUID}`,
        config
      );

      // console.log("📌 User Response:", userRes.data);
      setUserData(userRes.data?.data || null);

      await Promise.all([
        dispatch(
          fetchLikedBrandsById({
            userId: investorUUID,
            page: 1,
            limit: itemsPerPage,
          })
        ),
        dispatch(
          fetchShortListedById({
            investorUUID,
            page: 1,
            limit: itemsPerPage,
          })
        ),
        dispatch(
          fetchViewBrandsById({
            userId: investorUUID,
            page: 1,
            limit: 10,
          })
        ),
      ]);
    } catch (error) {
      console.error("❌ Error in fetchData:", error);
    } finally {
      // ✅ Mark initial load complete
      setIsInitialLoading(false);
    }
  }, [investorUUID, AccessToken, dispatch, itemsPerPage]);

  useEffect(() => {
    fetchData();
    loadAppliedBrands();
  }, [fetchData, loadAppliedBrands]);

  useEffect(() => {
    const initialLiked = {};
    likedBrands.forEach((item) => {
      const brandId = item.uuid || item.brandID?.uuid || item.brandID;
      if (brandId) initialLiked[brandId] = true;
    });
    setLikedStates(initialLiked);

    const initialShortlisted = {};
    shortlistedBrands.forEach((item) => {
      const brandId = item.uuid || item.brandID?.uuid || item.brandID;
      if (brandId) initialShortlisted[brandId] = true;
    });
    setShortlistedStates(initialShortlisted);
  }, [likedBrands, shortlistedBrands]);

  // ✅ Reset page on tab change
  useEffect(() => {
    setCurrentPage(1);
    console.log("Tab changed to:", tabValue);
  }, [tabValue]);

  const toggleLike = useCallback(
    async (brandId) => {
      if (!brandId) return;

      const brandToRemove = likedBrands.find(
        (brand) =>
          brand.uuid === brandId ||
          brand.brandID?.uuid === brandId ||
          brand.brandID === brandId
      );

      if (!brandToRemove) return;

      const apiBrandId =
        brandToRemove.uuid ||
        brandToRemove.brandID?.uuid ||
        brandToRemove.brandID;

      setLikedStates((prev) => {
        const newState = { ...prev };
        delete newState[brandId];
        return newState;
      });

      try {
        await likeApiFunction(apiBrandId);
        setRemoveMsg("Brand removed successfully");
        setTimeout(() => setRemoveMsg(""), 3000);
        dispatch(
          fetchLikedBrandsById({
            userId: investorUUID,
            page: currentPage,
            limit: itemsPerPage,
          })
        );
      } catch (error) {
        console.error("Remove like error:", error);
        setRemoveMsg(error.message || "Failed to remove brand");
        setLikedStates((prev) => ({ ...prev, [brandId]: true }));
      }
    },
    [investorUUID, dispatch, likedBrands, currentPage, itemsPerPage]
  );

  const toggleShortlist = useCallback(
    async (brandId) => {
      if (!brandId) return;

      try {
        setIsPaginating(true);
        setShortlistedStates((prev) => ({
          ...prev,
          [brandId]: !prev[brandId],
        }));

        await handleShortList(brandId);

        const response = await dispatch(
          fetchShortListedById({
            investorUUID,
            page: currentPage,
            limit: itemsPerPage,
          })
        );

        if (response?.payload?.brands) {
          const updatedStates = {};
          response.payload.brands.forEach((brand) => {
            const id = brand.uuid || brand.brandID?.uuid || brand.brandID;
            if (id) updatedStates[id] = true;
          });
          setShortlistedStates(updatedStates);
        }

        setRemoveMsg(
          shortlistedStates[brandId]
            ? "Brand removed from shortlist"
            : "Brand added to shortlist"
        );
        setTimeout(() => setRemoveMsg(""), 3000);
      } catch (error) {
        setShortlistedStates((prev) => ({
          ...prev,
          [brandId]: !prev[brandId],
        }));
        console.error("Shortlist toggle error:", error);
        setRemoveMsg(error.message || "Failed to update shortlist");
      } finally {
        setIsPaginating(false);
      }
    },
    [investorUUID, dispatch, shortlistedStates, currentPage, itemsPerPage]
  );

  const toggleViewClose = useCallback(
    async (brandId) => {
      if (!investorUUID || !AccessToken || !brandId) return;

      try {
        setIsPaginating(true);
        await dispatch(
          removeviewBrand({
            userId: investorUUID,
            brandId,
            token: AccessToken,
          })
        ).unwrap();

        setRemoveMsg("Brand removed from view history");
        setTimeout(() => setRemoveMsg(""), 3000);
        dispatch(
          fetchViewBrandsById({ userId: investorUUID, page: 1, limit: 10 })
        );
      } catch (error) {
        console.error("Error removing viewed brand:", error);
        setRemoveMsg(error.message || "Failed to remove brand from view history");
      } finally {
        setIsPaginating(false);
      }
    },
    [investorUUID, AccessToken, dispatch]
  );

  const handleViewDetails = useCallback(
    (brand) => {
      const brandId =
        brand?.uuid ||
        brand?.brandID?.uuid ||
        brand?.brandID ||
        brand?.originalItem?.brandDetails?.uuid;

      if (brandId) {
        navigate.push(`/brands/${brandId}`);
      } else {
        console.error("Brand ID not found:", brand);
      }
    },
    [navigate]
  );

  const handlePageChange = useCallback(
    async (value) => {
      try {
        setIsPaginating(true);
        setCurrentPage(value);

        if (tabValue === 0) {
          await dispatch(
            fetchViewBrandsById({
              userId: investorUUID,
              page: value,
              limit: 10,
            })
          );
        } else if (tabValue === 1) {
          await dispatch(
            fetchLikedBrandsById({
              userId: investorUUID,
              page: value,
              limit: itemsPerPage,
            })
          );
        } else if (tabValue === 3) {
          await dispatch(
            fetchShortListedById({
              investorUUID,
              page: value,
              limit: itemsPerPage,
            })
          );
        }
      } catch (error) {
        console.error("Page change error:", error);
      } finally {
        setIsPaginating(false);
      }
    },
    // ✅ Add tabValue to deps so it always uses latest tab
    [tabValue, investorUUID, dispatch, itemsPerPage]
  );

  // ✅ FIX: Changed from useMemo to a regular function
  // useMemo was causing stale renders and not re-rendering on tab click
  const renderTabContent = () => {
    // Only block render during INITIAL load, not tab switching
    if (isInitialLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (errorMessage) {
      return (
        <Box sx={{ py: 10, textAlign: "center" }}>
          <Typography color="error">{errorMessage}</Typography>
        </Box>
      );
    }

    console.log("Rendering tab:", tabValue); // ✅ Debug log

    switch (tabValue) {
      case 0:
        return (
          <ViewedBrands
            brands={viewedBrands}
            currentPage={viewPagination?.currentPage}
            totalPages={viewPagination?.totalPages}
            handlePageChange={handlePageChange}
            isLoading={getTabLoading(0)}
            errorMessage={viewBrandsState.error}
          />
        );
      case 1:
        return (
          <LikedTab
            items={likedBrands}
            currentPage={currentPage}
            totalPages={likedBrandsState.pagination?.totalPages || 1}
            handlePageChange={handlePageChange}
            likedStates={likedStates}
            shortlistedStates={shortlistedStates}
            onViewDetails={handleViewDetails}
            onToggleLike={toggleLike}
            onToggleShortlist={toggleShortlist}
            isPaginating={getTabLoading(1)}
          />
        );
      case 2:
        return (
          <AppliedTab
            items={appliedBrands}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={Math.max(
              1,
              Math.ceil((appliedBrands?.length || 0) / itemsPerPage)
            )}
            handlePageChange={handlePageChange}
            likedStates={likedStates}
            shortlistedStates={shortlistedStates}
            onViewDetails={handleViewDetails}
            onToggleLike={toggleLike}
            onToggleShortlist={toggleShortlist}
            isPaginating={getTabLoading(2)}
          />
        );
      case 3:
        return (
          <ShortlistedTab
            items={shortlistedBrands}
            currentPage={shortListState.pagination?.currentPage}
            totalPages={shortListState.pagination?.totalPages}
            handlePageChange={handlePageChange}
            likedStates={likedStates}
            shortlistedStates={shortlistedStates}
            onViewDetails={handleViewDetails}
            onToggleLike={toggleLike}
            onToggleShortlist={toggleShortlist}
            isPaginating={getTabLoading(3)}
            isLoading={shortListState.isLoading}
            errorMessage={shortListState.error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Profile Header */}
      <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 2, mt: {xs:0,md:15,sm:0} }}>
        {userData ? (
          <>
            <Avatar
              src={userData?.profileImage || "/mrfranchise_logo.avif"}
              loading="lazy"
              alt={userData?.firstName || "Investor"}
              sx={{
                width: 60,
                height: 60,
                mr: { md: 3 },
                border: "3px solid #689f38",
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={600}>
                {userData?.firstName || "Investor"} {userData?.lastName || ""}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Loading profile...
          </Typography>
        )}
      </Box>

      {/* Stat Cards */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: { xs: "center", md: "flex-start" },
          mt: 3,
          flexWrap: "nowrap",
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "3px",
          },
          position: "relative",
          py: 2,
        }}
      >
        <StatCard
          icon={<Business />}
          title="Viewed"
          value={stats.totalViews}
          color="76, 175, 80"
          isSelected={tabValue === 0}
          onClick={() => setTabValue(0)}
        />
        <StatCard
          icon={<Favorite />}
          title="Liked"
          value={stats.totalLikes}
          color="244, 67, 54"
          isSelected={tabValue === 1}
          onClick={() => setTabValue(1)}
        />
        <StatCard
          icon={<AssignmentTurnedIn />}
          title="Applied"
          value={stats.totalApplications}
          color="33, 150, 243"
          isSelected={tabValue === 2}
          onClick={() => {
            console.log("Applied Tab Clicked");
            setTabValue(2);
          }}
        />
        <StatCard
          icon={<Bookmark />}
          title="Shortlisted"
          value={stats.totalShortlisted}
          color="156, 39, 176"
          isSelected={tabValue === 3}
          onClick={() => setTabValue(3)}
        />

        <Divider
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderColor: "divider",
          }}
        />
      </Box>

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>
        {removeMsg && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: "#4caf50",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>{removeMsg}</Typography>
            <IconButton
              size="small"
              onClick={() => setRemoveMsg("")}
              aria-label="Close"
            >
              <Close sx={{ color: "white" }} />
            </IconButton>
          </Box>
        )}

        {/* ✅ FIX: Call as function, not as JSX variable */}
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;