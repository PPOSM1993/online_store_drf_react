import React, { useState } from "react";
import logo from '../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { MdOutlineLogin } from "react-icons/md";
import Swal from 'sweetalert2'

const Login = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const res = await axios.post('http://localhost:8000/api/accounts/login/', {
                email,
                password,
            })

            const { access, refresh } = res.data
            localStorage.setItem('access_token', access)
            localStorage.setItem('refresh_token', refresh)
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`
            navigate('/dashboard')
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error de inicio de sesión',
                text: 'Correo o contraseña incorrectos',
                confirmButtonColor: '#3085d6',
            });

        }
    }

    return (
        <>
            <div className="flex items-center justify-center min-h-screen px-4 bg-blue-50">
                {/* LOGO */}
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
                    <div className="flex justify-center">
                        <img src={logo} alt="Logo" className="w-32 h-auto" />
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    {/* FORM */}
                    <form action="" className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:outline-none focus:ring-0"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <br />
                        <div>
                            <input
                                id="password"
                                type="password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-none focus:outline-none focus:ring-0"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>


                        <div className="flex items-center justify-between">
                            <a href="#" className="text-sm text-blue-600 hover:underline">
                                Forgot Password?
                            </a>
                        </div>
                        <br />
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
                        >
                            Sign In
                        </button>

                        <div className="text-center mt-4">
                            <p className="text-sm">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-blue-600 hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </div>

                    </form>
                    {/* END FORM */}


                </div>

            </div>

        </>
    )
}

export default Login;