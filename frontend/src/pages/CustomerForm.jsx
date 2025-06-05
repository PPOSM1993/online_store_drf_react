import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar, Header } from "../index.js";
import { useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import regionesData from "../../data/regionesData.json";
import ciudadesData from "../../data/ciudadesData.json";
import Swal from 'sweetalert2';

const CustomerForm = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const [formData, setFormData] = useState({
        customer_type: 'individual',
        first_name: '',
        last_name: '',
        company: '',
        tax_id: '', // RUT
        bussiness_activity: '', //Giro Comercial
        email: '',
        phone: '',
        address: '',
        region: '',
        city: '',
    });


    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        axios.get('/data/regionesData.json').then(res => setRegions(res.data));
        axios.get('/data/ciudadesData.json').then(res => setCities(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('http://localhost:8000/api/customers/create/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            Swal.fire({
                title: '¡Cliente registrado!',
                text: 'El cliente fue creado exitosamente.',
                icon: 'success',
                confirmButtonText: 'Ir al Dashboard'
            }).then(() => {
                navigate('/customers'); // Ajusta esta ruta si tu dashboard tiene otro path
            });

        } catch (error) {
            console.error("Error al registrar cliente:", error.response?.data || error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al registrar el cliente.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
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
                        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">New Customer</h1>
                        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto p-3">
                            <form
                                onSubmit={handleSubmit}
                                className="bg-white p-6 rounded-xl shadow-md w-full max-w-8xl space-y-4"
                            >
                                <h2 className="text-2xl font-bold text-gray-800">Registrar Cliente</h2>

                                {/* Tipo de cliente */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo de Cliente</label>
                                    <select
                                        name="customer_type"
                                        value={formData.customer_type}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    >
                                        <option value="individual">Persona</option>
                                        <option value="company">Empresa</option>
                                    </select>
                                </div>

                                {/* Campos según tipo */}
                                {formData.customer_type === 'individual' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Razón Social</label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                                placeholder="Ej: Mi Empresa S.A."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Giro Comerical</label>
                                            <input
                                                type="text"
                                                name="bussiness_activity"
                                                value={formData.bussiness_activity}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                            />
                                        </div>
                                    </>

                                )}

                                {/* Email, Teléfono, Dirección */}
                                <div>
                                    <label className="block text-sm font-medium">RUT</label>
                                    <input
                                        type="text"
                                        name="tax_id" // Asegúrate de usar tax_id, que es el campo en tu modelo
                                        value={formData.tax_id}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                        placeholder="Ej: 12345678-9"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        placeholder="Enter Email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                    <input
                                        placeholder="Enter Phone"
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    />
                                </div>

                                {/* Región */}
                                <div>
                                    <label>Región</label>
                                    <select name="region" value={formData.region} onChange={handleChange}
                                        className="w-full border p-2 rounded border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100">
                                        <option value="">Seleccione una región</option>
                                        {regions.map(r => (
                                            <option key={r.pk} value={r.pk}>{r.fields.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label>Ciudad</label>
                                    <select name="city" value={formData.city} onChange={handleChange}
                                        className="w-full border p-2 rounded border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100">
                                        <option value="">Seleccione una ciudad</option>
                                        {cities
                                            .filter(c => c.fields.region === parseInt(formData.region))
                                            .map(c => (
                                                <option key={c.pk} value={c.pk}>{c.fields.name}</option>
                                            ))}
                                    </select>
                                </div>

                                <div className="mt-4 text-right">
                                    <button className="bg-green-700 text-white p-3 rounded-md shadow hover:bg-green-800 transition border" type="submit">
                                        <FaSave className="inline mr-1" />
                                        Create Customer
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

export default CustomerForm;