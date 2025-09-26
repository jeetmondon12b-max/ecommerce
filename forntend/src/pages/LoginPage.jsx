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

    // যদি ইউজার আগে থেকেই লগইন করা থাকে, তাকে আগের পেজে পাঠিয়ে দেওয়া হবে
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 m-4">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Welcome Back!</h2>
                
                {error && <p className="bg-red-500 text-white text-center p-3 rounded-lg mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
                        <input
                            className="w-full px-4 py-2 text-gray-700 bg-white bg-opacity-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="you@example.com" 
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2" htmlFor="password">Password</label>
                        <input
                            className="w-full px-4 py-2 text-gray-700 bg-white bg-opacity-80 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>
                <p className="text-center text-white text-sm mt-6">
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

