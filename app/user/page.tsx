'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface PracticeAnswer {
    exerciseId: string
    answer: any
    correct: boolean
    graded?: boolean
    question: string
}

interface PracticeAttempt {
    _id: string
    accessCode: string
    status: 'in-progress' | 'finished'
    score: number
    timeAlloted: number
    startAt: string
    submittedAt?: string | null
    updatedAt: string
    user_id?: {
        _id: string
        name: string
        email: string
    }
    answers?: PracticeAnswer[]
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
    const { user, loading, updateProfile } = useAuth()
    const [lessonProgressCount, setLessonProgressCount] = useState<number>(0)
    const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [practiceAttempts, setPracticeAttempts] = useState<PracticeAttempt[]>([])
    const [selectedAttempt, setSelectedAttempt] = useState<PracticeAttempt | null>(null)
    const [showAllAttempts, setShowAllAttempts] = useState(false)
    const [showLessonDetails, setShowLessonDetails] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)

    const [profileName, setProfileName] = useState<string>('')
    const [profileEmail, setProfileEmail] = useState<string>('')
    const [currentPassword, setCurrentPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('')
    const [profileMessage, setProfileMessage] = useState<string | null>(null)
    const [profileError, setProfileError] = useState<string | null>(null)
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

    // Teacher search state
    const [searchAccessCode, setSearchAccessCode] = useState<string>('')
    const [teacherSearchResults, setTeacherSearchResults] = useState<PracticeAttempt[]>([])
    const [teacherSearchError, setTeacherSearchError] = useState<string | null>(null)
    const [isTeacherSearching, setIsTeacherSearching] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            if (loading || !user) return

            const token = localStorage.getItem('auth_token')
            const isTeacher = (user.role || '').toString().toLowerCase() === 'teacher'

            try {
                // Only load learning progress for learners, not teachers
                if (!isTeacher) {
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
                }
            } catch (error) {
                console.error(error)
                setLoadError('Có lỗi khi tải thông tin người dùng.')
            }
        }

        loadData()
    }, [loading, user])

    useEffect(() => {
        if (user) {
            setProfileName(user.name || '')
            setProfileEmail(user.email || '')
        }
    }, [user])

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setProfileError(null)
        setProfileMessage(null)

        if (!profileName.trim() || !profileEmail.trim()) {
            setProfileError('Vui lòng nhập tên và email.')
            return
        }

        if (newPassword) {
            if (newPassword.length < 6) {
                setProfileError('Mật khẩu mới phải có ít nhất 6 ký tự.')
                return
            }
            if (newPassword !== confirmNewPassword) {
                setProfileError('Mật khẩu mới và xác nhận mật khẩu không khớp.')
                return
            }
            if (!currentPassword) {
                setProfileError('Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu.')
                return
            }
        }

        setIsUpdatingProfile(true)

        try {
            const result = await updateProfile({
                name: profileName,
                email: profileEmail,
                currentPassword: currentPassword || undefined,
                newPassword: newPassword || undefined,
            })

            if (result.success) {
                setProfileMessage(result.message)
                setCurrentPassword('')
                setNewPassword('')
                setConfirmNewPassword('')
            } else {
                setProfileError(result.message)
            }
        } catch (error) {
            console.error(error)
            setProfileError('Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setIsUpdatingProfile(false)
        }
    }

    const handleTeacherSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchAccessCode.trim()) {
            setTeacherSearchError('Vui lòng nhập mã truy cập đề luyện tập')
            return
        }

        setIsTeacherSearching(true)
        setTeacherSearchError(null)
        setTeacherSearchResults([])

        try {
            const token = localStorage.getItem('auth_token')
            const res = await fetch(`/api/practice-progress/by-access-code?accessCode=${encodeURIComponent(searchAccessCode.trim())}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            const data = await res.json()
            if (!data.success) {
                setTeacherSearchError(data.message || 'Không tìm thấy kết quả')
                return
            }

            setTeacherSearchResults(data.attempts || [])
            if (data.attempts?.length === 0) {
                setTeacherSearchError('Không tìm thấy lần làm đề nào cho mã truy cập này')
            }
        } catch (error) {
            console.error(error)
            setTeacherSearchError('Có lỗi khi tìm kiếm. Vui lòng thử lại.')
        } finally {
            setIsTeacherSearching(false)
        }
    }

    const isTeacher = (user?.role || '').toString().toLowerCase() === 'teacher'

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

                        <p className="mt-2 text-lg font-medium text-gray-900">
                            {user.role === 'teacher'
                                ? 'Giáo viên'
                                : user.role === 'admin'
                                    ? 'Quản trị viên'
                                    : 'Học sinh'}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Tham gia từ</p>
                        <p className="mt-2 text-lg font-medium text-gray-900">{user.createdAt ? new Date(user.createdAt ?? '').toLocaleDateString() : 'Không xác định'}</p>
                    </div>
                </div>
            </div>

            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold">Chỉnh sửa thông tin</h2>
                        <p className="mt-2 text-gray-600">Cập nhật tên, email hoặc mật khẩu của bạn.</p>
                    </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
                    {profileMessage && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
                            {profileMessage}
                        </div>
                    )}
                    {profileError && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
                            {profileError}
                        </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Họ và tên</span>
                            <input
                                type="text"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Email</span>
                            <input
                                type="email"
                                value={profileEmail}
                                onChange={(e) => setProfileEmail(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Mật khẩu hiện tại</span>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Để đổi mật khẩu"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Mật khẩu mới</span>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mật khẩu mới"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</span>
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-sm text-gray-500">Chỉ điền mật khẩu khi bạn muốn thay đổi mật khẩu.</p>
                        <button
                            type="submit"
                            disabled={isUpdatingProfile}
                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {isUpdatingProfile ? 'Đang cập nhật...' : 'Cập nhật thay đổi'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid gap-6">
                {!isTeacher ? (
                    // Learner content
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
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                <div>
                                                    <p className="text-sm text-gray-600">Mã truy cập: <span className="font-medium text-gray-900">{attempt.accessCode}</span></p>
                                                    <p className="mt-2 text-sm text-gray-700">Trạng thái: {attempt.status === 'finished' ? 'Hoàn thành' : 'Đang làm'}</p>
                                                    <p className="mt-1 text-sm text-gray-700">Điểm: {attempt.score}</p>
                                                    <p className="mt-1 text-sm text-gray-700">Bắt đầu: {new Date(attempt.startAt).toLocaleString()}</p>
                                                    {attempt.submittedAt && (
                                                        <p className="mt-1 text-sm text-gray-700">Nộp lúc: {new Date(attempt.submittedAt).toLocaleString()}</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedAttempt(attempt)}
                                                    className="self-start rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 transition"
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Teacher content - Search for practice attempts
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold">Xem kết quả luyện đề của Học sinh</h2>
                        <p className="mt-2 text-gray-600">Nhập mã truy cập để xem tất cả kết quả làm đề của học viên.</p>

                        <form onSubmit={handleTeacherSearch} className="mt-6">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={searchAccessCode}
                                    onChange={(e) => setSearchAccessCode(e.target.value)}
                                    placeholder="Nhập mã truy cập (ví dụ: ABC123)"
                                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                                <button
                                    type="submit"
                                    disabled={isTeacherSearching}
                                    className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                                >
                                    {isTeacherSearching ? 'Đang tìm...' : 'Tìm kiếm'}
                                </button>
                            </div>
                        </form>

                        {teacherSearchError && (
                            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
                                <p className="text-sm text-red-800">{teacherSearchError}</p>
                            </div>
                        )}

                        {teacherSearchResults.length > 0 && (
                            <div className="mt-6 space-y-4">
                                <div className="rounded-xl bg-blue-50 p-4">
                                    <p className="text-sm text-gray-500">Tổng số lần làm đề</p>
                                    <p className="mt-1 text-3xl font-semibold text-blue-700">{teacherSearchResults.length}</p>
                                </div>

                                <div className="space-y-3">
                                    {teacherSearchResults.map((attempt) => (
                                        <div key={attempt._id} className="rounded-xl border border-gray-100 bg-white p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600">Học viên: <span className="font-medium text-gray-900">{attempt.user_id?.name || 'Không xác định'}</span></p>
                                                    <p className="text-sm text-gray-600">Email: <span className="font-medium text-gray-900">{attempt.user_id?.email || 'Không xác định'}</span></p>
                                                    <p className="mt-2 text-sm text-gray-600">Mã truy cập: <span className="font-medium text-gray-900">{attempt.accessCode}</span></p>
                                                    <p className="mt-2 text-sm text-gray-700">Trạng thái: {attempt.status === 'finished' ? 'Hoàn thành' : 'Đang làm'}</p>
                                                    <p className="mt-1 text-sm text-gray-700">Điểm: {attempt.score}</p>
                                                    <p className="mt-1 text-sm text-gray-700">Bắt đầu: {new Date(attempt.startAt).toLocaleString()}</p>
                                                    {attempt.submittedAt && (
                                                        <p className="mt-1 text-sm text-gray-700">Nộp lúc: {new Date(attempt.submittedAt).toLocaleString()}</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedAttempt(attempt)}
                                                    className="self-start rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 transition"
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Detail modal - shared by both learners and teachers */}
            {selectedAttempt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-8">
                    <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10">
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Chi tiết lần làm đề</h3>
                                <p className="text-sm text-gray-500">Mã truy cập: {selectedAttempt.accessCode}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedAttempt(null)}
                                className="rounded-full border border-gray-200 bg-white px-3 py-2 text-gray-600 hover:bg-gray-50"
                            >
                                Đóng
                            </button>
                        </div>
                        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">Trạng thái</p>
                                    <p className="mt-1 text-base font-semibold text-gray-900">{selectedAttempt.status === 'finished' ? 'Hoàn thành' : 'Đang làm'}</p>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">Điểm</p>
                                    <p className="mt-1 text-base font-semibold text-gray-900">{selectedAttempt.score}</p>
                                </div>
                            </div>
                            {selectedAttempt.submittedAt && (
                                <div className="rounded-2xl bg-gray-50 p-4">
                                    <p className="text-sm text-gray-500">Nộp lúc</p>
                                    <p className="mt-1 text-base font-semibold text-gray-900">{new Date(selectedAttempt.submittedAt).toLocaleString()}</p>
                                </div>
                            )}
                            <div className="rounded-2xl bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Số câu trả lời</p>
                                <p className="mt-1 text-base font-semibold text-gray-900">{selectedAttempt.answers?.length ?? 0}</p>
                            </div>

                            <div className="space-y-4">
                                {(selectedAttempt.answers && selectedAttempt.answers.length > 0) ? (
                                    selectedAttempt.answers.map((answer: PracticeAnswer, index) => (
                                        <div key={answer.exerciseId || index} className="rounded-2xl border border-gray-200 bg-white p-4">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-500">Câu hỏi #{index + 1}</p>
                                                    <p className="mt-1 text-base font-medium text-gray-900">{answer.question}</p>
                                                </div>
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${answer.graded === false ? 'bg-yellow-100 text-yellow-800' : answer.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {answer.graded === false ? 'Chưa kiểm tra' : answer.correct ? 'Đúng' : 'Sai'}
                                                </span>
                                            </div>
                                            <div className="mt-3 space-y-2 text-sm text-gray-700">
                                                <div>
                                                    <p className="font-semibold text-gray-900">Đáp án đã chọn:</p>
                                                    <p>{typeof answer.answer === 'object' ? JSON.stringify(answer.answer) : String(answer.answer)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-2xl bg-white p-4 border border-gray-200">
                                        <p className="text-sm text-gray-500">Không có dữ liệu chi tiết câu trả lời.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
