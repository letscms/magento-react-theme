import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EcoShop</h3>
            <p className="text-gray-400 mb-4">Your one-stop shop for all your needs.</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/letscms/" target="_blank" rel="noopener noreferrer" className="w-6 h-6 inline-flex justify-center items-center text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://x.com/letscms" target="_blank" rel="noopener noreferrer" className="w-6 h-6 inline-flex justify-center items-center text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/letscms/" target="_blank" rel="noopener noreferrer" className="w-6 h-6 inline-flex justify-center items-center text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://api.whatsapp.com/send?phone=919717478599" target="_blank" rel="noopener noreferrer" className="w-6 h-6 inline-flex justify-center items-center text-gray-400 hover:text-white">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          <div></div>
          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to={'/contact'} className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to={'/faq'} className="text-gray-400 hover:text-white">FAQs</Link></li>
              <li><Link to={'/shipping-returns'} className="text-gray-400 hover:text-white">Shipping & Returns</Link></li>
              <li><Link to={'/privacy-policy'} className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li><i className="fas fa-map-marker-alt mr-2"></i> 1/19. First Floor. In-front of Central Bank. Naurangabad, G T Road, Aligarh 202001, India.</li>
              <li><i className="fas fa-phone mr-2"></i> +91 9717478599</li>
              <li><i className="fas fa-envelope mr-2"></i> info@letscms.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-center">
          <p className="text-gray-400 text-sm">&copy; 2025 EcoShop. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            {/* Add payment icons here with fixed sizes */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
