import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { Login, Dashboard, Register, CustomerList } from './index'
import { Home } from './index'



function App() {

  const isAuthenticated = () => {
    return !!localStorage.getItem("access_token")
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/customers" element={isAuthenticated() ? <CustomerList /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App