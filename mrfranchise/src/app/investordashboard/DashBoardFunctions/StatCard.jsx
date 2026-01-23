"use client";
import React, { memo } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

import { useTheme, useMediaQuery } from '@mui/material';

const StatCard = memo(({ icon, title, value, color, isSelected, onClick }) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Card
      onClick={onClick}
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 240, md: 260 },
        minHeight: { xs: 40, sm: 72 },
        borderRadius: 2,
        px: { xs: 1, sm: 1.5 },
        py: 0,
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 1.5 },
        bgcolor: isSelected ? `rgba(${color}, 0.25)` : `rgba(${color}, 0.05)`,
        border: '1px solid',
        borderColor: isSelected ? `rgba(${color}, 0.5)` : `rgba(${color}, 0.1)`,
        transition: 'all 0.2s ease-out',
        boxShadow: isSelected ? `0 4px 16px -2px rgba(${color}, 0.4)` : 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: { xs: 'none', sm: 'translateY(-2px)' },
          boxShadow: isSelected 
            ? `0 4px 16px -2px rgba(${color}, 0.4)`
            : { xs: 'none', sm: `0 4px 12px -2px rgba(${color}, 0.15)` },
          bgcolor: isSelected 
            ? `rgba(${color}, 0.25)`
            : { xs: `rgba(${color}, 0.05)`, sm: `rgba(${color}, 0.08)` },
          '& .stat-icon': {
            transform: { xs: 'none', sm: 'scale(1.05)' }
          }
        },
        '@media (hover: none)': {
          '&:active': {
            bgcolor: `rgba(${color}, 0.1)`
          }
        }
      }}
    >
      <Box
        className="stat-icon"
        sx={{
          flexShrink: 0,
          p: { sm: 1 },
          borderRadius: '50%',
          bgcolor: isSelected ? `rgba(${color}, 0.3)` : `rgba(${color}, 0.1)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease-out',
          boxShadow: `inset 0 0 0 1px rgba(${color}, ${isSelected ? '0.4' : '0.15'})`,
          '& > svg': {
            fontSize: { xs: '13px', sm: '15px', md: '22px' }
          },
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            color: isSelected ? `rgba(${color}, 1)` : `rgb(${color})`,
            fontSize: { xs: '16px', sm: '10px', md: '22px' },
            transition: 'color 0.2s ease-out'
          }
        })}
      </Box>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-end', sm: 'center' },
          justifyContent: 'end',
          gap: { xs: 0.5, sm: 1 }
        }}
      >
        {isSm && (
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontWeight: isSelected ? 600 : 500,
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              color: isSelected ? `rgba(${color}, 0.9)` : 'text.secondary',
              lineHeight: 1.3,
              transition: 'all 0.2s ease-out'
            }}
          >
            {title}
          </Typography>
        )}

        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: isSelected ? 700 : 600,
            fontSize: { xs: '0.6rem', sm: '1rem', md: '1.125rem' },
            lineHeight: 1.2,
            background: isSelected 
              ? `linear-gradient(75deg, rgba(${color}, 1) 0%, rgba(${color}, 0.8) 100%)`
              : `linear-gradient(75deg, rgb(${color}) 0%, rgba(${color}, 0.9) 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            '@media (hover: hover)': {
              textShadow: isSelected 
                ? `0 0 8px rgba(${color}, 0.4)`
                : `0 0 6px rgba(${color}, 0.2)`
            },
            transition: 'all 0.2s ease-out'
          }}
        >
          {value}
        </Typography>
      </Box>
    </Card>
  );
});

export default StatCard;