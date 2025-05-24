"use client"

import type React from "react"

import { useAuth } from "@/lib/auth/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Protect all dashboard routes
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null
}
