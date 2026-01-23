import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";

const ComingSoon = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        textAlign: "center",
        px: 2,
        color: "white",
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            component="h1"
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 2,
              letterSpacing: 2,
              textShadow: '2px 2px 8px rgba(0,0,0,0.6)'
            }}
          >
            COMING SOON !!!
          </Typography>

          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 4,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.9)',
              textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
            }}
          >
            Your next favorite franchise is almost here.....
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ComingSoon;