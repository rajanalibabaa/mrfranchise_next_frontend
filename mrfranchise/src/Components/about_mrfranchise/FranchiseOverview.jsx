"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// ✅ Above-the-fold (critical)
const AboutMrFranchise = dynamic(() => import("./aboutmrfranchise"), {
  loading: () => <p>Loading...</p>,
});

// ✅ Below-the-fold (non-critical)
const ExploreIndustry = dynamic(() => import("./exploreindustry"));
const ExploreInvestment = dynamic(() => import("./exploreinvestment"));
const ExploreLocation = dynamic(() => import("./explorelocation"));
const Featurebrand = dynamic(() => import("./Featurebrand"));
const FranchiseJourney = dynamic(() => import("./franchisejourney"));
const FreeFranchise = dynamic(() => import("./freefranchise"));

const FranchiseOverview = () => {
  const [loadRest, setLoadRest] = useState(false);

  useEffect(() => {
    let idleCallback;

    const loadComponents = () => setLoadRest(true);

    // ✅ Use requestIdleCallback if available
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleCallback = window.requestIdleCallback(loadComponents);
    } else {
      // ✅ Fallback for Safari / unsupported browsers
      idleCallback = setTimeout(loadComponents, 200);
    }

    return () => {
      if ("cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallback);
      } else {
        clearTimeout(idleCallback);
      }
    };
  }, []);

  return (
    <>
      {/* 🚀 Above-the-fold (loads immediately) */}
      <AboutMrFranchise />

      {/* 💤 Deferred content (loads when browser is idle) */}
      {loadRest && (
        <>
          <ExploreIndustry />
          <ExploreInvestment />
          <ExploreLocation />
          <Featurebrand />
          <FranchiseJourney />
          <FreeFranchise />
        </>
      )}
    </>
  );
};

export default FranchiseOverview;