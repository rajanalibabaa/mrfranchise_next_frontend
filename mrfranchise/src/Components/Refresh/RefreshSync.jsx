"use client";

import { useEffect } from "react";

export default function RefreshSync() {

  useEffect(() => {
    const handleRefresh = (event) => {
      if (event.key === "refreshAllTabs") {
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleRefresh);

    return () => {
      window.removeEventListener("storage", handleRefresh);
    };
  }, []);

  return null;
}
