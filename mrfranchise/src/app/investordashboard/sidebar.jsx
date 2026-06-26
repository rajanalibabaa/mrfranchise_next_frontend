'use client'

import React, { memo, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box, Tooltip, useMediaQuery, useTheme } from '@mui/material'

// Import icons directly (already tree-shaken)
import DashboardIcon from '@mui/icons-material/Dashboard'
import ProfileIcon from '@mui/icons-material/Person'
import ReachUsIcon from '@mui/icons-material/Email'

/* ------------------ Sidebar Item ------------------ */
const SidebarItem = memo(function SidebarItem({ item, active, collapsed }) {
  const Icon = item.icon

  return (
    <Tooltip 
      title={collapsed ? item.tooltip : ''} 
      placement="right" 
      arrow
      disableHoverListener={!collapsed}
    >
      <Box
        component={Link}
        href={item.path}
        prefetch
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: collapsed ? 0 : 1.5,
          px: collapsed ? 1.5 : 2,
          py: 1.2,
          borderRadius: 2,
          textDecoration: 'none',
          color: 'inherit',
          bgcolor: active ? 'rgba(0,0,0,0.06)' : 'transparent',
          transition: 'all 0.2s ease',
          minHeight: 44,
          justifyContent: collapsed ? 'center' : 'flex-start',
          '&:hover': { 
            bgcolor: 'rgba(0,0,0,0.08)',
            transform: collapsed ? 'scale(1.05)' : 'none'
          }
        }}
      >
        <Icon 
          fontSize="small"
          sx={{ 
            minWidth: collapsed ? 'auto' : 20,
            transition: 'all 0.2s ease'
          }}
        />
        <Box
          sx={{
            opacity: collapsed ? 0 : 1,
            transform: `translateX(${collapsed ? -12 : 0}px)`,
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          {item.text}
        </Box>
      </Box>
    </Tooltip>
  )
})

/* ------------------ Layout ------------------ */
export default function InvestorDashboardLayout({ children }) {
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = useMemo(() => [
    {
      path: '/investordashboard',
      icon: DashboardIcon,
      text: 'Dashboard',
      tooltip: 'View Your Dashboard'
    },
    {
      path: '/investordashboard/manageprofiles',
      icon: ProfileIcon,
      text: 'Profile',
      tooltip: 'Manage your profile details'
    },
    {
      path: '/investordashboard/respondemanager',
      icon: ReachUsIcon,
      text: 'Reach Us',
      tooltip: 'Contact support'
    }
  ], [])

  const sidebarWidth = isCollapsed || isMobile ? 50 : 260

 return (
  <Box
    sx={{
      display: isMobile ? 'block' : 'flex',
      minHeight: '100vh',
  
    }}
  >
    {/* ✅ MOBILE TOP MENU */}
    {isMobile && (
      <Box
        sx={{
          display: 'flex',
          gap: 0.5,
          px: 1,
          py: 1,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          bgcolor: 'background.paper',
          overflowX: 'auto'
        }}
      >
        {navItems.map(item => (
          <SidebarItem
            key={item.path}
            item={item}
            active={pathname === item.path}
            collapsed={false}
          />
        ))}
      </Box>
    )}

    {/* ✅ DESKTOP SIDEBAR */}
    {!isMobile && (
      <Box
        sx={{
          width: sidebarWidth,
          borderRight: '1px solid rgba(0,0,0,0.08)',
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          position: 'sticky',
          top: 130,
          height: '100vh',
          bgcolor: 'background.paper'
        }}
      >
        {navItems.map(item => (
          <SidebarItem
            key={item.path}
            item={item}
            active={pathname === item.path}
            collapsed={isCollapsed}
          />
        ))}
      </Box>
    )}

    {/* Main Content */}
    <Box sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
      {children}
    </Box>
  </Box>
)

}