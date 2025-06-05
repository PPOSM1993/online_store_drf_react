import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar, Header } from "../index.js";
import { FaPen, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CustomerForm } from '../index.js';
import { Link } from "react-router-dom";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [listData, setlistData] = useState({
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

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const res = await axios.get('http://localhost:8000/api/customers/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCustomers(res.data);
            } catch (error) {
                console.error('Error al obtener clientes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

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
                    <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Customer's List</h1>

                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        className="w-full max-w-md px-4 py-2 mb-4 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:border-blue-100"
                    />

                    {loading ? (
                        <p className="text-gray-700">Cargando clientes...</p>
                    ) : (
                        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
                            <table className="min-w-full table-auto border border-gray-200 text-sm sm:text-base">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-2 text-left">Name</th>
                                        <th className="p-2 text-left">Email</th>
                                        <th className="p-2 text-left">Phone</th>
                                        <th className="p-2 text-left">Address</th>
                                        <th className="p-2 text-left">Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((c) => (
                                        <tr key={c.id} className="border-t hover:bg-gray-50">
                                            {/* Listado de Cliente Segun Persona o Cliente */}
                                            {
                                                c.customer_type === 'individual' ? (
                                                    <>
                                                        <td className="p-2">
                                                            {c.first_name} {c.last_name}
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="p-2">
                                                            {c.company}
                                                        </td>
                                                    </>
                                                )
                                            }
                                            <td className="p-2">{c.email}</td>
                                            <td className="p-2">{c.phone}</td>
                                            <td className="p-2">{c.address}</td>
                                            <td className="p-3 space-x-2 whitespace-nowrap">
                                                <button className="bg-yellow-500 text-black px-3 py-2 rounded text-xs sm:text-sm">
                                                    <FaPen className="inline mr-1" /> Edit
                                                </button>
                                                <button className="bg-red-700 text-white px-3 py-2 rounded text-xs sm:text-sm">
                                                    <MdDelete className="inline mr-1" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-4 text-right">
                                <button className="bg-green-700 text-white p-3 rounded-md shadow hover:bg-green-800 transition">
                                    <Link to="/customers/create" className="flex items-center justify-center space-x-2">
                                        <FaPlus className="inline mr-1" />
                                        New Customer
                                    </Link>

                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CustomerList;