import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const PermissionTable = () => {
    const [permissions, setPermissions] = useState([]);
    const [filterText, setFilterText] = useState("");
    const [perPage, setPerPage] = useState(10);

    const fetchPermissions = async (q = "") => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await axios.get(`http://localhost:8000/api/permissions/permissions/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Respuesta backend:", res.data);

            let data = [];

            // Soporte para paginación o sin paginación
            if (Array.isArray(res.data.results)) {
                data = res.data.results;
            } else if (Array.isArray(res.data)) {
                data = res.data;
            } else if (res.data && typeof res.data === "object") {
                data = [res.data];
            }

            const filtered = q
                ? data.filter((perm) =>
                    perm.name?.toLowerCase().includes(q.toLowerCase()) ||
                    perm.codename?.toLowerCase().includes(q.toLowerCase())
                )
                : data;

            setPermissions(filtered);
        } catch (error) {
            console.error("Error al cargar permisos:", error);
            setPermissions([]);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchPermissions(filterText);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [filterText]);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Este permiso será eliminado permanentemente.",
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
                await axios.delete(`http://localhost:8000/api/permissions/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                Swal.fire("Eliminado", "Permiso eliminado correctamente.", "success");
                fetchPermissions();
            } catch (error) {
                console.error("Error al eliminar:", error);
                Swal.fire("Error", "No se pudo eliminar el permiso.", "error");
            }
        }
    };

    const columns = [
        {
            name: "Nombre",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Código",
            selector: (row) => row.code,
            sortable: true,
        },
        {
            name: "Opciones",
            cell: (row) =>
                row.id ? (
                    <div className="flex items-center space-x-2 justify-end">
                        <button
                            onClick={() => handleDelete(row.id)}
                            className="bg-red-500 text-white px-3 py-3 rounded text-xs sm:text-sm cursor-pointer hover:bg-red-600 transition"
                            title="Eliminar"
                        >
                            <MdDelete />
                        </button>
                    </div>
                ) : (
                    <span className="text-gray-400 text-sm">Sin acciones</span>
                ),
            ignoreRowClick: true,
        },
    ];

    return (
        <div className="p-4 bg-white rounded-xl shadow">
            <input
                type="text"
                placeholder="Buscar Permiso"
                className="w-full max-w-md px-4 py-2 mb-4 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:border-blue-100"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
            />

            <DataTable
                columns={columns}
                data={permissions}
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
                <Link to="/permissions/create">
                    <button className="bg-green-700 text-white p-3 rounded-md shadow hover:bg-green-800 transition flex items-center space-x-2 cursor-pointer">
                        <FaPlus />
                        <span>Nuevo Permiso</span>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default PermissionTable;
