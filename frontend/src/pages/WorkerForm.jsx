import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar, Header } from "../index.js";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import Swal from "sweetalert2";

const WorkerForm = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);

    const [formData, setFormData] = useState({
        full_name: "",
        tax_id: "",
        email: "",
        phone: "",
        address: "",
        position: "",
        department: "",
        salary: "",
        region: "",
        city: "",
        contract_type: "",
        is_active: true,
        notes: "",
    });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        axios.get("/data/regionesData.json").then((res) => setRegions(res.data));
        axios.get("/data/ciudadesData.json").then((res) => setCities(res.data));
    }, []);

    useEffect(() => {
        if (id) {
            const fetchWorker = async () => {
                try {
                    const token = localStorage.getItem("access_token");
                    const res = await axios.get(
                        `http://localhost:8000/api/worker/edit/${id}/`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setFormData(res.data);
                } catch (error) {
                    console.error("Error al cargar Trabajador:", error);
                    Swal.fire("Error", "No se pudo cargar el Trabajador.", "error");
                }
            };
            fetchWorker();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");
            if (id) {
                await axios.put(
                    `http://localhost:8000/api/worker/edit/${id}/`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                    
                );
            } else {
                await axios.post(`http://localhost:8000/api/worker/create/`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            Swal.fire({
                title: "Éxito",
                text: `Trabajador ${id ? "actualizado" : "registrado"} correctamente.`,
                icon: "success",
            }).then(() => navigate("/worker"));
        } catch (error) {
            console.error("Error completo:", error); // <-- Agrega esto
            console.log("Response data:", error.response?.data); // <-- Esto también

            const errorMsg =
                error.response?.data?.email?.[0] ||
                error.response?.data?.region_id?.[0] ||
                error.response?.data?.city_id?.[0] ||
                error.response?.data?.tax_id?.[0] ||
                error.response?.data?.phone?.[0] ||
                "Error al guardar.";

            Swal.fire("Error", errorMsg, "error");

        }
    };

    return (
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
                    <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
                        {id ? "Editar Trabajador" : "Nuevo Trabajador"}
                    </h1>
                    <div className="bg-white rounded-xl shadow p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Nombre</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Ingrese Nombre"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">RUT</label>
                                <input
                                    type="text"
                                    name="tax_id"
                                    value={formData.tax_id}
                                    onChange={handleChange}
                                    placeholder="Ej: 12345678-9"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!!id}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Ingrese Email"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!!id}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Teléfono</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Ingrese Teléfono"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!!id}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Dirección</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Ingrese Dirección"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Cargo</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    placeholder="Ej: Técnico"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Departamento</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Ej: Soporte"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Sueldo</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="Ej: 500000"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Región</label>
                                <select
                                    name="region"
                                    value={formData.region || ""}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccione una región</option>
                                    {regions.map((r) => (
                                        <option key={r.pk} value={r.pk}>
                                            {r.fields.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Ciudad</label>
                                <select
                                    name="city"
                                    value={formData.city || ""}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccione una ciudad</option>
                                    {cities
                                        .filter(
                                            (c) => c.fields.region === parseInt(formData.region)
                                        )
                                        .map((c) => (
                                            <option key={c.pk} value={c.pk}>
                                                {c.fields.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Tipo de Contrato</label>
                                <select
                                    name="contract_type"
                                    value={formData.contract_type || ""}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccione tipo de contrato</option>
                                    <option value="indefinido">Indefinido</option>
                                    <option value="plazo_fijo">Plazo fijo</option>
                                    <option value="honorarios">Honorarios</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="text-sm font-medium">Activo</label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Notas</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Notas adicionales del trabajador"
                                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    <FaSave />
                                    Guardar Trabajador
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default WorkerForm;
