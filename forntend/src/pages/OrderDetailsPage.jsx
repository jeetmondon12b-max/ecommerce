import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { FiClipboard, FiUser, FiTruck, FiCreditCard } from 'react-icons/fi';

const OrderDetailsPage = () => {
    const { id: orderId } = useParams();
    const { userInfo } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/orders/${orderId}`, config);
                setOrder(data);
            } catch (err) {
                setError('Failed to fetch order details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId, userInfo.token]);

    if (loading) return <p className="text-center p-10 font-semibold">Loading Order Details...</p>;
    if (error) return <p className="text-center p-10 text-red-500 font-semibold">{error}</p>;
    if (!order) return <p className="text-center p-10">No order found.</p>;

    const { customerInfo, orderItems, paymentInfo } = order;

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
                    <p className="text-gray-500 mt-1">Order ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{order._id}</span></p>
                    <p className="text-sm text-gray-500">Ordered on: {new Date(order.createdAt).toLocaleString('en-BD')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiClipboard /> Order Items ({orderItems.length})</h2>
                            <div className="space-y-4">
                                {orderItems.map((item) => (
                                    <div key={item._id} className="flex items-start gap-4 border-b pb-4 last:border-b-0">
                                        <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-24 h-24 object-cover rounded-md border" />
                                        <div className="flex-grow">
                                            <p className="font-bold text-lg text-gray-900">{item.name}</p>
                                            {item.size && <p className="text-sm text-gray-600"><strong>Size:</strong> {item.size}</p>}
                                            {item.customSize?.value && <p className="text-sm text-gray-600"><strong>Custom ({item.customSize.type}):</strong> {item.customSize.value}</p>}
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-700">৳{item.price.toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">Subtotal: ৳{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Customer & Payment Details */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiUser /> Customer Details</h2>
                             <div className="space-y-2 text-gray-700">
                                <p><strong>Name:</strong> {customerInfo.fullName}</p>
                                <p><strong>Email:</strong> {order.user.email}</p>
                                <p><strong>Phone:</strong> {customerInfo.phone}</p>
                             </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiTruck /> Shipping Address</h2>
                            <p className="text-gray-700 leading-relaxed">{customerInfo.street}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiCreditCard /> Payment Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span> <span>৳{paymentInfo.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Shipping Fee:</span> <span>৳{paymentInfo.shippingFee.toFixed(2)}</span></div>
                                {paymentInfo.discount > 0 && (
                                    <div className="flex justify-between text-green-600 font-semibold">
                                        <span>Discount ({paymentInfo.couponCode}):</span>
                                        <span>- ৳{paymentInfo.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-xl">
                                    <span>Total Amount:</span>
                                    <span className="text-blue-600">৳{paymentInfo.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;