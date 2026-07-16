"use client";
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";

const Disclaimer = ({ isMobile }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
    component="section"
      sx={{
        ml: { xs: 2, md: 10.5 },
        mr: { xs: 2, md: 10.5 },
        mb: 4,
        mt: 0,
        p: 2,
        borderRadius: "12px",
        bgcolor: "rgba(255, 255, 255, 1)",
      }}
    >
      <Typography
       component="h2"
        variant="caption"
        fontSize={9}
        color="#212121"
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 1, // one line when collapsed
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          whiteSpace: expanded ? "normal" : "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        <span style={{ color: "#f44336", fontWeight: 600 }}>
          Disclaimer:{" "}
        </span>
        Mr Franchise and the site sponsors accept no liability for the accuracy
        of any information contained on this site or on other linked sites. We
        recommend you take advice from a lawyer, accountant and franchise
        consultant experienced in franchising before you commit yourself. It is
        user's responsibility to satisfy yourself as to the accuracy and
        reliability of the information supplied. Please read the terms &
        conditions on MrFranchise.in
      </Typography>

      <Button
        size="small"
        onClick={() => setExpanded(!expanded)}
        sx={{
          mt: 0.5,
          p: 0,
          minWidth: "auto",
          fontSize: "9px",
          textTransform: "none",
          color: "#ba1212ff",
          textDecoration: "underline",
        }}
      >
        {expanded ? "Less" : "Expand More"}
      </Button>
    </Box>
  );
};

export default Disclaimer;
