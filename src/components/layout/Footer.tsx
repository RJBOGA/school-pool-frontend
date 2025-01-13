import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-600">SchoolPool</h3>
            <p className="text-gray-600">
              Making student transportation safe, affordable, and convenient.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/info#about" className="text-gray-600 hover:text-primary-600">About Us</Link>
              </li>
              <li>
                <Link to="/info#how-it-works" className="text-gray-600 hover:text-primary-600">How It Works</Link>
              </li>
              <li>
                <Link to="/info#safety" className="text-gray-600 hover:text-primary-600">Safety</Link>
              </li>
              <li>
                <Link to="/info#universities" className="text-gray-600 hover:text-primary-600">Universities</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/info#help" className="text-gray-600 hover:text-primary-600">Help Center</Link>
              </li>
              <li>
                <Link to="/info#legal" className="text-gray-600 hover:text-primary-600">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/info#legal" className="text-gray-600 hover:text-primary-600">Terms of Service</Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-600 hover:text-primary-600">Admin Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2">
              <p className="flex items-center text-gray-600">
                <Mail size={16} className="mr-2" />
                <a href="mailto:support@schoolpool.com" className="hover:text-primary-600">
                  support@schoolpool.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} SchoolPool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;