import axios from 'axios'

const API_URL = '/api/users/'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Update question frequency
const updateFrequency = async (frequency, token) => {
  const response = await axios.put(
    API_URL + 'frequency',
    { frequency },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Update notification preferences
const updateNotifications = async (emailReminders, token) => {
  const response = await axios.put(
    API_URL + 'notifications',
    { emailReminders },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Logout user
const logout = () => localStorage.removeItem('user')

const authService = {
  register,
  login,
  logout,
  updateFrequency,
  updateNotifications,
}

export default authService