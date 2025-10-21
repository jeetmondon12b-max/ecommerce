import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { register, userInfo } = useAuth();

    const from = location.state?.from?.pathname || '/';

    // <<< এই কোডটুকু যোগ করা হয়েছে >>>
    // পেজ লোড হওয়ামাত্র একদম উপরে স্ক্রল করার জন্য
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); // <-- [] মানে এই ইফেক্ট শুধু একবারই (পেজ লোডের সময়) চলবে

    // (আপনার আগের useEffect টি ঠিকই আছে)
    // ইউজার লগইন করা থাকলে তাকে রিডাইরেক্ট করার জন্য
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
            await register(name, email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="w-full max-w-md p-8 m-4 bg-white shadow-2xl bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl">
                <h2 className="mb-6 text-3xl font-bold text-center text-white">Create Your Account</h2>
                {error && <p className="p-3 mb-4 text-center text-white bg-red-500 rounded-lg">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-white" htmlFor="fullName">Full Name</label>
                        <input className="w-full px-4 py-2 text-gray-700 bg-white rounded-lg bg-opacity-80" id="fullName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-white" htmlFor="email">Email Address</label>
                        <input className="w-full px-4 py-2 text-gray-700 bg-white rounded-lg bg-opacity-80" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-white" htmlFor="password">Password</label>
                        <input className="w-full px-4 py-2 text-gray-700 bg-white rounded-lg bg-opacity-80" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full px-4 py-3 font-bold text-white bg-pink-600 rounded-lg hover:bg-pink-700">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-6 text-sm text-center text-white">
                    Already have an account?{' '}
                    <Link to="/login" state={{ from: location.state?.from }} className="font-bold text-white hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;