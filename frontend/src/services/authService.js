import axios from 'axios'

const API_URL = 'http://localhost:8000/api/accounts'

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login/`, { email, password })
  return response.data
}

export const logout = async () => {
  const refresh = localStorage.getItem('refresh')
  const access = localStorage.getItem('access')
  await axios.post(`${API_URL}/logout/`, { refresh }, {
    headers: {
      Authorization: `Bearer ${access}`
    }
  })
  localStorage.clear()
}