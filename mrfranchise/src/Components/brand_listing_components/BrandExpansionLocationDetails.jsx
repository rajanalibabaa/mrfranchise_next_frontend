

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
