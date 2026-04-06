import React from "react";
import {
  Box,
  Typography,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FreeFranchise = () => {
  const faqs = [
    {
      question: "What is a franchise business?",
      answer:
        "A franchise business is a model where you operate under an established brand using its systems and processes."
    },
    {
      question: "Which franchise is best in India?",
      answer: (
        <>
          The best franchise depends on your investment, location, and industry preference. Explore options here:{" "}
          <Link
            href="/franchise-opportunities-india"
            underline="hover"
            sx={{ color: "#ff9900", fontSize: "0.9rem" }}
          >
            franchise opportunities in India
          </Link>
        </>
      )
    },
    {
      question: "How much investment is required to start a franchise?",
      answer:
        "Investment varies from ₹2 lakhs to ₹50 lakhs depending on the brand and industry."
    },
    {
      question: "Is franchise business profitable?",
      answer:
        "Yes, franchising offers higher success rates due to proven business models and brand support."
    }
  ];

  return (
    <Box
      sx={{
        pl: { xs: 2, md: 8 },
        pr: { xs: 2, md: 8 },
        py: 3,
        backgroundColor: "#dedede"
      }}
    >
      {/* Heading */}
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 2, textAlign: "center" }}
      >
        Frequently Asked Questions (FAQs)
      </Typography>

      {/* Center Wrapper */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {faqs.map((faq, index) => (
        <Box
  key={index}
  expanded={true}
  sx={{
    borderRadius: "8px",
    maxWidth: "800px",
    width: "100%",
    backgroundColor: "#fff",

    // margin: 0,
    marginBottom: 3,
    "&:before": {
      display: "none" 
    }
  }}
>
            <AccordionSummary >
              <Typography fontWeight="bold">{faq.question}</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FreeFranchise;