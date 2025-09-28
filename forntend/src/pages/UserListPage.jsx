import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiToggleLeft, FiToggleRight, FiEye, FiX, FiSearch, FiRotateCcw, FiLoader, FiAlertCircle } from 'react-icons/fi';

// ✅ পরিবর্তন: Vite-এর জন্য এনভায়রনমেন্ট ভেরিয়েবল ব্যবহারের সঠিক নিয়ম
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Modal Component (অপরিবর্তিত)
const UserDetailsModal = ({ user, onClose }) => {
    if (!user) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md m-4 transform transition-all animate-fade-in-up">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">User Details</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                        <FiX size={24} />
                    </button>
                </div>
                <div className="space-y-3 text-gray-700">
                    <p><strong>User ID:</strong> <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded break-all">{user._id}</span></p>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> <span className="capitalize font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">{user.role}</span></p>
                    <hr className="my-3"/>
                    <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleString('en-BD', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                    <p><strong>Status:</strong> {user.isActive 
                        ? <span className="text-green-600 font-semibold">Active</span> 
                        : <span className="text-red-600 font-semibold">Banned</span>}
                    </p>
                </div>
                <button onClick={onClose} className="w-full mt-6 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300">
                    Close
                </button>
            </div>
        </div>
    );
};

// মোবাইল ডিভাইসের জন্য User Card কম্পোনেন্ট (অপরিবর্তিত)
const UserCard = ({ user, onStatusToggle, onDelete, onViewDetails, currentAdminId }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-between items-start mb-3">
            <div>
                <p className="font-bold text-lg text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user.isActive ? 'Active' : 'Banned'}
            </span>
        </div>
        <p className="text-sm text-gray-600 break-all mb-4">{user.email}</p>
        <div className="border-t pt-3 flex justify-between items-center gap-2">
            <button
                onClick={() => onStatusToggle(user)}
                disabled={user.role === 'admin'}
                className={`flex items-center text-sm font-semibold px-3 py-1.5 rounded-md transition-colors ${user.isActive ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-green-600 bg-green-50 hover:bg-green-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {user.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                <span className="ml-2">{user.isActive ? 'Ban' : 'Unban'}</span>
            </button>
            <div className="flex items-center gap-2">
                <button onClick={() => onViewDetails(user)} className="p-2 text-gray-500 hover:text-blue-600" title="View Details">
                    <FiEye size={20} />
                </button>
                <button
                    onClick={() => onDelete(user)}
                    disabled={user.role === 'admin' || user._id === currentAdminId}
                    className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={user.role === 'admin' ? 'Cannot delete admin' : 'Delete User'}
                >
                    <FiTrash2 size={20} />
                </button>
            </div>
        </div>
    </div>
);

// Main User List Page Component
const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const { userInfo } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError('');
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/api/admin/users`, config);
                setUsers(data);
                setFilteredUsers(data);
            } catch (err) {
                setError('Failed to fetch users.');
            } finally {
                setLoading(false);
            }
        };
        if (userInfo?.role === 'admin') {
            fetchUsers();
        }
    }, [userInfo]);

    useEffect(() => {
        let result = users;
        if (filter === 'banned') {
            result = result.filter(user => !user.isActive);
        }
        if (searchTerm) {
            result = result.filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredUsers(result);
    }, [searchTerm, filter, users]);

    const handleStatusToggle = async (user) => {
        if (user.role === 'admin') return alert("Admin status cannot be changed.");
        if (window.confirm(`Are you sure you want to ${user.isActive ? 'ban' : 'unban'} this user?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.put(`${API_BASE_URL}/api/admin/users/${user._id}`, { isActive: !user.isActive }, config);
                setUsers(users.map(u => (u._id === data._id ? data : u)));
            } catch (err) {
                alert('Failed to update user status.');
            }
        }
    };
    
    const handleDeleteUser = async (userToDelete) => {
        if (userToDelete.role === 'admin') return alert("You cannot delete an admin account.");
        if (userToDelete._id === userInfo._id) return alert("You cannot delete your own admin account.");
        if (window.confirm('Are you sure you want to permanently delete this user?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`${API_BASE_URL}/api/admin/users/${userToDelete._id}`, config);
                setUsers(users.filter(u => u._id !== userToDelete._id));
            } catch (err) {
                alert('Failed to delete user.');
            }
        }
    };

    const handleUnbanAll = async () => {
        if (window.confirm('Are you sure you want to unban all currently banned users?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.put(`${API_BASE_URL}/api/admin/users/unban-all`, {}, config);
                const { data } = await axios.get(`${API_BASE_URL}/api/admin/users`, config);
                setUsers(data);
                alert('All banned users have been successfully unbanned.');
            } catch (err) {
                alert('Failed to unban all users.');
            }
        }
    };
    
    if (loading) return (
        <div className="flex justify-center items-center p-10"><FiLoader className="animate-spin text-3xl text-indigo-500" /></div>
    );
    if (error) return (
        <div className="flex flex-col items-center p-10 text-red-500"><FiAlertCircle size={32} /><p className="mt-2">{error}</p></div>
    );

    return (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-lg w-full">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Manage Users ({filteredUsers.length})</h1>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm sm:text-base rounded-lg font-semibold ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>All Users</button>
                    <button onClick={() => setFilter('banned')} className={`px-4 py-2 text-sm sm:text-base rounded-lg font-semibold ${filter === 'banned' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Banned Users</button>
                    <button onClick={handleUnbanAll} className="flex items-center px-4 py-2 text-sm sm:text-base rounded-lg font-semibold bg-green-500 text-white"><FiRotateCcw className="mr-2"/>Unban All</button>
                </div>
            </div>
            
            <div className="mb-6 relative">
                <input 
                    type="text"
                    placeholder="Search by Name or Email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* ডেস্কটপ ভিউ: টেবিল */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Name & Role</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase">Email</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Status</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? filteredUsers.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="py-4 px-4">
                                    <div className="font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                                </td>
                                <td className="py-4 px-4 text-gray-600 break-all">{user.email}</td>
                                <td className="py-4 px-4 text-center">
                                    <button onClick={() => handleStatusToggle(user)} disabled={user.role === 'admin'} title={user.role === 'admin' ? 'Cannot change admin status' : `Click to ${user.isActive ? 'Ban' : 'Unban'}`} className="disabled:opacity-50 disabled:cursor-not-allowed">
                                        {user.isActive ? <span className="flex items-center text-green-600"><FiToggleRight size={22} className="mr-1" /> Active</span> : <span className="flex items-center text-red-600"><FiToggleLeft size={22} className="mr-1" /> Banned</span>}
                                    </button>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <div className="flex justify-center items-center gap-4">
                                        <button onClick={() => setSelectedUser(user)} className="text-gray-400 hover:text-blue-600" title="View Details"><FiEye size={20} /></button>
                                        <button onClick={() => handleDeleteUser(user)} disabled={user.role === 'admin' || user._id === userInfo._id} className="text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed" title={user.role === 'admin' ? 'Cannot delete admin' : 'Delete User'}><FiTrash2 size={20} /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="text-center py-10 text-gray-500">No users found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* মোবাইল ভিউ: কার্ড লিস্ট */}
            <div className="md:hidden space-y-4">
                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                    <UserCard
                        key={user._id}
                        user={user}
                        onStatusToggle={handleStatusToggle}
                        onDelete={handleDeleteUser}
                        onViewDetails={setSelectedUser}
                        currentAdminId={userInfo._id}
                    />
                )) : (
                    <p className="text-center py-10 text-gray-500">No users found.</p>
                )}
            </div>

            {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
};

export default UserListPage;