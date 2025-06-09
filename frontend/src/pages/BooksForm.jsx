import React from "react";
import { Sidebar, Header } from "../index";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSave } from "react-icons/fa";
import { useState, useEffect } from "react";



const BooksForm = () => {


    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();  // <-- para saber si estamos editando

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Precargar datos si estamos editando


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");


            await axios.post(`http://localhost:8000/api/books/create/`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Swal.fire({
                title: "Éxito",
                text: `Categoria ${id ? "actualizada" : "registrado"} correctamente.`,
                icon: "success",
            }).then(() => navigate("/category"));

        } catch (error) {
            const errorMsg = error.response?.data?.email?.[0] || "Error al guardar.";
            Swal.fire("Error", errorMsg, "error");
        }
    };
    return (
        <>
            <div className="min-h-screen bg-blue-100 flex flex-col md:flex-row">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black opacity-40 z-40 md:hidden" onClick={toggleSidebar}></div>
                )}
                <div className="flex-1 md:ml-64">
                    <Header />
                    <main className="p-4 sm:p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Registrar Libro</h1>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <form action="" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Nombre</label>
                                    <input type="text" name="name" value={formData.full_name}
                                        placeholder="Ingre Nombre Libro" //onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100" />
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default BooksForm;