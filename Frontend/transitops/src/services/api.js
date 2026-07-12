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

const getRegisteredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('transitops_users') || '[]')
  } catch {
    return []
  }
}

const persistRegisteredUsers = (users) => {
  localStorage.setItem('transitops_users', JSON.stringify(users))
}

const setAuthSession = (user) => {
  const authPayload = {
    token: 'mock-jwt-token',
    user,
  }

  localStorage.setItem('transitops_auth', JSON.stringify(authPayload))
  localStorage.setItem('transitops_user', JSON.stringify(user))
  localStorage.setItem('transitops_token', authPayload.token)

  return authPayload
}

export const loginMockUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const registeredUsers = getRegisteredUsers()
      const matchingUser = registeredUsers.find((user) => user.email === email && user.password === password)

      if (matchingUser) {
        resolve({ data: setAuthSession(matchingUser) })
        return
      }

      if (email === 'admin@transitops.com' && password === 'admin123') {
        const user = {
          name: 'Admin User',
          email,
          role: 'Fleet Manager',
          password,
        }

        resolve({ data: setAuthSession(user) })
        return
      }

      reject(new Error('Invalid email or password.'))
    }, 500)
  })
}

export const registerMockUser = async ({ name, email, password, role }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const registeredUsers = getRegisteredUsers()
      const existingUser = registeredUsers.find((user) => user.email === email)

      if (existingUser) {
        reject(new Error('An account already exists for that email.'))
        return
      }

      const user = {
        name,
        email,
        password,
        role,
      }

      const nextUsers = [...registeredUsers, user]
      persistRegisteredUsers(nextUsers)
      resolve({ data: setAuthSession(user) })
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
