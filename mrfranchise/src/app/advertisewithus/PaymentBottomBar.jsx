import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Button, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const PaymentBottomBar = ({
  COLORS,
  TEXT_SIZES,
  statCards = [],
  totalAmount = 0,
  loading = false,
  handleProceedToPayment,
}) => {
  const [bottomOffset, setBottomOffset] = useState(20);
  const barRef = useRef(null);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs")); // Only for xs screens (0-600px)

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      const bar = barRef.current;
      if (!footer || !bar) return;
      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const footerVisibleHeight = viewportHeight - footerRect.top;
      
      // Only increase offset for xs screens
      const extraOffset = isXs ? 24 : 12;
      setBottomOffset(footerVisibleHeight > 0 ? footerVisibleHeight + extraOffset : (isXs ? 44 : 20));
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isXs]);

  if (statCards.length === 0 && totalAmount === 0) return null;

  return (
    <Box
      ref={barRef}
      id="payment-bottom-bar"
      sx={{
        position: "fixed",
        bottom: `${bottomOffset}px`,
        left: "50%",
        transform: "translateX(-50%)",
        width: { xs: "calc(100% - 30px)", sm: "92%", md: "85%", lg: "70%", xl: "45%" },
        maxWidth: "1100px",
        zIndex: 1200,
        background:
          "linear-gradient(135deg, rgba(255,248,240,0.96) 0%, rgba(233,252,191,0.95) 50%, rgba(229,247,207,0.96) 100%)",
        backdropFilter: "blur(20px)",
        border: "1.5px solid #ff7800",
        borderRadius: { xs: "18px", sm: "26px" },
        px: { xs: 1.2, sm: 2, md: 3 },
        py: { xs: 1, sm: 1.5, md: 2 },
        transition: "bottom 0.1s linear, box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 28px 80px rgba(255,152,0,0.18)",
          transform: "translateX(-50%) translateY(-2px)",
        },
        // Only add margin bottom for xs screens
        mb: { xs: -4, sm: 0 },
      }}
    >
      {/* ── SINGLE ROW — always ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: 0.8, sm: 1.5, md: 2 },
          flexWrap: "nowrap",        // never wrap
        }}
      >
        {/* ── STAT CARDS ── */}
        {statCards.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.6, sm: 1, md: 1.5 },
              overflowX: "auto",
              flexShrink: 1,
              minWidth: 0,
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {statCards.map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  flexShrink: 0,
                  background: "linear-gradient(180deg,#ffffff,#f8f8f8)",
                  border: "1px solid #ececec",
                  borderRadius: { xs: "12px", sm: "16px", md: "18px" },
                  px: { xs: 1, sm: 1.5, md: 2 },
                  py: { xs: 0.6, sm: 1, md: 1.3 },
                  textAlign: "center",
                  minWidth: { xs: 56, sm: 80, md: 100 },
                  transition: "0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "0.55rem", sm: "0.65rem", md: "0.7rem" },
                    color: "#777",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    mb: 0.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.85rem", sm: "1.1rem", md: "1.5rem" },
                    fontWeight: 800,
                    color: "#111",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* ── PRICE ── */}
        <Box
          sx={{
            flexShrink: 0,
            textAlign: "center",
            px: { xs: 0.5, sm: 1 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "0.55rem", sm: "0.65rem", md: "0.7rem" },
              color: "#777",
              fontWeight: 600,
              letterSpacing: "0.03em",
              mb: 0.2,
              whiteSpace: "nowrap",
            }}
          >
            TOTAL PAYABLE
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1rem", sm: "1.4rem", md: "2rem", lg: "2.4rem" },
              fontWeight: 900,
              color: "#2e7d32",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              whiteSpace: "nowrap",
            }}
          >
            ₹{totalAmount.toLocaleString("en-IN")}
          </Typography>
        </Box>

        {/* ── PAY NOW BUTTON ── */}
        <Button
          variant="contained"
          onClick={handleProceedToPayment}
          disabled={loading}
          endIcon={!loading && <ArrowForwardIcon sx={{ fontSize: { xs: 14, sm: 18, md: 20 } }} />}
          sx={{
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            minWidth: { xs: 90, sm: 140, md: 180, lg: 210 },
            height: { xs: 40, sm: 52, md: 60, lg: 64 },
            borderRadius: { xs: "12px", sm: "16px", md: "18px" },
            px: { xs: 1.5, sm: 2.5, md: 3, lg: 4 },
            background: "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)",
            color: "#fff",
            fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" },
            fontWeight: 800,
            textTransform: "none",
            letterSpacing: "0.02em",
            boxShadow: "0 8px 24px rgba(255,152,0,0.35)",
            transition: "all 0.3s ease",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-120%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",
              transition: "0.7s",
            },
            "&:hover": {
              transform: "translateY(-2px) scale(1.02)",
              boxShadow: "0 14px 36px rgba(255,152,0,0.45)",
              background: "linear-gradient(135deg,#ffb300 0%,#ff6f00 100%)",
              "&::before": { left: "120%" },
            },
            "&:active": { transform: "translateY(-1px)" },
            "&.Mui-disabled": { background: "#bdbdbd", color: "#fff" },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "PAY NOW"}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentBottomBar;