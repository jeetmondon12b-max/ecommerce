
import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import OrderStatusTracker from '../components/OrderStatusTracker.jsx';
import { FiChevronDown, FiChevronUp, FiEye, FiSearch, FiLoader } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { API_URL } from '../apiConfig.js';

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
    <div className="p-4 bg-white border rounded-md">
        <h4 className="mb-4 text-lg font-bold">Quick View: Order Items</h4>
        <div className="mb-4 space-y-4">
            {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <img src={item.image} alt={item.name} className="object-cover w-16 h-16 rounded-lg"/>
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
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
            <div className="flex items-start justify-between cursor-pointer" onClick={() => onToggleExpand(order._id)}>
                <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-mono text-sm text-gray-800 break-all">{order._id}</p>
                    <div className="mt-2">
                        <p className="font-semibold text-gray-900">{order.customerInfo.fullName}</p>
                        <p className="text-sm text-gray-500">{order.customerInfo.phone}</p>
                    </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-indigo-600">
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </button>
            </div>
            {isExpanded && <div className="pt-4 mt-4 border-t animate-fade-in-up"><ExpandedOrderDetails order={order} /></div>}
            <div className="pt-4 mt-4 space-y-3 border-t">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="text-lg font-bold text-indigo-600">৳{order.paymentInfo.totalAmount}</p>
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
                        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
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
                // ✅ সমাধান: API পাথ ঠিক করা হয়েছে
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
            // ✅ সমাধান: API পাথ ঠিক করা হয়েছে
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

    if (loading) return <div className="flex items-center justify-center p-10"><FiLoader className="text-2xl text-indigo-500 animate-spin"/></div>;

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50">
            <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:text-3xl">All Customer Orders</h1>
            <div className="relative mb-6">
                <FiSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                    type="text"
                    placeholder="Search by Order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-md p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            {/* Desktop View: Table */}
            <div className="hidden overflow-x-auto bg-white rounded-lg shadow-md md:block">
                <table className="w-full min-w-[1000px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-12 p-3"></th>
                            <th className="p-3 text-sm font-semibold text-left text-gray-600">Order ID</th>
                            <th className="p-3 text-sm font-semibold text-left text-gray-600">Customer</th>
                            <th className="p-3 text-sm font-semibold text-left text-gray-600">Date</th>
                            <th className="p-3 text-sm font-semibold text-right text-gray-600">Total</th>
                            <th className="w-48 p-3 text-sm font-semibold text-center text-gray-600">Change Status</th>
                            <th className="p-3 text-sm font-semibold text-center text-gray-600">Actions</th>
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
                                        <td className="p-3 font-semibold text-right text-indigo-600">৳{order.paymentInfo.totalAmount}</td>
                                        <td className="p-3">
                                            <select value={order.orderStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)} className={`w-full p-2 rounded-md text-sm font-semibold border ${getStatusColor(order.orderStatus)}`}>
                                                {orderStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-3 text-center">
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
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
                            <tr><td colSpan="7" className="p-10 text-center text-gray-500">No orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Mobile View: Card List */}
            <div className="space-y-4 md:hidden">
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
                    <div className="p-10 text-center bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">No orders found matching your search.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default OrderListPage;