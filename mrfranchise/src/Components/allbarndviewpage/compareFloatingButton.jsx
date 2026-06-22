"use client";

import { motion, useMotionValue } from "framer-motion";
import { Badge, Button, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Compare from "@mui/icons-material/Compare";

const CompareFloatingButton = ({
  selectedForComparison,
  handleCompareClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const isDragging = useRef(false);
  const dragDistance = useRef(0);

  useEffect(() => {
    const updateWindow = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateWindow();
    window.addEventListener("resize", updateWindow);
    return () => window.removeEventListener("resize", updateWindow);
  }, []);

  // ✅ Safe initial positions — always visible on screen
  const x = useMotionValue(
    typeof window !== "undefined"
      ? isMobile
        ? window.innerWidth - 55   // right side on mobile
        : window.innerWidth - 120  // right side on desktop
      : 0
  );

  const y = useMotionValue(
    typeof window !== "undefined"
      ? isMobile
        ? window.innerHeight * 0.35 // 35% from top on mobile
        : window.innerHeight * 0.2  // 20% from top on desktop
      : 150
  );

  const handleClick = (e) => {
    // ✅ Only fire click if user wasn't dragging
    if (isDragging.current || dragDistance.current > 5) return;
    e.stopPropagation();
    handleCompareClick();
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        top: 0,
        left: 0,
        right: windowSize.width
          ? windowSize.width - (isMobile ? 50 : 55)
          : 0,
        bottom: windowSize.height
          ? windowSize.height - (isMobile ? 130 : 140)
          : 0,
      }}
      onDragStart={() => {
        isDragging.current = true;
        dragDistance.current = 0;
      }}
      onDrag={(_, info) => {
        // ✅ Track how far user dragged to distinguish from tap
        dragDistance.current = Math.abs(info.offset.x) + Math.abs(info.offset.y);
      }}
      onDragEnd={() => {
        // ✅ Reset after short delay so click doesn't fire
        setTimeout(() => {
          isDragging.current = false;
          dragDistance.current = 0;
        }, 100);
      }}
      style={{
        position: "fixed",
        zIndex: 9999,
        x,
        y,
        cursor: "grab",
        // ✅ Critical for mobile touch support
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      whileDrag={{ cursor: "grabbing", scale: 1.05 }}
    >
      <Badge
        badgeContent={selectedForComparison.length}
        color="primary"
        sx={{
          "& .MuiBadge-badge": {
            // ✅ Reposition badge to be visible after rotation
            top: "50%",
            right: -6,
            transform: "translateY(-50%)",
            zIndex: 10000,
          },
        }}
      >
        <Tooltip
          title="Compare brands"
          placement="left"
          arrow
          // ✅ Disable tooltip on mobile to prevent interference
          disableHoverListener={isMobile}
          disableFocusListener={isMobile}
        >
          {/* ✅ Wrapper div handles rotation — button stays unrotated internally */}
          <div
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              startIcon={!isMobile && <Compare />}
              // ✅ Use onPointerUp for reliable mobile click detection
              onPointerUp={handleClick}
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "#ff9800",
                fontSize: isMobile ? "11px" : "13px",
                fontWeight: 700,
                height: isMobile ? "110px" : "120px",
                width: isMobile ? "42px" : "100px",
                // minWidth: "unset",
                // padding: "8px 4px",
                lineHeight: 1.2,
                letterSpacing: "0.5px",
                // ✅ Prevent text selection on drag
                userSelect: "none",
                WebkitUserSelect: "none",
                // ✅ Ensure button pointer events work
                pointerEvents: "auto",
                "&:hover": {
                  bgcolor: "#fb8c00",
                },
                "&:active": {
                  bgcolor: "#f57c00",
                  transform: "scale(0.97)",
                },
              }}
            >
              Compare
            </Button>
          </div>
        </Tooltip>
      </Badge>
    </motion.div>
  );
};

export default CompareFloatingButton;