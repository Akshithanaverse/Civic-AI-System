import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-emerald-400 transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-slate-300 hover:text-emerald-400 transition-colors duration-300">
                  Report Issue
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="text-slate-300 hover:text-emerald-400 transition-colors duration-300">
                  My Reports
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-emerald-400 transition-colors duration-300">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Civic-AI Mission */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Civic-AI Mission</h3>
            <p className="text-slate-300 mb-4">
              Empowering citizens to create better communities through AI-driven civic engagement.
              We believe in transparent, efficient, and responsive local government.
            </p>
            <div className="flex items-center space-x-2 text-emerald-400">
              <Heart size={16} />
              <span className="text-sm">Made with love for our cities</span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-slate-400" />
                <span className="text-slate-300">support@civic-ai.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-slate-400" />
                <span className="text-slate-300">1-800-CIVIC-AI</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-slate-400" />
                <span className="text-slate-300">City Hall, Main Street</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © 2026 Civic AI System. All rights reserved. | Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;