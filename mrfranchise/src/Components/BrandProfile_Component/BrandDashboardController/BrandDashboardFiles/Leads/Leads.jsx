"use client";
import { useEffect, useState } from "react";
import {useParams } from "next/navigation";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { GetApiCall } from "@/Api/DefaultApi";
import { api } from "@/Api/api";
import PackageCard from "@/ui/cards/PackageCard";
import LeadsTableOutlet from "@/ui/tables/LeadsTableOutlet";
import { getUserId } from "@/Utils/autherId";
import ErrorPopup from "@/ui/popup/ErrorPopup";
const userId = getUserId();
const Leads = () => {
  const { search } = useParams();
  const query = new URLSearchParams(search);
  const id = query.get("id") || userId;

  const [brandPackage, setBrandPackage] = useState(null);
  const [leads, setLeads] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const [isReset, setReset] = useState(false);

  const [error, setError] = useState("");

  const handleAxiosError = (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong. Try again.";

    setError(msg);
  };

  const fetchBrandAndLeads = async (id) => {
    try {
      const res = await GetApiCall(
        `${api.allBrandsApi.get.getBrandByID}/${id}`,
        { paymentHistory: true }
      );

      const responseData = res?.data;

      setBrandPackage(responseData?.data || null);
      setSelectedPackage(responseData?.data?.activePackage);

      if (responseData?.statuscode === 200) {
        const res2 = await GetApiCall(
          `${api.allBrandsApi.get.getleadsbybrandid}/${id}`,
          {
            packageStartDate:
              responseData?.data?.activePackage?.packageUpdatedTime,
          }
        );

        if (res2?.data?.statuscode === 200) {
          setLeads(res2?.data?.data.leads);
          setPagination(res2?.data?.data.pagination);
          setHasMore(true);
        }
      } else {
        setError("Server error");
      }
    } catch (error) {
      console.error("Error fetching brand:", error);
      handleAxiosError(error);
    }
  };

  useEffect(() => {
    fetchBrandAndLeads(id);
  }, [id]);

  if (!brandPackage)
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  const handlePackageClick = async (pkg, type, value) => {
    setSelectedPackage(pkg);

    const cheak1 = pkg?.packageUpdatedTime || pkg.packageStartTime;
    const cheak2 =
      selectedPackage?.packageUpdatedTime || selectedPackage.packageStartTime;

    if (cheak1 !== cheak2) {
      setSelectedFilter("");
      setSelectedDateFilter("");
    }

    let queryParams = {};

    if (pkg.packageType === "free") {
      queryParams = {
        status: pkg?.isActive,
        leadType: pkg?.packageType,
      };
    } else {
      queryParams = {
        packageStartDate: pkg?.packageUpdatedTime || pkg.packageStartTime,
        status: pkg?.isActive,
        leadType: "paid",
      };
    }

    if (type === "match") {
      setSelectedFilter("");
      setSelectedFilter(value);
      queryParams.filter = value;
      queryParams.dateFilter = selectedDateFilter;
    }

    if (type === "date") {
      setSelectedDateFilter("");
      setSelectedDateFilter(value);
      queryParams.dateFilter = value;
      queryParams.filter = selectedFilter;
    }

    try {
      const res2 = await GetApiCall(
        `${api.allBrandsApi.get.getleadsbybrandid}/${id}`,
        queryParams
      );

      if (res2?.data?.statuscode === 200) {
        setLeads(res2?.data?.data?.leads);
        setPagination(res2?.data?.data?.pagination);
        setHasMore(true);
      } else {
        setError("Could not load leads.");
      }
    } catch (error) {
      console.error("Package click error:", error);
      handleAxiosError(error);
    }
  };

  const loadMore = async () => {
    if (!pagination) return;

    const nextPage = pagination.currentPage + 1;
    if (nextPage >= pagination.totalPages) {
      setHasMore(false);
      return;
    }

    let queryParams = { page: nextPage, limit: pagination.pageSize };

    if (selectedPackage) {
      if (selectedPackage?.packageType === "free") {
        queryParams.status = selectedPackage?.isActive;
        queryParams.leadType = "free";
      } else {
        queryParams.packageStartDate =
          selectedPackage?.packageUpdatedTime ||
          selectedPackage?.packageStartTime;
        queryParams.status = selectedPackage?.isActive;
        queryParams.leadType = "paid";
      }
    }

    if (selectedFilter) {
      queryParams.filter = selectedFilter;
    }

    try {
      const res = await GetApiCall(
        `${api.allBrandsApi.get.getleadsbybrandid}/${id}`,
        queryParams
      );

      if (res?.data?.statuscode === 200) {
        setLeads((prev) => [...prev, ...res.data.data.leads]);
        setPagination(res.data.data.pagination);
      }
    } catch (e) {
      console.error("Load more error:", e);
      handleAxiosError(e);
    }
  };

  const handleReset = () => {
    setReset(true);
    setSelectedDateFilter("");
    setSelectedFilter("");

    setTimeout(() => {
      setReset(false);
      handlePackageClick(selectedPackage);
    }, 500);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="600" mb={2}>
        Packages
      </Typography>

   <Box
  display="grid"
  sx={{
    gridTemplateColumns: {
      xs: "repeat(1, 1fr)", // mobile
      sm: "repeat(2, 1fr)", // tablet
      md: "repeat(5, 1fr)", // desktop
    },
    gap: 2,
    overflowX: "auto",
    pb: 1,
    "&::-webkit-scrollbar": { height: 6 },
    "&::-webkit-scrollbar-thumb": { background: "#ccc", borderRadius: 2 },
  }}
>
        {brandPackage?.activePackage && (
          <Box
        sx={{
    cursor: "pointer",
    // border:
    //   selectedPackage?._id === brandPackage?.activePackage?._id
    //     ? "1px solid #08612c"
    //     : "1px solid transparent",
    borderRadius: 2,
    width: {
      xs: "100%",   // 📱 mobile smaller width
      sm: "100%",  // desktop full width
    },
  }}
            onClick={() => handlePackageClick(brandPackage.activePackage)}
          >
            <PackageCard
              data={brandPackage.activePackage}
              background="#08612cff"
              color="white"
            />
          </Box>
        )}

        {brandPackage?.oldPackageHistory?.length > 0 &&
          brandPackage?.oldPackageHistory.map((pkg, i) => (
            <Box
              key={pkg._id || i}
              sx={{
                cursor: "pointer",
                border:
                  selectedPackage?._id === pkg._id
                    ? "2px solid #ff9800"
                    : "2px solid transparent",
                borderRadius: 2,  
                            }}
              onClick={() => handlePackageClick(pkg)}
            >
              <PackageCard data={pkg} />
            </Box>
          ))}
      </Box>

      <Box mt={4}>
        <LeadsTableOutlet
          leads={leads}
          pagination={pagination}
          loadMore={loadMore}
          hasMore={hasMore}
          // leadsFilter={[
          //   { label: "Category Investmentrange", value: "catInv" },
          //   { label: "Category Location", value: "catLoc" },
          // ]}
          dateFilter={[
            { label: "Last 3 days", value: 3 },
            { label: "Last 7 days", value: 7 },
            { label: "Last 30 days", value: 30 },
          ]}
          selectedPackage={selectedPackage}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedDateFilter={selectedDateFilter}
          setSelectedDateFilter={setSelectedDateFilter}
          handlePackageClick={handlePackageClick}
          handleReset={handleReset}
          isReset={isReset}
        />
      </Box>

      {error && (
        <ErrorPopup
          message={error}
          open={Boolean(error)}
          onClose={() => setError("")}
        />
      )}
    </Box>
  );
};

export default Leads;
