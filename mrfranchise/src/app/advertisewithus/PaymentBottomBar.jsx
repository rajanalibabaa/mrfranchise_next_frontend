import React from "react";
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
  bounceAnimation,
  statCards = [],
  totalAmount = 0,
  loading = false,
  handleProceedToPayment,
}) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: {
          xs: "98%",
          md: "90%",
          lg: "80%",
        },
        zIndex: 1300,
        backgroundColor: COLORS.white,
        borderRadius: 3,
        border: `1px solid ${COLORS.border}`,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        animation: `${bounceAnimation} 2s infinite`,

        display: "flex",
        flexDirection: "column",
        gap: 2,

        px: 2,
        py: 1.5,

        "&:hover": {
          animationPlayState: "paused",
          transform: "translateX(-50%) scale(1.01)",
        },

        transition: "transform 0.3s ease",
      }}
    >
      {/* Top Title */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "1.3rem",
          textAlign: "center",
        }}
      >
        Proceed to Payment
      </Typography>

      {/* Bottom Content */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        {/* Left Stats */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: 1,
            minWidth: 0,
            overflowX: "auto",

            scrollbarWidth: "none",

            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {statCards.map((stat) => (
            <Box
              key={stat.label}
              sx={{
                width: 130,
                backgroundColor: COLORS.grey[50],
                borderRadius: 2,
                px: 1.5,
                py: 1,

                display: "flex",
                alignItems: "center",
                gap: 1,

                border: `1px solid ${COLORS.border}`,
                flexShrink: 0,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    color: COLORS.black,
                    fontWeight: 500,
                    lineHeight: 1,
                  }}
                >
                  {stat.label}
                </Typography>

                <Typography
                  sx={{
                    fontSize: TEXT_SIZES.medium,
                    fontWeight: 700,
                    color: COLORS.black,
                    lineHeight: 1.2,
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexShrink: 0,
          }}
        >
          {/* Amount */}
          <Box>
            <Typography
              sx={{
                fontSize: TEXT_SIZES.small,
                color: COLORS.grey[600],
                fontWeight: 500,
                mb: 0.2,
              }}
            >
              Total Payable
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: TEXT_SIZES.medium,
                  fontWeight: 700,
                  color: COLORS.secondaryDark,
                }}
              >
                ₹
              </Typography>

              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: COLORS.secondaryDark,
                  lineHeight: 1,
                }}
              >
                {totalAmount.toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Box>

          {/* Button */}
          <Button
            variant="contained"
            size="large"
            onClick={handleProceedToPayment}
            disabled={loading}
            endIcon={
              !loading && <ArrowForwardIcon />
            }
            sx={{
              backgroundColor: COLORS.primary,
              color: COLORS.white,
              fontSize: TEXT_SIZES.medium,
              fontWeight: 700,

              px: 4,
              py: 1.2,

              borderRadius: 2,
              textTransform: "none",
              whiteSpace: "nowrap",

              "&:hover": {
                backgroundColor: COLORS.primaryDark,
                transform: "scale(1.02)",
              },

              "&.Mui-disabled": {
                backgroundColor: COLORS.grey[400],
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