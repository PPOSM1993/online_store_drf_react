import React from "react";
import { Sidebar, Header } from "../index";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSave } from "react-icons/fa";
import { useState, useEffect } from "react";
import Select from "react-select";



const BooksForm = () => {


    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();  // <-- para saber si estamos editando
    const [author, setAuthor] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        isbn: '',
        author: null,
        purchase_price: 19, // +"%"
        final_price: ''
    });

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        author: ''
    });

    useEffect(() => {
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

        axios
            .get("http://localhost:8000/api/books/author/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log("Autores:", res.data);

                const options = res.data.map((author) => ({
                    value: author.id,   // o author.pk si estás usando ese nombre
                    label: author.name, // o author.nombre_completo, según tu modelo
                }));

                setAuthor(options);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Precargar datos si estamos editando


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
                            <form action=""
                                // onSubmit={handleSubmit} 
                                className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Libro</label>

                                    <label className="block text-sm font-medium">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        placeholder="Ingrese Nombre Libro"
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100" />
                                </div>

                                <div>
                                   <label className="block text-sm font-medium">ISBN</label>

                                    <input
                                        type="text"
                                        name="isbn"
                                        value={formData.isbn}
                                        onChange={handleChange}
                                        maxLength={13}
                                        pattern="\d{13}"
                                        placeholder="Ingrese ISBN-13 (13 dígitos)"
                                        required
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Autor</label>
                                    <Select
                                        options={author}
                                        onChange={(selectedOption) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                author: selectedOption?.value,
                                            }))
                                        }
                                        placeholder="Seleccione un autor"
                                        isClearable
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">IVA</label>
                                    <input
                                        type="number"
                                        name="purchase_price"
                                        value={formData.purchase_price}
                                        placeholder="Ingrese IVA"
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Precio Final</label>
                                    <input
                                        type="number"
                                        name="final_price"
                                        value={formData.final_price}
                                        onChange={handleChange}
                                        required
                                        placeholder="Precio Final"
                                        // disabled
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea
                                        name="description"
                                        value={formData.description || ""}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                        rows="4"
                                        placeholder="Descripción del Libro"
                                    ></textarea>


                                </div>

                                <div>
                                    <div>
                                        <select 
                                            name="author" 
                                            value={formData.author} 
                                            onChange={handleChange}
                                            className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100">
                                            <option value="author">Seleccione Autor</option>
                                            {author.map(r => (
                                                <option key={r.pk} value={r.pk}>{r.fields.author}</option>
                                            ))}
                                        </select>
                                    </div>
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