"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Divider from "@mui/material/Divider";
import FormHelperText from "@mui/material/FormHelperText";

import { ChevronDown, Search } from "lucide-react";
import { useSnackbar } from "notistack";
import debounce from "lodash/debounce";
import axios from "axios";
import indianStatesData from "./data/IndiaStateDistrictFile.json";

const apiCache = {
  countries: null,
  states: {},
  cities: {},
};

const ExpansionLocationEdit = ({ data = {}, onChange, onAddRemoveChange, errors = {}, isEditing = false }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [locationType, setLocationType] = useState("domestic");
  const [currentOutletLocationType, setCurrentOutletLocationType] = useState("domestic");

  const [domesticSelections, setDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [],
  });
  const [originalDomestic, setOriginalDomestic] = useState({
    selectedStates: [],
    selectedDistricts: [],
  });

  const [internationalSelections, setInternationalSelections] = useState({
    selectedCountries: [],
    selectedStates: {},
    selectedCities: {},
  });
  const [originalInternational, setOriginalInternational] = useState({
    selectedCountries: [],
    selectedStates: {},
    selectedCities: {},
  });

  const [currentDomesticSelections, setCurrentDomesticSelections] = useState({
    selectedStates: [],
    selectedDistricts: [],
  });
  const [originalCurrentDomestic, setOriginalCurrentDomestic] = useState({
    selectedStates: [],
    selectedDistricts: [],
  });

  const [currentInternationalSelections, setCurrentInternationalSelections] = useState({
    selectedCountries: [],
    selectedStates: {},
    selectedCities: {},
  });
  const [originalCurrentInternational, setOriginalCurrentInternational] = useState({
    selectedCountries: [],
    selectedStates: {},
    selectedCities: {},
  });

  const [addExpansionLocationData, setAddExpansionLocationData] = useState({
    currentOutletLocations: { domestic: { state: [], districts: {}, city: {} }, international: { country: [], states: {}, city: {} } },
    expansionLocations: { domestic: { state: [], districts: {}, city: {} }, international: { country: [], states: {}, city: {} } },
  });

  const [removeExpansionLocationData, setRemoveExpansionLocationData] = useState({
    currentOutletLocations: { domestic: { state: [], districts: {}, city: {} }, international: { country: [], states: {}, city: {} } },
    expansionLocations: { domestic: { state: [], districts: {}, city: {} }, international: { country: [], states: {}, city: {} } },
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState({});
  const [countries, setCountries] = useState([]);
  const [internationalStates, setInternationalStates] = useState({});
  const [internationalCities, setInternationalCities] = useState({});
  const [currentInternationalStates, setCurrentInternationalStates] = useState({});
  const [currentInternationalCities, setCurrentInternationalCities] = useState({});

  const [loading, setLoading] = useState({ countries: false, formSubmit: false });
  const [error, setError] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState({
    states: false,
    districts: false,
    countries: false,
    intStates: false,
    intCities: false,
  });

  const [currentDrawerOpen, setCurrentDrawerOpen] = useState({
    states: false,
    districts: false,
    countries: false,
    intStates: false,
    intCities: false,
  });

  const [searchFilters, setSearchFilters] = useState({
    states: "",
    districts: "",
    countries: "",
    intStates: "",
    intCities: "",
  });

  useEffect(() => {
    if (typeof onAddRemoveChange === "function") {
      onAddRemoveChange({ addExpansionLocationData, removeExpansionLocationData });
    }
  }, [addExpansionLocationData, removeExpansionLocationData, onAddRemoveChange]);

  const handleSearchChange = useCallback(
    debounce((type, value) => {
      setSearchFilters((prev) => ({ ...prev, [type]: value.toLowerCase() }));
    }, 300),
    []
  );

  const toggleDrawer = useCallback((type, open) => {
    if (type === "current") {
      setCurrentDrawerOpen((prev) => ({ ...prev, ...open }));
    } else {
      setDrawerOpen((prev) => ({ ...prev, ...open }));
    }
  }, []);

  const sortedStates = useMemo(() => {
    return states
      .filter((state) => state.name.toLowerCase().includes(searchFilters.states))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [states, searchFilters.states]);

  const sortedDistricts = useMemo(() => {
    const result = {};
    Object.keys(districts).forEach((state) => {
      result[state] = districts[state]
        .filter((district) => district.toLowerCase().includes(searchFilters.districts))
        .sort((a, b) => a.localeCompare(b));
    });
    return result;
  }, [districts, searchFilters.districts]);

  const sortedCountries = useMemo(() => {
    return countries
      .filter((country) => country.name.toLowerCase().includes(searchFilters.countries))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [countries, searchFilters.countries]);

  const loadDomesticData = useCallback(() => {
    try {
      const statesList = Object.keys(indianStatesData).map((stateName) => ({
        id: stateName,
        name: stateName,
      }));
      setStates(statesList);

      const districtsMap = {};
      Object.entries(indianStatesData).forEach(([stateName, stateData]) => {
        districtsMap[stateName] = stateData.districts || [];
      });
      setDistricts(districtsMap);
    } catch (error) {
      console.error("Error loading domestic data:", error);
      setError("Failed to load domestic locations data.");
      enqueueSnackbar("Failed to load domestic locations data", { variant: "error" });
    }
  }, [enqueueSnackbar]);

  const fetchCountries = useCallback(async () => {
    if (apiCache.countries) {
      setCountries(apiCache.countries);
      return;
    }

    setLoading((prev) => ({ ...prev, countries: true }));
    try {
      const response = await axios.get("https://countriesnow.space/api/v0.1/countries");
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

  const getStatesByCountry = useCallback(
    async (countryName, callback) => {
      if (!countryName) return;
      if (apiCache.states[countryName]) {
        callback(apiCache.states[countryName]);
        return;
      }

      try {
        const response = await axios.post("https://countriesnow.space/api/v0.1/countries/states", { country: countryName });
        const states = response.data.data?.states || [];
        apiCache.states[countryName] = states;
        callback(states);
      } catch (error) {
        console.error("Error fetching states for country:", countryName, error);
        enqueueSnackbar(`Failed to load states for ${countryName}`, { variant: "error" });
        callback([]);
      }
    },
    [enqueueSnackbar]
  );

  const getCitiesByCountryAndState = useCallback(
    async (countryName, stateName, callback) => {
      if (!countryName || !stateName) return;
      const cacheKey = `${countryName}-${stateName}`;
      if (apiCache.cities[cacheKey]) {
        callback(apiCache.cities[cacheKey]);
        return;
      }

      try {
        const response = await axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", { country: countryName, state: stateName });
        const cities = response.data.data || [];
        apiCache.cities[cacheKey] = cities;
        callback(cities);
      } catch (error) {
        console.error("Error fetching cities for country and state:", countryName, stateName, error);
        enqueueSnackbar(`Failed to load cities for ${stateName}, ${countryName}`, { variant: "error" });
        callback([]);
      }
    },
    [enqueueSnackbar]
  );

  const debouncedGetStatesByCountry = useMemo(() => debounce(getStatesByCountry, 500), [getStatesByCountry]);
  const debouncedGetCitiesByCountryAndState = useMemo(() => debounce(getCitiesByCountryAndState, 500), [getCitiesByCountryAndState]);

  const computeCurrentDomesticChanges = useCallback(() => {
    const addedStates = currentDomesticSelections.selectedStates.filter(
      (s) => !originalCurrentDomestic.selectedStates.includes(s)
    );
    const removedStates = originalCurrentDomestic.selectedStates.filter(
      (s) => !currentDomesticSelections.selectedStates.includes(s)
    );

    const addedDistricts = {};
    currentDomesticSelections.selectedDistricts.forEach(({ state, district }) => {
      if (
        !originalCurrentDomestic.selectedDistricts.some((o) => o.state === state && o.district === district)
      ) {
        if (!addedDistricts[state]) addedDistricts[state] = [];
        addedDistricts[state].push(district);
      }
    });

    const removedDistricts = {};
    originalCurrentDomestic.selectedDistricts.forEach(({ state, district }) => {
      if (
        !currentDomesticSelections.selectedDistricts.some((o) => o.state === state && o.district === district)
      ) {
        if (!removedDistricts[state]) removedDistricts[state] = [];
        removedDistricts[state].push(district);
      }
    });

    setAddExpansionLocationData((prev) => ({
      ...prev,
      currentOutletLocations: {
        ...prev.currentOutletLocations,
        domestic: {
          state: addedStates,
          districts: addedDistricts,
          city: {},
        },
      },
    }));

    setRemoveExpansionLocationData((prev) => ({
      ...prev,
      currentOutletLocations: {
        ...prev.currentOutletLocations,
        domestic: {
          state: removedStates,
          districts: removedDistricts,
          city: {},
        },
      },
    }));
  }, [currentDomesticSelections, originalCurrentDomestic]);

  const computeExpansionDomesticChanges = useCallback(() => {
    const addedStates = domesticSelections.selectedStates.filter(
      (s) => !originalDomestic.selectedStates.includes(s)
    );
    const removedStates = originalDomestic.selectedStates.filter(
      (s) => !domesticSelections.selectedStates.includes(s)
    );

    const addedDistricts = {};
    domesticSelections.selectedDistricts.forEach(({ state, district }) => {
      if (
        !originalDomestic.selectedDistricts.some((o) => o.state === state && o.district === district)
      ) {
        if (!addedDistricts[state]) addedDistricts[state] = [];
        addedDistricts[state].push(district);
      }
    });

    const removedDistricts = {};
    originalDomestic.selectedDistricts.forEach(({ state, district }) => {
      if (
        !domesticSelections.selectedDistricts.some((o) => o.state === state && o.district === district)
      ) {
        if (!removedDistricts[state]) removedDistricts[state] = [];
        removedDistricts[state].push(district);
      }
    });

    setAddExpansionLocationData((prev) => ({
      ...prev,
      expansionLocations: {
        ...prev.expansionLocations,
        domestic: {
          state: addedStates,
          districts: addedDistricts,
          city: {},
        },
      },
    }));

    setRemoveExpansionLocationData((prev) => ({
      ...prev,
      expansionLocations: {
        ...prev.expansionLocations,
        domestic: {
          state: removedStates,
          districts: removedDistricts,
          city: {},
        },
      },
    }));
  }, [domesticSelections, originalDomestic]);

  const computeCurrentInternationalChanges = useCallback(() => {
    const addedCountries = currentInternationalSelections.selectedCountries.filter(
      (c) => !originalCurrentInternational.selectedCountries.includes(c)
    );
    const removedCountries = originalCurrentInternational.selectedCountries.filter(
      (c) => !currentInternationalSelections.selectedCountries.includes(c)
    );

    const addedStates = {};
    Object.entries(currentInternationalSelections.selectedStates).forEach(([country, states]) => {
      const origStates = originalCurrentInternational.selectedStates[country] || [];
      const added = states.filter((s) => !origStates.includes(s));
      if (added.length > 0) addedStates[country] = added;
    });

    const removedStates = {};
    Object.entries(originalCurrentInternational.selectedStates).forEach(([country, states]) => {
      const currStates = currentInternationalSelections.selectedStates[country] || [];
      const removed = states.filter((s) => !currStates.includes(s));
      if (removed.length > 0) removedStates[country] = removed;
    });

    const addedCities = {};
    Object.entries(currentInternationalSelections.selectedCities).forEach(([stateKey, cities]) => {
      const [country, state] = stateKey.split("-");
      const origCities = originalCurrentInternational.selectedCities[stateKey] || [];
      const added = cities.filter((c) => !origCities.includes(c));
      if (added.length > 0) {
        if (!addedCities[country]) addedCities[country] = {};
        addedCities[country][state] = { city: added };
      }
    });

    const removedCities = {};
    Object.entries(originalCurrentInternational.selectedCities).forEach(([stateKey, cities]) => {
      const [country, state] = stateKey.split("-");
      const currCities = currentInternationalSelections.selectedCities[stateKey] || [];
      const removed = cities.filter((c) => !currCities.includes(c));
      if (removed.length > 0) {
        if (!removedCities[country]) removedCities[country] = {};
        removedCities[country][state] = { city: removed };
      }
    });

    setAddExpansionLocationData((prev) => ({
      ...prev,
      currentOutletLocations: {
        ...prev.currentOutletLocations,
        international: {
          country: addedCountries,
          states: addedStates,
          city: addedCities,
        },
      },
    }));

    setRemoveExpansionLocationData((prev) => ({
      ...prev,
      currentOutletLocations: {
        ...prev.currentOutletLocations,
        international: {
          country: removedCountries,
          states: removedStates,
          city: removedCities,
        },
      },
    }));
  }, [currentInternationalSelections, originalCurrentInternational]);

  const computeExpansionInternationalChanges = useCallback(() => {
    const addedCountries = internationalSelections.selectedCountries.filter(
      (c) => !originalInternational.selectedCountries.includes(c)
    );
    const removedCountries = originalInternational.selectedCountries.filter(
      (c) => !internationalSelections.selectedCountries.includes(c)
    );

    const addedStates = {};
    Object.entries(internationalSelections.selectedStates).forEach(([country, states]) => {
      const origStates = originalInternational.selectedStates[country] || [];
      const added = states.filter((s) => !origStates.includes(s));
      if (added.length > 0) addedStates[country] = added;
    });

    const removedStates = {};
    Object.entries(originalInternational.selectedStates).forEach(([country, states]) => {
      const currStates = internationalSelections.selectedStates[country] || [];
      const removed = states.filter((s) => !currStates.includes(s));
      if (removed.length > 0) removedStates[country] = removed;
    });

    const addedCities = {};
    Object.entries(internationalSelections.selectedCities).forEach(([stateKey, cities]) => {
      const [country, state] = stateKey.split("-");
      const origCities = originalInternational.selectedCities[stateKey] || [];
      const added = cities.filter((c) => !origCities.includes(c));
      if (added.length > 0) {
        if (!addedCities[country]) addedCities[country] = {};
        addedCities[country][state] = { city: added };
      }
    });

    const removedCities = {};
    Object.entries(originalInternational.selectedCities).forEach(([stateKey, cities]) => {
      const [country, state] = stateKey.split("-");
      const currCities = internationalSelections.selectedCities[stateKey] || [];
      const removed = cities.filter((c) => !currCities.includes(c));
      if (removed.length > 0) {
        if (!removedCities[country]) removedCities[country] = {};
        removedCities[country][state] = { city: removed };
      }
    });

    setAddExpansionLocationData((prev) => ({
      ...prev,
      expansionLocations: {
        ...prev.expansionLocations,
        international: {
          country: addedCountries,
          states: addedStates,
          city: addedCities,
        },
      },
    }));

    setRemoveExpansionLocationData((prev) => ({
      ...prev,
      expansionLocations: {
        ...prev.expansionLocations,
        international: {
          country: removedCountries,
          states: removedStates,
          city: removedCities,
        },
      },
    }));
  }, [internationalSelections, originalInternational]);

  useEffect(() => {
    computeCurrentDomesticChanges();
  }, [computeCurrentDomesticChanges]);

  useEffect(() => {
    computeExpansionDomesticChanges();
  }, [computeExpansionDomesticChanges]);

  useEffect(() => {
    computeCurrentInternationalChanges();
  }, [computeCurrentInternationalChanges]);

  useEffect(() => {
    computeExpansionInternationalChanges();
  }, [computeExpansionInternationalChanges]);

  const handleDomesticStateSelection = useCallback(
    (selectedStates, type) => {
      const setSelections = type === "current" ? setCurrentDomesticSelections : setDomesticSelections;

      setSelections((prev) => {
        const newDistricts = prev.selectedDistricts.filter((district) => selectedStates.includes(district.state));
        return {
          selectedStates,
          selectedDistricts: newDistricts,
        };
      });
    },
    []
  );

  const handleDomesticDistrictSelection = useCallback(
    (stateName, districtName, isSelected, type) => {
      const setSelections = type === "current" ? setCurrentDomesticSelections : setDomesticSelections;

      setSelections((prev) => {
        const newSelections = {
          selectedStates: prev.selectedStates.includes(stateName)
            ? prev.selectedStates
            : [...prev.selectedStates, stateName],
          selectedDistricts: [...prev.selectedDistricts],
        };

        if (isSelected) {
          newSelections.selectedDistricts.push({ state: stateName, district: districtName });
        } else {
          newSelections.selectedDistricts = newSelections.selectedDistricts.filter(
            (d) => !(d.state === stateName && d.district === districtName)
          );
        }

        return newSelections;
      });
    },
    []
  );

  const handleInternationalCountrySelection = useCallback(
    async (selectedCountries, type) => {
      const setSelections = type === "current" ? setCurrentInternationalSelections : setInternationalSelections;
      const setStatesData = type === "current" ? setCurrentInternationalStates : setInternationalStates;

      setSelections((prev) => {
        const newSelections = {
          selectedCountries,
          selectedStates: Object.keys(prev.selectedStates)
            .filter((country) => selectedCountries.includes(country))
            .reduce((acc, country) => {
              acc[country] = prev.selectedStates[country];
              return acc;
            }, {}),
          selectedCities: Object.keys(prev.selectedCities)
            .filter((key) => selectedCountries.includes(key.split("-")[0]))
            .reduce((acc, key) => {
              acc[key] = prev.selectedCities[key];
              return acc;
            }, {}),
        };

        return newSelections;
      });

      for (const country of selectedCountries) {
        if (!apiCache.states[country]) {
          debouncedGetStatesByCountry(country, (states) => {
            setStatesData((prev) => ({ ...prev, [country]: states }));
          });
        }
      }
    },
    [debouncedGetStatesByCountry]
  );

  const handleInternationalStateSelection = useCallback(
    async (countryName, stateName, isSelected, type) => {
      const setSelections = type === "current" ? setCurrentInternationalSelections : setInternationalSelections;

      setSelections((prev) => {
        const newSelectedStates = { ...prev.selectedStates };
        const newSelectedCities = { ...prev.selectedCities };

        if (!newSelectedStates[countryName]) {
          newSelectedStates[countryName] = [];
        }

        if (isSelected) {
          newSelectedStates[countryName] = [...newSelectedStates[countryName], stateName];
        } else {
          newSelectedStates[countryName] = newSelectedStates[countryName].filter((s) => s !== stateName);
          if (newSelectedStates[countryName].length === 0) {
            delete newSelectedStates[countryName];
          }
        }

        const stateKey = `${countryName}-${stateName}`;
        if (newSelectedCities[stateKey]) {
          delete newSelectedCities[stateKey];
        }

        return {
          ...prev,
          selectedStates: newSelectedStates,
          selectedCities: newSelectedCities,
        };
      });

      if (isSelected) {
        const setCitiesData = type === "current" ? setCurrentInternationalCities : setInternationalCities;
        const cacheKey = `${countryName}-${stateName}`;
        if (!apiCache.cities[cacheKey]) {
          debouncedGetCitiesByCountryAndState(countryName, stateName, (cities) => {
            setCitiesData((prev) => ({ ...prev, [cacheKey]: cities }));
          });
        }
      }
    },
    [debouncedGetCitiesByCountryAndState]
  );

  const handleInternationalCitySelection = useCallback(
    (countryName, stateName, cityName, isSelected, type) => {
      const setSelections = type === "current" ? setCurrentInternationalSelections : setInternationalSelections;

      setSelections((prev) => {
        const newSelectedCities = { ...prev.selectedCities };
        const stateKey = `${countryName}-${stateName}`;

        if (!newSelectedCities[stateKey]) {
          newSelectedCities[stateKey] = [];
        }

        if (isSelected) {
          newSelectedCities[stateKey] = [...newSelectedCities[stateKey], cityName];
        } else {
          newSelectedCities[stateKey] = newSelectedCities[stateKey].filter((c) => c !== cityName);
          if (newSelectedCities[stateKey].length === 0) {
            delete newSelectedCities[stateKey];
          }
        }

        return {
          ...prev,
          selectedCities: newSelectedCities,
        };
      });
    },
    []
  );

  const handleSelectAllStates = useCallback(
    (isSelected, type) => {
      const setSelections = type === "current" ? setCurrentDomesticSelections : setDomesticSelections;

      setSelections((prev) => {
        const newStates = isSelected ? states.map((s) => s.name) : [];
        const newDistricts = isSelected
          ? Object.keys(districts).reduce((acc, stateName) => {
              acc.push(...(districts[stateName] || []).map((district) => ({ state: stateName, district })));
              return acc;
            }, [])
          : [];

        return {
          selectedStates: newStates,
          selectedDistricts: newDistricts,
        };
      });
    },
    [states, districts]
  );

  const handleSelectAllDistricts = useCallback(
    (stateName, districts, isSelected, type) => {
      const setSelections = type === "current" ? setCurrentDomesticSelections : setDomesticSelections;

      setSelections((prev) => {
        let newSelectedDistricts = [...prev.selectedDistricts];

        if (isSelected) {
          districts.forEach((district) => {
            if (!newSelectedDistricts.some((d) => d.state === stateName && d.district === district)) {
              newSelectedDistricts.push({ state: stateName, district });
            }
          });
        } else {
          newSelectedDistricts = newSelectedDistricts.filter((d) => d.state !== stateName);
        }

        return {
          selectedStates: prev.selectedStates.includes(stateName)
            ? prev.selectedStates
            : [...prev.selectedStates, stateName],
          selectedDistricts: newSelectedDistricts,
        };
      });
    },
    []
  );

  const handleSelectAllStateCities = useCallback(
    (countryName, stateName, cities, isSelected, type) => {
      const setSelections = type === "current" ? setCurrentInternationalSelections : setInternationalSelections;

      setSelections((prev) => {
        const newSelectedCities = { ...prev.selectedCities };
        const stateKey = `${countryName}-${stateName}`;

        if (isSelected) {
          newSelectedCities[stateKey] = [...cities];
        } else {
          delete newSelectedCities[stateKey];
        }

        return {
          ...prev,
          selectedCities: newSelectedCities,
        };
      });
    },
    []
  );

  useEffect(() => {
    loadDomesticData();
    fetchCountries();

    // Current Domestic
    if (data?.currentOutletLocations?.domestic?.locations?.length > 0) {
      const domesticLocations = data.currentOutletLocations.domestic.locations;
      const selectedStates = domesticLocations.map((loc) => loc.state);
      const selectedDistricts = domesticLocations.flatMap((loc) =>
        loc.districts?.map((district) => ({
          state: loc.state,
          district: district.district || district,
        })) || []
      );

      setOriginalCurrentDomestic({
        selectedStates,
        selectedDistricts,
      });
      setCurrentDomesticSelections({
        selectedStates,
        selectedDistricts,
      });
    }

    // Current International
    let currentIntlSelections = {
      selectedCountries: [],
      selectedStates: {},
      selectedCities: {},
    };
    if (data?.currentOutletLocations?.international?.locations?.length > 0) {
      const intlLocations = data.currentOutletLocations.international.locations;
      currentIntlSelections.selectedCountries = intlLocations.map((loc) => loc.country);
      currentIntlSelections.selectedStates = {};
      currentIntlSelections.selectedCities = {};

      intlLocations.forEach((loc) => {
        if (loc.states?.length > 0) {
          currentIntlSelections.selectedStates[loc.country] = loc.states.map((state) => state.state);
          loc.states.forEach((state) => {
            const stateKey = `${loc.country}-${state.state}`;
            if (state.cities?.length > 0) {
              currentIntlSelections.selectedCities[stateKey] = state.cities.map((city) => city.city || city);
            }
          });
        }
      });

      setOriginalCurrentInternational(currentIntlSelections);
      setCurrentInternationalSelections(currentIntlSelections);
    }

    // Expansion Domestic
    if (data?.expansionLocations?.domestic?.locations?.length > 0) {
      const domesticLocations = data.expansionLocations.domestic.locations;
      const selectedStates = domesticLocations.map((loc) => loc.state);
      const selectedDistricts = domesticLocations.flatMap((loc) =>
        loc.districts?.map((district) => ({
          state: loc.state,
          district: district.district || district,
        })) || []
      );

      setOriginalDomestic({
        selectedStates,
        selectedDistricts,
      });
      setDomesticSelections({
        selectedStates,
        selectedDistricts,
      });
    }

    // Expansion International
    let intlSelections = {
      selectedCountries: [],
      selectedStates: {},
      selectedCities: {},
    };
    if (data?.expansionLocations?.international?.locations?.length > 0) {
      const intlLocations = data.expansionLocations.international.locations;
      intlSelections.selectedCountries = intlLocations.map((loc) => loc.country);
      intlSelections.selectedStates = {};
      intlSelections.selectedCities = {};

      intlLocations.forEach((loc) => {
        if (loc.states?.length > 0) {
          intlSelections.selectedStates[loc.country] = loc.states.map((state) => state.state);
          loc.states.forEach((state) => {
            const stateKey = `${loc.country}-${state.state}`;
            if (state.cities?.length > 0) {
              intlSelections.selectedCities[stateKey] = state.cities.map((city) => city.city || city);
            }
          });
        }
      });

      setOriginalInternational(intlSelections);
      setInternationalSelections(intlSelections);
    }

    const loadInitialInternationalData = async () => {
      // Current
      for (const country of currentIntlSelections.selectedCountries) {
        await getStatesByCountry(country, (states) => {
          setCurrentInternationalStates((prev) => ({ ...prev, [country]: states }));
        });
        const selectedStates = currentIntlSelections.selectedStates[country] || [];
        for (const state of selectedStates) {
          await getCitiesByCountryAndState(country, state, (cities) => {
            setCurrentInternationalCities((prev) => ({ ...prev, [`${country}-${state}`]: cities }));
          });
        }
      }

      // Expansion
      for (const country of intlSelections.selectedCountries) {
        await getStatesByCountry(country, (states) => {
          setInternationalStates((prev) => ({ ...prev, [country]: states }));
        });
        const selectedStates = intlSelections.selectedStates[country] || [];
        for (const state of selectedStates) {
          await getCitiesByCountryAndState(country, state, (cities) => {
            setInternationalCities((prev) => ({ ...prev, [`${country}-${state}`]: cities }));
          });
        }
      }
    };

    loadInitialInternationalData();
  }, [data, loadDomesticData, fetchCountries, getStatesByCountry, getCitiesByCountryAndState]);

  const handleInternationalExpansionChange = useCallback(
    (value) => {
      const newValue = value === data?.isInternationalExpansion ? null : value;
      if (typeof onChange === "function") {
        onChange("isInternationalExpansion", newValue);
      }
    },
    [data, onChange]
  );

  const handleLocationTypeChange = useCallback((e) => {
    setLocationType(e.target.value);
  }, []);

  const handleCurrentOutletLocationTypeChange = useCallback((e) => {
    setCurrentOutletLocationType(e.target.value);
  }, []);

  const removeLocationItems = useCallback(
    (type, locationType, field, value) => {
      const setSelections = type === "current" ? setCurrentDomesticSelections : setDomesticSelections;
      const setInternationalSelections = type === "current" ? setCurrentInternationalSelections : setInternationalSelections;
      const locationKey = type === "current" ? "currentOutletLocations" : "expansionLocations";

      if (locationType === "domestic") {
        if (field === "state") {
          setSelections((prev) => ({
            selectedStates: prev.selectedStates.filter((state) => state !== value),
            selectedDistricts: prev.selectedDistricts.filter((d) => d.state !== value),
          }));
        } else if (field === "district") {
          setSelections((prev) => ({
            selectedStates: [...prev.selectedStates],
            selectedDistricts: prev.selectedDistricts.filter(
              (d) => !(d.state === value.state && d.district === value.district)
            ),
          }));
        }
      } else {
        if (field === "country") {
          setInternationalSelections((prev) => ({
            selectedCountries: prev.selectedCountries.filter((country) => country !== value),
            selectedStates: Object.keys(prev.selectedStates)
              .filter((country) => country !== value)
              .reduce((acc, country) => {
                acc[country] = prev.selectedStates[country];
                return acc;
              }, {}),
            selectedCities: Object.keys(prev.selectedCities)
              .filter((key) => key.split("-")[0] !== value)
              .reduce((acc, key) => {
                acc[key] = prev.selectedCities[key];
                return acc;
              }, {}),
          }));
        } else if (field === "state") {
          setInternationalSelections((prev) => {
            const newSelectedStates = { ...prev.selectedStates };
            const newSelectedCities = { ...prev.selectedCities };
            const [country, state] = value.split("-");

            newSelectedStates[country] = newSelectedStates[country].filter((s) => s !== state);
            if (newSelectedStates[country].length === 0) {
              delete newSelectedStates[country];
            }
            delete newSelectedCities[`${country}-${state}`];

            return {
              ...prev,
              selectedStates: newSelectedStates,
              selectedCities: newSelectedCities,
            };
          });
        } else if (field === "city") {
          setInternationalSelections((prev) => {
            const newSelectedCities = { ...prev.selectedCities };
            const [country, state, city] = value.split("-");
            const stateKey = `${country}-${state}`;

            newSelectedCities[stateKey] = newSelectedCities[stateKey].filter((c) => c !== city);
            if (newSelectedCities[stateKey].length === 0) {
              delete newSelectedCities[stateKey];
            }

            return {
              ...prev,
              selectedCities: newSelectedCities,
            };
          });
        }
      }
    },
    []
  );

  return (
    <Box sx={{ pr: 1, mr: { sm: 0, md: 10 }, ml: { sm: 0, md: 10 } }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Brand Expansion Location Details
      </Typography>

      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <Typography variant="subtitle2" mt={0} gap={2}>
          Is your brand expanding internationally? :
        </Typography>
        <RadioGroup
          row
          value={data?.isInternationalExpansion === null ? "" : data?.isInternationalExpansion}
          sx={{ gap: 11, justifyContent: "start", ml: 15 }}
          onChange={(e) => handleInternationalExpansionChange(e.target.value === "true")}
          disabled={!isEditing}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
        {errors?.isInternationalExpansion && (
          <FormHelperText error sx={{ ml: 2 }}>
            {errors.isInternationalExpansion}
          </FormHelperText>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0, color: "#ff9800" }}>
        Current Outlet Locations
      </Typography>
      <RadioGroup
        sx={{ justifyContent: "center", gap: 10 }}
        row
        value={currentOutletLocationType}
        onChange={handleCurrentOutletLocationTypeChange}
        disabled={!isEditing}
        name="currentOutletLocationType"
      >
        <FormControlLabel value="domestic" control={<Radio />} label="India" />
        <FormControlLabel value="international" control={<Radio />} label="International" />
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
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
            handleSelectAllStates={handleSelectAllStates}
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
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
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
            handleInternationalCountrySelection={handleInternationalCountrySelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
          />
          <InternationalStateDrawer
            type="current"
            selections={currentInternationalSelections}
            drawerOpen={currentDrawerOpen.intStates}
            statesData={currentInternationalStates}
            searchFilters={searchFilters}
            handleInternationalStateSelection={handleInternationalStateSelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
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
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
            handleSelectAllStateCities={handleSelectAllStateCities}
          />
        </>
      )}

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#ff9800" }}>
        Expansion Locations
      </Typography>
      <RadioGroup
        row
        value={locationType}
        onChange={handleLocationTypeChange}
        sx={{ justifyContent: "center", gap: 10 }}
        disabled={!isEditing}
        name="expansionLocationType"
      >
        <FormControlLabel value="domestic" control={<Radio />} label="India" />
        <FormControlLabel value="international" control={<Radio />} label="International" />
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
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
            handleSelectAllStates={handleSelectAllStates}
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
            isEditing={true}
            removeLocationItems={removeLocationItems}
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
            handleInternationalCountrySelection={handleInternationalCountrySelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
          />
          <InternationalStateDrawer
            type="expansion"
            selections={internationalSelections}
            drawerOpen={drawerOpen.intStates}
            statesData={internationalStates}
            searchFilters={searchFilters}
            handleInternationalStateSelection={handleInternationalStateSelection}
            handleSearchChange={handleSearchChange}
            toggleDrawer={toggleDrawer}
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
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
            isEditing={isEditing}
            removeLocationItems={removeLocationItems}
            handleSelectAllStateCities={handleSelectAllStateCities}
          />
        </>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

const DomesticStateDrawer = ({
  type,
  selections,
  drawerOpen,
  sortedStates,
  handleDomesticStateSelection,
  handleSelectAllDomesticStates,
  handleSearchChange,
  toggleDrawer,
  isEditing,
  removeLocationItems,
  handleSelectAllStates,
}) => {
  const allStatesSelected = selections.selectedStates.length === sortedStates.length;
  const someStatesSelected = selections.selectedStates.length > 0 && !allStatesSelected;

  return (
    <Box sx={{ mt: 4, mb: 3 }}>
      <Button
        variant="outlined"
        fullWidth
        color="warning"
        onClick={() => toggleDrawer(type, { states: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
        disabled={!isEditing}
      >
        {selections.selectedStates.length > 0
          ? `${selections.selectedStates.length} states selected`
          : "Select States"}
      </Button>

      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { states: false })}
        PaperProps={{
          sx: {
            width: "98%",
            height: "100vh",
            borderRadius: 0,
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: "#ff9800" }}>
            Select States
          </Typography>
          <Button variant="outlined" color="warning" onClick={() => toggleDrawer(type, { states: false })}>
            Done
          </Button>
        </Box>

        <TextField
          placeholder="Search states..."
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onChange={(e) => handleSearchChange("states", e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={allStatesSelected}
            indeterminate={someStatesSelected}
            onChange={() => handleSelectAllStates(!allStatesSelected, type)}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All States
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto", mt: 1 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, px: 5 }}>
            {sortedStates.map((state) => {
              const isSelected = selections.selectedStates.includes(state.name);
              return (
                <FormControlLabel
                  key={`state-${state.name}`}
                  control={
                    <Checkbox
                      checked={isSelected}
                      onChange={() => {
                        const currentSelected = [...selections.selectedStates];
                        if (isSelected) {
                          currentSelected.splice(currentSelected.indexOf(state.name), 1);
                        } else {
                          currentSelected.push(state.name);
                        }
                        handleDomesticStateSelection(currentSelected, type);
                      }}
                    />
                  }
                  label={state.name}
                />
              );
            })}
          </Box>
        </Box>
      </Drawer>

      {selections.selectedStates.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected States ({selections.selectedStates.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1 }}>
                {selections.selectedStates.map((state) => (
                  <Chip
                    key={`selected-state-${state}`}
                    label={state}
                    onDelete={() => isEditing && removeLocationItems(type, "domestic", "state", state)}
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

const DomesticDistrictDrawer = ({
  type,
  selections,
  drawerOpen,
  districtsData,
  sortedDistricts,
  searchFilters,
  handleDomesticDistrictSelection,
  handleSearchChange,
  handleSelectAllDistricts,
  toggleDrawer,
  isEditing,
  removeLocationItems,
}) => {
  if (selections.selectedStates.length === 0) return null;

  const districtsByState = selections.selectedDistricts.reduce((acc, { state, district }) => {
    if (!acc[state]) acc[state] = [];
    acc[state].push(district);
    return acc;
  }, {});

  const totalDistricts = selections.selectedStates.reduce(
    (total, stateName) => total + (districtsData[stateName]?.length || 0),
    0
  );

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Button
        variant="outlined"
        color="warning"
        fullWidth
        onClick={() => toggleDrawer(type, { districts: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
        disabled={!isEditing}
      >
        {selections.selectedDistricts.length > 0
          ? `${selections.selectedDistricts.length} districts selected`
          : "Select Districts"}
      </Button>

      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { districts: false })}
        PaperProps={{
          sx: {
            width: "98%",
            height: "100vh",
            borderRadius: 0,
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: "#ff9800" }}>
            Select Districts
          </Typography>
          <Button variant="outlined" color="warning" onClick={() => toggleDrawer(type, { districts: false })}>
            Done
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search districts..."
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onChange={(e) => handleSearchChange("districts", e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={selections.selectedDistricts.length > 0 && selections.selectedDistricts.length === totalDistricts}
            indeterminate={selections.selectedDistricts.length > 0 && selections.selectedDistricts.length < totalDistricts}
            onChange={() => {
              selections.selectedStates.forEach((stateName) => {
                const stateDistricts = districtsData[stateName] || [];
                handleSelectAllDistricts(stateName, stateDistricts, selections.selectedDistricts.length !== totalDistricts, type);
              });
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All Districts
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          {selections.selectedStates.map((stateName) => {
            const stateDistricts = (districtsData[stateName] || [])
              .filter((d) => d.toLowerCase().includes(searchFilters.districts.toLowerCase()))
              .sort((a, b) => a.localeCompare(b));

            if (stateDistricts.length === 0) return null;

            const selectedDistrictsForState = selections.selectedDistricts
              .filter((d) => d.state === stateName)
              .map((d) => d.district);

            const allSelected = stateDistricts.every((d) => selectedDistrictsForState.includes(d));

            return (
              <Box key={`districts-section-${stateName}`} sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={selectedDistrictsForState.length > 0 && !allSelected}
                    onChange={() => handleSelectAllDistricts(stateName, stateDistricts, !allSelected, type)}
                  />
                  <Typography variant="subtitle1" sx={{ color: "orange", ml: 1 }}>
                    {stateName}
                  </Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, ml: 4 }}>
                  {stateDistricts.map((district) => {
                    const isSelected = selectedDistrictsForState.includes(district);
                    return (
                      <FormControlLabel
                        key={`district-${stateName}-${district}`}
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleDomesticDistrictSelection(stateName, district, !isSelected, type)}
                          />
                        }
                        label={district}
                      />
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Drawer>

      {selections.selectedDistricts.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected Districts ({selections.selectedDistricts.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(districtsByState).map(([state, districts]) => (
                <Box key={`selected-districts-${state}`} sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ color: "orange", mb: 1 }}>
                    {state}
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1, ml: 2 }}>
                    {districts.map((district) => (
                      <Chip
                        key={`selected-district-${state}-${district}`}
                        label={district}
                        onDelete={() => isEditing && removeLocationItems(type, "domestic", "district", { state, district })}
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

const InternationalCountryDrawer = ({
  type,
  selections,
  drawerOpen,
  sortedCountries,
  searchFilters,
  handleInternationalCountrySelection,
  handleSearchChange,
  toggleDrawer,
  isEditing,
  removeLocationItems,
}) => {
  const allSelected = selections.selectedCountries.length === sortedCountries.length;
  const someSelected = selections.selectedCountries.length > 0 && !allSelected;

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Button
        variant="outlined"
        color="success"
        fullWidth
        onClick={() => toggleDrawer(type, { countries: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
        disabled={!isEditing}
      >
        {selections.selectedCountries.length > 0
          ? `${selections.selectedCountries.length} countries selected`
          : "Select Countries"}
      </Button>

      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { countries: false })}
        PaperProps={{
          sx: {
            width: "98%",
            height: "100vh",
            borderRadius: 0,
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Select Countries
          </Typography>
          <Button variant="outlined" color="warning" onClick={() => toggleDrawer(type, { countries: false })}>
            Done
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search countries..."
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onChange={(e) => handleSearchChange("countries", e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected}
            onChange={async () => {
              const updated = allSelected ? [] : sortedCountries.map((c) => c.name);
              await handleInternationalCountrySelection(updated, type);
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All Countries
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1 }}>
            {sortedCountries.map((country) => {
              const isSelected = selections.selectedCountries.includes(country.name);
              return (
                <FormControlLabel
                  key={`country-${country.name}`}
                  control={
                    <Checkbox
                      checked={isSelected}
                      onChange={async () => {
                        const updated = isSelected
                          ? selections.selectedCountries.filter((c) => c !== country.name)
                          : [...selections.selectedCountries, country.name];
                        await handleInternationalCountrySelection(updated, type);
                      }}
                    />
                  }
                  label={country.name}
                />
              );
            })}
          </Box>
        </Box>
      </Drawer>

      {selections.selectedCountries.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected Countries ({selections.selectedCountries.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1 }}>
                {selections.selectedCountries.map((country) => (
                  <Chip
                    key={`selected-country-${country}`}
                    label={country}
                    onDelete={() => isEditing && removeLocationItems(type, "international", "country", country)}
                    color="success"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

const InternationalStateDrawer = ({
  type,
  selections,
  drawerOpen,
  statesData,
  searchFilters,
  handleInternationalStateSelection,
  handleSearchChange,
  toggleDrawer,
  isEditing,
  removeLocationItems,
}) => {
  if (selections.selectedCountries.length === 0) return null;

  const statesByCountry = selections.selectedStates;
  const totalStates = selections.selectedCountries.reduce(
    (total, country) => total + (statesData[country]?.length || 0),
    0
  );
  const selectedCount = Object.values(statesByCountry).reduce((acc, states) => acc + states.length, 0);

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Button
        variant="outlined"
        color="warning"
        fullWidth
        onClick={() => toggleDrawer(type, { intStates: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
        disabled={!isEditing}
      >
        {selectedCount > 0 ? `${selectedCount} states selected` : "Select States"}
      </Button>

      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { intStates: false })}
        PaperProps={{
          sx: {
            width: "98%",
            height: "100vh",
            borderRadius: 0,
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: "#ff9800" }}>
            Select States
          </Typography>
          <Button variant="outlined" color="warning" onClick={() => toggleDrawer(type, { intStates: false })}>
            Done
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search states..."
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onChange={(e) => handleSearchChange("intStates", e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={selectedCount > 0 && selectedCount === totalStates}
            indeterminate={selectedCount > 0 && selectedCount < totalStates}
            onChange={() => {
              selections.selectedCountries.forEach((country) => {
                const states = (statesData[country] || []).map((s) => s.name);
                states.forEach((state) => {
                  handleInternationalStateSelection(country, state, selectedCount !== totalStates, type);
                });
              });
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All States
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          {selections.selectedCountries.map((country) => {
            const allStates = statesData[country] || [];
            const filteredStates = allStates
              .filter((s) => s.name.toLowerCase().includes(searchFilters.intStates.toLowerCase()))
              .sort((a, b) => a.name.localeCompare(b.name));

            if (filteredStates.length === 0) return null;

            const selectedStates = statesByCountry[country] || [];
            const allSelected = filteredStates.every((s) => selectedStates.includes(s.name));

            return (
              <Box key={`states-section-${country}`} sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={selectedStates.length > 0 && !allSelected}
                    onChange={() => {
                      filteredStates.forEach((state) => {
                        handleInternationalStateSelection(country, state.name, !allSelected, type);
                      });
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ color: "orange", ml: 1 }}>
                    {country}
                  </Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, ml: 4 }}>
                  {filteredStates.map((state) => {
                    const isSelected = selectedStates.includes(state.name);
                    return (
                      <FormControlLabel
                        key={`state-${country}-${state.name}`}
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleInternationalStateSelection(country, state.name, !isSelected, type)}
                          />
                        }
                        label={state.name}
                      />
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Drawer>

      {selectedCount > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected States ({selectedCount})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(statesByCountry).map(([country, states]) => (
                <Box key={`selected-states-${country}`} sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ color: "orange", mb: 1 }}>
                    {country}
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1, ml: 2 }}>
                    {states.map((state) => (
                      <Chip
                        key={`selected-state-${country}-${state}`}
                        label={state}
                        onDelete={() => isEditing && removeLocationItems(type, "international", "state", `${country}-${state}`)}
                        variant="outlined"
                        color="success"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

const InternationalCityDrawer = ({
  type,
  selections,
  drawerOpen,
  citiesData,
  searchFilters,
  handleInternationalCitySelection,
  handleSearchChange,
  toggleDrawer,
  isEditing,
  removeLocationItems,
  handleSelectAllStateCities,
}) => {
  if (Object.keys(selections.selectedStates).length === 0) return null;

  const totalCities = Object.entries(selections.selectedStates).reduce(
    (total, [country, states]) =>
      total +
      states.reduce((acc, state) => {
        const stateKey = `${country}-${state}`;
        const cities = citiesData[stateKey] || [];
        return acc + cities.length;
      }, 0),
    0
  );

  const selectedCityCount = Object.values(selections.selectedCities).flat().length;

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Button
        variant="outlined"
        color="warning"
        fullWidth
        onClick={() => toggleDrawer(type, { intCities: true })}
        endIcon={<ChevronDown />}
        sx={{ justifyContent: "space-between" }}
        disabled={!isEditing}
      >
        {selectedCityCount > 0 ? `${selectedCityCount} cities selected` : "Select Cities"}
      </Button>

      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => toggleDrawer(type, { intCities: false })}
        PaperProps={{
          sx: {
            width: "98%",
            height: "100vh",
            borderRadius: 0,
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: "#ff9800" }}>
            Select Cities
          </Typography>
          <Button variant="outlined" color="warning" onClick={() => toggleDrawer(type, { intCities: false })}>
            Done
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search cities..."
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onChange={(e) => handleSearchChange("intCities", e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Checkbox
            checked={selectedCityCount > 0 && selectedCityCount === totalCities}
            indeterminate={selectedCityCount > 0 && selectedCityCount < totalCities}
            onChange={() => {
              const shouldSelectAll = selectedCityCount !== totalCities;
              Object.entries(selections.selectedStates).forEach(([country, states]) => {
                states.forEach((state) => {
                  const stateKey = `${country}-${state}`;
                  const cities = citiesData[stateKey] || [];
                  handleSelectAllStateCities(country, state, cities, shouldSelectAll, type);
                });
              });
            }}
          />
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Select All Cities
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto" }}>
          {Object.entries(selections.selectedStates).map(([country, states]) =>
            states.map((state) => {
              const stateKey = `${country}-${state}`;
              const cities = citiesData[stateKey] || [];
              const filteredCities = cities
                .filter((city) => city.toLowerCase().includes(searchFilters.intCities.toLowerCase()))
                .sort((a, b) => a.localeCompare(b));

              const selectedCities = selections.selectedCities[stateKey] || [];
              const allSelected = filteredCities.every((city) => selectedCities.includes(city));

              if (filteredCities.length === 0) return null;

              return (
                <Box key={`cities-section-${stateKey}`} sx={{ mb: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Checkbox
                      checked={allSelected}
                      indeterminate={selectedCities.length > 0 && !allSelected}
                      onChange={() => handleSelectAllStateCities(country, state, filteredCities, !allSelected, type)}
                    />
                    <Typography variant="subtitle1" sx={{ color: "orange", ml: 1 }}>
                      {country} - {state}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, ml: 4 }}>
                    {filteredCities.map((city) => {
                      const isSelected = selectedCities.includes(city);
                      return (
                        <FormControlLabel
                          key={`city-${stateKey}-${city}`}
                          control={
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleInternationalCitySelection(country, state, city, !isSelected, type)}
                            />
                          }
                          label={city}
                        />
                      );
                    })}
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Drawer>

      {selectedCityCount > 0 && (
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                View Selected Cities ({selectedCityCount})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(selections.selectedCities).map(([stateKey, cities]) => {
                const [country, state] = stateKey.split("-");
                return (
                  <Box key={`selected-cities-${stateKey}`} sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ color: "orange", mb: 1 }}>
                      {country} - {state}
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 1, ml: 2 }}>
                      {cities.map((city) => (
                        <Chip
                          key={`selected-city-${stateKey}-${city}`}
                          label={city}
                          onDelete={() => isEditing && removeLocationItems(type, "international", "city", `${country}-${state}-${city}`)}
                          color="success"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>   
  );
};

export default ExpansionLocationEdit;