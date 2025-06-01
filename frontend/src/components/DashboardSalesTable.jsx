// src/components/DashboardSalesTable.jsx
import React from "react";

const sales = [
  {
    id: "ORD1234",
    date: "2025-05-30",
    client: "Juan Pérez",
    items: 3,
    total: 158000,
    method: "Tarjeta",
    status: "Completado",
  },
  {
    id: "ORD1235",
    date: "2025-05-30",
    client: "Ana Torres",
    items: 1,
    total: 39900,
    method: "Efectivo",
    status: "Pendiente",
  },
  // Agrega más datos de ejemplo aquí...
];

const DashboardSalesTable = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full md:w-1/2 overflow-x-auto p-10">
      <h2 className="text-lg font-semibold mb-4">Last Store Movements</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 border-b">
            <th className="py-2">Date</th>
            <th className="py-2">Pedido</th>
            <th className="py-2">Customers</th>
            <th className="py-2">Items</th>
            <th className="py-2">Total</th>
            <th className="py-2">Método</th>
            <th className="py-2">State</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{sale.date}</td>
              <td className="py-2">{sale.id}</td>
              <td className="py-2">{sale.client}</td>
              <td className="py-2">{sale.items}</td>
              <td className="py-2">${sale.total.toLocaleString()}</td>
              <td className="py-2">{sale.method}</td>
              <td className={`py-2 font-semibold ${sale.status === "Completado" ? "text-green-600" : sale.status === "Pendiente" ? "text-yellow-600" : "text-red-600"}`}>
                {sale.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardSalesTable;
