// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   Box,
//   Typography,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Button,
//   Divider,
//   Chip,
//   Checkbox,
//   TextField,
//   Backdrop,
//   CircularProgress,
//   Drawer,
//   Alert,
//   Snackbar,
//   FormHelperText,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";
// import { ChevronDown, Search } from "lucide-react";
// import { useSnackbar } from "notistack";
// import debounce from "lodash/debounce";
// import axios from "axios";

// // Cache for API responses
// const apiCache = {
//   domestic: null,
//   countries: null,
//   states: {},
//   cities: {},
// };

// const BrandExpansionLocationDetails = ({ data, onChange, errors }) => {
//   const { enqueueSnackbar } = useSnackbar();

//   // Location type state
//   const [locationType, setLocationType] = useState("domestic");
//   const [currentOutletLocationType, setCurrentOutletLocationType] =
//     useState("domestic");

//   // Domestic selections for expansion locations
//   const [domesticSelections, setDomesticSelections] = useState({
//     selectedStates: [],
//     selectedDistricts: [],
//     selectedCities: [],
//   });

//   // International selections for expansion locations
//   const [internationalSelections, setInternationalSelections] = useState({
//     selectedCountries: [],
//     selectedStates: {},
//     selectedCities: {},
//   });

//   // Current outlet selections
//   const [currentDomesticSelections, setCurrentDomesticSelections] = useState({
//     selectedStates: [],
//     selectedDistricts: [],
//     selectedCities: [],
//   });

//   const [currentInternationalSelections, setCurrentInternationalSelections] =
//     useState({
//       selectedCountries: [],
//       selectedStates: {},
//       selectedCities: {},
//     });

//   // Location data
//   const [statesData, setStatesData] = useState([]);
//   const [states, setStates] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [internationalStates, setInternationalStates] = useState({});
//   const [internationalCities, setInternationalCities] = useState({});
//   const [currentInternationalStates, setCurrentInternationalStates] = useState(
//     {}
//   );
//   const [currentInternationalCities, setCurrentInternationalCities] = useState(
//     {}
//   );

//   const [loading, setLoading] = useState({
//     states: false,
//     countries: false,
//     formSubmit: false,
//   });

//   const [error, setError] = useState(null);

//   // Drawer states
//   const [drawerOpen, setDrawerOpen] = useState({
//     states: false,
//     districts: false,
//     cities: false,
//     countries: false,
//     intStates: false,
//     intCities: false,
//   });

//   // Collapse states for current locations
//   const [currentDrawerOpen, setCurrentDrawerOpen] = useState({
//     states: false,
//     districts: false,
//     cities: false,
//     countries: false,
//     intStates: false,
//     intCities: false,
//   });

//   // Search filters
//   const [searchFilters, setSearchFilters] = useState({
//     states: "",
//     districts: "",
//     cities: "",
//     countries: "",
//     intStates: "",
//     intCities: "",
//   });

//   // Debounced search functions
//   const handleSearchChange = useCallback(
//     debounce((type, value) => {
//       setSearchFilters((prev) => ({ ...prev, [type]: value.toLowerCase() }));
//     }, 300),
//     []
//   );

//   // Toggle drawer
//   const toggleDrawer = useCallback((type, open) => {
//     if (type === "current") {
//       setCurrentDrawerOpen((prev) => ({ ...prev, ...open }));
//     } else {
//       setDrawerOpen((prev) => ({ ...prev, ...open }));
//     }
//   }, []);

//   // Memoized sorted and filtered states
//   const sortedStates = useMemo(() => {
//     return states
//       .filter((state) =>
//         state.name.toLowerCase().includes(searchFilters.states)
//       )
//       .sort((a, b) => a.name.localeCompare(b.name));
//   }, [states, searchFilters.states]);

//   // Memoized sorted and filtered countries
//   const sortedCountries = useMemo(() => {
//     return countries
//       .filter((country) =>
//         country.name.toLowerCase().includes(searchFilters.countries)
//       )
//       .sort((a, b) => a.name.localeCompare(b.name));
//   }, [countries, searchFilters.countries]);

//   // Fetch domestic data (Indian states, districts, cities) with caching
//   const fetchDomesticData = useCallback(async () => {
//     if (apiCache.domestic) {
//       setStatesData(apiCache.domestic);
//       setStates(
//         apiCache.domestic.map((state) => ({ id: state.iso2, name: state.name }))
//       );
//       return;
//     }

//     setLoading((prev) => ({ ...prev, states: true }));
//     try {
//       const response = await axios.get(
//         "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
//       );
//       apiCache.domestic = response.data;
//       setStatesData(response.data);
//       setStates(
//         response.data.map((state) => ({ id: state.iso2, name: state.name }))
//       );
//     } catch (error) {
//       console.error("Error fetching domestic data:", error);
//       setError("Failed to load domestic locations. Please try again later.");
//       enqueueSnackbar("Failed to load domestic locations", {
//         variant: "error",
//       });
//     } finally {
//       setLoading((prev) => ({ ...prev, states: false }));
//     }
//   }, [enqueueSnackbar]);

//   // Fetch international countries with caching
//   const fetchCountries = useCallback(async () => {
//     if (apiCache.countries) {
//       setCountries(apiCache.countries);
//       return;
//     }

//     setLoading((prev) => ({ ...prev, countries: true }));
//     try {
//       const response = await axios.get(
//         "https://countriesnow.space/api/v0.1/countries"
//       );
//       const countryData = response.data.data.map((country) => ({
//         id: country.iso2,
//         name: country.country,
//       }));

//       apiCache.countries = countryData;
//       setCountries(countryData);
//     } catch (error) {
//       console.error("Error fetching countries:", error);
//       setError("Failed to load countries. Please try again later.");
//       enqueueSnackbar("Failed to load countries", { variant: "error" });
//     } finally {
//       setLoading((prev) => ({ ...prev, countries: false }));
//     }
//   }, [enqueueSnackbar]);

//   // Define updateFormData first
//   const updateFormData = useCallback(
//     (type, locationType, selections) => {
//       const locationKey =
//         type === "current" ? "currentOutletLocations" : "expansionLocations";

//       if (locationType === "domestic") {
//         const newLocations = [];

//         // Process states
//         selections.selectedStates.forEach((stateName) => {
//           const existingStateIndex = newLocations.findIndex(
//             (loc) => loc.state === stateName
//           );

//           if (existingStateIndex === -1) {
//             newLocations.push({
//               state: stateName,
//               districts: [],
//             });
//           }
//         });

//         // Process districts
//         selections.selectedDistricts.forEach(({ state, district }) => {
//           const stateIndex = newLocations.findIndex(
//             (loc) => loc.state === state
//           );

//           if (stateIndex !== -1) {
//             const districtExists = newLocations[stateIndex].districts.some(
//               (d) => d.district === district
//             );

//             if (!districtExists) {
//               newLocations[stateIndex].districts.push({
//                 district,
//                 cities: [],
//               });
//             }
//           }
//         });

//         // Process cities
//         selections.selectedCities.forEach(({ state, district, city }) => {
//           const stateIndex = newLocations.findIndex(
//             (loc) => loc.state === state
//           );

//           if (stateIndex !== -1) {
//             const districtIndex = newLocations[stateIndex].districts.findIndex(
//               (d) => d.district === district
//             );

//             if (districtIndex === -1) {
//               newLocations[stateIndex].districts.push({
//                 district,
//                 cities: [city],
//               });
//             } else {
//               if (
//                 !newLocations[stateIndex].districts[
//                   districtIndex
//                 ].cities.includes(city)
//               ) {
//                 newLocations[stateIndex].districts[districtIndex].cities.push(
//                   city
//                 );
//               }
//             }
//           }
//         });

//         const updatedData = {
//           ...data,
//           [locationKey]: {
//             ...data[locationKey],
//             domestic: {
//               locations: newLocations,
//             },
//           },
//         };

//         onChange(updatedData);
//       } else {
//         // International locations
//         const newLocations = [];

//         // Process countries
//         selections.selectedCountries.forEach((country) => {
//           const countryExists = newLocations.some(
//             (loc) => loc.country === country
//           );
//           if (!countryExists) {
//             newLocations.push({
//               country,
//               states: [],
//             });
//           }
//         });

//         // Process states
//         Object.entries(selections.selectedStates).forEach(
//           ([country, states]) => {
//             const countryIndex = newLocations.findIndex(
//               (loc) => loc.country === country
//             );

//             if (countryIndex !== -1) {
//               states.forEach((state) => {
//                 const stateExists = newLocations[countryIndex].states.some(
//                   (s) => s.state === state
//                 );

//                 if (!stateExists) {
//                   newLocations[countryIndex].states.push({
//                     state,
//                     cities: [],
//                   });
//                 }
//               });
//             }
//           }
//         );

//         // Process cities
//         Object.entries(selections.selectedCities).forEach(
//           ([stateKey, cities]) => {
//             const [country, state] = stateKey.split("-");
//             const countryIndex = newLocations.findIndex(
//               (loc) => loc.country === country
//             );

//             if (countryIndex !== -1) {
//               const stateIndex = newLocations[countryIndex].states.findIndex(
//                 (s) => s.state === state
//               );

//               if (stateIndex === -1) {
//                 newLocations[countryIndex].states.push({
//                   state,
//                   cities,
//                 });
//               } else {
//                 cities.forEach((city) => {
//                   if (
//                     !newLocations[countryIndex].states[
//                       stateIndex
//                     ].cities.includes(city)
//                   ) {
//                     newLocations[countryIndex].states[stateIndex].cities.push(
//                       city
//                     );
//                   }
//                 });
//               }
//             }
//           }
//         );

//         const updatedData = {
//           ...data,
//           [locationKey]: {
//             ...data[locationKey],
//             international: {
//               locations: newLocations,
//             },
//           },
//         };

//         onChange(updatedData);
//       }
//     },
//     [data, onChange]
//   );

//   // Fetch states for a country
//   const getStatesByCountry = useCallback(
//     async (countryName, callback) => {
//       if (apiCache.states[countryName]) {
//         callback(apiCache.states[countryName]);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           "https://countriesnow.space/api/v0.1/countries/states",
//           { country: countryName }
//         );
//         const states = response.data.data?.states || [];
//         apiCache.states[countryName] = states;
//         callback(states);
//       } catch (error) {
//         console.error("Error fetching states for country:", countryName, error);
//         enqueueSnackbar(`Failed to load states for ${countryName}`, {
//           variant: "error",
//         });
//         callback([]);
//       }
//     },
//     [enqueueSnackbar]
//   );

//   // Fetch cities for a country and state
//   const getCitiesByCountryAndState = useCallback(
//     async (countryName, stateName, callback) => {
//       const cacheKey = `${countryName}-${stateName}`;
//       if (apiCache.cities[cacheKey]) {
//         callback(apiCache.cities[cacheKey]);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           "https://countriesnow.space/api/v0.1/countries/state/cities",
//           { country: countryName, state: stateName }
//         );
//         const cities = response.data.data || [];
//         apiCache.cities[cacheKey] = cities;
//         callback(cities);
//       } catch (error) {
//         console.error(
//           "Error fetching cities for country and state:",
//           countryName,
//           stateName,
//           error
//         );
//         enqueueSnackbar(
//           `Failed to load cities for ${stateName}, ${countryName}`,
//           { variant: "error" }
//         );
//         callback([]);
//       }
//     },
//     [enqueueSnackbar]
//   );

//   // Debounced versions of API calls
//   const debouncedGetStatesByCountry = useMemo(
//     () => debounce(getStatesByCountry, 500),
//     [getStatesByCountry]
//   );

//   const debouncedGetCitiesByCountryAndState = useMemo(
//     () => debounce(getCitiesByCountryAndState, 500),
//     [getCitiesByCountryAndState]
//   );

//   // Initialize component with data
//   useEffect(() => {
//     fetchDomesticData();
//     fetchCountries();

//     // Initialize current outlet locations
//     if (data?.currentOutletLocations) {
//       // Domestic locations
//       if (data.currentOutletLocations.domestic?.locations?.length > 0) {
//         const domesticLocations =
//           data.currentOutletLocations.domestic.locations;
//         const selectedStates = domesticLocations.map((loc) => loc.state);
//         const selectedDistricts = domesticLocations.flatMap(
//           (loc) =>
//             loc.districts?.map((district) => ({
//               state: loc.state,
//               district: district.district,
//             })) || []
//         );
//         const selectedCities = domesticLocations.flatMap(
//           (loc) =>
//             loc.districts?.flatMap(
//               (district) =>
//                 district.cities?.map((city) => ({
//                   state: loc.state,
//                   district: district.district,
//                   city,
//                 })) || []
//             ) || []
//         );

//         setCurrentDomesticSelections({
//           selectedStates,
//           selectedDistricts,
//           selectedCities,
//         });
//       }

//       // International locations
//       if (data.currentOutletLocations.international?.locations?.length > 0) {
//         const intlLocations =
//           data.currentOutletLocations.international.locations;
//         const selectedCountries = intlLocations.map((loc) => loc.country);
//         const selectedStates = {};
//         const selectedCities = {};

//         intlLocations.forEach((loc) => {
//           if (loc.states?.length > 0) {
//             selectedStates[loc.country] = loc.states.map(
//               (state) => state.state
//             );

//             loc.states.forEach((state) => {
//               const stateKey = `${loc.country}-${state.state}`;
//               if (state.cities?.length > 0) {
//                 selectedCities[stateKey] = state.cities;
//               }
//             });
//           }
//         });

//         setCurrentInternationalSelections({
//           selectedCountries,
//           selectedStates,
//           selectedCities,
//         });

//         // Load states and cities for the selected countries
//         selectedCountries.forEach((country) => {
//           debouncedGetStatesByCountry(country, (states) => {
//             setCurrentInternationalStates((prev) => ({
//               ...prev,
//               [country]: states,
//             }));
//           });
//         });

//         Object.entries(selectedStates).forEach(([country, states]) => {
//           states.forEach((state) => {
//             const stateKey = `${country}-${state}`;
//             debouncedGetCitiesByCountryAndState(country, state, (cities) => {
//               setCurrentInternationalCities((prev) => ({
//                 ...prev,
//                 [stateKey]: cities,
//               }));
//             });
//           });
//         });
//       }
//     }

//     // Set initial location type based on which has data
//     if (data?.currentOutletLocations?.domestic?.locations?.length > 0) {
//       setCurrentOutletLocationType("domestic");
//     } else if (
//       data?.currentOutletLocations?.international?.locations?.length > 0
//     ) {
//       setCurrentOutletLocationType("international");
//     }
//   }, [
//     data,
//     fetchDomesticData,
//     fetchCountries,
//     debouncedGetStatesByCountry,
//     debouncedGetCitiesByCountryAndState,
//   ]);

//   // Handle international expansion selection
//   const handleInternationalExpansionChange = useCallback(
//     (value) => {
//       const newValue = value === data?.isInternationalExpansion ? null : value;
//       onChange({
//         ...data,
//         isInternationalExpansion: newValue,
//       });
//     },
//     [data, onChange]
//   );

//   // Handle location type change (domestic/international)
//   const handleLocationTypeChange = useCallback((e) => {
//     setLocationType(e.target.value);
//   }, []);

//   // Handle current outlet location type change
//   const handleCurrentOutletLocationTypeChange = useCallback((e) => {
//     setCurrentOutletLocationType(e.target.value);
//   }, []);

//   // Handle domestic state selection
//   const handleDomesticStateSelection = useCallback(
//     (selectedStates, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentDomesticSelections
//           : setDomesticSelections;

//       setSelections((prev) => ({
//         ...prev,
//         selectedStates,
//         selectedDistricts: [],
//         selectedCities: [],
//       }));

//       // Update form data immediately
//       updateFormData(type, "domestic", {
//         selectedStates,
//         selectedDistricts: [],
//         selectedCities: [],
//       });
//     },
//     [updateFormData]
//   );

//   // Handle domestic district selection
//   const handleDomesticDistrictSelection = useCallback(
//     (stateName, districtName, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentDomesticSelections
//           : setDomesticSelections;

//       setSelections((prev) => {
//         const newSelections = {
//           selectedStates: [...prev.selectedStates],
//           selectedDistricts: [...prev.selectedDistricts],
//           selectedCities: [...prev.selectedCities],
//         };

//         if (isSelected) {
//           newSelections.selectedDistricts = [
//             ...newSelections.selectedDistricts,
//             { state: stateName, district: districtName },
//           ];
//           newSelections.selectedCities = newSelections.selectedCities.filter(
//             (city) =>
//               !(city.state === stateName && city.district === districtName)
//           );
//         } else {
//           newSelections.selectedDistricts =
//             newSelections.selectedDistricts.filter(
//               (d) => !(d.state === stateName && d.district === districtName)
//             );
//           newSelections.selectedCities = newSelections.selectedCities.filter(
//             (city) =>
//               !(city.state === stateName && city.district === districtName)
//           );
//         }

//         // Update form data immediately
//         updateFormData(type, "domestic", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   // Handle domestic city selection
//   const handleDomesticCitySelection = useCallback(
//     (stateName, districtName, cityName, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentDomesticSelections
//           : setDomesticSelections;

//       setSelections((prev) => {
//         const newSelectedCities = [...prev.selectedCities];
//         const cityObj = {
//           state: stateName,
//           district: districtName,
//           city: cityName,
//         };

//         if (isSelected) {
//           newSelectedCities.push(cityObj);
//         } else {
//           const index = newSelectedCities.findIndex(
//             (c) =>
//               c.state === stateName &&
//               c.district === districtName &&
//               c.city === cityName
//           );
//           if (index !== -1) {
//             newSelectedCities.splice(index, 1);
//           }
//         }

//         const newSelections = {
//           ...prev,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "domestic", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   const handleSelectAllDistricts = useCallback(
//     (stateName, districts, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentDomesticSelections
//           : setDomesticSelections;

//       setSelections((prev) => {
//         let newSelectedDistricts = [...prev.selectedDistricts];
//         let newSelectedCities = [...prev.selectedCities];

//         if (isSelected) {
//           // Add all districts and remove any cities from these districts
//           districts.forEach((district) => {
//             if (
//               !newSelectedDistricts.some(
//                 (d) => d.state === stateName && d.district === district
//               )
//             ) {
//               newSelectedDistricts.push({ state: stateName, district });
//             }
//             // Remove any cities from this district
//             newSelectedCities = newSelectedCities.filter(
//               (city) =>
//                 !(city.state === stateName && city.district === district)
//             );
//           });
//         } else {
//           // Remove all districts and their cities for this state
//           newSelectedDistricts = newSelectedDistricts.filter(
//             (d) => d.state !== stateName
//           );
//           newSelectedCities = newSelectedCities.filter(
//             (city) => city.state !== stateName
//           );
//         }

//         const newSelections = {
//           ...prev,
//           selectedDistricts: newSelectedDistricts,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "domestic", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   // Handle "Select All" for cities in a district
//   const handleSelectAllCities = useCallback(
//     (stateName, districtName, cities, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentDomesticSelections
//           : setDomesticSelections;

//       setSelections((prev) => {
//         let newSelectedCities = [...prev.selectedCities];

//         if (isSelected) {
//           // Add all cities
//           cities.forEach((city) => {
//             if (
//               !newSelectedCities.some(
//                 (c) =>
//                   c.state === stateName &&
//                   c.district === districtName &&
//                   c.city === city
//               )
//             ) {
//               newSelectedCities.push({
//                 state: stateName,
//                 district: districtName,
//                 city,
//               });
//             }
//           });
//         } else {
//           // Remove all cities for this district
//           newSelectedCities = newSelectedCities.filter(
//             (c) => !(c.state === stateName && c.district === districtName)
//           );
//         }

//         const newSelections = {
//           ...prev,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "domestic", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   // Handle international country selection
//   const handleInternationalCountrySelection = useCallback(
//     async (selectedCountries, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentInternationalSelections
//           : setInternationalSelections;
//       const setStatesData =
//         type === "current"
//           ? setCurrentInternationalStates
//           : setInternationalStates;

//       setSelections((prev) => ({
//         ...prev,
//         selectedCountries,
//         selectedStates: {},
//         selectedCities: {},
//       }));

//       // Update form data immediately
//       updateFormData(type, "international", {
//         selectedCountries,
//         selectedStates: {},
//         selectedCities: {},
//       });

//       // Fetch states for newly selected countries
//       const newStatesData = {};
//       for (const country of selectedCountries) {
//         if (!apiCache.states[country]) {
//           debouncedGetStatesByCountry(country, (states) => {
//             setStatesData((prev) => ({ ...prev, [country]: states }));
//           });
//         }
//       }
//     },
//     [debouncedGetStatesByCountry, updateFormData]
//   );

//   // Handle international state selection
//   const handleInternationalStateSelection = useCallback(
//     async (countryName, stateName, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentInternationalSelections
//           : setInternationalSelections;

//       setSelections((prev) => {
//         const newSelectedStates = { ...prev.selectedStates };
//         const newSelectedCities = { ...prev.selectedCities };

//         if (!newSelectedStates[countryName]) {
//           newSelectedStates[countryName] = [];
//         }

//         if (isSelected) {
//           newSelectedStates[countryName] = [
//             ...newSelectedStates[countryName],
//             stateName,
//           ];
//         } else {
//           newSelectedStates[countryName] = newSelectedStates[
//             countryName
//           ].filter((s) => s !== stateName);
//           if (newSelectedStates[countryName].length === 0) {
//             delete newSelectedStates[countryName];
//           }
//         }

//         // Clear cities for the country-state combination when states change
//         const stateKey = `${countryName}-${stateName}`;
//         if (newSelectedCities[stateKey]) {
//           delete newSelectedCities[stateKey];
//         }

//         const newSelections = {
//           ...prev,
//           selectedStates: newSelectedStates,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "international", newSelections);

//         return newSelections;
//       });

//       // Fetch cities for newly selected states
//       if (isSelected) {
//         const setCitiesData =
//           type === "current"
//             ? setCurrentInternationalCities
//             : setInternationalCities;
//         const cacheKey = `${countryName}-${stateName}`;

//         if (!apiCache.cities[cacheKey]) {
//           debouncedGetCitiesByCountryAndState(
//             countryName,
//             stateName,
//             (cities) => {
//               setCitiesData((prev) => ({ ...prev, [cacheKey]: cities }));
//             }
//           );
//         }
//       }
//     },
//     [debouncedGetCitiesByCountryAndState, updateFormData]
//   );

//   // Handle international city selection
//   const handleInternationalCitySelection = useCallback(
//     (countryName, stateName, cityName, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentInternationalSelections
//           : setInternationalSelections;

//       setSelections((prev) => {
//         const newSelectedCities = { ...prev.selectedCities };
//         const stateKey = `${countryName}-${stateName}`;

//         if (!newSelectedCities[stateKey]) {
//           newSelectedCities[stateKey] = [];
//         }

//         if (isSelected) {
//           newSelectedCities[stateKey] = [
//             ...newSelectedCities[stateKey],
//             cityName,
//           ];
//         } else {
//           newSelectedCities[stateKey] = newSelectedCities[stateKey].filter(
//             (c) => c !== cityName
//           );
//           if (newSelectedCities[stateKey].length === 0) {
//             delete newSelectedCities[stateKey];
//           }
//         }

//         const newSelections = {
//           ...prev,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "international", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   // Handle "Select All" for states in a country
//   const handleSelectAllStates = useCallback(
//     (countryName, states, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentInternationalSelections
//           : setInternationalSelections;

//       setSelections((prev) => {
//         const newSelectedStates = { ...prev.selectedStates };
//         const newSelectedCities = { ...prev.selectedCities };

//         if (isSelected) {
//           // Add all states for this country
//           newSelectedStates[countryName] = states;

//           // Remove any cities for states that are being selected (since we're selecting the whole state)
//           states.forEach((stateName) => {
//             const stateKey = `${countryName}-${stateName}`;
//             if (newSelectedCities[stateKey]) {
//               delete newSelectedCities[stateKey];
//             }
//           });
//         } else {
//           // Remove all states for this country
//           delete newSelectedStates[countryName];

//           // Remove all cities for this country
//           Object.keys(newSelectedCities).forEach((key) => {
//             if (key.startsWith(`${countryName}-`)) {
//               delete newSelectedCities[key];
//             }
//           });
//         }

//         const newSelections = {
//           ...prev,
//           selectedStates: newSelectedStates,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "international", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   // Handle "Select All" for cities in a state
//   const handleSelectAllStateCities = useCallback(
//     (countryName, stateName, cities, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentInternationalSelections
//           : setInternationalSelections;

//       setSelections((prev) => {
//         const newSelectedCities = { ...prev.selectedCities };
//         const stateKey = `${countryName}-${stateName}`;

//         if (isSelected) {
//           newSelectedCities[stateKey] = [...cities];
//         } else {
//           delete newSelectedCities[stateKey];
//         }

//         const newSelections = {
//           ...prev,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "international", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   // Remove location items
//   const removeLocationItems = useCallback(
//     (type, locationType, field, index) => {
//       const updatedData = { ...data };
//       const locations = [...updatedData[type][locationType].locations];

//       if (field === "state" && locationType === "domestic") {
//         locations.splice(index, 1);
//       } else if (field === "district" && locationType === "domestic") {
//         const stateIndex = Math.floor(index / 1000);
//         const districtIndex = index % 1000;
//         if (locations[stateIndex] && locations[stateIndex].districts) {
//           locations[stateIndex].districts.splice(districtIndex, 1);
//         }
//       } else if (field === "city" && locationType === "domestic") {
//         const stateIndex = Math.floor(index / 1000000);
//         const districtIndex = Math.floor((index % 1000000) / 1000);
//         const cityIndex = index % 1000;
//         if (
//           locations[stateIndex] &&
//           locations[stateIndex].districts &&
//           locations[stateIndex].districts[districtIndex]
//         ) {
//           locations[stateIndex].districts[districtIndex].cities.splice(
//             cityIndex,
//             1
//           );
//         }
//       } else if (field === "country" && locationType === "international") {
//         locations.splice(index, 1);
//       } else if (field === "state" && locationType === "international") {
//         const countryIndex = Math.floor(index / 1000);
//         const stateIndex = index % 1000;
//         if (locations[countryIndex] && locations[countryIndex].states) {
//           locations[countryIndex].states.splice(stateIndex, 1);
//         }
//       } else if (field === "city" && locationType === "international") {
//         const countryIndex = Math.floor(index / 1000000);
//         const stateIndex = Math.floor((index % 1000000) / 1000);
//         const cityIndex = index % 1000;
//         if (
//           locations[countryIndex] &&
//           locations[countryIndex].states &&
//           locations[countryIndex].states[stateIndex]
//         ) {
//           locations[countryIndex].states[stateIndex].cities.splice(
//             cityIndex,
//             1
//           );
//         }
//       }

//       updatedData[type][locationType].locations = locations;
//       onChange(updatedData);
//     },
//     [data, onChange]
//   );

//   // Helper function to flatten locations for display
//   const flattenLocations = (locations = [], type) => {
//     const result = [];

//     if (!locations || !Array.isArray(locations)) return result;

//     if (type === "domestic") {
//       locations.forEach((stateObj, stateIndex) => {
//         if (!stateObj) return;

//         // Add state
//         result.push({
//           type: "state",
//           label: stateObj.state,
//           index: stateIndex,
//         });

//         // Add districts
//         stateObj.districts?.forEach((districtObj, districtIndex) => {
//           if (!districtObj) return;

//           result.push({
//             type: "district",
//             label: `${stateObj.state} - ${districtObj.district}`,
//             index: stateIndex * 1000 + districtIndex,
//           });

//           // Add cities
//           districtObj.cities?.forEach((city, cityIndex) => {
//             result.push({
//               type: "city",
//               label: `${stateObj.state} - ${districtObj.district} - ${city}`,
//               index: stateIndex * 1000000 + districtIndex * 1000 + cityIndex,
//             });
//           });
//         });
//       });
//     } else {
//       // international
//       locations.forEach((countryObj, countryIndex) => {
//         if (!countryObj) return;

//         // Add country
//         result.push({
//           type: "country",
//           label: countryObj.country,
//           index: countryIndex,
//         });

//         // Add states
//         countryObj.states?.forEach((stateObj, stateIndex) => {
//           if (!stateObj) return;

//           result.push({
//             type: "state",
//             label: `${countryObj.country} - ${stateObj.state}`,
//             index: countryIndex * 1000 + stateIndex,
//           });

//           // Add cities
//           stateObj.cities?.forEach((city, cityIndex) => {
//             result.push({
//               type: "city",
//               label: `${countryObj.country} - ${stateObj.state} - ${city}`,
//               index: countryIndex * 1000000 + stateIndex * 1000 + cityIndex,
//             });
//           });
//         });
//       });
//     }

//     return result;
//   };

//   // Render domestic state drawer
//   const renderDomesticStateDrawer = useCallback(
//     (type) => {
//       const selections =
//         type === "current" ? currentDomesticSelections : domesticSelections;
//       const toggle = (open) => toggleDrawer(type, { states: open });

//       const allStatesSelected =
//         selections.selectedStates.length === sortedStates.length;
//       const someStatesSelected =
//         selections.selectedStates.length > 0 && !allStatesSelected;

//       return (
//         <Box sx={{ mt: 4, mb: 3 }}>
//           {/* Trigger Button */}
//           <Button
//             variant="outlined"
//             fullWidth
//             color="warning"
//             onClick={() => toggle(true)}
//             endIcon={<ChevronDown />}
//             sx={{ justifyContent: "space-between" }}
//           >
//             {selections.selectedStates.length > 0
//               ? `${selections.selectedStates.length} states selected`
//               : "Select States"}
//           </Button>

//           {/* Main State Drawer */}
//           <Drawer
//             anchor="top"
//             open={
//               type === "current" ? currentDrawerOpen.states : drawerOpen.states
//             }
//             onClose={() => toggle(false)}
//             PaperProps={{
//               sx: {
//                 width: "98%",
//                 height: "100vh",
//                 borderRadius: 0,
//                 p: 2,
//                 display: "flex",
//                 flexDirection: "column",
//               },
//             }}
//           >
//             {/* Header */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 3,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 fontWeight={700}
//                 sx={{ color: "#ff9800" }}
//               >
//                 Select States
//               </Typography>
//               <Button
//                 variant="outlined"
//                 color="warning"
//                 onClick={() => toggle(false)}
//               >
//                 Done
//               </Button>
//             </Box>

//             {/* Search Field */}
//             <TextField
//               placeholder="Search states..."
//               variant="outlined"
//               size="small"
//               sx={{ mb: 2 }}
//               onChange={(e) => handleSearchChange("states", e.target.value)}
//               InputProps={{
//                 startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
//               }}
//             />

//             {/* Select All */}
//             <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//               <Checkbox
//                 checked={allStatesSelected}
//                 indeterminate={someStatesSelected}
//                 onChange={() => {
//                   handleDomesticStateSelection(
//                     allStatesSelected ? [] : sortedStates.map((s) => s.name),
//                     type
//                   );
//                 }}
//               />
//               <Typography variant="subtitle1" sx={{ ml: 1 }}>
//                 Select All States
//               </Typography>
//             </Box>

//             {/* States Grid */}
//             <Box sx={{ flex: 1, overflow: "auto", mt: 1 }}>
//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(5, 1fr)",
//                   gap: 1,
//                   px: 5,
//                 }}
//               >
//                 {sortedStates.map((state) => {
//                   const isSelected = selections.selectedStates.includes(
//                     state.name
//                   );
//                   return (
//                     <FormControlLabel
//                       key={`state-${state.name}`}
//                       control={
//                         <Checkbox
//                           checked={isSelected}
//                           onChange={() => {
//                             const updated = isSelected
//                               ? selections.selectedStates.filter(
//                                   (s) => s !== state.name
//                                 )
//                               : [...selections.selectedStates, state.name];
//                             handleDomesticStateSelection(updated, type);
//                           }}
//                         />
//                       }
//                       label={state.name}
//                     />
//                   );
//                 })}
//               </Box>
//             </Box>
//           </Drawer>

//           {/* Selected States Accordion */}
//           {selections.selectedStates.length > 0 && (
//             <Box sx={{ mt: 2 }}>
//               <Accordion>
//                 <AccordionSummary expandIcon={<ChevronDown />}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
//                     View Selected States ({selections.selectedStates.length})
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <Box
//                     sx={{
//                       display: "grid",
//                       gridTemplateColumns:
//                         "repeat(auto-fill, minmax(200px, 1fr))",
//                       gap: 1,
//                     }}
//                   >
//                     {selections.selectedStates.map((state, index) => (
//                       <Chip
//                         key={`selected-state-${index}`}
//                         label={state}
//                         onDelete={() => {
//                           const updated = selections.selectedStates.filter(
//                             (_, i) => i !== index
//                           );
//                           handleDomesticStateSelection(updated, type);
//                         }}
//                         variant="outlined"
//                         sx={{ mb: 1 }}
//                       />
//                     ))}
//                   </Box>
//                 </AccordionDetails>
//               </Accordion>
//             </Box>
//           )}
//         </Box>
//       );
//     },
//     [
//       sortedStates,
//       currentDomesticSelections,
//       domesticSelections,
//       currentDrawerOpen.states,
//       drawerOpen.states,
//       handleDomesticStateSelection,
//       handleSearchChange,
//       toggleDrawer,
//     ]
//   );

//   // Render domestic district drawer
//   const renderDomesticDistrictDrawer = useCallback(
//     (type) => {
//       const selections =
//         type === "current" ? currentDomesticSelections : domesticSelections;
//       const toggle = (open) => toggleDrawer(type, { districts: open });

//       if (selections.selectedStates.length === 0) return null;

//       // Group selected districts by state
//       const districtsByState = selections.selectedDistricts.reduce(
//         (acc, { state, district }) => {
//           if (!acc[state]) acc[state] = [];
//           acc[state].push(district);
//           return acc;
//         },
//         {}
//       );

//       // Calculate total available districts
//       const totalDistricts = selections.selectedStates.reduce(
//         (total, stateName) => {
//           const state = statesData.find((s) => s.name === stateName);
//           return total + (state?.districts?.length || 0);
//         },
//         0
//       );

//       return (
//         <Box sx={{ mt: 3, mb: 3 }}>
//           {/* Trigger Button */}
//           <Button
//             variant="outlined"
//             color="warning"
//             fullWidth
//             onClick={() => toggle(true)}
//             endIcon={<ChevronDown />}
//             sx={{ justifyContent: "space-between" }}
//           >
//             {selections.selectedDistricts.length > 0
//               ? `${selections.selectedDistricts.length} districts selected`
//               : "Select Districts"}
//           </Button>

//           {/* Drawer for District Selection */}
//           <Drawer
//             anchor="top"
//             open={
//               type === "current"
//                 ? currentDrawerOpen.districts
//                 : drawerOpen.districts
//             }
//             onClose={() => toggle(false)}
//             PaperProps={{
//               sx: {
//                 width: "98%",
//                 height: "100vh",
//                 borderRadius: 0,
//                 p: 2,
//                 display: "flex",
//                 flexDirection: "column",
//               },
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 2,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 fontWeight={700}
//                 sx={{ color: "#ff9800" }}
//               >
//                 Select Districts
//               </Typography>
//               <Button
//                 variant="outlined"
//                 color="warning"
//                 onClick={() => toggle(false)}
//               >
//                 Done
//               </Button>
//             </Box>

//             {/* Search Field */}
//             <TextField
//               fullWidth
//               placeholder="Search districts..."
//               variant="outlined"
//               size="small"
//               sx={{ mb: 2 }}
//               onChange={(e) => handleSearchChange("districts", e.target.value)}
//               InputProps={{
//                 startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
//               }}
//             />

//             {/* Select All */}
//             <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//               <Checkbox
//                 checked={
//                   selections.selectedDistricts.length > 0 &&
//                   selections.selectedDistricts.length === totalDistricts
//                 }
//                 indeterminate={
//                   selections.selectedDistricts.length > 0 &&
//                   selections.selectedDistricts.length < totalDistricts
//                 }
//                 onChange={() => {
//                   selections.selectedStates.forEach((stateName) => {
//                     const state = statesData.find((s) => s.name === stateName);
//                     if (state?.districts) {
//                       handleSelectAllDistricts(
//                         stateName,
//                         state.districts,
//                         selections.selectedDistricts.length !== totalDistricts,
//                         type
//                       );
//                     }
//                   });
//                 }}
//               />
//               <Typography variant="subtitle1" sx={{ ml: 1 }}>
//                 Select All Districts
//               </Typography>
//             </Box>

//             {/* District Checkboxes */}
//             <Box sx={{ flex: 1, overflow: "auto" }}>
//               {selections.selectedStates.map((stateName) => {
//                 const state = statesData.find((s) => s.name === stateName);
//                 if (!state) return null;

//                 const districts = (state.districts || [])
//                   .filter((d) =>
//                     d.toLowerCase().includes(searchFilters.districts)
//                   )
//                   .sort((a, b) => a.localeCompare(b));

//                 if (districts.length === 0) return null;

//                 const selectedDistrictsForState = selections.selectedDistricts
//                   .filter((d) => d.state === stateName)
//                   .map((d) => d.district);

//                 const allSelected = districts.every((d) =>
//                   selectedDistrictsForState.includes(d)
//                 );

//                 return (
//                   <Box key={`districts-section-${stateName}`} sx={{ mb: 4 }}>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                       <Checkbox
//                         checked={allSelected}
//                         indeterminate={
//                           selectedDistrictsForState.length > 0 && !allSelected
//                         }
//                         onChange={() =>
//                           handleSelectAllDistricts(
//                             stateName,
//                             districts,
//                             !allSelected,
//                             type
//                           )
//                         }
//                       />
//                       <Typography
//                         variant="subtitle1"
//                         sx={{ color: "orange", ml: 1 }}
//                       >
//                         {stateName}
//                       </Typography>
//                     </Box>

//                     <Box
//                       sx={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(5, 1fr)",
//                         gap: 1,
//                         ml: 4,
//                       }}
//                     >
//                       {districts.map((district) => {
//                         const isSelected =
//                           selectedDistrictsForState.includes(district);
//                         return (
//                           <FormControlLabel
//                             key={`district-${stateName}-${district}`}
//                             control={
//                               <Checkbox
//                                 checked={isSelected}
//                                 onChange={() =>
//                                   handleDomesticDistrictSelection(
//                                     stateName,
//                                     district,
//                                     !isSelected,
//                                     type
//                                   )
//                                 }
//                               />
//                             }
//                             label={district}
//                           />
//                         );
//                       })}
//                     </Box>
//                   </Box>
//                 );
//               })}
//             </Box>
//           </Drawer>

//           {/* Accordion for Selected Districts */}
//           {selections.selectedDistricts.length > 0 && (
//             <Box sx={{ mt: 2 }}>
//               <Accordion>
//                 <AccordionSummary expandIcon={<ChevronDown />}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
//                     View Selected Districts (
//                     {selections.selectedDistricts.length})
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   {Object.entries(districtsByState).map(
//                     ([state, districts]) => (
//                       <Box key={`selected-districts-${state}`} sx={{ mb: 4 }}>
//                         <Typography
//                           variant="subtitle1"
//                           sx={{ color: "orange", mb: 1 }}
//                         >
//                           {state}
//                         </Typography>
//                         <Box
//                           sx={{
//                             display: "grid",
//                             gridTemplateColumns:
//                               "repeat(auto-fill, minmax(200px, 1fr))",
//                             gap: 1,
//                             ml: 2,
//                           }}
//                         >
//                           {districts.map((district, index) => (
//                             <Chip
//                               key={`selected-district-${state}-${district}-${index}`}
//                               label={district}
//                               onDelete={() =>
//                                 handleDomesticDistrictSelection(
//                                   state,
//                                   district,
//                                   false,
//                                   type
//                                 )
//                               }
//                               variant="outlined"
//                               sx={{ mb: 1 }}
//                             />
//                           ))}
//                         </Box>
//                       </Box>
//                     )
//                   )}
//                 </AccordionDetails>
//               </Accordion>
//             </Box>
//           )}
//         </Box>
//       );
//     },
//     [
//       currentDomesticSelections,
//       domesticSelections,
//       currentDrawerOpen.districts,
//       drawerOpen.districts,
//       handleDomesticDistrictSelection,
//       handleSearchChange,
//       handleSelectAllDistricts,
//       searchFilters.districts,
//       statesData,
//       toggleDrawer,
//     ]
//   );

//   // Render domestic city drawer
//   const renderDomesticCityDrawer = useCallback(
//     (type) => {
//       const selections =
//         type === "current" ? currentDomesticSelections : domesticSelections;
//       const toggle = (open) => toggleDrawer(type, { cities: open });

//       if (selections.selectedDistricts.length === 0) return null;

//       // Group districts by state
//       const districtsByState = selections.selectedDistricts.reduce(
//         (acc, { state, district }) => {
//           if (!acc[state]) acc[state] = [];
//           acc[state].push(district);
//           return acc;
//         },
//         {}
//       );

//       // Group selected cities by district key
//       const citiesByDistrict = selections.selectedCities.reduce(
//         (acc, { state, district, city }) => {
//           const key = `${state}-${district}`;
//           if (!acc[key]) acc[key] = [];
//           acc[key].push(city);
//           return acc;
//         },
//         {}
//       );

//       const totalCities = selections.selectedDistricts.reduce(
//         (total, { state, district }) => {
//           const stateData = statesData.find((s) => s.name === state);
//           const cities =
//             stateData?.cities?.filter((c) => c.district === district) || [];
//           return total + cities.length;
//         },
//         0
//       );

//       return (
//         <Box sx={{ mt: 3, mb: 3 }}>
//           {/* Trigger Button */}
//           <Button
//             variant="outlined"
//             color="warning"
//             fullWidth
//             onClick={() => toggle(true)}
//             endIcon={<ChevronDown />}
//             sx={{ justifyContent: "space-between" }}
//           >
//             {selections.selectedCities.length > 0
//               ? `${selections.selectedCities.length} cities selected`
//               : "Select Cities"}
//           </Button>

//           {/* Drawer */}
//           <Drawer
//             anchor="top"
//             open={
//               type === "current" ? currentDrawerOpen.cities : drawerOpen.cities
//             }
//             onClose={() => toggle(false)}
//             PaperProps={{
//               sx: {
//                 width: "98%",
//                 height: "100vh",
//                 p: 2,
//                 display: "flex",
//                 flexDirection: "column",
//               },
//             }}
//           >
//             {/* Header */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 2,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{ color: "#ff9800", fontWeight: 700 }}
//               >
//                 Select Cities
//               </Typography>
//               <Button
//                 variant="outlined"
//                 color="warning"
//                 onClick={() => toggle(false)}
//               >
//                 Done
//               </Button>
//             </Box>

//             {/* Search */}
//             <TextField
//               fullWidth
//               placeholder="Search cities..."
//               variant="outlined"
//               size="small"
//               sx={{ mb: 2 }}
//               onChange={(e) => handleSearchChange("cities", e.target.value)}
//               InputProps={{
//                 startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
//               }}
//             />

//             {/* Select All Cities Checkbox */}
//             <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//               <Checkbox
//                 checked={selections.selectedCities.length === totalCities}
//                 indeterminate={
//                   selections.selectedCities.length > 0 &&
//                   selections.selectedCities.length < totalCities
//                 }
//                 onChange={() => {
//                   selections.selectedDistricts.forEach(
//                     ({ state, district }) => {
//                       const stateData = statesData.find(
//                         (s) => s.name === state
//                       );
//                       const cities =
//                         stateData?.cities
//                           ?.filter((c) => c.district === district)
//                           .map((c) => c.name) || [];
//                       handleSelectAllCities(
//                         state,
//                         district,
//                         cities,
//                         selections.selectedCities.length !== totalCities,
//                         type
//                       );
//                     }
//                   );
//                 }}
//               />
//               <Typography variant="subtitle1" sx={{ ml: 1 }}>
//                 Select All Cities
//               </Typography>
//             </Box>

//             {/* City List */}
//             <Box sx={{ flex: 1, overflow: "auto" }}>
//               {Object.entries(districtsByState).map(
//                 ([stateName, districts]) => {
//                   const state = statesData.find((s) => s.name === stateName);
//                   if (!state) return null;

//                   return districts.map((districtName) => {
//                     const districtKey = `${stateName}-${districtName}`;
//                     const cities = state.cities
//                       .filter((c) => c.district === districtName)
//                       .map((c) => c.name)
//                       .filter((c) =>
//                         c.toLowerCase().includes(searchFilters.cities)
//                       )
//                       .sort();

//                     if (cities.length === 0) return null;

//                     const selectedCities = citiesByDistrict[districtKey] || [];
//                     const allSelected = cities.every((city) =>
//                       selectedCities.includes(city)
//                     );

//                     return (
//                       <Box key={`cities-section-${districtKey}`} sx={{ mb: 4 }}>
//                         <Box
//                           sx={{ display: "flex", alignItems: "center", mb: 1 }}
//                         >
//                           <Checkbox
//                             checked={allSelected}
//                             indeterminate={
//                               selectedCities.length > 0 && !allSelected
//                             }
//                             onChange={() =>
//                               handleSelectAllCities(
//                                 stateName,
//                                 districtName,
//                                 cities,
//                                 !allSelected,
//                                 type
//                               )
//                             }
//                           />
//                           <Typography
//                             variant="subtitle1"
//                             sx={{ color: "orange", ml: 1 }}
//                           >
//                             {stateName} - {districtName}
//                           </Typography>
//                         </Box>

//                         <Box
//                           sx={{
//                             display: "grid",
//                             gridTemplateColumns: "repeat(5, 1fr)",
//                             gap: 1,
//                             ml: 4,
//                           }}
//                         >
//                           {cities.map((city) => (
//                             <FormControlLabel
//                               key={`city-${districtKey}-${city}`}
//                               control={
//                                 <Checkbox
//                                   checked={selectedCities.includes(city)}
//                                   onChange={() =>
//                                     handleDomesticCitySelection(
//                                       stateName,
//                                       districtName,
//                                       city,
//                                       !selectedCities.includes(city),
//                                       type
//                                     )
//                                   }
//                                 />
//                               }
//                               label={city}
//                             />
//                           ))}
//                         </Box>
//                       </Box>
//                     );
//                   });
//                 }
//               )}
//             </Box>
//           </Drawer>

//           {/* Accordion for Selected Cities */}
//           {selections.selectedCities.length > 0 && (
//             <Box sx={{ mt: 2 }}>
//               <Accordion>
//                 <AccordionSummary expandIcon={<ChevronDown />}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
//                     View Selected Cities ({selections.selectedCities.length})
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   {Object.entries(citiesByDistrict).map(([key, cities]) => {
//                     const [state, district] = key.split("-");
//                     return (
//                       <Box key={`selected-cities-${key}`} sx={{ mb: 4 }}>
//                         <Typography
//                           variant="subtitle1"
//                           sx={{ color: "orange", mb: 1 }}
//                         >
//                           {state} - {district}
//                         </Typography>
//                         <Box
//                           sx={{
//                             display: "grid",
//                             gridTemplateColumns:
//                               "repeat(auto-fill, minmax(200px, 1fr))",
//                             gap: 1,
//                             ml: 2,
//                           }}
//                         >
//                           {cities.map((city, i) => (
//                             <Chip
//                               key={`selected-city-${key}-${city}-${i}`}
//                               label={city}
//                               onDelete={() =>
//                                 handleDomesticCitySelection(
//                                   state,
//                                   district,
//                                   city,
//                                   false,
//                                   type
//                                 )
//                               }
//                               color="success"
//                               variant="outlined"
//                               sx={{ mb: 1 }}
//                             />
//                           ))}
//                         </Box>
//                       </Box>
//                     );
//                   })}
//                 </AccordionDetails>
//               </Accordion>
//             </Box>
//           )}
//         </Box>
//       );
//     },
//     [
//       currentDomesticSelections,
//       domesticSelections,
//       currentDrawerOpen.cities,
//       drawerOpen.cities,
//       handleDomesticCitySelection,
//       handleSearchChange,
//       handleSelectAllCities,
//       searchFilters.cities,
//       statesData,
//       toggleDrawer,
//     ]
//   );

//   // Render international country drawer
//   const renderInternationalCountryDrawer = useCallback(
//     (type) => {
//       const selections =
//         type === "current"
//           ? currentInternationalSelections
//           : internationalSelections;
//       const toggle = (open) => toggleDrawer(type, { countries: open });

//       const allSelected =
//         selections.selectedCountries.length === sortedCountries.length;
//       const someSelected =
//         selections.selectedCountries.length > 0 && !allSelected;

//       return (
//         <Box sx={{ mt: 3, mb: 3 }}>
//           {/* Trigger Button */}
//           <Button
//             variant="outlined"
//             color="success"
//             fullWidth
//             onClick={() => toggle(true)}
//             endIcon={<ChevronDown />}
//             sx={{ justifyContent: "space-between" }}
//           >
//             {selections.selectedCountries.length > 0
//               ? `${selections.selectedCountries.length} countries selected`
//               : "Select Countries"}
//           </Button>

//           {/* Drawer */}
//           <Drawer
//             anchor="top"
//             open={
//               type === "current"
//                 ? currentDrawerOpen.countries
//                 : drawerOpen.countries
//             }
//             onClose={() => toggle(false)}
//             PaperProps={{
//               sx: {
//                 width: "98%",
//                 height: "100vh",
//                 borderRadius: 0,
//                 p: 2,
//                 display: "flex",
//                 flexDirection: "column",
//               },
//             }}
//           >
//             {/* Header */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 2,
//               }}
//             >
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                 Select Countries
//               </Typography>
//               <Button
//                 variant="outlined"
//                 color="warning"
//                 onClick={() => toggle(false)}
//               >
//                 Done
//               </Button>
//             </Box>

//             {/* Search */}
//             <TextField
//               fullWidth
//               placeholder="Search countries..."
//               variant="outlined"
//               size="small"
//               sx={{ mb: 2 }}
//               onChange={(e) => handleSearchChange("countries", e.target.value)}
//               InputProps={{
//                 startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
//               }}
//             />

//             {/* Select All */}
//             <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//               <Checkbox
//                 checked={allSelected}
//                 indeterminate={someSelected}
//                 onChange={async () => {
//                   const updated = allSelected
//                     ? []
//                     : sortedCountries.map((c) => c.name);
//                   await handleInternationalCountrySelection(updated, type);
//                 }}
//               />
//               <Typography variant="subtitle1" sx={{ ml: 1 }}>
//                 Select All Countries
//               </Typography>
//             </Box>

//             {/* Country List */}
//             <Box sx={{ flex: 1, overflow: "auto" }}>
//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(5, 1fr)",
//                   gap: 1,
//                 }}
//               >
//                 {sortedCountries
//                   .filter((country) =>
//                     country.name
//                       .toLowerCase()
//                       .includes(searchFilters.countries.toLowerCase())
//                   )
//                   .map((country) => {
//                     const isSelected = selections.selectedCountries.includes(
//                       country.name
//                     );
//                     return (
//                       <FormControlLabel
//                         key={`country-${country.name}`}
//                         control={
//                           <Checkbox
//                             checked={isSelected}
//                             onChange={async () => {
//                               const updated = isSelected
//                                 ? selections.selectedCountries.filter(
//                                     (c) => c !== country.name
//                                   )
//                                 : [
//                                     ...selections.selectedCountries,
//                                     country.name,
//                                   ];
//                               await handleInternationalCountrySelection(
//                                 updated,
//                                 type
//                               );
//                             }}
//                           />
//                         }
//                         label={country.name}
//                       />
//                     );
//                   })}
//               </Box>
//             </Box>
//           </Drawer>

//           {/* Accordion: Selected Countries */}
//           {selections.selectedCountries.length > 0 && (
//             <Box sx={{ mt: 2 }}>
//               <Accordion>
//                 <AccordionSummary expandIcon={<ChevronDown />}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
//                     View Selected Countries (
//                     {selections.selectedCountries.length})
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <Box
//                     sx={{
//                       display: "grid",
//                       gridTemplateColumns:
//                         "repeat(auto-fill, minmax(200px, 1fr))",
//                       gap: 1,
//                     }}
//                   >
//                     {selections.selectedCountries.map((country, index) => (
//                       <Chip
//                         key={`selected-country-${index}`}
//                         label={country}
//                         onDelete={async () => {
//                           const updated = selections.selectedCountries.filter(
//                             (_, i) => i !== index
//                           );
//                           await handleInternationalCountrySelection(
//                             updated,
//                             type
//                           );
//                         }}
//                         color="success"
//                         variant="outlined"
//                       />
//                     ))}
//                   </Box>
//                 </AccordionDetails>
//               </Accordion>
//             </Box>
//           )}
//         </Box>
//       );
//     },
//     [
//       sortedCountries,
//       currentInternationalSelections,
//       internationalSelections,
//       currentDrawerOpen.countries,
//       drawerOpen.countries,
//       handleInternationalCountrySelection,
//       handleSearchChange,
//       searchFilters.countries,
//       toggleDrawer,
//     ]
//   );

//   // Render international state drawer
//   const renderInternationalStateDrawer = useCallback(
//     (type) => {
//       const selections =
//         type === "current"
//           ? currentInternationalSelections
//           : internationalSelections;
//       const statesData =
//         type === "current" ? currentInternationalStates : internationalStates;
//       const toggle = (open) => toggleDrawer(type, { intStates: open });

//       if (selections.selectedCountries.length === 0) return null;

//       // Group selected states by country
//       const statesByCountry = selections.selectedStates;

//       // Calculate total available states
//       const totalStates = selections.selectedCountries.reduce(
//         (total, country) => {
//           const states = statesData[country] || [];
//           return total + states.length;
//         },
//         0
//       );

//       const selectedCount = Object.values(statesByCountry).reduce(
//         (acc, states) => acc + states.length,
//         0
//       );

//       return (
//         <Box sx={{ mt: 3, mb: 3 }}>
//           {/* Trigger Button */}
//           <Button
//             variant="outlined"
//             color="warning"
//             fullWidth
//             onClick={() => toggle(true)}
//             endIcon={<ChevronDown />}
//             sx={{ justifyContent: "space-between" }}
//           >
//             {selectedCount > 0
//               ? `${selectedCount} states selected`
//               : "Select States"}
//           </Button>

//           {/* Drawer for State Selection */}
//           <Drawer
//             anchor="top"
//             open={
//               type === "current"
//                 ? currentDrawerOpen.intStates
//                 : drawerOpen.intStates
//             }
//             onClose={() => toggle(false)}
//             PaperProps={{
//               sx: {
//                 width: "98%",
//                 height: "100vh",
//                 borderRadius: 0,
//                 p: 2,
//                 display: "flex",
//                 flexDirection: "column",
//               },
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 2,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 fontWeight={700}
//                 sx={{ color: "#ff9800" }}
//               >
//                 Select States
//               </Typography>
//               <Button
//                 variant="outlined"
//                 color="warning"
//                 onClick={() => toggle(false)}
//               >
//                 Done
//               </Button>
//             </Box>

//             {/* Search Field */}
//             <TextField
//               fullWidth
//               placeholder="Search states..."
//               variant="outlined"
//               size="small"
//               sx={{ mb: 2 }}
//               onChange={(e) => handleSearchChange("intStates", e.target.value)}
//               InputProps={{
//                 startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
//               }}
//             />

//             {/* Select All */}
//             <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//               <Checkbox
//                 checked={selectedCount > 0 && selectedCount === totalStates}
//                 indeterminate={selectedCount > 0 && selectedCount < totalStates}
//                 onChange={() => {
//                   selections.selectedCountries.forEach((country) => {
//                     const states = (statesData[country] || []).map(
//                       (s) => s.name
//                     );
//                     handleSelectAllStates(
//                       country,
//                       states,
//                       selectedCount !== totalStates,
//                       type
//                     );
//                   });
//                 }}
//               />
//               <Typography variant="subtitle1" sx={{ ml: 1 }}>
//                 Select All States
//               </Typography>
//             </Box>

//             {/* State Checkboxes */}
//             <Box sx={{ flex: 1, overflow: "auto" }}>
//               {selections.selectedCountries.map((country) => {
//                 const allStates = statesData[country] || [];
//                 const filteredStates = allStates
//                   .filter((s) =>
//                     s.name
//                       .toLowerCase()
//                       .includes(searchFilters.intStates.toLowerCase())
//                   )
//                   .sort((a, b) => a.name.localeCompare(b.name));

//                 if (filteredStates.length === 0) return null;

//                 const selectedStates = statesByCountry[country] || [];
//                 const allSelected = filteredStates.every((s) =>
//                   selectedStates.includes(s.name)
//                 );

//                 return (
//                   <Box key={`states-section-${country}`} sx={{ mb: 4 }}>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                       <Checkbox
//                         checked={allSelected}
//                         indeterminate={
//                           selectedStates.length > 0 && !allSelected
//                         }
//                         onChange={() => {
//                           const stateNames = filteredStates.map((s) => s.name);
//                           handleSelectAllStates(
//                             country,
//                             stateNames,
//                             !allSelected,
//                             type
//                           );
//                         }}
//                       />
//                       <Typography
//                         variant="subtitle1"
//                         sx={{ color: "orange", ml: 1 }}
//                       >
//                         {country}
//                       </Typography>
//                     </Box>

//                     <Box
//                       sx={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(5, 1fr)",
//                         gap: 1,
//                         ml: 4,
//                       }}
//                     >
//                       {filteredStates.map((state) => {
//                         const isSelected = selectedStates.includes(state.name);
//                         return (
//                           <FormControlLabel
//                             key={`state-${country}-${state.name}`}
//                             control={
//                               <Checkbox
//                                 checked={isSelected}
//                                 onChange={() =>
//                                   handleInternationalStateSelection(
//                                     country,
//                                     state.name,
//                                     !isSelected,
//                                     type
//                                   )
//                                 }
//                               />
//                             }
//                             label={state.name}
//                           />
//                         );
//                       })}
//                     </Box>
//                   </Box>
//                 );
//               })}
//             </Box>
//           </Drawer>

//           {/* Accordion for Selected States */}
//           {selectedCount > 0 && (
//             <Box sx={{ mt: 2 }}>
//               <Accordion>
//                 <AccordionSummary expandIcon={<ChevronDown />}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
//                     View Selected States ({selectedCount})
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   {Object.entries(statesByCountry).map(([country, states]) => (
//                     <Box key={`selected-states-${country}`} sx={{ mb: 4 }}>
//                       <Typography
//                         variant="subtitle1"
//                         sx={{ color: "orange", mb: 1 }}
//                       >
//                         {country}
//                       </Typography>
//                       <Box
//                         sx={{
//                           display: "grid",
//                           gridTemplateColumns:
//                             "repeat(auto-fill, minmax(200px, 1fr))",
//                           gap: 1,
//                           ml: 2,
//                         }}
//                       >
//                         {states.map((state, index) => (
//                           <Chip
//                             key={`selected-state-${country}-${state}-${index}`}
//                             label={state}
//                             onDelete={() =>
//                               handleInternationalStateSelection(
//                                 country,
//                                 state,
//                                 false,
//                                 type
//                               )
//                             }
//                             variant="outlined"
//                             color="success"
//                             sx={{ mb: 1 }}
//                           />
//                         ))}
//                       </Box>
//                     </Box>
//                   ))}
//                 </AccordionDetails>
//               </Accordion>
//             </Box>
//           )}
//         </Box>
//       );
//     },
//     [
//       currentInternationalSelections,
//       internationalSelections,
//       currentInternationalStates,
//       internationalStates,
//       currentDrawerOpen.intStates,
//       drawerOpen.intStates,
//       handleInternationalStateSelection,
//       handleSelectAllStates,
//       handleSearchChange,
//       searchFilters.intStates,
//       toggleDrawer,
//     ]
//   );

//   // Render international city drawer
//   const renderInternationalCityDrawer = useCallback(
//     (type) => {
//       const selections =
//         type === "current"
//           ? currentInternationalSelections
//           : internationalSelections;
//       const citiesData =
//         type === "current" ? currentInternationalCities : internationalCities;
//       const toggle = (open) => toggleDrawer(type, { intCities: open });

//       if (Object.keys(selections.selectedStates).length === 0) return null;

//       // Calculate total cities
//       const totalCities = Object.entries(selections.selectedStates).reduce(
//         (total, [country, states]) =>
//           total +
//           states.reduce((acc, state) => {
//             const stateKey = `${country}-${state}`;
//             const cities = citiesData[stateKey] || [];
//             return acc + cities.length;
//           }, 0),
//         0
//       );

//       const selectedCityCount = Object.values(selections.selectedCities).flat()
//         .length;

//       return (
//         <Box sx={{ mt: 3, mb: 3 }}>
//           {/* Trigger Button */}
//           <Button
//             variant="outlined"
//             color="warning"
//             fullWidth
//             onClick={() => toggle(true)}
//             endIcon={<ChevronDown />}
//             sx={{ justifyContent: "space-between" }}
//           >
//             {selectedCityCount > 0
//               ? `${selectedCityCount} cities selected`
//               : "Select Cities"}
//           </Button>

//           {/* Drawer UI */}
//           <Drawer
//             anchor="top"
//             open={
//               type === "current"
//                 ? currentDrawerOpen.intCities
//                 : drawerOpen.intCities
//             }
//             onClose={() => toggle(false)}
//             PaperProps={{
//               sx: {
//                 width: "98%",
//                 height: "100vh",
//                 borderRadius: 0,
//                 p: 2,
//                 display: "flex",
//                 flexDirection: "column",
//               },
//             }}
//           >
//             {/* Header */}
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 mb: 2,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 fontWeight={700}
//                 sx={{ color: "#ff9800" }}
//               >
//                 Select Cities
//               </Typography>
//               <Button
//                 variant="outlined"
//                 color="warning"
//                 onClick={() => toggle(false)}
//               >
//                 Done
//               </Button>
//             </Box>

//             {/* Search */}
//             <TextField
//               fullWidth
//               placeholder="Search cities..."
//               variant="outlined"
//               size="small"
//               sx={{ mb: 2 }}
//               onChange={(e) => handleSearchChange("intCities", e.target.value)}
//               InputProps={{
//                 startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
//               }}
//             />

//             {/* Select All Cities */}
//             <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//               <Checkbox
//                 checked={
//                   selectedCityCount > 0 && selectedCityCount === totalCities
//                 }
//                 indeterminate={
//                   selectedCityCount > 0 && selectedCityCount < totalCities
//                 }
//                 onChange={() => {
//                   const shouldSelectAll = selectedCityCount !== totalCities;

//                   Object.entries(selections.selectedStates).forEach(
//                     ([country, states]) => {
//                       states.forEach((state) => {
//                         const stateKey = `${country}-${state}`;
//                         const cities = citiesData[stateKey] || [];
//                         handleSelectAllStateCities(
//                           country,
//                           state,
//                           cities,
//                           shouldSelectAll,
//                           type
//                         );
//                       });
//                     }
//                   );
//                 }}
//               />
//               <Typography variant="subtitle1" sx={{ ml: 1 }}>
//                 Select All Cities
//               </Typography>
//             </Box>

//             {/* Country / State Sections */}
//             <Box sx={{ flex: 1, overflow: "auto" }}>
//               {Object.entries(selections.selectedStates).map(
//                 ([country, states]) =>
//                   states.map((state) => {
//                     const stateKey = `${country}-${state}`;
//                     const cities = citiesData[stateKey] || [];

//                     const filteredCities = cities
//                       .filter((city) =>
//                         city
//                           .toLowerCase()
//                           .includes(searchFilters.intCities.toLowerCase())
//                       )
//                       .sort((a, b) => a.localeCompare(b));

//                     const selectedCities =
//                       selections.selectedCities[stateKey] || [];
//                     const allSelected = filteredCities.every((city) =>
//                       selectedCities.includes(city)
//                     );

//                     if (filteredCities.length === 0) return null;

//                     return (
//                       <Box key={`cities-section-${stateKey}`} sx={{ mb: 4 }}>
//                         <Box
//                           sx={{ display: "flex", alignItems: "center", mb: 1 }}
//                         >
//                           <Checkbox
//                             checked={allSelected}
//                             indeterminate={
//                               selectedCities.length > 0 && !allSelected
//                             }
//                             onChange={() =>
//                               handleSelectAllStateCities(
//                                 country,
//                                 state,
//                                 filteredCities,
//                                 !allSelected,
//                                 type
//                               )
//                             }
//                           />
//                           <Typography
//                             variant="subtitle1"
//                             sx={{ color: "orange", ml: 1 }}
//                           >
//                             {country} - {state}
//                           </Typography>
//                         </Box>

//                         <Box
//                           sx={{
//                             display: "grid",
//                             gridTemplateColumns: "repeat(5, 1fr)",
//                             gap: 1,
//                             ml: 4,
//                           }}
//                         >
//                           {filteredCities.map((city) => {
//                             const isSelected = selectedCities.includes(city);
//                             return (
//                               <FormControlLabel
//                                 key={`city-${stateKey}-${city}`}
//                                 control={
//                                   <Checkbox
//                                     checked={isSelected}
//                                     onChange={() =>
//                                       handleInternationalCitySelection(
//                                         country,
//                                         state,
//                                         city,
//                                         !isSelected,
//                                         type
//                                       )
//                                     }
//                                   />
//                                 }
//                                 label={city}
//                               />
//                             );
//                           })}
//                         </Box>
//                       </Box>
//                     );
//                   })
//               )}
//             </Box>
//           </Drawer>

//           {/* Accordion for Selected Cities */}
//           {selectedCityCount > 0 && (
//             <Box sx={{ mt: 2 }}>
//               <Accordion>
//                 <AccordionSummary expandIcon={<ChevronDown />}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
//                     View Selected Cities ({selectedCityCount})
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   {Object.entries(selections.selectedCities).map(
//                     ([stateKey, cities]) => {
//                       const [country, state] = stateKey.split("-");
//                       return (
//                         <Box key={`selected-cities-${stateKey}`} sx={{ mb: 4 }}>
//                           <Typography
//                             variant="subtitle1"
//                             sx={{ color: "orange", mb: 1 }}
//                           >
//                             {country} - {state}
//                           </Typography>
//                           <Box
//                             sx={{
//                               display: "grid",
//                               gridTemplateColumns:
//                                 "repeat(auto-fill, minmax(200px, 1fr))",
//                               gap: 1,
//                               ml: 2,
//                             }}
//                           >
//                             {cities.map((city, index) => (
//                               <Chip
//                                 key={`selected-city-${stateKey}-${city}-${index}`}
//                                 label={city}
//                                 onDelete={() =>
//                                   handleInternationalCitySelection(
//                                     country,
//                                     state,
//                                     city,
//                                     false,
//                                     type
//                                   )
//                                 }
//                                 color="success"
//                                 variant="outlined"
//                                 sx={{
//                                   "& .MuiChip-label": {
//                                     overflow: "hidden",
//                                     textOverflow: "ellipsis",
//                                     whiteSpace: "nowrap",
//                                   },
//                                 }}
//                               />
//                             ))}
//                           </Box>
//                         </Box>
//                       );
//                     }
//                   )}
//                 </AccordionDetails>
//               </Accordion>
//             </Box>
//           )}
//         </Box>
//       );
//     },
//     [
//       currentInternationalSelections,
//       internationalSelections,
//       currentInternationalCities,
//       internationalCities,
//       currentDrawerOpen.intCities,
//       drawerOpen.intCities,
//       handleInternationalCitySelection,
//       handleSelectAllStateCities,
//       handleSearchChange,
//       searchFilters.intCities,
//       toggleDrawer,
//     ]
//   );

//   // Main render
//   return (
//     <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
//       <Typography
//         variant="h6"
//         fontWeight={700}
//         sx={{ mb: 3, color: "#ff9800" }}
//       >
//         Brand Expansion Location Details
//       </Typography>

//       {/* International Expansion Toggle */}
//       <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
//         <Typography variant="subtitle2" mt={0} gap={2}>
//           Is your brand expanding internationally? :
//         </Typography>
//         <RadioGroup
//           row
//           value={
//             data?.isInternationalExpansion === null
//               ? ""
//               : data?.isInternationalExpansion
//           }
//           sx={{ gap: 11, justifyContent: "start", ml: 15 }}
//           onChange={(e) =>
//             handleInternationalExpansionChange(e.target.value === "true")
//           }
//         >
//           <FormControlLabel value="true" control={<Radio />} label="Yes" />
//           <FormControlLabel value="false" control={<Radio />} label="No" />
//         </RadioGroup>
//         {errors?.isInternationalExpansion && (
//           <FormHelperText error sx={{ ml: 2 }}>
//             {errors.isInternationalExpansion}
//           </FormHelperText>
//         )}
//       </Box>

//       {/* Current Outlet Locations */}
//       <Divider sx={{ my: 2 }} />

//       <Typography
//         variant="h6"
//         fontWeight={700}
//         sx={{ mb: 0, color: "#ff9800" }}
//       >
//         Current Outlet Locations
//       </Typography>

//       <RadioGroup
//         sx={{ justifyContent: "center", gap: 10 }}
//         row
//         value={currentOutletLocationType}
//         onChange={handleCurrentOutletLocationTypeChange}
//       >
//         <FormControlLabel value="domestic" control={<Radio />} label="India" />
//         <FormControlLabel
//           value="international"
//           control={<Radio />}
//           label="International"
//         />
//       </RadioGroup>

//       {currentOutletLocationType === "domestic" ? (
//         <>
//           {renderDomesticStateDrawer("current")}
//           {renderDomesticDistrictDrawer("current")}
//           {renderDomesticCityDrawer("current")}
//         </>
//       ) : (
//         <>
//           {renderInternationalCountryDrawer("current")}
//           {renderInternationalStateDrawer("current")}
//           {renderInternationalCityDrawer("current")}
//         </>
//       )}

//       {/* Expansion Locations */}
//       <Divider sx={{ my: 2 }} />
//       <Typography
//         variant="h6"
//         fontWeight={700}
//         sx={{ mb: 3, color: "#ff9800" }}
//       >
//         Expansion Locations
//       </Typography>
//       <RadioGroup
//         row
//         value={locationType}
//         onChange={handleLocationTypeChange}
//         sx={{ justifyContent: "center", gap: 10 }}
//       >
//         <FormControlLabel value="domestic" control={<Radio />} label="India" />
//         <FormControlLabel
//           value="international"
//           control={<Radio />}
//           label="International"
//         />
//       </RadioGroup>

//       {locationType === "domestic" ? (
//         <>
//           {renderDomesticStateDrawer("expansion")}
//           {renderDomesticDistrictDrawer("expansion")}
//           {renderDomesticCityDrawer("expansion")}
//         </>
//       ) : (
//         <>
//           {renderInternationalCountryDrawer("expansion")}
//           {renderInternationalStateDrawer("expansion")}
//           {renderInternationalCityDrawer("expansion")}
//         </>
//       )}

//       {/* Loading and Error Handling */}
//       <Backdrop
//         open={loading.states || loading.countries || loading.formSubmit}
//         sx={{ zIndex: 9999 }}
//       >
//         <CircularProgress color="inherit" />
//       </Backdrop>
//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError(null)}
//       >
//         <Alert
//           onClose={() => setError(null)}
//           severity="error"
//           sx={{ width: "100%" }}
//         >
//           {error}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default BrandExpansionLocationDetails;

// File: BrandExpansionLocationDetails.js

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//   Box,
//   Typography,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Button,
//   Divider,
//   Chip,
//   Checkbox,
//   TextField,
//   Backdrop,
//   CircularProgress,
//   Drawer,
//   Alert,
//   Snackbar,
//   FormHelperText,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";
// import { ChevronDown, Search } from "lucide-react";
// import { useSnackbar } from "notistack";
// import debounce from "lodash/debounce";
// import axios from "axios";

// import DomesticStateDrawer from "../BrandLIstingRegister/ExpansionLocationhandle/DomesticStateDrawer";
// import DomesticDistrictDrawer from "../BrandLIstingRegister/ExpansionLocationhandle/DomesticDistrictDrawer";
// import DomesticCityDrawer from "../BrandLIstingRegister/ExpansionLocationhandle/DomesticCityDrawer";
// import InternationalCountryDrawer from "../BrandLIstingRegister/ExpansionLocationhandle/InternationalCountryDrawer";
// import InternationalStateDrawer from "../BrandLIstingRegister/ExpansionLocationhandle/InternationalStateDrawer";
// import InternationalCityDrawer from "../BrandLIstingRegister/ExpansionLocationhandle/InternationalCityDrawer";

// // Cache for API responses
// const apiCache = {
//   domestic: null,
//   countries: null,
//   states: {},
//   cities: {},
// };

// const BrandExpansionLocationDetails = ({ data, onChange, errors }) => {
//   const { enqueueSnackbar } = useSnackbar();

//   // Location type state
//   const [locationType, setLocationType] = useState("domestic");
//   const [currentOutletLocationType, setCurrentOutletLocationType] =
//     useState("domestic");

//   // Domestic selections for expansion locations
//   const [domesticSelections, setDomesticSelections] = useState({
//     selectedStates: [],
//     selectedDistricts: [],
//     selectedCities: [],
//   });

//   // International selections for expansion locations
//   const [internationalSelections, setInternationalSelections] = useState({
//     selectedCountries: [],
//     selectedStates: {},
//     selectedCities: {},
//   });

//   // Current outlet selections
//   const [currentDomesticSelections, setCurrentDomesticSelections] = useState({
//     selectedStates: [],
//     selectedDistricts: [],
//     selectedCities: [],
//   });

//   const [currentInternationalSelections, setCurrentInternationalSelections] =
//     useState({
//       selectedCountries: [],
//       selectedStates: {},
//       selectedCities: {},
//     });

//   // Location data
//   const [statesData, setStatesData] = useState([]);
//   const [states, setStates] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [internationalStates, setInternationalStates] = useState({});
//   const [internationalCities, setInternationalCities] = useState({});
//   const [currentInternationalStates, setCurrentInternationalStates] = useState(
//     {}
//   );
//   const [currentInternationalCities, setCurrentInternationalCities] = useState(
//     {}
//   );

//   const [loading, setLoading] = useState({
//     states: false,
//     countries: false,
//     formSubmit: false,
//   });

//   const [error, setError] = useState(null);

//   // Drawer states
//   const [drawerOpen, setDrawerOpen] = useState({
//     states: false,
//     districts: false,
//     cities: false,
//     countries: false,
//     intStates: false,
//     intCities: false,
//   });

//   // Collapse states for current locations
//   const [currentDrawerOpen, setCurrentDrawerOpen] = useState({
//     states: false,
//     districts: false,
//     cities: false,
//     countries: false,
//     intStates: false,
//     intCities: false,
//   });

//   // Search filters
//   const [searchFilters, setSearchFilters] = useState({
//     states: "",
//     districts: "",
//     cities: "",
//     countries: "",
//     intStates: "",
//     intCities: "",
//   });

//   // Debounced search functions
//   const handleSearchChange = useCallback(
//     debounce((type, value) => {
//       setSearchFilters((prev) => ({ ...prev, [type]: value.toLowerCase() }));
//     }, 300),
//     []
//   );

//   // Toggle drawer
//   const toggleDrawer = useCallback((type, open) => {
//     if (type === "current") {
//       setCurrentDrawerOpen((prev) => ({ ...prev, ...open }));
//     } else {
//       setDrawerOpen((prev) => ({ ...prev, ...open }));
//     }
//   }, []);

//   // Memoized sorted and filtered states
//   const sortedStates = useMemo(() => {
//     return states
//       .filter((state) =>
//         state.name.toLowerCase().includes(searchFilters.states)
//       )
//       .sort((a, b) => a.name.localeCompare(b.name));
//   }, [states, searchFilters.states]);

//   // Memoized sorted and filtered countries
//   const sortedCountries = useMemo(() => {
//     return countries
//       .filter((country) =>
//         country.name.toLowerCase().includes(searchFilters.countries)
//       )
//       .sort((a, b) => a.name.localeCompare(b.name));
//   }, [countries, searchFilters.countries]);

//   // Fetch domestic data (Indian states, districts, cities) with caching
//   const fetchDomesticData = useCallback(async () => {
//     if (apiCache.domestic) {
//       setStatesData(apiCache.domestic);
//       setStates(
//         apiCache.domestic.map((state) => ({ id: state.iso2, name: state.name }))
//       );
//       return;
//     }

//     setLoading((prev) => ({ ...prev, states: true }));
//     try {
//       const response = await axios.get(
//         "https://raw.githubusercontent.com/prasad-gowda/india-state-district-cities/master/India-state-district-city.json"
//       );
//       apiCache.domestic = response.data;
//       setStatesData(response.data);
//       setStates(
//         response.data.map((state) => ({ id: state.iso2, name: state.name }))
//       );
//     } catch (error) {
//       console.error("Error fetching domestic data:", error);
//       setError("Failed to load domestic locations. Please try again later.");
//       enqueueSnackbar("Failed to load domestic locations", {
//         variant: "error",
//       });
//     } finally {
//       setLoading((prev) => ({ ...prev, states: false }));
//     }
//   }, [enqueueSnackbar]);

//   // Fetch international countries with caching
//   const fetchCountries = useCallback(async () => {
//     if (apiCache.countries) {
//       setCountries(apiCache.countries);
//       return;
//     }

//     setLoading((prev) => ({ ...prev, countries: true }));
//     try {
//       const response = await axios.get(
//         "https://countriesnow.space/api/v0.1/countries"
//       );
//       const countryData = response.data.data.map((country) => ({
//         id: country.iso2,
//         name: country.country,
//       }));

//       apiCache.countries = countryData;
//       setCountries(countryData);
//     } catch (error) {
//       console.error("Error fetching countries:", error);
//       setError("Failed to load countries. Please try again later.");
//       enqueueSnackbar("Failed to load countries", { variant: "error" });
//     } finally {
//       setLoading((prev) => ({ ...prev, countries: false }));
//     }
//   }, [enqueueSnackbar]);

//   // Define updateFormData first
//   const updateFormData = useCallback(
//     (type, locationType, selections) => {
//       const locationKey =
//         type === "current" ? "currentOutletLocations" : "expansionLocations";

//       if (locationType === "domestic") {
//         const newLocations = [];

//         // Process states
//         selections.selectedStates.forEach((stateName) => {
//           const existingStateIndex = newLocations.findIndex(
//             (loc) => loc.state === stateName
//           );

//           if (existingStateIndex === -1) {
//             newLocations.push({
//               state: stateName,
//               districts: [],
//             });
//           }
//         });

//         // Process districts
//         selections.selectedDistricts.forEach(({ state, district }) => {
//           const stateIndex = newLocations.findIndex(
//             (loc) => loc.state === state
//           );

//           if (stateIndex !== -1) {
//             const districtExists = newLocations[stateIndex].districts.some(
//               (d) => d.district === district
//             );

//             if (!districtExists) {
//               newLocations[stateIndex].districts.push({
//                 district,
//                 cities: [],
//               });
//             }
//           }
//         });

//         // Process cities
//         selections.selectedCities.forEach(({ state, district, city }) => {
//           const stateIndex = newLocations.findIndex(
//             (loc) => loc.state === state
//           );

//           if (stateIndex !== -1) {
//             const districtIndex = newLocations[stateIndex].districts.findIndex(
//               (d) => d.district === district
//             );

//             if (districtIndex === -1) {
//               newLocations[stateIndex].districts.push({
//                 district,
//                 cities: [city],
//               });
//             } else {
//               if (
//                 !newLocations[stateIndex].districts[
//                   districtIndex
//                 ].cities.includes(city)
//               ) {
//                 newLocations[stateIndex].districts[districtIndex].cities.push(
//                   city
//                 );
//               }
//             }
//           }
//         });

//         const updatedData = {
//           ...data,
//           [locationKey]: {
//             ...data[locationKey],
//             domestic: {
//               locations: newLocations,
//             },
//           },
//         };

//         onChange(updatedData);
//       } else {
//         // International locations
//         const newLocations = [];

//         // Process countries
//         selections.selectedCountries.forEach((country) => {
//           const countryExists = newLocations.some(
//             (loc) => loc.country === country
//           );
//           if (!countryExists) {
//             newLocations.push({
//               country,
//               states: [],
//             });
//           }
//         });

//         // Process states
//         Object.entries(selections.selectedStates).forEach(
//           ([country, states]) => {
//             const countryIndex = newLocations.findIndex(
//               (loc) => loc.country === country
//             );

//             if (countryIndex !== -1) {
//               states.forEach((state) => {
//                 const stateExists = newLocations[countryIndex].states.some(
//                   (s) => s.state === state
//                 );

//                 if (!stateExists) {
//                   newLocations[countryIndex].states.push({
//                     state,
//                     cities: [],
//                   });
//                 }
//               });
//             }
//           }
//         );

//         // Process cities
//         Object.entries(selections.selectedCities).forEach(
//           ([stateKey, cities]) => {
//             const [country, state] = stateKey.split("-");
//             const countryIndex = newLocations.findIndex(
//               (loc) => loc.country === country
//             );

//             if (countryIndex !== -1) {
//               const stateIndex = newLocations[countryIndex].states.findIndex(
//                 (s) => s.state === state
//               );

//               if (stateIndex === -1) {
//                 newLocations[countryIndex].states.push({
//                   state,
//                   cities,
//                 });
//               } else {
//                 cities.forEach((city) => {
//                   if (
//                     !newLocations[countryIndex].states[
//                       stateIndex
//                     ].cities.includes(city)
//                   ) {
//                     newLocations[countryIndex].states[stateIndex].cities.push(
//                       city
//                     );
//                   }
//                 });
//               }
//             }
//           }
//         );

//         const updatedData = {
//           ...data,
//           [locationKey]: {
//             ...data[locationKey],
//             international: {
//               locations: newLocations,
//             },
//           },
//         };

//         onChange(updatedData);
//       }
//     },
//     [data, onChange]
//   );

//   // Fetch states for a country
//   const getStatesByCountry = useCallback(
//     async (countryName, callback) => {
//       if (apiCache.states[countryName]) {
//         callback(apiCache.states[countryName]);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           "https://countriesnow.space/api/v0.1/countries/states",
//           { country: countryName }
//         );
//         const states = response.data.data?.states || [];
//         apiCache.states[countryName] = states;
//         callback(states);
//       } catch (error) {
//         console.error("Error fetching states for country:", countryName, error);
//         enqueueSnackbar(`Failed to load states for ${countryName}`, {
//           variant: "error",
//         });
//         callback([]);
//       }
//     },
//     [enqueueSnackbar]
//   );

//   // Fetch cities for a country and state
//   const getCitiesByCountryAndState = useCallback(
//     async (countryName, stateName, callback) => {
//       const cacheKey = `${countryName}-${stateName}`;
//       if (apiCache.cities[cacheKey]) {
//         callback(apiCache.cities[cacheKey]);
//         return;
//       }

//       try {
//         const response = await axios.post(
//           "https://countriesnow.space/api/v0.1/countries/state/cities",
//           { country: countryName, state: stateName }
//         );
//         const cities = response.data.data || [];
//         apiCache.cities[cacheKey] = cities;
//         callback(cities);
//       } catch (error) {
//         console.error(
//           "Error fetching cities for country and state:",
//           countryName,
//           stateName,
//           error
//         );
//         enqueueSnackbar(
//           `Failed to load cities for ${stateName}, ${countryName}`,
//           { variant: "error" }
//         );
//         callback([]);
//       }
//     },
//     [enqueueSnackbar]
//   );

//   // Debounced versions of API calls
//   const debouncedGetStatesByCountry = useMemo(
//     () => debounce(getStatesByCountry, 500),
//     [getStatesByCountry]
//   );

//   const debouncedGetCitiesByCountryAndState = useMemo(
//     () => debounce(getCitiesByCountryAndState, 500),
//     [getCitiesByCountryAndState]
//   );

//   // Initialize component with data
//   useEffect(() => {
//     fetchDomesticData();
//     fetchCountries();

//     // Initialize current outlet locations
//     if (data?.currentOutletLocations) {
//       // Domestic locations
//       if (data.currentOutletLocations.domestic?.locations?.length > 0) {
//         const domesticLocations =
//           data.currentOutletLocations.domestic.locations;
//         const selectedStates = domesticLocations.map((loc) => loc.state);
//         const selectedDistricts = domesticLocations.flatMap(
//           (loc) =>
//             loc.districts?.map((district) => ({
//               state: loc.state,
//               district: district.district,
//             })) || []
//         );
//         const selectedCities = domesticLocations.flatMap(
//           (loc) =>
//             loc.districts?.flatMap(
//               (district) =>
//                 district.cities?.map((city) => ({
//                   state: loc.state,
//                   district: district.district,
//                   city,
//                 })) || []
//             ) || []
//         );

//         setCurrentDomesticSelections({
//           selectedStates,
//           selectedDistricts,
//           selectedCities,
//         });
//       }

//       // International locations
//       if (data.currentOutletLocations.international?.locations?.length > 0) {
//         const intlLocations =
//           data.currentOutletLocations.international.locations;
//         const selectedCountries = intlLocations.map((loc) => loc.country);
//         const selectedStates = {};
//         const selectedCities = {};

//         intlLocations.forEach((loc) => {
//           if (loc.states?.length > 0) {
//             selectedStates[loc.country] = loc.states.map(
//               (state) => state.state
//             );

//             loc.states.forEach((state) => {
//               const stateKey = `${loc.country}-${state.state}`;
//               if (state.cities?.length > 0) {
//                 selectedCities[stateKey] = state.cities;
//               }
//             });
//           }
//         });

//         setCurrentInternationalSelections({
//           selectedCountries,
//           selectedStates,
//           selectedCities,
//         });

//         // Load states and cities for the selected countries
//         selectedCountries.forEach((country) => {
//           debouncedGetStatesByCountry(country, (states) => {
//             setCurrentInternationalStates((prev) => ({
//               ...prev,
//               [country]: states,
//             }));
//           });
//         });

//         Object.entries(selectedStates).forEach(([country, states]) => {
//           states.forEach((state) => {
//             const stateKey = `${country}-${state}`;
//             debouncedGetCitiesByCountryAndState(country, state, (cities) => {
//               setCurrentInternationalCities((prev) => ({
//                 ...prev,
//                 [stateKey]: cities,
//               }));
//             });
//           });
//         });
//       }
//     }

//     // Set initial location type based on which has data
//     if (data?.currentOutletLocations?.domestic?.locations?.length > 0) {
//       setCurrentOutletLocationType("domestic");
//     } else if (
//       data?.currentOutletLocations?.international?.locations?.length > 0
//     ) {
//       setCurrentOutletLocationType("international");
//     }
//   }, [
//     data,
//     fetchDomesticData,
//     fetchCountries,
//     debouncedGetStatesByCountry,
//     debouncedGetCitiesByCountryAndState,
//   ]);

//   // Handle international expansion selection
//   const handleInternationalExpansionChange = useCallback(
//     (value) => {
//       const newValue = value === data?.isInternationalExpansion ? null : value;
//       onChange({
//         ...data,
//         isInternationalExpansion: newValue,
//       });
//     },
//     [data, onChange]
//   );

//   // Handle location type change (domestic/international)
//   const handleLocationTypeChange = useCallback((e) => {
//     setLocationType(e.target.value);
//   }, []);

//   // Handle current outlet location type change
//   const handleCurrentOutletLocationTypeChange = useCallback((e) => {
//     setCurrentOutletLocationType(e.target.value);
//   }, []);

//   // Handle domestic state selection
//   const handleDomesticStateSelection = useCallback(
//     (selectedStates, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentDomesticSelections
//           : setDomesticSelections;

//       setSelections((prev) => ({
//         ...prev,
//         selectedStates,
//         selectedDistricts: [],
//         selectedCities: [],
//       }));

//       // Update form data immediately
//       updateFormData(type, "domestic", {
//         selectedStates,
//         selectedDistricts: [],
//         selectedCities: [],
//       });
//     },
//     [updateFormData]
//   );

//   // Handle domestic district selection
//   const handleDomesticDistrictSelection = useCallback(
//     (stateName, districtName, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentDomesticSelections
//           : setDomesticSelections;

//       setSelections((prev) => {
//         const newSelections = {
//           selectedStates: [...prev.selectedStates],
//           selectedDistricts: [...prev.selectedDistricts],
//           selectedCities: [...prev.selectedCities],
//         };

//         if (isSelected) {
//           newSelections.selectedDistricts = [
//             ...newSelections.selectedDistricts,
//             { state: stateName, district: districtName },
//           ];
//           newSelections.selectedCities = newSelections.selectedCities.filter(
//             (city) =>
//               !(city.state === stateName && city.district === districtName)
//           );
//         } else {
//           newSelections.selectedDistricts =
//             newSelections.selectedDistricts.filter(
//               (d) => !(d.state === stateName && d.district === districtName)
//             );
//           newSelections.selectedCities = newSelections.selectedCities.filter(
//             (city) =>
//               !(city.state === stateName && city.district === districtName)
//           );
//         }

//         // Update form data immediately
//         updateFormData(type, "domestic", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   // Handle domestic city selection
//   const handleDomesticCitySelection = useCallback(
//     (stateName, districtName, cityName, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentDomesticSelections
//           : setDomesticSelections;

//       setSelections((prev) => {
//         const newSelectedCities = [...prev.selectedCities];
//         const cityObj = {
//           state: stateName,
//           district: districtName,
//           city: cityName,
//         };

//         if (isSelected) {
//           newSelectedCities.push(cityObj);
//         } else {
//           const index = newSelectedCities.findIndex(
//             (c) =>
//               c.state === stateName &&
//               c.district === districtName &&
//               c.city === cityName
//           );
//           if (index !== -1) {
//             newSelectedCities.splice(index, 1);
//           }
//         }

//         const newSelections = {
//           ...prev,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "domestic", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   const handleSelectAllDistricts = useCallback(
//     (stateName, districts, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentDomesticSelections
//           : setDomesticSelections;

//       setSelections((prev) => {
//         let newSelectedDistricts = [...prev.selectedDistricts];
//         let newSelectedCities = [...prev.selectedCities];

//         if (isSelected) {
//           // Add all districts and remove any cities from these districts
//           districts.forEach((district) => {
//             if (
//               !newSelectedDistricts.some(
//                 (d) => d.state === stateName && d.district === district
//               )
//             ) {
//               newSelectedDistricts.push({ state: stateName, district });
//             }
//             // Remove any cities from this district
//             newSelectedCities = newSelectedCities.filter(
//               (city) =>
//                 !(city.state === stateName && city.district === district)
//             );
//           });
//         } else {
//           // Remove all districts and their cities for this state
//           newSelectedDistricts = newSelectedDistricts.filter(
//             (d) => d.state !== stateName
//           );
//           newSelectedCities = newSelectedCities.filter(
//             (city) => city.state !== stateName
//           );
//         }

//         const newSelections = {
//           ...prev,
//           selectedDistricts: newSelectedDistricts,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "domestic", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   // Handle "Select All" for cities in a district
//   const handleSelectAllCities = useCallback(
//     (stateName, districtName, cities, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentDomesticSelections
//           : setDomesticSelections;

//       setSelections((prev) => {
//         let newSelectedCities = [...prev.selectedCities];

//         if (isSelected) {
//           // Add all cities
//           cities.forEach((city) => {
//             if (
//               !newSelectedCities.some(
//                 (c) =>
//                   c.state === stateName &&
//                   c.district === districtName &&
//                   c.city === city
//               )
//             ) {
//               newSelectedCities.push({
//                 state: stateName,
//                 district: districtName,
//                 city,
//               });
//             }
//           });
//         } else {
//           // Remove all cities for this district
//           newSelectedCities = newSelectedCities.filter(
//             (c) => !(c.state === stateName && c.district === districtName)
//           );
//         }

//         const newSelections = {
//           ...prev,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "domestic", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   // Handle international country selection
//   const handleInternationalCountrySelection = useCallback(
//     async (selectedCountries, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentInternationalSelections
//           : setInternationalSelections;
//       const setStatesData =
//         type === "current"
//           ? setCurrentInternationalStates
//           : setInternationalStates;

//       setSelections((prev) => ({
//         ...prev,
//         selectedCountries,
//         selectedStates: {},
//         selectedCities: {},
//       }));

//       // Update form data immediately
//       updateFormData(type, "international", {
//         selectedCountries,
//         selectedStates: {},
//         selectedCities: {},
//       });

//       // Fetch states for newly selected countries
//       const newStatesData = {};
//       for (const country of selectedCountries) {
//         if (!apiCache.states[country]) {
//           debouncedGetStatesByCountry(country, (states) => {
//             setStatesData((prev) => ({ ...prev, [country]: states }));
//           });
//         }
//       }
//     },
//     [debouncedGetStatesByCountry, updateFormData]
//   );

//   // Handle international state selection
//   const handleInternationalStateSelection = useCallback(
//     async (countryName, stateName, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentInternationalSelections
//           : setInternationalSelections;

//       setSelections((prev) => {
//         const newSelectedStates = { ...prev.selectedStates };
//         const newSelectedCities = { ...prev.selectedCities };

//         if (!newSelectedStates[countryName]) {
//           newSelectedStates[countryName] = [];
//         }

//         if (isSelected) {
//           newSelectedStates[countryName] = [
//             ...newSelectedStates[countryName],
//             stateName,
//           ];
//         } else {
//           newSelectedStates[countryName] = newSelectedStates[
//             countryName
//           ].filter((s) => s !== stateName);
//           if (newSelectedStates[countryName].length === 0) {
//             delete newSelectedStates[countryName];
//           }
//         }

//         // Clear cities for the country-state combination when states change
//         const stateKey = `${countryName}-${stateName}`;
//         if (newSelectedCities[stateKey]) {
//           delete newSelectedCities[stateKey];
//         }

//         const newSelections = {
//           ...prev,
//           selectedStates: newSelectedStates,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "international", newSelections);

//         return newSelections;
//       });

//       // Fetch cities for newly selected states
//       if (isSelected) {
//         const setCitiesData =
//           type === "current"
//             ? setCurrentInternationalCities
//             : setInternationalCities;
//         const cacheKey = `${countryName}-${stateName}`;

//         if (!apiCache.cities[cacheKey]) {
//           debouncedGetCitiesByCountryAndState(
//             countryName,
//             stateName,
//             (cities) => {
//               setCitiesData((prev) => ({ ...prev, [cacheKey]: cities }));
//             }
//           );
//         }
//       }
//     },
//     [debouncedGetCitiesByCountryAndState, updateFormData]
//   );

//   // Handle international city selection
//   const handleInternationalCitySelection = useCallback(
//     (countryName, stateName, cityName, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentInternationalSelections
//           : setInternationalSelections;

//       setSelections((prev) => {
//         const newSelectedCities = { ...prev.selectedCities };
//         const stateKey = `${countryName}-${stateName}`;

//         if (!newSelectedCities[stateKey]) {
//           newSelectedCities[stateKey] = [];
//         }

//         if (isSelected) {
//           newSelectedCities[stateKey] = [
//             ...newSelectedCities[stateKey],
//             cityName,
//           ];
//         } else {
//           newSelectedCities[stateKey] = newSelectedCities[stateKey].filter(
//             (c) => c !== cityName
//           );
//           if (newSelectedCities[stateKey].length === 0) {
//             delete newSelectedCities[stateKey];
//           }
//         }

//         const newSelections = {
//           ...prev,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "international", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   // Handle "Select All" for states in a country
//   const handleSelectAllStates = useCallback(
//     (countryName, states, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentInternationalSelections
//           : setInternationalSelections;

//       setSelections((prev) => {
//         const newSelectedStates = { ...prev.selectedStates };
//         const newSelectedCities = { ...prev.selectedCities };

//         if (isSelected) {
//           // Add all states for this country
//           newSelectedStates[countryName] = states;

//           // Remove any cities for states that are being selected (since we're selecting the whole state)
//           states.forEach((stateName) => {
//             const stateKey = `${countryName}-${stateName}`;
//             if (newSelectedCities[stateKey]) {
//               delete newSelectedCities[stateKey];
//             }
//           });
//         } else {
//           // Remove all states for this country
//           delete newSelectedStates[countryName];

//           // Remove all cities for this country
//           Object.keys(newSelectedCities).forEach((key) => {
//             if (key.startsWith(`${countryName}-`)) {
//               delete newSelectedCities[key];
//             }
//           });
//         }

//         const newSelections = {
//           ...prev,
//           selectedStates: newSelectedStates,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "international", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   // Handle "Select All" for cities in a state
//   const handleSelectAllStateCities = useCallback(
//     (countryName, stateName, cities, isSelected, type) => {
//       const setSelections =
//         type === "current"
//           ? setCurrentInternationalSelections
//           : setInternationalSelections;

//       setSelections((prev) => {
//         const newSelectedCities = { ...prev.selectedCities };
//         const stateKey = `${countryName}-${stateName}`;

//         if (isSelected) {
//           newSelectedCities[stateKey] = [...cities];
//         } else {
//           delete newSelectedCities[stateKey];
//         }

//         const newSelections = {
//           ...prev,
//           selectedCities: newSelectedCities,
//         };

//         // Update form data immediately
//         updateFormData(type, "international", newSelections);

//         return newSelections;
//       });
//     },
//     [updateFormData]
//   );

//   // Remove location items
//   const removeLocationItems = useCallback(
//     (type, locationType, field, index) => {
//       const updatedData = { ...data };
//       const locations = [...updatedData[type][locationType].locations];

//       if (field === "state" && locationType === "domestic") {
//         locations.splice(index, 1);
//       } else if (field === "district" && locationType === "domestic") {
//         const stateIndex = Math.floor(index / 1000);
//         const districtIndex = index % 1000;
//         if (locations[stateIndex] && locations[stateIndex].districts) {
//           locations[stateIndex].districts.splice(districtIndex, 1);
//         }
//       } else if (field === "city" && locationType === "domestic") {
//         const stateIndex = Math.floor(index / 1000000);
//         const districtIndex = Math.floor((index % 1000000) / 1000);
//         const cityIndex = index % 1000;
//         if (
//           locations[stateIndex] &&
//           locations[stateIndex].districts &&
//           locations[stateIndex].districts[districtIndex]
//         ) {
//           locations[stateIndex].districts[districtIndex].cities.splice(
//             cityIndex,
//             1
//           );
//         }
//       } else if (field === "country" && locationType === "international") {
//         locations.splice(index, 1);
//       } else if (field === "state" && locationType === "international") {
//         const countryIndex = Math.floor(index / 1000);
//         const stateIndex = index % 1000;
//         if (locations[countryIndex] && locations[countryIndex].states) {
//           locations[countryIndex].states.splice(stateIndex, 1);
//         }
//       } else if (field === "city" && locationType === "international") {
//         const countryIndex = Math.floor(index / 1000000);
//         const stateIndex = Math.floor((index % 1000000) / 1000);
//         const cityIndex = index % 1000;
//         if (
//           locations[countryIndex] &&
//           locations[countryIndex].states &&
//           locations[countryIndex].states[stateIndex]
//         ) {
//           locations[countryIndex].states[stateIndex].cities.splice(
//             cityIndex,
//             1
//           );
//         }
//       }

//       updatedData[type][locationType].locations = locations;
//       onChange(updatedData);
//     },
//     [data, onChange]
//   );

//   // Helper function to flatten locations for display
//   const flattenLocations = (locations = [], type) => {
//     const result = [];

//     if (!locations || !Array.isArray(locations)) return result;

//     if (type === "domestic") {
//       locations.forEach((stateObj, stateIndex) => {
//         if (!stateObj) return;

//         // Add state
//         result.push({
//           type: "state",
//           label: stateObj.state,
//           index: stateIndex,
//         });

//         // Add districts
//         stateObj.districts?.forEach((districtObj, districtIndex) => {
//           if (!districtObj) return;

//           result.push({
//             type: "district",
//             label: `${stateObj.state} - ${districtObj.district}`,
//             index: stateIndex * 1000 + districtIndex,
//           });

//           // Add cities
//           districtObj.cities?.forEach((city, cityIndex) => {
//             result.push({
//               type: "city",
//               label: `${stateObj.state} - ${districtObj.district} - ${city}`,
//               index: stateIndex * 1000000 + districtIndex * 1000 + cityIndex,
//             });
//           });
//         });
//       });
//     } else {
//       // international
//       locations.forEach((countryObj, countryIndex) => {
//         if (!countryObj) return;

//         // Add country
//         result.push({
//           type: "country",
//           label: countryObj.country,
//           index: countryIndex,
//         });

//         // Add states
//         countryObj.states?.forEach((stateObj, stateIndex) => {
//           if (!stateObj) return;

//           result.push({
//             type: "state",
//             label: `${countryObj.country} - ${stateObj.state}`,
//             index: countryIndex * 1000 + stateIndex,
//           });

//           // Add cities
//           stateObj.cities?.forEach((city, cityIndex) => {
//             result.push({
//               type: "city",
//               label: `${countryObj.country} - ${stateObj.state} - ${city}`,
//               index: countryIndex * 1000000 + stateIndex * 1000 + cityIndex,
//             });
//           });
//         });
//       });
//     }

//     return result;
//   };

//   // Main render
//   return (
//     <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
//       <Typography
//         variant="h6"
//         fontWeight={700}
//         sx={{ mb: 3, color: "#ff9800" }}
//       >
//         Brand Expansion Location Details
//       </Typography>

//       {/* International Expansion Toggle */}
//       <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
//         <Typography variant="subtitle2" mt={0} gap={2}>
//           Is your brand expanding internationally? :
//         </Typography>
//         <RadioGroup
//           row
//           value={
//             data?.isInternationalExpansion === null
//               ? ""
//               : data?.isInternationalExpansion
//           }
//           sx={{ gap: 11, justifyContent: "start", ml: 15 }}
//           onChange={(e) =>
//             handleInternationalExpansionChange(e.target.value === "true")
//           }
//         >
//           <FormControlLabel value="true" control={<Radio />} label="Yes" />
//           <FormControlLabel value="false" control={<Radio />} label="No" />
//         </RadioGroup>
//         {errors?.isInternationalExpansion && (
//           <FormHelperText error sx={{ ml: 2 }}>
//             {errors.isInternationalExpansion}
//           </FormHelperText>
//         )}
//       </Box>

//       {/* Current Outlet Locations */}
//       <Divider sx={{ my: 2 }} />

//       <Typography
//         variant="h6"
//         fontWeight={700}
//         sx={{ mb: 0, color: "#ff9800" }}
//       >
//         Current Outlet Locations
//       </Typography>

//       <RadioGroup
//         sx={{ justifyContent: "center", gap: 10 }}
//         row
//         value={currentOutletLocationType}
//         onChange={handleCurrentOutletLocationTypeChange}
//       >
//         <FormControlLabel value="domestic" control={<Radio />} label="India" />
//         <FormControlLabel
//           value="international"
//           control={<Radio />}
//           label="International"
//         />
//       </RadioGroup>

//       {currentOutletLocationType === "domestic" ? (
//         <>
//           <DomesticStateDrawer
//             type="current"
//             selections={currentDomesticSelections}
//             drawerOpen={currentDrawerOpen.states}
//             sortedStates={sortedStates}
//             handleDomesticStateSelection={handleDomesticStateSelection}
//             handleSearchChange={handleSearchChange}
//             toggleDrawer={toggleDrawer}
//           />
//           <DomesticDistrictDrawer
//             type="current"
//             selections={currentDomesticSelections}
//             drawerOpen={currentDrawerOpen.districts}
//             statesData={statesData}
//             searchFilters={searchFilters}
//             handleDomesticDistrictSelection={handleDomesticDistrictSelection}
//             handleSearchChange={handleSearchChange}
//             handleSelectAllDistricts={handleSelectAllDistricts}
//             toggleDrawer={toggleDrawer}
//           />
//           <DomesticCityDrawer
//             type="current"
//             selections={currentDomesticSelections}
//             drawerOpen={currentDrawerOpen.cities}
//             statesData={statesData}
//             searchFilters={searchFilters}
//             handleDomesticCitySelection={handleDomesticCitySelection}
//             handleSearchChange={handleSearchChange}
//             handleSelectAllCities={handleSelectAllCities}
//             toggleDrawer={toggleDrawer}
//           />
//         </>
//       ) : (
//         <>
//           <InternationalCountryDrawer
//             type="current"
//             selections={currentInternationalSelections}
//             drawerOpen={currentDrawerOpen.countries}
//             sortedCountries={sortedCountries}
//             searchFilters={searchFilters}
//             handleInternationalCountrySelection={handleInternationalCountrySelection}
//             handleSearchChange={handleSearchChange}
//             toggleDrawer={toggleDrawer}
//           />
//           <InternationalStateDrawer
//             type="current"
//             selections={currentInternationalSelections}
//             drawerOpen={currentDrawerOpen.intStates}
//             statesData={currentInternationalStates}
//             searchFilters={searchFilters}
//             handleInternationalStateSelection={handleInternationalStateSelection}
//             handleSelectAllStates={handleSelectAllStates}
//             handleSearchChange={handleSearchChange}
//             toggleDrawer={toggleDrawer}
//           />
//           <InternationalCityDrawer
//             type="current"
//             selections={currentInternationalSelections}
//             drawerOpen={currentDrawerOpen.intCities}
//             citiesData={currentInternationalCities}
//             searchFilters={searchFilters}
//             handleInternationalCitySelection={handleInternationalCitySelection}
//             handleSelectAllStateCities={handleSelectAllStateCities}
//             handleSearchChange={handleSearchChange}
//             toggleDrawer={toggleDrawer}
//           />
//         </>
//       )}

//       {/* Expansion Locations */}
//       <Divider sx={{ my: 2 }} />
//       <Typography
//         variant="h6"
//         fontWeight={700}
//         sx={{ mb: 3, color: "#ff9800" }}
//       >
//         Expansion Locations
//       </Typography>
//       <RadioGroup
//         row
//         value={locationType}
//         onChange={handleLocationTypeChange}
//         sx={{ justifyContent: "center", gap: 10 }}
//       >
//         <FormControlLabel value="domestic" control={<Radio />} label="India" />
//         <FormControlLabel
//           value="international"
//           control={<Radio />}
//           label="International"
//         />
//       </RadioGroup>

//       {locationType === "domestic" ? (
//         <>
//           <DomesticStateDrawer
//             type="expansion"
//             selections={domesticSelections}
//             drawerOpen={drawerOpen.states}
//             sortedStates={sortedStates}
//             handleDomesticStateSelection={handleDomesticStateSelection}
//             handleSearchChange={handleSearchChange}
//             toggleDrawer={toggleDrawer}
//           />
//           <DomesticDistrictDrawer
//             type="expansion"
//             selections={domesticSelections}
//             drawerOpen={drawerOpen.districts}
//             statesData={statesData}
//             searchFilters={searchFilters}
//             handleDomesticDistrictSelection={handleDomesticDistrictSelection}
//             handleSearchChange={handleSearchChange}
//             handleSelectAllDistricts={handleSelectAllDistricts}
//             toggleDrawer={toggleDrawer}
//           />
//           <DomesticCityDrawer
//             type="expansion"
//             selections={domesticSelections}
//             drawerOpen={drawerOpen.cities}
//             statesData={statesData}
//             searchFilters={searchFilters}
//             handleDomesticCitySelection={handleDomesticCitySelection}
//             handleSearchChange={handleSearchChange}
//             handleSelectAllCities={handleSelectAllCities}
//             toggleDrawer={toggleDrawer}
//           />
//         </>
//       ) : (
//         <>
//           <InternationalCountryDrawer
//             type="expansion"
//             selections={internationalSelections}
//             drawerOpen={drawerOpen.countries}
//             sortedCountries={sortedCountries}
//             searchFilters={searchFilters}
//             handleInternationalCountrySelection={handleInternationalCountrySelection}
//             handleSearchChange={handleSearchChange}
//             toggleDrawer={toggleDrawer}
//           />
//           <InternationalStateDrawer
//             type="expansion"
//             selections={internationalSelections}
//             drawerOpen={drawerOpen.intStates}
//             statesData={internationalStates}
//             searchFilters={searchFilters}
//             handleInternationalStateSelection={handleInternationalStateSelection}
//             handleSelectAllStates={handleSelectAllStates}
//             handleSearchChange={handleSearchChange}
//             toggleDrawer={toggleDrawer}
//           />
//           <InternationalCityDrawer
//             type="expansion"
//             selections={internationalSelections}
//             drawerOpen={drawerOpen.intCities}
//             citiesData={internationalCities}
//             searchFilters={searchFilters}
//             handleInternationalCitySelection={handleInternationalCitySelection}
//             handleSelectAllStateCities={handleSelectAllStateCities}
//             handleSearchChange={handleSearchChange}
//             toggleDrawer={toggleDrawer}
//           />
//         </>
//       )}

//       {/* Loading and Error Handling */}
//       <Backdrop
//         open={loading.states || loading.countries || loading.formSubmit}
//         sx={{ zIndex: 9999 }}
//       >
//         <CircularProgress color="inherit" />
//       </Backdrop>
//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError(null)}
//       >
//         <Alert
//           onClose={() => setError(null)}
//           severity="error"
//           sx={{ width: "100%" }}
//         >
//           {error}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default BrandExpansionLocationDetails;


"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  FormHelperText,
} from "@mui/material";
import { useSnackbar } from "notistack";
import debounce from "lodash/debounce";
import axios from "axios";

import DomesticStateDrawer from "../../Components/brand_listing_components/ExpansionLocationhandle/DomesticStateDrawer";
import DomesticDistrictDrawer from "../../Components/brand_listing_components/ExpansionLocationhandle/DomesticDistrictDrawer";
import InternationalCountryDrawer from "../../Components/brand_listing_components/ExpansionLocationhandle/InternationalCountryDrawer";
import InternationalStateDrawer from "../../Components/brand_listing_components/ExpansionLocationhandle/InternationalStateDrawer";
import InternationalCityDrawer from "../../Components/brand_listing_components/ExpansionLocationhandle/InternationalCityDrawer";

// Import local JSON data for Indian states and districts
import indianStatesData from "./data/IndiaStateDistrictFile.json";

// Cache for API responses (only for international now)
const apiCache = {
  countries: null,
  states: {},
  cities: {},
};

const BrandExpansionLocationDetails = ({ data, onChange, errors }) => {
  const { enqueueSnackbar } = useSnackbar();

  // Location type state
  const [locationType, setLocationType] = useState("domestic");
  const [currentOutletLocationType, setCurrentOutletLocationType] =
    useState("domestic");

  // Domestic selections for expansion locations
  const [domesticSelections, setDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [],
  });

  // International selections for expansion locations
  const [internationalSelections, setInternationalSelections] = useState({
    selectedCountries: [],
    selectedStates: {},
    selectedCities: {},
  });

  // Current outlet selections
  const [currentDomesticSelections, setCurrentDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [],
  });

  const [currentInternationalSelections, setCurrentInternationalSelections] =
    useState({
      selectedCountries: [],
      selectedStates: {},
      selectedCities: {},
    });

  // Location data
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState({});
  const [countries, setCountries] = useState([]);
  const [internationalStates, setInternationalStates] = useState({});
  const [internationalCities, setInternationalCities] = useState({});
  const [currentInternationalStates, setCurrentInternationalStates] = useState(
    {}
  );
  const [currentInternationalCities, setCurrentInternationalCities] = useState(
    {}
  );

  const [loading, setLoading] = useState({
    countries: false,
    formSubmit: false,
  });

  const [error, setError] = useState(null);

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState({
    states: false,
    districts: false,
    countries: false,
    intStates: false,
    intCities: false,
  });

  // Collapse states for current locations
  const [currentDrawerOpen, setCurrentDrawerOpen] = useState({
    states: false,
    districts: false,
    countries: false,
    intStates: false,
    intCities: false,
  });

  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    states: "",
    districts: "",
    countries: "",
    intStates: "",
    intCities: "",
  });

  // Define updateFormData first, before any functions that use it
  const updateFormData = useCallback(
    (type, locationType, selections) => {
      const locationKey =
        type === "current" ? "currentOutletLocations" : "expansionLocations";

      if (locationType === "domestic") {
        const newLocations = [];

        // Process states
        selections.selectedStates.forEach((stateName) => {
          const existingStateIndex = newLocations.findIndex(
            (loc) => loc.state === stateName
          );

          if (existingStateIndex === -1) {
            newLocations.push({
              state: stateName,
              districts: [],
            });
          }
        });

        // Process districts
        selections.selectedDistricts.forEach(({ state, district }) => {
          const stateIndex = newLocations.findIndex(
            (loc) => loc.state === state
          );

          if (stateIndex !== -1) {
            const districtExists = newLocations[stateIndex].districts.some(
              (d) => d.district === district
            );

            if (!districtExists) {
              newLocations[stateIndex].districts.push({
                district,
              });
            }
          }
        });

        const updatedData = {
          ...data,
          [locationKey]: {
            ...data[locationKey],
            domestic: {
              locations: newLocations,
            },
          },
        };

        onChange(updatedData);
      } else {
        // International locations
        const newLocations = [];

        // Process countries
        selections.selectedCountries.forEach((country) => {
          const countryExists = newLocations.some(
            (loc) => loc.country === country
          );
          if (!countryExists) {
            newLocations.push({
              country,
              states: [],
            });
          }
        });

        // Process states
        Object.entries(selections.selectedStates).forEach(
          ([country, states]) => {
            const countryIndex = newLocations.findIndex(
              (loc) => loc.country === country
            );

            if (countryIndex !== -1) {
              states.forEach((state) => {
                const stateExists = newLocations[countryIndex].states.some(
                  (s) => s.state === state
                );

                if (!stateExists) {
                  newLocations[countryIndex].states.push({
                    state,
                    cities: [],
                  });
                }
              });
            }
          }
        );

        // Process cities
        Object.entries(selections.selectedCities).forEach(
          ([stateKey, cities]) => {
            const [country, state] = stateKey.split("-");
            const countryIndex = newLocations.findIndex(
              (loc) => loc.country === country
            );

            if (countryIndex !== -1) {
              const stateIndex = newLocations[countryIndex].states.findIndex(
                (s) => s.state === state
              );

              if (stateIndex === -1) {
                newLocations[countryIndex].states.push({
                  state,
                  cities,
                });
              } else {
                cities.forEach((city) => {
                  if (
                    !newLocations[countryIndex].states[
                      stateIndex
                    ].cities.includes(city)
                  ) {
                    newLocations[countryIndex].states[stateIndex].cities.push(
                      city
                    );
                  }
                });
              }
            }
          }
        );

        const updatedData = {
          ...data,
          [locationKey]: {
            ...data[locationKey],
            international: {
              locations: newLocations,
            },
          },
        };

        onChange(updatedData);
      }
    },
    [data, onChange]
  );

  // Debounced search functions
  const handleSearchChange = useCallback(
    debounce((type, value) => {
      setSearchFilters((prev) => ({ ...prev, [type]: value.toLowerCase() }));
    }, 300),
    []
  );

  // Toggle drawer
  const toggleDrawer = useCallback((type, open) => {
    if (type === "current") {
      setCurrentDrawerOpen((prev) => ({ ...prev, ...open }));
    } else {
      setDrawerOpen((prev) => ({ ...prev, ...open }));
    }
  }, []);

  // Memoized sorted and filtered states
  const sortedStates = useMemo(() => {
    return states
      .filter((state) =>
        state.name.toLowerCase().includes(searchFilters.states)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [states, searchFilters.states]);

  // Memoized sorted and filtered districts
  const sortedDistricts = useMemo(() => {
    const result = {};
    Object.keys(districts).forEach((state) => {
      result[state] = districts[state]
        .filter((district) =>
          district.toLowerCase().includes(searchFilters.districts)
        )
        .sort((a, b) => a.localeCompare(b));
    });
    return result;
  }, [districts, searchFilters.districts]);

  // Memoized sorted and filtered countries
  const sortedCountries = useMemo(() => {
    return countries
      .filter((country) =>
        country.name.toLowerCase().includes(searchFilters.countries)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, searchFilters.countries]);

  // Load domestic data from local JSON files
  const loadDomesticData = useCallback(() => {
    try {
      // Build array of state objects
      const statesList = Object.keys(indianStatesData).map((stateName) => ({
        id: stateName, // using state name as ID for simplicity
        name: stateName,
      }));
      setStates(statesList);

      // Build districts mapping
      const districtsMap = {};
      Object.entries(indianStatesData).forEach(([stateName, stateData]) => {
        districtsMap[stateName] = stateData.districts || [];
      });
      setDistricts(districtsMap);
    } catch (error) {
      console.error("Error loading domestic data:", error);
      setError("Failed to load domestic locations data.");
      enqueueSnackbar("Failed to load domestic locations data", {
        variant: "error",
      });
    }
  }, [enqueueSnackbar]);

  // Fetch international countries with caching
  const fetchCountries = useCallback(async () => {
    if (apiCache.countries) {
      setCountries(apiCache.countries);
      return;
    }

    setLoading((prev) => ({ ...prev, countries: true }));
    try {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries"
      );
      const countryData = response.data.data.map((country) => ({
        id: country.iso2,
        name: country.country,
      }));

      apiCache.countries = countryData;
      setCountries(countryData);
    } catch (error) {
      console.error("Error fetching countries:", error);
      setError("Failed to load countries. Please try again later.");
      enqueueSnackbar("Failed to load countries", { variant: "error" });
    } finally {
      setLoading((prev) => ({ ...prev, countries: false }));
    }
  }, [enqueueSnackbar]);

  // Fetch states for a country
  const getStatesByCountry = useCallback(
    async (countryName, callback) => {
      if (apiCache.states[countryName]) {
        callback(apiCache.states[countryName]);
        return;
      }

      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          { country: countryName }
        );
        const states = response.data.data?.states || [];
        apiCache.states[countryName] = states;
        callback(states);
      } catch (error) {
        console.error("Error fetching states for country:", countryName, error);
        enqueueSnackbar(`Failed to load states for ${countryName}`, {
          variant: "error",
        });
        callback([]);
      }
    },
    [enqueueSnackbar]
  );

  // Fetch cities for a country and state
  const getCitiesByCountryAndState = useCallback(
    async (countryName, stateName, callback) => {
      const cacheKey = `${countryName}-${stateName}`;
      if (apiCache.cities[cacheKey]) {
        callback(apiCache.cities[cacheKey]);
        return;
      }

      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/state/cities",
          { country: countryName, state: stateName }
        );
        const cities = response.data.data || [];
        apiCache.cities[cacheKey] = cities;
        callback(cities);
      } catch (error) {
        console.error(
          "Error fetching cities for country and state:",
          countryName,
          stateName,
          error
        );
        enqueueSnackbar(
          `Failed to load cities for ${stateName}, ${countryName}`,
          { variant: "error" }
        );
        callback([]);
      }
    },
    [enqueueSnackbar]
  );

  // Debounced versions of API calls
  const debouncedGetStatesByCountry = useMemo(
    () => debounce(getStatesByCountry, 500),
    [getStatesByCountry]
  );

  const debouncedGetCitiesByCountryAndState = useMemo(
    () => debounce(getCitiesByCountryAndState, 500),
    [getCitiesByCountryAndState]
  );

  // Handle international country selection
  const handleInternationalCountrySelection = useCallback(
    async (selectedCountries, type) => {
      const setSelections =
        type === "current"
          ? setCurrentInternationalSelections
          : setInternationalSelections;
      const setStatesData =
        type === "current"
          ? setCurrentInternationalStates
          : setInternationalStates;

      setSelections((prev) => ({
        ...prev,
        selectedCountries,
        selectedStates: {},
        selectedCities: {},
      }));

      // Update form data immediately
      updateFormData(type, "international", {
        selectedCountries,
        selectedStates: {},
        selectedCities: {},
      });

      // Fetch states for newly selected countries
      const newStatesData = {};
      for (const country of selectedCountries) {
        if (!apiCache.states[country]) {
          debouncedGetStatesByCountry(country, (states) => {
            setStatesData((prev) => ({ ...prev, [country]: states }));
          });
        }
      }
    },
    [debouncedGetStatesByCountry, updateFormData]
  );

  // Handle international state selection
  const handleInternationalStateSelection = useCallback(
    async (countryName, stateName, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentInternationalSelections
          : setInternationalSelections;

      setSelections((prev) => {
        const newSelectedStates = { ...prev.selectedStates };
        const newSelectedCities = { ...prev.selectedCities };

        if (!newSelectedStates[countryName]) {
          newSelectedStates[countryName] = [];
        }

        if (isSelected) {
          newSelectedStates[countryName] = [
            ...newSelectedStates[countryName],
            stateName,
          ];
        } else {
          newSelectedStates[countryName] = newSelectedStates[
            countryName
          ].filter((s) => s !== stateName);
          if (newSelectedStates[countryName].length === 0) {
            delete newSelectedStates[countryName];
          }
        }

        // Clear cities for the country-state combination when states change
        const stateKey = `${countryName}-${stateName}`;
        if (newSelectedCities[stateKey]) {
          delete newSelectedCities[stateKey];
        }

        const newSelections = {
          ...prev,
          selectedStates: newSelectedStates,
          selectedCities: newSelectedCities,
        };

        // Update form data immediately
        updateFormData(type, "international", newSelections);

        return newSelections;
      });

      // Fetch cities for newly selected states
      if (isSelected) {
        const setCitiesData =
          type === "current"
            ? setCurrentInternationalCities
            : setInternationalCities;
        const cacheKey = `${countryName}-${stateName}`;

        if (!apiCache.cities[cacheKey]) {
          debouncedGetCitiesByCountryAndState(
            countryName,
            stateName,
            (cities) => {
              setCitiesData((prev) => ({ ...prev, [cacheKey]: cities }));
            }
          );
        }
      }
    },
    [debouncedGetCitiesByCountryAndState, updateFormData]
  );

  // Handle international city selection
  const handleInternationalCitySelection = useCallback(
    (countryName, stateName, cityName, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentInternationalSelections
          : setInternationalSelections;

      setSelections((prev) => {
        const newSelectedCities = { ...prev.selectedCities };
        const stateKey = `${countryName}-${stateName}`;

        if (!newSelectedCities[stateKey]) {
          newSelectedCities[stateKey] = [];
        }

        if (isSelected) {
          newSelectedCities[stateKey] = [
            ...newSelectedCities[stateKey],
            cityName,
          ];
        } else {
          newSelectedCities[stateKey] = newSelectedCities[stateKey].filter(
            (c) => c !== cityName
          );
          if (newSelectedCities[stateKey].length === 0) {
            delete newSelectedCities[stateKey];
          }
        }

        const newSelections = {
          ...prev,
          selectedCities: newSelectedCities,
        };

        // Update form data immediately
        updateFormData(type, "international", newSelections);

        return newSelections;
      });
    },
    [updateFormData]
  );

  // Handle "Select All" for states in a country
  const handleSelectAllStates = useCallback(
    (countryName, states, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentInternationalSelections
          : setInternationalSelections;

      setSelections((prev) => {
        const newSelectedStates = { ...prev.selectedStates };
        const newSelectedCities = { ...prev.selectedCities };

        if (isSelected) {
          // Add all states for this country
          newSelectedStates[countryName] = states;

          // Remove any cities for states that are being selected (since we're selecting the whole state)
          states.forEach((stateName) => {
            const stateKey = `${countryName}-${stateName}`;
            if (newSelectedCities[stateKey]) {
              delete newSelectedCities[stateKey];
            }
          });
        } else {
          // Remove all states for this country
          delete newSelectedStates[countryName];

          // Remove all cities for this country
          Object.keys(newSelectedCities).forEach((key) => {
            if (key.startsWith(`${countryName}-`)) {
              delete newSelectedCities[key];
            }
          });
        }

        const newSelections = {
          ...prev,
          selectedStates: newSelectedStates,
          selectedCities: newSelectedCities,
        };

        // Update form data immediately
        updateFormData(type, "international", newSelections);

        return newSelections;
      });
    },
    [updateFormData]
  );

  // Handle "Select All" for cities in a state
  const handleSelectAllStateCities = useCallback(
    (countryName, stateName, cities, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentInternationalSelections
          : setInternationalSelections;

      setSelections((prev) => {
        const newSelectedCities = { ...prev.selectedCities };
        const stateKey = `${countryName}-${stateName}`;

        if (isSelected) {
          newSelectedCities[stateKey] = [...cities];
        } else {
          delete newSelectedCities[stateKey];
        }

        const newSelections = {
          ...prev,
          selectedCities: newSelectedCities,
        };

        // Update form data immediately
        updateFormData(type, "international", newSelections);

        return newSelections;
      });
    },
    [updateFormData]
  );

  // Initialize component with data
  useEffect(() => {
    loadDomesticData();
    fetchCountries();

    if (data?.currentOutletLocations) {
      // Initialize domestic selections if data exists
      if (data.currentOutletLocations.domestic?.locations?.length > 0) {
        const domesticLocations =
          data.currentOutletLocations.domestic.locations;
        const selectedStates = domesticLocations.map((loc) => loc.state);
        const selectedDistricts = domesticLocations.flatMap(
          (loc) =>
            loc.districts?.map((district) => ({
              state: loc.state,
              district: district.district,
            })) || []
        );

        setCurrentDomesticSelections({
          selectedStates,
          selectedDistricts,
        });
      }

      // Initialize international selections if data exists
      if (data.currentOutletLocations.international?.locations?.length > 0) {
        const intlLocations =
          data.currentOutletLocations.international.locations;
        const selectedCountries = intlLocations.map((loc) => loc.country);
        const selectedStates = {};
        const selectedCities = {};

        intlLocations.forEach((loc) => {
          if (loc.states?.length > 0) {
            selectedStates[loc.country] = loc.states.map(
              (state) => state.state
            );
            loc.states.forEach((state) => {
              const stateKey = `${loc.country}-${state.state}`;
              if (state.cities?.length > 0) {
                selectedCities[stateKey] = state.cities;
              }
            });
          }
        });

        setCurrentInternationalSelections({
          selectedCountries,
          selectedStates,
          selectedCities,
        });
      }
    }
  }, [data, loadDomesticData, fetchCountries]);

  // Handle international expansion selection
  const handleInternationalExpansionChange = useCallback(
    (value) => {
      // Store the selection as 'Yes' or 'No' strings (per requirement)
      onChange({
        ...data,
        isInternationalExpansion: value,
      });
    },
    [data, onChange]
  );

  // Handle location type change (domestic/international)
  const handleLocationTypeChange = useCallback((e) => {
    const newType = e.target.value;
    setLocationType(newType);
  }, []);

  // Handle current outlet location type change
  const handleCurrentOutletLocationTypeChange = useCallback((e) => {
    const newType = e.target.value;
    setCurrentOutletLocationType(newType);
  }, []);

  // Handle domestic state selection
  // Fix the handleDomesticStateSelection function
  const handleDomesticStateSelection = useCallback(
    (selectedStates, type) => {
      const setSelections =
        type === "current"
          ? setCurrentDomesticSelections
          : setDomesticSelections;

      setSelections((prev) => {
        const newSelections = {
          selectedStates,
          selectedDistricts: prev.selectedDistricts.filter((district) =>
            selectedStates.includes(district.state)
          ),
        };
        updateFormData(
          type === "current" ? "current" : "expansion",
          "domestic",
          newSelections
        );
        return newSelections;
      });
    },
    [updateFormData]
  );

  // Handle domestic district selection
  const handleDomesticDistrictSelection = useCallback(
    (stateName, districtName, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentDomesticSelections
          : setDomesticSelections;

      setSelections((prev) => {
        const newSelections = {
          selectedStates: [...prev.selectedStates],
          selectedDistricts: [...prev.selectedDistricts],
        };

        if (isSelected) {
          newSelections.selectedDistricts = [
            ...newSelections.selectedDistricts,
            { state: stateName, district: districtName },
          ];
        } else {
          newSelections.selectedDistricts =
            newSelections.selectedDistricts.filter(
              (d) => !(d.state === stateName && d.district === districtName)
            );
        }

        // Update form data immediately
        updateFormData(
          type === "current" ? "current" : "expansion",
          "domestic",
          newSelections
        );

        return newSelections;
      });
    },
    [updateFormData]
  );

  // useEffect(() => {
  //   if (domesticSelections.selectedStates.length > 0 || domesticSelections.selectedDistricts.length > 0) {
  //     updateFormData("expansion", "domestic", domesticSelections);
  //   }
  // }, [domesticSelections]); // Remove updateFormData from dependencies

  // useEffect(() => {
  //   if (currentDomesticSelections.selectedStates.length > 0 || currentDomesticSelections.selectedDistricts.length > 0) {
  //     updateFormData("current", "domestic", currentDomesticSelections);
  //   }
  // }, [currentDomesticSelections]); // Remove updateFormData from dependencies

  // Handle "Select All" for districts in a state
  const handleSelectAllDistricts = useCallback(
    (stateName, districts, isSelected, type) => {
      const setSelections =
        type === "current"
          ? setCurrentDomesticSelections
          : setDomesticSelections;

      setSelections((prev) => {
        let newSelectedDistricts = [...prev.selectedDistricts];

        if (isSelected) {
          // Add all districts
          districts.forEach((district) => {
            if (
              !newSelectedDistricts.some(
                (d) => d.state === stateName && d.district === district
              )
            ) {
              newSelectedDistricts.push({ state: stateName, district });
            }
          });
        } else {
          // Remove all districts for this state
          newSelectedDistricts = newSelectedDistricts.filter(
            (d) => d.state !== stateName
          );
        }

        const newSelections = {
          ...prev,
          selectedDistricts: newSelectedDistricts,
        };

        // Update form data immediately
        updateFormData(type, "domestic", newSelections);

        return newSelections;
      });
    },
    [updateFormData]
  );

  // Remove location items
  // Updated removeLocationItems function
  const removeLocationItems = useCallback(
    (type, locationType, field, index) => {
      const updatedData = { ...data };
      const locationKey =
        type === "current" ? "currentOutletLocations" : "expansionLocations";

      if (!updatedData[locationKey]) {
        updatedData[locationKey] = {
          domestic: { locations: [] },
          international: { locations: [] },
        };
      }

      if (locationType === "domestic") {
        if (field === "state") {
          // Remove specific state
          updatedData[locationKey].domestic.locations = updatedData[
            locationKey
          ].domestic.locations.filter((_, i) => i !== index);
        } else if (field === "district") {
          // Remove specific district from its state
          const stateIndex = Math.floor(index / 1000);
          const districtIndex = index % 1000;

          if (
            updatedData[locationKey].domestic.locations[stateIndex]?.districts
          ) {
            updatedData[locationKey].domestic.locations[stateIndex].districts =
              updatedData[locationKey].domestic.locations[
                stateIndex
              ].districts.filter((_, i) => i !== districtIndex);

            // Remove the state if it has no districts left
            if (
              updatedData[locationKey].domestic.locations[stateIndex].districts
                .length === 0
            ) {
              updatedData[locationKey].domestic.locations.splice(stateIndex, 1);
            }
          }
        }
      } else {
        // International locations
        if (field === "country") {
          updatedData[locationKey].international.locations = updatedData[
            locationKey
          ].international.locations.filter((_, i) => i !== index);
        } else if (field === "state") {
          const countryIndex = Math.floor(index / 1000);
          const stateIndex = index % 1000;

          if (
            updatedData[locationKey].international.locations[countryIndex]
              ?.states
          ) {
            updatedData[locationKey].international.locations[
              countryIndex
            ].states = updatedData[locationKey].international.locations[
              countryIndex
            ].states.filter((_, i) => i !== stateIndex);

            // Remove the country if it has no states left
            if (
              updatedData[locationKey].international.locations[countryIndex]
                .states.length === 0
            ) {
              updatedData[locationKey].international.locations.splice(
                countryIndex,
                1
              );
            }
          }
        } else if (field === "city") {
          const countryIndex = Math.floor(index / 1000000);
          const stateIndex = Math.floor((index % 1000000) / 1000);
          const cityIndex = index % 1000;

          if (
            updatedData[locationKey].international.locations[countryIndex]
              ?.states?.[stateIndex]?.cities
          ) {
            updatedData[locationKey].international.locations[
              countryIndex
            ].states[stateIndex].cities = updatedData[
              locationKey
            ].international.locations[countryIndex].states[
              stateIndex
            ].cities.filter((_, i) => i !== cityIndex);

            // Remove the state if it has no cities left
            if (
              updatedData[locationKey].international.locations[countryIndex]
                .states[stateIndex].cities.length === 0
            ) {
              updatedData[locationKey].international.locations[
                countryIndex
              ].states.splice(stateIndex, 1);

              // Remove the country if it has no states left
              if (
                updatedData[locationKey].international.locations[countryIndex]
                  .states.length === 0
              ) {
                updatedData[locationKey].international.locations.splice(
                  countryIndex,
                  1
                );
              }
            }
          }
        }
      }

      onChange(updatedData);

      // Also update the local state to match
      if (type === "current") {
        if (locationType === "domestic") {
          setCurrentDomesticSelections({
            selectedStates:
              updatedData[locationKey]?.domestic?.locations?.map(
                (loc) => loc.state
              ) || [],
            selectedDistricts:
              updatedData[locationKey]?.domestic?.locations?.flatMap(
                (loc) =>
                  loc.districts?.map((district) => ({
                    state: loc.state,
                    district: district.district,
                  })) || []
              ) || [],
          });
        } else {
          setCurrentInternationalSelections({
            selectedCountries:
              updatedData[locationKey]?.international?.locations?.map(
                (loc) => loc.country
              ) || [],
            selectedStates: updatedData[
              locationKey
            ]?.international?.locations?.reduce((acc, loc) => {
              if (loc.states?.length) {
                acc[loc.country] = loc.states.map((state) => state.state);
              }
              return acc;
            }, {}),
            selectedCities: updatedData[
              locationKey
            ]?.international?.locations?.reduce((acc, loc) => {
              loc.states?.forEach((state) => {
                const key = `${loc.country}-${state.state}`;
                if (state.cities?.length) {
                  acc[key] = state.cities;
                }
              });
              return acc;
            }, {}),
          });
        }
      } else {
        if (locationType === "domestic") {
          setDomesticSelections({
            selectedStates:
              updatedData[locationKey]?.domestic?.locations?.map(
                (loc) => loc.state
              ) || [],
            selectedDistricts:
              updatedData[locationKey]?.domestic?.locations?.flatMap(
                (loc) =>
                  loc.districts?.map((district) => ({
                    state: loc.state,
                    district: district.district,
                  })) || []
              ) || [],
          });
        } else {
          setInternationalSelections({
            selectedCountries:
              updatedData[locationKey]?.international?.locations?.map(
                (loc) => loc.country
              ) || [],
            selectedStates: updatedData[
              locationKey
            ]?.international?.locations?.reduce((acc, loc) => {
              if (loc.states?.length) {
                acc[loc.country] = loc.states.map((state) => state.state);
              }
              return acc;
            }, {}),
            selectedCities: updatedData[
              locationKey
            ]?.international?.locations?.reduce((acc, loc) => {
              loc.states?.forEach((state) => {
                const key = `${loc.country}-${state.state}`;
                if (state.cities?.length) {
                  acc[key] = state.cities;
                }
              });
              return acc;
            }, {}),
          });
        }
      }
    },
    [data, onChange]
  );

  // Main render
  return (
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
      <Box display="flex">
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 3, color: "#ff9800" }}
        >
          Brand Expansion Location Details
        </Typography>
        <Typography variant="h6" sx={{}}>
          {errors?.isInternationalExpansion && (
            <FormHelperText error sx={{ ml: 6, mt: 1, fontSize: 14 }}>
              {errors.isInternationalExpansion}
            </FormHelperText>
          )}
        </Typography>
      </Box>

      {/* International Expansion Toggle */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <Typography variant="subtitle2" mt={0} gap={2}>
          Is your brand expanding internationally? :
        </Typography>
        <RadioGroup
          row
          value={
            data?.isInternationalExpansion === null ||
            data?.isInternationalExpansion === undefined
              ? ""
              : data.isInternationalExpansion
          }
          sx={{ gap: 11, justifyContent: "start", ml: 15 }}
          onChange={(e) => handleInternationalExpansionChange(e.target.value)}
        >
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
      </Box>

      {/* Current Outlet Locations */}
      <Divider sx={{ my: 2 }} />
      <Box display="flex">
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 0, color: "#ff9800" }}
        >
          Current Outlet Locations
        </Typography>
         <Typography variant="h6" sx={{}}>
          {errors?.currentOutletLocations && (
            <FormHelperText error sx={{ ml: 6, mt: 1, fontSize: 14 }}>
              {errors.currentOutletLocations}
            </FormHelperText>
          )}
        </Typography>
      </Box>

      <RadioGroup
        sx={{ justifyContent: "center", gap: 10 }}
        row
        value={currentOutletLocationType}
        onChange={handleCurrentOutletLocationTypeChange}
      >
        <FormControlLabel value="domestic" control={<Radio />} label="India" />
        <FormControlLabel
          value="international"
          control={<Radio />}
          label="International"
        />
      </RadioGroup>

      {currentOutletLocationType === "domestic" ? (
        <>
          <DomesticStateDrawer
            type="current"
            selections={currentDomesticSelections}
            drawerOpen={currentDrawerOpen.states}
            sortedStates={sortedStates}
            handleDomesticStateSelection={handleDomesticStateSelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
          />
          <DomesticDistrictDrawer
            type="current"
            selections={currentDomesticSelections}
            drawerOpen={currentDrawerOpen.districts}
            districtsData={districts}
            sortedDistricts={sortedDistricts}
            searchFilters={searchFilters}
            handleDomesticDistrictSelection={handleDomesticDistrictSelection}
            handleSearchChange={handleSearchChange}
            handleSelectAllDistricts={handleSelectAllDistricts}
            toggleDrawer={toggleDrawer}
          />
        </>
      ) : (
        <>
          <InternationalCountryDrawer
            type="current"
            selections={currentInternationalSelections}
            drawerOpen={currentDrawerOpen.countries}
            sortedCountries={sortedCountries}
            searchFilters={searchFilters}
            handleInternationalCountrySelection={
              handleInternationalCountrySelection
            }
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
          />
          <InternationalStateDrawer
            type="current"
            selections={currentInternationalSelections}
            drawerOpen={currentDrawerOpen.intStates}
            statesData={currentInternationalStates}
            searchFilters={searchFilters}
            handleInternationalStateSelection={
              handleInternationalStateSelection
            }
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
          />
          <InternationalCityDrawer
            type="current"
            selections={currentInternationalSelections}
            drawerOpen={currentDrawerOpen.intCities}
            citiesData={currentInternationalCities}
            searchFilters={searchFilters}
            handleInternationalCitySelection={handleInternationalCitySelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
          />
        </>
      )}

      {/* Expansion Locations */}
      <Divider sx={{ my: 2 }} />
      <Box display="flex">
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3, color: "#ff9800" }}
      >
        Expansion Locations
      </Typography>
         <Typography variant="h6" sx={{}}>
          {errors?.expansionLocations && (
            <FormHelperText error sx={{ ml: 6, mt: 1, fontSize: 14 }}>
              {errors.expansionLocations}
            </FormHelperText>
          )}
        </Typography>
        </Box>
      <RadioGroup
        row
        value={locationType}
        onChange={handleLocationTypeChange}
        sx={{ justifyContent: "center", gap: 10 }}
      >
        <FormControlLabel value="domestic" control={<Radio />} label="India" />
        <FormControlLabel
          value="international"
          control={<Radio />}
          label="International"
        />
      </RadioGroup>

      {locationType === "domestic" ? (
        <>
          <DomesticStateDrawer
            type="expansion"
            selections={domesticSelections}
            drawerOpen={drawerOpen.states}
            sortedStates={sortedStates}
            handleDomesticStateSelection={handleDomesticStateSelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
          />
          <DomesticDistrictDrawer
            type="expansion"
            selections={domesticSelections}
            drawerOpen={drawerOpen.districts}
            districtsData={districts}
            sortedDistricts={sortedDistricts}
            searchFilters={searchFilters}
            handleDomesticDistrictSelection={handleDomesticDistrictSelection}
            handleSearchChange={handleSearchChange}
            handleSelectAllDistricts={handleSelectAllDistricts}
            toggleDrawer={toggleDrawer}
          />
        </>
      ) : (
        <>
          <InternationalCountryDrawer
            type="expansion"
            selections={internationalSelections}
            drawerOpen={drawerOpen.countries}
            sortedCountries={sortedCountries}
            searchFilters={searchFilters}
            handleInternationalCountrySelection={
              handleInternationalCountrySelection
            }
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
          />
          <InternationalStateDrawer
            type="expansion"
            selections={internationalSelections}
            drawerOpen={drawerOpen.intStates}
            statesData={internationalStates}
            searchFilters={searchFilters}
            handleInternationalStateSelection={
              handleInternationalStateSelection
            }
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
          />
          <InternationalCityDrawer
            type="expansion"
            selections={internationalSelections}
            drawerOpen={drawerOpen.intCities}
            citiesData={internationalCities}
            searchFilters={searchFilters}
            handleInternationalCitySelection={handleInternationalCitySelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
          />
        </>
      )}
    </Box>
  );
};

export default BrandExpansionLocationDetails;
