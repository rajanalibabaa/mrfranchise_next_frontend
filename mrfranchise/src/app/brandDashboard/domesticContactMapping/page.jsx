

// "use client";

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import axios from "axios";
// import {
//   Box, Card, Typography, TextField, Button, CircularProgress,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Divider,
//   Alert, Snackbar,
// } from "@mui/material";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import CloseIcon from "@mui/icons-material/Close";
// import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
// import WhatsAppIcon from "@mui/icons-material/WhatsApp";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// const API = "http://localhost:5000/api/v1";

// const stateInputSx = {
//   "& .MuiInputBase-input": { fontSize: 13, fontWeight: 600, py: 0.8, px: 1 },
//   "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
// };

// const districtInputSx = {
//   "& .MuiInputBase-input": { fontSize: 12, fontWeight: 600, py: 0.6, px: 1 },
//   width: "100%",
// };

// const TYPE_CONFIG = {
//   email: {
//     label: "Email",
//     IconComp: EmailIcon,
//     iconColor: "#d38122",
//     sendApi: `${API}/otpverify/send-otp-email`,
//     verifyApi: `${API}/otpverify/verify-otp`,
//     bodyKey: "email",
//     hint: "Enter the 6-digit OTP sent to your email",
//   },
//   mobile: {
//     label: "Mobile Number",
//     IconComp: PhoneIcon,
//     iconColor: "#d38122",
//     sendApi: `${API}/`,
//     verifyApi: `${API}/otp/verify/mobile`,
//     bodyKey: "mobileNumber",
//     hint: "Enter the 6-digit OTP sent via SMS",
//   },
//   whatsapp: {
//     label: "WhatsApp",
//     IconComp: WhatsAppIcon,
//     iconColor: "#25D366",
//     sendApi: `${API}/otp/send/whatsapp`,
//     verifyApi: `${API}/otp/verify/whatsapp`,
//     bodyKey: "whatsappNumber",
//     hint: "Enter the 6-digit OTP sent via WhatsApp",
//   },
// };

// // ─────────────────────────────────────────────────────────────
// // OTP POPUP
// // ─────────────────────────────────────────────────────────────
// function OtpPopup({ open, onClose, type, value, context, brandOwnerId }) {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [sending, setSending] = useState(false);
//   const [verifying, setVerifying] = useState(false);
//   const [sent, setSent] = useState(false);
//   const [timer, setTimer] = useState(0);
//   const [otpToken, setOtpToken] = useState("");
//   const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
//   const inputRefs = useRef([]);
//   const autoSentRef = useRef(false);

//   const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.email;
//   const { IconComp } = cfg;
//   const contextLabel = context?.districtName
//     ? `${context.stateName} › ${context.districtName}`
//     : context?.stateName || "";

//   useEffect(() => {
//     if (open && !autoSentRef.current) {
//       autoSentRef.current = true;
//       sendOtp();
//     }
//     if (!open) {
//       autoSentRef.current = false;
//       setOtp(["", "", "", "", "", ""]);
//       setSent(false);
//       setSending(false);
//       setVerifying(false);
//       setTimer(0);
//       setOtpToken("");
//     }
//   }, [open, value, brandOwnerId]);

//   useEffect(() => {
//     if (timer <= 0) return;
//     const id = setInterval(() => setTimer((t) => t - 1), 1000);
//     return () => clearInterval(id);
//   }, [timer]);

//   useEffect(() => {
//     if (sent) setTimeout(() => inputRefs.current[0]?.focus(), 80);
//   }, [sent]);

//   const sendOtp = async () => {
//     if (!value) return;
//     try {
//       setSending(true);
//       const res = await axios.post(cfg.sendApi, {
//         brandOwnerId,
//         [cfg.bodyKey]: value,
//         state: context?.stateName || null,
//         district: context?.districtName || null,
//       });
//       if (res.data?.token) setOtpToken(res.data.token);
//       setSent(true);
//       setTimer(60);
//       setOtp(["", "", "", "", "", ""]);
//       setSnack({ open: true, msg: `OTP sent to ${value}`, severity: "success" });
//     } catch (err) {
//       const msg = err?.response?.data?.error || "Failed to send OTP.";
//       setSnack({ open: true, msg, severity: "error" });
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     const otpString = otp.join("");
//     if (otpString.length < 6) {
//       setSnack({ open: true, msg: "Please enter the complete 6-digit OTP.", severity: "warning" });
//       return;
//     }
//     if (!otpToken) {
//       setSnack({ open: true, msg: "Session expired. Please resend OTP.", severity: "error" });
//       return;
//     }

//     try {
//       setVerifying(true);
//       await axios.post(
//         cfg.verifyApi,
//         { identifier: value, otp: otpString, type },
//         { headers: { Authorization: `Bearer ${otpToken}` } }
//       );
//       setSnack({ open: true, msg: `${cfg.label} verified successfully!`, severity: "success" });
//       setTimeout(() => onClose(true), 900);
//     } catch (err) {
//       const msg = err?.response?.data?.error || "Invalid OTP.";
//       setSnack({ open: true, msg, severity: "error" });
//       setOtp(["", "", "", "", "", ""]);
//       inputRefs.current[0]?.focus();
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const handleOtpChange = (index, val) => {
//     if (!/^\d*$/.test(val)) return;
//     const updated = [...otp];
//     updated[index] = val.slice(-1);
//     setOtp(updated);
//     if (val && index < 5) inputRefs.current[index + 1]?.focus();
//   };

//   const handleOtpKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleOtpPaste = (e) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
//     if (!pasted) return;
//     const updated = pasted.split("").concat(Array(6 - pasted.length).fill(""));
//     setOtp(updated);
//     inputRefs.current[Math.min(pasted.length, 5)]?.focus();
//   };

//   return (
//     <>
//       <Dialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
//         <DialogTitle
//           sx={{
//             background: "linear-gradient(135deg, #d38122 0%, #e8a44a 100%)",
//             color: "#fff",
//             borderRadius: "12px 12px 0 0",
//             display: "flex",
//             alignItems: "center",
//             gap: 1.5,
//             py: 1.8,
//             pr: 6,
//           }}
//         >
//           <IconComp sx={{ color: "#fff", fontSize: 22 }} />
//           <Box>
//             <Typography fontWeight={700} fontSize={15}>Verify {cfg.label}</Typography>
//             {contextLabel && <Typography fontSize={11} sx={{ opacity: 0.85, mt: 0.3 }}>{contextLabel}</Typography>}
//           </Box>
//           <IconButton onClick={() => onClose(false)} size="small" sx={{ position: "absolute", right: 10, top: 10, color: "#fff" }}>
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent sx={{ pt: 2.5, pb: 1 }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
//             <IconComp sx={{ color: cfg.iconColor, fontSize: 18 }} />
//             <Typography fontSize={13} fontWeight={600} sx={{ wordBreak: "break-all" }}>{value}</Typography>
//           </Box>

//           {sending && !sent ? (
//             <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, py: 3 }}>
//               <CircularProgress size={20} sx={{ color: "#d38122" }} />
//               <Typography fontSize={13} color="text.secondary">Sending OTP…</Typography>
//             </Box>
//           ) : (
//             <>
//               <Typography fontSize={12} color="text.secondary" mb={1.5} textAlign="center">
//                 {cfg.hint}
//               </Typography>

//               <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 2 }} onPaste={handleOtpPaste}>
//                 {otp.map((digit, i) => (
//                   <TextField
//                     key={i}
//                     inputRef={(el) => (inputRefs.current[i] = el)}
//                     value={digit}
//                     onChange={(e) => handleOtpChange(i, e.target.value)}
//                     onKeyDown={(e) => handleOtpKeyDown(i, e)}
//                     inputProps={{
//                       maxLength: 1,
//                       style: { textAlign: "center", fontSize: 22, fontWeight: 700, padding: "10px 0", width: 36 },
//                     }}
//                     sx={{
//                       width: 46,
//                       "& .MuiOutlinedInput-root": {
//                         borderRadius: 2,
//                         "& fieldset": { borderColor: digit ? "#d38122" : "#ccc", borderWidth: digit ? 2 : 1 },
//                         "&:hover fieldset": { borderColor: "#d38122" },
//                         "&.Mui-focused fieldset": { borderColor: "#d38122", borderWidth: 2 },
//                       },
//                     }}
//                   />
//                 ))}
//               </Box>

//               <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
//                 {timer > 0 ? (
//                   <Typography fontSize={12} color="text.secondary">
//                     Resend OTP in <strong>{timer}s</strong>
//                   </Typography>
//                 ) : (
//                   <Button size="small" onClick={sendOtp} disabled={sending} sx={{ textTransform: "none", fontSize: 12, color: "#d38122", fontWeight: 600 }}>
//                     {sending ? "Sending…" : "Resend OTP"}
//                   </Button>
//                 )}
//               </Box>
//             </>
//           )}
//         </DialogContent>

//         <Divider />
//         <DialogActions sx={{ px: 2.5, py: 1.5, gap: 1 }}>
//           <Button variant="outlined" onClick={() => onClose(false)} sx={{ textTransform: "none", borderRadius: 2 }}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             disabled={!sent || verifying || otp.join("").length < 6}
//             onClick={handleVerifyOtp}
//             sx={{
//               textTransform: "none",
//               fontWeight: 700,
//               borderRadius: 2,
//               backgroundColor: "#2e7d32",
//               "&:hover": { backgroundColor: "#1b5e20" },
//             }}
//           >
//             {verifying ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Verify OTP"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
//         <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
//           {snack.msg}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // VERIFIED BUTTON
// // ─────────────────────────────────────────────────────────────
// const VerifiedButton = React.memo(({ small = false }) => (
//   <Button
//     variant="outlined"
//     size="small"
//     disabled
//     startIcon={<CheckCircleIcon sx={{ fontSize: small ? "11px !important" : "14px !important" }} />}
//     sx={{
//       whiteSpace: "nowrap",
//       fontSize: small ? 10 : 11,
//       px: small ? 0.8 : 1.2,
//       py: small ? 0.3 : undefined,
//       backgroundColor: "#e8f5e9 !important",
//       color: "#2e7d32 !important",
//       borderColor: "#a5d6a7 !important",
//     }}
//   >
//     Verified
//   </Button>
// ));

// // ─────────────────────────────────────────────────────────────
// // STATE FIELD COMPONENT (Memoized)
// // ─────────────────────────────────────────────────────────────
// const StateField = React.memo(({ label, stateName, field, type, value, verified, onChange, onVerify }) => (
//   <>
//     <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.4 }}>
//       {label}
//     </Typography>
//     <Box sx={{ display: "flex", gap: 1, mb: 1.2 }}>
//       <TextField
//         size="small"
//         fullWidth
//         value={value}
//         disabled={verified}
//         type={type === "email" ? "email" : "tel"}
//         onChange={onChange}
//         sx={{
//           ...stateInputSx,
//           ...(verified && {
//             "& .MuiOutlinedInput-root": { backgroundColor: "#f1f8f1", "& fieldset": { borderColor: "#a5d6a7" } },
//           }),
//         }}
//       />
//       {verified ? (
//         <VerifiedButton />
//       ) : (
//         <Button
//           variant="contained"
//           size="small"
//           onClick={onVerify}
//           sx={{ whiteSpace: "nowrap", fontSize: 11, px: 1.5, backgroundColor: "#d38122" }}
//         >
//           Verify
//         </Button>
//       )}
//     </Box>
//   </>
// ));

// // ─────────────────────────────────────────────────────────────
// // DISTRICT INPUT CELL (Memoized)
// // ─────────────────────────────────────────────────────────────
// const InputVerifyCell = React.memo(({ value, verified, onChange, onVerify }) => (
//   <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
//     <TextField
//       size="small"
//       value={value}
//       disabled={verified}
//       type="tel"
//       onChange={onChange}
//       sx={{
//         ...districtInputSx,
//         ...(verified && {
//           "& .MuiOutlinedInput-root": { backgroundColor: "#f1f8f1", "& fieldset": { borderColor: "#a5d6a7" } },
//         }),
//       }}
//     />
//     {verified ? (
//       <VerifiedButton small />
//     ) : (
//       <Button
//         variant="contained"
//         size="small"
//         onClick={onVerify}
//         sx={{ fontSize: 10, py: 0.3, px: 1, backgroundColor: "#d38122" }}
//       >
//         Verify
//       </Button>
//     )}
//   </Box>
// ));

// // ─────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────
// export default function BrandContactMapping({ brandOwnerId }) {
//   const [states, setStates] = useState([]);
//   const [stateContactMap, setStateContactMap] = useState({});
//   const [districtsMap, setDistrictsMap] = useState({});
//   const [selectedState, setSelectedState] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [districtLoading, setDistrictLoading] = useState(false);
//   const [verifiedMap, setVerifiedMap] = useState({});

//   const [otpPopup, setOtpPopup] = useState({
//     open: false,
//     type: "email",
//     value: "",
//     context: {},
//     verifiedKey: "",
//   });

//   useEffect(() => {
//     if (brandOwnerId) fetchStates();
//   }, [brandOwnerId]);

//   const fetchStates = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API}/domestic-contact-mapping-states/${brandOwnerId}`);
//       const statesData = res.data?.data?.states || [];
//       const initialContacts = {};
//       statesData.forEach((s) => {
//         initialContacts[s.state] = {
//           email: s.email || "",
//           mobileNumber: s.mobileNumber || "",
//           whatsappNumber: s.whatsappNumber || "",
//         };
//       });
//       setStates(statesData);
//       setStateContactMap(initialContacts);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearVerified = useCallback((key) => {
//     setVerifiedMap((p) => ({ ...p, [key]: false }));
//   }, []);

//   const markVerified = useCallback((key) => {
//     setVerifiedMap((p) => ({ ...p, [key]: true }));
//   }, []);

//   const isVerified = useCallback((key) => !!verifiedMap[key], [verifiedMap]);

//   const stateKey = (sn, type) => `${sn}|${type}`;
//   const districtKey = (sn, dn, type) => `${sn}|${dn}|${type}`;

//   const updateStateField = useCallback((stateName, field, val) => {
//     setStateContactMap((prev) => ({
//       ...prev,
//       [stateName]: { ...prev[stateName], [field]: val },
//     }));
//     const typeMap = { email: "email", mobileNumber: "mobile", whatsappNumber: "whatsapp" };
//     clearVerified(stateKey(stateName, typeMap[field]));
//   }, [clearVerified]);

//   const updateDistrictField = useCallback((stateName, districtIndex, districtName, field, val) => {
//     setDistrictsMap((prev) => ({
//       ...prev,
//       [stateName]: prev[stateName]?.map((d, i) =>
//         i === districtIndex ? { ...d, [field]: val } : d
//       ) || [],
//     }));
//     const type = field === "email" ? "email" : field === "mobileNumber" ? "mobile" : "whatsapp";
//     clearVerified(districtKey(stateName, districtName, type));
//   }, [clearVerified]);

//   const openStateVerify = useCallback((type, stateName) => {
//     const contact = stateContactMap[stateName] || {};
//     const valueMap = { email: contact.email, mobile: contact.mobileNumber, whatsapp: contact.whatsappNumber };
//     setOtpPopup({
//       open: true,
//       type,
//       value: valueMap[type] || "",
//       context: { stateName },
//       verifiedKey: stateKey(stateName, type),
//     });
//   }, [stateContactMap]);

//   const openDistrictVerify = useCallback((type, stateName, district) => {
//     const valueMap = { email: district.email, mobile: district.mobileNumber, whatsapp: district.whatsappNumber };
//     setOtpPopup({
//       open: true,
//       type,
//       value: valueMap[type] || "",
//       context: { stateName, districtName: district.district },
//       verifiedKey: districtKey(stateName, district.district, type),
//     });
//   }, []);

//   const closeOtpPopup = useCallback((verified) => {
//     if (verified && otpPopup.verifiedKey) markVerified(otpPopup.verifiedKey);
//     setOtpPopup((p) => ({ ...p, open: false }));
//   }, [otpPopup.verifiedKey, markVerified]);

//   const fetchDistricts = async (stateName) => {
//     setSelectedState(stateName);
//     if (districtsMap[stateName]) return;
//     try {
//       setDistrictLoading(true);
//       const res = await axios.get(`${API}/domestic-contact-mapping/districts/${brandOwnerId}/${encodeURIComponent(stateName)}`);
//       setDistrictsMap((prev) => ({ ...prev, [stateName]: res.data?.data?.districts || [] }));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setDistrictLoading(false);
//     }
//   };

//   if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><CircularProgress /></Box>;

//   return (
//     <Box sx={{ display: "flex", gap: 2, p: 2, height: "90vh" }}>
//       {/* States Sidebar */}
//       <Card sx={{ width: 310, overflowY: "auto", flexShrink: 0 }}>
//         <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
//           <Typography fontWeight={700} fontSize={15}>States</Typography>
//         </Box>

//         {states.map((stateItem) => {
//           const stateName = stateItem.state;
//           const isSelected = selectedState === stateName;
//           const contact = stateContactMap[stateName] || {};

//           return (
//             <Box key={stateName} sx={{ borderBottom: "1px solid #eee", backgroundColor: isSelected ? "#f0f4ff" : "#fff", p: 2 }}>
//               <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
//                 <Box>
//                   <Typography fontWeight={700} color="#f61804" fontSize={14}>{stateName}</Typography>
//                   <Typography variant="caption" color="text.secondary">Districts: {stateItem.districtCount}</Typography>
//                 </Box>
//                 <Button
//                   variant={isSelected ? "contained" : "outlined"}
//                   size="small"
//                   onClick={() => fetchDistricts(stateName)}
//                   sx={{ minWidth: 36, px: 1 }}
//                 >
//                   Districts <ArrowForwardIosIcon sx={{ fontSize: 12, ml: 0.5 }} />
//                 </Button>
//               </Box>

//               <StateField
//                 label="Email"
//                 stateName={stateName}
//                 field="email"
//                 type="email"
//                 value={contact.email || ""}
//                 verified={isVerified(stateKey(stateName, "email"))}
//                 onChange={(e) => updateStateField(stateName, "email", e.target.value)}
//                 onVerify={() => openStateVerify("email", stateName)}
//               />

//               <StateField
//                 label="Mobile Number"
//                 stateName={stateName}
//                 field="mobileNumber"
//                 type="mobile"
//                 value={contact.mobileNumber || ""}
//                 verified={isVerified(stateKey(stateName, "mobile"))}
//                 onChange={(e) => updateStateField(stateName, "mobileNumber", e.target.value)}
//                 onVerify={() => openStateVerify("mobile", stateName)}
//               />

//               <StateField
//                 label="WhatsApp Number"
//                 stateName={stateName}
//                 field="whatsappNumber"
//                 type="whatsapp"
//                 value={contact.whatsappNumber || ""}
//                 verified={isVerified(stateKey(stateName, "whatsapp"))}
//                 onChange={(e) => updateStateField(stateName, "whatsappNumber", e.target.value)}
//                 onVerify={() => openStateVerify("whatsapp", stateName)}
//               />

//               <Button variant="contained" color="success" size="small" fullWidth sx={{ mt: 1 }} onClick={() => alert(`${stateName} Updated Successfully`)}>
//                 Save
//               </Button>
//             </Box>
//           );
//         })}
//       </Card>

//       {/* Districts Table */}
//       <Card sx={{ flex: 1, p: 2, overflowY: "auto" }}>
//         {!selectedState ? (
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
//             <Typography color="text.secondary">← Select a state to view districts</Typography>
//           </Box>
//         ) : (
//           <>
//             <Typography variant="h6" fontWeight={700} mb={2}>{selectedState} — Districts</Typography>

//             {districtLoading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><CircularProgress /></Box>
//             ) : (
//               <TableContainer component={Paper} variant="outlined">
//                 <Table size="small" sx={{ tableLayout: "fixed" }}>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                       <TableCell sx={{ width: "14%", fontWeight: 700, fontSize: 12 }}>District</TableCell>
//                       <TableCell sx={{ width: "24%", fontWeight: 700, fontSize: 12 }}>Email</TableCell>
//                       <TableCell sx={{ width: "20%", fontWeight: 700, fontSize: 12 }}>Mobile</TableCell>
//                       <TableCell sx={{ width: "20%", fontWeight: 700, fontSize: 12 }}>WhatsApp</TableCell>
//                       <TableCell sx={{ width: "10%", textAlign: "center", fontWeight: 700, fontSize: 12 }}>Action</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {(districtsMap[selectedState] || []).map((district, index) => (
//                       <TableRow key={district.district} sx={{ "&:hover": { backgroundColor: "#fafafa" } }}>
//                         <TableCell sx={{ fontWeight: 600, fontSize: 12,color:"#f61804" }}>{district.district}</TableCell>
//                         <TableCell>
//                           <InputVerifyCell
//                             value={district.email || ""}
//                             verified={isVerified(districtKey(selectedState, district.district, "email"))}
//                             onChange={(e) => updateDistrictField(selectedState, index, district.district, "email", e.target.value)}
//                             onVerify={() => openDistrictVerify("email", selectedState, district)}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <InputVerifyCell
//                             value={district.mobileNumber || ""}
//                             verified={isVerified(districtKey(selectedState, district.district, "mobile"))}
//                             onChange={(e) => updateDistrictField(selectedState, index, district.district, "mobileNumber", e.target.value)}
//                             onVerify={() => openDistrictVerify("mobile", selectedState, district)}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <InputVerifyCell
//                             value={district.whatsappNumber || ""}
//                             verified={isVerified(districtKey(selectedState, district.district, "whatsapp"))}
//                             onChange={(e) => updateDistrictField(selectedState, index, district.district, "whatsappNumber", e.target.value)}
//                             onVerify={() => openDistrictVerify("whatsapp", selectedState, district)}
//                           />
//                         </TableCell>
//                         <TableCell sx={{ textAlign: "center" }}>
//                           <Button variant="contained" color="success" size="small" onClick={() => alert(`${district.district} Updated Successfully`)}>
//                             Save
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </>
//         )}
//       </Card>

//       <OtpPopup
//         open={otpPopup.open}
//         onClose={closeOtpPopup}
//         type={otpPopup.type}
//         value={otpPopup.value}
//         context={otpPopup.context}
//         brandOwnerId={brandOwnerId}
//       />
//     </Box>
//   );
// }


"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  Box, Card, Typography, TextField, Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Divider,
  Alert, Snackbar, Accordion, AccordionSummary, AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const API = "http://localhost:5000/api/v1";

// Anchor for centered snackbars (top-center of the screen)
const centerSnackAnchor = { vertical: "top", horizontal: "center" };

const stateInputSx = {
  "& .MuiInputBase-input": { fontSize: 13, fontWeight: 600, py: 0.8, px: 1 },
  "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
};

const districtInputSx = {
  "& .MuiInputBase-input": { fontSize: 12, fontWeight: 600, py: 0.6, px: 1 },
  width: "100%",
};

const TYPE_CONFIG = {
  email: {
    label: "Email",
    IconComp: EmailIcon,
    iconColor: "#d38122",
    sendApi: `${API}/otpverify/send-otp-email`,
    verifyApi: `${API}/otpverify/verify-otp`,
    bodyKey: "email",
    hint: "Enter the 6-digit OTP sent to your email",
  },
  mobile: {
    label: "Mobile Number",
    IconComp: PhoneIcon,
    iconColor: "#d38122",
    sendApi: `${API}/`,
    verifyApi: `${API}/otp/verify/mobile`,
    bodyKey: "mobileNumber",
    hint: "Enter the 6-digit OTP sent via SMS",
  },
  whatsapp: {
    label: "WhatsApp",
    IconComp: WhatsAppIcon,
    iconColor: "#25D366",
    sendApi: `${API}/otp/send/whatsapp`,
    verifyApi: `${API}/otp/verify/whatsapp`,
    bodyKey: "whatsappNumber",
    hint: "Enter the 6-digit OTP sent via WhatsApp",
  },
};

// Maps a "type" key (email/mobile/whatsapp) to the actual field name
// used in the contact objects / API payloads.
const FIELD_BY_TYPE = {
  email: "email",
  mobile: "mobileNumber",
  whatsapp: "whatsappNumber",
};

// ─────────────────────────────────────────────────────────────
// OTP POPUP
// ─────────────────────────────────────────────────────────────
function OtpPopup({ open, onClose, type, value, context, brandOwnerId }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [otpToken, setOtpToken] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
  const inputRefs = useRef([]);
  const autoSentRef = useRef(false);

  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.email;
  const { IconComp } = cfg;
  const contextLabel = context?.districtName
    ? `${context.stateName} › ${context.districtName}`
    : context?.stateName || "";

  useEffect(() => {
    if (open && !autoSentRef.current) {
      autoSentRef.current = true;
      sendOtp();
    }
    if (!open) {
      autoSentRef.current = false;
      setOtp(["", "", "", "", "", ""]);
      setSent(false);
      setSending(false);
      setVerifying(false);
      setTimer(0);
      setOtpToken("");
    }
  }, [open, value, brandOwnerId]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  useEffect(() => {
    if (sent) setTimeout(() => inputRefs.current[0]?.focus(), 80);
  }, [sent]);

  const sendOtp = async () => {
    if (!value) return;
    try {
      setSending(true);
      const res = await axios.post(cfg.sendApi, {
        brandOwnerId,
        [cfg.bodyKey]: value,
        state: context?.stateName || null,
        district: context?.districtName || null,
      });
      if (res.data?.token) setOtpToken(res.data.token);
      setSent(true);
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      setSnack({ open: true, msg: `OTP sent to ${value}`, severity: "success" });
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to send OTP.";
      setSnack({ open: true, msg, severity: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setSnack({ open: true, msg: "Please enter the complete 6-digit OTP.", severity: "warning" });
      return;
    }
    if (!otpToken) {
      setSnack({ open: true, msg: "Session expired. Please resend OTP.", severity: "error" });
      return;
    }

    try {
      setVerifying(true);
      await axios.post(
        cfg.verifyApi,
        { identifier: value, otp: otpString, type },
        { headers: { Authorization: `Bearer ${otpToken}` } }
      );
      setSnack({ open: true, msg: `${cfg.label} verified successfully!`, severity: "success" });
      setTimeout(() => onClose(true), 900);
    } catch (err) {
      const msg = err?.response?.data?.error || "Invalid OTP.";
      setSnack({ open: true, msg, severity: "error" });
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleOtpChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[index] = val.slice(-1);
    setOtp(updated);
    if (val && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const updated = pasted.split("").concat(Array(6 - pasted.length).fill(""));
    setOtp(updated);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #d38122 0%, #e8a44a 100%)",
            color: "#fff",
            borderRadius: "12px 12px 0 0",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 1.8,
            pr: 6,
          }}
        >
          <IconComp sx={{ color: "#fff", fontSize: 22 }} />
          <Box>
            <Typography fontWeight={700} fontSize={15}>Verify {cfg.label}</Typography>
            {contextLabel && <Typography fontSize={11} sx={{ opacity: 0.85, mt: 0.3 }}>{contextLabel}</Typography>}
          </Box>
          <IconButton onClick={() => onClose(false)} size="small" sx={{ position: "absolute", right: 10, top: 10, color: "#fff" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2.5, pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
            <IconComp sx={{ color: cfg.iconColor, fontSize: 18 }} />
            <Typography fontSize={13} fontWeight={600} sx={{ wordBreak: "break-all" }}>{value}</Typography>
          </Box>

          {sending && !sent ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, py: 3 }}>
              <CircularProgress size={20} sx={{ color: "#d38122" }} />
              <Typography fontSize={13} color="text.secondary">Sending OTP…</Typography>
            </Box>
          ) : (
            <>
              <Typography fontSize={12} color="text.secondary" mb={1.5} textAlign="center">
                {cfg.hint}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 2 }} onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <TextField
                    key={i}
                    inputRef={(el) => (inputRefs.current[i] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center", fontSize: 22, fontWeight: 700, padding: "10px 0", width: 36 },
                    }}
                    sx={{
                      width: 46,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "& fieldset": { borderColor: digit ? "#d38122" : "#ccc", borderWidth: digit ? 2 : 1 },
                        "&:hover fieldset": { borderColor: "#d38122" },
                        "&.Mui-focused fieldset": { borderColor: "#d38122", borderWidth: 2 },
                      },
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                {timer > 0 ? (
                  <Typography fontSize={12} color="text.secondary">
                    Resend OTP in <strong>{timer}s</strong>
                  </Typography>
                ) : (
                  <Button size="small" onClick={sendOtp} disabled={sending} sx={{ textTransform: "none", fontSize: 12, color: "#d38122", fontWeight: 600 }}>
                    {sending ? "Sending…" : "Resend OTP"}
                  </Button>
                )}
              </Box>
            </>
          )}
        </DialogContent>

        <Divider />
        <DialogActions sx={{ px: 2.5, py: 1.5, gap: 1 }}>
          <Button variant="outlined" onClick={() => onClose(false)} sx={{ textTransform: "none", borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!sent || verifying || otp.join("").length < 6}
            onClick={handleVerifyOtp}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              backgroundColor: "#2e7d32",
              "&:hover": { backgroundColor: "#1b5e20" },
            }}
          >
            {verifying ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Verify OTP"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        anchorOrigin={centerSnackAnchor}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// VERIFIED BUTTON
// ─────────────────────────────────────────────────────────────
const VerifiedButton = React.memo(({ small = false }) => (
  <Button
    variant="outlined"
    size="small"
    disabled
    startIcon={<CheckCircleIcon sx={{ fontSize: small ? "11px !important" : "14px !important" }} />}
    sx={{
      whiteSpace: "nowrap",
      fontSize: small ? 10 : 11,
      px: small ? 0.8 : 1.2,
      py: small ? 0.3 : undefined,
      backgroundColor: "#e8f5e9 !important",
      color: "#2e7d32 !important",
      borderColor: "#a5d6a7 !important",
    }}
  >
    Verified
  </Button>
));

// ─────────────────────────────────────────────────────────────
// STATE FIELD COMPONENT (Memoized)
// ─────────────────────────────────────────────────────────────
const StateField = React.memo(({ label, type, value, verified, onChange, onVerify }) => (
  <>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.4 }}>
      {label}
    </Typography>
    <Box sx={{ display: "flex", gap: 1, mb: 1.2 }}>
      <TextField
        size="small"
        fullWidth
        value={value}
        disabled={verified}
        type={type === "email" ? "email" : "tel"}
        onChange={onChange}
        sx={{
          ...stateInputSx,
          ...(verified && {
            "& .MuiOutlinedInput-root": { backgroundColor: "#f1f8f1", "& fieldset": { borderColor: "#a5d6a7" } },
          }),
        }}
      />
      {verified ? (
        <VerifiedButton />
      ) : (
        <Button
          variant="contained"
          size="small"
          onClick={onVerify}
          sx={{ whiteSpace: "nowrap", fontSize: 11, px: 1.5, backgroundColor: "#d38122" }}
        >
          Verify
        </Button>
      )}
    </Box>
  </>
));

// ─────────────────────────────────────────────────────────────
// DISTRICT INPUT CELL (Memoized)
// ─────────────────────────────────────────────────────────────
const InputVerifyCell = React.memo(({ value, verified, onChange, onVerify }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
    <TextField
      size="small"
      value={value}
      disabled={verified}
      type="tel"
      onChange={onChange}
      sx={{
        ...districtInputSx,
        ...(verified && {
          "& .MuiOutlinedInput-root": { backgroundColor: "#f1f8f1", "& fieldset": { borderColor: "#a5d6a7" } },
        }),
      }}
    />
    {verified ? (
      <VerifiedButton small />
    ) : (
      <Button
        variant="contained"
        size="small"
        onClick={onVerify}
        sx={{ fontSize: 10, py: 0.3, px: 1, backgroundColor: "#d38122" }}
      >
        Verify
      </Button>
    )}
  </Box>
));

// ─────────────────────────────────────────────────────────────
// STATES ACCORDION LIST (Memoized)
// ─────────────────────────────────────────────────────────────
const StatesAccordionList = React.memo(function StatesAccordionList({
  states,
  selectedState,
  stateContactMap,
  isVerified,
  stateKey,
  updateStateField,
  openStateVerify,
  handleAccordionChange,
  onSaveState,
  savingMap,
}) {
  return (
    <Card sx={{ width: 340, overflowY: "auto", flexShrink: 0 }}>
      <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
        <Typography fontWeight={700} fontSize={15}>States</Typography>
      </Box>

      {states.map((stateItem) => {
        const stateName = stateItem.state;
        const isExpanded = selectedState === stateName;
        const contact = stateContactMap[stateName] || {};
        const isSaving = !!savingMap[`state|${stateName}`];

        return (
          <Accordion
            key={stateName}
            expanded={isExpanded}
            onChange={handleAccordionChange(stateName)}
            disableGutters
            elevation={0}
            TransitionProps={{ unmountOnExit: true, timeout: 200 }}
            sx={{
              "&:before": { display: "none" },
              borderBottom: "1px solid #eee",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: isExpanded ? "#f0f4ff" : "#fff",
                "& .MuiAccordionSummary-content": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              }}
            >
              <Typography fontWeight={700} color="#f61804" fontSize={14}>{stateName}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                Districts: {stateItem.districtCount}
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 2, pt: 0 }}>
              <StateField
                label="Email"
                type="email"
                value={contact.email || ""}
                verified={isVerified(stateKey(stateName, "email"))}
                onChange={(e) => updateStateField(stateName, "email", e.target.value)}
                onVerify={() => openStateVerify("email", stateName)}
              />

              <StateField
                label="Mobile Number"
                type="mobile"
                value={contact.mobileNumber || ""}
                verified={isVerified(stateKey(stateName, "mobile"))}
                onChange={(e) => updateStateField(stateName, "mobileNumber", e.target.value)}
                onVerify={() => openStateVerify("mobile", stateName)}
              />

              <StateField
                label="WhatsApp Number"
                type="whatsapp"
                value={contact.whatsappNumber || ""}
                verified={isVerified(stateKey(stateName, "whatsapp"))}
                onChange={(e) => updateStateField(stateName, "whatsappNumber", e.target.value)}
                onVerify={() => openStateVerify("whatsapp", stateName)}
              />

              <Button
                variant="contained"
                color="success"
                size="small"
                fullWidth
                sx={{ mt: 1 }}
                disabled={isSaving}
                onClick={() => onSaveState(stateName)}
              >
                {isSaving ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Save"}
              </Button>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Card>
  );
});

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function BrandContactMapping({ brandOwnerId }) {
  const [states, setStates] = useState([]);
  const [stateContactMap, setStateContactMap] = useState({});
  const [districtsMap, setDistrictsMap] = useState({});
  const [selectedState, setSelectedState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [verifiedMap, setVerifiedMap] = useState({});
  const [savingMap, setSavingMap] = useState({});
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const [otpPopup, setOtpPopup] = useState({
    open: false,
    type: "email",
    value: "",
    context: {},
    verifiedKey: "",
  });

  useEffect(() => {
    if (brandOwnerId) fetchStates();
  }, [brandOwnerId]);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/domestic-contact-mapping-states/${brandOwnerId}`);
      const statesData = res.data?.data?.states || [];
      const initialContacts = {};
      statesData.forEach((s) => {
        initialContacts[s.state] = {
          email: s.email || "",
          mobileNumber: s.mobileNumber || "",
          whatsappNumber: s.whatsappNumber || "",
        };
      });
      setStates(statesData);
      setStateContactMap(initialContacts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearVerified = useCallback((key) => {
    setVerifiedMap((p) => ({ ...p, [key]: false }));
  }, []);

  const markVerified = useCallback((key) => {
    setVerifiedMap((p) => ({ ...p, [key]: true }));
  }, []);

  const isVerified = useCallback((key) => !!verifiedMap[key], [verifiedMap]);

  const stateKey = (sn, type) => `${sn}|${type}`;
  const districtKey = (sn, dn, type) => `${sn}|${dn}|${type}`;

  const setSaving = useCallback((key, val) => {
    setSavingMap((p) => ({ ...p, [key]: val }));
  }, []);

  const updateStateField = useCallback((stateName, field, val) => {
    setStateContactMap((prev) => ({
      ...prev,
      [stateName]: { ...prev[stateName], [field]: val },
    }));
    const typeMap = { email: "email", mobileNumber: "mobile", whatsappNumber: "whatsapp" };
    clearVerified(stateKey(stateName, typeMap[field]));
  }, [clearVerified]);

  const updateDistrictField = useCallback((stateName, districtIndex, districtName, field, val) => {
    setDistrictsMap((prev) => ({
      ...prev,
      [stateName]: prev[stateName]?.map((d, i) =>
        i === districtIndex ? { ...d, [field]: val } : d
      ) || [],
    }));
    const type = field === "email" ? "email" : field === "mobileNumber" ? "mobile" : "whatsapp";
    clearVerified(districtKey(stateName, districtName, type));
  }, [clearVerified]);

  // ─────────────────────────────────────────────────────────
  // PHONE VALIDATION HELPER
  // Mobile / WhatsApp numbers MUST start with "+91".
  // Email is exempt from this check.
  // ─────────────────────────────────────────────────────────
  const validatePhone = (type, value) => {
    if (type === "email") return true;
    if (!value || !value.trim().startsWith("+91")) return false;
    return true;
  };

  const openStateVerify = useCallback((type, stateName) => {
    const contact = stateContactMap[stateName] || {};
    const valueMap = { email: contact.email, mobile: contact.mobileNumber, whatsapp: contact.whatsappNumber };
    const value = valueMap[type] || "";

    if (!validatePhone(type, value)) {
      setSnack({
        open: true,
        msg: `${TYPE_CONFIG[type].label} must start with +91. Field has been cleared.`,
        severity: "error",
      });
      const fieldMap = { mobile: "mobileNumber", whatsapp: "whatsappNumber" };
      updateStateField(stateName, fieldMap[type], "");
      return;
    }

    setOtpPopup({
      open: true,
      type,
      value,
      context: { stateName },
      verifiedKey: stateKey(stateName, type),
    });
  }, [stateContactMap, updateStateField]);

  const openDistrictVerify = useCallback((type, stateName, district, districtIndex) => {
    const valueMap = { email: district.email, mobile: district.mobileNumber, whatsapp: district.whatsappNumber };
    const value = valueMap[type] || "";

    if (!validatePhone(type, value)) {
      setSnack({
        open: true,
        msg: `${TYPE_CONFIG[type].label} must start with +91. Field has been cleared.`,
        severity: "error",
      });
      const fieldMap = { mobile: "mobileNumber", whatsapp: "whatsappNumber" };
      updateDistrictField(stateName, districtIndex, district.district, fieldMap[type], "");
      return;
    }

    setOtpPopup({
      open: true,
      type,
      value,
      context: { stateName, districtName: district.district },
      verifiedKey: districtKey(stateName, district.district, type),
    });
  }, [updateDistrictField]);

  const closeOtpPopup = useCallback((verified) => {
    if (verified && otpPopup.verifiedKey) markVerified(otpPopup.verifiedKey);
    setOtpPopup((p) => ({ ...p, open: false }));
  }, [otpPopup.verifiedKey, markVerified]);

  const fetchDistricts = async (stateName) => {
    if (districtsMap[stateName]) return;
    try {
      setDistrictLoading(true);
      const res = await axios.get(`${API}/domestic-contact-mapping/districts/${brandOwnerId}/${encodeURIComponent(stateName)}`);
      setDistrictsMap((prev) => ({ ...prev, [stateName]: res.data?.data?.districts || [] }));
    } catch (err) {
      console.error(err);
    } finally {
      setDistrictLoading(false);
    }
  };

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
    }
  }, [selectedState]);

  const handleAccordionChange = useCallback((stateName) => (event, isExpanded) => {
    setSelectedState(isExpanded ? stateName : null);
  }, []);

  // ─────────────────────────────────────────────────────────
  // SAVE: STATE LEVEL
  // ─────────────────────────────────────────────────────────
  const onSaveState = useCallback(async (stateName) => {
    const contact = stateContactMap[stateName] || {};

    const payload = { brandOwnerId, state: stateName };
    let hasVerifiedField = false;

    ["email", "mobile", "whatsapp"].forEach((type) => {
      if (isVerified(stateKey(stateName, type))) {
        const field = FIELD_BY_TYPE[type];
        payload[field] = contact[field] || "";
        hasVerifiedField = true;
      }
    });

    if (!hasVerifiedField) {
      setSnack({ open: true, msg: "Please verify at least one field (Email / Mobile / WhatsApp) before saving.", severity: "warning" });
      return;
    }

    const savingKey = `state|${stateName}`;
    try {
      setSaving(savingKey, true);
      await axios.put(`${API}/domestic-contact-mapping-update`, payload);
      setSnack({ open: true, msg: `${stateName} updated successfully`, severity: "success" });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update state contact.";
      setSnack({ open: true, msg, severity: "error" });
    } finally {
      setSaving(savingKey, false);
    }
  }, [stateContactMap, isVerified, brandOwnerId, setSaving]);

  // ─────────────────────────────────────────────────────────
  // SAVE: DISTRICT LEVEL
  // ─────────────────────────────────────────────────────────
  const onSaveDistrict = useCallback(async (stateName, district) => {
    const payload = { brandOwnerId, state: stateName, district: district.district };
    let hasVerifiedField = false;

    ["email", "mobile", "whatsapp"].forEach((type) => {
      if (isVerified(districtKey(stateName, district.district, type))) {
        const field = FIELD_BY_TYPE[type];
        payload[field] = district[field] || "";
        hasVerifiedField = true;
      }
    });

    if (!hasVerifiedField) {
      setSnack({ open: true, msg: "Please verify at least one field (Email / Mobile / WhatsApp) before saving.", severity: "warning" });
      return;
    }

    const savingKey = `district|${stateName}|${district.district}`;
    try {
      setSaving(savingKey, true);
      await axios.put(`${API}/domestic-contact-mapping-update`, payload);
      setSnack({ open: true, msg: `${district.district} updated successfully`, severity: "success" });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update district contact.";
      setSnack({ open: true, msg, severity: "error" });
    } finally {
      setSaving(savingKey, false);
    }
  }, [isVerified, brandOwnerId, setSaving]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: "flex", gap: 0.5, p: 0, height: "82vh" }}>
      {/* States Accordion Sidebar */}
      <StatesAccordionList
        states={states}
        selectedState={selectedState}
        stateContactMap={stateContactMap}
        isVerified={isVerified}
        stateKey={stateKey}
        updateStateField={updateStateField}
        openStateVerify={openStateVerify}
        handleAccordionChange={handleAccordionChange}
        onSaveState={onSaveState}
        savingMap={savingMap}
      />

      {/* Districts Table */}
      <Card sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        {!selectedState ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Typography color="text.secondary">← Expand a state to view districts</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h6" fontWeight={700} mb={2}>{selectedState} — Districts</Typography>

            {districtLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}><CircularProgress /></Box>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small" sx={{ tableLayout: "fixed" }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell sx={{ width: "14%", fontWeight: 700, fontSize: 12 }}>District</TableCell>
                      <TableCell sx={{ width: "24%", fontWeight: 700, fontSize: 12 }}>Email</TableCell>
                      <TableCell sx={{ width: "20%", fontWeight: 700, fontSize: 12 }}>Mobile</TableCell>
                      <TableCell sx={{ width: "20%", fontWeight: 700, fontSize: 12 }}>WhatsApp</TableCell>
                      <TableCell sx={{ width: "10%", textAlign: "center", fontWeight: 700, fontSize: 12 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(districtsMap[selectedState] || []).map((district, index) => {
                      const districtSavingKey = `district|${selectedState}|${district.district}`;
                      const isDistrictSaving = !!savingMap[districtSavingKey];

                      return (
                        <TableRow key={district.district} sx={{ "&:hover": { backgroundColor: "#fafafa" } }}>
                          <TableCell sx={{ fontWeight: 600, fontSize: 12, color: "#f61804" }}>{district.district}</TableCell>
                          <TableCell>
                            <InputVerifyCell
                              value={district.email || ""}
                              verified={isVerified(districtKey(selectedState, district.district, "email"))}
                              onChange={(e) => updateDistrictField(selectedState, index, district.district, "email", e.target.value)}
                              onVerify={() => openDistrictVerify("email", selectedState, district, index)}
                            />
                          </TableCell>
                          <TableCell>
                            <InputVerifyCell
                              value={district.mobileNumber || ""}
                              verified={isVerified(districtKey(selectedState, district.district, "mobile"))}
                              onChange={(e) => updateDistrictField(selectedState, index, district.district, "mobileNumber", e.target.value)}
                              onVerify={() => openDistrictVerify("mobile", selectedState, district, index)}
                            />
                          </TableCell>
                          <TableCell>
                            <InputVerifyCell
                              
                              value={district.whatsappNumber || ""}
                              verified={isVerified(districtKey(selectedState, district.district, "whatsapp"))}
                              onChange={(e) => updateDistrictField(selectedState, index, district.district, "whatsappNumber", e.target.value)}
                              onVerify={() => openDistrictVerify("whatsapp", selectedState, district, index)}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              disabled={isDistrictSaving}
                              onClick={() => onSaveDistrict(selectedState, district)}
                            >
                              {isDistrictSaving ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Save"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Card>

      <OtpPopup
        open={otpPopup.open}
        onClose={closeOtpPopup}
        type={otpPopup.type}
        value={otpPopup.value}
        context={otpPopup.context}
        brandOwnerId={brandOwnerId}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        anchorOrigin={centerSnackAnchor}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}