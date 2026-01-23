"use client"
import React, { useMemo } from "react";
import { Link as RouterLink, useRouter, usePathname } from "next/navigation";
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  useTheme,
  Paper,
  Tooltip,
  useMediaQuery,
  Container,
  styled
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as ProfileIcon,
  Email as ReachUsIcon
} from "@mui/icons-material";
import Footer from "../../Components/Footers/Footer";
import { useDispatch } from "react-redux";
import Navbar from "../../Components/Navbar/NavBar";

// Colors
const COLORS = {
  pistaGreen: '#93C572',
  darkGreen: '#4A7729',
  creamWhite: '#FFF9F0',
  darkText: '#2D3436'
};

// NavItem with Tooltip
const NavItem = React.memo(({ 
  isMobile, 
  location, 
  path, 
  icon: Icon, 
  text,
  tooltip,
  onClick
}) => {
  const isActive = location.pathname === path;
  const handleClick = onClick ? () => onClick() : undefined;

  const listItem = (
    <ListItem
      button
      component={onClick ? undefined : RouterLink}
      to={onClick ? undefined : path}
      onClick={handleClick}
      className={isActive ? 'active' : ''}
      sx={{
        minHeight: '48px',
        borderRadius: '12px',
        margin: '4px 8px',
        padding: isMobile ? '12px 0' : '12px 16px',
        justifyContent: isMobile ? 'center' : 'flex-start',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: COLORS.pistaGreen + '20',
          '& .MuiListItemIcon-root': {
            color: COLORS.darkGreen,
          },
          '& .MuiListItemText-primary': {
            color: COLORS.darkGreen,
            fontWeight: 600
          }
        },
        '&.active': {
          backgroundColor: COLORS.pistaGreen + '30',
          '& .MuiListItemIcon-root': {
            color: COLORS.darkGreen,
          },
          '& .MuiListItemText-primary': {
            color: COLORS.darkGreen,
            fontWeight: 600
          }
        }
      }}
    >
      <ListItemIcon sx={{ 
        minWidth: 0,
        color: COLORS.darkText,
        justifyContent: 'center',
        mr: isMobile ? 0 : 2
      }}>
        <Icon />
      </ListItemIcon>
      {!isMobile && (
        <ListItemText 
          primary={text} 
          primaryTypographyProps={{ 
            color: COLORS.darkText,
            noWrap: true
          }}
        />
      )}
    </ListItem>
  );

  return (
    <Tooltip title={tooltip || ""} arrow placement={isMobile ? "right" : "top"}>
      <Box>{listItem}</Box>
    </Tooltip>
  );
});

const InvestorDashboard = () => {
  const navigate = useRouter();
  const theme = useTheme();
  const location = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Sidebar styles
  const GlassSidebar = useMemo(() => {
    return styled(Paper)(({ theme }) => ({
      width: isMobile ? '64px' : '240px',
      flexShrink: 0,
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)`,
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
      borderRight: '1px solid rgba(255, 255, 255, 0.3)',
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0,
      borderRadius: 0,
      borderTopRightRadius: '24px',
      borderBottomRightRadius: '24px',
      overflow: 'hidden',
      marginTop: '1rem',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }));
  }, [isMobile, theme]);

  // Nav items
  const navItems = useMemo(() => [
    {
      path: "/investordashboard",
      icon: DashboardIcon,
      text: "Dashboard",
      tooltip: "View Your Dashboard",
      exact: true
    },
    {
      path: "/investordashboard/manageProfile",
      icon: ProfileIcon,
      text: "Profile",
      tooltip: "Manage your profile details",
      onClick: () => navigate("/investordashboard/manageProfile")
    },
    {
      path: "/investordashboard/respondemanager",
      icon: ReachUsIcon,
      text: "Reach Us",
      tooltip: "Contact support"
    },
    
  ], [navigate]);

  return (
    <>
      <Navbar/>
      <Box sx={{ 
        display: "flex", 
        minHeight: "calc(100vh - 64px)",
        backgroundColor: COLORS.creamWhite
      }}>
        {/* Sidebar */}
        <GlassSidebar elevation={3}>
          <Box sx={{ p: isMobile ? 1 : 2, flexGrow: 1 }}>
            <List sx={{ padding: 0 }}>
              {navItems.map((item) => (
                <NavItem
                  key={item.path}
                  isMobile={isMobile}
                  location={location}
                  path={item.path}
                  icon={item.icon}
                  text={item.text}
                  tooltip={item.tooltip}
                  navigate={navigate}
                  onClick={item.onClick}
                />
              ))}
            </List>
          </Box>
        </GlassSidebar>

        {/* Main Content */}
        <Container sx={{ 
          flexGrow: 1, 
          overflowY: "auto",
          p: isMobile ? 2 : 4,
          background: `linear-gradient(to bottom right, ${COLORS.creamWhite}, #ffffff)`
        }}>
          <Box sx={{ 
            maxWidth: 1400,
            margin: '0 auto',
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            p: isMobile ? 2 : 4,
            minHeight: 'calc(100vh - 128px)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <Outlet />
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default React.memo(InvestorDashboard);
