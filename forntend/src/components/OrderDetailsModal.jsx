import React from 'react';
import { FiX, FiUser, FiPhone, FiMapPin, FiCreditCard, FiDollarSign, FiTag, FiTruck } from 'react-icons/fi';

const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-center text-gray-600">
        <div className="text-indigo-500 mr-3">{icon}</div>
        <div>
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-gray-800">{value}</p>
        </div>
    </div>
);

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-2xl m-4 transform transition-all animate-fade-in-up">
                {/* Modal Header */}
                <div className="flex justify-between items-start border-b pb-3 mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Order Summary</h3>
                        <p className="text-xs text-gray-500 font-mono mt-1">{order._id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Shipping Details Column */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Shipping Details</h4>
                        <div className="space-y-4">
                            <DetailRow icon={<FiUser size={20} />} label="Full Name" value={order.customerInfo.fullName} />
                            <DetailRow icon={<FiPhone size={20} />} label="Phone Number" value={order.customerInfo.phone} />
                            <DetailRow icon={<FiMapPin size={20} />} label="Shipping Address" value={order.customerInfo.street} />
                        </div>
                    </div>

                    {/* Payment Details Column */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Payment Details</h4>
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                            <DetailRow icon={<FiCreditCard size={20} />} label="Payment Method" value={order.paymentInfo.method} />
                            <DetailRow icon={<FiDollarSign size={20} />} label="Subtotal" value={`৳${order.paymentInfo.subtotal}`} />
                            <DetailRow icon={<FiTruck size={20} />} label="Shipping Fee" value={`৳${order.paymentInfo.shippingFee}`} />
                            {order.paymentInfo.discount > 0 && (
                                <DetailRow icon={<FiTag size={20} />} label="Discount" value={`- ৳${order.paymentInfo.discount}`} />
                            )}
                             <div className="border-t pt-3 mt-3">
                                <DetailRow icon={<FiDollarSign size={20} />} label="Total Amount" value={<span className="font-bold text-lg text-indigo-600">৳{order.paymentInfo.totalAmount}</span>} />
                            </div>
                        </div>
                    </div>
                </div>

                <button onClick={onClose} className="w-full mt-8 bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-lg hover:bg-gray-300 transition-colors">
                    Close
                </button>
            </div>
        </div>
    );
};

export default OrderDetailsModal;