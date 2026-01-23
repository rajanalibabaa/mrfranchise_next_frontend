"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link.js';
import {useRouter } from "next/navigation.js";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useMediaQuery, useTheme } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import { User, LogOut, LogIn, UserPlus, Home, Plus, Search } from "lucide-react";
import SideViewContent from "../SideViewContentMenu/SideHoverMenu.jsx";
import LoginPage from "@/Components/LoginPage/LoginPage.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  loginSuccess,
  toggleSidebar,
  toggleMenu,
} from "@/Redux/Slices/navbarSlice";
import { logout } from "@/Redux/Slices/AuthSlice/authSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
// import logo from "@/assets/Images/logo.png";
import { showLoading } from "@/Redux/Slices/loadingSlice";
import NavbarSearch from "./NavbarSearch.jsx";
import Image from "next/image.js";

function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const { sidebarView, menuOpen } = useSelector((state) => state.navbar);
  const { isLogin } = useSelector((state) => state.auth);

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [popupLogout, setPopupLogout] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoutLoading, setlogoutLoading] = useState(false);
const [ID, setId] = useState(null);
  useEffect(() => {
    setId(localStorage.getItem("brandUUID") || localStorage.getItem("investorUUID"));
  }, []);
    // const ID =
    //   localStorage.getItem("brandUUID") ||
    //   localStorage.getItem("investorUUID") 
    //   ;
 
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) {
        dispatch(toggleMenu(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, dispatch]);

  const handleNavigate = (path) => {
    navigate(path);
    dispatch(toggleMenu(false));
    setAnchorEl(null);
  };

  const handleRegisterNavigate = () => {
  router.push("/registerhandleuser");

  dispatch(toggleMenu(false));
};


  const handleLoginSuccess = (userData) => {
    dispatch(loginSuccess(userData));
    setLoginModalOpen(false);
  };

  const handleSignOut = () => {
    
    setAnchorEl(null); // Close the menu when signing out
    dispatch(toggleMenu(false));
    setPopupLogout(true);
  };

  // const handleVerifySignOut = async () => {
  //   setlogoutLoading(true);
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:5000/api/v1/logout/${ID}`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //           "Content-Type": "application/json",
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     if (response.status === 200) {
  //       setTimeout(() => {
  //         dispatch(logout());
  //         setPopupLogout(false);
  //         navigate("/");
  //         setlogoutLoading(false);
  //         // Clear local storage items
  //         localStorage.removeItem("accessToken");
  //         localStorage.removeItem("refreshToken");
  //         localStorage.removeItem("brandUUID");
  //         localStorage.removeItem("investorUUID");
  //         localStorage.removeItem("userName");
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     console.error("Logout error:", error.message || error);
  //     setlogoutLoading(false);
  //   }
  // };


  const handleVerifySignOut  = async () => {
  setlogoutLoading(true);

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/logout/${ID}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    // ✅ 1. Redux reset
    dispatch(logout());

    // ✅ 2. Clear ALL storage
    localStorage.clear();
    sessionStorage.clear();

    // ✅ 3. Clear cookies (important)
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // ✅ 4. Disable caching
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }

    // ✅ 5. Hard redirect (kills memory state)
    window.location.replace("/");

    setlogoutLoading(false);
  }
};
  const handleMyProfileNavigate = () => {
    const investorUUID = localStorage.getItem("investorUUID");
    const brandUUID = localStorage.getItem("brandUUID");
    const userName = localStorage.getItem("userName") || "Guest";

    let url = "/";

    if (investorUUID) {
      url = `/investordashboard?id=${encodeURIComponent(investorUUID)}&name=${encodeURIComponent(userName)}`;
    } else if (brandUUID) {
      url = `/brandDashboard?id=${encodeURIComponent(brandUUID)}&name=${encodeURIComponent(userName)}`;
    }

    window.open(url, "_blank", "noopener,noreferrer");
    dispatch(toggleMenu(false));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(toggleMenu(true));
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    dispatch(toggleMenu(false));
  };

  const handleLogoClick = () => {
    // if (window.location.pathname === '/') {
    //   window.location.reload();
    // } else {
    //   dispatch(showLoading());
    //   navigate("/");
    // }
    dispatch(showLoading());
    router.push("/");
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        color="transparent" 
        elevation={0}
        sx={{
          backdropFilter: scrolled ? "blur(12px)" : "blur(8px)",
          background: scrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.9)",
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundSize: '200% 100%',
            animation: 'gradient 3s ease infinite',
          },
        }}
      >
        <Box sx={{ 
          display:{ xs: "none", sm: "flex"}, 
          flexWrap: "wrap",
          ml: "40px", 
          gap: isMobile ? 0.5 : 1,
          position: 'relative',
          zIndex: 1
        }}>
          {['Expand Your Franchise', 'Investor', 'Advertise',"Blogs","Franchise Consultant"].map((text) => (
            <motion.div
              key={text}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
             <Button
  component="a"
  href={
    text === 'Franchise Consultant'
      ? 'https://franchiseconsulting.mrfranchise.in'
      : text === 'Expand Your Franchise'
      ? '/expandyourbrand'
      : text === 'Investor'
      ? '/investfranchise'
      : text === 'Advertise'
      ? '/advertisewithus'
      : text === 'Blogs'
      ? '/'
      : '/'
  }
  target={text === 'Franchise Consultant' ? '_blank' : undefined}
  rel={text === 'Franchise Consultant' ? 'noopener noreferrer' : undefined}
  size="small"
  sx={{
    fontSize: isMobile ? '0.75rem' : '0.875rem',
    textTransform: 'none',
    color: 'black',
    '&:hover': {
      color: '#ff9800',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  }}
>
  {text}
</Button>

            </motion.div>
          ))}
        </Box>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: isMobile ? "space-evenly" : "space-between",
            alignItems: "center",
            px: { xs: 1, sm: 2 },
            minHeight: "64px !important",
            gap: isMobile ? 0 : 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap:isMobile?0: 1 }}>
            <motion.div whileHover={{ scale: 1.1 }}>
              <IconButton 
                edge="start" 
                onClick={() => dispatch(toggleSidebar(true))}
                sx={{ color: '#ff9800' }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Box 
                onClick={handleLogoClick}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  textDecoration: 'none',
                }}
              >
                <Image 
                  src="/logo.png" 
                  alt="brand logo" 
                  loading="lazy"
                  width={isMobile ? 120 : 170}
                  height={isMobile ? 50 : 70}
                  style={{ 
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease',
                  }} 
                />
              </Box>
            </motion.div>
          </Box>

          <Box sx={{ flexGrow: isMobile ? 0 : 1 }} />

          <Box sx={{ 
            display: 'flex', 
            gap:isMobile?1: 5,
            flex: isTablet ? 1 : 'none',
            justifyContent: isTablet ? 'center' : 'flex-end',
            alignItems:"center"
          }}>
            <motion.div>
              <IconButton onClick={() => setSearchOpen(true)}>
                <Search size={25} />
                <Typography sx={{display:{xs:"none", sm:"flex"}}}>Search</Typography>
              </IconButton>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Button 
                onClick={() => {
                  const url = `/brand_listing_creation_form?source=${encodeURIComponent("mr franchise")}&ref=${encodeURIComponent("homepage")}`;
                  window.open(url, "_blank");
                }}
                startIcon={<Plus size={20} />}
                sx={{
                  color: 'black',  
                  backgroundColor: ' #6fff00fa',
                  borderRadius: '8px',
                  px: {4: 3, xs: 2},
                  py:isMobile?0: 1,
                  margin:{ xs:"5px"},
                  textTransform: 'none',
                  fontSize: isMobile ? '0.5': '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#7ad03a'
                  }
                }}
              >
                Add Your Brand
              </Button>
            </motion.div>
          </Box>

          <Box ref={avatarRef} sx={{ position: "relative" }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton 
                onClick={handleMenuOpen}
                sx={{ p: 0 }}
              >
                <Avatar
                  sx={{
                    bgcolor: "rgba(255, 152, 0, 0.8)",
                    width: 36,
                    height: 36,
                    '&:hover': { 
                      bgcolor: "rgba(255, 152, 0, 1)",
                      boxShadow: '0 0 10px rgba(255, 152, 0, 0.5)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <User size={20} color="white" />
                </Avatar>
              </IconButton>
            </motion.div>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                    transition: 'all 0.2s ease',
                  }
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {!isLogin ? (
                [
                  <MenuItem 
                    key="signin" 
                    onClick={() => {
                      setLoginModalOpen(true);
                      handleMenuClose();
                    }}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        transform: 'translateX(5px)'
                      }
                    }}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LogIn size={18} style={{ marginRight: 12 }} />
                      <Typography variant="body1">Sign In</Typography>
                    </Box>
                  </MenuItem>,
                  <Divider key="divider" />,
                  <MenuItem 
                    key="register" 
                    onClick={handleRegisterNavigate}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        transform: 'translateX(5px)'
                      }
                    }}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <UserPlus size={18} style={{ marginRight: 12 }} />
                      <Typography variant="body1">Register</Typography>
                    </Box>
                  </MenuItem>
                ]
              ) : (
                [
                  <MenuItem 
                    key="profile" 
                    onClick={handleMyProfileNavigate}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        transform: 'translateX(5px)'
                      }
                    }}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <User size={18} style={{ marginRight: 12 }} />
                      <Typography variant="body1">My Profile</Typography>
                    </Box>
                  </MenuItem>,
                  <Divider key="divider" />,
                  <MenuItem 
                    key="home" 
                    onClick={() => handleNavigate("/")}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        transform: 'translateX(5px)'
                      }
                    }}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Home size={18} style={{ marginRight: 12 }} />
                      <Typography variant="body1">Home</Typography>
                    </Box>
                  </MenuItem>,
                  <Divider key="divider2" />,
                  <MenuItem 
                    key="logout" 
                    onClick={handleSignOut}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        transform: 'translateX(5px)',
                        color: 'error.main'
                      }
                    }}
                    component={motion.div}
                    whileHover={{ x: 5 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LogOut size={18} style={{ marginRight: 12 }} />
                      <Typography variant="body1">Sign Out</Typography>
                    </Box>
                  </MenuItem>
                ]
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        anchor="left"
        open={sidebarView}
        onClose={() => dispatch(toggleSidebar(false))}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(25, 25, 25, 0.97)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            width: isMobile ? '85%' : '300px',
            borderRight: '1px solid rgba(255, 152, 0, 0.2)'
          }
        }}
      >
        <SideViewContent
          hoverCategory="open"
          onHoverLeave={() => dispatch(toggleSidebar(false))}
        />
      </Drawer>

      {/* Login Modal */}
      <LoginPage
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {popupLogout && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              bgcolor: "rgba(0, 0, 0, 0.7)",
              zIndex: 1300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: 'blur(5px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Box
                sx={{
                  bgcolor: "background.paper",
                  boxShadow: 3,
                  p: 3,
                  borderRadius: 2,
                  width: 300,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Confirm Logout
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                  Are you sure you want to sign out?
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => setPopupLogout(false)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 50,
                        px: 3
                      }}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleVerifySignOut}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 50,
                        px: 3,
                        background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
                        boxShadow: '0 3px 5px 2px rgba(255, 152, 0, .3)'
                      }}
                    >
                      {logoutLoading ? "Signing out..." : "Sign Out"}
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
      <NavbarSearch open={searchOpen} handleClose={() => setSearchOpen(false)} />
    </>
  );
}

export default Navbar;