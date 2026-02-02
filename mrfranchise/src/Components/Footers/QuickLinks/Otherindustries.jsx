// import React, { useState, useEffect } from "react";
// import { Link as RouterLink } from 'react-router-dom';
// import axios from "axios";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import InputLabel from "@mui/material/InputLabel";
// import FormControl from "@mui/material/FormControl";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import { useTheme, useMediaQuery } from "@mui/material";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import Grid from "@mui/material/Grid";
// import Link from "@mui/material/Link";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import Navbar from "../../Navbar/NavBar";
// import Footer from "../Footer";

// const Otherindustries = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 
//   const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); 
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     userType: "",
//     category: "",
//     message: "",
//   });

//   const [errors, setErrors] = useState({
//     name: false,
//     email: false,
//     phone: false,
//     userType: false,
//     category: false,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: false }));
//     }
//   };
  

//   const validateForm = () => {
//     const newErrors = {
//       name: !formData.name.trim(),
//       email: !formData.email || !/^\S+@\S+\.\S+$/.test(formData.email),
//       phone: !formData.phone || !/^\d{10}$/.test(formData.phone),
//       userType: !formData.userType,
//       category: !formData.category,
//     };
//     setErrors(newErrors);
//     return !Object.values(newErrors).some((err) => err);
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   // console.log("Form submitted:", formData);
//   if (validateForm()) {
//     try {
//       const payload = {
//         name: formData.name,
//         email: formData.email,
//         mobileNumber: formData.phone,    
//         registerAs: formData.userType,    
//         category: formData.category,
//         message: formData.message,
//       };

//       // console.log("Payload:", payload);

//       const response = await axios.post(
//         "https://mrfranchisebackend.mrfranchise.in/api/v1/otherindustries/recievingOtherIndustriesData",
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // console.log("Server response:", response.data);
//       alert("Registration form submitted successfully!");

//       // Reset form
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         userType: "",
//         category: "",
//         message: "",
//       });
//     } catch (error) {
//       console.error("Submission error:", error);
//       alert("Something went wrong. Please try again later.");
//     }
//   }
// };

//   return (
//     <Box>
//       <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}>
//               <Navbar />
//             </Box>
//     <Box
//       sx={{
//        fontFamily: "sans-serif",
//           backgroundImage:
//             "url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           position: "relative",
//           color: "#fff",
//           minHeight: "100vh",
//           mt:{xs:6, sm:15, lg:10},
//           overflow: "hidden",
//    textAlign:{xs:"center"}
//       }}
//     >
//       {/* Overlay */}
//       <Box
//         sx={{
//          position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0,0,0,0.6)",
//             zIndex: 0,

//         }}
//       />

//       {/* Main Content */}
//       <Grid
//         container
//         sx={{
//         position: "relative",
//             zIndex: 1,
//             minHeight: "calc(100vh - 80px)",
//             display: "flex",
//             flexDirection: isMobile || isTablet ? "column" : "row",
//             alignItems: "center",
//             justifyContent: "center",
//             textAlign: isMobile || isTablet ? "center" : "left",
//             px: { xs: 2, sm: 4, md: 8, },
//             py: { xs: 4, sm: 6, md: 8 },
//         }}
//       >
//         {/* Left Side - Text Content */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//            display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               mb: { xs: 4, md: 0 }
//           }}
//         >
//           <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", fontSize: { xs: 24, md: 32,sm:32 }, color:"#e69500"  }}>
//            <Link
//               component={RouterLink}
//               to="/"
//               underline="hover"
//               color="#e69500"
//               fontWeight="bold"
//             >
//               MrFranchise.in
//             </Link>{" "} Business Opportunities
//           </Typography>
//            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//           <Typography sx={{ mb: 4, maxWidth: 500, lineHeight: 1.6, textAlign:"center" , fontSize:{xs:18}}}>
//             Join established business systems with comprehensive support. Our
//             partners offer turnkey operations with training, marketing tools,
//             and ongoing guidance to help you succeed in your entrepreneurial
//             journey.
//           </Typography></Box>
//          {/* <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//   <Button
//     variant="contained"
//     sx={{
//      backgroundColor: "#ffa500",
//                   color: "#fff",
//                   px: 4,
//                   py: 1,
//                   fontWeight: "bold",
//                   "&:hover": {
//                     backgroundColor: "#e69500",
//       },
//     }}
//   >
//     Learn More
//   </Button>
// </Box> */}
//         </Grid>

//         {/* Right Side - Form */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             padding: { xs: 2, md: 5 },
//               display: "flex",
//               alignItems: "center",
//           }}
//         >
//           <Box
//             sx={{
//              backgroundColor: "rgba(255,255,255,0.95)",
//                 padding: { xs: 2, sm: 3, md: 4 },
//                 borderRadius: "8px",
//                 width: "100%",
//                 maxWidth: "500px",
//             }}
//           >
//             <Typography
//               variant="h5"
//               align="center"
//               sx={{ 
//                 marginBottom: "20px",
//                 color: "#333",
//                 fontSize: "24px" }}
//             >
//               Contact With Us
//             </Typography>

//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={2}>
//                 <Grid  xs={12} sx={{width:"100%"}}>
//                   <TextField
//                     label="Full Name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     error={errors.name}
//                     helperText={errors.name && "Name is required"}
//                     required
//                     variant="outlined"
//                     fullWidth
                   
//                     // size="small"
//                   />
//                 </Grid>
//                 <Grid  xs={12} sx={{width:"100%"}}>
//                   <TextField
//                     label="Email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     error={errors.email}
//                     helperText={errors.email && "Valid email is required"}
//                     required
//                     variant="outlined"
//                     fullWidth
                    
              
//                   />
//                 </Grid>
//                <Grid xs={12} sx={{ width: "100%" }}>
//   <TextField
//     label="Mobile Number"
//     name="phone"
//     value={formData.phone}
//     onChange={(e) => {
//       const value = e.target.value;
//       if (/^\d{0,10}$/.test(value)) {
//         handleChange(e); 
//       }
//     }}
//     error={errors.phone}
//     helperText={
//       errors.phone && "10-digit phone number is required"
//     }
//     required
//     variant="outlined"
//     fullWidth
//     inputProps={{
//       maxLength: 10, 
//       inputMode: 'numeric', 
//       pattern: '[0-9]*',
//     }}
//   />
// </Grid>

//                 <Grid  xs={12} sx={{width:"100%"}}>
//                   <FormControl
//                     required
//                     error={errors.userType}
//                     fullWidth
//                   >
//                     <InputLabel>Register As</InputLabel>
//                     <Select
//                       name="userType"
//                       value={formData.userType}
//                       onChange={handleChange}
//                       label="Register As"
//                     >
//                       <MenuItem value="">
//                         <em>None</em>
//                       </MenuItem>
//                       <MenuItem value="Investor">Investor</MenuItem>
//                        <MenuItem value="Brand">Brand</MenuItem>
//                     </Select>
//                     {errors.userType && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ mt: 0.5 }}
//                       >
//                         Please select a type
//                       </Typography>
//                     )}
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sx={{width:"100%"}}>
//                   <FormControl
//                     required
//                     error={errors.category}
//                     fullWidth
//                   >
//                     <InputLabel>Category</InputLabel>
//                     <Select
//                       name="category"
//                       value={formData.category}
//                       onChange={handleChange}
//                       label="Category"
//                     >
//                       <MenuItem value="">
//                         <em>None</em>
//                       </MenuItem>
//                      <MenuItem value="Food & Beverage">Food & Beverage</MenuItem>
// <MenuItem value="Retail">Retail</MenuItem>
// <MenuItem value="Education">Education</MenuItem>
// <MenuItem value="Health & Wellness">Health & Wellness</MenuItem>
//                     </Select>
//                     {errors.category && (
//                       <Typography
//                         variant="caption"
//                         color="error"
//                         sx={{ mt: 0.5 }}
//                       >
//                         Please select a category
//                       </Typography>
//                     )}
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} sx={{width:"100%"}}>
//                   <TextField
//                     label="Message (Optional)"
//                     name="message"
//                     value={formData.message}
//                     onChange={handleChange}
//                     multiline
//                     rows={2}
//                     variant="outlined"
//                     fullWidth
//                   />
//                 </Grid>
//               </Grid>

//               <Box sx={{ textAlign: "center", mt: 4 }}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   sx={{
//                     backgroundColor: "#ffa500",
//                     color: "#fff",
//                     px: 4,
//                     py: 1,
//                     fontWeight: "bold",
//                     "&:hover": {
//                       backgroundColor: "#e69500",
//                     },
//                   }}
//                 >
//                   Submit
//                 </Button>
//               </Box>
//             </form>
//           </Box>
//         </Grid>
//       </Grid>

//       {/* FAQ Section */}
//       <Box
//         sx={{
//           position: "relative",
//           zIndex: 1,
//           px: 4,
//           py: 8,
//           backgroundColor: "rgba(0,0,0,0.7)",
//         }}
//       >
//         <Typography
//           variant="h4"
//           align="center"
//           sx={{ fontWeight: 600, color: "#fff", mb: 5 }}
//         >
//           Why Register With Us?
//         </Typography>

//         <Box maxWidth="1000px" mx="auto">
//           <Accordion
//             sx={{
//               borderRadius: 2,
//               mb: 2,
//               backgroundColor: "rgba(255,255,255,0.1)",
//               color: "#fff",
//               "&:hover": {
//                 backgroundColor: "rgba(255,255,255,0.2)",
//               },
//             }}
//           >
//             <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
//               <Typography variant="h6" sx={{ fontWeight: 500 }}>
//                 Why Register as an Investor?
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
//                 <li>
//                   <strong>Premium Franchise Access:</strong> First look at top brands.
//                 </li>
//                 <li>
//                   <strong>Financial Insights:</strong> In-depth data for informed choices.
//                 </li>
//                 <li>
//                   <strong>Expert Support:</strong> End-to-end investment help.
//                 </li>
//                 <li>
//                   <strong>Exclusive Networking:</strong> Events with other investors.
//                 </li>
//                 <li>
//                   <strong>Lower Risk:</strong> Vetted and supported ventures.
//                 </li>
//               </ul>
//             </AccordionDetails>
//           </Accordion>

//           <Accordion
//             sx={{
//               borderRadius: 2,
//               backgroundColor: "rgba(255,255,255,0.1)",
//               color: "#fff",
//               "&:hover": {
//                 backgroundColor: "rgba(255,255,255,0.2)",
//               },
//             }}
//           >
//             <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
//               <Typography variant="h6" sx={{ fontWeight: 500 }}>
//                 Why Register as a Brand?
//               </Typography>
//             </AccordionSummary>
//             <AccordionDetails>
//               <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
//                 <li>
//                   <strong>Vetted Leads:</strong> Get investor interest easily.
//                 </li>
//                 <li>
//                   <strong>Brand Visibility:</strong> Gain traction on our platform.
//                 </li>
//                 <li>
//                   <strong>Growth Strategy:</strong> Expert franchise development help.
//                 </li>
//                 <li>
//                   <strong>Quality Leads:</strong> Save time with filtered investors.
//                 </li>
//                 <li>
//                   <strong>Regional Expansion:</strong> Targeted market growth support.
//                 </li>
//               </ul>
//             </AccordionDetails>
//           </Accordion>
//         </Box>
//       </Box>
//     </Box>
//     <Box>
//       <Footer/>
//     </Box>
//     </Box>
//   );
// };

// export default Otherindustries;
