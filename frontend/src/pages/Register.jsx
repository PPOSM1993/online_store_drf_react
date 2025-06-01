import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoerp from '../assets/logoerp.png'
import axios from 'axios'
import Swal from 'sweetalert2'

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        rut: '',
        phone: '',
        birth_date: '',
        password: '',
        password2: '',
        accepted_terms: false,
    })

    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const res = await axios.post('http://localhost:8000/api/accounts/register/', formData);
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'Revisa tu correo para confirmar tu cuenta.',
                confirmButtonColor: '#3085d6',
            });
            navigate('/login');
        } catch (err) {
            const message = err.response?.data?.email?.[0] || 'Error al registrarse. Verifica los campos.';
            Swal.fire({
                icon: 'error',
                title: 'Error de registro',
                text: message,
                confirmButtonColor: '#d33',
            });
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-blue-50">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-lg">
                <div className="flex justify-center">
                    <img src={logoerp} alt="Logo" className="w-32 h-auto" />
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="first_name" type="text" placeholder="Nombre" value={formData.first_name} onChange={handleChange}
                            className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:outline-none focus:ring-0" required />
                        <input name="last_name" type="text" placeholder="Apellido" value={formData.last_name} onChange={handleChange}
                            className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:outline-none focus:ring-0" required />
                        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange}
                            className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:outline-none focus:ring-0" required />
                        <input name="rut" type="text" placeholder="RUT" value={formData.rut} onChange={handleChange}
                            className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:outline-none focus:ring-0" required />
                        <input name="phone" type="text" placeholder="Teléfono" value={formData.phone} onChange={handleChange}
                            className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:outline-none focus:ring-0" />
                        <input name="birth_date" type="date" placeholder="Fecha de nacimiento" value={formData.birth_date} onChange={handleChange}
                            className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:outline-none focus:ring-0" />
                        <input name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleChange}
                            className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:outline-none focus:ring-0" required />
                        <input name="password2" type="password" placeholder="Confirmar contraseña" value={formData.password2} onChange={handleChange}
                            className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:outline-none focus:ring-0" required />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="accepted_terms"
                            checked={formData.accepted_terms}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="text-sm">Acepto los términos y condiciones</label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
                    >
                        Sign Up
                    </button>

                    {/* Google Signup */}
                    <button
                        type="button"
                        className="w-full py-2 border mt-2 border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Continuar con Google
                    </button>
                    {/* END Google Button */}
                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Do you have account?{" "}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Register