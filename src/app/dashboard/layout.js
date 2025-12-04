"use client"

import { useEffect } from 'react'

export default function DashboardLayout({ children }) {
  useEffect(() => {
    // Enable scrolling for dashboard pages
    document.body.style.overflow = 'auto'
    
    return () => {
      // Reset to hidden when leaving dashboard (for main page scroll behavior)
      document.body.style.overflow = 'hidden'
    }
  }, [])

  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}

