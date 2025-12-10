"use client"

import { GlobalLoader } from "./GlobalLoader"
import { useLoading } from "@/contexts/LoadingContext"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function GlobalLoaderWrapper() {
    const { isLoading, setIsLoading } = useLoading()
    const pathname = usePathname()
    
    // Only show loader on home page
    const isHomePage = pathname === '/'
    
    // Handle loading state based on current page
    useEffect(() => {
        if (!isHomePage) {
            // If not on home page, hide loader immediately
            setIsLoading(false)
            return
        }
        
        // Reset loading state when navigating to home page
        setIsLoading(true)
        
        // Fallback: hide loader after 10 seconds max (safety timeout)
        const timeout = setTimeout(() => {
            setIsLoading(false)
        }, 10000)
        
        return () => clearTimeout(timeout)
    }, [pathname, isHomePage, setIsLoading])
    
    // Don't show loader if not on home page
    if (!isHomePage) {
        return null
    }
    
    return <GlobalLoader isLoading={isLoading} />
}

