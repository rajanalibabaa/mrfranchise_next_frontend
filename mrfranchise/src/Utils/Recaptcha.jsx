// import React, { useState } from 'react';
// import ReCAPTCHA from 'react-google-recaptcha';


// const CaptchaOnly = () => {
//   const [captchaValue, setCaptchaValue] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState(null); // 'success', 'error'

//   const handleVerify = async () => {
//     if (!captchaValue) {
//       setStatus('error');
//       return;
//     }

//     setLoading(true);
//     setStatus(null);

//     try {
// <<<<<<< HEAD
// <<<<<<< HEAD
//       const response = await fetch('http://localhost:5000/verify-captcha', {
// =======
//       const response = await fetch('http://localhost:5000/api/v1verify-captcha', {
// >>>>>>> d37056e415ba37cc491d4faf137ee52e6e87e872
// =======
//       const response = await fetch('http://localhost:5000/verify-captcha', {
// >>>>>>> a3052b1240b3bb00e5924676e6d11e51b5697864
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token: captchaValue }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setStatus('success');
//       } else {
//         setStatus('error');
//       }
//     } catch (err) {
//       console.error('Verification failed:', err);
//       setStatus('error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
     
      

//        <ReCAPTCHA
//         sitekey="6LcGO2orAAAAABdB_akGeQApxKmRjEftNknXZS9N"
//         onChange={(value) => setCaptchaValue(value)}
//         style={{ marginBottom: '20px' }}
//       /> 

     
//   );
// };

// export default CaptchaOnly;
