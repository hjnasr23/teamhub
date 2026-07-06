import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#030712] py-12 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-xl">
            <span className="text-emerald-500">TEAM</span>HUB
          </div>
          <p className="text-sm text-gray-500">
            The premium multitenant infrastructure for Moroccan sports associations and loyal supporters.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/discover" className="hover:text-emerald-500 transition-colors">
                Discover Clubs
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-emerald-500 transition-colors">
                Login Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media - Pure SVGs */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Follow Us</h3>
          <div className="flex space-x-4">

            {/* Twitter / X */}
            <a href="#" className="hover:text-emerald-500 transition-colors" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="#" className="hover:text-emerald-500 transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            {/* Youtube */}
            <a href="#" className="hover:text-emerald-500 transition-colors" aria-label="Youtube">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                <polygon points="10 15 15 12 10 9 10 15" />
              </svg>
            </a>

          </div>
        </div>

      </div>

      <div className="mt-8 border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} TEAMHUB. All rights reserved.</p>
      </div>
    </footer>
  );
}