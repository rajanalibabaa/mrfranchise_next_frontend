"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const VideoControllerContext = createContext();

export const VideoControllerProvider = ({ children }) => {
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const videoRefs = useRef(new Map());
  const eventListeners = useRef(new Map());

  /** Add listeners (replace old ones if any) */
  const addEventListeners = (id, video) => {
    removeEventListeners(id, video); // cleanup old first

    const handlePlay = () => setCurrentPlayingId(id);
    const handlePause = () => {
      if (currentPlayingId === id) setCurrentPlayingId(null);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    eventListeners.current.set(id, { play: handlePlay, pause: handlePause });
  };

  /** Remove listeners safely */
  const removeEventListeners = (id, video) => {
    if (eventListeners.current.has(id) && video) {
      const { play, pause } = eventListeners.current.get(id);
      video.removeEventListener('play', play);
      video.removeEventListener('pause', pause);
      eventListeners.current.delete(id);
    }
  };

  /** Register video element */
  const registerVideo = (id, videoEl) => {
    if (videoEl) {
      videoRefs.current.set(id, videoEl);
      addEventListeners(id, videoEl);
    }
    return () => unregisterVideo(id);
  };

  /** Unregister */
  const unregisterVideo = (id) => {
    const video = videoRefs.current.get(id);
    if (video) {
      removeEventListeners(id, video);
    }
    videoRefs.current.delete(id);
  };

  /** Play selected video & pause others */
  const playVideo = async (id) => {
    try {
      // Pause all others first
      videoRefs.current.forEach((vid, vidId) => {
        if (vidId !== id && !vid.paused) vid.pause();
      });

      const video = videoRefs.current.get(id);
      if (!video) return;

      addEventListeners(id, video); // ensure up-to-date listeners

      // Try to play
      await video.play();
      setCurrentPlayingId(id);

    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn("play() aborted, possibly due to pause or removal:", err);
      } else {
        console.error("playVideo failed:", err);
      }
    }
  };

  /** Pause video */
  const pauseVideo = (id) => {
    const video = videoRefs.current.get(id);
    if (video && !video.paused) {
      video.pause();
    }
    if (currentPlayingId === id) {
      setCurrentPlayingId(null);
    }
    // Note: DO NOT remove event listeners here — keep for resume
  };

  /** Cleanup all on unmount */
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video, id) => {
        if (video && !video.paused) video.pause();
        removeEventListeners(id, video);
      });
      videoRefs.current.clear();
      eventListeners.current.clear();
    };
  }, []);

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
