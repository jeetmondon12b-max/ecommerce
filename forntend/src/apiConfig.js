// This file intelligently provides the correct API URL for Vite projects.
// Vite uses import.meta.env for environment variables.
// The variable name MUST start with VITE_

export const API_URL = 
    import.meta.env.VITE_API_URL || 'http://localhost:5000';