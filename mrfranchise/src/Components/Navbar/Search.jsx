"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { usePathname, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { GetApiCall } from "@/Api/DefaultApi";
import { api } from "@/Api/api";
import SuggestionList from "./SuggestionList";
import {
  fetchFilteredBrands,
  setFilter,
} from "@/Redux/Slices/FilterBrandSlice";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const INITIAL_SUGGESTIONS = {
  brands: [],
  companies: [],
  industries: [],
  tags: [],
  categories: [],
};

const DEBOUNCE_MS = 200;

// ─────────────────────────────────────────────
// Performance Logger (instance per mount)
// ─────────────────────────────────────────────
const createPerfLogger = () => {
  const history = [];

  return {
    history,

    start(label) {
      const startTime = performance.now();
      console.group(`🔍 [SEARCH] "${label}"`);
      console.log(`⏱️  Started: ${new Date().toLocaleTimeString()}`);
      return startTime;
    },

    end(label, startTime) {
      const duration = (performance.now() - startTime).toFixed(0);
      const ms = parseFloat(duration);

      const speed =
        ms < 150  ? "🟢 FAST"   :
        ms < 400  ? "🟡 MEDIUM" :
        ms < 800  ? "🟠 SLOW"   : "🔴 VERY SLOW";

      // const color =
      //   ms < 150  ? "green"  :
      //   ms < 400  ? "orange" : "red";

      // console.log(
      //   `%c✅ ${duration}ms ${speed}`,
      //   `color:${color}; font-weight:bold; font-size:12px`
      // );
      console.groupEnd();

      history.push({ query: label, ms, speed, at: new Date().toLocaleTimeString() });
      return ms;
    },

    breakdown(label, phases) {
      console.group(`🌐 [BREAKDOWN] "${label}"`);
      Object.entries(phases).forEach(([k, v]) => {
        const bar = "█".repeat(Math.min(Math.floor(v / 15), 40));
        // console.log(`  ${k.padEnd(22)}: ${String(v).padStart(5)}ms  ${bar}`);
      });
      console.groupEnd();
    },

    summary() {
      if (!history.length) return console.log("📭 No history yet");
      const avg = (history.reduce((s, h) => s + h.ms, 0) / history.length).toFixed(0);
      const slow = history.reduce((a, b) => (a.ms > b.ms ? a : b));
      const fast = history.reduce((a, b) => (a.ms < b.ms ? a : b));
      // console.group("📊 [SEARCH SUMMARY]");
      // console.table(history);
      // console.log(`📈 Avg : ${avg}ms`);
      // console.log(`🐢 Slow: "${slow.query}" → ${slow.ms}ms`);
      // console.log(`⚡ Fast: "${fast.query}" → ${fast.ms}ms`);
      // console.groupEnd();
    },
  };
};

// ─────────────────────────────────────────────
// Speed badge helper
// ─────────────────────────────────────────────
const getSpeedChip = (ms) => {
  if (ms === null) return null;
  const n = parseFloat(ms);
  const label =
    n < 150 ? `⚡ ${ms}ms` :
    n < 400 ? `🟡 ${ms}ms` :
    n < 800 ? `🟠 ${ms}ms` : `🔴 ${ms}ms`;

  const color =
    n < 150 ? "success" :
    n < 400 ? "warning" : "error";

  return { label, color };
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const Search = ({ handleClose }) => {
  const [query, setQuery]                   = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading]               = useState(false);
  const [suggestions, setSuggestions]       = useState(INITIAL_SUGGESTIONS);
  const [isOpen, setIsOpen]                 = useState(false);
  const [responseMs, setResponseMs]         = useState(null); // ✅ track timing

  // Refs
  const abortRef       = useRef(null);
  const inputRef       = useRef(null);
  const boxRef         = useRef(null);           // ✅ real DOM ref for outside click
  const reqCountRef    = useRef(0);
  const perfRef        = useRef(createPerfLogger()); // ✅ instance per mount

  const pathname = usePathname();
  const params   = useParams();
  const dispatch = useDispatch();

  const brandId      = params?.brandId;
  const isIdExist    = Boolean(brandId);

  // ✅ Fixed: && not ||
  const isBrandViewPage =
    pathname?.startsWith("/all-franchise-brands") && !isIdExist;

  // ─── Debounce ───────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  // ─── Fetch Suggestions ──────────────────────
  useEffect(() => {
    if (!debouncedQuery) {
      setSuggestions(INITIAL_SUGGESTIONS);
      setLoading(false);
      setIsOpen(false);
      setResponseMs(null);
      return;
    }

    const perf = perfRef.current;

    const fetchSuggestions = async () => {
      // Cancel stale request
      if (abortRef.current) {
        abortRef.current.abort();
        console.warn("🚫 Cancelled previous request");
      }

      abortRef.current = new AbortController();
      const { signal } = abortRef.current;

      reqCountRef.current += 1;
      const reqId = reqCountRef.current;

      setLoading(true);

      const totalStart   = perf.start(debouncedQuery);
      const preStart     = performance.now();

      const url = `${api.user.get.search}?searchTerm=${encodeURIComponent(debouncedQuery)}`;
      // console.log(`📡 [REQ #${reqId}] → ${url}`);

      const preTime = (performance.now() - preStart).toFixed(1);

      try {
        // ── Network call ──────────────────────
        const netStart   = performance.now();
        const response   = await GetApiCall(url, { signal });
        const netTime    = (performance.now() - netStart).toFixed(0);

        if (signal.aborted) {
          console.warn(`🚫 [REQ #${reqId}] Ignored (aborted)`);
          return;
        }

        // ✅ Save response time to state (shows in UI)
        setResponseMs(netTime);

        // ── Parse ─────────────────────────────
        const parseStart = performance.now();
        const data       = response?.data?.data || {};
        const parseTime  = (performance.now() - parseStart).toFixed(1);

        // ── State update ──────────────────────
        const stateStart = performance.now();
        setSuggestions({
          brands:     data?.brandNamesMatches    || [],
          companies:  data?.companyNamesMatches  || [],
          industries: data?.industryMatches      || [],
          tags:       data?.tagsMatches          || [],
          categories: data?.categoriesMatches    || [],
        });
        setIsOpen(true);
        const stateTime = (performance.now() - stateStart).toFixed(1);

        // ── Logs ──────────────────────────────
        const totalMs = perf.end(debouncedQuery, totalStart);

        perf.breakdown(debouncedQuery, {
          "Pre-request":    parseFloat(preTime),
          "Network":        parseFloat(netTime),
          "Parse":          parseFloat(parseTime),
          "State update":   parseFloat(stateTime),
          "TOTAL":          totalMs,
        });

        // const counts = {
        //   brands:     data?.brandNamesMatches?.length   || 0,
        //   companies:  data?.companyNamesMatches?.length || 0,
        //   industries: data?.industryMatches?.length     || 0,
        //   tags:       data?.tagsMatches?.length         || 0,
        //   categories: data?.categoriesMatches?.length   || 0,
        // };
        // const total = Object.values(counts).reduce((a, b) => a + b, 0);

        // console.log(
        //   `📦 [REQ #${reqId}] ${total} results`,
        //   counts
        // );

        if (parseFloat(netTime) > 800) {
          console.warn(`⚠️  SLOW API: "${debouncedQuery}" → ${netTime}ms. Check backend.`);
        }

        // Show summary every 5 requests
        if (reqCountRef.current % 5 === 0) perf.summary();

      } catch (err) {
        if (err?.name === "AbortError" || signal.aborted) {
          console.warn(`🚫 [REQ #${reqId}] Aborted: "${debouncedQuery}"`);
          return;
        }
        console.error(`❌ [REQ #${reqId}] Error:`, err);
        setSuggestions(INITIAL_SUGGESTIONS);
        perf.end(debouncedQuery, totalStart);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchSuggestions();

    return () => abortRef.current?.abort();
  }, [debouncedQuery]);

  const hasResults = Object.values(suggestions).some((a) => a.length > 0);

  // ─── Outside click ──────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // ✅ Use real DOM ref - reliable
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Clear ───────────────────────────────────
  const handleClear = useCallback(() => {
    setQuery("");
    // ✅ Don't manually set debouncedQuery - let debounce useEffect handle it
    setSuggestions(INITIAL_SUGGESTIONS);
    setIsOpen(false);
    setResponseMs(null);
    inputRef.current?.focus();
    perfRef.current.summary();
  }, []);

  // ─── Main Search ─────────────────────────────
  const handleOnSearch = useCallback(
    (searchValue = null) => {
      const value =
        typeof searchValue === "string" && searchValue.trim()
          ? searchValue.trim()
          : query.trim();

      if (!value) return;

      setIsOpen(false);
      console.log(`🔎 [SEARCH SUBMIT] "${value}"`);

      try {
        if (!isBrandViewPage) {
          // ✅ Navigate to brands page
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "franchiseFilters",
              JSON.stringify({ searchTerm: value })
            );

            // ✅ Fixed: correct setFilter payload shape
            dispatch(
              setFilter({ filterName: "searchTerm", value })
            );

            window.open("/all-franchise-brands", "_blank", "noopener,noreferrer");
          }
          return;
        }

        // ✅ Already on brands page - dispatch filter
        dispatch(
          fetchFilteredBrands({ searchTerm: value, page: 1, limit: 20 })
        );

        handleClose?.(false);
      } catch (err) {
        console.error("Search dispatch error:", err);
      }
    },
    [query, isBrandViewPage, dispatch, handleClose]
  );

  // ─── Suggestion Click ────────────────────────
  const handleSelectedSuggestionData = useCallback(
    (selectedData) => {
      if (!selectedData) return;

      // Brand name → go to brand detail page
      if (selectedData.brandName) {
        window.open(
          `/franchise-business-opportunity/${selectedData.brandName}`,
          "_blank",
          "noopener,noreferrer"
        );
        setIsOpen(false);
        return;
      }

      // Tag / Industry / Category → trigger search
      const searchValue =
        selectedData.tag      ||
        selectedData.industry ||
        selectedData.category ||
        "";

      if (searchValue) {
        setQuery(searchValue);
        handleOnSearch(searchValue);
      }
    },
    [handleOnSearch]
  );

  // ─── Speed chip ──────────────────────────────
  // const speedChip = getSpeedChip(responseMs);

  // ─── Render ──────────────────────────────────
  return (
    // ✅ Real ref on wrapper for outside click
    <Box ref={boxRef} sx={{ position: "relative", width: 400 }}>

      {/* ✅ Response time badge - CORRECTLY in JSX not in useEffect */}
      {/* {speedChip && (
        <Box sx={{ position: "absolute", top: -22, right: 0 }}>
          <Chip
            label={speedChip.label}
            color={speedChip.color}
            size="small"
            sx={{ fontSize: "10px", height: 18 }}
          />
        </Box>
      )} */}

      <TextField
        inputRef={inputRef}
        fullWidth
        size="medium"
        placeholder="Search brands, companies, industries..."
        value={query}
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: 2,
            backgroundColor: "#fff",
            boxShadow: "0 4px 14px rgba(129, 59, 31, 0.04)",
          },
        }}
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value) setIsOpen(true);
          else setIsOpen(false);
        }}
        onFocus={() => {
          if (hasResults) setIsOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter")  handleOnSearch();
          if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ gap: 0.5 }}>
              {/* Clear button */}
              {query && !loading && (
                <IconButton
                  onClick={handleClear}
                  size="small"
                  edge="end"
                  aria-label="clear search"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}

              {/* Search / Loading button */}
              <IconButton
                onClick={() => handleOnSearch()}
                size="small"
                edge="end"
                disabled={!query || loading}
                aria-label="search"
              >
                {loading
                  ? <CircularProgress size={16} />
                  : <SearchIcon fontSize="small" />
                }
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Dropdown */}
      {isOpen && (loading || hasResults) && (
        <Paper
          elevation={4}
          sx={{
            position:   "absolute",
            width:      "100%",
            mt:         0.5,
            maxHeight:  380,
            overflowY:  "auto",
            zIndex:     1300,
            borderRadius: 1,
            // Smooth appearance
            animation:  "fadeIn 0.12s ease-out",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(-6px)" },
              to:   { opacity: 1, transform: "translateY(0)"    },
            },
          }}
        >
          {loading ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <CircularProgress size={22} color="warning" />
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