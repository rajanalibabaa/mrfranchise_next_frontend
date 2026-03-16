"use client";
import { Card, CardContent, Typography, Box } from "@mui/material";

const PackageCard = ({ data, color = "black", background = "#ddddddc6" }) => {
  return (
    <Card
      sx={{
Width: {
  xs: 200,  // 📱 mobile
  sm: 250, 
      // tablet and above
},        borderRadius: 1.5,
        boxShadow: 1,
        border: "1px solid #ddd",
        backgroundColor: background,
        color: color,
        position: "relative", 
      }}
    >
    
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          background: data.isActive ? "#5cbe24" : "#bb0c0c",
          color: "white",
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "10px",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {data.isActive ? "Active" : "closed"}
      </Box>

      <CardContent sx={{ p: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, textTransform: "capitalize", mb: 0.5 }}
        >
          {data.packageType} Package
        </Typography>

        <Box sx={{ fontSize: "11px", lineHeight: 1.4 }}>
          <div>
            <strong>Start Date:</strong>{" "}
            {data?.packageUpdatedTime
              ? new Date(data.packageUpdatedTime).toLocaleDateString()
              : data?.packageStartTime}
          </div>
          <div>
            <strong>End Date:</strong>{" "}
            {data?.packageUpdatedTime
              ? new Date(data.packageUpdatedTime).toLocaleDateString()
              : data?.packageEndTime}
          </div>
        </Box>

        <Box sx={{ fontSize: "11px", lineHeight: 1.4, mt: 1 }}>
          <div>
            <strong>Amount:</strong> ₹{data.totalAmount}
          </div>
          <div>
            <strong>Months:</strong> {data.totalMonths}
          </div>
          <div>
            <strong>PM Leads Commitment:</strong> {data.perMonthLead}
          </div>
          <div>
            <strong>Total Leads Commitment:</strong> {data.totalLeads}
          </div>
          <div>
            <strong>Sent Percentage:</strong>{" "}
            {data.sentLeadsPercentage ? data.sentLeadsPercentage : "0%"}
          </div>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PackageCard;
