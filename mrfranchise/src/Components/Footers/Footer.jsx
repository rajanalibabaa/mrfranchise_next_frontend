"use client";
import React, { useEffect } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Facebook from "@mui/icons-material/Facebook";
import Twitter from "@mui/icons-material/Twitter";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Instagram from "@mui/icons-material/Instagram";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import { useMediaQuery, useTheme } from "@mui/material";

import axios from "axios";
import { useRouter } from "next/navigation";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [email, setEmail] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");
  const [response, setresponse] = React.useState("");
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleSubscribe = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/subcribe/getsubscribe`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setresponse(res.data.success);

      if (res.data.success) {
        setSuccessMsg(res.data.message);
      } else {
        setSuccessMsg(res.data.message);
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setEmail("");
      setTimeout(() => {
        setSuccessMsg("");
      }, 2000);
    }
  };

  const footerLinks = [
    {
      text: "Expand Your Brand",
      title: "Expand Your Brand in India",
      path: "/expandyourbrand",
    },
    {
      text: "Invest in a Franchise",
      title: "Invest in Profitable Franchise Opportunities",
      path: "/investfranchise",
    },
    {
      text: "Advertise With Us",
      title: "Advertise With Us for Franchises in India",
      path: "/advertisewithus",
    },
    {
      text: " Franchise Blogs",
      title: "Franchise Blogs",
      path: "/",
    },
  ];

  const supportLinks = [
    { text: "About Us", path: "/aboutpage" },
    { text: "Contact Us", path: "/contactus" },
    { text: "Help Center", path: "/help" },
    { text: "Terms & Conditions", path: "/termsandconditions" },
    { text: "FAQs", path: "/faq" },
  ];

  return (
    <Box
      id="footer"
      component="footer"
      sx={{
        background:
          "url(/footer_Mrfranchise.jpg) no-repeat center center/cover",
        color: "#fff",
        pt: 2.5,
        // pb: 3,
        // mt:1,
        position: "relative",
        // "&::before": {
        //   content: '""',
        //   position: "absolute",
        //   top: 0,
        //   left: 0,
        //   right: 0,
        //   height: "4px",
        //   background: "linear-gradient(90deg, #ffba00 0%, #ff6d00 100%)",
        // },
      }}
    >
      <Container maxWidth="xl">
        {/* Newsletter Column */}

        {/* Bottom Bar */}

        <Box
          sx={{
            // mt: 1,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            pt: 0,
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Box
              component="img"
              src="/mrfranchise_logo.avif"
              onClick={() => navigate.push("/")}
              loading="lazy"
              alt="MR FRANCHISE Logo"
              sx={{
                width: "auto",
                height: { xs: 120, sm: 120, md: 140 },
                // mb: 2,
                cursor: "pointer",
                alignSelf: { xs: "center", md: "flex-start" },
              }}
            />
          </Box>
          {!isMobile && (
            <Typography
              variant="body2"
              color="#000000"
              sx={{ fontSize: "0.85rem", mb: { xs: 2, sm: 0 } }}
            >
              © 2025 MrFranchise.in. All Rights Reserved.
            </Typography>
          )}
          <Box
            display={"flex"}
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "center", sm: "space-between" }}
          >
            <Box ml={{ xs: 0, md: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#000000",
                  fontWeight: 700,
                  mb: 2.5,
                  fontSize: "1.1rem",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: "50px",
                    height: "3px",
                    backgroundColor: "#0dff00",
                  },
                }}
              >
                Newsletter
              </Typography>
              <Typography variant="body2" color="#000000" mb={2}>
                Subscribe to our newsletter for the latest franchise
                opportunities and industry insights.
              </Typography>

              {successMsg && (
                <Box
                  sx={{
                    position: "fixed",
                    top: "40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: response ? "green" : "red",
                    color: "black",
                    border: "1px solid #c3e6cb",
                    borderRadius: "8px",
                    padding: "8px 40px",
                    fontSize: "0.95rem",
                    zIndex: 1300,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    transition: "opacity 0.3s ease-in-out",
                  }}
                >
                  {successMsg}
                </Box>
              )}

              <Box component="form" sx={{ display: "flex", mb: 3 }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  style={{
                    flex: 1,
                    padding: "12px 15px",
                    border: "none",
                    borderRadius: "4px 0 0 4px",
                    fontSize: "0.95rem",
                    backgroundColor: "#1e3a5c",
                    color: "#ffffff",
                    outline: "none",
                  }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  variant="contained"
                  aria-label="Subscribe"
                  sx={{
                    borderRadius: "0 4px 4px 0",
                    backgroundColor: "#ff6d00",
                    "&:hover": {
                      backgroundColor: "#ff8500",
                    },
                    px: 3,
                    textTransform: "none",
                  }}
                  onClick={handleSubscribe}
                >
                  Subscribe
                </Button>
              </Box>
            </Box>
            {isMobile && (
              <Grid container spacing={4} justifyContent={"flex-end"}>
                {/* Quick Links Column */}
                <Grid item xs={12} sm={6} md={2}>
                  <Box
                    component="nav"
                    aria-label="Footer Quick Links"
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1.7,
                    }}
                  >
                    {footerLinks.map((item, index) => (
                      <Typography
                        key={index}
                        component="span"
                        role="link"
                        title={item.title}
                        onClick={() => router.push(item.path)}
                        sx={{
                          cursor: "pointer",
                          color: "black",

                          fontSize: "0.85rem",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            color: "#453f3f",
                            transform: "translateX(5px)",
                          },
                        }}
                      >
                        {item.text}
                      </Typography>
                    ))}
                  </Box>
                </Grid>

                {/* Support Column */}
                <Grid item xs={12} sm={6} md={2}>
                  <Box
                    component="nav"
                    aria-label="Footer Support"
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1.7,
                    }}
                  >
                    {supportLinks.map((item, index) => (
                      <Typography
                        key={index}
                        component="span"
                        role="link"
                        title={item.text}
                        onClick={() => router.push(item.path)}
                        sx={{
                          cursor: "pointer",
                          color: "#000000",
                          fontSize: "0.85rem",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            color: "#3a3737",
                            transform: "translateX(5px)",
                          },
                        }}
                      >
                        {item.text}
                      </Typography>
                    ))}
                  </Box>
                </Grid>

                {/* Contact Details Column */}
                {/* <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffba00",
                fontWeight: 700,
                mb: 2.5,
                fontSize: "1.1rem",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  backgroundColor: "#ff6d00",
                },
              }}
            >
              Contact Details
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Phone sx={{ color: "#ffba00", mr: 1.5, fontSize: "1.2rem" }} />
              <Link
                href="tel:+917449213799"
                color="#b0bec5"
                underline="hover"
                variant="body2"
              >
                +91 7449213799
              </Link>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <LocationOn sx={{ color: "#ffba00", mr: 1.5, fontSize: "1.2rem" }} />
              <Typography variant="body2" color="#b0bec5">
                India
              </Typography>
            </Box>
            
          
          </Grid> */}
              </Grid>
            )}
            {/* Social Media */}
            <Box sx={{ ml: { xs: 2, md: 15 }, mt: { xs: 3, sm: 0, md: 8 } }}>
              {/* <Typography variant="body2" color="#000000" mb={1.5}>
                Connect with us:
              </Typography> */}
              <Box sx={{ display: "flex", gap: 5 }}>
                {[
                  {
                    icon: <Facebook />,
                    color: "#4267B2",
                    url: "https://www.facebook.com/profile.php?id=61575143466373",
                  },
                  {
                    icon: <Twitter />,
                    color: "#1DA1F2",
                    url: "https://twitter.com/",
                  },
                  {
                    icon: <LinkedIn />,
                    color: "#0077B5",
                    url: "https://www.linkedin.com/company/mr-franchise-www-mrfranchise-in/posts/?feedView=all&viewAsMember=true",
                  },
                  {
                    icon: <Instagram />,
                    color: "#E1306C",
                    url: "https://www.instagram.com/mrfranchise.in/",
                  },
                ].map((social, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={social.url}
                    target="_blank"
                    aria-label={social.url}
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: `${social.color}20`,
                      color: social.color,
                      "&:hover": {
                        backgroundColor: `${social.color}30`,
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>

          {isMobile && (
            <Typography
              variant="body2"
              color="#000000"
              sx={{ fontSize: "0.85rem", mb: { xs: 2, sm: 0 }, mt: 2 }}
            >
              © 2025 MrFranchise.in. All Rights Reserved.
            </Typography>
          )}
          <IconButton
            onClick={scrollToTop}
            aria-label="Back to top"
            sx={{
              backgroundColor: "#ff6d00",
              color: "white",
              "&:hover": {
                backgroundColor: "#ff8500",
              },
            }}
          >
            <ArrowUpward />
          </IconButton>
        </Box>

        {!isMobile && (
          <Grid container spacing={4} justifyContent={"flex-end"}>
            {/* Quick Links Column */}
            <Grid item xs={12} sm={6} md={2}>
              <Box
                component="nav"
                aria-label="Footer Quick Links"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1.7,
                }}
              >
                {footerLinks.map((item, index) => (
                  <Typography
                    key={index}
                    component="span"
                    role="link"
                    title={item.title}
                    onClick={() => router.push(item.path)}
                    sx={{
                      cursor: "pointer",
                      color: "#ffffff",

                      fontSize: "0.85rem",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#000000",
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    {item.text}
                  </Typography>
                ))}
              </Box>
            </Grid>

            {/* Support Column */}
            <Grid item xs={12} sm={6} md={2}>
              <Box
                component="nav"
                aria-label="Footer Support"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1.7,
                }}
              >
                {supportLinks.map((item, index) => (
                  <Typography
                    key={index}
                    component="span"
                    role="link"
                    title={item.text}
                    onClick={() => router.push(item.path)}
                    sx={{
                      cursor: "pointer",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#000000",
                        transform: "translateX(5px)",
                      },
                    }}
                  >
                    {item.text}
                  </Typography>
                ))}
              </Box>
            </Grid>

            {/* Contact Details Column */}
            {/* <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffba00",
                fontWeight: 700,
                mb: 2.5,
                fontSize: "1.1rem",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "50px",
                  height: "3px",
                  backgroundColor: "#ff6d00",
                },
              }}
            >
              Contact Details
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Phone sx={{ color: "#ffba00", mr: 1.5, fontSize: "1.2rem" }} />
              <Link
                href="tel:+917449213799"
                color="#b0bec5"
                underline="hover"
                variant="body2"
              >
                +91 7449213799
              </Link>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <LocationOn sx={{ color: "#ffba00", mr: 1.5, fontSize: "1.2rem" }} />
              <Typography variant="body2" color="#b0bec5">
                India
              </Typography>
            </Box>
            
          
          </Grid> */}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Footer;
