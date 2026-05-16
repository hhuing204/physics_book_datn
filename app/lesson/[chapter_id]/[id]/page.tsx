'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MathFormula } from '@/components/Math'
import SlidePresentation, { SlidePresentationRef } from '@/components/SlidePresentation'
import { useProgress } from '@/hooks/useProgress'
import Toast from '@/components/Toast'
import axios from 'axios'
import SimulationModal from '@/components/SimulationModal'
import { Chapter, Lesson, Slide } from '@/types/Chapter'


export default function LessonPage() {
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showCompletionToast, setShowCompletionToast] = useState(false)
  const [showSimulationModal, setShowSimulationModal] = useState(false)
  const [simulationType, setSimulationType] = useState<string>('')
  const slideRef = useRef<SlidePresentationRef>(null)
  const router = useRouter()
  const params = useParams()

  // Lấy params từ URL: /lesson/[chapter_id]/[id]
  const chapterId = params?.chapter_id as string // "1", "2", "3", ...
  const lessonId = params?.id as string // "1", "2", "3", ...

  const { updateProgress } = useProgress()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleOpenSimulation = (type: string) => {
    setSimulationType(type)
    setShowSimulationModal(true)
  }

  useEffect(() => {
    setMounted(true)
    if (chapterId && lessonId) {
      fetchLesson()
    }
  }, [chapterId, lessonId])

  const fetchLesson = async () => {
    setLoading(true)
    try {
      // Gọi API lấy chapter theo chapterId
      const res = await axios.get(`/api/chapters?chapterId=${chapterId}`)
      const chapterData = res.data as Chapter
      setChapter(chapterData)

      // Tìm lesson theo lessonId
      const foundLesson = chapterData.lessons?.find(l => l.id === lessonId)
      setLesson(foundLesson || null)
    } catch (err) {
      console.error('Lỗi khi lấy bài học:', err)
      setLesson(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const threshold = 5
      if (e.clientX <= threshold) {
        setShowSidebar(true)
      } else if (e.clientX > 320) {
        setShowSidebar(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    // Re-render MathJax when content changes
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      (window as any).MathJax.typesetPromise?.()
    }
  }, [lesson])

  const handleBackToChapter = () => {
    router.push(`/lesson/${chapterId}`)
  }

  const handleNextLesson = async () => {
    if (!chapter || !lesson) return

    setIsUpdating(true)
    try {
      await updateProgress?.(parseInt(lessonId), true)

      // Tìm bài tiếp theo trong cùng chapter
      const currentIndex = chapter.lessons.findIndex(l => l.id === lessonId)
      if (currentIndex < chapter.lessons.length - 1) {
        // Còn bài trong chapter
        const nextLesson = chapter.lessons[currentIndex + 1]
        router.push(`/lesson/${chapterId}/${nextLesson.id}`)
      } else {
        // Hết bài trong chapter, chuyển sang practice của chapter
        router.push(`/practice/chapter-${chapterId}`)
      }
    } catch (err) {
      console.error('Failed to update progress:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePrevLesson = () => {
    if (!chapter || !lesson) return

    const currentIndex = chapter.lessons.findIndex(l => l.id === lessonId)
    if (currentIndex > 0) {
      const prevLesson = chapter.lessons[currentIndex - 1]
      router.push(`/lesson/${chapterId}/${prevLesson.id}`)
    }
  }

  const handleSlideChange = (slideIndex: number) => {
    setCurrentSlide(slideIndex)

    // Kiểm tra nếu slide hiện tại là simulation
    const currentSlideData = lesson?.slides?.[slideIndex]
    if (currentSlideData?.type === 'simulation' && currentSlideData.simulationType) {
      setSimulationType(currentSlideData.simulationType)
      setShowSimulationModal(true)
    }
  }

  const handleLessonComplete = () => {
    setShowCompletionToast(true)
    setTimeout(() => {
      router.push(`/lesson/${chapterId}`)
    }, 2000)
  }

  const getSlideTypeIcon = (type: string) => {
    switch (type) {
      case 'intro': return '📚'
      case 'defination': return '💡'
      case 'example': return '🔍'
      case 'summary': return '📋'
      case 'simulation': return '🎮'
      case 'relation': return '🔄'
      default: return '📄'
    }
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

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!chapter || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Bài học không tồn tại
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Đã xóa header fixed - sử dụng header chung từ layout */}

      {/* Sidebar with lesson slides */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 z-40">
        {showSidebar && !sidebarOpen && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-20 bg-blue-500/50 rounded-r-full transition-all duration-200"></div>
        )}

        <div className={`h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 shadow-xl ${sidebarOpen || showSidebar ? 'translate-x-0' : '-translate-x-72'
          }`}>
          <div className="p-6">
            {/* Chapter info */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {chapter.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {chapter.lessons?.length || 0} bài học
              </p>
              <button
                onClick={handleBackToChapter}
                className="w-full p-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition"
              >
                📖 Về trang chương
              </button>
            </div>

            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Slides bài học
            </h3>
            <div className="space-y-2 text-sm max-h-[400px] overflow-y-auto pr-2">
              {lesson.slides?.map((slide: Slide, index: number) => (
                <button
                  key={slide.id}
                  onClick={() => {
                    slideRef.current?.goToSlide(index)
                    setCurrentSlide(index)
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${index === currentSlide
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm">{getSlideTypeIcon(slide.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{slide.title}</div>
                      <div className="text-xs opacity-75 capitalize">{slide.type}</div>
                    </div>
                    <span className="text-xs opacity-60">{index + 1}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick navigation */}
            <div className="mt-8 space-y-2">
              <button
                onClick={() => router.push('/lesson')}
                className="w-full p-3 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-colors text-sm"
              >
                📚 Danh sách chương
              </button>
              <button
                onClick={() => router.push('/practice')}
                className="w-full p-3 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg font-medium transition-colors text-sm"
              >
                📖 Luyện tập tổng hợp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="transition-all duration-300 ml-0">
        <div className="max-w-4xl mx-auto p-6">
          {/* Breadcrumb navigation */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
            <button
              onClick={() => router.push('/')}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Trang chủ
            </button>
            <span>›</span>
            <button
              onClick={() => router.push('/lesson')}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Danh sách chương
            </button>
            <span>›</span>
            <button
              onClick={handleBackToChapter}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Chương {chapterId}
            </button>
            <span>›</span>
            <span className="text-blue-600 dark:text-blue-400">
              Bài {lessonId}: {lesson.title}
            </span>
          </div>

          {/* Slide Presentation */}
          <div className="h-[calc(100vh-10rem)]">
            <SlidePresentation
              ref={slideRef}
              slides={lesson.slides || []}
              lessonTitle={`Bài ${lessonId}: ${lesson.title}`}
              lessonId={parseInt(lessonId)}
              onSlideChange={handleSlideChange}
              onLessonComplete={handleLessonComplete}
              onOpenSimulation={handleOpenSimulation}
              chapterId={chapterId}
            />
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrevLesson}
              disabled={!chapter || chapter.lessons.findIndex(l => l.id === lessonId) <= 0}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${!chapter || chapter.lessons.findIndex(l => l.id === lessonId) <= 0
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Bài trước
            </button>

            <button
              onClick={handleBackToChapter}
              className="px-6 py-3 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-colors"
            >
              📖 Về trang chương
            </button>

            <button
              onClick={handleNextLesson}
              disabled={isUpdating}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${isUpdating ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {chapter && chapter.lessons.findIndex(l => l.id === lessonId) >= chapter.lessons.length - 1
                ? '📝 Luyện tập chương'
                : 'Bài tiếp theo'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Completion Toast */}
      <Toast
        message={`Chúc mừng! Bạn đã hoàn thành bài ${lessonId}: ${lesson?.title}`}
        type="success"
        isVisible={showCompletionToast}
        onClose={() => setShowCompletionToast(false)}
        duration={2000}
      />

      {/* Simulation Modal */}
      {showSimulationModal && (
        <SimulationModal
          isOpen={showSimulationModal}
          onClose={() => setShowSimulationModal(false)}
          componentName={simulationType}
          chapterId={chapterId}
          lessonId={lessonId}
        />
      )}
    </div>
  )
}