import React from 'react';
import { FaBox, FaCogs, FaShippingFast, FaCheckCircle } from 'react-icons/fa';

const OrderStatusTracker = ({ status }) => {
    // অর্ডারের ধাপগুলো সংজ্ঞায়িত করা
    const stages = [
        { name: 'Pending', icon: <FaBox size={20} /> },
        { name: 'Processing', icon: <FaCogs size={20} /> },
        { name: 'Shipped', icon: <FaShippingFast size={20} /> },
        { name: 'Delivered', icon: <FaCheckCircle size={20} /> },
    ];

    const currentStageIndex = stages.findIndex(stage => stage.name === status);

    // যদি স্ট্যাটাসটি আমাদের ধাপের মধ্যে না থাকে (যেমন: Cancelled), তাহলে ট্র্যাকার দেখাবে না
    if (currentStageIndex === -1) {
        return null;
    }

    return (
        <div className="w-full py-4 px-2 sm:px-4">
            <div className="flex justify-between items-start">
                {stages.map((stage, index) => {
                    const isCompleted = index < currentStageIndex;
                    const isCurrent = index === currentStageIndex;

                    return (
                        <React.Fragment key={stage.name}>
                            {/* কানেক্টর লাইন (শুধুমাত্র মাঝের ধাপগুলোর জন্য) */}
                            {index > 0 && (
                                <div className={`flex-1 h-1 mt-5 rounded-full ${index <= currentStageIndex ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            )}

                            {/* ধাপের আইকন এবং টেক্সট */}
                            <div className="flex flex-col items-center text-center w-20">
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-white
                                        transition-all duration-300
                                        ${isCompleted ? 'bg-green-500' : ''}
                                        ${isCurrent ? 'bg-blue-500 animate-pulse' : ''}
                                        ${!isCompleted && !isCurrent ? 'bg-gray-400' : ''}
                                    `}
                                >
                                    {stage.icon}
                                </div>
                                {/* ✅✅✅ প্রতিটি আইকনের নিচে নাম যোগ করা হয়েছে ✅✅✅ */}
                                <p className={`
                                    mt-2 text-xs sm:text-sm font-semibold
                                    transition-colors duration-300
                                    ${isCompleted || isCurrent ? 'text-gray-800' : 'text-gray-500'}
                                `}>
                                    {stage.name}
                                </p>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusTracker;