import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Login, Dashboard } from './index'
import { Home } from './index'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App