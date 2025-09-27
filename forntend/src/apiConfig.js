// This file intelligently chooses the correct API URL based on the environment.
// When deployed on Render, process.env.NODE_ENV will be 'production'.
// On your local computer, it will be 'development'.

export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://ecommerce-1-csj6.onrender.com' // Your LIVE backend URL on Render
    : 'http://localhost:5000';                 // Your LOCAL backend URL for development