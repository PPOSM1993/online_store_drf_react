import React, { useState } from "react";
import { Link } from 'react-router-dom'

import {
  FaTachometerAlt,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaUsers,
  FaBoxOpen,
  FaTags,
  FaUserTie,
  FaUserShield,
  FaMoneyBill,
  FaChartBar,
  FaCog,
  FaAngleDown,
} from "react-icons/fa";

import logoerp from '../assets/logoerp.png';

const SidebarItem = ({ icon: Icon, label, submenu, open, setOpen }) => {
  const isOpen = open === label;

  return (
    <div>
      <button
        className="flex items-center justify-between w-full text-left text-gray-100 hover:text-indigo-500 py-2 cursor-pointer transition-colors"
        onClick={() => setOpen(isOpen ? null : label)}
      >
        <span className="flex items-center space-x-2">
          <Icon className="text-lg" />
          <span>{label}</span>
        </span>
        {submenu && (
          <FaAngleDown
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {submenu && (
        <div
          className={`pl-6 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          {submenu.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              className="block text-sm text-gray-300 hover:text-indigo-400 transition-colors"
            >
              {item.label}
            </Link>

          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);

  return (
    <div
      className={`fixed top-0 left-0 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-600 md:block">
        <div className="flex justify-center">
          <img src={logoerp} alt="Logo" className="w-32 h-auto" />
        </div>
        <button onClick={toggleSidebar} className="md:hidden text-xl text-white">
          ✕
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-4 space-y-6 px-6 text-white pb-10 overflow-y-auto scrollbar-none scroll">
        <SidebarItem icon={FaTachometerAlt} label="Dashboard" />

        <SidebarItem
          icon={FaShoppingCart}
          label="Ventas"
          submenu={[
            { label: "Pedidos", href: "#" },
            { label: "Facturación", href: "#" },
            { label: "Clientes", href: "/customers" }, // ✅ ruta funcional
            { label: "Carritos abandonados", href: "#" },
          ]}
          open={openSubmenu}
          setOpen={setOpenSubmenu}
        />

        <SidebarItem
          icon={FaFileInvoiceDollar}
          label="Compras"
          submenu={[
            { label: "Órdenes", href: "#" },
            { label: "Proveedores", href: "/suppliers" },
          ]}
          open={openSubmenu}
          setOpen={setOpenSubmenu}
        />

        <SidebarItem
          icon={FaBoxOpen}
          label="Inventario"
          submenu={[
            { label: "Productos", href: "/books" },
            { label: "Categorías", href: "/category" },
          ]}
          open={openSubmenu}
          setOpen={setOpenSubmenu}
        />

        <SidebarItem
          icon={FaUserTie}
          label="RRHH"
          submenu={[
            { label: "Trabajadores", href: "#" },
            { label: "Permisos", href: "#" },
          ]}
          open={openSubmenu}
          setOpen={setOpenSubmenu}
        />

        <SidebarItem
          icon={FaMoneyBill}
          label="Finanzas"
          submenu={[
            { label: "Pagos", href: "#" },
            { label: "Reportes", href: "#" },
          ]}
          open={openSubmenu}
          setOpen={setOpenSubmenu}
        />

        <SidebarItem
          icon={FaCog}
          label="Configuración"
          submenu={[{ label: "General", href: "#" }]}
          open={openSubmenu}
          setOpen={setOpenSubmenu}
        />
      </nav>
    </div>
  );
};

export default Sidebar;
