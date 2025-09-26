import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../apiConfig'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

// 1. Create a global Axios instance with a dynamic baseURL
const api = axios.create({
    baseURL: API_URL, // ✅ পরিবর্তন: baseURL এখন ডাইনামিক
});

// 2. Create the context
const AuthContext = createContext();

// 3. AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);

    const login = async (email, password) => {
        // Use the global api instance for requests
        const { data } = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUserInfo(data);
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/api/auth/register', { name, email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUserInfo(data);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        // Redirect to login page to clear any protected state
        window.location.href = '/login';
    };

    useEffect(() => {
        // Axios Interceptor for handling banned users
        const responseInterceptor = api.interceptors.response.use(
            // If the response is successful, just return it
            response => response,
            // If there's an error in the response
            error => {
                // Check if the user is banned (status 403)
                if (error.response && error.response.status === 403 && error.response.data.message.includes('banned')) {
                    alert('Your account has been banned due to a violation of our terms. You will now be logged out. Please contact support for further assistance.');
                    logout(); // Automatically log out the banned user
                }
                // Return the error for other components to handle
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor when the component unmounts
        return () => {
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []); // This effect runs only once

    return (
        <AuthContext.Provider value={{ userInfo, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to easily use the context
export const useAuth = () => {
    return useContext(AuthContext);
};
