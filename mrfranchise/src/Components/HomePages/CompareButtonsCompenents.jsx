"use client";

import { Box, useTheme, useMediaQuery } from "@mui/material";
import { motion, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const CompareButton = () => {
  const theme = useTheme();
const constraintsRef = useRef(null);
const buttonRef = useRef(null); 

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const buttonWidth = isMobile ? 35 : isTablet ? 40 : 44;
  const buttonHeight = isMobile ? 120 : isTablet ? 150 : 160;
  const buttonFontSize = isMobile ? 12 : isTablet ? 14 : 16;

  // Motion values for smooth drag
  // const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Track drag state
  const startPos = useRef({ x: 0, y: 0 });
  const wasDragged = useRef(false);
  const isDragging = useRef(false);
const [cursor, setCursor] = useState("grab");
  // ✅ Restore saved position from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("compareButtonPos");
    if (saved) {
      const {  savedY } = JSON.parse(saved);
      // x.set(savedX);
      y.set(savedY);
    }
  }, []);

  // ✅ Snap to nearest edge (left or right)
  // const snapToEdge = () => {
  //   const windowWidth = window.innerWidth;
  //   const currentX = x.get();
  //   const buttonMidX = currentX + buttonWidth / 2;

  //   const snapRight = windowWidth / 2;

  //   if (buttonMidX > snapRight) {
  //     // Snap to right edge
  //     const rightX = windowWidth - buttonWidth;
  //     animate(x, rightX, { type: "spring", stiffness: 300, damping: 30 });
  //     localStorage.setItem(
  //       "compareButtonPos",
  //       JSON.stringify({ savedX: rightX, savedY: y.get() })
  //     );
  //   } else {
  //     // Snap to left edge
  //     animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
  //     localStorage.setItem(
  //       "compareButtonPos",
  //       JSON.stringify({ savedX: 0, savedY: y.get() })
  //     );
  //   }
  // };

  const handleClick = () => {
    localStorage.setItem("enableComparison", "true");
    window.open("/all-franchise-brands", "_blank", "noopener,noreferrer");
  };

  return (
    <Box
      ref={constraintsRef}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        pointerEvents: "none",
      }}
    >
      <motion.button
        ref={buttonRef}
          drag="y"
        dragConstraints={constraintsRef}
        dragElastic={0.05}
        dragMomentum={false}
        style={{
          // x,
          y,
          position: "absolute",
          right: 0,
          top: "40%",
          backgroundColor: "#70fd03fa",
          border: "none",
          borderRadius: "20px 0 0 20px",
          width: `${buttonWidth}px`,
          height: `${buttonHeight}px`,
          color: "black",
          fontSize: `${buttonFontSize}px`,
          fontWeight: "bold",
          cursor: cursor,
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          writingMode: "vertical-rl",
          textOrientation: "upright",
          pointerEvents: "auto",
          userSelect: "none",
          touchAction: "none",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}

        // ✅ Track start position
        onPointerDown={(e) => {
          startPos.current = { x: e.clientX, y: e.clientY };
          wasDragged.current = false;
          isDragging.current = false;
          setCursor("grabbing");
        }}

        // ✅ Detect actual drag movement
        onPointerMove={(e) => {
          if (
            !isDragging.current &&
            (Math.abs(e.clientX - startPos.current.x) > 5 ||
              Math.abs(e.clientY - startPos.current.y) > 5)
          ) {
            isDragging.current = true;
            wasDragged.current = true;
          }
        }}

        // ✅ On drag end: snap to edge + save position
        onPointerUp={() => {
          setCursor("grab");
          isDragging.current = false;

        if (wasDragged.current) {
  localStorage.setItem(
    "compareButtonPos",
    JSON.stringify({
      savedY: y.get(),
    })
  );
}

          // ✅ Reset wasDragged after small delay
          setTimeout(() => {
            wasDragged.current = false;
          }, 100);
        }}

        // ✅ Block click if was dragged
        onClick={(e) => {
          if (wasDragged.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          handleClick();
        }}
      >
        COMPARE
      </motion.button>
    </Box>
  );
};

export default CompareButton;