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
            {/* HEADER */}
            <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {showBackButton && (
                            <button
                                onClick={handleGoBack}
                                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                ← Quay lại
                            </button>
                        )}

                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                            {title}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-2">
                        {user && <UserMenu user={user} />}
                        <button
                            onClick={handleBackHome}
                            className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            ← Về trang chủ
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="pt-20">
                {children}
            </main>
        </div>
    )
}