import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { Login, Dashboard, Register, CustomerList, CustomerForm, CategoryForm, CategoryList } from './index'


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
        <Route path="/customers/create" element={isAuthenticated() ? <CustomerForm /> : <Navigate to="/login" />} />
        <Route path="/customers/edit/:id" element={isAuthenticated() ? <CustomerForm /> : <Navigate to="/login" />} />

        <Route path="/category" element={isAuthenticated() ? <CategoryList /> : <Navigate to="/login" />} />
        <Route path="/category/create" element={isAuthenticated() ? <CategoryForm /> : <Navigate to="/login" />} />
        <Route path="/category/edit/:id" element={isAuthenticated() ? <CategoryForm /> : <Navigate to="/login" />} />

      </Routes>
    </Router>
  )
}

export default App