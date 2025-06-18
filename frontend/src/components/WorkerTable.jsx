import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { FaPen, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const WorkerTable = () => {

    const [worker, setWorker] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [perPage, setPerPage] = useState(10);
    const navigate = useNavigate();

    const fetchWorker = async (q = "") => {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(`http://localhost:8000/api/worker/search/?q=${q}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setWorker(res.data);
    };

    useEffect(() => {
        fetchWorker();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchWorker(filterText);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [filterText]);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Este cliente será eliminado permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        if (confirm.isConfirmed) {
            try {
                const token = localStorage.getItem("access_token");
                await axios.delete(`http://localhost:8000/api/worker/delete/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                Swal.fire("Eliminado", "Categoria eliminada correctamente.", "success");
                fetchWorker();
            } catch (error) {
                console.error("Error al eliminar:", error);
                Swal.fire("Error", "No se pudo eliminar la categoria.", "error");
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/worker/edit/${id}`);
    };


    const columns = [

        {
            name: "Trabajador",
            selector: row => row.full_name,
            sortable: true,
        },
        {
            name: "",
            sortable: true,
        },
        {
            name: "",
            sortable: true,
        },
        {
            name: "Opciones",
            cell: row => (
                <div className="flex items-center space-x-2 justify-end">
                    <button
                        onClick={() => handleEdit(row.id)}
                        className="bg-yellow-500 text-black px-3 py-3 rounded text-xs sm:text-sm cursor-pointer hover:bg-yellow-600 transition"
                        title="Editar"
                    >
                        <FaPen />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
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
        <>
                <div className="p-4 bg-white rounded-xl shadow">
            <input
                type="text"
                placeholder="Buscar cliente por nombre, apellido o empresa..."
                className="w-full max-w-md px-4 py-2 mb-4 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:border-blue-100"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
            />

            <DataTable
                columns={columns}
                data={worker}
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
                <Link to="/worker/create">
                    <button className="bg-green-700 text-white p-3 rounded-md shadow hover:bg-green-800 transition flex items-center space-x-2 cursor-pointer">
                        <FaPlus />
                        <span>Nuevo Trabajador</span>
                    </button>
                </Link>
            </div>
        </div>
        </>
    )
}

export default WorkerTable;