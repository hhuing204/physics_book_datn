// components/ClientLayout.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import { useAuth } from '@/contexts/AuthContext'

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [mounted, setMounted] = useState(false)
    const [theme, setTheme] = useState('light')
    const [showAuthModal, setShowAuthModal] = useState(false)
    const pathname = usePathname()
    const { user } = useAuth()

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem('physics-book-theme') || 'light'
        setTheme(savedTheme)
        document.documentElement.className = savedTheme

        // Lắng nghe event mở modal từ các page
        const handleOpenAuthModal = () => setShowAuthModal(true)
        window.addEventListener('openAuthModal', handleOpenAuthModal)

        return () => {
            window.removeEventListener('openAuthModal', handleOpenAuthModal)
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.className = newTheme
        localStorage.setItem('physics-book-theme', newTheme)
    }

    // Các trang không cần header/footer (nếu có)
    const noLayoutPaths = ['/login', '/register']
    const showLayout = !noLayoutPaths.includes(pathname)

    const handleAuthSuccess = () => {
        setShowAuthModal(false)
        window.location.reload()
    }

    if (!mounted) {
        return <>{children}</>
    }

    if (!showLayout) {
        return <>{children}</>
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-1 pt-16">
                {children}
            </main>
            <Footer />

            {/* Auth Modal chung */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={handleAuthSuccess}
            />
        </div>
    )
}