/**
 * Logout Service
 * Centralized logout logic with cross-tab synchronization
 * Handles Redux, storage, cookies, cache, and tab synchronization
 */

/**
 * Clear all user data from browser
 */
export const clearAllUserData = () => {
  try {
    // ✅ 1. Clear ALL storage
    localStorage.clear();
    sessionStorage.clear();

    // ✅ 2. Clear cookies
    if (typeof document !== "undefined") {
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }

    // ✅ 3. Clear service worker cache
    if (typeof window !== "undefined" && "caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};

/**
 * Broadcast logout event to other tabs using multiple strategies
 * @returns {Promise<void>}
 */
export const broadcastLogoutEvent = async () => {
  try {
    // Strategy 1: BroadcastChannel API (Modern - Best Performance)
    if ("BroadcastChannel" in window) {
      try {
        const channel = new BroadcastChannel("sync_channel");
        channel.postMessage({ type: "LOGOUT", timestamp: Date.now() });
        channel.close();
      } catch (error) {
        console.warn("BroadcastChannel failed:", error);
      }
    }

    // Strategy 2: StorageEvent (Fallback - Better Compatibility)
    try {
      localStorage.setItem("logout_triggered", "true");
      localStorage.setItem("logout_timestamp", Date.now().toString());
    } catch (error) {
      console.warn("StorageEvent trigger failed:", error);
    }
  } catch (error) {
    console.error("Error broadcasting logout:", error);
  }
};

/**
 * Perform logout API call
 * @param {string} userId - User ID or UUID
 * @param {string} accessToken - JWT token
 * @returns {Promise<{status: number, data: any}>}
 */
export const callLogoutAPI = async (userId, accessToken) => {
  try {
    const axios = await import("axios").then((module) => module.default);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/logout/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
        timeout: 5000,
      }
    );

    return { status: response.status, data: response.data };
  } catch (error) {
    console.error("Logout API error:", error.message);
    throw error;
  }
};

/**
 * Redirect to home page
 */
export const redirectToHome = () => {
  if (typeof window !== "undefined") {
    window.location.replace("/");
  }
};

/**
 * Complete logout process
 * @param {Object} options - Configuration options
 * @param {Function} options.onLogout - Callback to dispatch Redux logout action
 * @param {boolean} options.redirectToHome - Whether to redirect to home (default: true)
 * @param {string} options.redirectUrl - Custom redirect URL
 */
export const performFullLogout = async (options = {}) => {
  const {
    onLogout = null,
    redirectToHome: shouldRedirect = true,
    redirectUrl = "/",
  } = options;

  try {
    // 1. Redux reset
    if (onLogout && typeof onLogout === "function") {
      onLogout();
    }

    // 2. Clear all data
    clearAllUserData();

    // 3. Broadcast to other tabs
    await broadcastLogoutEvent();

    // 4. Redirect if needed
    if (shouldRedirect && typeof window !== "undefined") {
      window.location.replace(redirectUrl);
    }
  } catch (error) {
    console.error("Full logout process failed:", error);
    // Force redirect even on error
    if (shouldRedirect && typeof window !== "undefined") {
      window.location.replace(redirectUrl);
    }
  }
};
