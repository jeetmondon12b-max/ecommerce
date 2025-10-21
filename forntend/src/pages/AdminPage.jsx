import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../apiConfig';
import { FiUsers, FiShoppingBag, FiPackage, FiPlusCircle, FiList, FiLayers, FiImage, FiLoader, FiAlertCircle, FiTag, FiDollarSign, FiTrendingUp, FiPieChart, FiClipboard, FiCheck } from 'react-icons/fi';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler, TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Registering TimeScale for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler, TimeScale);

// StatCard Component
const StatCard = ({ title, value, icon, color, loading }) => (
    <div className={`relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600 text-3xl`}>{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                {loading ? <div className="w-24 h-8 mt-1 bg-gray-200 rounded animate-pulse"></div> : <p className="text-3xl font-bold text-gray-800">{value}</p>}
            </div>
        </div>
    </div>
);

// ActionLink Component
const ActionLink = ({ to, icon, title, color }) => (
    <Link to={to} className="flex flex-col items-center justify-center p-4 transition-all duration-300 bg-gray-100 group rounded-xl hover:bg-indigo-600 hover:text-white hover:shadow-lg">
        <div className={`text-4xl mb-2 text-${color}-500 group-hover:text-white transition-colors`}>{icon}</div>
        <span className="font-semibold text-gray-700 transition-colors group-hover:text-white">{title}</span>
    </Link>
);


const AdminPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userInfo } = useAuth();
    const [salesPeriod, setSalesPeriod] = useState(30);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${API_URL}/api/admin/stats?days=${salesPeriod}`, config);

                const salesMap = new Map(data.dailySales.map(item => [item._id, item.totalAmount]));
                const fullSalesData = [];
                for (let i = 0; i < salesPeriod; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateString = date.toISOString().split('T')[0];
                    fullSalesData.push({
                        _id: dateString,
                        totalAmount: salesMap.get(dateString) || 0
                    });
                }
                fullSalesData.reverse();
                setDashboardData({ ...data, dailySales: fullSalesData });
            } catch (err) {
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        if (userInfo && userInfo.token) fetchDashboardData();
    }, [userInfo, salesPeriod]);

    const copyToClipboard = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const salesChartData = {
        datasets: [{
            label: `Sales (৳)`,
            data: dashboardData?.dailySales.map(d => ({ x: new Date(d._id), y: d.totalAmount })) || [],
            borderColor: '#4F46E5',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                if (!ctx) return null;
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, 'rgba(79, 70, 229, 0.5)');
                gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
                return gradient;
            },
            pointRadius: salesPeriod > 30 ? 0 : 2,
            pointBackgroundColor: '#4F46E5',
            tension: 0.3,
            fill: true,
        }],
    };

    const salesChartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: {
                type: 'time', time: { unit: 'day', displayFormats: { day: 'd MMM' } },
                grid: { display: false },
                ticks: { autoSkip: true, maxTicksLimit: 8, maxRotation: 0, minRotation: 0 }
            },
            y: { ticks: { callback: (value) => value > 0 ? `৳${value / 1000}k` : '৳0' } }
        }
    };

    const orderStatusChartData = {
        labels: dashboardData?.orderStatusCounts.map(s => s._id) || [],
        datasets: [{
            data: dashboardData?.orderStatusCounts.map(s => s.count) || [],
            backgroundColor: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#64748B'],
            borderColor: '#fff',
            borderWidth: 4,
            hoverOffset: 10
        }],
    };
    
    // ✅✅✅ This object is crucial for determining the status colors ✅✅✅
    const orderStatusColors = {'Pending': 'yellow', 'Delivered': 'green', 'Processing': 'blue', 'Cancelled': 'red', 'Shipped': 'purple', 'Default': 'gray'};
    const totalOrdersCount = dashboardData?.orderStatusCounts.reduce((sum, item) => sum + item.count, 0) || 0;

    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500"><FiAlertCircle className="text-4xl" /><p className="ml-4 text-lg">{error}</p></div>;

    return (
        <div className="min-h-screen p-2 bg-gray-100 md:p-4 lg:p-8">
            <div className="container mx-auto space-y-6 md:space-y-8">
                {/* Header and Stat Cards */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Dashboard Overview</h1>
                    <div className="text-sm font-semibold text-gray-500 md:text-base">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
                    <StatCard title="Total Sales" value={`৳${(dashboardData?.totalSales || 0).toLocaleString('en-US')}`} icon={<FiDollarSign />} color="green" loading={loading} />
                    <StatCard title="Total Users" value={(dashboardData?.totalUsers || 0).toLocaleString('en-US')} icon={<FiUsers />} color="blue" loading={loading} />
                    <StatCard title="Total Products" value={(dashboardData?.totalProducts || 0).toLocaleString('en-US')} icon={<FiPackage />} color="purple" loading={loading} />
                    <StatCard title="Total Orders" value={(dashboardData?.totalOrders || 0).toLocaleString('en-US')} icon={<FiShoppingBag />} color="yellow" loading={loading} />
                </div>

                {/* Charts */}
                <div className="flex flex-col gap-8 lg:flex-row">
                    <div className="w-full p-4 bg-white shadow-xl lg:w-7/12 rounded-2xl sm:p-6">
                        <div className="flex flex-col items-start justify-between gap-4 mb-4 sm:flex-row sm:items-center">
                            <h2 className="flex items-center text-lg font-bold text-gray-800 md:text-xl"><FiTrendingUp className="mr-2 text-indigo-600"/>Sales Trend</h2>
                            <div className="flex p-1 space-x-1 bg-gray-200 rounded-lg">
                                {[7, 30, 90].map(period => (
                                    <button key={period} onClick={() => setSalesPeriod(period)} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${salesPeriod === period ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}>
                                        {period} Days
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-80">{loading ? <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse" /> : <Line options={salesChartOptions} data={salesChartData} />}</div>
                    </div>
                    
                    <div className="flex flex-col w-full p-4 bg-white shadow-xl lg:w-5/12 rounded-2xl sm:p-6">
                        <div className='flex items-center justify-between'>
                           <h2 className="flex items-center text-lg font-bold text-gray-800 md:text-xl"><FiPieChart className="mr-2 text-indigo-600"/>Order Status</h2>
                           <p className='text-sm font-semibold text-gray-500'>Last {salesPeriod} days data</p>
                        </div>
                        {loading ? <div className="w-full h-full mt-4 bg-gray-200 rounded-lg animate-pulse" /> : (
                            <div className="flex flex-col items-center justify-center flex-grow pt-4 md:flex-row">
                                <div className="w-40 h-40 md:w-48 md:h-48"><Doughnut data={orderStatusChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} /></div>
                                <div className="w-full mt-4 space-y-2 md:mt-0 md:ml-6">
                                    {dashboardData?.orderStatusCounts.map((status, index) => (
                                        <div key={index} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center">
                                                <span className={`w-3 h-3 mr-2 rounded-full bg-${orderStatusColors[status._id] || orderStatusColors['Default']}-500`}></span>
                                                <span className="font-semibold text-gray-600">{status._id}</span>
                                            </div>
                                            <div className="font-bold text-gray-800">{status.count} <span className="text-xs font-normal text-gray-500">({((status.count / totalOrdersCount) * 100 || 0).toFixed(1)}%)</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="p-4 bg-white shadow-xl sm:p-6 rounded-2xl">
                    <h2 className="mb-4 text-xl font-bold text-gray-800">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-gray-200 bg-gray-50">
                                    <th className="p-3 text-sm font-semibold tracking-wide text-gray-600">Order ID</th>
                                    <th className="hidden p-3 text-sm font-semibold tracking-wide text-gray-600 sm:table-cell">Customer</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-gray-600">Date</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-gray-600">Amount</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? Array(5).fill(0).map((_, i) => (
                                    <tr key={i}><td colSpan="5" className="p-4"><div className="w-full h-6 bg-gray-200 rounded animate-pulse" /></td></tr>
                                )) : dashboardData?.recentOrders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="flex items-center p-3 font-mono text-xs text-gray-700 md:text-sm">
                                            <span>{order._id}</span>
                                            <button onClick={() => copyToClipboard(order._id)} className="ml-2 text-gray-400 hover:text-indigo-600">
                                                {copiedId === order._id ? <FiCheck className="text-green-500"/> : <FiClipboard />}
                                            </button>
                                        </td>
                                        <td className="hidden p-3 font-medium text-gray-800 sm:table-cell">{order.user?.name || 'N/A'}</td>
                                        <td className="p-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US')}</td>
                                        <td className="p-3 font-semibold text-gray-800">৳{order.paymentInfo.totalAmount.toLocaleString('en-US')}</td>
                                        
                                        {/* ✅✅✅ The change has been made right here ✅✅✅ */}
                                        <td className="p-3">
                                            <span className={`px-3 py-1 text-xs font-bold text-white rounded-full bg-${orderStatusColors[order.orderStatus] || orderStatusColors['Default']}-500`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                 {/* Quick Actions */}
                 <div className="p-6 bg-white shadow-xl rounded-2xl">
                     <h2 className="mb-6 text-2xl font-bold text-gray-800">Quick Actions</h2>
                     <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3 md:grid-cols-6 md:gap-6">
                         <ActionLink to="/admin/products/edit/new" icon={<FiPlusCircle />} title="Add Product" color="green" />
                         <ActionLink to="/admin/orders" icon={<FiShoppingBag />} title="Orders" color="blue" />
                         <ActionLink to="/admin/coupons" icon={<FiTag />} title="Coupons" color="orange" />
                         <ActionLink to="/admin/page-categories" icon={<FiLayers />} title="Page Categories" color="purple" />
                         <ActionLink to="/admin/categories" icon={<FiList />} title="Categories" color="yellow" />
                         <ActionLink to="/admin/banners" icon={<FiImage />} title="Banners" color="pink" />
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default AdminPage;