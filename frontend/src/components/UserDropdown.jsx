import React, { useState, useRef, useEffect } from "react";
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-1 rounded-md hover:bg-gray-200 transition"
      >
        <img
          src="https://ui-avatars.com/api/?name=Pedro+Osorio&background=4F46E5&color=fff"
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <span className="hidden md:inline font-medium text-gray-700">Pedro</span>
        <FiChevronDown className="text-gray-600" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-fade-in">
          <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b">
            Opciones
          </div>
          <a
            href="/perfil"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FiUser className="mr-2" /> Perfil
          </a>
          <a
            href="/configuracion"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <FiSettings className="mr-2" /> Configuración
          </a>
          <button
            onClick={() => console.log("Cerrar sesión")}
            className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            <FiLogOut className="mr-2" /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
