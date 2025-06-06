import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Sidebar, Header } from "../index";

const CategoryList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("access_token");
    const res = await axios.get("http://localhost:8000/api/category/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    {
      name: "Nombre",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: row => row.description || "-",
    },
    {
      name: "Acciones",
      cell: row => (
        <Link to={`/categories/edit/${row.id}`} className="text-blue-600 hover:underline">
          <FaPen className="inline" /> Editar
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col md:flex-row">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-40 z-40 md:hidden" onClick={toggleSidebar}></div>
      )}
      <div className="flex-1 md:ml-64">
        <Header />
        <main className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Categorías</h1>
            <Link to="/categories/create" className="bg-green-700 text-white p-2 rounded shadow hover:bg-green-800">
              <FaPlus className="inline mr-1" /> Nueva Categoría
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <DataTable
              columns={columns}
              data={categories}
              pagination
              highlightOnHover
              responsive
              striped
              noHeader
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryList;
