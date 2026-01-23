" use client";
import Leads from "./Leads/Leads";


const TabContent = ({ tabValue, brandData,}) => {

 
  switch (tabValue) {
    case 0:
      return <Leads brandData={brandData}/>;
    default:
      return null;
  }
};

export default TabContent;