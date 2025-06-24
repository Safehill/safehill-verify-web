"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import {UserDTO} from "@/lib/api/models/dto/User";

// Define types for our authentication data
export type AuthedSession = {
  bearerToken: string
  privateKey: CryptoKey
  signature: CryptoKey
  user: UserDTO
  expiresAt: number
}

type AuthContextType = {
  isAuthenticated: boolean
  authedSession: AuthedSession | null
  setAuthedSession: (authedSession: AuthedSession | null) => void
  logout: () => void
  handleApiResponse: (response: Response) => Promise<Response>
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  authedSession: null,
  setAuthedSession: () => {},
  logout: () => {},
  handleApiResponse: async (response) => response,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authedSession, setAuthedSession] = useState<AuthedSession | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Logout function - clears credentials and redirects to login
  const logout = () => {
    setAuthedSession(null)
    setIsAuthenticated(false)
    router.push("/login")
  }

  // Check token expiration periodically
  useEffect(() => {
    if (!authedSession) return

    const checkExpiration = () => {
      if (authedSession.expiresAt < Date.now()) {
        console.log("Authentication expired")
        logout()
      }
    }

    // Check immediately
    checkExpiration()

    // Then check every minute
    const interval = setInterval(checkExpiration, 60 * 1000)
    return () => clearInterval(interval)
  }, [authedSession])

  // Redirect to login if accessing protected route without authentication
  useEffect(() => {
    if (pathname?.startsWith("/dashboard") && !isAuthenticated) {
      router.push("/login")
    }
  }, [pathname, isAuthenticated, router])

  // Handle API responses and check for 401 errors
  const handleApiResponse = async (response: Response): Promise<Response> => {
    if (response.status === 401) {
      logout()
      throw new Error("Unauthorized - Please log in again")
    }
    return response
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authedSession,
        setAuthedSession: (authedSession: AuthedSession | null) => {
          setAuthedSession(authedSession)
          setIsAuthenticated(!!authedSession)
        },
        logout,
        handleApiResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
