import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
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

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      const bar = barRef.current;
      if (!footer || !bar) return;

      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const gap = 12;

      const footerVisibleHeight = viewportHeight - footerRect.top;

      if (footerVisibleHeight > 0) {
        setBottomOffset(footerVisibleHeight + gap);
      } else {
        setBottomOffset(20);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render if no items in cart
  if (statCards.length === 0 && totalAmount === 0) {
    return null;
  }

  return (
    <Box
      ref={barRef}
      id="payment-bottom-bar"
      sx={{
        position: "fixed",
        bottom: `${bottomOffset - 20}px`,
        left: "50%",
        transform: "translateX(-50%)",
        width: { xs: "95%", sm: "92%", md: "85%", lg: "70%", xl: "45%" },
        maxWidth: "1100px",
        zIndex: 1400,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.4)",
        borderRadius: "24px",
        px: { xs: 2, sm: 2.5, md: 3 },
        py: { xs: 1.5, md: 2 },
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        transition: "bottom 0.1s linear, box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 25px 70px rgba(0,0,0,0.16)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 1.5 },
        }}
      >
        {/* LEFT SECTION - Stats Cards */}
        {statCards.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {statCards.map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  minWidth: { xs: "80px", sm: "100px" },
                  background: "linear-gradient(180deg,#ffffff,#f8f8f8)",
                  border: "1px solid #ececec",
                  borderRadius: "18px",
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 1, sm: 1.3 },
                  transition: "0.3s ease",
                  textAlign: "center",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "#777",
                    fontWeight: 600,
                    mb: 0.3,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                    fontWeight: 800,
                    color: "#111",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* RIGHT SECTION - Price & Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 1.5, sm: 2 },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {/* PRICE */}
          <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "#777",
                fontWeight: 600,
                mb: 0.3,
                letterSpacing: "0.03em",
              }}
            >
              TOTAL PAYABLE
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.4rem" },
                fontWeight: 900,
                color: "#2e7d32",
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              ₹{totalAmount.toLocaleString("en-IN")}
            </Typography>
          </Box>

          {/* BUTTON */}
          <Button
            variant="contained"
            onClick={handleProceedToPayment}
            disabled={loading}
            endIcon={!loading && <ArrowForwardIcon />}
            sx={{
              position: "relative",
              overflow: "hidden",
              minWidth: { xs: 140, sm: 180, md: 210 },
              height: { xs: 56, sm: 60, md: 64 },
              borderRadius: "18px",
              px: { xs: 2, sm: 3, md: 4 },
              background: "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)",
              color: "#fff",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontWeight: 800,
              textTransform: "none",
              letterSpacing: "0.03em",
              boxShadow: "0 12px 30px rgba(255,152,0,0.35)",
              transition: "all 0.3s ease",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-120%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",
                transition: "0.7s",
              },
              "&:hover": {
                transform: "translateY(-3px) scale(1.02)",
                boxShadow: "0 18px 40px rgba(255,152,0,0.45)",
                background: "linear-gradient(135deg,#ffb300 0%,#ff6f00 100%)",
                "&::before": { left: "120%" },
              },
              "&:active": {
                transform: "translateY(-1px)",
              },
              "&.Mui-disabled": {
                background: "#bdbdbd",
                color: "#fff",
                cursor: "not-allowed",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "PAY NOW"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentBottomBar;