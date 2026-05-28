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
  bottom: `${bottomOffset - 0}px`,
  left: "50%",
  transform: "translateX(-50%)",
  width: {
    xs: "95%",
    sm: "92%",
    md: "85%",
    lg: "70%",
    xl: "45%",
  },
  maxWidth: "1100px",
  zIndex: 1200,

  /* LIGHT ORANGE SHADE */
  background:
    "linear-gradient(135deg, rgba(255,248,240,0.96) 0%, rgba(233, 252, 191, 0.95) 50%, rgba(229, 247, 207, 0.96) 100%)",

  backdropFilter: "blur(20px)",

  border: "1px solid rgba(255,183,77,0.25)",

  borderRadius: "26px",

  px: { xs: 2, sm: 2.5, md: 3 },
  py: { xs: 1.5, md: 2 },
borderColor:"#ff7800",
 

  transition:
    "bottom 0.1s linear, box-shadow 0.3s ease, transform 0.3s ease",

  "&:hover": {
    boxShadow:
      "0 28px 80px rgba(255,152,0,0.18), 0 12px 30px rgba(255,183,77,0.15)",
    transform: "translateX(-50%) translateY(-2px)",
  },
}}
    >
  {/* MAIN CONTAINER */}
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "1.2fr 1fr 1.2fr",
    },

    alignItems: "center",
    gap: { xs: 2, md: 3 },
    width: "100%",
  }}
>
  {/* LEFT SECTION - Stats */}
  <Box
    sx={{
      display: "flex",
      justifyContent: {
        xs: "center",
        md: "flex-start",
      },
      alignItems: "center",
      gap: 1.5,
      flexWrap: "wrap",
    }}
  >
    {statCards.map((stat) => (
      <Box
        key={stat.label}
        sx={{
          minWidth: { xs: "90px", sm: "180px" },
          flex: 1,
          maxWidth: "140px",
          color:"white",
            background: "linear-gradient(135deg, #66bb6a 0%, #4cb04f 50%, #2e7d32 100%)",
          border: "1px solid #ececec",
          borderRadius: "20px",
          px: 2,
          py: 1.5,
          textAlign: "center",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",

          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow:
              "0 14px 28px rgba(0,0,0,0.10)",
          },
        }}
      >
        <Typography
         sx={{
        fontSize: "0.78rem",
        color: "white",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        mb: 0.5,
      }}
        >
         Total Selected Plans
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: "1.25rem",
              sm: "1.5rem",
            },
            fontWeight: 900,
            color: "white",
            lineHeight: 1,
          }}
        >
          {stat.value}
        </Typography>
      </Box>
    ))}
  </Box>

  {/* CENTER SECTION - PRICE */}
  <Box
    sx={{
      textAlign: "center",
      position: "relative",
    }}
  >
    <Typography
      sx={{
        fontSize: "0.78rem",
        color: "black",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        mb: 0.5,
      }}
    >
      Total Payable
    </Typography>

    <Typography
      sx={{
        fontSize: {
          xs: "2rem",
          sm: "2.4rem",
          md: "2.8rem",
        },
        fontWeight: 900,
        background:
          "linear-gradient(135deg,#2e7d32,#43a047)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        lineHeight: 1,
        letterSpacing: "-0.05em",
      }}
    >
      ₹{totalAmount.toLocaleString("en-IN")}
    </Typography>
  </Box>

  {/* RIGHT SECTION - BUTTON */}
  <Box
    sx={{
      display: "flex",
      justifyContent: {
        xs: "center",
        md: "flex-end",
      },
    }}
  >
    <Button
      variant="contained"
      onClick={handleProceedToPayment}
      disabled={loading}
      endIcon={
        !loading && <ArrowForwardIcon />
      }
      sx={{
        position: "relative",
        overflow: "hidden",
        minWidth: {
          xs: 180,
          sm: 210,
          md: 240,
        },
        height: {
          xs: 56,
          sm: 62,
          md: 66,
        },
        borderRadius: "20px",
        px: 4,
        background:
          "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)",
        color: "#fff",
        fontSize: {
          xs: "1rem",
          sm: "1.05rem",
        },
        fontWeight: 800,
        textTransform: "none",
        letterSpacing: "0.04em",
       
        transition: "all 0.35s ease",

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "-120%",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",
          transition: "0.8s",
        },

        "&:hover": {
          transform:
            "translateY(-4px) scale(1.03)",
         
          background:
            "linear-gradient(135deg,#ffb300 0%,#ff6f00 100%)",

          "&::before": {
            left: "120%",
          },
        },

        "&:active": {
          transform: "translateY(-2px)",
        },

        "&.Mui-disabled": {
          background: "#bdbdbd",
          color: "#fff",
        },
      }}
    >
      {loading ? (
        <CircularProgress
          size={24}
          color="inherit"
        />
      ) : (
        "PAY NOW"
      )}
    </Button>
  </Box>
</Box>
    </Box>
  );
};

export default PaymentBottomBar;