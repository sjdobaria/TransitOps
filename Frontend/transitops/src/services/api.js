import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('transitops_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const loginMockUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'admin@transitops.com' && password === 'admin123') {
        const user = {
          name: 'Admin User',
          email,
          role: 'Fleet Manager',
        }

        const authPayload = {
          token: 'mock-jwt-token',
          user,
        }

        localStorage.setItem('transitops_auth', JSON.stringify(authPayload))
        localStorage.setItem('transitops_user', JSON.stringify(user))
        localStorage.setItem('transitops_token', authPayload.token)

        resolve({ data: authPayload })
      } else {
        reject(new Error('Invalid email or password.'))
      }
    }, 500)
  })
}

export const logoutMockUser = () => {
  localStorage.removeItem('transitops_auth')
  localStorage.removeItem('transitops_user')
  localStorage.removeItem('transitops_token')
}

export const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem('transitops_auth') || 'null')
  } catch {
    return null
  }
}

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('transitops_user') || 'null')
  } catch {
    return null
  }
}

export default api
