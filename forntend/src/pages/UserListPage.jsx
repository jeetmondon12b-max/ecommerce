import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiToggleLeft, FiToggleRight, FiEye, FiX, FiSearch, FiRotateCcw, FiLoader, FiAlertCircle } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// ✅ পুনরুদ্ধার করা হয়েছে: UserDetailsModal কম্পোনেন্ট
const UserDetailsModal = ({ user, onClose }) => {
    if (!user) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
            <div className="w-full max-w-md p-6 m-4 transition-all transform bg-white shadow-xl rounded-2xl sm:p-8 animate-fade-in-up">
                <div className="flex items-center justify-between pb-3 mb-4 border-b">
                    <h3 className="text-2xl font-bold text-gray-800">User Details</h3>
                    <button onClick={onClose} className="text-gray-500 transition-colors hover:text-gray-800">
                        <FiX size={24} />
                    </button>
                </div>
                <div className="space-y-3 text-gray-700">
                    <p><strong>User ID:</strong> <span className="px-2 py-1 font-mono text-sm break-all bg-gray-100 rounded">{user._id}</span></p>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> <span className="px-2 py-1 font-semibold text-indigo-800 capitalize bg-indigo-100 rounded-full">{user.role}</span></p>
                    <hr className="my-3"/>
                    <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                    <p><strong>Status:</strong> {user.isActive 
                        ? <span className="font-semibold text-green-600">Active</span> 
                        : <span className="font-semibold text-red-600">Banned</span>}
                    </p>
                </div>
                <button onClick={onClose} className="w-full py-2 mt-6 font-semibold text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300">
                    Close
                </button>
            </div>
        </div>
    );
};

// ✅ পুনরুদ্ধার করা হয়েছে: UserCard কম্পোনেন্ট
const UserCard = ({ user, onStatusToggle, onDelete, onViewDetails, currentAdminId }) => (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
        <div className="flex items-start justify-between mb-3">
            <div>
                <p className="text-lg font-bold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {user.isActive ? 'Active' : 'Banned'}
            </span>
        </div>
        <p className="mb-4 text-sm text-gray-600 break-all">{user.email}</p>
        <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button
                onClick={() => onStatusToggle(user)}
                disabled={user.role === 'admin'}
                className={`flex items-center text-sm font-semibold px-3 py-1.5 rounded-md transition-colors ${user.isActive ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-green-600 bg-green-50 hover:bg-green-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {user.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                <span className="ml-2">{user.isActive ? 'Ban' : 'Unban'}</span>
            </button>
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

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${API_BASE_URL}/api/users`, config);
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userInfo?.role === 'admin') {
            fetchUsers();
        }
    }, [userInfo]);

    useEffect(() => {
        let result = users;
        if (filter === 'banned') result = result.filter(user => !user.isActive);
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
                const { data } = await axios.put(`${API_BASE_URL}/api/users/${user._id}`, { isActive: !user.isActive }, config);
                setUsers(users.map(u => (u._id === data._id ? data : u)));
            } catch (err) {
                alert('Failed to update user status.');
            }
        }
    };
    
    // ✅ পুনরুদ্ধার করা হয়েছে: handleDeleteUser ফাংশনের সম্পূর্ণ কোড
    const handleDeleteUser = async (userToDelete) => {
        if (userToDelete.role === 'admin') return alert("You cannot delete an admin account.");
        if (userToDelete._id === userInfo._id) return alert("You cannot delete your own admin account.");
        if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`${API_BASE_URL}/api/users/${userToDelete._id}`, config);
                setUsers(users.filter(u => u._id !== userToDelete._id));
                alert('User deleted successfully.');
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    const handleUnbanAll = async () => {
        const bannedUsersCount = users.filter(u => !u.isActive).length;
        if (bannedUsersCount === 0) return alert('There are no banned users to unban.');
        if (window.confirm(`Are you sure you want to unban all ${bannedUsersCount} banned users?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.put(`${API_BASE_URL}/api/users/unban-all`, {}, config);
                alert('All banned users have been successfully unbanned.');
                fetchUsers();
            } catch (err) {
                alert('Failed to unban all users.');
            }
        }
    };
    
    if (loading) return ( <div className="flex items-center justify-center p-10"><FiLoader className="text-3xl text-indigo-500 animate-spin" /></div> );
    if (error) return ( <div className="flex flex-col items-center p-10 text-red-500"><FiAlertCircle size={32} /><p className="mt-2">{error}</p></div> );

    return (
        <div className="w-full p-4 shadow-lg bg-gray-50 sm:p-6 rounded-2xl">
            <div className="flex flex-col items-center justify-between pb-4 mb-6 border-b md:flex-row">
                <h1 className="mb-4 text-2xl font-bold text-center text-gray-800 sm:text-3xl md:mb-0 md:text-left">Manage Users ({filteredUsers.length})</h1>
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-semibold ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>All Users</button>
                    <button onClick={() => setFilter('banned')} className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-semibold ${filter === 'banned' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Banned Users</button>
                    <button onClick={handleUnbanAll} className="flex items-center px-3 py-1.5 text-xs sm:text-sm rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600"><FiRotateCcw className="mr-1.5"/>Unban All</button>
                </div>
            </div>
            
            <div className="relative mb-6">
                <input type="text" placeholder="Search by Name or Email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                <FiSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            </div>

            <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 uppercase">Name & Role</th>
                            <th className="px-4 py-3 text-sm font-semibold text-left text-gray-600 uppercase">Email</th>
                            <th className="px-4 py-3 text-sm font-semibold text-center text-gray-600 uppercase">Status</th>
                            <th className="px-4 py-3 text-sm font-semibold text-center text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? filteredUsers.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-4 py-4">
                                    <div className="font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                                </td>
                                <td className="px-4 py-4 text-gray-600 break-all">{user.email}</td>
                                <td className="px-4 py-4 text-center">
                                    <button onClick={() => handleStatusToggle(user)} disabled={user.role === 'admin'} title={user.role === 'admin' ? 'Cannot change admin status' : `Click to ${user.isActive ? 'Ban' : 'Unban'}`} className="disabled:opacity-50 disabled:cursor-not-allowed">
                                        {user.isActive ? <span className="flex items-center text-green-600"><FiToggleRight size={22} className="mr-1" /> Active</span> : <span className="flex items-center text-red-600"><FiToggleLeft size={22} className="mr-1" /> Banned</span>}
                                    </button>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <div className="flex items-center justify-center gap-4">
                                        <button onClick={() => setSelectedUser(user)} className="text-gray-400 hover:text-blue-600" title="View Details"><FiEye size={20} /></button>
                                        <button onClick={() => handleDeleteUser(user)} disabled={user.role === 'admin' || user._id === userInfo._id} className="text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed" title={user.role === 'admin' ? 'Cannot delete admin' : 'Delete User'}><FiTrash2 size={20} /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : ( <tr><td colSpan="4" className="py-10 text-center text-gray-500">No users found.</td></tr> )}
                    </tbody>
                </table>
            </div>
            
            <div className="space-y-4 md:hidden">
                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                    <UserCard key={user._id} user={user} onStatusToggle={handleStatusToggle} onDelete={handleDeleteUser} onViewDetails={setSelectedUser} currentAdminId={userInfo._id}/>
                )) : ( <p className="py-10 text-center text-gray-500">No users found.</p> )}
            </div>

            {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
};

export default UserListPage;