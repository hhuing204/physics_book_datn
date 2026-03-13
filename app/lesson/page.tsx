'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import UserMenu from '@/components/UserMenu'
import Link from 'next/link'
import axios from 'axios'
import {
    BookOpen,
    GraduationCap,
    ChevronRight,
    Sparkles,
    Menu,
    X,
    Loader2
} from 'lucide-react'
import { Chapter } from '@/types/Chapter'

export default function LessonListPage() {
    const [mounted, setMounted] = useState(false)
    const [theme, setTheme] = useState('light')
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem('physics-book-theme') || 'light'
        setTheme(savedTheme)
        document.documentElement.className = savedTheme
        fetchChapters()
    }, [])

    const fetchChapters = async () => {
        try {
            setLoading(true)
            const res = await axios.get('/api/chapters')
            setChapters(res.data)
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chương:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.className = newTheme
        localStorage.setItem('physics-book-theme', newTheme)
    }

    const getChapterIcon = (chapterId: string) => {
        const icons: Record<string, string> = {
            '1': '⏰',
            '2': '🌊',
            '3': '⚡',
            '4': '🧲',
            '5': '💡',
            '6': '🔍'
        }
        return icons[chapterId] || '📚'
    }

    const getChapterColor = (chapterId: string) => {
        const colors: Record<string, string> = {
            '1': 'from-blue-500 to-cyan-500',
            '2': 'from-cyan-500 to-teal-500',
            '3': 'from-yellow-500 to-orange-500',
            '4': 'from-green-500 to-emerald-500',
            '5': 'from-purple-500 to-pink-500',
            '6': 'from-red-500 to-rose-500'
        }
        return colors[chapterId] || 'from-gray-500 to-gray-600'
    }

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (mounted && !authLoading && !user) {
            setShowAuthModal(true)
        }
    }, [mounted, authLoading, user])

    if (!mounted || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Vật Lý 11
                            </span>
                        </Link>

                        <div className="flex items-center space-x-2">
                            {user && <UserMenu user={user} />}

                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {/* Header section */}
                <div className="mb-10">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                        <span>{chapters.length} chương - {chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0)} bài học</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Chương trình Vật Lý 11
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                        Khám phá {chapters.length} chương với đầy đủ lý thuyết, mô phỏng 3D và bài tập có lời giải
                    </p>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    </div>
                )}

                {/* Chapters grid */}
                {!loading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chapters.map((chapter) => (
                            <Link
                                key={chapter._id}
                                href={`/lesson/${chapter.chapterId}`}
                                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`h-32 bg-gradient-to-r ${getChapterColor(chapter.chapterId)} p-6 relative overflow-hidden`}>
                                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full"></div>
                                    <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full"></div>

                                    <div className="relative z-10">
                                        <span className="text-4xl mb-2 block">{chapter.icon || getChapterIcon(chapter.chapterId)}</span>
                                        <h2 className="text-2xl font-bold text-white">
                                            Chương {chapter.chapterId}
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {chapter.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                        {chapter.subtitle || chapter.description || `Chương ${chapter.chapterId}: ${chapter.title}`}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <BookOpen className="w-4 h-4 mr-1" />
                                            <span>{chapter.lessons?.length || 0} bài học</span>
                                        </div>

                                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                                            <span>Xem chi tiết</span>
                                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => {
                    setShowAuthModal(false)
                    if (!user) router.push('/')
                }}
                onSuccess={() => {
                    setShowAuthModal(false)
                    fetchChapters()
                }}
            />
        </div>
    )
}