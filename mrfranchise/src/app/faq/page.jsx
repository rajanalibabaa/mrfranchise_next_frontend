"use client";
import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import Navbar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footers/Footer";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const FAQs = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 10 }}>
        <Navbar />
      </Box>

      <Box
        sx={{
          pt: 20,
          pb: 10,
          background: "#fdfaf4",
        }}
      >
        <Container>
          <Typography
            variant="h4"
            align="center"
            fontWeight={700}
            color="#ffba00"
            gutterBottom
          >
            Frequently Asked Questions
          </Typography>
          <Typography align="center" fontWeight="bold" mb={3} fontSize={25}>
            Everything you need to know about using MrFranchise.in
          </Typography>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <Typography mb={3} fontWeight="bold">
              🔹FOR BRAND OWNERS / BUSINESS LISTERS
            </Typography>
            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
                sx={accordionStyle}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="#7ad03a" />}
                >
                  <Typography color="#7ad03a" fontWeight={600}>
                    1. What is MrFranchise.in?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    <Link
                      href="https://www.mrfranchise.in"
                      target="_blank"
                      rel="noopener"
                      underline="hover"
                      color="black"
                    >
                      MrFranchise.in
                    </Link>{" "}
                    is a franchise consulting and business expansion platform
                    that helps brand owners convert their businesses into
                    scalable franchise models and reach qualified investors.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
                sx={accordionStyle}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="#7ad03a" />}
                >
                  <Typography color="#7ad03a" fontWeight={600}>
                    2. What services do you offer to business owners?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" component="div">
                    We offer end-to-end franchise development services,
                    including:
                    <ul style={{ paddingLeft: "2.2em", marginTop: "0.5em" }}>
                      <li>Strategic franchise planning</li>
                      <li>Legal documentation and franchise kit creation</li>
                      <li>Investor pitch deck</li>
                      <li>Marketing & promotional support</li>
                      <li>Investor lead generation and matchmaking</li>
                    </ul>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
                sx={accordionStyle}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="#7ad03a" />}
                >
                  <Typography color="#7ad03a" fontWeight={600}>
                    3. How can I list my brand on MrFranchise.in?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    Click on the <strong>“Add Listing”</strong> button on the
                    homepage, fill in your brand details, and submit. Our team
                    will review your application and connect with you to
                    proceed.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expanded === "panel4"}
                onChange={handleChange("panel4")}
                sx={accordionStyle}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="#7ad03a" />}
                >
                  <Typography color="#7ad03a" fontWeight={600}>
                    4. Is there a fee to list my business?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    Basic brand listings may be complimentary or promotional,
                    but premium services like consulting, marketing, and
                    investor campaigns are chargeable. Please contact us for a
                    customized quote.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expanded === "panel5"}
                onChange={handleChange("panel5")}
                sx={accordionStyle}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="#7ad03a" />}
                >
                  <Typography color="#7ad03a" fontWeight={600}>
                    5. Can you help if I already have a franchise model?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    Absolutely. We support businesses at all stages — whether
                    you're planning your first franchise or expanding an
                    existing network with professional investor outreach and
                    branding support.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>

            <Typography mb={3} fontWeight="bold">
              🔹FOR INVESTORS{" "}
            </Typography>
            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expanded === "panel6"}
                onChange={handleChange("panel6")}
                sx={accordionStyle}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="#7ad03a" />}
                >
                  <Typography color="#7ad03a" fontWeight={600}>
                    6. I want to invest in a franchise. How do I start?{" "}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    You can explore our listed brands based on industry,
                    location, and investment range. Each listing has an “Apply”
                    button to register your interest. You may also schedule a
                    consultation with our team.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expanded === "panel7"}
                onChange={handleChange("panel7")}
                sx={accordionStyle}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="#7ad03a" />}
                >
                  <Typography color="#7ad03a" fontWeight={600}>
                    7. Are the franchise opportunities verified?{" "}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    Yes, all featured brands undergo a screening process before
                    being published. Our consulting team ensures that only
                    legitimate and expansion-ready businesses are promoted on
                    the platform.{" "}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expanded === "panel8"}
                onChange={handleChange("panel8")}
                sx={accordionStyle}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="#7ad03a" />}
                >
                  <Typography color="#7ad03a" fontWeight={600}>
                    8. What is the typical investment range?{" "}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    We feature brands starting from ₹5 Lakhs to ₹1 Crore+,
                    covering sectors like F&B, retail, fashion, education,
                    fitness, and healthcare.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expanded === "panel9"}
                onChange={handleChange("panel9")}
                sx={accordionStyle}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="#7ad03a" />}
                >
                  <Typography color="#7ad03a" fontWeight={600}>
                    9. Will MrFranchise assist me in evaluating the right
                    opportunity?{" "}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    Yes, we offer investor advisory sessions to match you with
                    brands aligned to your investment goals, location
                    preference, and risk profile.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
            <Typography mb={3} fontWeight="bold">
              🔹 GENERAL & TECHNICAL
            </Typography>

            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expanded === "panel10"}
                onChange={handleChange("panel10")}
                sx={accordionStyle}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#7ad03a" }} />}
                >
                  <Typography color="#7ad03a" fontWeight={600}>
                    10. How do I contact support?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" component="div">
                    You can reach our team via:
                    <br />
                    <br />
                    📞{" "}
                    <Link
                      href="tel:+919841323388"
                      color="black"
                      underline="hover"
                      fontWeight="bold"
                    >
                      Phone: +91 98413 23388
                    </Link>
                    <br />
                    📧{" "}
                    <Link
                      href="mailto:ceo@MrFranchise.in"
                      color="black"
                      underline="hover"
                      fontWeight="bold"
                    >
                      Email: ceo@MrFranchise.in
                    </Link>
                    <br />
                    💬{" "}
                    <Link
                      href="https://wa.me/919841323388"
                      target="_blank"
                      rel="noopener"
                      color="black"
                      underline="hover"
                      fontWeight="bold"
                    >
                      WhatsApp Chat
                    </Link>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expanded === "panel11"}
                onChange={handleChange("panel11")}
                sx={accordionStyle}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="#7ad03a" />}
                >
                  <Typography color="#7ad03a" fontWeight={600}>
                    11. How secure is my data on MrFranchise.in?{" "}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    We use secure encryption and privacy protocols. Your
                    information is never shared with third parties without your
                    consent.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Accordion
                expanded={expanded === "panel12"}
                onChange={handleChange("panel12")}
                sx={accordionStyle}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="#7ad03a" />}
                >
                  <Typography color="#7ad03a" fontWeight={600}>
                    12. How long does it take to get investor leads after
                    listing?{" "}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    Typically, qualified leads begin to generate within 2–3
                    weeks depending on your selected campaign and visibility
                    level.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
      <Box>
        {" "}
        <Footer />
      </Box>
    </Box>
  );
};

const accordionStyle = {
  backgroundColor: "white",
  borderRadius: 2,
  mb: 2,
  boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
  },
};

export default FAQs;
