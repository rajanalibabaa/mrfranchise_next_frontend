"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress,
  IconButton,
  Tooltip,
  LinearProgress,
  Slider,
  Dialog,
  DialogContent
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  PictureInPicture
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBrands } from "../../redux/Slices/GetAllBrandsDataUpdationFile";

function RegisterationMediaHandling() {
  const dispatch = useDispatch();
  const { brands, isLoading } = useSelector((state) => state.brands);
  const [displayBrands, setDisplayBrands] = useState([]);
  const videoRefs = useRef([]);
  const containerRefs = useRef([]);
  
  // State for each video
  const [videoStates, setVideoStates] = useState({});
  
  // Initialize refs arrays
  useEffect(() => {
    videoRefs.current = new Array(3).fill().map((_, i) => videoRefs.current[i] || React.createRef());
    containerRefs.current = new Array(3).fill().map((_, i) => containerRefs.current[i] || React.createRef());
  }, []);
 
  // Fetch brands when component mounts
  useEffect(() => {
    dispatch(fetchBrands({ page: 1 }));
  }, [dispatch]);
 
  // When brands load, take first 3 for display and initialize their states
  useEffect(() => {
    if (brands && brands.length > 0) {
      const firstThree = brands.slice(0, 3);
      setDisplayBrands(firstThree);
      
      // Initialize state for each video
      const initialStates = {};
      firstThree.forEach((brand, index) => {
        initialStates[index] = {
          isPlaying: false,
          isMuted: true,
          volume: 50,     
          progress: 0,
          duration: 0,
          isBuffering: false,
          isFullscreen: false,
          pipMode: false,
          isLoaded: false,
          hasError: false
        };
      });
      setVideoStates(initialStates);
    }
  }, [brands]);

  // Handle play/pause for a specific video
  const togglePlayPause = (index) => {
  const video = videoRefs.current[index]?.current;
  if (!video) return;

  // Immediately update the playing state optimistically
  setVideoStates(prev => {
    const newState = {...prev};
    newState[index] = {
      ...newState[index],
      isBuffering: !newState[index].isPlaying // Show buffering when starting to play
    };
    return newState;
  });

  if (videoStates[index]?.isPlaying) {
    video.pause();
    setVideoStates(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        isPlaying: false,
        isBuffering: false
      }
    }));
  } else {
    video.play()
      .then(() => {
        setVideoStates(prev => ({
          ...prev,
          [index]: {
            ...prev[index],
            isPlaying: true,
            isBuffering: false
          }
        }));
      })
      .catch(error => {
        console.error("Playback failed:", error);
        setVideoStates(prev => ({
          ...prev,
          [index]: {
            ...prev[index],
            hasError: true,
            isBuffering: false,
            isPlaying: false
          }
        }));
      });
  }
};

  // Handle mute/unmute for a specific video
const toggleMute = (index) => {
  const video = videoRefs.current[index]?.current;
  if (!video) return;

  setVideoStates(prev => {
    const newState = {...prev};
    const wasMuted = newState[index].isMuted;
    
    newState[index] = {
      ...newState[index],
      isMuted: !wasMuted,
      // Restore previous volume when unmuting
      volume: wasMuted ? (newState[index].volume || 50) : 0
    };
    
    // Update video element
    video.muted = !wasMuted;
    video.volume = wasMuted ? (newState[index].volume / 100) : 0;
    
    return newState;
  });
};

  // Handle fullscreen for a specific video
  const toggleFullscreen = (index) => {
    const container = containerRefs.current[index]?.current;
    if (!container) return;
    
    setVideoStates(prev => {
      const newState = {...prev};
      if (!newState[index].isFullscreen) {
        container.requestFullscreen?.().catch(console.error);
      } else {
        document.exitFullscreen?.().catch(console.error);
      }
      return newState;
    });
  };

  // Handle PIP for a specific video
  const togglePipMode = async (index) => {
    const video = videoRefs.current[index]?.current;
    if (!video) return;
    
    try {
      if (!videoStates[index]?.pipMode && document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
        setVideoStates(prev => ({
          ...prev,
          [index]: {...prev[index], pipMode: true}
        }));
      } else if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setVideoStates(prev => ({
          ...prev,
          [index]: {...prev[index], pipMode: false}
        }));
      }
    } catch (err) {
      console.error("PIP error:", err);
      setVideoStates(prev => ({
        ...prev,
        [index]: {...prev[index], pipMode: false}
      }));
    }
  };

  // Format time (mm:ss)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Intersection Observer for auto-play when visible
  useEffect(() => {
    const observers = [];
    
    displayBrands.forEach((_, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          const video = videoRefs.current[index]?.current;
          if (!video) return;
          
          setVideoStates(prev => {
            const newState = {...prev};
            if (entry.isIntersecting) {
              video.play().catch(error => console.error("Auto-play failed:", error));
              newState[index].isPlaying = true;
            } else {
              video.pause();
              newState[index].isPlaying = false;
            }
            return newState;
          });
        },
        { threshold: 0.5 }
      );
      
      if (containerRefs.current[index]?.current) {
        observer.observe(containerRefs.current[index].current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [displayBrands]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setVideoStates(prev => {
        const newState = {...prev};
        Object.keys(newState).forEach(index => {
          newState[index].isFullscreen = !!document.fullscreenElement;
        });
        return newState;
      });
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (isLoading && brands.length === 0) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }
 
  if (!displayBrands || displayBrands.length === 0) {
    return (
      <Box py={6} textAlign="center">
        <Typography variant="h6">No brands available</Typography>
      </Box>
    );
  }
 
  return (
    <Box py={6} px={2} bgcolor="#f9f9f9">
      <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom>
        Showcase Your Advertisements
      </Typography>
 
      <Grid container spacing={4} justifyContent="center">
        {displayBrands.map((brand, index) => (
          <Grid item key={brand.uuid || index} xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              ref={containerRefs.current[index]}
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '300px',
                aspectRatio: '9 / 16',
                maxHeight: 500,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 4,
                backgroundColor: '#000',
                '&:hover .video-controls': { opacity: 1 },
              }}
            >
              {/* Loading/error indicator */}
            {videoStates[index]?.isBuffering && (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2
    }}>
      <CircularProgress color="secondary" />
    </Box>
  )}

              {/* Video element */}
              <video
                ref={videoRefs.current[index]}
                src={brand.franchiseVideos}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  display: videoStates[index]?.isLoaded && !videoStates[index]?.hasError ? 'block' : 'none',
                  backgroundColor: '#f5f5f5'
                }}
                muted={true}
                loop
                playsInline
                preload="auto"
                onClick={() => togglePlayPause(index)}
                onLoadedMetadata={() => {
                  const video = videoRefs.current[index]?.current;
                  if (video) {
                    setVideoStates(prev => ({
                      ...prev,
                      [index]: {
                        ...prev[index],
                        duration: video.duration,
                        isLoaded: true,
                        isBuffering: false,
                        hasError: false
                      }
                    }));
                  }
                }}
                onTimeUpdate={() => {
                  const video = videoRefs.current[index]?.current;
                  if (video && videoStates[index]?.duration > 0) {
                    setVideoStates(prev => ({
                      ...prev,
                      [index]: {
                        ...prev[index],
                        progress: (video.currentTime / videoStates[index].duration) * 100
                      }
                    }));
                  }
                }}
                onWaiting={() => {
                  setVideoStates(prev => ({
                    ...prev,
                    [index]: {...prev[index], isBuffering: true}
                  }));
                }}
                onPlaying={() => {
                  setVideoStates(prev => ({
                    ...prev,
                    [index]: {...prev[index], isBuffering: false}
                  }));
                }}
                onEnded={() => {
                  setVideoStates(prev => ({
                    ...prev,
                    [index]: {...prev[index], isPlaying: false}
                  }));
                }}
                onError={() => {
                  setVideoStates(prev => ({
                    ...prev,
                    [index]: {
                      ...prev[index],
                      hasError: true,
                      isBuffering: false,
                      isLoaded: true
                    }
                  }));
                }}
              />

              {/* Centered play/pause button */}
              <Tooltip title={videoStates[index]?.isPlaying ? 'Pause' : 'Play'}>
                <IconButton 
                  onClick={() => togglePlayPause(index)} 
                  size="large"
                  disabled={videoStates[index]?.hasError}
                  sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      transform: 'translate(-50%, -50%) scale(1.1)'
                    },
                    '&:disabled': {
                      opacity: 0.5
                    },
                    width: 64,
                    height: 64,
                    zIndex: 2
                  }}
                >
                  {videoStates[index]?.isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
                </IconButton>
              </Tooltip>

              {/* Fallback when no video or error */}
              {(!videoStates[index]?.isLoaded || videoStates[index]?.hasError) && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    zIndex: 0
                  }}
                >
                  {videoStates[index]?.hasError ? 'Video Loading Error' : 'Loading...'}
                </Box>
              )}

              {/* Controls */}
              <Box
                className="video-controls"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 1,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  opacity: videoStates[index]?.isPlaying ? 0.7 : 1,
                  transition: 'opacity 0.3s',
                  '&:hover': { opacity: 1 },
                  zIndex: 2
                }}
              >
                {/* Progress bar */}
                <Box sx={{ position: 'relative', width: '100%', height: 4, mb: 1 }}>
                  <Slider
                    value={videoStates[index]?.progress || 0}
                    onChange={(e, newValue) => {
                      const video = videoRefs.current[index]?.current;
                      if (video && videoStates[index]?.duration > 0) {
                        video.currentTime = (newValue / 100) * videoStates[index].duration;
                      }
                    }}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      color: 'primary.main',
                      height: 4,
                      '& .MuiSlider-thumb': {
                        width: 12,
                        height: 12,
                        transition: '0.2s cubic-bezier(.47,1.64,.41,.8)',
                        '&:hover': { width: 16, height: 16 },
                      },
                      '& .MuiSlider-rail': {
                        display: 'none'
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#ff9800'
                      }
                    }}
                  />
                </Box>

                {/* Control buttons */}
                <Box display="flex" alignItems="center" gap={1} px={1}>
                  <Tooltip title={videoStates[index]?.isMuted ? 'Unmute' : 'Mute'}>
                    <IconButton 
                      onClick={() => toggleMute(index)} 
                      size="small" 
                      disabled={videoStates[index]?.hasError}
                      sx={{ 
                        color: 'white',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.7)'
                        },
                        '&:disabled': {
                          opacity: 0.5
                        }
                      }}
                    >
                      {videoStates[index]?.isMuted ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
                    </IconButton>
                  </Tooltip>

                  <Box 
                    sx={{ 
                      color: 'white', 
                      fontSize: '0.75rem',
                      ml: 1,
                      minWidth: '60px',
                      textAlign: 'center'
                    }}
                  >
                    {videoStates[index]?.duration > 0 && !videoStates[index]?.hasError && (
                      <>
                        {formatTime((videoStates[index].progress / 100) * videoStates[index].duration)} / {formatTime(videoStates[index].duration)}
                      </>
                    )}
                  </Box>

                  <Box flexGrow={1} />

                  {document.pictureInPictureEnabled && (
                    <Tooltip title="Picture-in-Picture">
                      <IconButton 
                        onClick={() => togglePipMode(index)} 
                        size="small" 
                        disabled={videoStates[index]?.hasError}
                        sx={{ 
                          color: 'white',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)'
                          },
                          '&:disabled': {
                            opacity: 0.5
                          }
                        }}
                      >
                        <PictureInPicture fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title={videoStates[index]?.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                    <IconButton 
                      onClick={() => toggleFullscreen(index)} 
                      size="small" 
                      disabled={videoStates[index]?.hasError}
                      sx={{ 
                        color: 'white',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.7)'
                        },
                        '&:disabled': {
                          opacity: 0.5
                        }
                      }}
                    >
                      {videoStates[index]?.isFullscreen ? <FullscreenExit fontSize="small" /> : <Fullscreen fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {/* PIP fallback dialog */}
            {videoStates[index]?.pipMode && !document.pictureInPictureEnabled && (
              <Dialog
                open={videoStates[index]?.pipMode}
                onClose={() => setVideoStates(prev => ({
                  ...prev,
                  [index]: {...prev[index], pipMode: false}
                }))}
                PaperProps={{
                  sx: {
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    width: 300,
                    height: 200,
                    m: 0,
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: 6
                  }
                }}
              >
                <DialogContent sx={{ p: 0 }}>
                  <video
                    src={brand.franchiseVideos}
                    autoPlay
                    muted={videoStates[index]?.isMuted}
                    loop
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 1,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <IconButton 
                      onClick={() => setVideoStates(prev => ({
                        ...prev,
                        [index]: {...prev[index], pipMode: false}
                      }))} 
                      size="small" 
                      sx={{ color: 'white' }}
                    >
                      <FullscreenExit fontSize="small" />
                    </IconButton>
                  </Box>
                </DialogContent>
              </Dialog>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
 
export default RegisterationMediaHandling;