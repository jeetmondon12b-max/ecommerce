import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane, 
  FaInfoCircle, FaThLarge, FaInstagram, FaBoxOpen 
} from 'react-icons/fa';

const Footer = () => {
  // প্রতিটি কলামের শিরোনামের জন্য একটি স্টাইলড কম্পোনেন্ট
  const Title = ({ icon, text }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="border border-gray-500 rounded-full p-2">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white uppercase tracking-wider">{text}</h3>
    </div>
  );

  return (
    <footer className="bg-gradient-to-r from-indigo-800 to-purple-900 text-gray-300 w-full pt-16 pb-8">
      <div className="container mx-auto px-8">
        
        {/* উপরের অংশ: মূল কন্টেন্ট */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* কলাম ১: About & Newsletter */}
          <div className="space-y-4">
            <Title icon={<FaInfoCircle />} text="YourBrand" />
            <p className="flex items-start gap-3 text-sm">
              <FaMapMarkerAlt className="mt-1 text-indigo-400 flex-shrink-0" />
              <span>123 Shopping Street, Commerce Plaza, Dhaka, Bangladesh</span>
            </p>
            <p className="flex items-center gap-3 text-sm">
              <FaPhoneAlt className="text-indigo-400" />
              <span>+880 1234 567890</span>
            </p>
            <p className="flex items-center gap-3 text-sm">
              <FaEnvelope className="text-indigo-400" />
              <span>support@yourbrand.com</span>
            </p>
            <form className="flex mt-6">
              <input 
                type="email" 
                placeholder="Enter email for offers" 
                className="w-full bg-gray-800/50 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none"
              />
              <button 
                type="submit" 
                className="bg-indigo-600 text-white text-xl px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>

          {/* কলাম ২: Customer Service */}
          <div className="space-y-4">
            <Title icon={<FaThLarge />} text="Customer Service" />
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <img src="https://placehold.co/80x80/7e22ce/white?text=Q" alt="FAQ" className="w-16 h-16 rounded-md object-cover"/>
                <div>
                  <Link to="/faq" className="font-semibold text-white hover:text-indigo-400 transition-colors">Help & FAQ</Link>
                  <p className="text-xs text-gray-400">Find answers to your questions</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <img src="https://placehold.co/80x80/c026d3/white?text=R" alt="Returns" className="w-16 h-16 rounded-md object-cover"/>
                <div>
                  <Link to="/return-policy" className="font-semibold text-white hover:text-indigo-400 transition-colors">Returns & Exchanges</Link>
                  <p className="text-xs text-gray-400">Easy return policy</p>
                </div>
              </li>
            </ul>
          </div>

          {/* কলাম ৩: Quick Links */}
          <div className="space-y-4">
            <Title icon={<FaBoxOpen />} text="Quick Links" />
            <ul className="space-y-3 text-sm">
              <li><Link to="/my-account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/my-orders" className="hover:text-white transition-colors">Order History</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* কলাম ৪: Follow Us on Instagram */}
          <div className="space-y-4">
            <Title icon={<FaInstagram />} text="Follow Us" />
            <div className="grid grid-cols-3 gap-2">
              <a href="#"><img src="https://placehold.co/100x100/8b5cf6/ffffff?text=Product1" alt="Instagram 1" className="rounded-md hover:opacity-80 transition-opacity"/></a>
              <a href="#"><img src="https://placehold.co/100x100/a78bfa/ffffff?text=Product2" alt="Instagram 2" className="rounded-md hover:opacity-80 transition-opacity"/></a>
              <a href="#"><img src="https://placehold.co/100x100/c4b5fd/1e1b4b?text=Product3" alt="Instagram 3" className="rounded-md hover:opacity-80 transition-opacity"/></a>
              <a href="#"><img src="https://placehold.co/100x100/6d28d9/ffffff?text=NewIn" alt="Instagram 4" className="rounded-md hover:opacity-80 transition-opacity"/></a>
              <a href="#"><img src="https://placehold.co/100x100/5b21b6/ffffff?text=Sale" alt="Instagram 5" className="rounded-md hover:opacity-80 transition-opacity"/></a>
              <a href="#"><img src="https://placehold.co/100x100/4c1d95/ffffff?text=Offer" alt="Instagram 6" className="rounded-md hover:opacity-80 transition-opacity"/></a>
            </div>
          </div>

        </div>

        {/* নিচের অংশ: কপিরাইট */}
        <div className="mt-12 pt-8 border-t border-gray-700/50 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p className="text-center sm:text-left mb-4 sm:mb-0">
            Copyright &copy; {new Date().getFullYear()} YourBrand. All Rights Reserved.
          </p>
          <p>
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;