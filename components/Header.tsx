// components/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import UserMenu from '@/components/UserMenu'
import AuthModal from '@/components/AuthModal'
import { GraduationCap, Menu, X, BookOpen, Gamepad2, FileText, Info, Sparkles } from 'lucide-react'

interface HeaderProps {
    theme: string
    toggleTheme: () => void
}

const navItems = [
    { path: '/lesson', label: 'Bài học', icon: BookOpen },
    { path: '/simulation', label: 'Mô phỏng 3D', icon: Gamepad2 },
    { path: '/exercises', label: 'Bài tập', icon: FileText },
    { path: '/about', label: 'Giới thiệu', icon: Info },
]

export default function Header({ theme, toggleTheme }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { user, loading } = useAuth()

    // Đóng menu khi chuyển trang
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname])

    const isActive = (path: string) => {
        if (path === '/lesson' && pathname === '/lesson') return true
        if (path !== '/lesson' && pathname.startsWith(path)) return true
        return false
    }

    const handleAuthSuccess = () => {
        setShowAuthModal(false)
        router.refresh()
    }

    return (
        <>
            <header className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 group shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">
                                Vật Lý 11
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                            {navItems.map((item) => {
                                const active = isActive(item.path)
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`
                      flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg
                      font-medium transition-all duration-200
                      ${active
                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }
                    `}
                                    >
                                        <Icon className={`w-4 h-4 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center space-x-2">
                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                aria-label="Chuyển đổi giao diện"
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>

                            {/* Auth button */}
                            {user ? (
                                <div className="hidden md:block">
                                    <UserMenu user={user} />
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="hidden md:block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-md shadow-blue-500/30"
                                >
                                    Đăng nhập
                                </button>
                            )}

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col space-y-2">
                                {navItems.map((item) => {
                                    const active = isActive(item.path)
                                    const Icon = item.icon
                                    return (
                                        <Link
                                            key={item.path}
                                            href={item.path}
                                            className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg
                        transition-all duration-200
                        ${active
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }
                      `}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                            {active && (
                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                                            )}
                                        </Link>
                                    )
                                })}
                                {!user && (
                                    <button
                                        onClick={() => {
                                            setShowAuthModal(true)
                                            setMobileMenuOpen(false)
                                        }}
                                        className="px-4 py-3 bg-blue-600 text-white rounded-lg text-left font-medium"
                                    >
                                        Đăng nhập
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={handleAuthSuccess}
            />
        </>
    )
}