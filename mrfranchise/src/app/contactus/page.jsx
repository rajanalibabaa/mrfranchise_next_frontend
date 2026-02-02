import ContactForm from "./contactus_client.jsx";

import Navbar from "@/Components/Navbar/NavBar.jsx";
import Footer from "@/Components/Footers/Footer.jsx"
// import img1 from '../../../assets/Images/bg23.jpeg'
const ContactUs = () => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!formData.firstName) err.firstName = "Required";
    if (!formData.email) err.email = "Required";
    if (!formData.phone) err.phone = "Required";
    if (!formData.message || formData.message.length < 20)
      err.message = "Minimum 20 characters required";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      err.email = "Invalid email";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("subject", formData.subject);
      submitData.append("message", formData.message);

      const response = await fetch(
        "https://formsubmit.co/support@.mrfranchise.in",
        {
          method: "POST",
          body: submitData,
        }
      );

      if (response.ok) {
        setSnackbar(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    // {
    //   icon: <Phone />,
    //   title: "Call Us",
    //   details: ["+91 74492 13799"],
    //   color: "#FF6B35",
    //   bg: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)",
    // },
    {
      icon: <AccessTime />,
      title: "Visit Our Office",
      details: ["Mon - Sat: 9:00 AM - 7:00 PM", "Sunday: Closed"],
      address: [
        "Mr Franchise New No 76/18, Old No 22, B-8,",
        // <br />,
        "TRB Complex, Near Ashok Pillar Signal",
        "100 Feet Road, Ashok Nagar",
        // <br />,
        "Chennai – 600083, Tamil Nadu",
      ],
      color: "#ff9800",
      bg: "linear-gradient(135deg, #f9b652ff 0%, #f3bc69e3 100%)",
    },
    {
      icon: <Email />,
      title: "Email Us",
      details: [
        "Want to ADVERTISE YOUR BRAND on www.MrFranchise.in?",
       <a href="mailto:investor@mrfranchise.in"> investor@mrfranchise.in</a>,
       <a href="mailto:sales@mrfranchise.in"> sales@mrfranchise.in</a>,
        "Want to CHANGE YOUR LISTING INFORMATION on www.MrFranchise.in?",
      <a href="mailto:support.@mrfranchise.in">support@mrfranchise.in</a>,
      ],
      color: "#1afd57ff",
      bg: "linear-gradient(135deg, #50cd4eff 0%, #49a044ff 100%)",
    },
  ];

  return (
    <>
      <Navbar />
<Box
  sx={{
    overflow: "hidden",
    position: "relative",
    backgroundImage: `url(/bg23.jpeg)`,
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundSize: "200px auto",
    backgroundRepeat: "repeat",
    minHeight: "87vh",
    width: "100%",

    // Black overlay
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3)", // adjust opacity
      zIndex: 1,
    },

    // Ensure content is above overlay
    "& > *": {
      position: "relative",
      zIndex: 2,
    },
  }}
>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          
          minHeight: "40vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          pt: 4,
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,152,0,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(114,255,5,0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />

        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Box textAlign="center" position="relative" zIndex={1}>
              <Chip
                label="We're here to help"
                sx={{
                  mb: 3,
                  px: 2,
                  py: 2,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  background: "rgba(255, 152, 0, 0.15)",
                  color: "#ffffffff",
                  border: "1px solid rgba(255, 152, 0, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              />
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  color: "#fff",
                  mb: 2,
                  fontSize: { xs: "2rem", md: "3.5rem" },
                  background:
                    "linear-gradient(90deg, #fff 0%, #ff9800 30%, #72ff05 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Let's Start a Conversation
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(0, 0, 0, 0.7)",
                  maxWidth: 600,
                  mx: "auto",
                  fontWeight: 400,
                }}
              >
                Have questions about franchising? Our expert team is ready to
                guide you towards your business success.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>
      {/* Main Content Section */}
      <Container maxWidth="lg" sx={{ py: 5, }} >
        <Grid container spacing={6}>
          {/* Left Side - Info & Map */}
          <Grid item xs={12} md={5}>
            <Fade in timeout={600}>
              <Box >
                <Typography
                  variant="overline"
                  sx={{
                    color: "#ffffffff",
                    fontWeight: 700,
                    letterSpacing: 2,
                    mb: 1,
                    display: "block",
                  }}
                >
                  GET IN TOUCH
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{ mb: 3, lineHeight: 1.2 }}
                >
                  We'd Love to
                  <Box
                    component="span"
                    sx={{
                      display: "block",
                      background: "linear-gradient(90deg, #ff9800, #72ff05)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Hear From You
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    color: "black ",
                    mb: 4,
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                  }}
                >
                  Whether you're looking to start a new franchise or expand your
                  existing business, our dedicated team is here to provide
                  personalized guidance every step of the way.
                </Typography>

                {/* Features */}
                <Stack spacing={2} mb={4}>
                  {[
                    "Response within 30 minutes to 1 hour",
                    "Expert franchise consultation",
                    "Personalized business solutions",
                    "Pan-India support network",
                  ].map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #72ff05, #4ade80)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckCircle sx={{ fontSize: 16, color: "#fff" }} />
                      </Box>
                      <Typography fontWeight={500}>{feature}</Typography>
                    </Box>
                  ))}
                </Stack>

                {/* Right Side - Form */}
                <Grid item xs={12} md={7}>
                  <Fade in timeout={800}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.08)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Decorative Elements */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: -50,
                          right: -50,
                          width: 150,
                          height: 150,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, rgba(255,152,0,0.08), rgba(114,255,5,0.08))",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: -30,
                          left: -30,
                          width: 100,
                          height: 100,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, rgba(114,255,5,0.08), rgba(255,152,0,0.08))",
                        }}
                      />

                      <Box position="relative" zIndex={1}>
                        <Typography variant="h4" fontWeight={800} mb={1}>
                          Send Us a Message
                        </Typography>
                        <Typography color="text.secondary" mb={4}>
                          Fill out the form below and we'll get back to you
                          shortly.
                        </Typography>

                        <form onSubmit={handleSubmit}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                onFocus={() => setFocusedField("firstName")}
                                onBlur={() => setFocusedField(null)}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Person
                                        sx={{
                                          color:
                                            focusedField === "firstName"
                                              ? "#ff9800"
                                              : "action.active",
                                          transition: "color 0.3s ease",
                                        }}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    transition: "all 0.3s ease",
                                    "&.Mui-focused": {
                                      boxShadow:
                                        "0 0 0 3px rgba(255, 152, 0, 0.1)",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#ff9800",
                                    },
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                onFocus={() => setFocusedField("lastName")}
                                onBlur={() => setFocusedField(null)}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Person
                                        sx={{
                                          color:
                                            focusedField === "lastName"
                                              ? "#ff9800"
                                              : "action.active",
                                          transition: "color 0.3s ease",
                                        }}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    transition: "all 0.3s ease",
                                    "&.Mui-focused": {
                                      boxShadow:
                                        "0 0 0 3px rgba(255, 152, 0, 0.1)",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#ff9800",
                                    },
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                onFocus={() => setFocusedField("email")}
                                onBlur={() => setFocusedField(null)}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Email
                                        sx={{
                                          color:
                                            focusedField === "email"
                                              ? "#ff9800"
                                              : "action.active",
                                          transition: "color 0.3s ease",
                                        }}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    transition: "all 0.3s ease",
                                    "&.Mui-focused": {
                                      boxShadow:
                                        "0 0 0 3px rgba(255, 152, 0, 0.1)",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#ff9800",
                                    },
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                onFocus={() => setFocusedField("phone")}
                                onBlur={() => setFocusedField(null)}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Phone
                                        sx={{
                                          color:
                                            focusedField === "phone"
                                              ? "#ff9800"
                                              : "action.active",
                                          transition: "color 0.3s ease",
                                        }}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    transition: "all 0.3s ease",
                                    "&.Mui-focused": {
                                      boxShadow:
                                        "0 0 0 3px rgba(255, 152, 0, 0.1)",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#ff9800",
                                    },
                                  },
                                }}
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={12} mt={3}>
                            <TextField
                              fullWidth
                              multiline
                              rows={5}
                              label="Your Message"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              error={!!errors.message}
                              helperText={
                                errors.message ||
                                `${formData.message.length}/20 minimum characters`
                              }
                              onFocus={() => setFocusedField("message")}
                              onBlur={() => setFocusedField(null)}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  transition: "all 0.3s ease",
                                  "&.Mui-focused": {
                                    boxShadow:
                                      "0 0 0 3px rgba(255, 152, 0, 0.1)",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#ff9800",
                                  },
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} mt={3}>
                            <Button
                              type="submit"
                              // fullWidth
                              size="large"
                              disabled={loading}
                              sx={{
                                py: 2,
                                borderRadius: 2,
                                fontSize: "1rem",
                                fontWeight: 700,
                                textTransform: "none",
                                background:
                                  "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                                color: "#fff",
                                boxShadow: "0 4px 15px rgba(255, 152, 0, 0.4)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  background:
                                    "linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)",
                                  boxShadow:
                                    "0 6px 20px rgba(255, 152, 0, 0.5)",
                                  transform: "translateY(-2px)",
                                },
                                "&:disabled": {
                                  background:
                                    "linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%)",
                                },
                              }}
                              endIcon={
                                loading ? null : (
                                  <ArrowForward
                                    sx={{
                                      transition: "transform 0.3s ease",
                                      ".MuiButton-root:hover &": {
                                        transform: "translateX(4px)",
                                      },
                                    }}
                                  />
                                )
                              }
                            >
                              {loading
                                ? "Sending Your Message..."
                                : "Send Message"}
                            </Button>
                          </Grid>
                        </form>

                        {/* Trust Badges */}
                        <Box
                          sx={{
                            mt: 4,
                            pt: 4,
                            borderTop: "1px solid rgba(0,0,0,0.08)",
                            display: "flex",
                            justifyContent: "center",
                            gap: 4,
                            flexWrap: "wrap",
                          }}
                        >
                          {[
                            { icon: "🔒", text: "Secure & Encrypted" },
                            { icon: "⚡", text: "Fast Response" },
                            { icon: "💯", text: "100% Free Consultation" },
                          ].map((badge, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography fontSize={20}>
                                {badge.icon}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "text.secondary",
                                  fontWeight: 500,
                                }}
                              >
                                {badge.text}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                  </Fade>
                </Grid>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      {/* Contact Cards Section */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Grid
          container
          spacing={3}
          display={{ xs: "none", md: "flex" }}
          flexDirection={{ xs: "column", md: "row" }}
        >
          {contactInfo.map((info, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Zoom in timeout={300 + index * 200}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    // borderRadius: 4,
                    background: "#fff",
                    // border: "1px solid rgba(0,0,0,0.08)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    overflow: "hidden",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
                      "& .icon-box": {
                        transform: "scale(1.1) rotate(5deg)",
                      },
                      "& .hover-bg": {
                        opacity: 1,
                        transform: "scale(1)",
                      },
                    },
                  }}
                >
                  <Box
                    className="hover-bg"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: info.bg,
                      opacity: 0,
                      transform: "scale(0.8)",
                      transition: "all 0.4s ease",
                      zIndex: 0,
                    }}
                  />
                  <Box position="relative" zIndex={1}>
                    <Box
                      className="icon-box"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        background: info.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        mb: 3,
                        transition: "all 0.4s ease",
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        mb: 1,
                        transition: "color 0.3s ease",
                        ".MuiPaper-root:hover &": { color: "#fff" },
                      }}
                    >
                      {info.title}
                    </Typography>
                    {info.details.map((detail, i) => (
                      <Typography
                        key={i}
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.95rem",
                          transition: "color 0.3s ease",
                          ".MuiPaper-root:hover &": {
                            color: "rgba(255,255,255,0.9)",
                          },
                        }}
                      >
                        {detail}
                      </Typography>
                    ))}

                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.95rem",
                        transition: "color 0.3s ease",
                        ".MuiPaper-root:hover &": {
                          color: "rgba(255,255,255,0.9)",
                        },
                      }}
                    >
                      {info.address}
                    </Typography>
                  </Box>
                </Paper>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Map Section */}
      <Box
        sx={{
          // background: "linear-gradient(135deg, #f8f9fa 0%, #fff 100%)",
          py: 5,
          mt: 5,
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={5}>
            <Typography variant="h4" fontWeight={800} mb={1}>
              Find Us on the Map
            </Typography>
            <Typography color="text.secondary">
              Visit our office for a face-to-face consultation
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.9989040809477!2d80.2089741!3d13.0379629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526612962c0cf9%3A0x75f4e8f8e7c2d8b9!2sAshok%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu%20600083!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Paper>
        </Container>
      </Box>
</Box>
      <Footer />

      <Snackbar
        open={snackbar}
        autoHideDuration={5000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSnackbar(false)}
          sx={{
            borderRadius: 2,
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          }}
        >
          🎉 Message sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </>
  );
};

export default function ContactPage() {
  return <ContactForm />;
}