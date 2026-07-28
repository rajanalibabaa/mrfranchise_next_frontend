"use client";
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Slider,
  Stack,
  Button,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  PictureInPictureAlt,
  Close,
} from "@mui/icons-material";
import Hls from "hls.js";

const MediaSection = ({
  allVideos = [],
  allImages = [],
  isMobile,
  isTablet,
  brandName,
  getImageBoxSize,
  handleImageOpen,
}) => {
  console.log("aalimages", allImages);

  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [inPiP, setInPiP] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoSrc = Array.isArray(allVideos) ? allVideos[0] : allVideos;

  useEffect(() => {
    if (!videoSrc || !videoRef.current) return;

    const video = videoRef.current;
    let hls;

    setVideoLoading(true);
    setVideoError(false);

    if (videoSrc.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setVideoLoading(false);
        });

        hls.on(Hls.Events.ERROR, () => {
          setVideoError(true);
          setVideoLoading(false);
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
        setVideoLoading(false);
      } else {
        setVideoError(true);
        setVideoLoading(false);
      }
    } else {
      video.src = videoSrc;
      setVideoLoading(false);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [videoSrc]);

  // Start muted & autoplay for compatibility
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleLoadedMetadata = () => {
      setDuration(vid.duration || 0);
      setVideoLoading(false);
    };
    const handleError = () => {
      setVideoError(true);
      setVideoLoading(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () =>
      setProgress((vid.currentTime / (vid.duration || 1)) * 100);

    vid.addEventListener("loadedmetadata", handleLoadedMetadata);
    vid.addEventListener("error", handleError);
    vid.addEventListener("play", handlePlay);
    vid.addEventListener("pause", handlePause);
    vid.addEventListener("timeupdate", handleTimeUpdate);

    vid.volume = 0.7;
    vid.muted = true;
    vid.play().catch(() => setIsPlaying(false));

    return () => {
      vid.removeEventListener("loadedmetadata", handleLoadedMetadata);
      vid.removeEventListener("error", handleError);
      vid.removeEventListener("play", handlePlay);
      vid.removeEventListener("pause", handlePause);
      vid.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoSrc]);

  useEffect(() => {
    if (!isPlaying || !showControls || inPiP) return; // Only if video is playing
    const timeout = setTimeout(() => setShowControls(false), 2000);
    return () => clearTimeout(timeout);
  }, [showControls, inPiP, isPlaying]);

  // Hide controls after timeout unless hovered/focused
  useEffect(() => {
    if (!showControls || inPiP || !isPlaying) return;
    const timeout = setTimeout(() => setShowControls(false), 2000);
    return () => clearTimeout(timeout);
  }, [showControls, inPiP, isPlaying]);

  // Controls functions
  const handlePlayPause = (e) => {
    e?.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    if (isPlaying) {
      vid.pause();
    } else {
      vid.play().catch(() => setIsPlaying(false));
    }
    setShowControls(true);
  };

  const handleMute = (e) => {
    e?.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !isMuted;
    setIsMuted(!isMuted);
    setShowControls(true);
  };

  const handleSlider = (_, val) => {
    const vid = videoRef.current;
    if (!vid || !duration) return;
    const pct = Array.isArray(val) ? val[0] : val;
    vid.currentTime = (pct / 100) * duration;
    setProgress(pct);
  };

  const handleVolume = (_, val) => {
    const vid = videoRef.current;
    if (!vid) return;
    const v = (Array.isArray(val) ? val[0] : val) / 100;
    vid.volume = v;
    setIsMuted(v === 0);
    setShowControls(true);
  };

  const handleFullscreen = (e) => {
    e?.stopPropagation();
    const elem = videoRef.current;
    if (!elem) return;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setShowControls(true);
  };
  // Keep isFullscreen in sync with browser fullscreen
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  // PiP
  const handlePiP = async (e) => {
    e?.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    try {
      if (!inPiP) {
        await vid.requestPictureInPicture();
        setInPiP(true);
      } else {
        document.exitPictureInPicture();
        setInPiP(false);
      }
    } catch (e) {}
    setShowControls(true);
  };

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    function handleEnterPiP() {
      setInPiP(true);
    }
    function handleLeavePiP() {
      setInPiP(false);
    }
    vid.addEventListener("enterpictureinpicture", handleEnterPiP);
    vid.addEventListener("leavepictureinpicture", handleLeavePiP);
    return () => {
      vid.removeEventListener("enterpictureinpicture", handleEnterPiP);
      vid.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, []);

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  const showThem = () => setShowControls(true);

  // Progress bar gradient
  const sliderGradient = "#00ff1aff";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={3}>
        <Box
          flex={isMobile ? "none" : 2}
          ref={videoContainerRef}
          position="relative"
        >
          <Box
            sx={{
              width: "100%",
              height: isMobile ? 200 : isTablet ? 300 : 416,
              borderRadius: 2,
              border: "2px solid #ff9800",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
              position: "relative",
              cursor: "pointer",
              userSelect: "none",
            }}
            onMouseMove={showThem}
            onTouchStart={showThem}
            tabIndex={0}
            onFocus={showThem}
            onBlur={() => setShowControls(false)}
          >
            {videoSrc ? (
              <>
                <video
                  ref={videoRef}
                  // src={videoSrc}
                  // poster={poster}
                  playsInline
                  autoPlay
                  muted={isMuted}
                  preload="metadata"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    background: "#eee",
                  }}
                  tabIndex={-1}
                  onClick={handlePlayPause}
                  onDoubleClick={handleFullscreen}
                />

                {(!isPlaying || showControls) &&
                  !videoLoading &&
                  !videoError && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                      }}
                    >
                      {!isPlaying && (
                        <IconButton
                          aria-label="playicon"
                          sx={{
                            pointerEvents: "all",
                            backgroundColor: "rgba(0,0,0,0.35)",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.45)" },
                          }}
                          onClick={handlePlayPause}
                          size="large"
                        >
                          <PlayArrow sx={{ color: "white", fontSize: 54 }} />
                        </IconButton>
                      )}
                    </Box>
                  )}

                <Box
                  sx={{
                    zIndex: 5,
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    px: 0.5,
                    py: 0.5,
                    bgcolor:
                      "linear-gradient(to top, rgba(0,0,0,0.92), transparent 88%)",
                    pointerEvents:
                      showControls || !isPlaying || videoLoading || videoError
                        ? "all"
                        : "none",
                    opacity:
                      showControls || !isPlaying || videoLoading || videoError
                        ? 1
                        : 0,

                    transition: "opacity 0.3s",
                  }}
                  onMouseMove={showThem}
                  onTouchStart={showThem}
                >
                  <Slider
                    value={progress}
                    onChange={handleSlider}
                    min={0}
                    max={100}
                    aria-label="Video progress"
                    sx={{
                      height: 6,
                      width: "100%",
                      borderRadius: 4,
                      p: 0,
                      background: "none",
                      "& .MuiSlider-thumb": {
                        width: 14,
                        height: 14,
                        background: "#fff",
                        boxShadow: "0 0 8px orange",
                      },
                      "& .MuiSlider-rail": {
                        opacity: 0.5,
                        background: "#000000ff",
                      },
                      "& .MuiSlider-track": {
                        background: sliderGradient,
                      },
                    }}
                  />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton
                      size="small"
                      onClick={handlePlayPause}
                      sx={{ color: "#ff9800" }}
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleMute}
                      sx={{ color: "#ff9800" }}
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeOff /> : <VolumeUp />}
                    </IconButton>
                    <Slider
                      min={0}
                      max={100}
                      value={
                        videoRef.current ? videoRef.current.volume * 100 : 70
                      }
                      onChange={handleVolume}
                      aria-label="Volume"
                      sx={{
                        width: 80,
                        color: "white",
                        "& .MuiSlider-track": { background: "orange" },
                        "& .MuiSlider-thumb": {
                          width: 11,
                          height: 11,
                        },
                      }}
                    />
                    <Typography variant="caption" color="white" mx={1}>
                      {formatTime(videoRef.current?.currentTime || 0)} /{" "}
                      {formatTime(duration)}
                    </Typography>
                    <Box flex={1} />
                    <IconButton
                      size="small"
                      onClick={handlePiP}
                      sx={{ color: "black" }}
                      aria-label={inPiP ? "Exit PiP" : "PiP"}
                    >
                      {inPiP ? <Close /> : <PictureInPictureAlt />}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleFullscreen}
                      sx={{ color: "black" }}
                      aria-label={
                        isFullscreen ? "Exit Fullscreen" : "Fullscreen"
                      }
                    >
                      {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                    </IconButton>
                  </Stack>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography>
                  No promotional video available for this brand (or) Under
                  review
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        {/* Images panel */}
        <Box flex={1}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 0.7,
            }}
          >
            {allImages.slice(0, 3).map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: getImageBoxSize(),
                    overflow: "hidden",
                    borderRadius: 2,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#ffffffff",
                    border: "2px solid #ff9800",
                    position: "relative",
                  }}
                  onClick={() => handleImageOpen(index)}
                >
                  <img
                    src={imageUrl}
                    loading="lazy"
                    alt={`${brandName} franchise business opportunity image-${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                </Box>
              </motion.div>
            ))}
            {/* View More */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: getImageBoxSize(),
                  overflow: "hidden",
                  borderRadius: 2,
                  ml: 0.2,
                  cursor: "pointer",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(255, 255, 255, 1)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.8)" },
                }}
                onClick={() => handleImageOpen(3)}
              >
                <Typography
                  variant={isMobile ? "body2" : "h6"}
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    zIndex: 1,
                    fontSize: isMobile ? "0.875rem" : "1rem",
                    color: "text.primary",
                  }}
                >
                  View More ({Math.max(allImages.length - 3, 0)})
                </Typography>
                {allImages[3] && (
                  <img
                    src={allImages[3]}
                    loading="lazy"
                    alt={brandName}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "blur(10px)",
                      opacity: 0.3,
                      zIndex: 0,
                    }}
                  />
                )}
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Box>

    </motion.div>
  );
};
export default MediaSection;
