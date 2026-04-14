'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, ReactNode } from 'react'
import UserMenu from '@/components/UserMenu'
import { useAuth } from '@/contexts/AuthContext'

interface SimulationLayoutProps {
    children: ReactNode
    title?: string
    showBackButton?: boolean
    backPath?: string
}

export default function SimulationLayout({
    children,
    title = 'Mô phỏng Vật lý 11',
    showBackButton = true,
    backPath
}: SimulationLayoutProps) {
    const router = useRouter()
    const { user } = useAuth()
    const [theme, setTheme] = useState('light')

    useEffect(() => {
        const savedTheme = localStorage.getItem('physics-book-theme') || 'light'
        setTheme(savedTheme)
        document.documentElement.className = savedTheme
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.className = newTheme
        localStorage.setItem('physics-book-theme', newTheme)
    }

    const handleBackHome = () => {
        router.push('/')
    }

    const handleGoBack = () => {
        if (backPath) {
            router.push(backPath)
        } else {
            router.back()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* MAIN CONTENT */}
            <main className="pt-20">
                {children}
            </main>
        </div>
    )
}