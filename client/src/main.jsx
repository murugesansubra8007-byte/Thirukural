import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const GA_ID = import.meta.env.VITE_GA_ID;
if (GA_ID) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
}

createRoot(document.getElementById('root')).render(<App />);