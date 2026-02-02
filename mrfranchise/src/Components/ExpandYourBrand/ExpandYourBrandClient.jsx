"use client";

import React, { useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";

const ExpandYourBrandClient = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Inject styles once on mount — safe & fast
  useEffect(() => {
    if (document.getElementById("expand-brand-styles")) return;

    const style = document.createElement("style");
    style.id = "expand-brand-styles";
    style.innerHTML = `
      @keyframes gradientMove { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
      @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      .expand-bg { min-height:100vh; background:linear-gradient(120deg,#fffbe7 0%,#ffe0b2 40%,#e3f2fd 100%); background-size:200% 200%; animation:gradientMove 15s ease infinite; }
      .section-box { background:rgba(255,255,255,0.95); border-radius:18px; box-shadow:0 4px 32px #ffe08255; padding:24px; margin-bottom:32px; animation:fadeInUp 0.8s; transition:all .3s; }
      .section-box:hover { transform:translateY(-8px) scale(1.02); box-shadow:0 16px 64px #ffe08299; }
      .section-title { display:flex; align-items:center; font-weight:bold; font-size:1.4rem; color:#ff9800; margin-bottom:16px; }
      .section-list li { position:relative; padding-left:28px; margin-bottom:12px; font-size:1.1rem; color:#444; line-height:1.7; }
      .section-list li::before { content:''; position:absolute; left:0; top:10px; width:10px; height:10px; background:linear-gradient(90deg,#ff9800,#ffd54f); border-radius:50%; }
    `;
    document.head.appendChild(style);
  }, []);

  const Section = ({ title, icon, items, image, description }) => (
    image ? (
      <Grid container spacing={3} alignItems="center" className="section-box">
        <Grid item xs={12} md={5}>
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <img
              src="/ExpandBusiness.jpg"
              alt={title}
              loading="lazy"
              style={{ maxWidth: "100%", maxHeight: 320, borderRadius: 16, boxShadow: "0 4px 24px #ffe08255" }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <div className="section-title">{icon}<Box ml={1}>{title}</Box></div>
          {description && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{description}</Typography>}
          <ul className="section-list">
            {items.filter(Boolean).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Grid>
      </Grid>
    ) : (
      <Box className="section-box">
        <div className="section-title">{icon}<Box ml={1}>{title}</Box></div>
        {description && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{description}</Typography>}
        <ul className="section-list">
          {items.filter(Boolean).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Box>
    )
  );

  return (
    <Box className="expand-bg" mt={10}>
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
        <Navbar />
      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 16 }, pb: 8 }}>
        {/* Hero */}
        <Box textAlign="center" mb={6}>
          <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" color="#ff9800" gutterBottom>
            Expand Your Brand
          </Typography>
          <Typography variant={isMobile ? "h6" : "h4"} color="#7ad03a" fontWeight={600} gutterBottom>
            Transform Your Business into a Scalable Franchise with MrFranchise.in
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={3} maxWidth={900} mx="auto">
            At <Link href="/" underline="none" sx={{ fontWeight: "bold", color: "black" }}>MrFranchise.in</Link>, we help successful business owners expand nationwide through professional franchising — with zero hassle.
          </Typography>
        </Box>

        <Section
          title="Why Franchise Your Business?"
          description="Franchising is the fastest way to scale without heavy capital or risk:"
          icon={<BusinessIcon sx={{ fontSize: 32 }} color="primary" />}
          items={[
            "Multiply outlets across cities & states",
            "Generate passive royalty income",
            "Build massive brand value",
            "Grow using investor capital"
          ]}
        />

        <Section
          title="Who Is This For?"
          icon={<GroupsIcon sx={{ fontSize: 32 }} color="primary" />}
          image
          items={[
            "Restaurant / Cafe owners with proven model",
            "Retail & service businesses ready to expand",
            "Education, fitness, beauty, healthcare brands",
            "Any profitable business with repeat customers"
          ]}
        />

        <Typography variant="h5" textAlign="center" color="#7ad03a" fontWeight="bold" my={6}>
          ⚡ What We Deliver – End-to-End Franchise Setup
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {[
            { title: "Strategic Planning", items: ["Model evaluation", "Revenue streams", "Territory mapping"] },
            { title: "Legal Documentation", items: ["Franchise Agreement", "FDD", "Brand SOPs"] },
            { title: "Investor Pitch Deck", items: ["ROI projections", "Visual branding", "Unit economics"] },
            { title: "Lead Generation", items: ["Listing on MrFranchise.in", "Targeted investor outreach", "CRM automation"] },
            { title: "Ongoing Support", items: ["Franchisee screening", "Training programs", "Expansion planning"] },
          ].map((sec, i) => (
            <Grid item xs={12} md={6} lg={4} key={i}>
              <Section title={sec.title} items={sec.items} icon={null} />
            </Grid>
          ))}
        </Grid>

        <Card sx={{ mt: 8, bgcolor: "#fffde7", borderRadius: 4 }}>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" color="#7ad03a" fontWeight="bold">
              Led by Suresh Muthuvel – Franchise Expert with 15+ Years Experience
            </Typography>
            <Typography mt={2}>
              We've helped 50+ brands expand across Tamil Nadu, Karnataka, Kerala & beyond.
            </Typography>
          </CardContent>
        </Card>

        <Box textAlign="center" mt={8} p={6} bgcolor="rgba(255,255,255,0.97)" borderRadius={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Ready to Build Your Franchise Empire?
          </Typography>
          <Typography mb={4}>Let's discuss your expansion plan today.</Typography>

          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <Button variant="contained" size="large" startIcon={<PhoneIcon />} href="tel:+919841323388"
                sx={{ bgcolor: "#ff9800", "&:hover": { bgcolor: "#f57c00" }, px: 4, py: 1.5, fontSize: "1.1rem" }}>
                Call +91 98413 23388
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" size="large" startIcon={<EmailIcon />} href="mailto:ceo@MrFranchise.in"
                sx={{ borderColor: "#ff9800", color: "#ff9800", px: 4, py: 1.5 }}>
                Email CEO
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default ExpandYourBrandClient;