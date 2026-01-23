"use client";
import React from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";

import { Link as RouterLink } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";
import Email from "@mui/icons-material/Email";
import Phone from "@mui/icons-material/Phone";

const FONT_FAMILY = "'Poppins', 'Roboto', 'Arial', sans-serif";

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Section = ({ title, children }) => (
  <motion.div
    variants={sectionVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    style={{ marginTop: 32 }}
  >
    <Box
      sx={{
        pl: { xs: 2, md: 4 },
        py: 2,
        mb: 3,
        borderLeft: "5px solid #ffba00",
        background: "transparent",
        fontFamily: FONT_FAMILY,
        transition: "border-color 0.3s",
        "&:hover": {
          borderLeft: "7px solid #ff9800",
        },
      }}
    >
      {title && (
        <Typography
          variant="h5"
          component={'span'}
          gutterBottom
          fontWeight={600}
          color="#ffba00"
          sx={{
            fontFamily: FONT_FAMILY,
            mb: 1,
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Typography>
      )}
      <Typography
        variant="body1"
        gutterBottom
        color="#8e8e8e"
        sx={{ fontFamily: FONT_FAMILY }}
      >
        {children}
      </Typography>
      <Divider sx={{ mt: 2 }} />
    </Box>
  </motion.div>
);

const TermsAndConditions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #fffbe7 0%, #f9fafb 100%)",
        fontFamily: FONT_FAMILY,
      }}
    >
      <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 10 }}>
        <Navbar />
      </Box>
      <Container sx={{ py: 3, pt: isMobile ? 11 : 15, maxWidth: "lg" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            fontWeight={800}
            gutterBottom
            sx={{
              color: "#ffba00",
              fontFamily: FONT_FAMILY,
              letterSpacing: 1,

              textShadow: "0 2px 8px rgba(255,186,0,0.08)",
            }}
          >
            Terms and Conditions
          </Typography>
        </motion.div>

        <Section>
          Welcome to{" "}
          <Link component={RouterLink} to="/" underline="hover" color="black">
            MrFranchise.in
          </Link>
          . Please read these Terms and Conditions (“Terms”) carefully before
          using our website and services. By accessing or using our website, you
          agree to be bound by these Terms. If you do not agree to all the
          terms, please refrain from using our platform.
        </Section>

        <Section title="1. Definitions">
          <ul style={{ paddingLeft: "2.2em" }}>
            <li>
              “We”, “Us”, “Our” refers to{" "}
              <Link
                component={RouterLink}
                to="/"
                underline="hover"
                color="black"
              >
                MrFranchise.in
              </Link>
              , its team, and consultants.
            </li>
            <li>
              “You”, “User” refers to any visitor, brand, investor, or
              registered client using this website.
            </li>
            <li>
              “Platform” means the website
              <Link
                component={RouterLink}
                to="/"
                underline="hover"
                color="black"
              >
                {" "}
                www.MrFranchise.in
              </Link>{" "}
              and associated tools/services.
            </li>
          </ul>
        </Section>

        <Section title="2. Services Offered">
          <Link component={RouterLink} to="/" underline="hover" color="black">
            MrFranchise.in
          </Link>{" "}
          provides:
          <ul style={{ paddingLeft: "2.2em", marginTop: "0.5em" }}>
            <li>Franchise consulting services</li>
            <li>Franchise development and documentation</li>
            <li>Brand promotions and investor outreach</li>
            <li>
              Lead generation, CRM integration, and digital marketing support
            </li>
          </ul>
          Please note:{" "}
          <Link component={RouterLink} to="/" underline="hover" color="black">
            MrFranchise.in
          </Link>{" "}
          is not a legal franchise broker or financial advisor. All investments
          made are at the user’s discretion.
        </Section>

        <Section title="3. User Eligibility">
          You must be:
          <ul style={{ paddingLeft: "2.2em", marginTop: "0.5em" }}>
            <li>At least 18 years of age.</li>
            <li>
              Legally authorized to represent your business or act as an
              investor.
            </li>
          </ul>
        </Section>

        <Section title="4. Account Registration">
          Certain features may require registration. You agree to:
          <ul style={{ paddingLeft: "2.2em", marginTop: "0.5em" }}>
            <li>Provide accurate and complete information</li>
            <li>Maintain confidentiality of your login credentials</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>
        </Section>

        <Section title="5. User Responsibilities">
          By using MrFranchise.in, you agree:
          <ul style={{ paddingLeft: "2.2em", marginTop: "0.5em" }}>
            <li>
              Not to post or submit false, misleading, or defamatory information
            </li>
            <li>Not to use the platform for fraudulent or illegal purposes</li>
            <li>
              Not to copy, reproduce, or sell any part of the site or services
            </li>
          </ul>
        </Section>

        <Section title="6. Consultation Services">
          All paid services, including franchise consulting and promotional
          packages, are governed by individual agreements. Deliverables,
          timelines, and responsibilities will be detailed in signed client
          contracts.
        </Section>

        <Section title="7. Payments & Refunds">
          <ul style={{ paddingLeft: "2.2em", marginTop: "0.5em" }}>
            <li>
              Payments for consulting, advertising, or listing services must be
              made in advance.
            </li>
            <li>
              Refunds are not provided unless specifically mentioned in your
              service agreement.
            </li>
            <li>All transactions are subject to applicable taxes.</li>
          </ul>
        </Section>

        <Section title="8. Limitation of Liability">
          <Link component={RouterLink} to="/" underline="hover" color="black">
            MrFranchise.in
          </Link>{" "}
          is not liable for:
          <ul style={{ paddingLeft: "2.2em", marginTop: "0.5em" }}>
            <li>Investment decisions made based on leads or listings.</li>
            <li>Accuracy of third-party content.</li>
            <li>Any direct, indirect, incidental, or consequential damages</li>
          </ul>
          We do not guarantee the success of any franchise arrangement or
          investment.
        </Section>

        <Section title="9. Intellectual Property">
          All content, designs, logos, and materials on{" "}
          <Link component={RouterLink} to="/" underline="hover" color="black">
            MrFranchise.in
          </Link>{" "}
          are the intellectual property of the company and may not be reproduced
          or used without permission.
        </Section>

        <Section title="10. Third-Party Links">
          Our platform may contain links to third-party websites. We are not
          responsible for their content, services, or privacy practices.
        </Section>

        <Section title="11. Modifications">
          We reserve the right to update or modify these Terms at any time.
          Updates will be reflected with a new “Effective Date.” Continued use
          of the platform implies acceptance of changes.
        </Section>

        <Section title="12. Governing Law">
          These Terms are governed by the laws of the Republic of India. Any
          disputes shall be subject to the exclusive jurisdiction of courts in
          Chennai, Tamil Nadu.
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: "easeOut",
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Box
              sx={{
                mt: 6,
                p: 4,
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 186, 0, 0.4)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 10px 28px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                color="text.primary"
                gutterBottom
                sx={{ textAlign: "center", color: "#ff9800" }}
              >
                📞 Contact Us
              </Typography>

              <Typography
                variant="body1"
                textAlign="center"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                For any questions regarding these Terms, please contact:
              </Typography>

              <Typography
                variant="body1"
                textAlign="center"
                sx={{ color: "#FF6F00" }}
              >
                <Email sx={{ verticalAlign: "middle", mr: 1 }} />
                <Link
                  href="mailto:ceo@MrFranchise.in"
                  color="inherit"
                  underline="hover"
                >
                  Email: ceo@MrFranchise.in
                </Link>
                <br />
                <Phone sx={{ verticalAlign: "middle", mr: 1 }} />
                <Link
                  href="tel:+919841323388"
                  color="#FF6F00"
                  underline="hover"
                >
                  Phone: +91 98413 23388
                </Link>
                <br />
                📍 Head Office:{" "}
                <Link
                  href="https://www.google.com/maps/place/Chennai,+Tamil+Nadu"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="#FF6F00"
                  underline="hover"
                >
                  Chennai, Tamil Nadu
                </Link>
              </Typography>
            </Box>
          </motion.div>
        </Section>
      </Container>
      <Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default TermsAndConditions;
