"use client";
import React, { useState } from 'react';
import {
   useMediaQuery, useTheme
} from "@mui/material";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import Email from '@mui/icons-material/Email';
import Feedback from '@mui/icons-material/Feedback';
import CheckCircle from '@mui/icons-material/CheckCircle';
import   Report from '@mui/icons-material/Report';
import { alpha } from '@mui/material/styles';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import InvestorDashboardLayout from '../sidebar';
import Navbar from '@/Components/Navbar/NavBar';
import Footer from '@/Components/Footers/Footer';

// Color Palette
const colors = {
  pistachio: '#93C572',
  lightOrange: '#FFB347',
  white: '#FFFFFF',
  black: '#2C2C2C',
  lightGray: '#F5F5F5',
  darkGray: '#555555'
};

// Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  backgroundColor: colors.lightGray,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2)
  }
}));

const DashboardCard = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  backgroundColor: colors.white,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
  }
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: colors.pistachio,
  color: colors.white,
  fontWeight: 600,
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: '#7DA95D',
    boxShadow: '0 2px 8px rgba(147, 197, 114, 0.3)'
  }
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: colors.lightOrange,
  color: colors.white,
  fontWeight: 600,
  borderRadius: '8px',
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: '#E69F42',
    boxShadow: '0 2px 8px rgba(255, 179, 71, 0.3)'
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: colors.pistachio,
  color: colors.white
}));

// Rating Component
const CustomRating = ({ value, onChange }) => (
  <Rating
    value={value}
    precision={0.5}
    onChange={onChange}
    icon={<Star fontSize="inherit" style={{ color: colors.lightOrange }} />}
    emptyIcon={<StarBorder fontSize="inherit" style={{ color: colors.darkGray }} />}
  />
);

// Feedback Form Component
const FeedbackForm = ({ showSnackbar, isMobile }) => {
  const [rating, setRating] = useState(3);
  const [category, setCategory] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { investorUUID, AccessToken } = useSelector((state) => state.auth || {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!investorUUID || !AccessToken) {
      showSnackbar("Please login to submit feedback", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/feedback/createFeedback/${investorUUID}`,
        { topic: category, rating, feedback },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${AccessToken}` } }
      );
      showSnackbar(response.data.message || "Feedback submitted!", "success");
      setCategory('');
      setFeedback('');
      setRating(3);
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Submission failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardCard>
      <SectionHeader>
        <Avatar sx={{ bgcolor: colors.white, color: colors.pistachio, mr: 1, width: 32, height: 32 }}>
          <Feedback fontSize="small" />
        </Avatar>
        <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="600">Share Your Feedback</Typography>
      </SectionHeader>
      
      <Box p={2}>
        <Box textAlign="center" mb={2}>
          <Typography variant={isMobile ? "caption" : "body2"} color={colors.darkGray} mb={1}>
            How would you rate your experience?
          </Typography>
          <CustomRating value={rating} onChange={(e, newValue) => setRating(newValue)} />
        </Box>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
              required
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              {["Service", "Platform", "Support", "Other"].map(item => (
                <MenuItem key={item} value={item} sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Your Feedback"
            multiline
            rows={4}
            fullWidth
            size="small"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: isMobile ? '0.75rem' : '0.875rem' } }}
            InputLabelProps={{ style: { fontSize: isMobile ? '0.75rem' : '0.875rem' } }}
            required
          />

          <Box display="flex" justifyContent="flex-end">
            <PrimaryButton 
              type="submit" 
              disabled={isSubmitting}
              startIcon={<CheckCircle fontSize="small" />}
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </PrimaryButton>
          </Box>
        </form>
      </Box>
    </DashboardCard>
  );
};

// Complaint Form Component
const ComplaintForm = ({ showSnackbar, isMobile }) => {
  const [category, setCategory] = useState('');
  const [complaint, setComplaint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { investorUUID, AccessToken } = useSelector((state) => state.auth || {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!investorUUID || !AccessToken) {
      showSnackbar("Please login to submit a complaint", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/complaint/createComplaint/${investorUUID}`,
        { topic: category, complaint },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${AccessToken}` } }
      );
      showSnackbar(response.data.message || "Complaint submitted!", "success");
      setCategory('');
      setComplaint('');
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Submission failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardCard>
      <SectionHeader sx={{ backgroundColor: colors.lightOrange }}>
        <Avatar sx={{ bgcolor: colors.white, color: colors.lightOrange, mr: 1, width: 32, height: 32 }}>
          <Report fontSize="small" />
        </Avatar>
        <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="600">File a Complaint</Typography>
      </SectionHeader>
      
      <Box p={2}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }} size="small">
            <InputLabel sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>Issue Type</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Issue Type"
              required
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              {["Technical", "Billing", "Service", "Other"].map(item => (
                <MenuItem key={item} value={item} sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Detailed Complaint"
            multiline
            rows={4}
            fullWidth
            size="small"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: isMobile ? '0.75rem' : '0.875rem' } }}
            InputLabelProps={{ style: { fontSize: isMobile ? '0.75rem' : '0.875rem' } }}
            required
          />

          <Box display="flex" justifyContent="flex-end">
            <SecondaryButton 
              type="submit" 
              disabled={isSubmitting}
              startIcon={<Report fontSize="small" />}
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </SecondaryButton>
          </Box>
        </form>
      </Box>
    </DashboardCard>
  );
};

// Contact Us Component
const ContactUs = ({ isMobile }) => (
  <DashboardCard>
    <SectionHeader>
      <Avatar sx={{ bgcolor: colors.white, color: colors.pistachio, mr: 1, width: 32, height: 32 }}>
        <Email fontSize="small" />
      </Avatar>
      <Typography variant={isMobile ? "body2" : "subtitle1"} fontWeight="600">Contact Our Team</Typography>
    </SectionHeader>
    
    <Box p={2} textAlign="center">
      <Typography variant={isMobile ? "caption" : "body2"} color={colors.darkGray} mb={2}>
        Have questions? Reach out to our support team directly.
      </Typography>
      
      <Chip
        icon={<Email fontSize="small" />}
        label="support.team@mrfranchise.in"
        component="a"
        href="https://mail.google.com/mail/?view=cm&fs=1&to=support.team@mrfranchise.in&su=Support%20Request&body=Hi%20Team%2C%20I%20have%20a%20question..."
        target="_blank"
        rel="noopener noreferrer"
        clickable
        sx={{
          p: 1,
          fontSize: isMobile ? '0.75rem' : '0.875rem',
          backgroundColor: colors.pistachio,
          color: colors.white,
          '&:hover': {
            backgroundColor: '#7DA95D'
          }
        }}
      />

      <Typography variant="caption" color={colors.darkGray} mt={1} display="block" fontSize={isMobile ? '0.65rem' : '0.75rem'}>
        We typically respond within 24 hours.
      </Typography>
    </Box>
  </DashboardCard>
);

// Main Dashboard Component
const ResponseManagerDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState('feedback');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const tabs = [
    { 
      id: 'feedback', 
      label: 'Feedback', 
      icon: <Feedback fontSize="small" />, 
      component: <FeedbackForm showSnackbar={showSnackbar} isMobile={isMobile} /> 
    },
    { 
      id: 'complaint', 
      label: 'Complaint', 
      icon: <Report fontSize="small" />, 
      component: <ComplaintForm showSnackbar={showSnackbar} isMobile={isMobile} /> 
    },
    { 
      id: 'contact', 
      label: 'Contact Us', 
      icon: <Email fontSize="small" />, 
      component: <ContactUs isMobile={isMobile} /> 
    }
  ];

  return (
    <>
    <Navbar/>
    <Box sx={{ display: 'flex', height: '100vh' }}>
<InvestorDashboardLayout/>

      <DashboardContainer>
        {isMobile ? (
          <Box sx={{p:1,borderRadius:'88px'}}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                textAlign: 'center',
                backgroundColor: colors.pistachio,
                color: colors.white,
                p: 1,
                fontSize: '0.75rem',
                letterSpacing: 0.5,
                
              }}
            >
              Support Center
            </Typography>

            {/* Compact Mobile Tab Bar */}
            <Box
              display="flex"
              justifyContent="space-between"
              p={0.5}
              bgcolor={colors.white}
              // boxShadow={2}
              sx={{
                borderBottom: `1px solid ${alpha(colors.darkGray, 0.2)}`,
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <Button
                    key={tab.id}
                    fullWidth
                    onClick={() => setActiveTab(tab.id)}
                    disableRipple
                    sx={{
                      mx: 0.25,
                      py: 0.5,
                      borderRadius: '6px',
                      backgroundColor: isActive ? '#5C8542' : 'transparent',
                      color: isActive ? colors.white : colors.darkGray,
                      boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                      transition: 'all 0.2s ease-in-out',
                      minWidth: 0
                    }}
                    startIcon={React.cloneElement(tab.icon, {
                      sx: {
                        fontSize: '8px',
                        color: isActive ? colors.white : colors.darkGray
                      }
                    })}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.5rem',
                        fontWeight: 500,
                        textTransform: 'none'
                      }}
                    >
                      {tab.label}
                    </Typography>
                  </Button>
                );
              })}
            </Box>

            {/* Active Tab Content */}
            <Box p={1}>
              {tabs.find((t) => t.id === activeTab)?.component}
            </Box>
          </Box>
        ) : (
          // Desktop View
          <Box display="flex" maxWidth={1000} mx="auto">
            {/* Sidebar */}
            <Box width={200} mr={2}>
              <DashboardCard>
                <SectionHeader>
                  <Typography variant="subtitle1" fontWeight="600">Support Center</Typography>
                </SectionHeader>
                
                <Box p={1}>
                  {tabs.map(tab => (
                    <Box 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1.5,
                        mb: 0.5,
                        borderRadius: '6px',
                        backgroundColor: activeTab === tab.id ? alpha(colors.pistachio, 0.4) : 'transparent',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: activeTab === tab.id ? alpha(colors.pistachio, 0.5) : alpha(colors.pistachio, 0.1)
                        }
                      }}
                    >
                      <Avatar sx={{ 
                        bgcolor: activeTab === tab.id ? alpha(colors.pistachio, 0.8) : colors.lightGray,
                        color: activeTab === tab.id ? colors.white : colors.darkGray,
                        mr: 1.5,
                        width: 30,
                        height: 30
                      }}>
                        {tab.icon}
                      </Avatar>
                      <Typography variant="body2" fontWeight={activeTab === tab.id ? 700 : 400}>
                        {tab.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </DashboardCard>
            </Box>
            
            {/* Main Content */}
            <Box flex={1}>
              {tabs.find(t => t.id === activeTab)?.component}
            </Box>
          </Box>
        )}
      </DashboardContainer>
    </Box>
    
<Footer/>
      {/* Global Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          <Typography variant="body2" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
            {snackbar.message}
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default ResponseManagerDashboard;