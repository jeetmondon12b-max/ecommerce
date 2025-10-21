import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-300">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content Grid */}
        {/* 👇 এই লাইনে পরিবর্তন করা হয়েছে */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: MYSHOP */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">MYSHOP</h2>
            <p className="text-sm">
              Discover the latest trends and top-quality products. We are committed to providing you with the best online shopping experience.
            </p>
            <div className="flex items-center space-x-3">
              <FaPhoneAlt className="text-white" />
              <span>01818458143</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-white" />
              <span>meerishraka@gmail.com</span>
            </div>
          </div>

          {/* Column 2: QUICK LINKS */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Quick Links</h2>
            <ul className="space-y-2">
              <li><Link to="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/my-orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Column 3: HELP & SUPPORT */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Help & Support</h2>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/return-refund" className="hover:text-white transition-colors">Return & Refund</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: FOLLOW US */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Follow Us</h2>
            <p className="text-sm">Stay connected for the latest updates and offers.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-700 rounded-full hover:bg-blue-600 transition-colors">
                <FaFacebookF className="text-white" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-700 rounded-full hover:bg-pink-500 transition-colors">
                <FaInstagram className="text-white" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-700 rounded-full hover:bg-red-600 transition-colors">
                <FaYoutube className="text-white" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-700 rounded-full hover:bg-blue-700 transition-colors">
                <FaLinkedinIn className="text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="mb-2 sm:mb-0 text-center sm:text-left">
            Copyright &copy; {new Date().getFullYear()}  Meer Ishrak. All Rights Reserved.
          </p>
          <p>
            Developed by   <a href="https://your-portfolio-link.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:underline">Meer Ishrak</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;