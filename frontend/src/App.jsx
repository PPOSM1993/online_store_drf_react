import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Login, Dashboard, Register } from './index'
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
      </Routes>
    </Router>
  )
}

export default App