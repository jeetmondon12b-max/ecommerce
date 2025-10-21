// src/components/ScrollToTop.js

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // যখনই পেজের পাথ (route) পরিবর্তন হবে,
    // এই কোডটি পেজকে একদম উপরে স্ক্রল করে নিয়ে যাবে।
    window.scrollTo(0, 0);
  }, [pathname]); // <-- pathname পরিবর্তন হওয়ামাত্র এটি কাজ করবে

  return null; // এই কম্পোনেন্টের কোনো UI নেই
};

export default ScrollToTop;