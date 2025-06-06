import React, { useState } from "react";
import axios from "axios";
import { Sidebar, Header } from "../index";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSave } from "react-icons/fa";

const CategoryForm = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");
            await axios.post("http://localhost:8000/api/category/create/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            Swal.fire("¡Categoría registrada!", "", "success").then(() => {
                navigate("/category");
            });
        } catch (error) {
            console.error("Error al registrar categoría:", error);
            Swal.fire("Error", "No se pudo registrar la categoría.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-blue-100 flex flex-col md:flex-row">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black opacity-40 z-40 md:hidden" onClick={toggleSidebar}></div>
            )}
            <div className="flex-1 md:ml-64">
                <Header />
                <main className="p-4 sm:p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Registrar Categoría</h1>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 border-none focus:outline-none focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 border-none resize-none focus:outline-none focus:ring-blue-500"
                                ></textarea>
                            </div>
                            <div className="text-right">
                                <button
                                    type="submit"
                                    className="bg-green-700 text-white p-3 rounded-md shadow hover:bg-green-800 transition cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!formData.name.trim()}
                                >
                                    <FaSave className="inline mr-1" /> Guardar Categoría
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CategoryForm;
