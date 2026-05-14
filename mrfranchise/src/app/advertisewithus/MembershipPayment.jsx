// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Checkbox,
//   CircularProgress,
//   Alert,
//   Select,
//   MenuItem,
//   FormControl,
//   Chip
// } from '@mui/material';

// const safeArray = (value) => {
//   if (!value) return [];
//   return Array.isArray(value) ? value : [value];
// };

// const normalizeText = (value) => {
//   return String(value || '')
//     .toLowerCase()
//     .replace(/₹/g, '')
//     .replace(/,/g, '')
//     .replace(/rs\.?/g, '')
//     .replace(/inr/g, '')
//     .replace(/[–—]/g, '-')
//     .replace(/\bto\b/g, '-')
//     .replace(/lakhs|lacs|lac/g, 'lakh')
//     .replace(/crores/g, 'crore')
//     .replace(/\s+/g, '')
//     .trim();
// };

// const valueToText = (value) => {
//   if (!value) return '';

//   if (typeof value === 'string' || typeof value === 'number') {
//     return String(value);
//   }

//   if (typeof value === 'object') {
//     if (value.min != null && value.max != null) {
//       return `${value.min}-${value.max}`;
//     }

//     if (value.minimum != null && value.maximum != null) {
//       return `${value.minimum}-${value.maximum}`;
//     }

//     if (value.minInvestment != null && value.maxInvestment != null) {
//       return `${value.minInvestment}-${value.maxInvestment}`;
//     }

//     return (
//       value.investmentRange ||
//       value.investment_range ||
//       value.investmentRangeLabel ||
//       value.planName ||
//       value.name ||
//       value.title ||
//       value.label ||
//       value.value ||
//       value._id ||
//       ''
//     );
//   }

//   return '';
// };

// const getBrandFicoItems = (data) => {
//   if (!data) return [];

//   return safeArray(
//     data?.franchiseDetails?.fico ||
//       data?.brandfranchisedetails?.franchiseDetails?.fico ||
//       data?.brandfranchisedetails?.fico ||
//       data?.franchiseDetails?.brandfranchisedetails?.fico ||
//       []
//   );
// };

// const getBusinessModelItems = (data) => {
//   if (!data) return [];

//   const businessModels = safeArray(
//     data?.businessModel ||
//       data?.businessModels ||
//       data?.business_model ||
//       data?.franchiseDetails?.businessModel ||
//       data?.franchiseDetails?.businessModels ||
//       data?.brandDetails?.businessModel ||
//       data?.brandDetails?.businessModels ||
//       []
//   );

//   const ficoItems = getBrandFicoItems(data);

//   return [...businessModels, ...ficoItems].filter(Boolean);
// };

// const getInvestmentRangesFromBusinessModel = (businessModel) => {
//   const investmentValue =
//     businessModel?.investmentRange ||
//     businessModel?.investmentRanges ||
//     businessModel?.investment_range ||
//     businessModel?.investmentRangeLabel ||
//     businessModel?.range ||
//     businessModel?.investment;

//   if (!investmentValue) return [];

//   if (Array.isArray(investmentValue)) {
//     return investmentValue.map((item) => valueToText(item)).filter(Boolean);
//   }

//   return [valueToText(investmentValue)].filter(Boolean);
// };

// const findBusinessModelByInvestmentRange = ({
//   businessModels,
//   range,
//   investmentRangeLabel
// }) => {
//   const currentRange = normalizeText(range);
//   const currentLabel = normalizeText(investmentRangeLabel);

//   return businessModels.find((businessModel) => {
//     const modelRanges = getInvestmentRangesFromBusinessModel(businessModel);

//     return modelRanges.some((modelRange) => {
//       const normalizedModelRange = normalizeText(modelRange);

//       return (
//         normalizedModelRange === currentRange ||
//         normalizedModelRange === currentLabel ||
//         currentRange.includes(normalizedModelRange) ||
//         normalizedModelRange.includes(currentRange) ||
//         currentLabel.includes(normalizedModelRange) ||
//         normalizedModelRange.includes(currentLabel)
//       );
//     });
//   });
// };

// const getRecommendedPlanName = (businessModel) => {
//   if (!businessModel) return '';

//   const recommendedPlan =
//     businessModel.recommendedPlan ||
//     businessModel.recommended_plan ||
//     businessModel.recommendedPlanName ||
//     businessModel.recommendedPackage ||
//     businessModel.recommended_package ||
//     businessModel.plan ||
//     businessModel.planName ||
//     businessModel.category;

//   return valueToText(recommendedPlan) || 'Recommended';
// };

// const getBrandExpansionData = (data) => {
//   if (!data) return null;

//   if (data.expansionLocations) return data.expansionLocations;

//   if (data.expansionlocationdata?.expansionLocations) {
//     return data.expansionlocationdata.expansionLocations;
//   }

//   if (data.brandexpansionlocationdatas?.expansionLocations) {
//     return data.brandexpansionlocationdatas.expansionLocations;
//   }

//   if (data.expansionlocationdata) return data.expansionlocationdata;

//   if (data.brandexpansionlocationdatas) {
//     return data.brandexpansionlocationdatas;
//   }

//   return null;
// };

// const getLocationCount = (locationValue) => {
//   if (!locationValue) return 0;

//   if (typeof locationValue === 'number') {
//     return locationValue;
//   }

//   if (typeof locationValue === 'string') {
//     return locationValue
//       .split(',')
//       .map((item) => item.trim())
//       .filter(Boolean).length;
//   }

//   if (Array.isArray(locationValue)) {
//     const states = locationValue
//       .map((item) => {
//         if (typeof item === 'string') return item;

//         return (
//           item?.state ||
//           item?.stateName ||
//           item?.stateCode ||
//           item?.name ||
//           item?.location ||
//           item?.label ||
//           ''
//         );
//       })
//       .filter(Boolean);

//     if (states.length) {
//       return new Set(states.map((state) => normalizeText(state))).size;
//     }

//     return locationValue.length;
//   }

//   if (typeof locationValue === 'object') {
//     const nestedLocation =
//       locationValue.locations ||
//       locationValue.states ||
//       locationValue.state ||
//       locationValue.domestic?.locations ||
//       locationValue.domestic ||
//       locationValue.expansionLocation ||
//       locationValue.expansionLocations;

//     if (nestedLocation && nestedLocation !== locationValue) {
//       return getLocationCount(nestedLocation);
//     }

//     return Object.keys(locationValue).length;
//   }

//   return 0;
// };

// const getExpansionLocationCount = (brandData, businessModel) => {
//   const businessModelLocations =
//     businessModel?.expansionLocation ||
//     businessModel?.expansionLocations ||
//     businessModel?.expansion_location ||
//     businessModel?.locations ||
//     businessModel?.states;

//   if (businessModelLocations) {
//     return getLocationCount(businessModelLocations);
//   }

//   const expansionData = getBrandExpansionData(brandData);

//   if (expansionData?.domestic?.locations) {
//     return getLocationCount(expansionData.domestic.locations);
//   }

//   if (expansionData?.domestic) {
//     return getLocationCount(expansionData.domestic);
//   }

//   const directLocations =
//     brandData?.expansionLocation ||
//     brandData?.expansionLocations ||
//     brandData?.expansion_location ||
//     brandData?.locations ||
//     brandData?.states;

//   return getLocationCount(directLocations);
// };

// const PackageSelection = ({ uuid: propUuid }) => {
//   const [plans, setPlans] = useState([]);
//   const [brandDetails, setBrandDetails] = useState(null);

//   const [plansLoading, setPlansLoading] = useState(true);
//   const [brandLoading, setBrandLoading] = useState(true);

//   const [plansError, setPlansError] = useState('');
//   const [brandError, setBrandError] = useState('');

//   const [selected, setSelected] = useState({});
//   const [selectedPlans, setSelectedPlans] = useState({});

//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         setPlansLoading(true);
//         setPlansError('');

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/plans/getAllPlans`
//         );

//         const json = await res.json();

//         if (!json.success || !Array.isArray(json.data)) {
//           throw new Error('Failed to fetch plans');
//         }

//         setPlans(json.data);

//         const launchPadPlan =
//           json.data.find((plan) => {
//             const name = plan.planName?.trim().toLowerCase();
//             return name === 'launch pad program' || name?.includes('launch pad');
//           }) || json.data[0];

//         if (launchPadPlan) {
//           const investmentRangeLabels = new Set();

//           json.data.forEach((plan) => {
//             plan.packages?.forEach((pkg) => {
//               if (pkg.investmentRangeLabel) {
//                 investmentRangeLabels.add(pkg.investmentRangeLabel);
//               }
//             });
//           });

//           const defaultPlans = {};

//           investmentRangeLabels.forEach((label) => {
//             defaultPlans[label] = launchPadPlan._id;
//           });

//           setSelectedPlans(defaultPlans);
//         }
//       } catch (err) {
//         setPlansError(err.message || 'Error connecting to plans API');
//       } finally {
//         setPlansLoading(false);
//       }
//     };

//     fetchPlans();
//   }, []);

//   useEffect(() => {
//     if (typeof window === 'undefined') return;

//     const fetchBrandData = async () => {
//       try {
//         setBrandLoading(true);
//         setBrandError('');

//         const uuid =
//           propUuid ||
//           localStorage.getItem('brandUUID') ||
//           localStorage.getItem('brandUuid') ||
//           localStorage.getItem('brandId') ||
//           localStorage.getItem('uuid') ||
//           sessionStorage.getItem('uuid') ||
//           sessionStorage.getItem('brandId') ||
//           sessionStorage.getItem('brandUUID') ||
//           sessionStorage.getItem('brandUuid');

//         console.log('Brand UUID:', uuid);

//         if (!uuid) {
//           setBrandError('Brand UUID not found. Please login again.');
//           return;
//         }

//           const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/brandlisting/getBrandById/${uuid}`;

//         console.log('Brand API URL:', url);

//         const res = await fetch(url);
//         const json = await res.json();

//         if (json.success && json.data) {
//           const data = Array.isArray(json.data) ? json.data[0] : json.data;
//           setBrandDetails(data);
//         } else {
//           setBrandError(json.message || 'Failed to fetch brand data.');
//         }
//       } catch (err) {
//         console.error('Error fetching brand data:', err);
//         setBrandError('Error connecting to brand API.');
//       } finally {
//         setBrandLoading(false);
//       }
//     };

//     fetchBrandData();
//   }, [propUuid]);

//   const businessModels = useMemo(() => {
//     return getBusinessModelItems(brandDetails);
//   }, [brandDetails]);

//   const uniquePackages = useMemo(() => {
//     const uniqueMap = new Map();

//     plans.forEach((plan) => {
//       plan.packages?.forEach((pkg, pIndex) => {
//         pkg.investmentRange?.forEach((range, rIndex) => {
//           const key = `${normalizeText(pkg.investmentRangeLabel)}-${normalizeText(
//             range
//           )}`;

//           if (!uniqueMap.has(key)) {
//             uniqueMap.set(key, {
//               id: `${plan._id}-${pIndex}-${rIndex}`,
//               investmentRangeLabel: pkg.investmentRangeLabel,
//               range,
//               defaultPlan: plan,
//               pkg,
//               allPlans: plans
//             });
//           }
//         });
//       });
//     });

//     return Array.from(uniqueMap.values());
//   }, [plans]);

//   const rowSpanMap = useMemo(() => {
//     const map = {};

//     uniquePackages.forEach((item) => {
//       map[item.investmentRangeLabel] =
//         (map[item.investmentRangeLabel] || 0) + 1;
//     });

//     return map;
//   }, [uniquePackages]);

//   const handleCheckboxChange = (id) => {
//     setSelected((prev) => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };

//   const handlePlanChange = (investmentRangeLabel, planId) => {
//     setSelectedPlans((prev) => ({
//       ...prev,
//       [investmentRangeLabel]: planId
//     }));
//   };

//   const getSelectedPlanData = (investmentRangeLabel, defaultPlan) => {
//     const selectedPlanId = selectedPlans[investmentRangeLabel];

//     if (!selectedPlanId) return defaultPlan;

//     return plans.find((plan) => plan._id === selectedPlanId) || defaultPlan;
//   };

//   if (plansLoading || brandLoading) {
//     return (
//       <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (plansError) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error">{plansError}</Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {brandError && (
//         <Alert severity="warning" sx={{ mb: 2 }}>
//           {brandError}
//         </Alert>
//       )}

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead sx={{ backgroundColor: '#fff8e1' }}>
//             <TableRow>
//               <TableCell>Select</TableCell>
//               <TableCell>Investment Range</TableCell>
//               <TableCell>Recommended</TableCell>
//               <TableCell>No.Of States</TableCell>
//               <TableCell>Plan</TableCell>
//               <TableCell>Tenure</TableCell>
//               <TableCell>Price</TableCell>
//               <TableCell>Lead Count</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {uniquePackages.map((item, index) => {
//               const {
//                 id,
//                 investmentRangeLabel,
//                 range,
//                 defaultPlan,
//                 pkg,
//                 allPlans
//               } = item;

//               const selectedPlan = getSelectedPlanData(
//                 investmentRangeLabel,
//                 defaultPlan
//               );

//               const selectedPkg =
//                 selectedPlan.packages?.find(
//                   (p) =>
//                     normalizeText(p.investmentRangeLabel) ===
//                     normalizeText(investmentRangeLabel)
//                 ) ||
//                 selectedPlan.packages?.find((p) =>
//                   p.investmentRange?.some(
//                     (r) => normalizeText(r) === normalizeText(range)
//                   )
//                 ) ||
//                 pkg;

//               const isFirstInGroup =
//                 index === 0 ||
//                 uniquePackages[index - 1].investmentRangeLabel !==
//                   investmentRangeLabel;

//               const rowSpan = rowSpanMap[investmentRangeLabel] || 1;

//               const matchedBusinessModel = findBusinessModelByInvestmentRange({
//                 businessModels,
//                 range,
//                 investmentRangeLabel
//               });

//               const recommendedPlanName =
//                 getRecommendedPlanName(matchedBusinessModel);

//               const noOfStates = getExpansionLocationCount(
//                 brandDetails,
//                 matchedBusinessModel
//               );

//               return (
//                 <React.Fragment key={id}>
//                   {isFirstInGroup && (
//                     <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                       <TableCell
//                         colSpan={8}
//                         sx={{ fontWeight: 'bold', fontSize: '1rem' }}
//                       >
//                         {investmentRangeLabel}
//                       </TableCell>
//                     </TableRow>
//                   )}

//                   <TableRow hover>
//                     <TableCell padding="checkbox">
//                       <Checkbox
//                         checked={!!selected[id]}
//                         onChange={() => handleCheckboxChange(id)}
//                       />
//                     </TableCell>

//                     <TableCell>{range}</TableCell>

//                     <TableCell>
//                       {matchedBusinessModel ? (
//                         <Chip
//                           label={recommendedPlanName}
//                           color="success"
//                           size="small"
//                           variant="outlined"
//                         />
//                       ) : (
//                         <Chip
//                           label="Add Business Model"
//                           color="warning"
//                           size="small"
//                           variant="outlined"
//                         />
//                       )}
//                     </TableCell>

//                     <TableCell>
//                       {noOfStates} State{noOfStates !== 1 ? 's' : ''}
//                     </TableCell>

//                     {isFirstInGroup && (
//                       <TableCell
//                         rowSpan={rowSpan}
//                         sx={{ verticalAlign: 'middle' }}
//                       >
//                         <FormControl size="small" fullWidth>
//                           <Select
//                             value={
//                               selectedPlans[investmentRangeLabel] ||
//                               defaultPlan._id
//                             }
//                             onChange={(e) =>
//                               handlePlanChange(
//                                 investmentRangeLabel,
//                                 e.target.value
//                               )
//                             }
//                             sx={{ minWidth: 170 }}
//                           >
//                             {allPlans.map((plan) => (
//                               <MenuItem key={plan._id} value={plan._id}>
//                                 {plan.planName}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         </FormControl>
//                       </TableCell>
//                     )}

//                     {isFirstInGroup && (
//                       <TableCell
//                         rowSpan={rowSpan}
//                         sx={{ verticalAlign: 'middle' }}
//                       >
//                         {selectedPkg?.validityDays != null
//                           ? `${selectedPkg.validityDays} Days`
//                           : '—'}
//                       </TableCell>
//                     )}

//                     {isFirstInGroup && (
//                       <TableCell
//                         rowSpan={rowSpan}
//                         sx={{ verticalAlign: 'middle' }}
//                       >
//                         {selectedPkg?.amount != null
//                           ? `₹${Number(selectedPkg.amount).toLocaleString(
//                               'en-IN'
//                             )}`
//                           : '—'}
//                       </TableCell>
//                     )}

//                     {isFirstInGroup && (
//                       <TableCell
//                         rowSpan={rowSpan}
//                         sx={{ verticalAlign: 'middle' }}
//                       >
//                         {selectedPkg?.totalLeads ?? '—'}
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 </React.Fragment>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default PackageSelection;