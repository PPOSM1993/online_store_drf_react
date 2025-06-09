import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar, Header } from "../index.js";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import Swal from "sweetalert2";

const CustomerForm = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();  // <-- para saber si estamos editando
    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);

    const [formData, setFormData] = useState({
        customer_type: "individual",
        full_name: "",
        company: "",
        tax_id: "",
        bussiness_activity: "",
        email: "",
        phone: "",
        address: "",
        region: "",
        city: "",
    });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Obtener regiones y ciudades
    useEffect(() => {
        axios.get("/data/regionesData.json").then(res => setRegions(res.data));
        axios.get("/data/ciudadesData.json").then(res => setCities(res.data));
    }, []);

    // Precargar datos si estamos editando
    useEffect(() => {
        if (id) {
            const fetchCustomer = async () => {
                try {
                    const token = localStorage.getItem("access_token");
                    const res = await axios.get(`http://localhost:8000/api/customers/edit/${id}/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setFormData(res.data);
                } catch (error) {
                    console.error("Error al cargar cliente:", error);
                    Swal.fire("Error", "No se pudo cargar el cliente.", "error");
                }
            };
            fetchCustomer();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");

            if (id) {
                await axios.put(`http://localhost:8000/api/customers/edit/${id}/`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post(`http://localhost:8000/api/customers/create/`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            Swal.fire({
                title: "Éxito",
                text: `Cliente ${id ? "actualizado" : "registrado"} correctamente.`,
                icon: "success",
            }).then(() => navigate("/customers"));

        } catch (error) {
            const errorMsg = error.response?.data?.email?.[0] || "Error al guardar.";
            Swal.fire("Error", errorMsg, "error");
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
                    <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
                        {id ? "Editar Cliente" : "Nuevo Cliente"}
                    </h1>
                    <div className="bg-white rounded-xl shadow p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Tipo de cliente */}
                            <div>
                                <label className="block text-sm font-medium">Tipo de Cliente</label>
                                <select name="customer_type" value={formData.customer_type} onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded border-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="individual">Persona</option>
                                    <option value="company">Empresa</option>
                                </select>
                            </div>

                            {/* Persona o Empresa */}
                            {formData.customer_type === "individual" ? (
                                <div>
                                    <label className="block text-sm font-medium">Nombre</label>
                                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded" />
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium">Razón Social</label>
                                        <input type="text" name="company" value={formData.company} onChange={handleChange}
                                            className="w-full mt-1 p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Giro Comercial</label>
                                        <input type="text" name="bussiness_activity" value={formData.bussiness_activity} onChange={handleChange}
                                            className="w-full mt-1 p-2 border rounded" />
                                    </div>
                                </>
                            )}

                            {/* Otros campos */}
                            <div>
                                <label className="block text-sm font-medium">RUT</label>
                                <input type="text" name="tax_id" value={formData.tax_id} onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded" placeholder="Ej: 12345678-9" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded" disabled={!!id} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Teléfono</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded" disabled={!!id} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Dirección</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded" />
                            </div>

                            {/* Región y ciudad */}
                            <div>
                                <label className="block text-sm font-medium">Región</label>
                                <select name="region" value={formData.region} onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded">
                                    <option value="">Seleccione una región</option>
                                    {regions.map(r => (
                                        <option key={r.pk} value={r.pk}>{r.fields.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Ciudad</label>
                                <select name="city" value={formData.city} onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded">
                                    <option value="">Seleccione una ciudad</option>
                                    {cities
                                        .filter(c => c.fields.region === parseInt(formData.region))
                                        .map(c => (
                                            <option key={c.pk} value={c.pk}>{c.fields.name}</option>
                                        ))}
                                </select>
                            </div>

                            <div className="mt-4 text-right">
                                <button type="submit" className="bg-green-700 text-white p-3 rounded hover:bg-green-800">
                                    <FaSave className="inline mr-1" />
                                    {id ? "Actualizar Cliente" : "Crear Cliente"}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CustomerForm;
