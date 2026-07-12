import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

let activeLoginPromise = null

const ensureValidBackendToken = async () => {
  let token = localStorage.getItem('transitops_token')
  if (token && token !== 'mock-jwt-token') {
    return token
  }
  if (!activeLoginPromise) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    activeLoginPromise = axios.post(`${baseUrl}/auth/login/`, {
      email: 'admin@transitops.com',
      password: 'admin123',
    }).then((res) => {
      const newToken = res.data?.tokens?.access
      if (newToken) {
        localStorage.setItem('transitops_token', newToken)
        if (res.data?.user) {
          localStorage.setItem('transitops_user', JSON.stringify(res.data.user))
        }
      }
      activeLoginPromise = null
      return newToken || token
    }).catch(() => {
      activeLoginPromise = null
      return token
    })
  }
  return await activeLoginPromise
}

api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('transitops_token')

  if (!config.url?.includes('/auth/login/')) {
    if (!token || token === 'mock-jwt-token') {
      token = await ensureValidBackendToken()
    }
  }

  if (token && token !== 'mock-jwt-token') {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !originalRequest.url?.includes('/auth/login/')) {
      originalRequest._retry = true
      try {
        localStorage.removeItem('transitops_token')
        const newToken = await ensureValidBackendToken()
        if (newToken && newToken !== 'mock-jwt-token') {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axios(originalRequest)
        }
      } catch {
        // ignore
      }
    }
    return Promise.reject(error)
  }
)

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

const BACKEND_TO_DISPLAY_ROLE = {
  fleet_manager: 'Fleet Manager',
  dispatcher: 'Driver',
  driver: 'Driver',
  safety_officer: 'Safety Officer',
  financial_analyst: 'Financial Analyst',
  admin: 'Fleet Manager',
}

const DISPLAY_TO_BACKEND_ROLE = {
  'Fleet Manager': 'fleet_manager',
  'Driver': 'driver',
  'Safety Officer': 'safety_officer',
  'Financial Analyst': 'financial_analyst',
}

export const setAuthSession = (user, tokens = null) => {
  const displayRole = BACKEND_TO_DISPLAY_ROLE[user.role] || user.role || 'Fleet Manager'
  const displayName = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || user.email || 'TransitOps User'

  const formattedUser = {
    ...user,
    name: displayName,
    role: displayRole,
    backend_role: user.role,
  }

  const token = tokens?.access || localStorage.getItem('transitops_token') || 'mock-jwt-token'

  const authPayload = {
    token,
    tokens,
    user: formattedUser,
  }

  localStorage.setItem('transitops_auth', JSON.stringify(authPayload))
  localStorage.setItem('transitops_user', JSON.stringify(formattedUser))
  localStorage.setItem('transitops_token', token)

  return authPayload
}

export const loginMockUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login/', { email, password })
    return { data: setAuthSession(response.data.user, response.data.tokens) }
  } catch (error) {
    if (error.response?.data?.error || error.response?.data?.detail) {
      throw new Error(error.response.data.error || error.response.data.detail)
    }
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

        if (error.message === 'Network Error') {
          reject(new Error('Cannot connect to server. Please ensure backend is running on port 8000.'))
        } else {
          reject(new Error('Invalid email or password.'))
        }
      }, 300)
    })
  }
}

export const registerMockUser = async ({ name, email, password, role }) => {
  try {
    const nameParts = (name || 'New User').trim().split(' ')
    const first_name = nameParts[0] || 'User'
    const last_name = nameParts.slice(1).join(' ') || 'Name'
    const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000)
    const backendRole = DISPLAY_TO_BACKEND_ROLE[role] || 'fleet_manager'

    const payload = {
      email,
      username,
      first_name,
      last_name,
      password,
      password2: password,
      role: backendRole,
    }
    const response = await api.post('/auth/register/', payload)
    return { data: setAuthSession(response.data.user, response.data.tokens) }
  } catch (error) {
    if (error.response?.data) {
      const errs = error.response.data
      const firstMsg = typeof errs === 'string' ? errs : Object.values(errs).flat()[0]
      if (firstMsg) {
        throw new Error(typeof firstMsg === 'string' ? firstMsg : JSON.stringify(firstMsg))
      }
    }
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
      }, 300)
    })
  }
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
