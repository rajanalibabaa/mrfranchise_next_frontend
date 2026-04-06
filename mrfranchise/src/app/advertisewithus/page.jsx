
import Box from '@mui/material/Box';
import MembershipSelection from './MembershipPayment';
import Navbar from '@/Components/Navbar/NavBar';
import Footer from '@/Components/Footers/Footer';


const AdvertisingPage = ({ handleSubmit, onBack }) => {
  

  return (
    <Box>
      <Box><Navbar /></Box>
  
      {/* Back to Form Button */}
  
          <MembershipSelection handleSubmit={handleSubmit} onBack={onBack} />
      {/* <Container > */}
        <Box>
         

         
        </Box>
      {/* </Container> */}
      <Box><Footer /></Box>
    </Box>
  );
};
export default AdvertisingPage;
