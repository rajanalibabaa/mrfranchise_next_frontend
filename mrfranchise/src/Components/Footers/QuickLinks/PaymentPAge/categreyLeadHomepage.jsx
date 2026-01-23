// "use client";
// import { useState } from 'react';
// // import './BannerAdsSelection.css';

// const BannerAdsSelection = ({ membership, onBack, onNext }) => {
//   const [selectedBanners, setSelectedBanners] = useState([]);
  
//   const bannerOptions = [
//     { id: 1, name: 'Homepage Top', size: '728x90', price: 5000 },
//     { id: 2, name: 'Homepage Sidebar', size: '300x250', price: 3000 },
//     { id: 3, name: 'Category Page', size: '728x90', price: 4000 },
//     { id: 4, name: 'Search Results', size: '300x600', price: 3500 }
//   ];

//   const toggleBanner = (banner) => {
//     if (selectedBanners.some(b => b.id === banner.id)) {
//       setSelectedBanners(selectedBanners.filter(b => b.id !== banner.id));
//     } else {
//       setSelectedBanners([...selectedBanners, banner]);
//     }
//   };

//   return (
//     <div className="banner-ads-selection">
//       <h1>Select Banner Ads</h1>
//       <p>Enhance your {membership.metal} {membership.plan} membership with banner ads</p>
      
//       <div className="selected-membership">
//         <h3>Your Membership:</h3>
//         <p>{membership.metal} {membership.plan} - ₹{membership.price.toLocaleString()}</p>
//         <p>{membership.months} Months, {membership.totalLeads} Total Leads</p>
//       </div>
      
//       <div className="banner-options">
//         {bannerOptions.map(banner => (
//           <div 
//             key={banner.id}
//             className={`banner-card ${
//               selectedBanners.some(b => b.id === banner.id) ? 'selected' : ''
//             }`}
//             onClick={() => toggleBanner(banner)}
//           >
//             <h3>{banner.name}</h3>
//             <p>Size: {banner.size}</p>
//             <p className="price">₹{banner.price.toLocaleString()}</p>
//           </div>
//         ))}
//       </div>
      
//       <div className="navigation-buttons">
//         <button className="back-button" onClick={onBack}>Back</button>
//         <button className="next-button" onClick={() => onNext(selectedBanners)}>
//           Proceed to Payment
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BannerAdsSelection;