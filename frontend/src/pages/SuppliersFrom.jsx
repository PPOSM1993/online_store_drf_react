import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sidebar, Header } from "../index.js";
import { useNavigate, useParams } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import Swal from "sweetalert2";
import Select from "react-select";

const CustomerForm = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();  // <-- para saber si estamos editando
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    tax_id: '',
    email: '',
    phone: '',
    address: '',
    contact_person: '',
    website: '',
    notes: '',
    is_active: false,
    payment_terms: '',
    region: '',
    city: '',
  })

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Obtener regiones y ciudades
  useEffect(() => {
    axios.get("/data/regionesData.json").then(res => setRegions(res.data));
    axios.get("/data/ciudadesData.json").then(res => setCities(res.data));
  }, []);



  // Precargar datos si estamos editando
  useEffect(() => {
    if (id) {
      const fetchSuppliers = async () => {
        try {
          const token = localStorage.getItem("access_token");
          const res = await axios.get(`http://localhost:8000/api/suppliers/edit/${id}/`, {
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
      fetchSuppliers();
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
        await axios.put(`http://localhost:8000/api/suppliers/edit/${id}/`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:8000/api/suppliers/create/`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      Swal.fire({
        title: "Éxito",
        text: `Proveedor ${id ? "actualizado" : "registrado"} correctamente.`,
        icon: "success",
      }).then(() => navigate("/suppliers"));

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
            {id ? "Editar Proveedor" : "Nuevo Proveedor"}
          </h1>
          <div className="bg-white rounded-xl shadow p-4">
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium">Nombre Proveedor</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ingrese Proveedor"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                  required
                />
              </div>

              <>
                <div>
                  <label className="block text-sm font-medium">Razón Social</label>
                  <input
                    type="text"
                    name="tax_id"
                    placeholder="RUT (12345678-9)"
                    value={formData.tax_id}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                    required
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
                    className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100" disabled={!!id} />
                </div>
              </>



              <div>
                <label className="block text-sm font-medium">Teléfono</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="Ingrese Telefono"
                  className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100" disabled={!!id} />
              </div>

              <div>
                <label className="block text-sm font-medium">Dirección</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange}
                  placeholder="Ingrese Direccion"
                  className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100" />
              </div>

              {/* Región y ciudad */}
              <div>
                <label className="block text-sm font-medium">Región</label>
                <select
                  name="region"
                  value={formData.region ?? ""}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
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
                  className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                >
                  <option value="">Seleccione una ciudad</option>
                  {cities
                    .filter(c => c.fields.region === parseInt(formData.region))
                    .map(c => (
                      <option key={c.pk} value={c.pk}>
                        {c.fields.name}
                      </option>
                    ))}
                </select>



              </div>

              <div>
                <label className="block text-sm font-medium">Persona de Contacto</label>
                <input
                  type="text"
                  name="contact_person"
                  placeholder="Persona de contacto"
                  value={formData.contact_person}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100" />
              </div>

              <div>
                <label className="block text-sm font-medium">Sitio Web</label>
                <input
                  type="url"
                  name="website"
                  placeholder="Persona de contacto"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100" />
              </div>

              <div>
                <label className="block text-sm font-medium">Notas</label>
                <textarea
                  name="notes"
                  placeholder="Notas"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Terminos de Pago</label>
                <input
                  type="text"
                  name="payment_terms"
                  placeholder="Términos de pago"
                  value={formData.payment_terms}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_active: e.target.checked,
                      }))
                    }
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  Activo
                </label>
              </div>

              <div className="mt-4 text-right">
                <button type="submit" className="bg-green-700 text-white p-3 rounded hover:bg-green-800 cursor-pointer">
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
