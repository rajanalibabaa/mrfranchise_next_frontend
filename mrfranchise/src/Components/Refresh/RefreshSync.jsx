"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/Redux/Slices/AuthSlice/authSlice.jsx";

/**
 * RefreshSync Component
 * Synchronizes logout events and page refreshes across multiple tabs/windows
 * Uses BroadcastChannel API, StorageEvent, and VisibilityChange for cross-tab communication
 */
export default function RefreshSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 🔄 Strategy 1: BroadcastChannel API (Modern browsers - best performance)
    let broadcastChannel = null;

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        broadcastChannel = new BroadcastChannel("sync_channel");

        broadcastChannel.onmessage = (event) => {
          const { type } = event.data;

          if (type === "LOGOUT") {
            handleLogoutSync();
          } else if (type === "REFRESH") {
            window.location.reload();
          }
        };
      } catch (error) {
        console.warn("BroadcastChannel initialization failed:", error);
      }
    }

    // 🔄 Strategy 2: Storage Events (Fallback for older browsers)
    const handleStorageChange = (event) => {
      if (event.key === "logout_triggered" && event.newValue === "true") {
        handleLogoutSync();
      } else if (event.key === "refreshAllTabs" && event.newValue === "true") {
        window.location.reload();
      }
    };

    // 🔄 Strategy 3: Periodic token validation (Safety net)
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem("accessToken");
      const isLoggedOut = localStorage.getItem("logout_triggered") === "true";

      if (!token || isLoggedOut) {
        handleLogoutSync();
      }
    }, 5000); // Check every 5 seconds

    // 🔄 Strategy 4: Detect visibility changes (tab becomes active)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const isLoggedOut = localStorage.getItem("logout_triggered") === "true";
        if (isLoggedOut) {
          handleLogoutSync();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(tokenCheckInterval);

      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, [dispatch]);

  const handleLogoutSync = () => {
    // ✅ 1. Redux reset
    dispatch(logout());

    // ✅ 2. Clear ALL storage
    localStorage.clear();
    sessionStorage.clear();

    // ✅ 3. Clear cookies
    if (typeof document !== "undefined") {
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }

    // ✅ 4. Clear service worker cache
    if (typeof window !== "undefined" && "caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }

    // ✅ 5. Redirect to home
    if (typeof window !== "undefined") {
      window.location.replace("/");
    }
  };

  return null;
}
