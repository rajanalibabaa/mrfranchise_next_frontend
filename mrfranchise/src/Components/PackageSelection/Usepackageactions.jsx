import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ALL_INDIA_STATES } from "./Packageselectionconstants";

const usePackageActions = (dataHook, onAddInvestmentRange) => {
  const router = useRouter();

  const {
    paymentSummaryRef,
    paymentSummary,
    setPaymentSummary,
    selected,
    setSelected,
    allStates,
    selectedStates,
    setSelectedStates,
    statesByInvestmentRange,
    setStatesByInvestmentRange,
    statesByInvestmentRangeRef,
    currentEditingRange,
    setCurrentEditingRange,
    openStateModal,
    setOpenStateModal,
    showLogin,
    setShowLogin,
    openSection,
    setOpenSection,
    snack,
    setSnack,
    leadsDropdownData,
    selectedLeadsPerRange,
    setSelectedLeadsPerRange,
    movedGroupKeys,
    setMovedGroupKeys,
    checkedItems,
    setCheckedItems,
    tooltipAnchorEl,
    setTooltipAnchorEl,
    openStatesTooltip,
    setOpenStatesTooltip,
    tooltipStates,
    setTooltipStates,
    data,
    finalToken,
    detectedState,
    // shared helpers
    getRangeKey,
    getUniqueStatesAcrossRanges,
    getStatesToDisplay,
  } = dataHook;

  // ── Snack ─────────────────────────────────────────────────────────────────
  const openSnack = useCallback(
    (message, severity = "info") => {
      setSnack({ open: true, message, severity });
    },
    [setSnack],
  );

  const closeSnack = useCallback(() => {
    setSnack((s) => ({ ...s, open: false }));
  }, [setSnack]);

  // ── Section accordion ─────────────────────────────────────────────────────
  const handleSectionChange = useCallback(
    (sectionName) => (isOpen) => {
      setOpenSection((prev) =>
        isOpen
          ? prev.includes(sectionName)
            ? prev
            : [...prev, sectionName]
          : prev.filter((s) => s !== sectionName),
      );
    },
    [setOpenSection],
  );

  // ── Scroll helper ─────────────────────────────────────────────────────────
  const scrollToPaymentSummary = useCallback(() => {
    paymentSummaryRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }, [paymentSummaryRef]);

  // ── Tooltip ───────────────────────────────────────────────────────────────
  const handleShowStates = useCallback(
    (event, statesList) => {
      setTooltipStates(statesList);
      setTooltipAnchorEl(event.currentTarget);
      setOpenStatesTooltip(true);
    },
    [setTooltipStates, setTooltipAnchorEl, setOpenStatesTooltip],
  );

  // ── State-modal helpers ───────────────────────────────────────────────────
  const getAlreadySelectedStatesInOtherRanges = useCallback(() => {
    const selectedInOtherRanges = new Set();
    if (!currentEditingRange) return selectedInOtherRanges;
    const currentRangeValue = currentEditingRange.split("__")[2];

    if (data?.packages && Array.isArray(data.packages)) {
      data.packages.forEach((packageItem) => {
        const packageType = (
          packageItem.packagesType ||
          packageItem.PackagesType ||
          ""
        ).toUpperCase();
        if (packageType !== "LEAD") return;
        const investPackages =
          packageItem.investmetPackages ||
          packageItem.InvestmetPackages ||
          packageItem.InvestmentPackages ||
          packageItem.packages ||
          [];
        investPackages.forEach((investPackage) => {
          (investPackage.investmentranges || []).forEach((range) => {
            const existingRange = range.selectedPlanInvestmetrange || "";
            if (existingRange !== currentRangeValue) return;
            (
              investPackage.selectedPlanStateAndDistrict ||
              investPackage.SelectedPlanStateAndDistrict ||
              []
            ).forEach((entry) => {
              if (entry.state) selectedInOtherRanges.add(entry.state);
            });
            (range.selectedPlanStateAndDistrict || []).forEach((entry) => {
              if (entry.state) selectedInOtherRanges.add(entry.state);
            });
          });
        });
      });
    }

    paymentSummary.forEach((group) => {
      if (group.isListingPlan) return;
      group.items.forEach((item) => {
        const itemKey = getRangeKey(
          item.investmentRangeLabel,
          item.range,
          group.planId,
        );
        if (itemKey === currentEditingRange) return;
        if (item.range === currentRangeValue)
          item.states.forEach((state) => selectedInOtherRanges.add(state));
      });
    });

    return selectedInOtherRanges;
  }, [currentEditingRange, data, paymentSummary, getRangeKey]);

  const handleCloseStateModal = useCallback(() => {
    setOpenStateModal(false);
  }, [setOpenStateModal]);

  const handleOpenStateModal = useCallback(
    (investmentRangeLabel, range, planId = null) => {
      const key = getRangeKey(investmentRangeLabel, range, planId);
      setCurrentEditingRange(key);
      const otherRangeStates = new Set();
      const editingRangeValue = key.split("__")[2];
      let purchasedStatesForThisRange = [];

      if (data?.packages && Array.isArray(data.packages)) {
        data.packages.forEach((packageItem) => {
          const packageType = (
            packageItem.packagesType ||
            packageItem.PackagesType ||
            ""
          ).toUpperCase();
          if (packageType !== "LEAD") return;
          const investPackages =
            packageItem.investmetPackages ||
            packageItem.InvestmetPackages ||
            packageItem.InvestmentPackages ||
            packageItem.packages ||
            [];
          investPackages.forEach((investPackage) => {
            (investPackage.investmentranges || []).forEach((r) => {
              const existingRange = r.selectedPlanInvestmetrange || "";
              if (existingRange === editingRangeValue) {
                (
                  investPackage.selectedPlanStateAndDistrict ||
                  investPackage.SelectedPlanStateAndDistrict ||
                  []
                ).forEach((entry) => {
                  if (entry.state)
                    purchasedStatesForThisRange.push(entry.state);
                });
                (r.selectedPlanStateAndDistrict || []).forEach((entry) => {
                  if (entry.state)
                    purchasedStatesForThisRange.push(entry.state);
                });
              } else {
                (
                  investPackage.selectedPlanStateAndDistrict ||
                  investPackage.SelectedPlanStateAndDistrict ||
                  []
                ).forEach((entry) => {
                  if (entry.state) otherRangeStates.add(entry.state);
                });
                (r.selectedPlanStateAndDistrict || []).forEach((entry) => {
                  if (entry.state) otherRangeStates.add(entry.state);
                });
              }
            });
          });
        });
      }

      purchasedStatesForThisRange = [...new Set(purchasedStatesForThisRange)];

      paymentSummary.forEach((group) => {
        if (group.isListingPlan) return;
        group.items.forEach((item) => {
          const itemKey = getRangeKey(
            item.investmentRangeLabel,
            item.range,
            group.planId,
          );
          if (itemKey === key) return;
          if (item.range === editingRangeValue)
            item.states.forEach((state) => otherRangeStates.add(state));
        });
      });

      Object.entries(statesByInvestmentRange).forEach(([rangeKey, states]) => {
        if (rangeKey === key) return;
        if (rangeKey.split("__")[0] !== planId) return;
        states.forEach((state) => otherRangeStates.add(state));
      });

      const committedItem = paymentSummary
        .flatMap((g) => g.items)
        .find(
          (item) =>
            getRangeKey(item.investmentRangeLabel, item.range, planId) === key,
        );

      const savedStates =
        statesByInvestmentRange[key] ||
        (() => {
          const matchingKey = Object.keys(statesByInvestmentRange).find((k) => {
            const parts = k.split("__");
            return (
              parts[parts.length - 1] === range &&
              parts[parts.length - 2] === investmentRangeLabel
            );
          });
          return matchingKey ? statesByInvestmentRange[matchingKey] : null;
        })();

      let statesToPreselect = finalToken
        ? committedItem?.states || savedStates || allStates
        : committedItem?.states ||
          savedStates ||
          (detectedState ? [detectedState] : []);

      if (!statesToPreselect?.length) {
        statesToPreselect =
          allStates.length > 0
            ? allStates.filter((s) => !otherRangeStates.has(s))
            : [];
      }

      setSelectedStates(
        statesToPreselect?.length > 0 ? new Set(statesToPreselect) : new Set(),
      );
      setOpenStateModal(true);
    },
    [
      getRangeKey,
      paymentSummary,
      statesByInvestmentRange,
      finalToken,
      detectedState,
      allStates,
      data,
      setCurrentEditingRange,
      setSelectedStates,
      setOpenStateModal,
    ],
  );

  const handleSaveStates = useCallback(() => {
    const blocked = getAlreadySelectedStatesInOtherRanges();
    const selectedArray = Array.from(selectedStates).filter(
      (state) => !blocked.has(state),
    );
    if (selectedArray.length === 0) {
      openSnack("Please select at least one state before saving", "warning");
      return;
    }

    const allAvailableStates = allStates.length > 0 ? allStates : [];
    const isAllStatesSelected =
      !!finalToken &&
      allAvailableStates.length > 0 &&
      selectedArray.length === allAvailableStates.length &&
      selectedArray.every((state) => allAvailableStates.includes(state));

    const updated = isAllStatesSelected
      ? (() => {
          const u = { ...statesByInvestmentRange };
          delete u[currentEditingRange];
          return u;
        })()
      : { ...statesByInvestmentRange, [currentEditingRange]: selectedArray };

    setStatesByInvestmentRange(updated);
    statesByInvestmentRangeRef.current = updated;
    localStorage.setItem("investmentRangeStates", JSON.stringify(updated));

    setPaymentSummary((prev) =>
      prev.map((group) => {
        let groupHasRange = false;
        const updatedItems = group.items.map((item) => {
          const itemKey = getRangeKey(
            item.investmentRangeLabel,
            item.range,
            group.planId,
          );
          if (itemKey !== currentEditingRange) return item;
          groupHasRange = true;
          const statesToUse = isAllStatesSelected
            ? allAvailableStates
            : selectedArray;
          const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
          const availableLeads = leadsDropdownData[leadsDataKey] || [];
          const minLeads =
            availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
          const divisor = minLeads > 0 ? minLeads : 1;
          return {
            ...item,
            states: [...statesToUse],
            stateCount: statesToUse.length,
            totalLeads: (item.selectedLeads || 0) * statesToUse.length,
            totalAmount:
              (group.pricePerState / divisor) *
              statesToUse.length *
              (item.selectedLeads || 0),
          };
        });
        if (!groupHasRange) return group;
        const allStatesSet = new Set();
        updatedItems.forEach((item) => {
          (item.states || []).forEach((state) => allStatesSet.add(state));
        });
        const uniqueStates = Array.from(allStatesSet);
        const totalUniqueStates = uniqueStates.length;
        const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
        const availableLeads = leadsDropdownData[leadsDataKey] || [];
        const minLeads =
          availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
        const divisor = minLeads > 0 ? minLeads : 1;
        const selectedLeads = updatedItems[0]?.selectedLeads || 0;
        return {
          ...group,
          items: updatedItems,
          uniqueStates,
          totalStates: totalUniqueStates,
          amount:
            (group.pricePerState / divisor) * totalUniqueStates * selectedLeads,
          totalLeads: selectedLeads * totalUniqueStates,
        };
      }),
    );

    openSnack(
      isAllStatesSelected
        ? "Reset to all states"
        : `Saved ${selectedArray.length} state${selectedArray.length > 1 ? "s" : ""}`,
      isAllStatesSelected ? "info" : "success",
    );
    handleCloseStateModal();
  }, [
    selectedStates,
    statesByInvestmentRange,
    currentEditingRange,
    getRangeKey,
    leadsDropdownData,
    openSnack,
    handleCloseStateModal,
    getAlreadySelectedStatesInOtherRanges,
    allStates,
    finalToken,
    setStatesByInvestmentRange,
    statesByInvestmentRangeRef,
    setPaymentSummary,
  ]);

  // ── State checkbox controls ───────────────────────────────────────────────
  const handleSelectAll = useCallback(() => {
    const states = getStatesToDisplay();
    const blocked = getAlreadySelectedStatesInOtherRanges();
    const selectableStates = states.filter((state) => !blocked.has(state));
    if (selectableStates.length > 0) {
      setSelectedStates(new Set(selectableStates));
      openSnack(`Selected ${selectableStates.length} states`, "success");
    } else {
      openSnack("No states available to select", "warning");
    }
  }, [
    getStatesToDisplay,
    getAlreadySelectedStatesInOtherRanges,
    openSnack,
    setSelectedStates,
  ]);

  const handleClearAll = useCallback(() => {
    const blocked = getAlreadySelectedStatesInOtherRanges();
    setSelectedStates((prev) => {
      const next = new Set();
      prev.forEach((state) => {
        if (blocked.has(state)) next.add(state);
      });
      return next;
    });
    openSnack("Cleared all selectable states", "info");
  }, [getAlreadySelectedStatesInOtherRanges, openSnack, setSelectedStates]);

  const handleStateCheckboxChange = useCallback(
    (state) => {
      const blocked = getAlreadySelectedStatesInOtherRanges();
      if (blocked.has(state)) {
        openSnack(
          `"${state}" is already used in another investment range. Please select a different state.`,
          "warning",
        );
        return;
      }
      setSelectedStates((prev) => {
        const next = new Set(prev);
        if (next.has(state)) next.delete(state);
        else next.add(state);
        return next;
      });
    },
    [getAlreadySelectedStatesInOtherRanges, openSnack, setSelectedStates],
  );

  // ── Cart mutations ────────────────────────────────────────────────────────
  const handleAddSingleToPayment = useCallback(
    (item, selectedPlan, selectedPkg) => {
      const { id, investmentRangeLabel, range } = item;
      const pricePerState = Number(selectedPkg?.amount || 0);
      const leadsDataKey = `${selectedPlan._id}_${investmentRangeLabel}`;
      const availableLeads = leadsDropdownData[leadsDataKey] || [];
      let selectedLeads =
        item.selectedLeads ||
        selectedLeadsPerRange[
          `plan-${selectedPlan._id}-${investmentRangeLabel}`
        ] ||
        0;
      if ((!selectedLeads || selectedLeads <= 0) && availableLeads.length > 0)
        selectedLeads = availableLeads[0];
      selectedLeads = Number(selectedLeads);

      const key = getRangeKey(investmentRangeLabel, range, selectedPlan._id);
      let states = statesByInvestmentRangeRef.current[key];
      if (!states?.length) {
        const matchingKey = Object.keys(
          statesByInvestmentRangeRef.current,
        ).find((k) => {
          const parts = k.split("__");
          return (
            parts[parts.length - 1] === range &&
            parts[parts.length - 2] === investmentRangeLabel
          );
        });
        if (matchingKey)
          states = statesByInvestmentRangeRef.current[matchingKey];
      }
      if (!states?.length) {
        if (!finalToken && detectedState) states = [detectedState];
        else if (finalToken) states = allStates;
        else states = [];
      }
      if (states.length === 0) {
        openSnack("Please select at least one state", "warning");
        return;
      }

      const minLeads =
        availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
      const divisor = minLeads > 0 ? minLeads : 1;
      const newItem = {
        id,
        investmentRangeLabel,
        range,
        stateCount: states.length,
        states,
        selectedLeads,
        totalLeads: selectedLeads * states.length,
        totalAmount: (pricePerState / divisor) * states.length * selectedLeads,
      };
      const groupKey = `${selectedPlan._id}__${investmentRangeLabel}`;

      setPaymentSummary((prev) => {
        const existingGroup = prev.find((g) => g.groupKey === groupKey);
        let newSummary;
        if (existingGroup) {
          const existingItemIndex = existingGroup.items.findIndex(
            (ex) => ex.id === newItem.id,
          );
          const updatedItems =
            existingItemIndex !== -1
              ? existingGroup.items.map((it) => ({
                  ...it,
                  selectedLeads,
                  totalLeads: selectedLeads * it.stateCount,
                  totalAmount:
                    (pricePerState / divisor) * it.stateCount * selectedLeads,
                  ...(it.id === newItem.id
                    ? { states: newItem.states, stateCount: newItem.stateCount }
                    : {}),
                }))
              : [...existingGroup.items, newItem].map((it) => ({
                  ...it,
                  selectedLeads,
                  totalLeads: selectedLeads * it.stateCount,
                  totalAmount:
                    (pricePerState / divisor) * it.stateCount * selectedLeads,
                }));
          const uniqueStates = getUniqueStatesAcrossRanges(updatedItems);
          const totalUniqueStates = uniqueStates.length;
          newSummary = prev.map((g) =>
            g.groupKey === groupKey
              ? {
                  ...g,
                  items: updatedItems,
                  uniqueStates,
                  totalStates: totalUniqueStates,
                  amount:
                    (pricePerState / divisor) *
                    totalUniqueStates *
                    selectedLeads,
                  totalLeads: totalUniqueStates * selectedLeads,
                }
              : g,
          );
        } else {
          const uniqueStates = getUniqueStatesAcrossRanges([newItem]);
          const totalUniqueStates = uniqueStates.length;
          newSummary = [
            ...prev,
            {
              groupKey,
              planId: selectedPlan._id,
              packagesType: selectedPlan.packageType,
              planName: selectedPlan.planName,
              planUniqueId: selectedPlan.planUniqueId,
              planPackageId: selectedPkg._id,
              investmentRangeLabel,
              validityDays: selectedPkg?.validityDays,
              pricePerState,
              basicLeadCount: selectedPkg?.basicLeadCount,
              uniqueStates,
              totalStates: totalUniqueStates,
              amount:
                (pricePerState / divisor) * totalUniqueStates * selectedLeads,
              totalLeads: totalUniqueStates * selectedLeads,
              selectedLeads,
              items: [newItem],
            },
          ];
        }
        setMovedGroupKeys((prevKeys) =>
          prevKeys.includes(groupKey) ? prevKeys : [...prevKeys, groupKey],
        );
        openSnack(
          `Added ${range} with ${selectedLeads} leads to cart`,
          "success",
        );
        setTimeout(() => scrollToPaymentSummary(), 100);
        return newSummary;
      });

      setSelected((prev) => ({ ...prev, [id]: true }));
      setCheckedItems((prev) => ({ ...prev, [id]: true }));
    },
    [
      getRangeKey,
      finalToken,
      detectedState,
      allStates,
      getUniqueStatesAcrossRanges,
      openSnack,
      leadsDropdownData,
      selectedLeadsPerRange,
      scrollToPaymentSummary,
      statesByInvestmentRangeRef,
      setPaymentSummary,
      setMovedGroupKeys,
      setSelected,
      setCheckedItems,
    ],
  );

const handleRemoveSingleFromPayment = useCallback(
  (item) => {
    const { id } = item;
    setPaymentSummary((prev) => {
      const updated = prev
        .map((g) => {
          if (!g.items.some((it) => it.id === id)) return g;
          const updatedItems = g.items.filter((it) => it.id !== id);
          if (updatedItems.length === 0) {
            setMovedGroupKeys((keys) => keys.filter((k) => k !== g.groupKey));
            return null;
          }
          const newUniqueStates = getUniqueStatesAcrossRanges(updatedItems);
          const leadsDataKey = `${g.planId}_${g.investmentRangeLabel}`;
          const availableLeads = leadsDropdownData[leadsDataKey] || [];
          const minLeads =
            availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
          const divisor = minLeads > 0 ? minLeads : 1;
          const selectedLeads = updatedItems[0]?.selectedLeads || 0;
          return {
            ...g,
            items: updatedItems,
            uniqueStates: newUniqueStates,
            totalStates: newUniqueStates.length,
            amount:
              (g.pricePerState / divisor) *
              newUniqueStates.length *
              selectedLeads,
            totalLeads: newUniqueStates.length * selectedLeads,
          };
        })
        .filter(Boolean);
      if (updated.length === 0 && typeof window !== "undefined") {
        localStorage.removeItem("paymentSummaryDraft");
        localStorage.removeItem("movedGroupKeys");
      }
      return updated;
    });
    setCheckedItems((prev) => {
      const updatedChecked = { ...prev };
      delete updatedChecked[id];
      return updatedChecked;
    });
    openSnack("Investment range removed from payment", "info");
  },
  [
    getUniqueStatesAcrossRanges,
    openSnack,
    leadsDropdownData,
    setPaymentSummary,
    setMovedGroupKeys,
    setCheckedItems,
  ],
);

  const handleRemoveListingPlan = useCallback(
    (planId) => {
      const groupKey = `listing-${planId}`;
      setPaymentSummary((prev) => {
        const newSummary = prev.filter((g) => g.groupKey !== groupKey);
        if (newSummary.length === 0 && typeof window !== "undefined") {
          localStorage.removeItem("paymentSummaryDraft");
          localStorage.removeItem("movedGroupKeys");
        }
        return newSummary;
      });
      setMovedGroupKeys((prev) => prev.filter((key) => key !== groupKey));
      setSelected((prev) => {
        const copy = { ...prev };
        delete copy[groupKey];
        return copy;
      });
      openSnack("Listing plan removed from cart", "info");
    },
    [openSnack, setPaymentSummary, setMovedGroupKeys, setSelected],
  );

  // ── Leads dropdown ────────────────────────────────────────────────────────
  const handleLeadsChange = useCallback(
    (planGroupKey, newLeadsValue) => {
      setSelectedLeadsPerRange((prev) => ({
        ...prev,
        [planGroupKey]: newLeadsValue,
      }));
      const parts = planGroupKey.replace("plan-", "").split("-");
      const actualPlanId = parts[0];
      const specificRange = parts.slice(2).join("-");

      setPaymentSummary((prev) =>
        prev.map((group) => {
          if (group.isListingPlan || group.planId !== actualPlanId)
            return group;
          if (!group.items.some((item) => item.range === specificRange))
            return group;
          if (movedGroupKeys.includes(group.groupKey)) return group;
          const leadsDataKey = `${group.planId}_${group.investmentRangeLabel}`;
          const availableLeads = leadsDropdownData[leadsDataKey] || [];
          const minLeads =
            availableLeads.length > 0 ? Math.min(...availableLeads) : 1;
          const divisor = minLeads > 0 ? minLeads : 1;
          const updatedItems = group.items.map((item) =>
            item.range !== specificRange
              ? item
              : {
                  ...item,
                  selectedLeads: newLeadsValue,
                  totalLeads: newLeadsValue * item.stateCount,
                  totalAmount:
                    (group.pricePerState / divisor) *
                    item.stateCount *
                    newLeadsValue,
                },
          );
          const allStatesSet = new Set();
          updatedItems.forEach((item) => {
            (item.states || []).forEach((state) => allStatesSet.add(state));
          });
          const uniqueStates = Array.from(allStatesSet);
          const totalUniqueStates = uniqueStates.length;
          return {
            ...group,
            items: updatedItems,
            uniqueStates,
            totalStates: totalUniqueStates,
            amount:
              (group.pricePerState / divisor) *
              totalUniqueStates *
              newLeadsValue,
            totalLeads: newLeadsValue * totalUniqueStates,
          };
        }),
      );
      openSnack(`Leads updated to ${newLeadsValue}`, "info");
    },
    [
      leadsDropdownData,
      movedGroupKeys,
      openSnack,
      setSelectedLeadsPerRange,
      setPaymentSummary,
    ],
  );

  // ── Payment flow ──────────────────────────────────────────────────────────
  const transformPaymentToAPIFormat = useCallback((paymentGroups) => {
    const plansMap = new Map();
    paymentGroups.forEach((group) => {
      if (!plansMap.has(group.planId)) {
        plansMap.set(group.planId, {
          packagesType: group.packagesType,
          packagesName: group.planName,
          planUniqueId: group.planId,
          planPackageId: group.planPackageId,
          InvestmetPackages: [],
        });
      }
      const plan = plansMap.get(group.planId);
      group.items.forEach((item) => {
        plan.InvestmetPackages.push(
          item.isListingPlan
            ? {
                PackageName: item.investmentRangeLabel,
                Amount: group.pricePerState,
                Validity: group.validityDays,
                                basicLeadCount:group.basicLeadCount,

                TotalLeads: "-",
                States: item.states || ["ALL STATES"],
                InvestmentRange: item.range,
                InvestmentRangeLabel: item.investmentRangeLabel,
                LeadsPerState: "-",
              }
            : {
                PackageName: item.investmentRangeLabel,
                Amount: group.pricePerState,
                Validity: group.validityDays,
                basicLeadCount:group.basicLeadCount,
                TotalLeads: item.selectedLeads * (item.stateCount || 0),
                States: item.states || [],
                InvestmentRange: item.range,
                InvestmentRangeLabel: item.investmentRangeLabel,
                LeadsPerState: item.selectedLeads,
              },
        );
      });
    });
    return Array.from(plansMap.values());
  }, []);

  const handleProceedToPayment = useCallback(() => {
    const movedGroups = paymentSummary.filter((g) =>
      movedGroupKeys.includes(g.groupKey),
    );
    if (movedGroups.length === 0) {
      openSnack("Please move at least one plan to payment", "warning");
      return;
    }
    if (!finalToken) {
      localStorage.setItem("paymentSummaryDraft", JSON.stringify(movedGroups));
      openSnack("Please login to continue to payment", "warning");
      setShowLogin(true);
      return;
    }
    const packagesData = transformPaymentToAPIFormat(movedGroups);
    localStorage.setItem(
      "pendingPackages",
      JSON.stringify({
        packages: packagesData,
        timestamp: Date.now(),
        totalAmount: movedGroups.reduce((acc, g) => acc + (g.amount || 0), 0),
      }),
    );
    localStorage.setItem("paymentSummary", JSON.stringify(movedGroups));
    router.push("/payment");
  }, [
    finalToken,
    openSnack,
    paymentSummary,
    movedGroupKeys,
    router,
    transformPaymentToAPIFormat,
    setShowLogin,
  ]);

  const handleAddInvestmentRange = useCallback(
    (range, investmentRangeLabel) => {
      if (!finalToken) {
        setShowLogin(true);
        openSnack("Please log in to add investment ranges", "warning");
        return;
      }
      onAddInvestmentRange(range, investmentRangeLabel);
    },
    [onAddInvestmentRange, finalToken, openSnack, setShowLogin],
  );

  return {
    // snack
    openSnack,
    closeSnack,
    // section
    handleSectionChange,
    // scroll
    scrollToPaymentSummary,
    // tooltip
    handleShowStates,
    // state modal
    getAlreadySelectedStatesInOtherRanges,
    handleOpenStateModal,
    handleCloseStateModal,
    handleSaveStates,
    // checkbox controls
    handleSelectAll,
    handleClearAll,
    handleStateCheckboxChange,
    // cart
    handleAddSingleToPayment,
    handleRemoveSingleFromPayment,
    handleRemoveListingPlan,
    // leads
    handleLeadsChange,
    // payment
    handleProceedToPayment,
    handleAddInvestmentRange,
  };
};

export default usePackageActions;
