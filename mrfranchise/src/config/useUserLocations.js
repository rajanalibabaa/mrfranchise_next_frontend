"use client";

import { useEffect, useState } from "react";
import { getOrSetUserLocation } from "./locationService";

export default function useUserLocation() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getOrSetUserLocation().then(setLocation);
  }, []);

  return location;
}