import React from 'react';
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Link, 
  ListItemIcon,
  Button,
  Box, 
  Paper 
} from '@mui/material';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const aboutData = {
  Heading: "About MrFranchise.in",
  mainHeading: "India’s Leading Platform for Franchise Opportunities & Business Expansion",
  introParagraphs: [
    "Looking to invest in a profitable business model with proven success? Welcome to MrFranchise.in, India’s fast-growing platform to explore the best franchise opportunities in India across multiple industries, investment levels, and cities. Whether you are a first-time entrepreneur or an experienced investor, our platform helps you discover and connect with verified franchise brands, making it easier to start your franchise business with confidence. From low investment franchise opportunities to premium business models, MrFranchise bridges the gap between brands and investors through a powerful digital ecosystem."
  ],
  ctaTitle: "Explore top opportunities:",
  opportunities: [
    { text: "Food Franchise Opportunities", url: "/food-and-beverages-franchise-opportunities-/?maincat=Food%20%26%20Beverages" },
    { text: "Retail Franchise Opportunities", url: "/retail-franchise-opportunities-/?maincat=Retail" },
    { text: "Salon Franchise Opportunities", url: "/beauty-and-salon-franchise-opportunities-/?maincat=Beauty%20%26%20Salon" },
    { text: "Education Franchise Opportunities", url: "/education-franchise-opportunities-/?maincat=Education" },
  ],
};

const AboutMrFranchise = () => {
  return (
   <Box  sx={{
      pl: { xs: 2, md: 8 },
      pr: { xs: 2, md: 8 },
        py: 3,
    backgroundColor:'#f9f9f9', 
   }}>
          {/* Section Title */}
        <Typography
  variant="h6"
  fontWeight="bold"
  sx={{ mt: 1}}
>
  {aboutData.Heading}
</Typography>


          {/* Main Sub-heading */}
        <Typography
  variant="body1"
  gutterBottom
            sx={{ fontWeight: 300,  color: 'text.primary', }}
>
  {aboutData.mainHeading}
</Typography>
     

          {/* Intro Paragraphs */}
          {aboutData.introParagraphs.map((para, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ 
                color: 'text.secondary', 
              mb: 1,
           
              }}
            >
              {para}
            </Typography>
          ))}

          {/* Opportunities Section */}
          <Box >
            <Typography variant="body" gutterBottom sx={{ fontWeight: 'bold' }}>
              {aboutData.ctaTitle}
            </Typography>

            <Box >
    <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent:"center",
    gap: 1,
  }}
>
  {aboutData.opportunities.map((item, index) => (
    <React.Fragment key={index}>
      
      <Link
        href={item.url}
        underline="hover"
        sx={{
          color: "#ff9900",
          fontSize: "0.9rem",
        }}
      >
         {item.text}
      </Link>

      {/* Add || only if NOT last item */}
      {index !== aboutData.opportunities.length - 1 && (
        <Typography sx={{ color: "#999", fontSize: "0.9rem" }}>
          |
        </Typography>
      )}

    </React.Fragment>
  ))}
</Box>
            </Box>
          </Box>

            {/* Heading */}
                         <Typography
                     variant="h6"
                     fontWeight="bold"
                     sx={{ mt: 2, mb:1}}
                   >
                      Why Choose Franchise Business in India?
                    </Typography>
          
                    {/* Intro */}
                    <Typography   variant="body2" 
                        sx={{ 
                          color: 'text.secondary', 
                        mb: 1,
                     
                        }}>
                      The franchise industry in India is growing rapidly due to its 
                      structured business model, brand recognition, and lower risk 
                      compared to starting a business from scratch. By choosing the right franchise opportunity, you benefit from:
                    </Typography>
          
                    
          
                    {/* List */}
                 <List
            sx={{
              display: "flex",
              flexDirection: "row",
            justifyContent: "space-around",
              p: 0,
            }}
          >
            {[
              "Proven business systems",
              "Established brand value",
              "Marketing and operational support",
              "Faster break-even and ROI",
            ].map((item, index) => (
              <ListItem
                key={index}
                disableGutters
                sx={{
                  width: "auto", // prevents full width
                  p: 0,
                }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <CheckCircleIcon sx={{ color: "#ff9900", fontSize: "1rem" }} />
                </ListItemIcon>
          
                <ListItemText
                  primary={item}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                  }}
                />
              </ListItem>
            ))}
          </List>
          
                    {/* Closing Text */}
           <Typography   variant="body2" 
                        sx={{ 
                          color: 'text.secondary', 
                        mb: 1, mt: 1,
                     
                        }}>            If you're planning to start your food franchise, retail franchise, 
                      or service-based franchise, this is the right time to invest in a 
                      scalable and profitable business model.
                    </Typography>
          
                    {/* CTA Button */}
                    <Box textAlign="center" mt={1}>
                      <Button
                        variant="contained"
                        href="/how-to-start-franchise-business-india"
                        sx={{
                          backgroundColor: "#ff9900",
                          color: "#000000ba",
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: "#e68a00",
                          },
                        }}
                      >
                         Learn More
                      </Button>
                    </Box>
          
        </Box>
  );
};

export default AboutMrFranchise;