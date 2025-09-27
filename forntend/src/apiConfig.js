// This file intelligently chooses the correct API URL based on the environment.
// Vite uses import.meta.env for environment variables.
export const API_URL = 
    import.meta.env.VITE_API_URL || 'http://localhost:5000';  