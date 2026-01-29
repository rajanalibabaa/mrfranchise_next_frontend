"use client";
import React, { useState, useEffect } from 'react';


import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";

import axios from "axios";
import img from "../../assets/images/brandLogo.jpg";
import PersonIcon from '@mui/icons-material/Person';

const ManageProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [investorData, setInvestorData] = useState({});
const id = useSelector((state) => state.user.investorUUID);
    const AccessToken = useSelector((state) => state.auth.AccessToken);
    // console.log(id);
    // console.log(AccessToken);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://mrfranchisebackend.mrfranchise.in/api/v1/investor/getInvestor/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setInvestorData(response.data);
            } catch (error) {
                console.error("Error fetching investor data:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleManageProfileChange = (e) => {
        const { name, value } = e.target;
        setInvestorData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    // Helper function to safely render object values
    const renderValue = (value) => {
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'object') {
            return JSON.stringify(value); // or handle nested objects differently
        }
        return value;
    };

    const fieldLabels = [
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "email", label: "Email" },
        { key: "mobileNumber", label: "Phone" },
        { key: "whatsappNumber", label: "WhatsApp" },
        { key: "address", label: "Address" },
        { key: "city", label: "City" },
        { key: "district", label: "District" },
        { key: "state", label: "State" },
        { key: "country", label: "Country" },
        { key: "pincode", label: "Pincode" },
        { key: "occupation", label: "Occupation" },
        { key: "category", label: "Category" },
        { key: "investmentRange", label: "Investment Range" },
        { key: "capital", label: "Capital" },
        { key: "lookingFor", label: "Looking For" },
        { key: "ownProperty", label: "Own Property" },
    ];
    
    const renderTwoColumnForm = () => {
        const rows = [];

        for (let i = 0; i < fieldLabels.length; i += 2) {
            const field1 = fieldLabels[i];
            const field2 = fieldLabels[i + 1];

            rows.push(
                <Box key={i} sx={{ display: "flex", gap: 1, mb: 1, height: "100%" }}>
                    <TextField
                        fullWidth
                        label={field1.label}
                        name={field1.key}
                        value={investorData?.[field1.key] || ""}
                        onChange={handleManageProfileChange}
                        size="small"
                    />
                    {field2 ? (
                        <TextField
                            fullWidth
                            label={field2.label}
                            name={field2.key}
                            value={investorData?.[field2.key] || ""}
                            onChange={handleManageProfileChange}
                            size="small"
                        />
                    ) : (
                        <Box sx={{ flex: 1 }} />
                    )}
                </Box>
            );
        }

        return rows;
    };
  
    return (
        <div style={{ display: "flex", marginTop: -30 }}>
            <Box
                sx={{
                    p: 3,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 4,
                    boxShadow: 3,
                    mx: "auto",
                    mt: 4,
                    padding: 10,
                    height: "90vh",
                    width: "100%",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ mb: 3, fontWeight: 700, textAlign: "center", color: "#333" }}
                >
                    Investor Profile
                </Typography>

                {isEditing ? (
                    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {renderTwoColumnForm()}
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2, marginTop: -1 }}>
                            <Button variant="contained" color="primary" onClick={() => setIsEditing(false)} sx={{ backgroundColor: "#ffab00" }}>
                                Update
                            </Button>
                            <Button color="secondary" onClick={() => setIsEditing(false)} sx={{ backgroundColor: "#ffab00", color: "#fff" }}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                            <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ backgroundColor: "#ffab00" }}>
                                Edit Profile
                            </Button>
                        </Box>

                        <Box sx={{
                            width: 200, height: 200, marginTop: -20, textAlign: "center", padding: 2,
                            bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 2, marginLeft: -5
                        }}>
                            <Avatar sx={{ width: 200, height: 200, mx: "auto", mb: 2 }}>
                                <img
                                    src={img}
                                    loading='lazy'
                                    alt="Profile"
                                    style={{ width: "140%", height: "105%", borderRadius: "50%" }}
                                />
                                <PersonIcon fontSize="large" />
                            </Avatar>
                        </Box>

                        <Paper sx={{ 
                            p: 2, 
                            backgroundColor: "#fff", 
                            borderRadius: 2, 
                            border: "1px solid #ddd", 
                            marginTop: 2, 
                            marginLeft: -5,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: 2
                        }}>
                            {fieldLabels.map((field) => (
                                <Typography key={field.key}>
                                    <strong>{field.label}:</strong> {renderValue(investorData[field.key])}
                                </Typography>
                            ))}
                        </Paper>
                    </>
                )}
            </Box>
        </div>
    );
};

export default ManageProfile;