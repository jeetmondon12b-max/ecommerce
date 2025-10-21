import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'; // <<< useCallback ইম্পোর্ট করা হয়েছে
import axios from 'axios';
import { API_URL } from '../apiConfig';

// 1. Create a global Axios instance
const api = axios.create({
    baseURL: API_URL,
});

// 2. Create the context
const AuthContext = createContext();

// 3. AuthProvider component
export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);

    // ✅ login ফাংশন useCallback দিয়ে wrap করা হয়েছে
    const login = useCallback(async (email, password) => {
        const { data } = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUserInfo(data);
    }, []); // Dependency array খালি

    // ✅ register ফাংশন useCallback দিয়ে wrap করা হয়েছে
    const register = useCallback(async (name, email, password) => {
        const { data } = await api.post('/api/auth/register', { name, email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUserInfo(data);
    }, []); // Dependency array খালি

    // ✅ logout ফাংশন useCallback দিয়ে wrap করা হয়েছে
    const logout = useCallback(() => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        // <<< Redirect কোডটি এখান থেকে সরানো হয়েছে >>>
        // এটি Header.jsx বা যেখানে logout কল হয় সেখানে navigate দিয়ে করা হবে।
        console.log("User logged out from context"); // লগ আউট হয়েছে কিনা নিশ্চিত করার জন্য
    }, []); // Dependency array খালি

    useEffect(() => {
        // Axios Interceptor for handling banned users
        const responseInterceptor = api.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 403 && error.response.data.message.includes('banned')) {
                    alert('Your account has been banned due to a violation of our terms. You will now be logged out. Please contact support for further assistance.');
                    logout(); // Automatically log out the banned user
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor
        return () => {
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [logout]); // <-- logout কে dependency হিসেবে যোগ করা ভালো, কারণ এটি useCallback দিয়ে মোড়ানো

    return (
        <AuthContext.Provider value={{ userInfo, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the context
export const useAuth = () => {
    return useContext(AuthContext);
};