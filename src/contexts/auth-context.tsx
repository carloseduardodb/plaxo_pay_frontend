import { createContext, ComponentChildren } from 'preact'
import { useContext, useState, useEffect } from 'preact/hooks'
import { authApi } from '../lib/api-client'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ComponentChildren }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Token existe, assumir que é válido
      const userData = localStorage.getItem('user_data')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const response = await authApi.login({ username, password })
    const { access_token } = response.data
    
    const userData = { id: username, email: `${username}@plaxo.com`, name: username }
    localStorage.setItem('auth_token', access_token)
    localStorage.setItem('user_data', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}