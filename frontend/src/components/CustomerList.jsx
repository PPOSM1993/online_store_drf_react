import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar, Header } from "../index.js";
import { FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);



    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    //const token = localStorage.getItem("token");

    //const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = localStorage.getItem('access_token')
                const res = await axios.get('http://localhost:8000/api/customers/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setCustomers(res.data)
            } catch (error) {
                console.error('Error al obtener clientes:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [])


    return (
        <>
            <div className='min-h-screen bg-blue-100 flex'>
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

                {/* Overlay para móviles */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
                        onClick={toggleSidebar}
                    ></div>
                )}

                {/* Contenido principal */}
                <div className="flex-1 md:ml-64">
                    <Header />
                    <main className="flex-1 p-6">
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">Customer's List</h1>
                        {/* Buscador */}
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            className="px-4 py-2 mb-4 border rounded-md w-full max-w-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:border-blue-500"
                        />

                        {loading ? (
                            <p>Cargando clientes...</p>
                        ) : (

                            <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
                                <table className="min-w-full table-auto border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-2 text-left">ID</th>
                                            <th className="p-2 text-left">Name</th>
                                            <th className="p-2 text-left">Email</th>
                                            <th className="p-2 text-left">Phone</th>
                                            <th className="p-2 text-left">Address</th>
                                            <th className="p-2 text-left">Options</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {customers.map((c) => (
                                            <tr key={c.id} className="border-t">
                                                <td className="p-2">{c.id}</td>
                                                <td className="p-2">{c.first_name || c.company_name}</td>
                                                <td className="p-2">{c.email}</td>
                                                <td className="p-2">{c.phone}</td>
                                                <td className="p-2">{c.address}</td>
                                                <td className="p-2">
                                                    <button className="bg-yellow-500 text-black px-4 py-2 rounded mr-2">
                                                        <FaPen className="inline mr-1" />
                                                        Edit
                                                    </button>
                                                    <button className="bg-red-700 text-white px-4 py-2 rounded">
                                                        <MdDelete className="inline mr-1" />
                                                        Delete
                                                    </button>

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mt-4 text-gray-500">
                                    <button className="bg-green-700 text-white px-6 py-3 rounded">
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>

                        )}

                    </main>
                </div>
            </div>
        </>
    )
}

export default CustomerList;


