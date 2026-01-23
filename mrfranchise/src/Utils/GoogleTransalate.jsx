import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import GTranslateIcon from '@mui/icons-material/GTranslate';

const GoogleTranslate = () => {
  const [isReady, setIsReady] = useState(false);
  const wrapperRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    const initializeTranslate = () => {
      if (!window.google || !window.google.translate) {
        setTimeout(initializeTranslate, 200);
        return;
      }

      const container = document.createElement('div');
      container.id = 'google_translate_element';
      wrapperRef.current?.appendChild(container);

      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,ta,te,bn,ml,gu,mr,kn,pa',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
        setIsReady(true);
      } catch (error) {
        console.error('Google Translate failed to initialize:', error);
      }
    };

    window.googleTranslateElementInit = initializeTranslate;

    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => console.error('Failed to load Google Translate script');
      document.body.appendChild(script);
      scriptLoaded.current = true;
    } else if (window.google && window.google.translate) {
      initializeTranslate();
    }

    return () => {
      delete window.googleTranslateElementInit;
      if (wrapperRef.current) wrapperRef.current.innerHTML = '';
    };
  }, []);

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ mt: 1, mr: 2 }}>
      <GTranslateIcon sx={{ mr: 1, color: '#4285F4' }} />
      <Typography variant="body2" sx={{ mr: 1 }}>
        Translate:
      </Typography>
      <Box ref={wrapperRef} component="span" />
    </Box>
  );
};

export default GoogleTranslate;
