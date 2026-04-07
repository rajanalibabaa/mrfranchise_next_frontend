import React from 'react';
import AboutMrFranchise from './aboutmrfranchise';
import ExploreIndustry from './exploreindustry';
import ExploreInvestment from './exploreinvestment';
import ExploreLocation from './explorelocation';
import Featurebrand from './Featurebrand';
import FreeFranchise from './freefranchise';
import FranchiseJourney from './franchisejourney';
import BusinessOpportunities from './businessopportunities';

const FranchiseOverview = () => {
  return (
    <>
      <BusinessOpportunities/>
      <AboutMrFranchise />
      <ExploreIndustry />
      <ExploreInvestment/>
      <ExploreLocation/>
      <Featurebrand/>
      <FreeFranchise/>
      <FranchiseJourney/>
    
    
    </>
  );
};

export default FranchiseOverview;
