import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { login, userInfo } = useAuth();

    // ব্যবহারকারী কোন পেজ থেকে এসেছে তা বের করা হচ্ছে
    const from = location.state?.from?.pathname || '/';

    // <<< এই কোডটুকু যোগ করা হয়েছে >>>
    // এই useEffect হুকটি নিশ্চিত করে যে পেজটি লোড হওয়ামাত্র
    // এটি ব্যবহারকারীকে পেজের একদম উপরে নিয়ে যাবে।
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // <-- [] মানে এই ইফেক্ট শুধু একবারই (পেজ লোডের সময়) চলবে

    // যদি ইউজার আগে থেকেই লগইন করা থাকে, তাকে আগের পেজে পাঠিয়ে দেওয়া হবে
    // (আপনার আগের useEffect টি ঠিকই আছে)
    useEffect(() => {
        if (userInfo) {
            navigate(from, { replace: true });
        }
    }, [userInfo, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            // ব্যাকএন্ড থেকে আসা যেকোনো এরর মেসেজ এখানে দেখানো হবে
            setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="w-full max-w-md p-8 m-4 bg-white shadow-2xl bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl">
                <h2 className="mb-6 text-3xl font-bold text-center text-white">Welcome Back!</h2>
                
                {error && <p className="p-3 mb-4 text-center text-white bg-red-500 rounded-lg">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-white" htmlFor="email">Email Address</label>
                        <input
                            className="w-full px-4 py-2 text-gray-700 bg-white rounded-lg bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="you@example.com" 
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-white" htmlFor="password">Password</label>
                        <input
                            className="w-full px-4 py-2 text-gray-700 bg-white rounded-lg bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            id="password" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="********" 
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full px-4 py-3 font-bold text-white transition-colors bg-pink-600 rounded-lg hover:bg-pink-700 disabled:opacity-50"
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>
                <p className="mt-6 text-sm text-center text-white">
                    Don't have an account?{' '}
                    <Link to="/register" state={{ from: location.state?.from }} className="font-bold text-white hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;