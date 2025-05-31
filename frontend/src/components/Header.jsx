// Layout.jsx
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { UserDropdown, Sidebar } from '../index'


const Header = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="bg-blue-100 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-blue-100 shadow px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <button className="md:hidden text-2xl text-gray-700" onClick={toggleSidebar}>
              <FaBars />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">ERP Admin System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <UserDropdown />
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Header;
