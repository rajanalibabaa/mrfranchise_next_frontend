const plans = [
  {
    category: "FRANCHISE LAUNCH PLAN",
    plans: [
      {
        name: "SILVER",
        code: "BS1",
        investmentRange: "Upto 50 Lakhs",
        leadsPerState: 20,
        validity: "30 Days",
        pricing: {
          singleState: { amount: 3000, leads: 20 },
          twoStates: { amount: 6000, leads: 40 },
          threeStates: { amount: 9000, leads: 60 },
          fiveStates: { amount: 15000, leads: 100 },
          panIndia: { amount: 45000, leads: 300 }
        }
      },
      {
        name: "GOLD",
        code: "BG1",
        investmentRange: "50 Lakhs to 2 Crores",
        leadsPerState: 20,
        validity: "30 Days",
        pricing: {
          singleState: { amount: 4000, leads: 20 },
          twoStates: { amount: 8000, leads: 40 },
          threeStates: { amount: 12000, leads: 60 },
          fiveStates: { amount: 20000, leads: 100 },
          panIndia: { amount: 60000, leads: 300 }
        }
      },
      {
        name: "DIAMOND",
        code: "BD1",
        investmentRange: "2 Crores to 20 Crores",
        leadsPerState: 20,
        validity: "30 Days",
        pricing: {
          singleState: { amount: 7000, leads: 20 },
          twoStates: { amount: 14000, leads: 40 },
          threeStates: { amount: 21000, leads: 60 },
          fiveStates: { amount: 35000, leads: 100 },
          panIndia: { amount: 105000, leads: 300 }
        }
      }
    ]
  },

  {
    category: "EXPANTION ENGINE PLAN",
    plans: [
      {
        name: "SILVER",
        code: "AS1",
        investmentRange: "Upto 50 Lakhs",
        leadsPerState: 60,
        validity: "90 Days",
        pricing: {
          singleState: { amount: 9000, leads: 60 },
          twoStates: { amount: 18000, leads: 120 },
          threeStates: { amount: 27000, leads: 180 },
          fiveStates: { amount: 45000, leads: 300 },
          panIndia: { amount: 135000, leads: 900 }
        }
      },
      {
        name: "GOLD",
        code: "AG1",
        investmentRange: "50 Lakhs to 2 Crores",
        leadsPerState: 60,
        validity: "90 Days",
        pricing: {
          singleState: { amount: 12000, leads: 60 },
          twoStates: { amount: 24000, leads: 120 },
          threeStates: { amount: 36000, leads: 180 },
          fiveStates: { amount: 60000, leads: 300 },
          panIndia: { amount: 180000, leads: 900 }
        }
      },
      {
        name: "DIAMOND",
        code: "AD1",
        investmentRange: "2 Crores to 20 Crores",
        leadsPerState: 60,
        validity: "90 Days",
        pricing: {
          singleState: { amount: 21000, leads: 60 },
          twoStates: { amount: 42000, leads: 120 },
          threeStates: { amount: 63000, leads: 180 },
          fiveStates: { amount: 105000, leads: 300 },
          panIndia: { amount: 315000, leads: 900 }
        }
      }
    ]
  },

  {
    category: "SCALE ACCELERATION PLAN",
    plans: [
      {
        name: "SILVER",
        code: "GS1",
        investmentRange: "Upto 50 Lakhs",
        leadsPerState: 120,
        validity: "180 Days",
        pricing: {
          singleState: { amount: 18000, leads: 120 },
          twoStates: { amount: 36000, leads: 240 },
          threeStates: { amount: 54000, leads: 360 },
          fiveStates: { amount: 90000, leads: 600 },
          panIndia: { amount: 270000, leads: 1800 }
        }
      },
      {
        name: "GOLD",
        code: "GG1",
        investmentRange: "50 Lakhs to 2 Crores",
        leadsPerState: 120,
        validity: "180 Days",
        pricing: {
          singleState: { amount: 24000, leads: 120 },
          twoStates: { amount: 48000, leads: 240 },
          threeStates: { amount: 72000, leads: 360 },
          fiveStates: { amount: 120000, leads: 600 },
          panIndia: { amount: 360000, leads: 1800 }
        }
      },
      {
        name: "DIAMOND",
        code: "GD1",
        investmentRange: "2 Crores to 20 Crores",
        leadsPerState: 120,
        validity: "180 Days",
        pricing: {
          singleState: { amount: 42000, leads: 120 },
          twoStates: { amount: 84000, leads: 240 },
          threeStates: { amount: 126000, leads: 360 },
          fiveStates: { amount: 210000, leads: 600 },
          panIndia: { amount: 630000, leads: 1800 }
        }
      }
    ]
  },

  {
    category: "MARKET DOMINANCE PLAN",
    plans: [
      {
        name: "SILVER",
        code: "ES1",
        investmentRange: "Upto 50 Lakhs",
        leadsPerState: 240,
        validity: "365 Days",
        pricing: {
          singleState: { amount: 36000, leads: 240 },
          twoStates: { amount: 72000, leads: 480 },
          threeStates: { amount: 108000, leads: 720 },
          fiveStates: { amount: 180000, leads: 1200 },
          panIndia: { amount: 540000, leads: 3600 }
        }
      },
      {
        name: "GOLD",
        code: "EG1",
        investmentRange: "50 Lakhs to 2 Crores",
        leadsPerState: 240,
        validity: "365 Days",
        pricing: {
          singleState: { amount: 48000, leads: 240 },
          twoStates: { amount: 96000, leads: 480 },
          threeStates: { amount: 144000, leads: 720 },
          fiveStates: { amount: 240000, leads: 1200 },
          panIndia: { amount: 720000, leads: 3600 }
        }
      },
      {
        name: "DIAMOND",
        code: "ED1",
        investmentRange: "2 Crores to 20 Crores",
        leadsPerState: 240,
        validity: "365 Days",
        pricing: {
          singleState: { amount: 84000, leads: 240 },
          twoStates: { amount: 168000, leads: 480 },
          threeStates: { amount: 252000, leads: 720 },
          fiveStates: { amount: 420000, leads: 1200 },
          panIndia: { amount: 1260000, leads: 3600 }
        }
      }
    ]
  },

  {
    category: "FREE PLAN",
    plans: [
      {
        name: "LISTING",
        code: "FL1",
        investmentRange: "ALL",
        leadsPerState: 0,
        validity: "365 Days",
        pricing: {}
      }
    ]
  }
  
];

export default plans;