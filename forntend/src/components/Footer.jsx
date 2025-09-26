import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaFacebook, FaInstagram, FaYoutube, FaLinkedin,
    FaPhoneAlt, FaEnvelope 
} from 'react-icons/fa';

const Footer = () => {
    // সাব-হেডিং স্টাইল করার জন্য একটি ছোট কম্পোনেন্ট
    const FooterTitle = ({ children }) => (
        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
            {children}
        </h3>
    );

    // প্রতিটি লিঙ্কের জন্য একটি ছোট কম্পোনেন্ট
    const FooterLink = ({ to, children }) => (
        <li>
            <Link to={to} className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block">
                {children}
            </Link>
        </li>
    );

    // সোশ্যাল মিডিয়া আইকনের জন্য একটি ছোট কম্পোনেন্ট
    const SocialIcon = ({ href, icon }) => (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-indigo-500 hover:scale-110 transition-all duration-300"
        >
            {icon}
        </a>
    );

    return (
        <footer className="bg-slate-900 text-gray-300 w-full">
            <div className="container mx-auto px-6 pt-16 pb-8">
                
                {/* মূল কন্টেন্ট সেকশন */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* কলাম ১: ব্র্যান্ড এবং কন্টাক্ট */}
                    <div className="space-y-4">
                        <FooterTitle>MyShop</FooterTitle>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Discover the latest trends and top-quality products. We are committed to providing you with the best online shopping experience.
                        </p>
                        <div className="space-y-3 pt-2">
                            <a href="tel:01818458143" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                                <FaPhoneAlt className="text-indigo-400"/>
                                <span>01818458143</span>
                            </a>
                            <a href="mailto:meerishraka@gmail.com" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                                <FaEnvelope className="text-indigo-400"/>
                                <span>meerishraka@gmail.com</span>
                            </a>
                        </div>
                    </div>

                    {/* কলাম ২: Quick Links */}
                    <div className="space-y-4">
                        <FooterTitle>Quick Links</FooterTitle>
                        <ul className="space-y-3">
                            <FooterLink to="/about">About Us</FooterLink>
                            <FooterLink to="/contact">Contact Us</FooterLink>
                            <FooterLink to="/my-orders">My Orders</FooterLink>
                            <FooterLink to="/wishlist">Wishlist</FooterLink>
                        </ul>
                    </div>

                    {/* কলাম ৩: Help & Support */}
                    <div className="space-y-4">
                        <FooterTitle>Help & Support</FooterTitle>
                        <ul className="space-y-3">
                            <FooterLink to="/faq">FAQ</FooterLink>
                            <FooterLink to="/shipping-policy">Shipping Policy</FooterLink>
                            <FooterLink to="/return-policy">Return & Refund</FooterLink>
                            <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
                        </ul>
                    </div>

                    {/* কলাম ৪: Follow Us */}
                    <div className="space-y-4">
                        <FooterTitle>Follow Us</FooterTitle>
                        <p className="text-gray-400 text-sm">
                            Stay connected for the latest updates and offers.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <SocialIcon href="https://facebook.com" icon={<FaFacebook size={20} />} />
                            <SocialIcon href="https://instagram.com" icon={<FaInstagram size={20} />} />
                            <SocialIcon href="https://youtube.com" icon={<FaYoutube size={20} />} />
                            <SocialIcon href="https://linkedin.com" icon={<FaLinkedin size={20} />} />
                        </div>
                    </div>
                </div>

                {/* নিচের অংশ: কপিরাইট এবং ক্রেডিট */}
                <div className="mt-12 pt-8 border-t border-gray-700/50 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
                    <p className="text-center sm:text-left mb-4 sm:mb-0">
                        Copyright &copy; {new Date().getFullYear()} Ishrak. All Rights Reserved.
                    </p>
                    <p>
                        Developed by <a href="mailto:meerishraka@gmail.com" className="font-semibold text-indigo-400 hover:text-white transition-colors">Meer Ishrak</a>
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;