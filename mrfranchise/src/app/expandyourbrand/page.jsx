"use client";
import React from "react";
import {Link as RouterLink} from 'next/link'
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
// import ExpandBrand from "../../../assets/Images/ExpandBusiness.jpg";
import GroupsIcon from "@mui/icons-material/Groups";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import Navbar from "../../Components/Navbar/NavBar";
import Footer from "../../Components/Footers/Footer";

// Inject custom styles for the page
const customStyle = `
@keyframes gradientMove {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(30px);}
  100% { opacity: 1; transform: translateY(0);}
}
.expand-bg {
  min-height: 100vh;
  // background: linear-gradient(120deg, #fffbe7 0%, #ffe0b2 40%, #e3f2fd 100%);
  background-size: 200% 200%;
  animation: gradientMove 12s ease-in-out infinite;
}
.section-box {
  background: rgba(255,255,255,0.95);
  border-radius: 18px;
  box-shadow: 0 4px 32px #ffe08255;
  padding: 17px 6px;
  margin-bottom: 32px;
  transition: box-shadow 0.3s, transform 0.3s;
  animation: fadeInUp 0.8s;
}
.section-box:hover {
  // box-shadow: 0 12px 48px #ffe08299;
  transform: translateY(-6px) scale(1.02);
}
.section-title {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 18px;
  font-size: 1.25rem;
  color: #ff9800;
  letter-spacing: 1px;
}
.section-list {
  padding-left: 24px;
  margin-bottom: 0;
}
.section-list li {
  margin-bottom: 10px;
  font-size: 1.08rem;
  color: #444;
  line-height: 1.7;
  position: relative;
  list-style: none;
}
.section-list li::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background: linear-gradient(90deg, #ff9800 60%, #ffd54f 100%);
  border-radius: 50%;
  margin-right: 12px;
  vertical-align: middle;
}
@media (max-width: 900px) {
  .section-box {
    padding: 20px 10px;
  }
}
`;

if (!document.head.querySelector("style[data-expand-custom]")) {
  const styleTag = document.createElement("style");
  styleTag.setAttribute("data-expand-custom", "true");
  styleTag.innerText = customStyle;
  document.head.appendChild(styleTag);
}

// Section component with ul/li, no map
const Section = ({ title, icon, items, image, description }) =>
  image ? (
    <Grid
      container
      spacing={3}
      alignItems="center"
      className="section-box"
      sx={{ mb: 2 }}
    >
      <Grid xs={12} md={5}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img
            src={'/ExpandBusiness.jpg'}
            loading="lazy"
            alt={title}
            style={{
              maxWidth: "100%",
              maxHeight: 300,
              mr: 3,
              marginLeft: 16,
              borderRadius: 16,
              boxShadow: "0 4px 24px #ffe08255",
              objectFit: "contain",
              background: "#fffbe7",
            }}
          />
        </Box>
      </Grid>
      <Grid xs={12} md={7}>
        <span className="section-title">
          {icon}
          <Box ml={1}>{title}</Box>
        </span>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
        <ul className="section-list">
          {items.map((item, index) =>
            item ? <li key={index}>{item}</li> : null
          )}
        </ul>
      </Grid>
    </Grid>
  ) : (
    <Box className="section-box">
      <span className="section-title">
        {icon}
        <Box ml={1}>{title}</Box>
      </span>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}
      <ul className="section-list">
        {items.map((item, index) =>
          item ? <li key={index}>{item}</li> : null
        )}
      </ul>
    </Box>
  );

const ExpandYourBrand = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Box className="expand-bg">
      <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 10 }}>
        <Navbar />
      </Box>

      <Container sx={{ py: 2 }}>
        {/* Header */}
        <Box
          textAlign="center"
          // mt={2}
          mb={3}
          sx={{
            animation: "fadeInUp 1s",
            borderRadius: 4,
            px: { xs: 2, md: 6 },
            py: { xs: 3, md: 4 },
            mt: { xs: 5, sm: 15, lg: 8 },

            // background: "rgba(255,255,255,0.98)",
            // boxShadow: "0 4px 32px #ffe08255"
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h3"}
            fontWeight="bold"
            gutterBottom
            color="#ff9800"
            sx={{ letterSpacing: 1, textShadow: "0 2px 12px #fffbe7" }}
          >
            Expand Your Brand
          </Typography>
          <Typography
            variant={isMobile ? "h6" : "h4"}
            gutterBottom
            sx={{ color: "#7ad03a", fontWeight: 600, letterSpacing: 0.5 }}
          >
            Transform Your Business into a Scalable Franchise with
            MrFranchise.in
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={2}>
            Are you running a successful business and ready to take it to the
            next level?
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            At{" "}
            <Link
              component={RouterLink}
              to="/"
              underline="hover"
              color="black"
              fontWeight="bold"
            >
              MrFranchise.in
            </Link>{" "}
            , we specialize in helping business owners expand their brand
            through franchising — strategically, professionally, and profitably.
            Whether you own a local outlet, a regional chain, or an emerging
            startup, we help you structure your model, position your brand, and
            attract serious investors across Tamil Nadu and beyond.
          </Typography>
        </Box>

        {/* Why Franchise */}
        <Section
          title="Why Franchise Your Business?"
          description="Franchising is the smartest way to grow without losing control or investing all your own capital. With the right model and strategy, you can:"
          icon={<BusinessIcon color="primary" />}
          items={[
            "Multiply your presence across locations",
            "Build brand equity and recognition",
            "Generate recurring franchise income",
            "Attract investor capital without dilution",
          ]}
        />

        {/* Who Is This For? */}
        <Section
          title="Who Is This For?"
          icon={<GroupsIcon color="primary" />}
          image="url(/ExpandBusiness.jpg)"
          items={[
            "Business owners ready to grow beyond one location",
            "Regional brands aiming to enter new cities or states",
            "Startups with a proven concept and scalable model",
            "Professionals looking to replicate a niche service business",
          ]}
        />

        {/* What We Do */}
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          color="#7ad03a"
          gutterBottom
          sx={{
            mb: 2,
            mt: 4,
            animation: "fadeInUp 1.2s",
          }}
        >
          {/* <BuildCircleIcon color="primary" sx={{ mr: 1 }} /> */}
          ⚙️ What We Do
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          mb={3}
          sx={{ animation: "fadeInUp 1.2s" }}
        >
          As your franchise consulting partner, we provide an end-to-end
          solution:
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
          alignItems="stretch"
        >
          {/* First row - 3 sections */}
          <Grid xs={12} sm={8} md={4}>
            <Section
              title="1. Strategic Franchise Planning"
              items={[
                "Business model evaluation",
                "Franchise structure, revenue models & roles",
                "Territory, training, and support setup",
                "",
              ]}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <Section
              title="2. Legal & Financial Documentation"
              items={[
                "Franchise Agreement",
                "Franchise Disclosure Document (FDD)",
                "SOPs and brand guidelines",
                "",
              ]}
            />
          </Grid>
          <Grid xs={12} md={4}>
            <Section
              title="3. Franchise Kit & Investor Pitch Deck"
              items={[
                "Visual brand pitch",
                "Unit economics & ROI projections",
                "Franchisee onboarding workflow",
                "",
              ]}
            />
          </Grid>

          {/* Second row - 2 centered sections */}
          <Grid xs={12}>
            <Grid container justifyContent="center" spacing={4}>
              <Grid xs={12} md={6} lg={5}>
                <Section
                  title="4. Brand Promotion & Investor Outreach"
                  items={[
                    "Franchise listing on MrFranchise.in",
                    "Targeted investor lead generation",
                    "WhatsApp & CRM-integrated communications",
                    "",
                  ]}
                />
              </Grid>
              <Grid xs={12} md={6} lg={5}>
                <Section
                  title="5. Franchisee Screening & Growth Support"
                  items={[
                    "Shortlisting qualified leads",
                    "Initial interviews & support",
                    "Regional expansion planning",
                    "",
                  ]}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Team Section */}
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            mb: 4,
            background: "linear-gradient(90deg, #fffde7 60%, #e8f5e9 100%)",
            boxShadow: "0 2px 12px #aed58133",
            animation: "fadeInUp 1.3s",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom color="#7ad03a">
              🧑‍💼 Led by Experts, Built for Scale
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Under the leadership of <strong>Suresh Muthuvel</strong>, senior
              franchise consultant and CEO of MrFranchise, we’ve helped
              businesses across Tamil Nadu grow into successful multi-location
              franchises.
            </Typography>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Box
          textAlign="center"
          mt={6}
          sx={{
            animation: "fadeInUp 1.4s",
            background: "rgba(255,255,255,0.95)",
            borderRadius: 4,
            boxShadow: "0 4px 24px #ffe08233",
            px: { xs: 2, md: 6 },
            py: { xs: 3, md: 4 },
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            📞 Ready to Expand?
          </Typography>
          <Typography variant="body1" mb={3}>
            Let our experts build your franchise model and connect you with
            serious investors.
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            <Grid>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<PhoneIcon />}
                sx={{
                  // boxShadow: "0 2px 8px #1976d233",
                  fontWeight: 700,
                  px: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(90deg, #ff9800 60%, #ffd54f 100%)",
                  color: "#fff",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #ffd54f 60%, #ff9800 100%)",
                  },
                }}
                href="tel:+919841323388"
              >
                Call Now: +91 98413 23388
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="outlined"
                size="large"
                startIcon={<EmailIcon />}
                sx={{
                  fontWeight: 700,
                  px: 3,
                  borderRadius: 3,
                  borderColor: "#ff9800",
                  color: "#ff9800",
                  "&:hover": {
                    background: "#fff3e0",
                    borderColor: "#ff9800",
                  },
                }}
                href="mailto:ceo@MrFranchise.in"
              >
                Email: ceo@MrFranchise.in
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{
                  fontWeight: 700,
                  px: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(90deg, #ff9800 60%, #ffd54f 100%)",
                  color: "#fff",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #ffd54f 60%, #ff9800 100%)",
                  },
                }}
                href="/brand-listing"
              >
                Add Your Brand Listing
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default ExpandYourBrand;
