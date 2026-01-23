// import {
//   Box,
//   Typography,
//   Container,
//   Chip,
//   Divider,
//   Grid,
//   Button
// } from "@mui/material";
// import { keyframes } from "@emotion/react";
// import Navbar from '../../Navbar/NavBar';
// import Footer from '../Footer';

// // Animated gradient background for the whole section
// const animatedBg = keyframes`
//   0% { background-position: 0% 50% }
//   50% { background-position: 100% 50% }
//   100% { background-position: 0% 50% }
// `;

// const sectionBg = {
//   minHeight: "100vh",
//   // background: "linear-gradient(120deg, #fffbe7, #e3f2fd, #ffe0b2, #c8e6c9)",
//   backgroundSize: "300% 300%",
//   animation: `${animatedBg} 12s ease-in-out infinite`,
//   position: "relative",
//   overflow: "hidden"
// };

// // Card effect: glassmorphism + hover lift + glow
// const stepBox = (accent, bg) => ({
//   background: "rgba(255,255,255,0.85)",
//   borderRadius: 18,
//   px: { xs: 1, md: 2 }, // reduced horizontal padding
//   py: { xs: 2, md: 2.5 }, // reduced vertical padding
//   boxShadow: `0 2px 24px 0 ${accent}22`,
//   borderLeft: `6px solid ${accent}`,
//   position: "relative",
//   zIndex: 2,
//   minHeight: { xs: 320, sm: 340, md: 370 }, // reduced minHeight for all breakpoints
//   height: "100%",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "flex-start",
//   backdropFilter: "blur(6px)",
//   WebkitBackdropFilter: "blur(6px)",
//   transition: "transform 0.3s, box-shadow 0.3s",
//   "&:hover": {
//     transform: "translateY(-10px) scale(1.03)",
//     boxShadow: `0 8px 40px 0 ${accent}66, 0 0 0 4px ${accent}22`
//   }
// });

// // Add a subtle floating animation to the step circles
// const floatAnim = keyframes`
//   0% { transform: translateY(0);}
//   50% { transform: translateY(-10px);}
//   100% { transform: translateY(0);}
// `;

// const stepCircle = (color) => ({
//   width: 56,
//   height: 56,
//   borderRadius: "50%",
//   background: color,
//   color: "#fff",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontSize: 32,
//   fontWeight: 700,
//   boxShadow: `0 4px 24px 0 ${color}33`,
//   border: `4px solid #fff`,
//   zIndex: 2,
//   margin: "0 auto",
//   animation: `${floatAnim} 2.5s ease-in-out infinite`
// });

// const FranchisePromotion = () => {
//   return (
//     <Box sx={sectionBg}>
//       <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}>
//         <Navbar />
//       </Box>
//       <Container
//         maxWidth="lg"
//         sx={{
//           py: { xs: 2, sm: 4 },
//           borderRadius: 4,
//           mt: { xs: 10, sm: 16, md: 15,lg:12 },
//           mb: { xs: 2, sm: 4, md: 6 },
//           position: "relative",
//           zIndex: 2
//         }}
//       >
//         <Typography
//           variant="h4"
//           fontWeight="bold"
//           sx={{
//             color: "#ff9800",
//             textAlign: "center",
//             letterSpacing: 1,
//             fontSize:{xs:23, sm:30},
//             mb: 2,
//             fontWeight:"bold",
//             textShadow: "0 2px 12px #fffbe7"
//           }}
//         >
//           Franchise Promotion & Lead Distribution Packages
//         </Typography>
//         <Typography
//           variant="subtitle1"
//           sx={{color:"#7ad03a"
// , textAlign: "center", mb: 2, fontSize: { xs: 16, sm: 18, md: 20 } }}
//         >
//           Built for Food & Beverage Brands. Powered by{" "}
//           <Box
//             component="a"
//             href="/"
//             sx={{
//               color: "#7ad03a",
//               fontWeight: "bold",
//               textDecoration: "none",
//               cursor: "pointer",
//               "&:hover": { color: "#ff9800" }
//             }}
//           >
//             MrFranchise.in
//           </Box>
//         </Typography>
//         <Typography sx={{ mb: 5, textAlign: "center", color: "#444", fontSize: { xs: 15, sm: 17, md: 18 } }}>
//           Our packages are designed to give brands maximum control over lead
//           quality, volume, and visibility — whether you want exclusive investor
//           enquiries, shared leads, or unlimited growth campaigns.
//         </Typography>

//         <Grid
//           container
//           spacing={{ xs: 4, sm: 6, md: 8 }}
//           justifyContent="center"
//         >
//           {/* Starter */}
//           <Grid
//             xs={12}
//             md={6}
//             sx={{
              
//               // ml: { md: "auto" },
//               // pr: { md: 8 },
//               // position: "relative",
//               display: "flex",
//              justifyContent:"center",
//                             marginBottom:5,

//             }}
//           >
//             <Box
//               sx={{
//                 display: { xs: "none", md: "block" },
//                 position: "absolute",
//                 right: -36,
//                 top: 24
//               }}
//             >
//               {/* <Box sx={stepCircle("#388e3c")}>🔰</Box> */}
//             </Box>
//             <Box sx={stepBox("#7ad03a", "#d8f6c4")}>
//               <Chip
//                 label="Starter"
//                 color="#2e7d32"
//                 sx={{
//                   background: "#388e3c",
//                   width:"90%",
//                   maxWidth:420,
//                   alignSelf: "center",
//                   color: "#fff",
//                   mb: 2,
                  
//                   fontWeight: 700,
//                   fontSize: 16
//                 }}
//               />
//               <Typography
//                 variant="h5"
//                 fontWeight="bold"
//                 sx={{ color: "#388e3c", mb: 1, letterSpacing: 1 }}
//               >
//                 Starter Visibility Plan
//               </Typography>
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   color: "#388e3c",
//                   mb: 2,
//                   fontSize: 20
//                 }}
//               >
//                 ₹15,000 / Month
//               </Typography>
//               <Divider sx={{ mb: 2, borderColor: "#1976d2", opacity: 0.3 }} />
//               <Typography sx={{ mb: 1, fontSize: 16 }}>
//                 <strong>Best for:</strong> Entry-level brands testing market demand
//               </Typography>
//               <Typography sx={{ mb: 1, fontSize: 16 }}>
//                 <strong>Lead Type:</strong> Shared Leads (non-exclusive)
//               </Typography>
//               <Box
//                 component="ul"
//                 sx={{
//                   pl: 3,
//                   color: "#444",
//                   mb: 2,
//                   fontSize: 15,
//                   wordBreak: "break-word"
//                 }}
//               >
//                 <li>Branded listing on fnb.MrFranchise.in</li>
//                 <li>Appear in "All F&B Brands" section</li>
//                 <li>Visible to all investor filters</li>
//                 <li>Shared investor leads (up to 15/month)</li>
//                 <li>Email/WhatsApp inclusion in 1 investor campaign</li>
//                 <li>CRM access for lead tracking</li>
//                 <li>Standard brand analytics report</li>
//               </Box>
//               <Box sx={{ flexGrow: 1 }} />
//               {/* <Button
//                 variant="contained"
//                 color="success"
//                 size="large"
//                 sx={{
//                   mt: 2,
//                   borderRadius: 8,
//                   fontWeight: 700,
//                   px: 4,
//                   alignSelf: { xs: "center", md: "flex-start" }
//                 }}
//                 href="https://fnb.mrfranchise.in/advertise"
//                 target="_blank"
//               >
//                 Get Started
//               </Button> */}
//             </Box>
//           </Grid>
//           {/* Growth */}
//           <Grid
//             item
//             xs={12}
//             md={6}
//             sx={{
//               mr: { md: "auto" },
//               pl: { md: 8 },
//               position: "relative",
//               display: "flex",
//                                           marginBottom:5,

//             }}
//           >
//             <Box
//               sx={{
//                 display: { xs: "none", md: "block" },
//                 position: "absolute",
//                 left: -36,
//                 top: 24
//               }}
//             >
//               {/* <Box sx={stepCircle("#ff9800")}>🟠</Box> */}
//             </Box>
//             <Box sx={stepBox("#ff9800", "#fffde7")}>
//               <Chip
//                 label="Growth"
//                 sx={{
//                   mb: 2,
//                   background: "#ff9800",
//                   color: "#fff",
//                   fontWeight: 700,
//                    width:"90%",
//                    maxWidth:420,
//                   alignSelf: "center",
//                   fontSize: 16
//                 }}
//               />
//               <Typography
//                 variant="h5"
//                 fontWeight="bold"
//                 sx={{ color: "#ff9800", mb: 1, letterSpacing: 1 }}
//               >
//                 Growth Lead Plan
//               </Typography>
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   color: "#ff9800",
//                   mb: 2,
//                   fontSize: 20
//                 }}
//               >
//                 ₹35,000 / Month
//               </Typography>
//               <Divider sx={{ mb: 2, borderColor: "#ff9800", opacity: 0.3 }} />
//               <Typography sx={{ mb: 1, fontSize: 16 }}>
//                 <strong>Best for:</strong> Active growth-stage brands with a proven model
//               </Typography>
//               <Typography sx={{ mb: 1, fontSize: 16 }}>
//                 <strong>Lead Type:</strong> Priority Shared Leads <br />(rotated among 2–4 advertisers)
//               </Typography>
//               <Box
//                 component="ul"
//                 sx={{
//                   pl: 3,
//                   color: "#444",
//                   mb: 2,
//                   fontSize: 15,
//                   wordBreak: "break-word"
//                 }}
//               >
//                 <li>
//                   Priority visibility in category-based searches <br />(e.g., Café, QSR)
//                 </li>
//                 <li>
//                   Dedicated brand page with video, gallery, and <br />pitch deck
//                 </li>
//                 <li>
//                   Up to 30+ leads/month from <br />shared investor pool
//                 </li>
//                 <li>WhatsApp Broadcast Inclusion – 2 campaigns</li>
//                 <li>Brand featured in email newsletters</li>
//                 <li>Investor follow-up support (semi-automated)</li>
//                 <li>CRM & lead tracking dashboard</li>
//               </Box>
//               <Box sx={{ flexGrow: 1 }} />
//               {/* <Button
//                 variant="contained"
//                 color="warning"
//                 size="large"
//                 sx={{
//                   mt: 2,
//                   borderRadius: 8,
//                   fontWeight: 700,
//                   px: 4,
//                   alignSelf: { xs: "center", md: "flex-end" }
//                 }}
//                 href="https://fnb.mrfranchise.in/advertise"
//                 target="_blank"
//               >
//                 Grow Now
//               </Button> */}
//             </Box>
//           </Grid>
//           {/* Premium */}
//           <Grid
//             item
//             xs={12}
//             md={6}
//             sx={{
//               ml: { md: "auto" },
//               pr: { md: 8 },
//               position: "relative",
//               display: "flex",
//                                           marginBottom:5,

//             }}
//           >
//             <Box
//               sx={{
//                 display: { xs: "none", md: "block" },
//                 position: "absolute",
//                 right: -36,
//                 top: 24
//               }}
//             >
//               {/* <Box sx={stepCircle("#f57c00")}>🔶</Box> */}
//             </Box>
//             <Box sx={stepBox("#f57c00", "#fff3e0")}>
//               <Chip
//                 label="Premium"
//                 sx={{
//                   mb: 2,
//                   background: "#f57c00",
//                   color: "#fff",
//                   fontWeight: 700,
//                    width:"90%",
//                    maxWidth:420,
//                   alignSelf: "center",
//                   fontSize: 16
//                 }}
//               />
//               <Typography
//                 variant="h5"
//                 fontWeight="bold"
//                 sx={{ color: "#f57c00", mb: 1, letterSpacing: 1 }}
//               >
//                 Premium Visibility + Lead Share
//               </Typography>
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   color: "#f57c00",
//                   mb: 2,
//                   fontSize: 20
//                 }}
//               >
//                 ₹60,000 / Month
//               </Typography>
//               <Divider sx={{ mb: 2, borderColor: "#f57c00", opacity: 0.3 }} />
//               <Typography sx={{ mb: 1, fontSize: 16 }}>
//                 <strong>Best for:</strong> Established brands looking for scale <br />+ smart visibility
//               </Typography>
//               <Typography sx={{ mb: 1, fontSize: 16 }}>
//                 <strong>Lead Type:</strong> All Leads in Category (Shared)
//               </Typography>
//               <Box
//                 component="ul"
//                 sx={{
//                   pl: 3,
//                   color: "#444",
//                   mb: 2,
//                   fontSize: 15,
//                   wordBreak: "break-word"
//                 }}
//               >
//                 <li>
//                   Featured Brand Spotlight on homepage <br />+ “Top Brands” carousel
//                 </li>
//                 <li>
//                   Listed in 2+ investor segments <br />(e.g., ₹10–20L & ₹20–50L)
//                 </li>
//                 <li>Brand priority in shared lead distribution</li>
//                 <li>
//                   Unlimited shared leads <br />(all investor applications in category)
//                 </li>
//                 <li>2 WhatsApp + 2 Meta Ad Campaigns</li>
//                 <li>Brand Boost email blast to 10,000+ subscribers</li>
//                 <li>Dedicated success manager</li>
//               </Box>
//               <Box sx={{ flexGrow: 1 }} />
//               {/* <Button
//                 variant="contained"
//                 size="large"
//                 sx={{
//                   mt: 2,
//                   borderRadius: 8,
//                   fontWeight: 700,
//                   px: 4,
//                   background: "#f57c00",
//                   alignSelf: { xs: "center", md: "flex-start" }
//                 }}
//                 href="https://fnb.mrfranchise.in/advertise"
//                 target="_blank"
//               >
//                 Go Premium
//               </Button> */}
//             </Box>
//           </Grid>
//           {/* Exclusive */}
//           <Grid
//             item
//             xs={12}
//             md={6}
//             sx={{
//               mr: { md: "auto" },
//               pl: { md: 8 },
//               position: "relative",
//               display: "flex",
//                                           marginBottom:5,

//             }}
//           >
//             <Box
//               sx={{
//                 display: { xs: "none", md: "block" },
//                 position: "absolute",
//                 left: -36,
//                 top: 24
//               }}
//             >
//               {/* <Box sx={stepCircle("#388e3c")}>🟢</Box> */}
//             </Box>
//             <Box sx={stepBox("#7ad03a", "#d8f6c4")}>
//               <Chip
//                 label="Exclusive"
//                 sx={{
//                   mb: 2,
//                   background: "#388e3c",
//                   color: "#fff",
//                   fontWeight: 700,
//                    width:"90%",
//                    maxWidth: 420,
//                   alignSelf: "center",
//                   fontSize: 16
//                 }}
//               />
//               <Typography
//                 variant="h5"
//                 fontWeight="bold"
//                 sx={{ color: "#388e3c", mb: 1, letterSpacing: 1 }}
//               >
//                 Exclusive Lead Partner
//               </Typography>
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   color: "#388e3c",
//                   mb: 2,
//                   fontSize: 20
//                 }}
//               >
//                 ₹1,20,000 / Month
//               </Typography>
//               <Divider sx={{ mb: 2, borderColor: "#388e3c", opacity: 0.3 }} />
//               <Typography sx={{ mb: 1, fontSize: 16 }}>
//                 <strong>Best for:</strong> High-ticket F&B brands seeking exclusive<br/> investor targeting
//               </Typography>
//               <Typography sx={{ mb: 1, fontSize: 16 }}>
//                 <strong>Lead Type:</strong> Exclusive Leads Only <br />(no other brand receives these)
//               </Typography>
//               <Box
//                 component="ul"
//                 sx={{
//                   pl: 3,
//                   color: "#444",
//                   mb: 2,
//                   fontSize: 15,
//                   wordBreak: "break-word"
//                 }}
//               >
//                 <li>
//                   Exclusive visibility in targeted campaigns <br />(location + budget based)
//                 </li>
//                 <li>
//                   All investor leads from those campaigns routed only <br />to your brand
//                 </li>
//                 <li>
//                   Landing page + standalone lead funnel with ad <br />optimization
//                 </li>
//                 <li>
//                   4 WhatsApp Campaigns + Dedicated Meta & <br />Google Ad Campaign
//                 </li>
//                 <li>
//                   Investor qualification support (via <br />phone/WhatsApp team)
//                 </li>
//                 <li>Custom reports + weekly lead summary</li>
//                 <li>Monthly strategy session with senior consultant</li>
//               </Box>
//               <Box sx={{ flexGrow: 1 }} />
//               {/* <Button
//                 variant="contained"
//                 color="success"
//                 size="large"
//                 sx={{
//                   mt: 2,
//                   borderRadius: 8,
//                   fontWeight: 700,
//                   px: 4,
//                   alignSelf: { xs: "center", md: "flex-end" }
//                 }}
//                 href="https://fnb.mrfranchise.in/advertise"
//                 target="_blank"
//               >
//                 Go Exclusive
//               </Button> */}
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default FranchisePromotion;