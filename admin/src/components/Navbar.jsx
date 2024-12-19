import React from "react";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" className="w-[max(30%,240px)]">
        {/* White Background */}
        <rect width="400" height="120" fill="#ffffff" />
        
        {/* Main Text */}
        <text x="50" y="75" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" fill="#333333">
          SNEAK
          <tspan fill="#4A90E2">STER</tspan>
        </text>
        
        {/* Stylized Sneaker Icon */}
        <path d="M340 45 C330 45, 325 35, 325 30 C325 25, 330 20, 340 20 C350 20, 355 25, 355 30 C355 35, 350 45, 340 45" fill="#4A90E2" />
        <path d="M355 30 L370 35 C375 36, 380 40, 380 45 L355 45 L355 30" fill="#333333" />
        
        {/* Decorative Line */}
        <line x1="50" y1="85" x2="350" y2="85" stroke="#4A90E2" strokeWidth="2" />
        
        {/* Subtitle */}
        <text x="50" y="105" fontFamily="Arial, sans-serif" fontSize="14" fill="#666666">ADMIN PANEL</text>
      </svg>
      <button onClick={() => setToken('')} className="bg-gray-600 text-white px-5">Logout</button>
    </div>
  );
};

export default Navbar;
