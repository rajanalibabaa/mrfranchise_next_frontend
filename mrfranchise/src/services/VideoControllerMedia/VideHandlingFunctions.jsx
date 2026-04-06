"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const VideoControllerContext = createContext();

export const VideoControllerProvider = ({ children }) => {
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const videoRefs = useRef(new Map());
  const eventListeners = useRef(new Map());
  const isPausedByUser = useRef(new Set()); // Track manual pauses

  /** Remove event listeners safely */
  const removeEventListeners = useCallback((id, video) => {
    if (eventListeners.current.has(id) && video) {
      const { play, pause } = eventListeners.current.get(id);
      video.removeEventListener('play', play);
      video.removeEventListener('pause', pause);
      eventListeners.current.delete(id);
    }
  }, []);

  /** Add event listeners */
  const addEventListeners = useCallback((id, video) => {
    removeEventListeners(id, video); // cleanup old first

    const handlePlay = () => {
      // Only update if not paused by user
      if (!isPausedByUser.current.has(id)) {
        setCurrentPlayingId(id);
      }
    };
    
    const handlePause = () => {
      if (currentPlayingId === id) setCurrentPlayingId(null);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    eventListeners.current.set(id, { play: handlePlay, pause: handlePause });
  }, [removeEventListeners]);

  /** Register video element */
  const registerVideo = useCallback((id, videoEl) => {
    if (videoEl) {
      videoRefs.current.set(id, videoEl);
      addEventListeners(id, videoEl);
    }
    return () => unregisterVideo(id);
  }, [addEventListeners]);

  /** Unregister */
  const unregisterVideo = useCallback((id) => {
    const video = videoRefs.current.get(id);
    if (video) {
      removeEventListeners(id, video);
    }
    videoRefs.current.delete(id);
    isPausedByUser.current.delete(id);
  }, [removeEventListeners]);

  /** Play selected video & pause others */
  const playVideo = useCallback(async (id) => {
    try {
      // Remove user pause flag
      isPausedByUser.current.delete(id);

      // Pause all others first
      videoRefs.current.forEach((vid, vidId) => {
        if (vidId !== id && !vid.paused) {
          vid.pause();
        }
      });

      const video = videoRefs.current.get(id);
      if (!video) {
        console.warn(`Video ${id} not found in registry`);
        return;
      }

      // Ensure listeners are attached
      addEventListeners(id, video);

      // Try to play
      await video.play();
      setCurrentPlayingId(id);

    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn("play() aborted:", err);
      } else if (err.name === 'NotAllowedError') {
        console.warn("Autoplay blocked, user interaction required");
      } else {
        console.error("playVideo failed:", err);
        throw err; // Re-throw for component error handling
      }
    }
  }, [addEventListeners]);

  /** Pause video */
  const pauseVideo = useCallback((id) => {
    const video = videoRefs.current.get(id);
    if (video && !video.paused) {
      // Mark as user-paused to prevent auto-resume
      isPausedByUser.current.add(id);
      video.pause();
    }
    if (currentPlayingId === id) {
      setCurrentPlayingId(null);
    }
  }, [currentPlayingId]);

  /** Cleanup all on unmount */
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video, id) => {
        if (video && !video.paused) video.pause();
        removeEventListeners(id, video);
      });
      videoRefs.current.clear();
      eventListeners.current.clear();
      isPausedByUser.current.clear();
    };
  }, [removeEventListeners]);

  return (
    <VideoControllerContext.Provider
      value={{ currentPlayingId, playVideo, pauseVideo, registerVideo, unregisterVideo }}
    >
      {children}
    </VideoControllerContext.Provider>
  );
};

export const useVideoController = () => {
  const ctx = useContext(VideoControllerContext);
  if (!ctx) throw new Error('useVideoController must be used within a VideoControllerProvider');
  return ctx;
};