// import React from "react";

// export const categories = [
//   // {
//   //   name: "Automotive",
//   //   children: [
//   //     {
//   //       name: "Automobile Related",
//   //       subChild: [
//   //         "Automobile Accessories",
//   //         "Automobile Garage Related",
//   //         "Automobile Maintanance Related",
//   //         "Automobile Spares / Tyre",
//   //         "Road Safety Equipments",
//   //         "Security & Helpline Services",
//   //         "Web Based/Online Platform",
//   //       ],
//   //     },
//   //     {
//   //       name: "Commercial Vehicles",
//   //       subChild: [
//   //         "Commercial Vehicles Bus/Trucks",
//   //         "Commercial Electric Vehicles (EV)",
//   //         "Off Road / All Terrain Vehicles",
//   //         "Three Wheeler (Auto) Showroom",
//   //         "Tractors",
//   //       ],
//   //     },
//   //     {
//   //       name: "Four Wheeler",
//   //       subChild: [
//   //         "Car Exterior Parts",
//   //         "Car Interior Accessories",
//   //         "Car Interior Spare Parts",
//   //         "Car Maintanance & Repair Services",
//   //         "Car Rental",
//   //         "Car Reselling",
//   //         "Car Showroom",
//   //         "Car Wash / Ceramic Coating / Detailing",
//   //         "Electric Vehicles Four Wheelers (EV)",
//   //       ],
//   //     },
//   //     {
//   //       name: "Two Wheeler",
//   //       subChild: [
//   //         "Bicycle",
//   //         "Bike Maintanance & Repair Services",
//   //         "Bike Rental",
//   //         "Bike Showroom",
//   //         "Bike Wash",
//   //         "Biker's Accessories",
//   //         "Electric Vehicles Two Wheelers (EV)",
//   //       ],
//   //     },
//   //   ],
//   // },
//   // {
//   //   name: "Beauty & Health",
//   //   children: [
//   //     {
//   //       name: "Beauty Aesthetics & Supplies",
//   //       subChild: [
//   //         "Bath Products",
//   //         "Beauty Equipments",
//   //         "Beauty Salons/ Unisex Salons/ Spa",
//   //         "Cosmetic Accessories",
//   //         "Cosmetics & Beauty Product Stores",
//   //         "Pet Grooming",
//   //         "Tattoo, Piercing & Nail Art",
//   //       ],
//   //     },
//   //     {
//   //       name: "Health Care",
//   //       subChild: [
//   //         "Ayurvedic & Herbal Products",
//   //         "Fitness & Gym Equipments",
//   //         "Fitness Centres",
//   //         "Health & Wellness Centres",
//   //         "Health Care Services",
//   //         "Medical Equipment & Supplies",
//   //         "Nutrition & Supplements",
//   //         "Pharmacy",
//   //       ],
//   //     },
//   //     {
//   //       name: "Wellness",
//   //       subChild: [
//   //         "Fitness & Gym Equipments",
//   //         "Health & Wellness Centres",
//   //         "Health Care Services",
//   //         "Medical Equipment & Supplies",
//   //         "Nutrition & Supplements",
//   //         "Pharmacy",
//   //       ],
//   //     },
//   //   ],
//   // },
//   // {
//   //   name: "Business Services",
//   //   children: [
//   //     {
//   //       name: "Advertising & Marketing",
//   //       subChild: [
//   //         "Advertising & Marketing Agencies",
//   //         "Digital Marketing",
//   //         "Event Management",
//   //         "Public Relations",
//   //         "Social Media Marketing",
//   //       ],
//   //     },
//   //     {
//   //       name: "Business Consulting",
//   //       subChild: [
//   //         "BPO",
//   //         "Business",
//   //         "Career Counseling",
//   //         "Financial",
//   //         "HR & Recruitment",
//   //         "Immigration",
//   //         "Legal",
//   //         "Matrimonial",
//   //         "Others Consultancy",
//   //         "Real Estate",
//   //         "Service For SMEs",
//   //         "Technology",
//   //       ],
//   //     },
//   //     {
//   //       name: "Financial Services",
//   //       subChild: [
//   //         "Accounting & Auditing Services",
//   //         "Equity & Debt Providers",
//   //         "Finance Advisors & Brokers",
//   //         "Financial Investment & Trading",
//   //         "Foreign Exchange (FOREX)",
//   //         "Insurance",
//   //         "Microfinance",
//   //         "Non Banking Financial Company (NBFC)",
//   //         "Others Financial",
//   //         "Payment Solution Services",
//   //         "Post Office Services",
//   //         "Tax Consulting Services",
//   //         "Wealth Management",
//   //       ],
//   //     },
//   //     {
//   //       name: "Household Services",
//   //       subChild: [
//   //         "Electrical & Plumbing Services",
//   //         "Facility Management",
//   //         "Gardening Services",
//   //         "Home Appliances Repair Services",
//   //         "Home Renovation Services",
//   //         "Home Safety & Security",
//   //         "Housekeeping",
//   //         "Institutional/Facility Cleaning",
//   //         "Laundry & Dry Cleaning",
//   //         "Pest Control",
//   //         "Repair Services",
//   //       ],
//   //     },
//   //     {
//   //       name: "IT Services",
//   //       subChild: [
//   //         "Application Development",
//   //         "Cloud Services",
//   //         "Computer Hardware & Software",
//   //         "Data Science & Analytics",
//   //         "Domain & Hosting Services",
//   //         "ERP Solutions",
//   //         "IT Consulting",
//   //         "IT Infrastructure Management",
//   //         "Mobile App Development",
//   //         "Networking & Security Services",
//   //         "Software Development",
//   //         "Web Development",
//   //       ],
//   //     },
//   //     {
//   //       name: "Logistics & Transportation",
//   //       subChild: [
//   //         "Cargo & Freight Services",
//   //         "Courier Services",
//   //         "Freight Forwarding",
//   //         "International Logistics",
//   //         "Logistics Aggregators",
//   //         "Packers & Movers",
//   //         "Transportation",
//   //       ],
//   //     },
//   //     {
//   //       name: "Real Estate",
//   //       subChild: ["Commercial Real Estate", "Residential Real Estate"],
//   //     },
//   //     {
//   //       name: "Travel & Tourism",
//   //       subChild: [
//   //         "Adventure Tourism",
//   //         "Air Ticketing Services",
//   //         "Car Rentals",
//   //         "Cruise Services",
//   //         "Domestic Tour Operators",
//   //         "Foreign Tour Operators",
//   //         "Hotel & Resort Booking Services",
//   //         "Railway Ticketing Services",
//   //         "Travel Insurance",
//   //       ],
//   //     },
//   //     {
//   //       name: "waste Management & Recycling",
//   //       subChild: [
//   //         "E-Waste Recycling",
//   //         "Hazardous Waste Management",
//   //         "Plastic Waste Management",
//   //         "Waste Collection & Disposal",
//   //         "Waste Recycling",
//   //       ],
//   //     },
//   //   ],
//   // },
//   // {
//   //   name: "Education & Training",
//   //   children: [
//   //     {
//   //       name: "Coaching & Tutoring",
//   //       subChild: [
//   //         "CAD/CAM/CAE & Multimedia",
//   //         "Competitive Exam Coaching Institute",
//   //         "Online Coaching",
//   //         "Robotics & Technical Training/ AI",
//   //         "School Tutoring",
//   //       ],
//   //     },
//   //     {
//   //       name: "Early Education",
//   //       subChild: ["Day Care", "Montessori Schools", "Preschools/Play Schools"],
//   //     },
//   //     {
//   //       name: "Education Consultants",
//   //       subChild: ["Education Consultants", "Overseas Education Consultants"],
//   //     },
//   //     {
//   //       name: "Education Services",
//   //       subChild: [
//   //         "Education Services",
//   //         "Educational Institutions",
//   //         "Educational Software & Apps",
//   //         "Online Learning Platforms",
//   //       ],
//   //     },
//   //     {
//   //       name: "Higher Education",
//   //       subChild: [
//   //         "Degree/Diploma Colleges",
//   //         "Distance Learning Centres",
//   //         "Professional Education Colleges",
//   //         "Universities (including Overseas Franchises)",
//   //       ],
//   //     },
//   //     {
//   //       name: "online Learning",
//   //       subChild: [
//   //         "Certification Course Coaching",
//   //         "Corporate Training",
//   //         "Entrance Examination Coaching",
//   //         "Foreign Language Coaching",
//   //         "Online Learning/E-learning",
//   //         "Other Online Education",
//   //         "Professional Education Coaching",
//   //       ],
//   //     },
//   //     {
//   //       name: "Vocational Training",
//   //       subChild: [
//   //         "Aviation & Hospitality Training Institute",
//   //         "BPO/KPO Training Institutes",
//   //         "Banking & Insurance Training Institute",
//   //         "Beauty & Wellness Training Institute",
//   //         "Financial Advisory",
//   //         "HR Certification Institute",
//   //         "IT Education",
//   //         "Language Schools",
//   //         "Other Vocational Training",
//   //         "Paramedical/Medical Training",
//   //         "Retail Training Institutes",
//   //         "Skills / Personality Development",
//   //       ],
//   //     },
//   //   ],
//   // },
//   // {
//   //   name: "Fashion & Lifestyle",
//   //   children: [
//   //     {
//   //       name: "Accessories",
//   //       subChild: [
//   //         "Bags & Luggage",
//   //         "Belt & Wallets",
//   //         "Eyewear",
//   //         "Fashion Accessories",
//   //         "Footwear",
//   //         "Jewellery",
//   //         "Watches",
//   //       ],
//   //     },
//   //     {
//   //       name: "Clothing",
//   //       subChild: [
//   //         "Apparel & Garments",
//   //         "Clothing Accessories",
//   //         "Fabric & Textile",
//   //         "Footwear",
//   //         "Garment Manufacturing",
//   //         "Jewellery",
//   //         "Leather Garments",
//   //         "Textile Machinery & Equipment",
//   //       ],
//   //     },
//   //     {
//   //       name: "Cosmetics & Beauty Products",
//   //       subChild: [
//   //         "Beauty & Personal Care",
//   //         "Cosmetics & Beauty Products",
//   //         "Cosmetics & Beauty Product Stores",
//   //         "Health & Wellness Centres",
//   //         "Medical Equipment & Supplies",
//   //       ],
//   //     },
//   //   ],
//   // },
//   {
//     name: "Food & Beverages",
//     children: [
//       {
//         groupId:"A",
//         name: "Food Franchises",
//         children: [
//           "QSR (Quick Service Restaurants)",
//           " Casual Dining",
//           "Fine Dining",
//           "Multi Cuisine Restaurants",
//           "Indian / South Indian / North Indian",
//           "Chinese / Pan-Asian",
//           "Italian / Continental",
//           "BBQ / Grills / Burgers / Pizza",
//           "Vegan Restaurants",
//           "Vegetarian-Only Restaurants",
//           "Seafood-Based Restaurants",
//         ],
//       },
//       {
//         groupId:"B",
//         name: "Beverage Franchises",
//         children: ["Coffee & Tea Cafes",
//            "Juice & Smoothie Bars",
//            "Functional Beverages",
//            "Alcoholic Beverage Lounges",
//            "Bubble Tea",
//            "Specialty Coffee Roasters",
//            "Vegan Smoothie Brands",
//            "Ayurvedic / Herbal Juices",
//            "Kombucha / Probiotic Drinks",
//            "Sports / Energy Beverages",
//           ],
//       },
//       {  
//         groupId:"C",
//         name: "Dessert & Bakery",
//         children: [
//           "Bakeries & Patisseries",
//           "Ice Cream & Frozen Dessert Parlors",
//           "Chocolatiers",
//           "Custom Cakes",
//           "Artisanal Breads",
//           "Frozen Yogurt / Gelato",
//           "Vegan Cakes & Desserts",
//           "Gluten-Free Desserts",
//           "Indian Mithai / Fusion Sweets",
//         ],
//       },
//       {
//         groupId:"D",
//         name: "Cloud Kitchens & Delivery",
//         children: [
//           "Multi-Brand Cloud Kitchens",
//           "Niche Delivery Kitchens",
//           "Virtual Restaurant Brands",
//           "Indian Combo Kitchens",
//           "Healthy Meal Plans",
//           "Vegan Meal Delivery",
//           "Dabba / Tiffin Services",
//           "Biryani Specialists",
//           "Global Cuisine Cloud Concepts",
//         ],
//       },
//       {  
//         groupId:"E",
//         name: "Food Trucks & Kiosks Franchises",
//         children: [
//           "Street Food Vans",
//           "Mall Food Kiosks",
//           "Compact Beverage Counters",
//           "South Indian Snacks",
//           "Burger / Sandwich Counters",
//           "Vegan Street Food",
//           "Chaat Counters",
//           "Corn / Popcorn / Ice Gola Stalls",
          
//         ],
//       },
//       {
//         groupId:"F",
//         name: "Food Equipment & Machinery Franchises",
//         children: [
//           "Commercial Kitchen Equipment",
//           "Bakery Equipment",
//           "Cold Storage & Display",
//           "Smart Automation & POS",
//           "Food Packaging Machines",
//           "Ovens / Fryers / Mixers",
//           "Cold Press Juicers",
//           "Composting / Waste Management",
//           "Billing Machines / POS Systems",
//           "Vacuum Packing / Sealing Machines",
//           "Refrigeration & Cold Chain Equipment",
//         ],
//       },
//       {
//         groupId:"G",
//         name: "Catering & Institutional Food ",
//         children: [
//           "Corporate & Institutional Catering",
//           "School & College Catering",
//           "Event & Outdoor Catering",
//           "Hospital & Wellness Catering",
//           "Veg Catering Services",
//           "Buffet Setup Providers",
//           "Industrial Meal Prep Kitchens",
//           "Plant-Based Institutional Catering",
//           "Community Kitchen Franchises",
//         ],
//       },
//       {
//         groupId:"H",
//         name: "Organic, vegan & Health Foods",
//         children: [
//           "Vegan & Plant-Based Cafes",
//           "Organic & Natural Food Brands",
//           "Health-Focused Restaurants",
//           "Diet/Nutrition Based Meal Services",
//           "Immunity Boosting/Functional Foods",
//           "Vegan Meal Plan Delivery",
//           "Plant-Based Protein / Supplements Cafes",
//           "Gluten-Free / Keto / Paleo Kitchens",
//           "Ayurvedic / Herbal Food Kitchens",
//           "Vegan Packaged Food & Snacks",
//           "Clean Label / No Preservative Brands",
//         ],
//       },
//       {
//         groupId:"I",
//         name: "Regional & Ethnic Cuisine",
//         children: [
//           "South Indian",
//           "North Indian",
//           "Bengali, Gujarati, Maharashtrian",
//           "Chettinad / Kerala Cuisine",
//           "Middle Eastern / Mediterranean",
//           "Pan-Asian / Thai / Oriental",
//           "Tandoori / Mughlai Kitchens",
//           "Ethnic Veg Thali Concepts",
//           "Vegan Fusion with Ethnic Cuisine",
//           "Coastal Cuisine",
//           "Tribal / Folk Food Concepts",
//         ],
//       },
//       {
//         groupId:"J",
//         name: "F & B Franchise Stores",
//         children: [
//           "Grocery & Provisional Stores",
//           "Fruits & Vegetables Outlets",
//           "Organic & Natural Food Marts",
//           "Dairy & Milk Product Stores",
//           "Dry Fruits, Spices & Masalas",
//           "Meat & Seafood Outlets",
//           "Imported / Gourmet Food Stores",
//           "Vegan & Plant-Based Grocery Stores",
//           "Healthy & Diet Food Retail",
//           "Kirana Store Format",
//           "Hyperlocal Delivery Enabled",
//           "Franchise Supermarket Chains",
//           "Direct-from-Farm Concepts",
//           "Cold Chain Store Concepts",
//           "Subscription Model Grocery Stores",
//           "Pre-Mixed / Ready-to-Cook Food Stores",
//           "Ayurvedic / Herbal Food Retail",
//           "Frozen Foods & Packaged Meat",
//           "Dairy Chains (Milk, Curd, Paneer, Ice Cream)",
//         ],
//       },
//       // {
//       //   name: "Restaurant & Night Clubs",
//       //   children: [
//       //     "Casual Dine Restaurants",
//       //     "Fine Dine Restaurants",
//       //     "Multi Cuisine Restaurant",
//       //     "Theme Restaurants",
//       //     "Bars, Pubs & Lounge",

//       //   ],
//       // },
//       //  {
//       //   name: "Cafe & Parlors",
//       //   children: [
//       //     "Cafe Shops",
//       //     "Juices", "Smoothies"," Dairy Parlors",
//       //     "Tea And Coffee Chain",
//       //   ],
//       // },
//       //  {
//       //   name: "Services",
//       //   children: [
//       //     "Food Delivery ",
//       //     "catering ",
          
//       //   ],
//       // },
//       //  {
//       //   name: "Food Equipment",
//       //   children: [
          
//       //     " Kitchen Equipment ",
//       //     "food Preparation Equipment ",
//       //     "Bakery Equipment ",
        
//       //   ],
//       // },
//       //  {
//       //   name: "Food Products",
//       //   children: [
//       //     "Provession Stores",
//       //     "Meat Shops",
//       //     "Fruits & Vegetables",
//       //   ],
//       // },
//       // {
//       //   name: "Bakery, Sweets & Ice Cream",
//       //   children: [
//       //     "Bakery & Confectionary",
//       //     " Chocolate Stores",
//       //     "Snacks / Namkeen Shops",
//       //     "Sweetshop",
//       //     "Ice Creams & Yogurt Parlors",
//       //   ],
//       // },
//       // {
//       //   name: "Catering & Food Services",
//       //   children: ["Catering Service", "Online Food Ordering Services"],
//       // },
     
//       // {
//       //   name: "Food & Beverage",
//       //   children: [
//       //     "Beverages",
//       //     "Hotel Equipment and Supplier",
//       //     "Others Food Service",
//       //   ],
//       // },
      
      
//     ],
//   },
//   // {
//   //   name: "HomeBased Business Services",
//   //   children: [
//   //     {
//   //       name: "Beauty & Personal Care",
//   //       children: [
//   //         "Beauty & Personal Care",
//   //         "Cosmetics & Beauty Products",
//   //         "Cosmetics & Beauty Product Stores",
//   //         "Health & Wellness Centres",
//   //         "Medical Equipment & Supplies",
//   //       ],
//   //     },
//   //     {
//   //       name: "Business Services",
//   //       children: [
//   //         "Accounting & Auditing Services",
//   //         "Equity & Debt Providers",
//   //         "Finance Advisors & Brokers",
//   //         "Financial Investment & Trading",
//   //         "Foreign Exchange (FOREX)",
//   //         "Insurance",
//   //         "Microfinance",
//   //         "Non Banking Financial Company (NBFC)",
//   //         "Others Financial",
//   //         "Payment Solution Services",
//   //         "Post Office Services",
//   //         "Tax Consulting Services",
//   //         "Wealth Management",
//   //       ],
//   //     },
//   //     {
//   //       name: "repair & Maintenance",
//   //       children: [
//   //         "Electrical & Plumbing Services",
//   //         "Facility Management",
//   //         "Gardening Services",
//   //         "Home Appliances Repair Services",
//   //         "Home Renovation Services",
//   //         "Home Safety & Security",
//   //         "Housekeeping",
//   //         "Institutional/Facility Cleaning",
//   //         "Laundry & Dry Cleaning",
//   //         "Pest Control",
//   //         "Repair Services",
//   //       ],
//   //     },
//   //     {
//   //       name: "technology & Releated",
//   //       children: [
//   //         "Application Development",
//   //         "Cloud Services",
//   //         "Computer Hardware & Software",
//   //         "Data Science & Analytics",
//   //         "Domain & Hosting Services",
//   //         "ERP Solutions",
//   //         "IT Consulting",
//   //         "IT Infrastructure Management",
//   //         "Mobile App Development",
//   //         "Networking & Security Services",
//   //         "Software Development",
//   //         "Web Development",
//   //       ],
//   //     },
//   //   ],
//   // },
//   // {
//   //   name: "Hotels & Resorts",
//   //   children: [
//   //     {
//   //       name: "Hotels",
//   //       subChild: ["Hotel Booking Services", "Hotels & Resorts"],
//   //     },
//   //     {
//   //       name: "Resorts",
//   //       subChild: ["Hotel Booking Services", "Hotels & Resorts"],
//   //     },
//   //     {
//   //       name: "Travel & Tourism",
//   //       subChild: [
//   //         "Adventure Tourism",
//   //         "Air Ticketing Services",
//   //         "Car Rentals",
//   //         "Cruise Services",
//   //         "Domestic Tour Operators",
//   //         "Foreign Tour Operators",
//   //         "Hotel & Resort Booking Services",
//   //         "Railway Ticketing Services",
//   //         "Travel Insurance",
//   //       ],
//   //     },
//   //     {
//   //       name: "Travel Agents",
//   //       subChild: ["Travel Agents", "Travel Booking Services"],
//   //     },
//   //   ],
//   // },
//   // {
//   //   name: "Reatils",
//   //   children: [
//   //     {
//   //       name: "Books & Stationery",
//   //       subChild: ["Books & Stationery", "Books & Stationery Stores"],
//   //     },
//   //     {
//   //       name: "consumer Durables",
//   //       subChild: [
//   //         "Consumer Electronics",
//   //         "Consumer Electronics Stores",
//   //         "Consumer Goods",
//   //         "Consumer Goods Stores",
//   //       ],
//   //     },
//   //     {
//   //       name: "E-Reatail",
//   //       subChild: ["E-Commerce", "E-Commerce Stores"],
//   //     },
//   //     {
//   //       name: "Fashion",
//   //       subChild: [
//   //         "Apparel & Garments",
//   //         "Clothing Accessories",
//   //         "Fabric & Textile",
//   //         "Footwear",
//   //         "Garment Manufacturing",
//   //         "Jewellery",
//   //         "Leather Garments",
//   //         "Textile Machinery & Equipment",
//   //       ],
//   //     },
//   //     {
//   //       name: "Home & Office",
//   //       subChild: [
//   //         "Home & Office Appliances",
//   //         "Home & Office Appliances Stores",
//   //       ],
//   //     },
//   //     {
//   //       name: "supermarket & Grocery",
//   //       subChild: [
//   //         "Dairy/F&V Stores",
//   //         "Department & Convenience Stores",
//   //         "Food Marts",
//   //         "Gourmet Stores",
//   //         "Grocery Stores",
//   //         "Kiosks",
//   //         "Meat & Chicken Shops",
//   //         "Organic Products",
//   //         "Pet Stores",
//   //         "Superstores",
//   //         "Wine Shops",
//   //       ],
//   //     },
//   //   ],
//   // },
//   // {
//   //   name: "Sports & Fitness & entertainment",
//   //   children: [
//   //     {
//   //       name: "Fitness & Gym",
//   //       subChild: [
//   //         "Fitness & Gym Equipments",
//   //         "Fitness Centres",
//   //         "Health & Wellness Centres",
//   //         "Health Care Services",
//   //         "Medical Equipment & Supplies",
//   //         "Nutrition & Supplements",
//   //         "Pharmacy",
//   //       ],
//   //     },
//   //     {
//   //       name: "Sports & Games",
//   //       subChild: [
//   //         "Sports & Games Accessories",
//   //         "Sports & Games Equipments",
//   //         "Sports & Games Stores",
//   //       ],
//   //     },
//   //     {
//   //       name: "entertainment",
//   //       subChild: [
//   //         "Event Management",
//   //         "Event Organizers",
//   //         "Event Planning",
//   //         "Event Production",
//   //         "Event Rentals",
//   //       ],
//   //     },
//   //   ],
//   // },
// ];

// export default categories;




import React from "react";

export const categories = [
  // 1.AUTOMOTIVE
  // {
  //   name: "Automotive",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Car Services",
  //       children: [
  //         "Multi-brand Workshops",
  //         "Car Wash & Detailing",
  //         "Paint & Body Shops",
  //       ],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Bike Services",
  //       children: ["Two-wheeler Repair Chains", "Electric Bike Services"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Auto Accessories",
  //       children: ["Spare Parts / Tyres / Batteries", "Car Accessories Retail"],
  //     },
  //     {
  //       groupId: "D",
  //       name: "EV Ecosystem",
  //       children: [
  //         "EV Showrooms",
  //         "EV Charging Stations",
  //         "EV Battery Swap Stations",
  //       ],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Car Rental & Leasing",
  //       children: ["Self-drive Rentals", "Fleet Management"],
  //     },
  //   ],
  // },

  // 2.HEALTH, BEAUTY & WELLNESS
  // {
  //   name: "Health, Beauty & Wellness",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Beauty & Salon Services",
  //       children: [
  //         "Unisex Salons",
  //         "Men's Grooming Studios",
  //         "Women's Beauty Parlors",
  //         "Nail & Lash Studios",
  //       ],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Spa & Massage",
  //       children: ["Thai / Kerala Spa", "Wellness Therapy", "Ayurveda Spa"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Fitness & Gym",
  //       children: [
  //         "Fitness Clubs",
  //         "Yoga / Pilates Centers",
  //         "CrossFit / Functional Training",
  //         "Fitness Equipment Franchise",
  //       ],
  //     },
  //     {
  //       groupId: "D",
  //       name: "Cosmetic & Dermatology",
  //       children: [
  //         "Skin Clinics",
  //         "Hair Transplant Centers",
  //         "Cosmetic Surgery Clinics",
  //       ],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Pharma & Diagnostics",
  //       children: [
  //         "Retail Pharmacies",
  //         "Diagnostic Labs",
  //         "Blood Collection Centers",
  //         "Medicine Delivery Startups",
  //       ],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Nutrition & Supplements",
  //       children: ["Health Supplement Stores", "Diet Consultation Centers"],
  //     },
  //   ],
  // },

  // 3.EDUCATION & TRAINING
  // {
  //   name: "Education & Training",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Preschools & Daycare",
  //       children: ["Montessori", "Play Schools", "Early Learning Centers"],
  //     },
  //     {
  //       groupId: "B",
  //       name: "K-12 Coaching & Suppor",
  //       children: [
  //         "Tuition Centers",
  //         "Smart Learning Labs",
  //         "Homework Assistance",
  //       ],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Competitive & Exam Coaching",
  //       children: [
  //         "UPSC / SSC / TNPSC",
  //         "NEET / IIT / JEE Coaching",
  //         "Banking / CA / MBA Coaching",
  //       ],
  //     },
  //     {
  //       groupId: "D",
  //       name: "Skill Development & Vocational",
  //       children: [
  //         "IT & Computer Training",
  //         "Soft Skills & Spoken English",
  //         "Hardware / Networking",
  //         "Tailoring / Fashion / Beauty Courses",
  //       ],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Professional Certification",
  //       children: [
  //         "Digital Marketing",
  //         "Data Science / AI / Coding",
  //         "Graphic Design",
  //       ],
  //     },
  //     {
  //       groupId: "F",
  //       name: "Extracurricular Learning",
  //       children: [
  //         "Dance / Music / Arts",
  //         "Sports / Martial Arts / Yoga",
  //         "Brain Development / Abacus / Vedic Math",
  //       ],
  //     },
  //     {
  //       groupId: "G",
  //       name: "EdTech & Online Platforms",
  //       children: ["eLearning Apps", "Online Coaching Portals"],
  //     },
  //   ],
  // },

  // 4.RETAIL & FASHION
  // {
  //   name: "Retails & Fashion",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Apparel Stores",
  //       children: [
  //         "Men's Wear",
  //         "Women's Wear",
  //         "Kidswear",
  //         "Ethnic Wear / Sarees / Kurtis",
  //         "Casual / Formal Wear",
  //         "Uniform / Workwear",
  //       ],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Footwear & Accessories",
  //       children: [
  //         "Footwear Stores",
  //         "Bags & Leather Goods",
  //         "Belts / Wallets / Fashion Accessories",
  //       ],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Jewellery & Watches",
  //       children: [
  //         "Gold & Diamond Jewellery",
  //         "Silver / Imitation Jewellery",
  //         "Watches & Smartwatches",
  //       ],
  //     },
  //     {
  //       groupId: "D",
  //       name: "Opticals & Eyewear",
  //       children: ["Sunglass Retail", "Optical Chains"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Departmental & Grocery Stores",
  //       children: [
  //         "Supermarkets",
  //         "Hypermarkets",
  //         "Convenience Stores",
  //         "Organic Grocery Stores",
  //       ],
  //     },
  //     {
  //       groupId: "F",
  //       name: "Furniture & Home Décor",
  //       children: [
  //         "Modular Kitchens",
  //         "Home Furniture",
  //         "Home Furnishings",
  //         "Lighting & Decor",
  //       ],
  //     },
  //     {
  //       groupId: "G",
  //       name: "Electronics & Mobile Retail",
  //       children: [
  //         "Mobile Phones",
  //         "Accessories & Gadgets",
  //         "Laptops / Computer Stores",
  //       ],
  //     },
  //   ],
  // },

  // 5.FOOD & BEVERAGE
  {
    name: "Food & Beverages",
    children: [
      {
        groupId: "A",
        name: "Quick Service Restaurants (QSR)",
        children: [
          "Burgers & Sandwiches",
          "Fried Chicken",
          "Pizza & Pasta",
          "Rolls & Wraps",
          "Momos & Street Food",
          "Indian Fast Food",
          "Shawarma / Doner / Kebabs",
          "Biryani Specialists",
          "Chinese Fast Food",

          // "Burgers & Sandwiches",
          // "Pizza & Pasta",
          // "Indian Fast Food (Pav Bhaji, Chole Bhature)",
          // "South Indian (Dosa, Idli)",
          // "Rolls & Wraps",
          // "Momos & Street Food",
          
        ],
      },
      {
        groupId: "B",
        name: "Tea, Coffee & Cafe Chains",
        children: [
          "Tea Specialty Cafes",
          "Coffee Specialty Shops",
          "Bubble Tea & Modern Tea",
          "Traditional Chai Points",
          "International Cafe Chains",
          "Local Cafe Brands",
          "Tea & Coffee Kiosks",
          // "Coffee & Tea Cafes",
          // "Tea Cafes",
          // "Coffee Cafes",
          // "Juice Bars",
          // "Milkshake & Smoothie Bars",
          // "Ice Cream Parlors",
          // "Frozen Yogurt Shops",
          // "Coffee Cafes",
          // "Tea Shops (Chai Points)",
          // "Juice & Smoothie Bars",
          // "Ice Cream Parlors",
          // "Milkshake & Dessert Bars",

        ],
      },
      {
        groupId: "C",
        name: "Juice, Smoothie & Health Beverages",
        children: [
          "Fresh Juice Counters",
          "Smoothie & Shake Bars",
          "Detox & Wellness Juice",
          "Protein & Fitness Shakes",
          "Health-focused Beverages",
          "Fruit-based Drink Bars",
        ],
      },
       {
        groupId: "D",
        name: "Bakery, Confectionery & Traditional Sweets",
        children: [
          // "Cakes & Pastries",
          // "Chocolates & Sweets",
          // "Bread & Buns",
          // "Artisanal Bakery",
        //   "Cake & Pastry Shops",
        //   "Bread & Bun Bakeries",
        //  "Indian Sweet Shops",
        //  "Donut & Cookie Shops",
         "Bakeries & Breads",
         "Cakes & Pastries",
         "Traditional Indian Sweets",
         "Cookies & Biscuits",
         "Dessert Shops",
        ],
      },
      {
        groupId: "E",
        name: "Fine Dining & Casual Dining Restaurants",
        children: [
          // "Multi-cuisine Restaurants",
          // "Regional Indian (South/North)",
          // "Chinese / Pan-Asian",
          // "BBQ / Grill Restaurants",
          // "Family Restaurants",
          "Multi-cuisine Restaurants",
          "North Indian Restaurants",
          "South Indian Restaurants",
          "Chinese Restaurants",
          "BBQ & Grill",
          "Family Restaurants",
          "Theme Restaurants",
          "Contemporary Fine Dining",
          "Ethnic Fine Dining",
          "Luxury Steakhouse",
          "Premium Seafood",
          "Celebrity Chef Restaurants",
        ],
      },
     
      {
        groupId: "F",
        name: "Cloud Kitchen",
        children: [
          // "Multi-brand Kitchens",
          // "Single Cuisine Delivery",
          // "Online Food Brands",
          // "Delivery-only Brands",
          // "Multi-brand Kitchens",
          // "Virtual Restaurant Concepts",
          "Multi-brand Cloud Kitchens",
          "Single Cuisine Delivery",
          "Virtual Restaurant Brands",
          "Online Food Brands",
        ],
      },
      {
        groupId: "G",
        name: "Ice Cream & Frozen Desserts",
        children: [
          "Ice Cream Parlors",
           "Frozen Yogurt Shops",
            "Gelato Specialists",
            "Traditional Frozen Desserts",
          ],
      },
            {
        groupId: "H",
        name: "Bars, Pubs & Lounges",
        children: [
          "Sports Bars",
           "Cocktail Lounges",
            "Microbrewery",
            "Hookah Lounges",
            "Resto Bars",
            "Live Music Venues",
            "Wine Bars",
          ],
      },
    ],
  },

  // 6.HOME SERVICES & MAINTENANCE
  // {
  //   name: "Home Services & Maintenance",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Cleaning & Sanitization",
  //       children: ["Cleaning & Sanitization"],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Pest Control",
  //       children: ["Pest Control"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Plumbing / Electrical / Carpentry",
  //       children: ["Plumbing / Electrical / Carpentry"],
  //     },
  //     {
  //       groupId: "D",
  //       name: "Home Painting & Renovation",
  //       children: ["Home Painting & Renovation"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Appliance Service & Repairs",
  //       children: ["Appliance Service & Repairs"],
  //     },
  //     {
  //       groupId: "F",
  //       name: "Interior Design & Modular Furniture",
  //       children: ["Interior Design & Modular Furniture"],
  //     },
  //     {
  //       groupId: "G",
  //       name: "Smart Home Automation",
  //       children: ["Smart Home Automation"],
  //     },
  //   ],
  // },

  // 7.REAL ESTATE & PROPERTY SERVICES
  // {
  //   name: "Real Estate & Property Services",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Property Brokerage",
  //       children: ["Property Brokerage"],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Real Estate Consulting",
  //       children: ["Real Estate Consulting"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Co-working Spaces",
  //       children: ["Co-working Spaces"],
  //     },
  //     {
  //       groupId: "D",
  //       name: "Property Management",
  //       children: ["Property Management"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Construction & Architecture",
  //       children: ["Construction & Architecture"],
  //     },
  //     {
  //       groupId: "F",
  //       name: "Interior Contracting",
  //       children: ["Interior Contracting"],
  //     },
  //     {
  //       groupId: "G",
  //       name: "Real Estate & Lease Services",
  //       children: ["Rental & Lease Services"],
  //     },
  //     {
  //       groupId: "H",
  //       name: "Building Material Franchise",
  //       children: ["Building Material Franchise"],
  //     },
  //   ],
  // },

  // 8.BUSINESS & PROFESSIONAL SERVICES
  // {
  //   name: "Business & Professional Services",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Franchise Consulting",
  //       children: ["Franchise Consulting"],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Business Setup & Registration",
  //       children: ["Business Setup & Registration"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Accounting / CA Firms",
  //       children: ["Accounting / CA Firms"],
  //     },
  //     {
  //       groupId: "D",
  //       name: "HR / Recruitment Services",
  //       children: ["HR / Recruitment Services"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Legal & Compliance Services",
  //       children: ["Legal & Compliance Services"],
  //     },
  //     {
  //       groupId: "F",
  //       name: "Marketing & Advertising Agencies",
  //       children: ["Marketing & Advertising Agencies"],
  //     },
  //     {
  //       groupId: "G",
  //       name: "Digital Marketing & SEO",
  //       children: ["Digital Marketing & SEO"],
  //     },
  //     {
  //       groupId: "H",
  //       name: "Software Development / IT Solutions",
  //       children: ["Software Development / IT Solutions"],
  //     },
  //     {
  //       groupId: "I",
  //       name: "CRM / ERP SaaS Products",
  //       children: ["CRM / ERP SaaS Products"],
  //     },
  //     {
  //       groupId: "J",
  //       name: "Printing / Branding Services",
  //       children: ["Printing / Branding Services"],
  //     },
  //     {
  //       groupId: "K",
  //       name: "Office Automation & BPO",
  //       children: ["Office Automation & BPO"],
  //     },
  //   ],
  // },

  // 9.HOSPITALITY & TRAVEL
  // {
  //   name: "Hospitality & Travel",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Hotels / Resorts / Lodges",
  //       children: ["Hotels / Resorts / Lodges"],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Service Apartments",
  //       children: ["Service Apartments"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Travel Agencies & Tours",
  //       children: ["Travel Agencies & Tours"],
  //     },
  //     {
  //       groupId: "D",
  //       name: "Ticketing & Visa Services",
  //       children: ["Ticketing & Visa Services"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Event Management",
  //       children: ["Event Management"],
  //     },
  //     {
  //       groupId: "F",
  //       name: "Catering & Party Rentals",
  //       children: ["Catering & Party Rentals"],
  //     },
  //     {
  //       groupId: "G",
  //       name: "Banquet / Wedding Halls",
  //       children: ["Banquet / Wedding Halls"],
  //     },
  //     {
  //       groupId: "H",
  //       name: "Travel Tech / Booking Portals",
  //       children: ["Travel Tech / Booking Portals"],
  //     },
  //   ],
  // },

  // 10.MANUFACTURING & INDUSTRIAL
  // {
  //   name: "Manufacturing & Industrial",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Food Manufacturing",
  //       children: ["Food Manufacturing"],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Beverages & Packaged Water",
  //       children: ["Beverages & Packaged Water"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "FMCG / Personal Care",
  //       children: ["FMCG / Personal Care"],
  //     },
  //     {
  //       groupId: "D",
  //       name: "Packaging & Labeling",
  //       children: ["Packaging & Labeling"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Printing & Stationery",
  //       children: ["Printing & Stationery"],
  //     },
  //     {
  //       groupId: "F",
  //       name: "Machinery Distribution",
  //       children: ["Machinery Distribution"],
  //     },
  //     {
  //       groupId: "G",
  //       name: "Construction Materials",
  //       children: ["Construction Materials"],
  //     },
  //     {
  //       groupId: "H",
  //       name: "Chemical & Paints",
  //       children: ["Chemical & Paints"],
  //     },
  //     {
  //       groupId: "I",
  //       name: "Electrical Equipment",
  //       children: ["Electrical Equipment"],
  //     },
  //     {
  //       groupId: "J",
  //       name: "Textile / Garment Manufacturing",
  //       children: ["Textile / Garment Manufacturing"],
  //     },
  //   ],
  // },

  // 11.AGRICULTURE & ORGANIC BUSINESS
  // {
  //   name: "Agriculture & Organic Business",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Organic Food Retail",
  //       children: ["Organic Food Retail"],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Dairy / Poultry Farming",
  //       children: ["Dairy / Poultry Farming"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Animal Feed & Supplements",
  //       children: ["Animal Feed & Supplements"],
  //     },
  //     {
  //       groupId: "D",
  //       name: "Agro Chemicals & Fertilizers",
  //       children: ["Agro Chemicals & Fertilizers"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Farm Equipment Distribution",
  //       children: ["Farm Equipment Distribution"],
  //     },
  //     {
  //       groupId: "F",
  //       name: "Hydroponics / Urban Farming",
  //       children: ["Hydroponics / Urban Farming"],
  //     },
  //     {
  //       groupId: "G",
  //       name: "Agri-Tech Startups",
  //       children: ["Agri-Tech Startups"],
  //     },
  //     {
  //       groupId: "H",
  //       name: "Agri Export Businesses",
  //       children: ["Agri Export Businesses"],
  //     },
  //   ],
  // },

  // 12.E-COMMERCE & TECHNOLOGY
  // {
  //   name: "E-Commerce & Technology",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Marketplace Platforms",
  //       children: ["Marketplace Platforms"],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Online Grocery / Fashion",
  //       children: ["Online Grocery / Fashion"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "D2C Brands",
  //       children: ["D2C Brands"],
  //     },
  //     {
  //       groupId: "D",
  //       name: "Subscription Box Models",
  //       children: ["Subscription Box Models"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Delivery / Logistics Platforms",
  //       children: ["Delivery / Logistics Platforms"],
  //     },
  //     {
  //       groupId: "F",
  //       name: "SaaS / Automation Tools",
  //       children: ["SaaS / Automation Tools"],
  //     },
  //     {
  //       groupId: "G",
  //       name: "FinTech / HealthTech / EdTech",
  //       children: ["FinTech / HealthTech / EdTech"],
  //     },
  //     {
  //       groupId: "H",
  //       name: "Mobile App Startups",
  //       children: ["Mobile App Startups"],
  //     },
  //   ],
  // },

  // 13.ENTERTAINMENT & RECREATION
  // {
  //   name: "Entertainment & Recreation",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Gaming & VR Centers",
  //       children: ["Gaming & VR Centers"],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Kids Play Zones",
  //       children: ["Kids Play Zones"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Cinemas & Multiplexes",
  //       children: ["Cinemas & Multiplexes"],
  //     },
  //     {
  //       groupId: "D",
  //       name: "Music / Dance Studios",
  //       children: ["Music / Dance Studios"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Sports Coaching & Turf Rental",
  //       children: ["Sports Coaching & Turf Rental"],
  //     },
  //     {
  //       groupId: "F",
  //       name: "Theme Parks / Adventure Parks",
  //       children: ["Theme Parks / Adventure Parks"],
  //     },
  //     {
  //       groupId: "G",
  //       name: "Esports & AR Cafes",
  //       children: ["Esports & AR Cafes"],
  //     },
  //   ],
  // },

  // 14.LOGISTICS & TRANSPORTATION
  // {
  //   name: "Logistics & Transportation",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Courier & Parcel Services",
  //       children: ["Courier & Parcel Services"],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Hyperlocal Delivery Networks",
  //       children: ["Hyperlocal Delivery Networks"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Trucking & Cargo",
  //       children: ["Trucking & Cargo"],
  //     },
  //     {
  //       groupId: "D",
  //       name: "Warehouse & Cold Storage",
  //       children: ["Warehouse & Cold Storage"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Logistics Tech Startups",
  //       children: ["Logistics Tech Startups"],
  //     },
  //     {
  //       groupId: "F",
  //       name: "E-commerce Fulfilment Partners",
  //       children: ["E-commerce Fulfilment Partners"],
  //     },
  //   ],
  // },

  // 15.CLEAN TECH & ENVIRONMENT
  // {
  //   name: "Clean Tech & Environment",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Solar Energy Products",
  //       children: ["Solar Energy Products"],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Water Purification",
  //       children: ["Water Purification"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Waste Recycling & Management",
  //       children: ["Waste Recycling & Management"],
  //     },
  //     {
  //       groupId: "D",
  //       name: "E-waste & Battery Recycling",
  //       children: ["E-waste & Battery Recycling"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Green Building Materials",
  //       children: ["Green Building Materials"],
  //     },
  //   ],
  // },

  // 16.SOCIAL IMPACT & NGO
  // {
  //   name: "Social Impact & NGO",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Rural Entrepreneurship",
  //       children: ["Rural Entrepreneurship"],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Skill Development Projects",
  //       children: ["Skill Development Projects"],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Women Empowerment Initiatives",
  //       children: ["Women Empowerment Initiatives"],
  //     },
  //     {
  //       groupId: "D",
  //       name: "NGO / Charitable Franchise",
  //       children: ["NGO / Charitable Franchise"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Community Learning Centers",
  //       children: ["Community Learning Centers"],
  //     },
  //   ],
  // },

  // 17.PET CARE & OTHER EMERGING SECTORS
  // {
  //   name: "Pet Care & Other Emerging Sectors",
  //   children: [
  //     {
  //       groupId: "A",
  //       name: "Pet Grooming & Boarding",
  //       children: [
  //         "Pet Grooming & Boarding"
  //       ],
  //     },
  //     {
  //       groupId: "B",
  //       name: "Pet Food & Retail",
  //       children: [
  //         "Pet Food & Retail"
  //       ],
  //     },
  //     {
  //       groupId: "C",
  //       name: "Veterinary Clinics",
  //       children: [
  //         "Veterinary Clinics"
  //       ],
  //     },
  //     {
  //       groupId: "D",
  //       name: "Laundry & Dry Cleaning",
  //       children: ["Laundry & Dry Cleaning"],
  //     },
  //     {
  //       groupId: "E",
  //       name: "Courier Kiosks / ATM Networks",
  //       children: ["Courier Kiosks / ATM Networks"],
  //     },
  //     {
  //       groupId: "F",
  //       name: "Security & Surveillance Systems",
  //       children: ["Security & Surveillance Systems"],
  //     },
  //     {
  //       groupId: "G",
  //       name: "Smart Devices / IoT Startups",
  //       children: ["Smart Devices / IoT Startups"],
  //     },
  //         {
  //       groupId: "H",
  //       name: "3D Printing / Robotics / Drones",
  //       children: ["3D Printing / Robotics / Drones"],
  //     },
  //         {
  //       groupId: "I",
  //       name: "Gaming / AR-VR Startups",
  //       children: ["Gaming / AR-VR Startups"],
  //     },
  //   ],
  // },
];

export default categories;

