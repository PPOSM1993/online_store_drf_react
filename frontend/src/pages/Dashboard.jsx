import React, { useState } from "react";
import { Sidebar, Header, DashboardSalesTable } from "../index.js";
import { FaBoxOpen, FaUsers, FaShoppingCart } from "react-icons/fa";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-blue-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 md:ml-64">
        <Header />

        <main className="p-6">
          {/* Encabezado del dashboard */}
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </header>

          {/* Tarjetas resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-100 p-6 rounded-xl shadow flex items-center space-x-4">
              <FaShoppingCart className="text-indigo-500 text-3xl" />
              <div>
                <p className="text-sm text-gray-500">Pedidos</p>
                <h3 className="text-xl font-semibold">123</h3>
              </div>
            </div>

            <div className="bg-orange-100 p-6 rounded-xl shadow flex items-center space-x-4">
              <FaBoxOpen className="text-green-500 text-3xl" />
              <div>
                <p className="text-sm text-gray-500">Productos</p>
                <h3 className="text-xl font-semibold">58</h3>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-xl shadow flex items-center space-x-4">
              <FaUsers className="text-orange-500 text-3xl" />
              <div>
                <p className="text-sm text-gray-500">Clientes</p>
                <h3 className="text-xl font-semibold">300</h3>
              </div>
            </div>
          </div>

          {/* Tabla de últimos movimientos */}
          <div className="flex flex-wrap gap-6">
            <DashboardSalesTable />
            {/* Aquí podrías agregar otro componente complementario si deseas */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;