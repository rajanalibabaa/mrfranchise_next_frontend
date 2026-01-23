"use client";

const validateBrandDetails = (data) => {
  const errors = {};
  
  // Helper function to check if a value is empty
  const isEmpty = (value) => !value || !value.toString().trim();
  
  // Personal Information
  if (isEmpty(data.fullName)) errors.fullName = "Full name is required";
  
  // Contact Information
  if (isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }
  
  if (isEmpty(data.mobileNumber)) {
    errors.mobileNumber = "Mobile number is required";
  } else if (!/^\+\d{8,15}$/.test(data.mobileNumber)) {
    errors.mobileNumber = "Invalid mobile number format";
  }
  
  if (isEmpty(data.whatsappNumber)) {
    errors.whatsappNumber = "WhatsApp number is required";
  } else if (!/^\+\d{8,15}$/.test(data.whatsappNumber)) {
    errors.whatsappNumber = "Invalid WhatsApp number format";
  }
  
  // Brand Information
  if (isEmpty(data.companyName)) errors.companyName = "Company name is required";
  if (isEmpty(data.brandName)) errors.brandName = "Brand name is required";
    if (isEmpty(data.tagLine)) errors.tagLine = "TagLine is required";
  
  // CEO Information
  if (isEmpty(data.ceoName)) errors.ceoName = "CEO name is required";
  
  if (isEmpty(data.ceoEmail)) {
    errors.ceoEmail = "CEO email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.ceoEmail)) {
    errors.ceoEmail = "Invalid CEO email format";
  }
  
  if (isEmpty(data.ceoMobile)) {
    errors.ceoMobile = "CEO mobile number is required";
  } else if (!/^\+\d{8,15}$/.test(data.ceoMobile)) {
    errors.ceoMobile = "Invalid CEO mobile number format";
  }
  
  // Office Information
  if (isEmpty(data.headOfficeAddress)) {
    errors.headOfficeAddress = "Head office address is required";
  }
  
    if (isEmpty(data.officeMobile)) {
    errors.officeMobile = " Office Mobile Number is required";
  }
  
  if (isEmpty(data.country)) errors.country = "Country is required";
  if (isEmpty(data.pincode)) {
    errors.pincode = data.country === "India" ? "Pincode is required" : "Postal code is required";
  } else if (data.country === "India" && !/^\d{6}$/.test(data.pincode)) {
    errors.pincode = "Pincode must be 6 digits";
  }
  
  if (isEmpty(data.state)) errors.state = "State is required";
  if (isEmpty(data.city)) errors.city = "City is required";
  if (isEmpty(data.district)) errors.district = "District is required";
  
  
  // Website validation if provided
  // if ( isEmpty(data.website)) {
  //   if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(data.website)) {
  //     errors.website = "Invalid website URL";
  //   }
  // }
  
  return errors;
};

// Validation for Franchise Details
const validateFranchiseDetails = (data) => {
  // console.log("Validating Franchise Details:", data);
  const errors = {};

//   // Brand Categories Validation
  if (!data.brandCategories?.main) {
    errors.mainCategory = "Industry is required";
  }
  if (!data.brandCategories?.sub) {
    errors.subCategory = "Main category is required";
  }
 // Correct childCategory validation
  if (
    !data.brandCategories?.child ||
    data.brandCategories.child.length === 0
  ) {
    errors.childCategory = "Please select at least one product tag from any category.";
  }



  // Convert all arrays to one combined list of counts
  const totalSelected = Object.values(data.franchiseTags)
    .map((arr) => arr.length)
    .reduce((a, b) => a + b, 0);

  // If all 8 arrays empty → throw error
  if (totalSelected === 0) {
    errors.franchiseTags =
      "Please select at least one service tag from any category.";
  }


  // Establishment & Franchise Year Validation
  if (!data.establishedYear) {
    errors.establishedYear = "Year commenced operations is required";
  } else if (isNaN(data.establishedYear) ) {
    errors.establishedYear = "Must be a valid year";
  } else if (data.establishedYear > new Date().getFullYear()) {
    errors.establishedYear = "Cannot be in the future";
  }

  if (!data.franchiseSinceYear) {
    errors.franchiseSinceYear = "Year commenced franchising is required";
  } else if (isNaN(data.franchiseSinceYear)) {
    errors.franchiseSinceYear = "Must be a valid year";
  } else if (data.franchiseSinceYear > new Date().getFullYear()) {
    errors.franchiseSinceYear = "Cannot be in the future";
  } else if (data.establishedYear && data.franchiseSinceYear < data.establishedYear) {
    errors.franchiseSinceYear = "Cannot be before establishment year";
  }

  // Franchise Network Validation
  if (!data.companyOwnedOutlets) {
    errors.companyOwnedOutlets = "Company owned outlets is required";
  } else if (isNaN(data.companyOwnedOutlets) || data.companyOwnedOutlets < 0) {
    errors.companyOwnedOutlets = "Must be a valid number";
  }

  if (!data.franchiseOutlets) {
    errors.franchiseOutlets = "Franchise outlets is required";
  } else if (isNaN(data.franchiseOutlets) || data.franchiseOutlets < 0) {
    errors.franchiseOutlets = "Must be a valid number";
  }

  // FICO Models Validation
  if (!data.fico || data.fico.length === 0) {
    errors.fico = "At least one franchise model is required";
  } else {
    data.fico.forEach((model, index) => {
      if (!model.investmentRange) {
        errors[`fico[${index}].investmentRange`] = "Investment range is required";
      }
      if (!model.areaRequired) {
        errors[`fico[${index}].areaRequired`] = "Area required is required";
      }
      if (!model.franchiseModel) {
        errors[`fico[${index}].franchiseModel`] = "Franchise model is required";
      }
      if (!model.franchiseType) {
        errors[`fico[${index}].franchiseType`] = "Franchise type is required";
      }
      if (!model.franchiseFee) {
        errors[`fico[${index}].franchiseFee`] = "Franchise fee is required";
      } 
      if (!model.royaltyFee) {
        errors[`fico[${index}].royaltyFee`] = "Royalty fee is required";
      }
      if (!model.interiorCost && model.interiorCost !== 0) {
        errors[`fico[${index}].interiorCost`] = "Interior cost is required";
      } 
      if (!model.stockInvestment) {
        errors[`fico[${index}].stockInvestment`] = "Stock investment is required";
      }
      if (!model.otherCost) {
        errors[`fico[${index}].otherCost`] = "Other cost is required";
      } 
      if (!model.requireWorkingCapital) {
        errors[`fico[${index}].requireWorkingCapital`] = "Working capital is required";
      } 

      if (!model.roi && model.roi !== 0) {
        errors[`fico[${index}].roi`] = "ROI is required";
      } else if (model.roi && isNaN(model.roi)) {
        errors[`fico[${index}].roi`] = "ROI must be a valid number";
      } else if (model.roi && Number(model.roi) < 0) {
        errors[`fico[${index}].roi`] = "ROI cannot be negative";
      }
      if (!model.breakEven) {
        errors[`fico[${index}].breakEven`] = "Break even period is required";
      }
      if (!model.payBackPeriod) {
        errors[`fico[${index}].payBackPeriod`] = "Payback period is required";
      }
      if (!model.marginOnSales && model.marginOnSales !== 0) {
        errors[`fico[${index}].marginOnSales`] = "Margin on sales is required";
      } else if (model.marginOnSales && isNaN(model.marginOnSales)) {
        errors[`fico[${index}].marginOnSales`] = "Margin on sales must be a valid number";
      } else if (model.marginOnSales && Number(model.marginOnSales) < 0) {
        errors[`fico[${index}].marginOnSales`] = "Margin on sales cannot be negative";
      }
      if (!model.agreementPeriod) {
        errors[`fico[${index}].agreementPeriod`] = "Agreement period is required";
      }
    });
  }

  // Support and Training Validation
  if (!data.aidFinancing) {
    errors.aidFinancing = "Please specify if you provide aid in financing";
  }
  if (!data.franchiseDevelopment) {
    errors.franchiseDevelopment = "Please specify franchise development consultation";
  }
  if (!data.consultationOrAssistance) {
    errors.consultationOrAssistance = "Please specify marketing recruitment consultation";
  }
if (!data.trainingSupport || data.trainingSupport.length === 0) {
  errors.trainingSupport = "At least one training support option is required";
}
//  Brand Description Validation
  if (!data.uniqueSellingPoints || data.uniqueSellingPoints.length === 0) {
    errors.uniqueSellingPoints = "At least one unique selling point is required";
  } else if (data.uniqueSellingPoints.length < 2) {
    errors.uniqueSellingPoints = "Please add at least 2 unique selling points";
  } else if (data.uniqueSellingPoints.length > 5) {
    errors.uniqueSellingPoints = "Maximum 5 unique selling points allowed";
  } else {
    // Validate each USP
    data.uniqueSellingPoints.forEach((usp, index) => {
      if (!usp.trim()) {
        errors[`uniqueSellingPoints[${index}]`] = "USP cannot be empty";
      } else if (usp.length < 10) {
        errors[`uniqueSellingPoints[${index}]`] = "USP is too short (min 10 chars)";
      } else if (usp.length > 100) {
        errors[`uniqueSellingPoints[${index}]`] = "USP is too long (max 100 chars)";
      }
    });
  }

  
  // Brand Description Rich Text Validation
  if (!data.brandDescription) {
    errors.brandDescription = "Brand description is required";
  } else {
    // Strip HTML tags and validate text content
    const textContent = data.brandDescription.replace(/<[^>]*>/g, '').trim();
    if (textContent.length < 500) {
      errors.brandDescription = "Description must be at least 500 characters";
    } else if (textContent.length > 1000) {
      errors.brandDescription = "Description is too long (max 1500 characters)";
    }
  }

  return errors;
};

const validateExpansionLocationDetails = (data) => {
  // console.log("Validating Expansion Location Details:", data);
  const errors = {};  
  
  // 1. Validate "Is your brand expanding internationally?" (required boolean)
  if (data?.isInternationalExpansion === null || data?.isInternationalExpansion === undefined) {
    errors.isInternationalExpansion = "Please specify if your brand is expanding internationally";
  }

  // 2. Validate current outlet locations (must have either domestic or international)
  const hasCurrentDomestic = 
    data?.currentOutletLocations?.domestic?.locations?.length > 0;
  const hasCurrentInternational = 
    data?.currentOutletLocations?.international?.locations?.length > 0;
  
  if (!hasCurrentDomestic && !hasCurrentInternational) {
    errors.currentOutletLocations = "Please select at least one location (India or International) also   State and City for current outlets ";
  }

  // 3. Validate expansion locations (must have either domestic or international)
  const hasExpansionDomestic = 
    data?.expansionLocations?.domestic?.locations?.length > 0;
  const hasExpansionInternational = 
    data?.expansionLocations?.international?.locations?.length > 0;
  
  if (!hasExpansionDomestic && !hasExpansionInternational) {
    errors.expansionLocations = "Please select at least one location (India or International) also State and City for expansion Locations";
  }

  return errors

}

export { validateBrandDetails, validateFranchiseDetails ,validateExpansionLocationDetails};


