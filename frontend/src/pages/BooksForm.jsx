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
    const [category, setCategory] = useState([]);
    const [publisher, setPublisher] = useState([]);
    const [coverImage, setCoverImage] = useState(null);


    const [formData, setFormData] = useState({
        title: "",
        author: '',
        isbn: "",
        purchase_price: "",
        vat_percentage: 19,
        final_price: "",
        discount_percentage: "",
        stock: 0,
        category: "",
        publisher: "",
        language: "",
        pages: 0,
        is_featured: false,
        publication_date: '',
        cover_image: ''

    });


    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const purchasePrice = parseFloat(formData.purchase_price) || 0;
        const vatPercentage = parseFloat(formData.vat_percentage) || 0;

        const final_price = (purchasePrice + (purchasePrice * (vatPercentage / 100))).toFixed(2);

        setFormData(prev => ({ ...prev, final_price }));

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
    }, [formData.purchase_price, formData.vat_percentage]);


    useEffect(() => {
        const token = localStorage.getItem("access_token");

        axios
            .get("http://localhost:8000/api/category/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log("Categorias:", res.data);

                const options = res.data.map((category) => ({
                    value: category.id,   // o author.pk si estás usando ese nombre
                    label: category.name, // o author.nombre_completo, según tu modelo
                }));

                setCategory(options);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        axios
            .get("http://localhost:8000/api/books/publisher", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log("Editorial:", res.data);

                const options = res.data.map((publisher) => ({
                    value: publisher.id,   // o author.pk si estás usando ese nombre
                    label: publisher.name, // o author.nombre_completo, según tu modelo
                }));

                setPublisher(options);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access_token");
        const formPayload = new FormData();

        for (const key in formData) {
            formPayload.append(key, formData[key]);
        }

        if (coverImage) {
            formPayload.append("cover_image", coverImage);
        }

        try {
            await axios.post("http://localhost:8000/api/books/create/", formPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire("Éxito", "Libro registrado correctamente", "success");
            navigate("/books");
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Hubo un problema al guardar el libro", "error");
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
                                    <label className="block text-sm font-medium">Libro</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        placeholder="Ingrese Nombre Libro"
                                        onChange={handleChange}
                                        required
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
                                    <label className="block text-sm font-medium">Categoria</label>
                                    <Select
                                        options={category}
                                        onChange={(selectedOption) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                category: selectedOption?.value,
                                            }))
                                        }
                                        placeholder="Seleccione Categoria"
                                        isClearable
                                        required
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
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Editorial</label>
                                    <Select
                                        options={publisher}
                                        onChange={(selectedOption) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                publisher: selectedOption?.value,
                                            }))
                                        }
                                        placeholder="Seleccione Editorial"
                                        isClearable
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Precio Compra</label>
                                    <input
                                        type="number"
                                        name="purchase_price"
                                        value={formData.purchase_price}
                                        placeholder="Ingrese Precio Compra"
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">IVA</label>
                                    <input
                                        type="number"
                                        name="vat_percentage"
                                        value={formData.vat_percentage}
                                        placeholder="Ingrese IVA"
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Descuento</label>
                                    <input
                                        type="number"
                                        name="discount_percentage"
                                        value={formData.discount_percentage}
                                        onChange={handleChange}
                                        required
                                        placeholder="Descuento"
                                        // disabled
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
                                    <label className="block text-sm font-medium">Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ingrese Stock"
                                        // disabled
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Idioma</label>
                                    <input
                                        type="text"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ingrese Idioma"
                                        // disabled
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Numero de Paginas</label>
                                    <input
                                        type="number"
                                        name="pages"
                                        value={formData.pages}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ingrese Numero de Paginas"
                                        // disabled
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                is_featured: e.target.checked,
                                            }))
                                        }
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <label className="text-sm font-medium text-gray-700">
                                        Libro destacado
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Fecha de Publicación</label>
                                    <input
                                        type="date"
                                        name="publication_date"
                                        value={formData.publication_date || ""}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Imagen de Portada</label>
                                    <input
                                        type="file"
                                        name="cover_image"
                                        accept="image/*"
                                        onChange={(e) => setCoverImage(e.target.files[0])}
                                        className="w-full mt-1"
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
                                <div className="mt-4 text-right">
                                    <button type="submit" className="bg-green-700 text-white p-3 rounded hover:bg-green-800 cursor-pointer">
                                        <FaSave className="inline mr-1" />
                                        Crear Libro
                                    </button>
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