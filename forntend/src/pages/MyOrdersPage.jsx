import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiAlertCircle, FiXCircle, FiEye } from 'react-icons/fi';
import OrderStatusTracker from '../components/OrderStatusTracker';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { API_URL } from '../apiConfig.js'; // ✅ পরিবর্তন: API_URL ইম্পোর্ট করা হয়েছে

const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Processing': return 'bg-blue-100 text-blue-800';
        case 'Shipped': return 'bg-indigo-100 text-indigo-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const { userInfo } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchMyOrders = async () => {
            if (!userInfo) {
                setLoading(false);
                setError("Please log in to see your orders.");
                return;
            }
            try {
                setLoading(true);
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                // ✅ পরিবর্তন: API URL এখন ডাইনামিক
                const { data } = await axios.get(`${API_URL}/api/orders/myorders`, config);
                setOrders(data);
            } catch (err) {
                setError("Could not fetch your orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, [userInfo]);
    
    const handleCancelOrder = async (orderId) => {
        if (window.confirm('আপনি কি নিশ্চিতভাবে এই অর্ডারটি বাতিল করতে চান?')) {
            setCancellingId(orderId);
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                // ✅ পরিবর্তন: API URL এখন ডাইনামিক
                await axios.put(`${API_URL}/api/orders/${orderId}/cancel`, {}, config);
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId ? { ...order, orderStatus: 'Cancelled' } : order
                    )
                );
            } catch (err) {
                alert("অর্ডারটি বাতিল করা যায়নি।");
            } finally {
                setCancellingId(null);
            }
        }
    };

    if (loading) return <p className="text-center text-lg py-20">Loading your orders...</p>;
    if (error) return <p className="text-center text-lg py-20 text-red-600 flex items-center justify-center"><FiAlertCircle className="mr-2"/>{error}</p>;

    return (
        <div className="max-w-4xl mx-auto my-8 p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">My Orders</h1>
            {orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <FiShoppingBag className="mx-auto text-5xl text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">You haven't placed any orders yet.</h2>
                    <p className="text-gray-500 mt-2">All your future orders will appear here.</p>
                    <Link to="/" className="mt-6 inline-block bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-mono text-gray-800 break-all">{order._id}</p>
                                </div>
                                <div className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                                    {order.orderStatus}
                                </div>
                            </div>
                            <div className="border-t pt-4 space-y-4">
                                {order.orderItems.map(item => (
                                    <div key={item.product} className="flex items-center space-x-4">
                                        {/* ✅ পরিবর্তন: ছবির URL এখন ডাইনামিক */}
                                        <img src={`${API_URL}${item.image}`} alt={item.name} className="w-20 h-20 object-cover rounded-lg border"/>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {order.orderStatus !== 'Cancelled' && (
                                <div className="border-t mt-4">
                                    <OrderStatusTracker status={order.orderStatus} />
                                </div>
                            )}

                            <div className="border-t mt-4 pt-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Ordered on</p>
                                        <p className="font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString('en-BD')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="text-xl font-bold text-indigo-600">৳{order.paymentInfo.totalAmount}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-md transition-colors"
                                    >
                                        <FiEye /> View Details
                                    </button>
                                    {order.orderStatus === 'Pending' ? (
                                        <button
                                            onClick={() => handleCancelOrder(order._id)}
                                            disabled={cancellingId === order._id}
                                            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md disabled:opacity-50 transition-colors"
                                        >
                                            {cancellingId === order._id ? 'Cancelling...' : <><FiXCircle />Cancel Order</>}
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
        </div>
    );
};

export default MyOrdersPage;