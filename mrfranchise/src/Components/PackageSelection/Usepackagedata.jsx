import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  API_URL,
  ALL_INDIA_STATES,
  getUserLocationFromIP,
} from "./Packageselectionconstants";

const usePackageData = () => {
  const hasDraftChecked = useRef(false);
  const paymentSummaryRef = useRef(null);
  const upgradeSectionRef = useRef(null);
  const statesByInvestmentRangeRef = useRef({});

  // ── State ─────────────────────────────────────────────────────────────────
  const [paymentSummary, setPaymentSummary] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandLoading, setBrandLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState({});
  const [selectedPlans, setSelectedPlans] = useState({});
  const [brandError, setBrandError] = useState(null);
  const [ficoInvestmentRanges, setFicoInvestmentRanges] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [tooltipAnchorEl, setTooltipAnchorEl] = useState(null);
  const [detectedState, setDetectedState] = useState(null);
  const [openStateModal, setOpenStateModal] = useState(false);
  const [allStates, setAllStates] = useState(ALL_INDIA_STATES);
  const [selectedStates, setSelectedStates] = useState(new Set());
  const [statesByInvestmentRange, setStatesByInvestmentRange] = useState({});
  const [currentEditingRange, setCurrentEditingRange] = useState(null);
  const [isUpgradeMode, setIsUpgradeMode] = useState(false);
  const [upgradePlanId, setUpgradePlanId] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [openSection, setOpenSection] = useState(["investor", "summary"]);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
  const [leadsDropdownData, setLeadsDropdownData] = useState({});
  const [selectedLeadsPerRange, setSelectedLeadsPerRange] = useState({});
  const [selectedListingPlanId, setSelectedListingPlanId] = useState(null);
  const [movedGroupKeys, setMovedGroupKeys] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedValidityDays, setSelectedValidityDays] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [expandedRegion, setExpandedRegion] = useState(null);
  const [openStatesTooltip, setOpenStatesTooltip] = useState(false);
  const [tooltipStates, setTooltipStates] = useState([]);
  const [openRemoveConfirmDialog, setOpenRemoveConfirmDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [data, setData] = useState(null);
  const [loadings, setLoadings] = useState(true);
  const [errors, setErrors] = useState("");
  const [brandOwnerId, setBrandOwnerId] = useState(null);

  const { brandUUID: reduxBrandUUID, token: reduxToken } = useSelector((state) => state.auth);
const [localBrandUUID, setLocalBrandUUID] = useState(() =>
  typeof window !== "undefined"
    ? localStorage.getItem("brandUUID")
    : null
);

const [localAccessToken, setLocalAccessToken] = useState(() =>
  typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null
);

  const finalBrandUUID = reduxBrandUUID || localBrandUUID;
  const finalToken = reduxToken || localAccessToken;

  // ── API calls ─────────────────────────────────────────────────────────────
  const fetchPackages = async (ownerId) => {
    try {
      setLoadings(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/brand-packages-plans/get/${ownerId}`);
      const apiData = response.data.data || response.data;
      setData(apiData);
      if (apiData?.packages && Array.isArray(apiData.packages)) {
        const initialStatesByRange = {};
        apiData.packages.forEach((packageItem) => {
          if (packageItem.investmetPackages && Array.isArray(packageItem.investmetPackages)) {
            packageItem.investmetPackages.forEach((investPackage) => {
              const planId = apiData.brandOwnerId || "default";
              const investmentRangeLabel = "Investment Range";
              if (investPackage.investmentranges && Array.isArray(investPackage.investmentranges)) {
                investPackage.investmentranges.forEach((range) => {
                  const investmentRange = range.selectedPlanInvestmetrange;
                  if (investPackage.selectedPlanStateAndDistrict && Array.isArray(investPackage.selectedPlanStateAndDistrict)) {
                    const states = investPackage.selectedPlanStateAndDistrict.map((item) => item.state);
                    if (states?.length > 0) {
                      initialStatesByRange[`${planId}__${investmentRangeLabel}__${investmentRange}`] = states;
                    }
                  }
                });
              }
            });
          }
        });
        if (Object.keys(initialStatesByRange).length > 0) {
          setStatesByInvestmentRange(initialStatesByRange);
          localStorage.setItem("investmentRangeStates", JSON.stringify(initialStatesByRange));
        }
      }
    } catch (err) {
      setErrors(err?.response?.data?.message || "Failed to fetch package data");
    } finally {
      setLoadings(false);
    }
  };

  const fetchBrandDetails = async (uuid, accessToken) => {
    try {
      setBrandLoading(true);
      setBrandError(null);
      const response = await fetch(`${API_URL}/api/v1/brandlisting/getBrandById/${uuid}`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      const json = await response.json();
      if (!response.ok || json.success === false) throw new Error(json.message || "Failed to fetch brand details");
      const brandData = Array.isArray(json.data) ? json.data[0] : json.data;
      if (brandData.brandOwnerId) {
        localStorage.setItem("brandOwnerId", brandData.brandOwnerId);
        setBrandOwnerId(brandData.brandOwnerId);
      } else if (brandData._id) {
        localStorage.setItem("brandOwnerId", brandData._id);
        setBrandOwnerId(brandData._id);
      }
      const ficoData =
        Array.isArray(brandData?.franchiseDetails?.fico) ? brandData.franchiseDetails.fico :
        Array.isArray(brandData?.fico) ? brandData.fico :
        Array.isArray(brandData?.brandDetails?.fico) ? brandData.brandDetails.fico : [];
      const ficoRanges = ficoData.map((item) => item?.investmentRange).filter(Boolean);
      setFicoInvestmentRanges(ficoRanges);
      if (typeof window !== "undefined") localStorage.setItem("ficoInvestmentRanges", JSON.stringify(ficoRanges));
      const expansionLocations = brandData?.expansionlocationdata?.expansionLocations?.domestic?.locations || [];
      const extractedStates = expansionLocations.map((location) => {
        if (typeof location === "string") return location.trim();
        if (typeof location?.state === "string") return location.state.trim();
        if (typeof location?.state === "object" && location?.state !== null)
          return (location.state.name || location.state.label || location.state.value || location.state.stateName || "").trim();
        return (location?.stateName || location?.State || location?.state_name || location?.address?.state || location?.location?.state || "").trim();
      }).filter(Boolean);
      const uniqueStatesList = [...new Map(extractedStates.map((state) => [state.toLowerCase(), state])).values()];
      setAllStates(uniqueStatesList.length > 0 ? uniqueStatesList : []);
    } catch (err) {
      console.error("Brand fetch error:", err);
      setBrandError(err.message);
    } finally {
      setBrandLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/api/v1/admin/plans/getAllPlans`);
      const json = await response.json();
      console.log("json",json)
      if (json.success && Array.isArray(json.data)) {
        setPlans(json.data);
        const leadsData = {};
        json.data.forEach((plan) => {
          plan.packages?.forEach((pkg) => {
            leadsData[`${plan._id}_${pkg.investmentRangeLabel}`] = pkg.totalLeads || [];
          });
        });
        setLeadsDropdownData(leadsData);
        const filtered = json.data.filter((plan) => plan.packages?.length > 1);
        const launchPadPlan = filtered.find((plan) => plan.planName?.toLowerCase() === "launch pad program");
        if (launchPadPlan) {
          const investmentRangeLabels = new Set();
          filtered.forEach((plan) => {
            plan.packages?.forEach((pkg) => { investmentRangeLabels.add(pkg.investmentRangeLabel); });
          });
          const defaultPlans = {};
          investmentRangeLabels.forEach((label) => { defaultPlans[label] = launchPadPlan._id; });
          setSelectedPlans(defaultPlans);
        }
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = localStorage.getItem("brandOwnerId") || localStorage.getItem("brandUUID");
    if (id) setBrandOwnerId(id);
    else setLoadings(false);
  }, []);

  useEffect(() => {
    if (brandOwnerId) fetchPackages(brandOwnerId);
  }, [brandOwnerId]);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!finalBrandUUID) return;
    fetchBrandDetails(finalBrandUUID, finalToken);
  }, [finalBrandUUID, finalToken]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocalBrandUUID(localStorage.getItem("brandUUID"));
      setLocalAccessToken(localStorage.getItem("accessToken"));
        if (finalToken) {
    return;
  }
      const savedStates = localStorage.getItem("investmentRangeStates");
      if (savedStates) {
        try { setStatesByInvestmentRange(JSON.parse(savedStates)); }
        catch (err) { console.error("Error parsing saved states:", err); }
      }
      const savedSummary = localStorage.getItem("paymentSummaryDraft");
      if (savedSummary) {
        try {
          const parsed = JSON.parse(savedSummary);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPaymentSummary(parsed);
            const savedMovedKeys = localStorage.getItem("movedGroupKeys");
            let restoredMovedKeys = [];
            if (savedMovedKeys) {
              try { restoredMovedKeys = JSON.parse(savedMovedKeys); setMovedGroupKeys(restoredMovedKeys); }
              catch (err) { console.error("Error parsing moved group keys:", err); }
            }
            const newMovedKeys = [...restoredMovedKeys];
            parsed.forEach((group) => {
              if (group.groupKey && !newMovedKeys.includes(group.groupKey)) newMovedKeys.push(group.groupKey);
            });
            if (JSON.stringify(newMovedKeys) !== JSON.stringify(restoredMovedKeys)) setMovedGroupKeys(newMovedKeys);
            const restoredSelected = {};
            const restoredChecked = {};
            parsed.forEach((group) => {
              if (group.groupKey?.startsWith("listing-")) restoredSelected[group.groupKey] = true;
              group.items?.forEach((item) => {
                if (item.id) { restoredSelected[item.id] = true; restoredChecked[item.id] = true; }
              });
            });
            setSelected((prev) => ({ ...prev, ...restoredSelected }));
            setCheckedItems(restoredChecked);
          }
        } catch (err) { console.error("Error parsing saved payment summary:", err); }
      }
      hasDraftChecked.current = true;
    }
  }, [finalToken]);

  useEffect(() => {
    statesByInvestmentRangeRef.current = statesByInvestmentRange;
  }, [statesByInvestmentRange]);

  useEffect(() => {
    if (typeof window !== "undefined" && movedGroupKeys.length > 0)
      localStorage.setItem("movedGroupKeys", JSON.stringify(movedGroupKeys));
  }, [movedGroupKeys]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     if (paymentSummary.length > 0) localStorage.setItem("paymentSummaryDraft", JSON.stringify(paymentSummary));
  //     else localStorage.removeItem("paymentSummaryDraft");
  //   }
  // }, [paymentSummary]);
  useEffect(() => {
  if (typeof window === "undefined") return;

  // Logged in user -> Don't save guest draft
  if (finalToken) return;

  if (paymentSummary.length > 0) {
    localStorage.setItem(
      "paymentSummaryDraft",
      JSON.stringify(paymentSummary)
    );
  } else {
    localStorage.removeItem("paymentSummaryDraft");
  }
}, [paymentSummary, finalToken]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (movedGroupKeys.length > 0) localStorage.setItem("movedGroupKeys", JSON.stringify(movedGroupKeys));
      else localStorage.removeItem("movedGroupKeys");
    }
  }, [movedGroupKeys]);

  useEffect(() => {
    const detectLocation = async () => {
      if (finalToken) return;
      const savedLocation = localStorage.getItem("userLocation");
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          setUserLocation(parsed);
          if (parsed.state) {
            const matchedState = ALL_INDIA_STATES.find((s) => s.toLowerCase() === parsed.state.toLowerCase());
            if (matchedState) setDetectedState(matchedState);
          }
          return;
        } catch (err) { console.error("Error parsing saved location:", err); }
      }
      setLocationLoading(true);
      try {
        const ipLocation = await getUserLocationFromIP();
        if (ipLocation?.state) {
          const locationData = { state: ipLocation.state, city: ipLocation.city, country: ipLocation.country };
          setUserLocation(locationData);
          localStorage.setItem("userLocation", JSON.stringify(locationData));
          const matchedState = ALL_INDIA_STATES.find((s) => s.toLowerCase() === ipLocation.state.toLowerCase());
          if (matchedState) setDetectedState(matchedState);
        }
      } catch (error) {
        console.error("Location detection error:", error);
      } finally {
        setLocationLoading(false);
      }
    };
    detectLocation();
  }, [finalToken]);

  // Sync statesByInvestmentRange changes into paymentSummary
  useEffect(() => {
    if (Object.keys(leadsDropdownData).length === 0 || paymentSummary.length === 0) return;
    setPaymentSummary((prev) =>
      prev.map((group) => {
        if (group.isListingPlan) return group;
        const updatedItems = group.items.map((item) => {
          const key = getRangeKey(item.investmentRangeLabel, item.range, group.planId);
          let states = statesByInvestmentRange[key];
          if (!states?.length) states = item.states?.length > 0 ? item.states : [];
          const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
          const availableLeads = leadsDropdownData[leadsDataKey] || [];
          const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
          const divisor = minLeads > 0 ? minLeads : 1;
          const itemAmount = (group.pricePerState / divisor) * (states || []).length * (item.selectedLeads || 0);
          return { ...item, states: states || [], stateCount: (states || []).length, totalLeads: (item.selectedLeads || 0) * (states || []).length, totalAmount: itemAmount };
        });
        const allStatesSet = new Set();
        updatedItems.forEach((item) => { (item.states || []).forEach((state) => allStatesSet.add(state)); });
        const uniqueStates = Array.from(allStatesSet);
        const totalUniqueStates = uniqueStates.length;
        const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
        const availableLeads = leadsDropdownData[leadsDataKey] || [];
        const minLeads = availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
        const divisor = minLeads > 0 ? minLeads : 1;
        const selectedLeads = updatedItems[0]?.selectedLeads || 0;
        return { ...group, items: updatedItems, uniqueStates, totalStates: totalUniqueStates, amount: (group.pricePerState / divisor) * totalUniqueStates * selectedLeads, totalLeads: selectedLeads * totalUniqueStates };
      })
    );
  }, [statesByInvestmentRange, leadsDropdownData]);

  // Merge purchased states from API data into statesByInvestmentRange
  useEffect(() => {
    if (data?.InvestmetPackages && Array.isArray(data.InvestmetPackages)) {
      const initialStatesByRange = {};
      data.InvestmetPackages.forEach((planPackage) => {
        const planId = planPackage.planUniqueId || planPackage.planId;
        planPackage.InvestmetPackages?.forEach((pkg) => {
          const key = `${planId}__${pkg.InvestmentRangeLabel || pkg.PackageName}__${pkg.InvestmentRange}`;
          const states = pkg.States || [];
          if (states.length > 0 && states[0] !== "ALL STATES") initialStatesByRange[key] = states;
        });
      });
      if (Object.keys(initialStatesByRange).length > 0) {
        setStatesByInvestmentRange((prev) => {
          const merged = { ...prev, ...initialStatesByRange };
          localStorage.setItem("investmentRangeStates", JSON.stringify(merged));
          return merged;
        });
      }
    }
  }, [data]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const filteredPlans = useMemo(
    () => plans.filter((plan) => plan.packages?.length > 1 && plan.planName?.toLowerCase() !== "free"),
    [plans]
  );

  useEffect(() => {
    if (filteredPlans.length > 0 && selectedGroup === null) setSelectedGroup(filteredPlans[0]._id);
  }, [filteredPlans, selectedGroup]);

  // ── Shared helpers (also needed by the actions hook) ──────────────────────
  const getRangeKey = useCallback((investmentRangeLabel, range, planId = null) => {
    return planId ? `${planId}__${investmentRangeLabel}__${range}` : `${investmentRangeLabel}__${range}`;
  }, []);

  const getUniqueStatesAcrossRanges = useCallback((items) => {
    const allStatesSet = new Set();
    items.forEach((item) => { item.states.forEach((state) => allStatesSet.add(state)); });
    return Array.from(allStatesSet);
  }, []);

  const normalizeRange = useCallback((value) => {
    return String(value || "").toLowerCase()
      .replace(/₹/g, "rs").replace(/\brupees\b/g, "rs").replace(/\brs\.?\b/g, "")
      .replace(/\blakhs\b/g, "lakh").replace(/\bcrores\b/g, "crore")
      .replace(/\bto\b/g, "-").replace(/[^a-z0-9]/g, "").trim();
  }, []);

  const isFicoInvestmentRange = useCallback((range) => {
    const currentRange = normalizeRange(range);
    return ficoInvestmentRanges.some((ficoRange) => normalizeRange(ficoRange) === currentRange);
  }, [ficoInvestmentRanges, normalizeRange]);

  const getBrandName = useCallback(() => data?.brandDetails?.brandName || data?.brandName || "", [data]);
  const getCategory = useCallback(() => data?.brandDetails?.category || data?.category || "", [data]);
  const getIndustry = useCallback(() => data?.brandDetails?.industry || data?.industry || "", [data]);
  const getRowBackgroundColor = useCallback(() => "#fff0c5", []);

  const getStatesToDisplay = useCallback(() => {
    if (finalToken) return allStates.length > 0 ? allStates : [];
    return ALL_INDIA_STATES;
  }, [allStates, finalToken]);

  const getStateCountForRange = useCallback(
    (investmentRangeLabel, range, planId = null) => {
      const key = getRangeKey(investmentRangeLabel, range, planId);
      if (Object.prototype.hasOwnProperty.call(statesByInvestmentRange, key)) return statesByInvestmentRange[key].length;
      const matchingKey = Object.keys(statesByInvestmentRange).find((k) => {
        const parts = k.split("__");
        return parts[parts.length - 1] === range && parts[parts.length - 2] === investmentRangeLabel;
      });
      if (matchingKey) return statesByInvestmentRange[matchingKey].length;
      if (!finalToken && detectedState) return 1;
      return allStates.length;
    },
    [getRangeKey, statesByInvestmentRange, finalToken, detectedState, allStates],
  );

  return {
    // refs
    paymentSummaryRef,
    upgradeSectionRef,
    statesByInvestmentRangeRef,
    hasDraftChecked,
    // state
    paymentSummary, setPaymentSummary,
    plans,
    loading,
    brandLoading,
    error,
    selected, setSelected,
    selectedPlans, setSelectedPlans,
    brandError,
    ficoInvestmentRanges,
    locationLoading,
    userLocation,
    tooltipAnchorEl, setTooltipAnchorEl,
    detectedState,
    openStateModal, setOpenStateModal,
    allStates,
    selectedStates, setSelectedStates,
    statesByInvestmentRange, setStatesByInvestmentRange,
    currentEditingRange, setCurrentEditingRange,
    isUpgradeMode, setIsUpgradeMode,
    upgradePlanId, setUpgradePlanId,
    showLogin, setShowLogin,
    openSection, setOpenSection,
    snack, setSnack,
    leadsDropdownData,
    selectedLeadsPerRange, setSelectedLeadsPerRange,
    selectedListingPlanId, setSelectedListingPlanId,
    movedGroupKeys, setMovedGroupKeys,
    selectedGroup, setSelectedGroup,
    selectedValidityDays,
    checkedItems, setCheckedItems,
    openConfirmDialog, setOpenConfirmDialog,
    pendingSelection, setPendingSelection,
    expandedRegion, setExpandedRegion,
    openStatesTooltip, setOpenStatesTooltip,
    tooltipStates, setTooltipStates,
    openRemoveConfirmDialog, setOpenRemoveConfirmDialog,
    itemToRemove, setItemToRemove,
    data,
    loadings,
    errors,
    brandOwnerId,
    finalToken,
    finalBrandUUID,
    filteredPlans,
    // helpers (shared with actions hook)
    getRangeKey,
    getUniqueStatesAcrossRanges,
    normalizeRange,
    isFicoInvestmentRange,
    getBrandName,
    getCategory,
    getIndustry,
    getRowBackgroundColor,
    getStatesToDisplay,
    getStateCountForRange,
  };
};

export default usePackageData;