import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { FaPen, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const BooksTable = () => {
    const [book, setBook] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [perPage, setPerPage] = useState(10);
    const navigate = useNavigate();

    const fetchBook = async (q = "") => {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(`http://localhost:8000/api/books/search/?q=${q}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setBook(res.data);
    };

    useEffect(() => {
        fetchBook();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchBook(filterText);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [filterText]);



    const columns = [

        {
            name: "Libros",
            selector: row => row.title,
            sortable: true,
        },

        {
            name: "Autor",
            selector: row => row.author.name,
            sortable: true,
        },

        {
            name: "ISBN",
            selector: row => row.isbn,
            sortable: true,
        },
        {
            name: "Opciones",
            cell: row => (
                <div className="flex items-center space-x-2 justify-end">
                    <button
                        className="bg-yellow-500 text-black px-3 py-3 rounded text-xs sm:text-sm cursor-pointer hover:bg-yellow-600 transition"
                        title="Editar"
                    >
                        <FaPen />
                    </button>
                    <button
                        className="bg-red-500 text-white px-3 py-3 rounded text-xs sm:text-sm cursor-pointer hover:bg-red-600 transition"
                        title="Eliminar"
                    >
                        <MdDelete />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            //allowOverflow: false,
            //button: true,
        },
    ];

    return (
        <div className="p-4 bg-white rounded-xl shadow">
            <input
                type="text"
                placeholder="Buscar Libro"
                className="w-full max-w-md px-4 py-2 mb-4 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:border-blue-100"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
            />

            <DataTable
                columns={columns}
                data={book}
                pagination
                paginationPerPage={perPage}
                paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                onChangeRowsPerPage={setPerPage}
                highlightOnHover
                responsive
                striped
                noDataComponent="No se encontraron resultados"
                className="min-w-full table-auto border border-gray-200 text-sm sm:text-base"
            />

            <div className="mt-4 text-right">
                <Link to="/books/create">
                    <button className="bg-green-700 text-white p-3 rounded-md shadow hover:bg-green-800 transition flex items-center space-x-2 cursor-pointer">
                        <FaPlus />
                        <span>Nuevo Libro</span>
                    </button>
                </Link>
            </div>
        </div>
    );
};


export default BooksTable;