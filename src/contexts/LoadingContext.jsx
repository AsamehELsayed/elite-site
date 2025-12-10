"use client"

import { createContext, useContext, useState } from "react"

const LoadingContext = createContext({
    isLoading: true,
    setIsLoading: () => {},
})

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

export function useLoading() {
    const context = useContext(LoadingContext)
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider')
    }
    return context
}

