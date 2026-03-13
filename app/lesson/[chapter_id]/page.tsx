'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import UserMenu from '@/components/UserMenu'
import { useProgress } from '@/hooks/useProgress'
import Link from 'next/link'
import axios from 'axios'
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Clock,
    Loader2,
    Sparkles
} from 'lucide-react'
import { Chapter, Lesson } from '@/types/Chapter'

export default function ChapterLessonsPage() {
    const [mounted, setMounted] = useState(false)
    const [theme, setTheme] = useState('light')
    const [chapter, setChapter] = useState<Chapter | null>(null)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const router = useRouter()
    const params = useParams()
    const chapterId = params?.chapter_id as string // "1", "2", "3", ...
    const { user, loading: authLoading } = useAuth()
    const { progress, isLessonCompleted, getCompletionRate } = useProgress()

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem('physics-book-theme') || 'light'
        setTheme(savedTheme)
        document.documentElement.className = savedTheme
        fetchChapter()
    }, [chapterId])

    const fetchChapter = async () => {
        try {
            setLoading(true)
            // Gọi API với chapterId (số thứ tự)
            const res = await axios.get(`/api/chapters?chapterId=${chapterId}`)
            setChapter(res.data)
        } catch (error) {
            console.error('Lỗi khi lấy thông tin chương:', error)
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

    const getDifficultyColor = (lessonId: string) => {
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
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

    // Kiểm tra đăng nhập
    useEffect(() => {
        if (mounted && !authLoading && !user) {
            router.push('/lesson')
        }
    }, [mounted, authLoading, user, router])

    if (!mounted || loading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!chapter) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Không tìm thấy chương
                    </h1>
                    <button
                        onClick={() => router.push('/lesson')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                        Quay lại danh sách chương
                    </button>
                </div>
            </div>
        )
    }

    // Chuyển đổi lesson ids sang number để dùng với useProgress
    const lessonIds: number[] = chapter.lessons?.map(l => parseInt(l.id)) || []

    // Tính completion rate an toàn
    const completedCount = lessonIds.filter(id => isLessonCompleted ? isLessonCompleted(id) : false).length
    const completionRate = lessonIds.length > 0 ? Math.round((completedCount / lessonIds.length) * 100) : 0

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push('/lesson')}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 bg-gradient-to-r ${getChapterColor(chapter.chapterId)} rounded-lg flex items-center justify-center`}>
                                    <span className="text-white font-bold">{chapter.chapterId}</span>
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Chương {chapter.chapterId}: {chapter.title}
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {chapter.lessons?.length || 0} bài học
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {user && <UserMenu user={user} />}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {/* Progress Overview */}
                {lessonIds.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Tiến độ chương
                                </h2>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {lessonIds.filter(id => isLessonCompleted ? isLessonCompleted(id) : false).length}/{lessonIds.length} bài
                                </span>
                                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                                        style={{ width: `${completionRate}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                    {completionRate}%
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chapter Info */}
                <div className={`bg-gradient-to-r ${getChapterColor(chapter.chapterId)} rounded-2xl p-8 text-white mb-8 relative overflow-hidden`}>
                    <div className="absolute -right-16 -top-16 w-40 h-40 bg-white/10 rounded-full"></div>
                    <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-white/10 rounded-full"></div>

                    <div className="relative z-10">
                        <span className="text-6xl mb-4 block">{chapter.icon || getChapterIcon(chapter.chapterId)}</span>
                        <h2 className="text-3xl font-bold mb-2">{chapter.title}</h2>
                        <p className="text-white/90 max-w-2xl">{chapter.subtitle || chapter.description || `Chương ${chapter.chapterId}: ${chapter.title}`}</p>
                    </div>
                </div>

                {/* Lessons List */}
                {chapter.lessons && chapter.lessons.length > 0 ? (
                    <div className="space-y-4">
                        {chapter.lessons.map((lesson: Lesson) => (
                            <Link
                                key={lesson.id}
                                href={`/lesson/${chapter.chapterId}/${lesson.id}`}
                                className="block group"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700">
                                    <div className="flex items-start gap-4">
                                        {/* Lesson number */}
                                        <div className="relative">
                                            <div className={`w-12 h-12 bg-gradient-to-r ${getChapterColor(chapter.chapterId)} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                                                {lesson.id}
                                            </div>
                                            {isLessonCompleted && isLessonCompleted(parseInt(lesson.id)) && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Lesson info */}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                                    Bài {lesson.id}: {lesson.title}
                                                </h3>
                                                <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(lesson.id)}`}>
                                                    {lesson.slides?.length || 0} slides
                                                </span>
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                                {lesson.description || `Bài học về ${lesson.title}`}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {lesson.duration || '45 phút'}
                                                </div>

                                                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                                                    <span>Học ngay</span>
                                                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Chưa có bài học nào trong chương này.</p>
                    </div>
                )}

                {/* Practice Button */}
                {chapter.lessons && chapter.lessons.length > 0 && (
                    <div className="mt-8 text-center">
                        <Link
                            href={`/practice/chapter-${chapter.chapterId}`}
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                            <BookOpen className="w-5 h-5 mr-2" />
                            Luyện tập chương {chapter.chapterId}
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                )}
            </main>
        </div>
    )
}