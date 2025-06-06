import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { Sidebar, Header } from "../index";
import { MdDelete } from "react-icons/md";

const CategoryList = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [perPage, setPerPage] = useState(10);

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

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchCategories(filterText);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [filterText]);


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
                <div className="flex items-center space-x-2">
                    <button
                        onClick=""
                        className="bg-yellow-500 text-black px-3 py-3 rounded text-xs sm:text-sm cursor-pointer hover:bg-yellow-600 transition"
                        title="Editar"
                    >
                        <FaPen />
                    </button>
                    <button
                        onClick=""
                        className="bg-red-500 text-white px-3 py-3 rounded text-xs sm:text-sm cursor-pointer hover:bg-red-600 transition"
                        title="Eliminar"
                    >
                        <MdDelete />
                    </button>
                </div>
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
                        <Link to="/category/create" className="bg-green-700 text-white p-2 rounded shadow hover:bg-green-800">
                            <FaPlus className="inline mr-1" /> Nueva Categoría
                        </Link>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <DataTable
                            columns={columns}
                            data={categories}
                            pagination
                            paginationPerPage={perPage}
                            paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                            onChangeRowsPerPage={setPerPage}
                            highlightOnHover
                            responsive
                            striped
                            noDataComponent="No se encontraron resultados"
                            className="min-w-full table-auto border border-gray-200 text-sm sm:text-base"
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CategoryList;