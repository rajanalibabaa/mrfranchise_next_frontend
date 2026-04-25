"use client";

import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { GetApiCall } from "@/Api/DefaultApi";
import { api } from "@/Api/api";
import SuggestionList from "./SuggestionList";
import { fetchFilteredBrands, setFilter } from "@/Redux/Slices/FilterBrandSlice";

const Search = ({ handleClose }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const brandId = params?.brandId;
  const isIdExist = Boolean(brandId);
  
  const isBrandViewPage =
    pathname?.startsWith("/all-franchise-brands") 
    isIdExist;

  const [suggestions, setSuggestions] = useState({
    brands: [],
    companies: [],
    industries: [],
    tags: [],
    categories: [],
  });

  // 🔹 Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 🔹 API call
  useEffect(() => {
    if (!debouncedQuery) {
      setSuggestions({
        brands: [],
        companies: [],
        industries: [],
        tags: [],
        categories: [],
      });
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const url = `${api.user.get.search}?searchTerm=${encodeURIComponent(
          debouncedQuery
        )}`;
        const response = await GetApiCall(url);
        const data = response?.data?.data || {};

        setSuggestions({
          brands: data?.brandNamesMatches || [],
          companies: data?.companyNamesMatches || [],
          industries: data?.industryMatches || [],
          tags: data?.tagsMatches || [],
          categories: data?.categoriesMatches || [],
        });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const hasResults = Object.values(suggestions).some((arr) => arr.length > 0);

  const handleOnSearch = (searchValue = null) => {
    let value;

    if(!query && !searchValue) return;
    if (typeof searchValue === "string") {
      value = searchValue;
      console.log('value',value);
      
    } else {
      value = query;
    }

    try {
      const queryParams = new URLSearchParams();

      if (!isBrandViewPage || isIdExist) {
        queryParams.append("searchTerm", value);

        // Next.js way to open in new tab
        if (typeof window !== "undefined") {
              localStorage.setItem("franchiseFilters", JSON.stringify({ searchTerm: value }));
            dispatch(
              setFilter(
                { searchTerm: value }
              )
            )
            // window.open(`/all-franchise-brands?${queryParams.toString()}`, "_blank", "noopener,noreferrer");
            window.open(`/all-franchise-brands`, "_blank", "noopener,noreferrer");

        }
        return;
      }

      dispatch(
        fetchFilteredBrands({
          searchTerm: value,
          page: 1,
          limit: 20,
        })

      );

      if (handleClose) {
        handleClose(false);
      }
    } catch (error) {
      console.error("Search dispatch error:", error);
    }
  };

  const handleSelectedSuggestionData = (selectedData) => {
    // 🔹 If brand name selected, navigate to brand detail page
    if (selectedData.brandName) {
     
      
      const brandSlug = selectedData?.brandName;
      if (typeof window !== "undefined") {
        window.open(`/franchise-brands/${brandSlug}`, "_blank", "noopener,noreferrer");
      }
      return;
    }

    // 🔹 Otherwise, treat as search filter
    const searchValue = selectedData.tag || selectedData.industry || selectedData.category;
    handleOnSearch(searchValue);
  };

  return (
    <Box sx={{ position: "relative", width: 400 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search brands, companies, industries..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleOnSearch();
          }
        }}
        // InputProps={{
        //   endAdornment: (
        //     <InputAdornment position="end">
        //       <IconButton onClick={() => handleOnSearch()} edge="end">
        //         <SearchIcon />
        //       </IconButton>
        //     </InputAdornment>
        //   ),
        // }}
      />

      {(loading || hasResults) && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            width: "100%",
            mt: 1,
            maxHeight: 350,
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {loading ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <CircularProgress size={20} />
            </Box>
          ) : (
            <SuggestionList
              suggestions={suggestions}
              handleSelectedSuggestionData={handleSelectedSuggestionData}
            />
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Search;