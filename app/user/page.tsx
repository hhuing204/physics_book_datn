'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface PracticeAttempt {
    _id: string
    accessCode: string
    status: 'in-progress' | 'finished'
    score: number
    timeAlloted: number
    startAt: string
    submittedAt?: string | null
    updatedAt: string
}

interface Lesson {
    id: string
    title: string
}

interface Chapter {
    _id: string
    chapterId: string
    title: string
    lessons: Lesson[]
}

export default function UserPage() {
    const { user, loading } = useAuth()
    const [lessonProgressCount, setLessonProgressCount] = useState<number>(0)
    const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [practiceAttempts, setPracticeAttempts] = useState<PracticeAttempt[]>([])
    const [showAllAttempts, setShowAllAttempts] = useState(false)
    const [showLessonDetails, setShowLessonDetails] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            if (loading || !user) return

            const token = localStorage.getItem('auth_token')
            try {
                const [progressRes, attemptsRes] = await Promise.all([
                    fetch('/api/progress', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch('/api/practice-progress?summary=true', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ])

                if (!progressRes.ok || !attemptsRes.ok) {
                    setLoadError('Không thể tải dữ liệu. Vui lòng thử lại.')
                    return
                }

                const progressData = await progressRes.json()
                const attemptsData = await attemptsRes.json()
                const progressMap = progressData.progress || {}
                const completedIds = Object.keys(progressMap)

                setLessonProgressCount(completedIds.length)
                setCompletedLessonIds(completedIds)
                setPracticeAttempts(attemptsData.attempts || [])

                const chaptersRes = await fetch('/api/chapters')
                if (chaptersRes.ok) {
                    const chaptersData = await chaptersRes.json()
                    setChapters(chaptersData)
                }
            } catch (error) {
                console.error(error)
                setLoadError('Có lỗi khi tải thông tin người dùng.')
            }
        }

        loadData()
    }, [loading, user])

    if (loading) {
        return <div className="p-6">Đang tải...</div>
    }

    if (!user) {
        return (
            <div className="p-6">
                <p className="text-lg font-semibold">Vui lòng đăng nhập để xem thông tin người dùng.</p>
                <Link href="/auth/login" className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white">
                    Đăng nhập
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold">Thông tin người dùng</h1>
                <p className="mt-2 text-gray-600">Xem hồ sơ và tiến trình học tập của bạn.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Họ và tên</p>
                        <p className="mt-2 text-lg font-medium text-gray-900">{user.name || 'Chưa có tên'}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="mt-2 text-lg font-medium text-gray-900">{user.email}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Vai trò</p>
                        <p className="mt-2 text-lg font-medium text-gray-900">{user.role || 'Học sinh'}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Tham gia từ</p>
                        <p className="mt-2 text-lg font-medium text-gray-900">{user.createdAt ? new Date(user.createdAt ?? '').toLocaleDateString() : 'Không xác định'}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">Quá trình học tập</h2>
                    <p className="mt-2 text-gray-600">Số bài học hoàn thành và đề luyện tập đã thực hiện.</p>
                    <div className="mt-6 space-y-3">
                        <div className="rounded-xl bg-blue-50 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm text-gray-500">Bài học hoàn thành</p>
                                    <p className="mt-1 text-3xl font-semibold text-blue-700">{lessonProgressCount}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowLessonDetails((current) => !current)}
                                    className="rounded-full border border-blue-200 bg-white px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50 transition"
                                >
                                    {showLessonDetails ? 'Thu gọn' : 'Xem chi tiết'}
                                </button>
                            </div>
                            {showLessonDetails && (
                                <div className="mt-4 space-y-4">
                                    {chapters.length > 0 ? (
                                        chapters.map((chapter) => (
                                            <div key={chapter._id} className="rounded-2xl bg-white p-4 border border-blue-100">
                                                <div className="text-sm font-semibold text-blue-800">Chương {chapter.chapterId}: {chapter.title}</div>
                                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                                    {chapter.lessons.map((lesson) => {
                                                        const done = completedLessonIds.includes(lesson.id)
                                                        return (
                                                            <div key={lesson.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-3 bg-gray-50">
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">Bài {lesson.id}</p>
                                                                    <p className="text-xs text-gray-500">{lesson.title}</p>
                                                                </div>
                                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${done ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                                                    {done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Đang tải danh sách bài học...</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl bg-green-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm text-gray-500">Số lần làm đề</p>
                                <p className="mt-1 text-3xl font-semibold text-green-700">{practiceAttempts.length}</p>
                            </div>
                            {practiceAttempts.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => setShowAllAttempts((current) => !current)}
                                    className="rounded-full border border-green-200 bg-white px-3 py-1 text-sm font-medium text-green-700 hover:bg-green-50 transition"
                                >
                                    {showAllAttempts ? 'Thu gọn' : `Xem tất cả (${practiceAttempts.length})`}
                                </button>
                            )}
                        </div>
                        {loadError ? (
                            <p className="mt-4 text-sm text-red-600">{loadError}</p>
                        ) : practiceAttempts.length === 0 ? (
                            <p className="mt-4 text-sm text-gray-600">Chưa có lần làm đề nào.</p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {practiceAttempts.slice(0, showAllAttempts ? practiceAttempts.length : 2).map((attempt) => (
                                    <div key={attempt._id} className="rounded-xl border border-gray-100 bg-white p-4">
                                        <p className="text-sm text-gray-600">Mã truy cập: <span className="font-medium text-gray-900">{attempt.accessCode}</span></p>
                                        <p className="mt-2 text-sm text-gray-700">Trạng thái: {attempt.status === 'finished' ? 'Hoàn thành' : 'Đang làm'}</p>
                                        <p className="mt-1 text-sm text-gray-700">Điểm: {attempt.score}</p>
                                        <p className="mt-1 text-sm text-gray-700">Bắt đầu: {new Date(attempt.startAt).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}
