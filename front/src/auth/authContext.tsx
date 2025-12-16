// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  email: string
  name?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (token: string, user?: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Au chargement de l’app
  useEffect(() => {
    const storedToken = localStorage.getItem("pc_token")
    if (storedToken) {
      setToken(storedToken)
      // optionnel : fetch /me ici
    }
    setLoading(false)
  }, [])

  const login = (token: string, user?: User) => {
    localStorage.setItem("pc_token", token)
    setToken(token)
    if (user) setUser(user)
  }

  const logout = () => {
    localStorage.removeItem("pc_token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
