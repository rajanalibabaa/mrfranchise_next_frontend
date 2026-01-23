'use client'

import React, { memo, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box, Tooltip } from '@mui/material'

// Import icons directly (already tree-shaken)
import DashboardIcon from '@mui/icons-material/Dashboard'
import ProfileIcon from '@mui/icons-material/Person'
import ReachUsIcon from '@mui/icons-material/Email'

/* ------------------ Sidebar Item ------------------ */
const SidebarItem = memo(function SidebarItem({ item, active }) {
  const Icon = item.icon

  return (
    <Tooltip title={item.tooltip} placement="right" arrow>
      <Box
        component={Link}
        href={item.path}
        prefetch
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.2,
          borderRadius: 2,
          textDecoration: 'none',
          color: 'inherit',
          bgcolor: active ? 'rgba(0,0,0,0.06)' : 'transparent',
          transition: 'background-color 0.2s ease',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
        }}
      >
        <Icon fontSize="small" />
        <span>{item.text}</span>
      </Box>
    </Tooltip>
  )
})

/* ------------------ Layout ------------------ */
export default function InvestorDashboardLayout({ children }) {
  const pathname = usePathname()

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 260,
          borderRight: '1px solid rgba(0,0,0,0.08)',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        {navItems.map(item => (
          <SidebarItem
            key={item.path}
            item={item}
            active={pathname === item.path}
          />
        ))}
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  )
}
