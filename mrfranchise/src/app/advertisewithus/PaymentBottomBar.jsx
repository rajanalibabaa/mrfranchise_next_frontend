import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockIcon from "@mui/icons-material/Lock";

const PaymentBottomBar = ({
  COLORS,
  TEXT_SIZES,
  bounceAnimation,
  statCards = [],
  totalAmount = 0,
  loading = false,
  handleProceedToPayment,
}) => {

  const [hideBar, setHideBar] =
useState(false);
useEffect(() => {
  const handleScroll = () => {
    const footer =
      document.getElementById("footer");

    if (!footer) return;

    const footerRect =
      footer.getBoundingClientRect();

    // Hide bar when footer enters screen
    if (footerRect.top <= window.innerHeight) {
      setHideBar(true);
    } else {
      setHideBar(false);
    }
  };

  window.addEventListener(
    "scroll",
    handleScroll
  );

  handleScroll();

  return () =>
    window.removeEventListener(
      "scroll",
      handleScroll
    );
}, []);

  return (
    <Box
  sx={{
  position: "fixed",
bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",

    width: {
      xs: "95%",
      sm: "92%",
      md: "80%",
      lg: "45%",
    },

    zIndex: 1400,

    background: "rgba(255,255,255,0.92)",

    backdropFilter: "blur(20px)",

    border: "1px solid rgba(255,255,255,0.4)",

    borderRadius: "24px",

    px: {
      xs: 2,
      sm: 2.5,
      md: 3,
    },

    py: {
      xs: 1.8,
      md: 2,
    },

    boxShadow:
      "0 20px 60px rgba(0,0,0,0.12)",
opacity: hideBar ? 0 : 1,

pointerEvents: hideBar
  ? "none"
  : "auto",

transition:
  "opacity 0.25s ease, transform 0.3s ease",

    overflow: "hidden",

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "4px",

     
    },

    "&:hover": {
      transform:
        "translateX(-50%) translateY(-3px)",

      boxShadow:
        "0 25px 70px rgba(0,0,0,0.16)",
    },
  }}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",

      flexWrap: {
        xs: "wrap",
        md: "nowrap",
      },

      gap: 2,
    }}
  >
    {/* LEFT SECTION */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,

        flexWrap: "wrap",
      }}
    >
      {statCards.map((stat) => (
        <Box
          key={stat.label}
          sx={{
            minWidth: 110,

            background:
              "linear-gradient(180deg,#ffffff,#f8f8f8)",

            border: "1px solid #ececec",

            borderRadius: "18px",

            px: 2,
            py: 1.3,

            transition: "0.3s ease",

            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.08)",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "0.72rem",
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
              fontSize: "1.5rem",
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

    {/* RIGHT SECTION */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",

        justifyContent: "space-between",

        gap: {
          xs: 1.5,
          sm: 2,
        },

        width: {
          xs: "100%",
          md: "auto",
        },
      }}
    >
      {/* PRICE */}
      <Box>
        <Typography
          sx={{
            fontSize: "0.78rem",
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
            fontSize: {
              xs: "2rem",
              md: "2.4rem",
            },

            fontWeight: 900,

            color: "#2e7d32",

            lineHeight: 1,

            letterSpacing: "-0.04em",
          }}
        >
          ₹
          {totalAmount.toLocaleString("en-IN")}
        </Typography>

        {/* <Typography
          sx={{
            fontSize: "0.72rem",
            color: "#888",
            mt: 0.3,
            fontWeight: 500,
          }}
        >
          Secure Checkout
        </Typography> */}
      </Box>

      {/* BUTTON */}
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
            xs: 160,
            md: 210,
          },

          height: 64,

          borderRadius: "18px",

          px: 4,

          background:
            "linear-gradient(135deg,#ff9800 0%,#ff6f00 100%)",

          color: "#fff",

          fontSize: "1rem",

          fontWeight: 800,

          textTransform: "none",

          letterSpacing: "0.03em",

          boxShadow:
            "0 12px 30px rgba(255,152,0,0.35)",

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

            boxShadow:
              "0 18px 40px rgba(255,152,0,0.45)",

            background:
              "linear-gradient(135deg,#ffb300 0%,#ff6f00 100%)",

            "&::before": {
              left: "120%",
            },
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