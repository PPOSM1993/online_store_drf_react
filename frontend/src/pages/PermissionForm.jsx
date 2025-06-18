import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Sidebar, Header } from "../index";

const PermissionForm = () => {
    const { id } = useParams(); // Si hay id → edición
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        code: ""
    });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);




    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode) {
            const fetchPermission = async () => {
                try {
                    const token = localStorage.getItem("access_token");
                    const res = await axios.get(`http://localhost:8000/api/permissions/permissions/${id}/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setFormData(res.data);
                } catch (error) {
                    console.error("Error al cargar el permiso:", error);
                }
            };
            fetchPermission();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");

        try {
            if (isEditMode) {
                await axios.put(`http://localhost:8000/api/permissions/permissions/${id}/`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Swal.fire("Actualizado", "Permiso actualizado correctamente", "success");
            } else {
                await axios.post(`http://localhost:8000/api/permissions/permissions/`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Swal.fire("Creado", "Permiso creado correctamente", "success");
            }
            navigate("/permissions");
        } catch (error) {
            console.error("Error al guardar el permiso:", error);
            Swal.fire("Error", "No se pudo guardar el permiso", "error");
        }
    };

    return (
        <>
            <div className="min-h-screen bg-blue-100 flex flex-col md:flex-row">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
                        onClick={toggleSidebar}
                    ></div>
                )}
                <div className="flex-1 md:ml-64">
                    <Header />
                    <main className="p-4 sm:p-6">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-bold mb-4">{isEditMode ? "Editar Permiso" : "Nuevo Permiso"}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block mb-1 font-medium">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Ej: Ver usuarios"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">Código</label>
                                    <input
                                        type="text"
                                        name="code"
                                        placeholder="Ej: view_user"
                                        value={formData.code}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="text-right">
                                    <button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                                    >
                                        {isEditMode ? "Actualizar" : "Crear"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>

            </div>

        </>
    );
};

export default PermissionForm;