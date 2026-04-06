'use client'
import React, { useState ,useEffect} from "react";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { addRequest } from "@/Redux/Slices/userRequestSlice.jsx";

const CreateRequestForm = () => {
  const dispatch = useDispatch();

  const [brandId, setBrandId] = useState("");
  const [expanded, setExpanded] = useState("requestDetails");
  const [formData, setFormData] = useState({
    brandId,
    type: "",
    message: "",
    contactDetails: [
      {
        emergencyContactName: "",
        emergencyContactEmail: "",
        emergencyContactPhone: "",
      },
    ],
  });


   // ✅ SAFE: runs only in browser
  useEffect(() => {
    const storedBrandId = localStorage.getItem("brandUUID");
    if (storedBrandId) {
      setBrandId(storedBrandId);
      setFormData((prev) => ({ ...prev, brandId: storedBrandId }));
    }
  }, []);


  const handleAccordionChange = (panel) => (_, isExpanded) =>
    setExpanded(isExpanded ? panel : false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const updatedContacts = [...formData.contactDetails];
    updatedContacts[index][name] = value;
    setFormData((prev) => ({ ...prev, contactDetails: updatedContacts }));
  };



  const removeContact = (index) => {
    const updatedContacts = [...formData.contactDetails];
    updatedContacts.splice(index, 1);
    setFormData((prev) => ({ ...prev, contactDetails: updatedContacts }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.brandId) return alert("Brand ID missing!");

    dispatch(addRequest(formData));

    setFormData({
      brandId,
      type: "",
      message: "",
      contactDetails: [
        {
          emergencyContactName: "",
          emergencyContactEmail: "",
          emergencyContactPhone: "",
        },
      ],
    });
    setExpanded("requestDetails");
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        // boxShadow: 4,
        borderRadius: 3,
        // backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" mb={2} fontWeight="bold" color="warning">
        Create New Request
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Request Details */}
        <Accordion
          expanded={expanded === "requestDetails"}
          onChange={handleAccordionChange("requestDetails")}
          sx={{ mb: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              "& .MuiAccordionSummary-content": { alignItems: "center" },
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Request Details
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                select
                label="Request Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                fullWidth
              >
                <MenuItem value="Visibility Pause">Visibility Pause</MenuItem>
                <MenuItem value="Lead Pause">Lead Pause</MenuItem>
              </TextField>

              <TextField
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Contact Details */}
        <Accordion
          expanded={expanded === "contactDetails"}
          onChange={handleAccordionChange("contactDetails")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              "& .MuiAccordionSummary-content": { alignItems: "center" },
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Contact Details (Emergency)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {formData.contactDetails.map((contact, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Contact Name"
                      name="emergencyContactName"
                      value={contact.emergencyContactName}
                      onChange={(e) => handleContactChange(index, e)}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Contact Email"
                      type="email"
                      name="emergencyContactEmail"
                      value={contact.emergencyContactEmail}
                      onChange={(e) => handleContactChange(index, e)}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Contact Phone"
                      type="number"
                      maxLength={10}
                      inputProps={{ maxLength: 10 }}
                      
                      name="emergencyContactPhone"

                      value={contact.emergencyContactPhone}
                      onChange={(e) => handleContactChange(index, e)}
                      fullWidth
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {index > 0 && (
                      <IconButton
                        color="error"
                        onClick={() => removeContact(index)}
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            ))}

            {/* <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="outlined"
              color="primary"
              onClick={addContact}
            >
              Add Contact
            </Button> */}
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />

        <Button
          variant="contained"
          color="warning"
          type="submit"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Submit Request
        </Button>
      </Box>
    </Box>
  );
};

export default CreateRequestForm;
