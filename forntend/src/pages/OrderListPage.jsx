import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import OrderStatusTracker from '../components/OrderStatusTracker.jsx';
import { FiChevronDown, FiChevronUp, FiEye, FiSearch, FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { API_URL } from '../apiConfig.js'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
        case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const ExpandedOrderDetails = ({ order }) => (
    <div className="p-4 bg-white rounded-md border">
        <h4 className="font-bold text-lg mb-4">Quick View: Order Items</h4>
        <div className="space-y-4 mb-4">
            {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    {/* ✅ পরিবর্তন: ছবির URL এখন ডাইনামিক */}
                    <img src={`${API_URL}${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded-lg"/>
                    <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        {item.size && <p className="text-sm text-gray-600"><strong>Size:</strong> {item.size}</p>}
                        {item.customSize?.value && <p className="text-sm text-gray-600"><strong>Custom ({item.customSize.type}):</strong> {item.customSize.value}</p>}
                    </div>
                    <div className="text-right">
                        <p className="font-medium">৳{item.price} x {item.quantity}</p>
                    </div>
                </div>
            ))}
        </div>
        <OrderStatusTracker status={order.orderStatus} />
    </div>
);

const OrderCard = ({ order, expandedOrderId, onToggleExpand, onStatusChange, orderStatuses }) => {
    const isExpanded = expandedOrderId === order._id;
    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-start cursor-pointer" onClick={() => onToggleExpand(order._id)}>
                <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-mono text-sm text-gray-800 break-all">{order._id}</p>
                    <div className="mt-2">
                        <p className="font-semibold text-gray-900">{order.customerInfo.fullName}</p>
                        <p className="text-sm text-gray-500">{order.customerInfo.phone}</p>
                    </div>
                </div>
                <button className="text-gray-500 hover:text-indigo-600 p-2">
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </button>
            </div>
            {isExpanded && <div className="mt-4 pt-4 border-t animate-fade-in-up"><ExpandedOrderDetails order={order} /></div>}
            <div className="border-t mt-4 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="font-bold text-lg text-indigo-600">৳{order.paymentInfo.totalAmount}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <select
                        value={order.orderStatus}
                        onChange={(e) => onStatusChange(order._id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-full p-2 rounded-md text-sm font-semibold border ${getStatusColor(order.orderStatus)}`}
                    >
                        {orderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <Link
                        to={`/admin/orders/${order._id}`}
                        className="flex items-center justify-center gap-2 bg-indigo-500 text-white px-3 py-2 rounded-md hover:bg-indigo-600 text-sm font-semibold"
                    >
                        <FiEye /> Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { userInfo } = useAuth();
    const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                // ✅ পরিবর্তন: API URL এখন ডাইনামিক
                const { data } = await axios.get(`${API_URL}/api/orders`, config);
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userInfo.token]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            // ✅ পরিবর্তন: API URL এখন ডাইনামিক
            await axios.put(`${API_URL}/api/orders/${orderId}/status`, { status: newStatus }, config);
            setOrders(prevOrders => prevOrders.map(order => order._id === orderId ? { ...order, orderStatus: newStatus } : order));
        } catch (error) {
            alert("Status update failed!");
        }
    };
    
    const toggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const filteredOrders = orders.filter(order => order._id.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) return <div className="flex justify-center items-center p-10"><FiLoader className="animate-spin text-2xl text-indigo-500"/></div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">All Customer Orders</h1>
            <div className="mb-6 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by Order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-md p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 w-12"></th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-600">Total</th>
                            <th className="p-3 text-center text-sm font-semibold text-gray-600 w-48">Change Status</th>
                            <th className="p-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <Fragment key={order._id}>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-center cursor-pointer" onClick={() => toggleExpand(order._id)}>
                                            <button className="text-gray-500 hover:text-indigo-600">{expandedOrderId === order._id ? <FiChevronUp /> : <FiChevronDown />}</button>
                                        </td>
                                        <td className="p-3 font-mono text-xs text-gray-700">{order._id}</td>
                                        <td className="p-3">
                                            <p className="font-medium text-gray-800">{order.customerInfo.fullName}</p>
                                            <p className="text-xs text-gray-500">{order.customerInfo.phone}</p>
                                        </td>
                                        <td className="p-3 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3 text-right font-semibold text-indigo-600">৳{order.paymentInfo.totalAmount}</td>
                                        <td className="p-3">
                                            <select value={order.orderStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)} className={`w-full p-2 rounded-md text-sm font-semibold border ${getStatusColor(order.orderStatus)}`}>
                                                {orderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-3 text-center">
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                className="bg-indigo-500 text-white px-3 py-2 rounded-md hover:bg-indigo-600 text-sm font-semibold flex items-center justify-center gap-2"
                                            >
                                                <FiEye /> Details
                                            </Link>
                                        </td>
                                    </tr>
                                    {expandedOrderId === order._id && (
                                        <tr className="bg-slate-50">
                                            <td colSpan="7" className="p-4">
                                                <ExpandedOrderDetails order={order} />
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="text-center p-10 text-gray-500">No orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Mobile View: Card List */}
            <div className="md:hidden space-y-4">
                 {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            expandedOrderId={expandedOrderId}
                            onToggleExpand={toggleExpand}
                            onStatusChange={handleStatusChange}
                            orderStatuses={orderStatuses}
                        />
                    ))
                 ) : (
                    <div className="text-center p-10 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">No orders found matching your search.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default OrderListPage;





