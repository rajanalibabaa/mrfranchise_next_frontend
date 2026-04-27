import React, { useEffect, useState } from "react";
import LocationPermissionModal from "./LocationPermissionModal";
import { getUserLocationWithPermission } from "./locationService";

const YourComponent = () => {
  const [openLocationModal, setOpenLocationModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");

    if (!saved) {
      setOpenLocationModal(true); // show popup only first time
    }
  }, []);

  const handleAllow = async () => {
    setOpenLocationModal(false);

    const location = await getUserLocationWithPermission();

    console.log("User Location:", location);

    // 👉 here trigger your state logic
    window.location.reload(); // optional (or update state)
  };

  const handleDeny = () => {
    setOpenLocationModal(false);
  };

  return (
    <>
      <LocationPermissionModal
        open={openLocationModal}
        onAllow={handleAllow}
        onDeny={handleDeny}
      />
    </>
  );
};

export default YourComponent;