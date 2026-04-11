"use client";

import React,{useState} from "react";
import { useRouter } from "next/navigation.js";
import {
  Box,
  Grid,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  Container,
  CircularProgress
} from "@mui/material";
// import { showLoading, hideLoading } from "@/Redux/Slices/loadingSlice.js";

import LoginPage from "@/Components/LoginPage/LoginPage.jsx"
import Footer from "@/Components/Footers/Footer";
import { useDispatch } from "react-redux";
import Navbar from "@/Components/Navbar/NavBar.jsx";
import AdSlot from "@/Components/ads/GoogleAd";
import { ADS } from "@/config/ads.config";
// import { showLoading , hideLoading} from "../../Redux/Slices/loadingSlice";

function RegisterHandleUser({boolean = true}) {

  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loginOpen, setLoginOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  const openLoginPopup = () => {
    setIsSubmitting(true);
    setLoginOpen(true);
  };

  const closeLoginPopup = () => {
    setLoginOpen(false);
  };

  const handleNavigation = (path) => {
    setIsSubmitting(true);
    router.push(path);
  };
  const handleSocialLogin = (provider) => {
    setIsSubmitting(true);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${provider}`;
  };

  return (
    <>
    <Navbar/>
    {/* {boolean && <Navbar/>} */}
    <Box
    mt={isMobile ? 0 : 0}
      sx={{
        height: "100vh",
        overflow: "hidden",
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        // bgcolor: "#ffffff",
        // boxShadow: 3,
        // borderRadius: 2,
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          height: { xs: "30vh", sm: "40vh", md: "92vh" },
        }}
      >
        <Box
          component="img"
          loading="lazy"
          src='/Business_mrfranchise_logo.avif'
          alt="Business Logo"
          sx={{
            p: 50,
            maxWidth: "100%",
            height: "auto",
            borderRadius: 2,
            maxHeight: "100%",
          }}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          p: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height:"100%",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            mt: { xs: 0, md: "-10%" },
            color: "#333333",
            textAlign: "center",
          }}
        >
          Register User
        </Typography>

        <Button
          variant="contained"
          onClick={() => 
          {  
            //  dispatch(showLoading())
            handleNavigation("/invester_register")
            
          }}
          sx={{
            mb: 2,
            bgcolor: "#7ad03a",
            "&:hover": {
              bgcolor: "#e99830",
            },
            width: "100%",
            maxWidth: 250,
          }}
        >
          {isLoading && activeButton === "investor" ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Investor Registration"
                )}
        </Button>

        <Button
          variant="contained"
          onClick={() =>
           { 
            handleNavigation("/brand_listing_creation_form");
            
          }}
          sx={{
            mb: 2,
            bgcolor: "#e99830",
            "&:hover": {
              bgcolor: "#7ad03a",
            },
            width: "100%",
            maxWidth: 250,
          }}
        >
          {isLoading && activeButton === "brand" ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Brand Registration"
                )}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Box
            component="span"
            onClick={openLoginPopup}
            sx={{
              textDecoration: "none",
              cursor: "pointer",
              color: "#007bff",
              "&:hover": {
                color: "#0056b3",
              },
            }}
          >
            Sign In
          </Box>
        </Typography>

        {/* Social Media Section */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
  <Typography variant="h6" sx={{ mb: 1, fontSize: isMobile ? 14 : 16 }}>
    Sign in with..
  </Typography>
  <Grid container spacing={2} justifyContent="center">
    {/* Google Icon */}
    <Grid item>
      <Box
        component="img"
        loading="lazy"
        src='/GoogleIcon.png'
        alt="Google"
        onClick={() => 
        { 
          // dispatch(showLoading())
          handleSocialLogin("google")
          // setTimeout(() => {
          //   dispatch(hideLoading());
          // }, 2000);
        }}
        sx={{
          width: 32,
          height: 32,
          cursor: "pointer",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      />
    </Grid>

    {/* Facebook Icon */}
    {/* <Grid item>
      <Box
        component="img"
        loading="lazy"
        src={FacebookIcon}
        alt="Facebook"
        onClick={() => 
        { dispatch(showLoading())
          handleSocialLogin("facebook")
          setTimeout(() => {
            dispatch(hideLoading());
          }, 2000);
        } }
        sx={{
          width: 32,
          height: 32,
          cursor: "pointer",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      />
    </Grid> */}
  </Grid>



  {/* Login Popup Dialog */}
      <Dialog open={loginOpen} onClose={closeLoginPopup} maxWidth="sm" fullWidth>
        <LoginPage open={loginOpen} onClose={closeLoginPopup} />
      </Dialog>
</Box>
      </Grid>



    </Box>

          {/* <AdSlot {...ADS.HOME.FOOTER_RECTANGLE}/> */}

    {/* <Footer/> */}
    {boolean && <Footer/>}

    </>
    
  );
}

export default RegisterHandleUser;