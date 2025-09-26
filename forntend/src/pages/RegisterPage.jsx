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
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 m-4">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Create Your Account</h2>
                {error && <p className="bg-red-500 text-white text-center p-3 rounded-lg mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2" htmlFor="fullName">Full Name</label>
                        <input className="w-full px-4 py-2 text-gray-700 bg-white bg-opacity-80 rounded-lg" id="fullName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required />
                    </div>
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
                        <input className="w-full px-4 py-2 text-gray-700 bg-white bg-opacity-80 rounded-lg" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2" htmlFor="password">Password</label>
                        <input className="w-full px-4 py-2 text-gray-700 bg-white bg-opacity-80 rounded-lg" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-white text-sm mt-6">
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
