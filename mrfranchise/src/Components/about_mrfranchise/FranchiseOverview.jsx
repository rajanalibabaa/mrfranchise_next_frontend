"use client";

import dynamic from "next/dynamic";

const AboutMrFranchise = dynamic(() => import("./aboutmrfranchise"));
const ExploreIndustry = dynamic(() => import("./exploreindustry"));
const ExploreInvestment = dynamic(() => import("./exploreinvestment"));
const ExploreLocation = dynamic(() => import("./explorelocation"));
const Featurebrand = dynamic(() => import("./Featurebrand"));
const FreeFranchise = dynamic(() => import("./freefranchise"));
const FranchiseJourney = dynamic(() => import("./franchisejourney"));

const FranchiseOverview = () => {
  return (
    <>
      <AboutMrFranchise />
      <ExploreIndustry />
      <ExploreInvestment />
      <ExploreLocation />
      <Featurebrand />
      
      <FranchiseJourney />
      <FreeFranchise />
    </>
  );
};

export default FranchiseOverview;