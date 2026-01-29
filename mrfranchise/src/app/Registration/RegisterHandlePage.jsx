
"use client"

import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
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
import { showLoading, hideLoading } from "../../Redux/Slices/LoadingSlice.jsx";
import businessLogo from "../../assets/images/Business_logo.png";
import FacebookIcon from "../../Assets/Images/FacebookIcon.png";
// import LinkedInIcon from "../../Assets/Images/LinkedinIcon.png";
// import InstagramIcon from "../../Assets/Images/InstagramIcon.png";
// import TwitterIcon from "../../Assets/Images/TwitterIcon.png";
import GoogleIcon from "../../Assets/Images/GoogleIcon.png";
import LoginPage from "../../Pages/LoginPage/LoginPage.js"
import Footer from "../../Components/Footers/Footer.jsx";
import { useDispatch } from "react-redux";
import Navbar from "../../Components/Navbar/NavBar.jsx";
// import { showLoading , hideLoading} from "../../Redux/Slices/loadingSlice";

function RegisterHandleUser({boolean = true}) {

  const navigate = useNavigate();
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
    navigate(path);
  };
  const handleSocialLogin = (provider) => {
    setIsSubmitting(true);
    window.location.href = `http://localhost:5000/api/v1/auth/${provider}`;
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
        bgcolor: "#ffffff",
        boxShadow: 3,
        borderRadius: 2,
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
          src={businessLogo}
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
          {   dispatch(showLoading())
            handleNavigation("/investor-register")
            setTimeout(() => {
              dispatch(hideLoading());
            },  2000);
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
           { dispatch(showLoading());
            handleNavigation("/brandlistingform");
            setTimeout(() => {
              dispatch(hideLoading());
            }, 2000);
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
    Follow us on:
  </Typography>
  <Grid container spacing={2} justifyContent="center">
    {/* Google Icon */}
    <Grid item>
      <Box
        component="img"
        loading="lazy"
        src={GoogleIcon}
        alt="Google"
        onClick={() => 
        { dispatch(showLoading())
          handleSocialLogin("google")
          setTimeout(() => {
            dispatch(hideLoading());
          }, 2000);
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
    {/* <Footer/> */}
    {boolean && <Footer/>}
    </>
    
  );
}

export default RegisterHandleUser;