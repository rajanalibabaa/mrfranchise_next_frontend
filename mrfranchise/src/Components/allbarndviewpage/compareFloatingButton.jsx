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
        ? window.innerWidth - 55 // right side on mobile
        : window.innerWidth - 145 // right side on desktop
      : 0,
  );

  const y = useMotionValue(
    typeof window !== "undefined"
      ? isMobile
        ? window.innerHeight * 0.35 // 35% from top on mobile
        : window.innerHeight * 0.2 // 20% from top on desktop
      : 150,
  );

  const handleClick = (e) => {
    // ✅ Only fire click if user wasn't dragging
    if (isDragging.current || dragDistance.current > 5) return;
    e.stopPropagation();
    handleCompareClick();
  };

  return (
   <motion.div
  drag="y"                    // 👈 changed from `drag` to `drag="y"`
  dragMomentum={false}
  dragElastic={0.1}
  dragConstraints={{
    top: 0,
    bottom: windowSize.height
      ? windowSize.height - (isMobile ? 130 : 140)
      : 0,
  }}
  onDragStart={() => {
    isDragging.current = true;
    dragDistance.current = 0;
  }}
  onDrag={(_, info) => {
    // Only need to track y-offset now since x won't move
    dragDistance.current = Math.abs(info.offset.y);
  }}
  onDragEnd={() => {
    setTimeout(() => {
      isDragging.current = false;
      dragDistance.current = 0;
    }, 100);
  }}
  style={{
    position: "fixed",
    zIndex: 9999,
    x,   // keep this — it's just a fixed value now, never changes
    y,
    cursor: "grab",
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
              transform: isMobile ? "none" : "rotate(-90deg)",
              transformOrigin: "center",

              width: isMobile ? "auto" : "115px",
              height: isMobile ? "auto" : "42px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              startIcon={!isMobile && <Compare />}
              onPointerUp={handleClick}
              sx={{
                borderRadius: "22px",

                width: isMobile ? "95px" : "115px",

                minWidth: isMobile ? "95px" : "115px",

                height: isMobile ? "38px" : "42px",

                padding: isMobile ? "0 12px" : "0 20px",

                bgcolor: "#ff9800",

                color: "#fff",

                fontWeight: 700,

                fontSize: isMobile ? "12px" : "14px",

                boxShadow: "0 8px 25px rgba(255,152,0,.45)",

                "&:hover": {
                  bgcolor: "#fb8c00",
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
