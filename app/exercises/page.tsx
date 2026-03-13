'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import UserMenu from '@/components/UserMenu'

interface Exercise {
  id: number
  lessonId: string
  lessonTitle: string
  type: 'multiple-choice' | 'calculation' | 'true-false'
  question: string
  options?: string[]
  correctAnswer: string | number | boolean
  explanation: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  category: string
}

interface LessonExercises {
  lessonId: number
  lessonTitle: string
  exercises: Exercise[]
}

export default function ExercisesPage() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('light')
  const [loading, setLoading] = useState(true)
  const [lessonExercises, setLessonExercises] = useState<LessonExercises[]>([])
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState<boolean[]>([])
  const [showFinalResult, setShowFinalResult] = useState(false)
  const [startTime, setStartTime] = useState<Date>(new Date())

  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const lessons = [
    { id: 1, title: "Mô tả dao động" },
    { id: 2, title: "Phương trình dao động điều hoà" },
    { id: 3, title: "Năng lượng trong dao động điều hoà" },
    { id: 4, title: "Dao động tắt dần và cộng hưởng" }
  ]

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.className = savedTheme
  }, [])

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      router.push('/')
    }
  }, [mounted, authLoading, user, router])

  useEffect(() => {
    if (mounted && user) {
      fetchExercises()
    }
  }, [mounted, user])

  const fetchExercises = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/exercises')
      const data = await response.json()

      if (data.success && data.exercises) {
        const allLessonExercises: LessonExercises[] = []

        // Lấy 40 câu cho mỗi bài (10 lý thuyết, 5 thực tế, 25 tính toán)
        for (let lessonId = 1; lessonId <= 4; lessonId++) {
          const lessonData = data.exercises.filter(
            (ex: Exercise) => ex.lessonId === lessonId.toString()
          )

          // Lọc theo category
          const theoryExercises = lessonData.filter(
            (ex: Exercise) => ex.category.includes('Lý thuyết')
          )
          const practicalExercises = lessonData.filter(
            (ex: Exercise) => ex.category.includes('thực tế')
          )
          const calculationExercises = lessonData.filter(
            (ex: Exercise) => !ex.category.includes('Lý thuyết') && !ex.category.includes('thực tế')
          )

          // Shuffle và lấy số lượng theo yêu cầu
          const selectedTheory = shuffleArray([...theoryExercises]).slice(0, 10)
          const selectedPractical = shuffleArray([...practicalExercises]).slice(0, 5)
          const selectedCalculation = shuffleArray([...calculationExercises]).slice(0, 25)

          // Gộp và shuffle lại
          const selectedExercises = shuffleArray([
            ...selectedTheory,
            ...selectedPractical,
            ...selectedCalculation
          ])

          allLessonExercises.push({
            lessonId,
            lessonTitle: lessons[lessonId - 1].title,
            exercises: selectedExercises
          })
        }

        setLessonExercises(allLessonExercises)
        if (allLessonExercises.length > 0) {
          setCompleted(new Array(allLessonExercises[0].exercises.length).fill(false))
        }
      }
    } catch (error) {
      console.error('Error fetching exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.className = newTheme
  }

  const handleBackToLessons = () => {
    router.push('/lesson')
  }

  const handleBackToLessonSelect = () => {
    setSelectedLesson(null)
    setCurrentExercise(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
    setShowFinalResult(false)
  }

  const handlePractice = () => {
    router.push('/practice')
  }

  const handleLessonSelect = (lessonId: number) => {
    setSelectedLesson(lessonId)
    setCurrentExercise(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
    setShowFinalResult(false)
    setStartTime(new Date())
    const lesson = lessonExercises.find(l => l.lessonId === lessonId)
    if (lesson) {
      setCompleted(new Array(lesson.exercises.length).fill(false))
    }
  }

  const getCurrentExercises = (): Exercise[] => {
    if (!selectedLesson) return []
    const lesson = lessonExercises.find(l => l.lessonId === selectedLesson)
    return lesson?.exercises || []
  }

  const getCurrentExercise = (): Exercise | null => {
    if (!selectedLesson) return null
    const exercises = getCurrentExercises()
    return exercises[currentExercise] || null
  }

  const handleAnswerSelect = (answer: string) => {
    if (!showResult) {
      setSelectedAnswer(answer)
    }
  }

  const handleSubmit = () => {
    if (!selectedAnswer) return

    const exercise = getCurrentExercise()
    if (!exercise) return

    const isCorrect = selectedAnswer === exercise.correctAnswer.toString()

    if (isCorrect) {
      setScore(score + 1)
    }

    const newCompleted = [...completed]
    newCompleted[currentExercise] = true
    setCompleted(newCompleted)

    setShowResult(true)
  }

  const handleNext = () => {
    const exercises = getCurrentExercises()
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setSelectedAnswer('')
      setShowResult(false)
    } else {
      setShowFinalResult(true)
    }
  }

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      setSelectedAnswer('')
      setShowResult(false)
    }
  }

  const handleRestart = () => {
    setCurrentExercise(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
    setShowFinalResult(false)
    setStartTime(new Date())
    setCompleted(new Array(getCurrentExercises().length).fill(false))
    fetchExercises()
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedLesson) return
      const exercise = getCurrentExercise()
      if (!exercise || showResult || exercise.type !== 'multiple-choice') return

      const key = e.key
      if (key >= '1' && key <= '4' && exercise.options) {
        const index = parseInt(key) - 1
        if (index < exercise.options.length) {
          setSelectedAnswer(index.toString())
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentExercise, showResult, lessonExercises, selectedLesson])

  if (!mounted || authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải bài tập...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const exercise = getCurrentExercise()
  const exercises = getCurrentExercises()
  const currentLessonData = selectedLesson ? lessonExercises.find(l => l.lessonId === selectedLesson) : null

  // Nếu chưa chọn bài học, hiển thị màn hình chọn bài
  if (!selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Luyện tập
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Luyện tập theo bài học & Luyện tập tổng hợp
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {user && <UserMenu user={user} />}
                <button
                  onClick={handleBackToLessons}
                  className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Về danh sách bài học
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
                Luyện tập theo bài học
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Mỗi bài học có 40 câu hỏi
              </p>
            </div>

            {/* Lesson Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {lessons.map((lesson, index) => {
                const colors = [
                  { from: 'from-blue-500', to: 'to-cyan-500', bg: 'bg-blue-50', darkBg: 'dark:bg-blue-900/20', icon: '〰️' },
                  { from: 'from-purple-500', to: 'to-pink-500', bg: 'bg-purple-50', darkBg: 'dark:bg-purple-900/20', icon: '📐' },
                  { from: 'from-green-500', to: 'to-emerald-500', bg: 'bg-green-50', darkBg: 'dark:bg-green-900/20', icon: '⚡' },
                  { from: 'from-orange-500', to: 'to-red-500', bg: 'bg-orange-50', darkBg: 'dark:bg-orange-900/20', icon: '📉' }
                ]
                const color = colors[index]

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson.id)}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:scale-105 hover:-translate-y-1"
                  >
                    {/* Gradient Header */}
                    <div className={`h-32 bg-gradient-to-br ${color.from} ${color.to} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <div className="relative h-full flex items-center justify-center">
                        <div className="text-6xl opacity-90 transform group-hover:scale-110 transition-transform">
                          {color.icon}
                        </div>
                      </div>
                      {/* Lesson Number Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/30">
                          <span className="text-white font-bold text-lg">{lesson.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {lesson.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>40 câu hỏi</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>~30-40 phút</span>
                        </div>
                      </div>

                      {/* Start Button */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">

                        </span>
                        <div className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${color.from} ${color.to} text-white rounded-lg font-medium group-hover:shadow-lg transition-shadow`}>
                          <span>Bắt đầu</span>
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 dark:group-hover:border-blue-600 rounded-2xl transition-colors pointer-events-none"></div>
                  </button>
                )
              })}
            </div>

            <div className="text-center mt-20 mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-purple-600 mb-4">
                Luyện tập tổng hợp
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Tất cả các dạng bài tập trong Chương 1
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 text-center space-y-4">
              <button
                onClick={handlePractice}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="mr-3">📖</span>
                Luyện tập tổng hợp
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hoàn thành tất cả bài học để mở khóa phần luyện tập
              </p>
            </div>

            {/* Info Section */}
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Hướng dẫn làm bài
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Mỗi bài học có 40 câu hỏi. Luyện tập tổng hợp có 200 câu hỏi. </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Sử dụng phím số 1-4 để chọn đáp án nhanh với câu hỏi trắc nghiệm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Xem giải thích chi tiết sau mỗi câu trả lời để hiểu rõ hơn</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showFinalResult) {
    const endTime = new Date()
    const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
    const minutes = Math.floor(timeSpent / 60)
    const seconds = timeSpent % 60
    const percentage = Math.round((score / exercises.length) * 100)

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Hoàn thành!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentLessonData?.lessonTitle}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Điểm số:</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {score}/{exercises.length}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Tỉ lệ đúng:</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {percentage}%
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Thời gian:</span>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBackToLessonSelect}
                className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Chọn bài khác
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Làm lại
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BT</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Bài tập
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentLessonData?.lessonTitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {user && <UserMenu user={user} />}
              <button
                onClick={handleBackToLessonSelect}
                className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                ← Chọn bài khác
              </button>
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

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          {exercise && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Progress Bar */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/30 dark:to-purple-900/30 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Câu {currentExercise + 1}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">/ {exercises.length}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {score}/{exercises.length}
                    </span>
                  </div>
                </div>
                <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    {exercise.category}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border ${exercise.difficulty === 'basic'
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                    : exercise.difficulty === 'intermediate'
                      ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                      : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                    }`}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    {exercise.difficulty === 'basic' ? 'Cơ bản' : exercise.difficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                  </span>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
                    {exercise.question}
                  </h3>
                </div>

                {/* Answer Options */}
                {exercise.type === 'multiple-choice' && exercise.options ? (
                  <div className="space-y-3">
                    {exercise.options.map((option, index) => {
                      const isSelected = selectedAnswer === index.toString()
                      const isCorrect = index.toString() === exercise.correctAnswer.toString()

                      let buttonClass = 'group relative w-full text-left p-5 rounded-xl border-2 transition-all duration-200 '

                      if (showResult) {
                        if (isCorrect) {
                          buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md'
                        } else if (isSelected) {
                          buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md'
                        } else {
                          buttonClass += 'border-gray-200 dark:border-gray-700 opacity-60'
                        }
                      } else {
                        buttonClass += isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md scale-102'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-sm'
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index.toString())}
                          disabled={showResult}
                          className={buttonClass}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors ${showResult && isCorrect
                              ? 'border-green-500 bg-green-500 text-white'
                              : showResult && isSelected
                                ? 'border-red-500 bg-red-500 text-white'
                                : isSelected
                                  ? 'border-blue-500 bg-blue-500 text-white'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 group-hover:border-blue-400 group-hover:text-blue-600'
                              }`}>
                              {index + 1}
                            </div>
                            <span className="flex-1 text-gray-900 dark:text-white font-medium">{option}</span>
                            {showResult && isCorrect && (
                              <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedAnswer}
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                      disabled={showResult}
                      placeholder="Nhập câu trả lời của bạn..."
                      className="w-full p-5 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-lg font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Result */}
                {showResult && (
                  <div className={`mt-6 p-5 rounded-xl border-2 ${selectedAnswer === exercise.correctAnswer.toString()
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-800'
                    : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-300 dark:border-red-800'
                    }`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${selectedAnswer === exercise.correctAnswer.toString()
                        ? 'bg-green-500'
                        : 'bg-red-500'
                        }`}>
                        {selectedAnswer === exercise.correctAnswer.toString() ? (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-lg mb-2 ${selectedAnswer === exercise.correctAnswer.toString()
                          ? 'text-green-800 dark:text-green-200'
                          : 'text-red-800 dark:text-red-200'
                          }`}>
                          {selectedAnswer === exercise.correctAnswer.toString() ? 'Chính xác! Tuyệt vời!' : 'Chưa chính xác'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-2">
                          <strong>Giải thích:</strong> {exercise.explanation}
                        </p>
                        {selectedAnswer !== exercise.correctAnswer.toString() && (
                          <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              <strong className="text-red-700 dark:text-red-300">Đáp án đúng:</strong>{' '}
                              <span className="font-semibold">{exercise.correctAnswer}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={currentExercise === 0}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Câu trước
                  </button>

                  {!showResult ? (
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedAnswer}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Kiểm tra câu trả lời
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      {currentExercise === exercises.length - 1 ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Hoàn thành bài tập
                        </>
                      ) : (
                        <>
                          Câu tiếp theo
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Keyboard Hint */}
                {exercise.type === 'multiple-choice' && !showResult && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-900">
                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Mẹo: Nhấn phím <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-800 font-mono text-xs">1</kbd>-<kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-800 font-mono text-xs">4</kbd> để chọn đáp án nhanh</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
