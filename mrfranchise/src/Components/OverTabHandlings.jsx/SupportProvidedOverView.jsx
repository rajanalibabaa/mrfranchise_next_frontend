// SupportProvided.jsx
"use client";
import React from "react";
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  Zoom,
} from "@mui/material";
import { Business } from "@mui/icons-material";

const SupportProvided = ({ trainingSupport, aidFinancing, isInternationalExpansion }) => {
  return (
    <Zoom in={true} timeout={700}>
      <Card
        sx={{
          borderRadius: "16px",
          background:'#ffffffff',
          height: "100%",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            gutterBottom
            display="flex"
            alignItems="center"
            color="#000000ff"
            sx={{ background:'#7cd13b',p:1}}
          >
            {/* <Business sx={{ color: "#000000ff", mr: 1 }} /> */}
            Support Provided By Brand
          </Typography>
          <Divider sx={{ mb: 2, borderColor: "rgba(0,0,0,0.1)" }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "180px auto",
              rowGap: 1,
              columnGap: 2,
              pl: 1,
            }}
          >
            {trainingSupport && trainingSupport.length > 0 && (
              <>
                <Typography variant="body2" sx={{ color: "#212121", fontWeight: 600 }}>
                  Training Support:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#212121",
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 0.5,
                  }}
                >
                  {trainingSupport.map((item, index) => (
                    <span key={index}>✅ {item}</span>
                  ))}
                </Typography>
              </>
            )}

            {aidFinancing && (
              <>
                <Typography variant="body2" sx={{ color: "#212121", fontWeight: 600 }}>
                  Financing Aid:
                </Typography>
                <Typography variant="body2" sx={{ color: "#212121" }}>
                  {aidFinancing}
                </Typography>
              </>
            )}
            <Typography variant="body2" sx={{ color: "#212121", fontWeight: 600 }}>
              International Expansion:
            </Typography>
            <Typography variant="body2" sx={{ color: "#212121" }}>
              {isInternationalExpansion ? "Yes" : "No"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );
};

export default SupportProvided;