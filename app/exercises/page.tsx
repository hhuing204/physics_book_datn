// app/exercises/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { MathFormula, RenderWithMath, MathProvider } from '@/components/Math'
import * as Icons from 'lucide-react'

interface Exercise {
  _id?: string
  id: number
  chapterId: string
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

interface LessonExerciseCount {
  chapterId: string
  lessonId: string
  count: number
}

// Component để render nội dung có công thức toán
// function RenderWithMath({ content }: { content: string }) {
//   if (!content) return null

//   const parseContent = (text: string) => {
//     const parts: Array<{ type: 'text' | 'math'; content: string; inline?: boolean }> = []
//     const blockMathRegex = /\$\$([^$]+?)\$\$/g
//     const inlineMathRegex = /\$([^$]+?)\$/g

//     let lastIndex = 0
//     let match

//     const blockMatches: Array<{ index: number; content: string; length: number }> = []
//     while ((match = blockMathRegex.exec(text)) !== null) {
//       blockMatches.push({ index: match.index, content: match[1], length: match[0].length })
//     }

//     const inlineMatches: Array<{ index: number; content: string; length: number }> = []
//     while ((match = inlineMathRegex.exec(text)) !== null) {
//       const isBlock = blockMatches.some(b => match!.index >= b.index && match!.index < b.index + b.length)
//       if (!isBlock) {
//         inlineMatches.push({ index: match.index, content: match[1], length: match[0].length })
//       }
//     }

//     const allMatches = [
//       ...blockMatches.map(m => ({ ...m, type: 'block' as const })),
//       ...inlineMatches.map(m => ({ ...m, type: 'inline' as const }))
//     ].sort((a, b) => a.index - b.index)

//     for (const match of allMatches) {
//       if (match.index > lastIndex) {
//         parts.push({
//           type: 'text',
//           content: text.slice(lastIndex, match.index)
//         })
//       }
//       parts.push({
//         type: 'math',
//         content: match.content,
//         inline: match.type === 'inline'
//       })
//       lastIndex = match.index + match.length
//     }

//     if (lastIndex < text.length) {
//       parts.push({
//         type: 'text',
//         content: text.slice(lastIndex)
//       })
//     }

//     return parts
//   }

//   const parts = parseContent(content)

//   return (
//     <div className="math-content">
//       {parts.map((part, idx) => {
//         if (part.type === 'math') {
//           return (
//             <MathFormula
//               key={idx}
//               formula={part.content}
//               inline={part.inline}
//             />
//           )
//         }
//         let text = part.content
//         const greekMap: Record<string, string> = {
//           'α': '\\alpha', 'β': 'beta', 'γ': 'gamma', 'δ': 'delta',
//           'ε': 'epsilon', 'ζ': 'zeta', 'η': 'eta', 'θ': 'theta',
//           'ι': 'iota', 'κ': 'kappa', 'λ': 'lambda', 'μ': 'mu',
//           'ν': 'nu', 'ξ': 'xi', 'π': 'pi', 'ρ': 'rho',
//           'σ': 'sigma', 'τ': 'tau', 'υ': 'upsilon', 'φ': 'varphi',
//           'χ': 'chi', 'ψ': 'psi', 'ω': 'omega',
//           'Δ': 'Delta', 'Σ': 'Sigma', 'Φ': 'Phi', 'Ψ': 'Psi', 'Ω': 'Omega'
//         }

//         Object.entries(greekMap).forEach(([char, latex]) => {
//           text = text.replace(new RegExp(char, 'g'), `$${latex}$`)
//         })

//         return <span key={idx} dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />
//       })}
//     </div>
//   )
// }

// Danh sách chương với icon Lucide
const chapters = [
  { id: '1', title: 'Dao Động Cơ', icon: Icons.Waves, color: 'from-blue-500 to-cyan-500', bgGlow: 'shadow-blue-500/20' },
  { id: '2', title: 'Sóng Cơ', icon: Icons.Zap, color: 'from-cyan-500 to-teal-500', bgGlow: 'shadow-cyan-500/20' },
]

// Map lessonId -> lessonTitle
const lessonsByChapter: Record<string, { id: string; title: string }[]> = {
  '1': [
    { id: '1', title: 'Mô tả dao động' },
    { id: '2', title: 'Phương trình dao động điều hoà' },
    { id: '3', title: 'Năng lượng trong dao động điều hoà' },
    { id: '4', title: 'Dao động tắt dần và cộng hưởng' }
  ],
  '2': [
    { id: '5', title: 'Sóng và Sự Truyền Sóng' },
    { id: '6', title: 'Các Đặc Trưng Vật Lý Của Sóng' },
    { id: '7', title: 'Sóng Điện Từ' },
    { id: '8', title: 'Giao Thoa Sóng' },
    { id: '9', title: 'Sóng Dừng' }
  ],
}

const timeOptions = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180]

const difficultyOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Cơ bản', value: 'basic' },
  { label: 'Thông hiểu', value: 'intermediate' },
  { label: 'Vận dụng cao', value: 'advanced' },
]

export default function ExercisesPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allExercises, setAllExercises] = useState<Exercise[]>([])
  const [lessonCounts, setLessonCounts] = useState<LessonExerciseCount[]>([])
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState<boolean[]>([])
  const [showFinalResult, setShowFinalResult] = useState(false)
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [currentLessonExercises, setCurrentLessonExercises] = useState<Exercise[]>([])
  const [accessCodeInput, setAccessCodeInput] = useState('')
  const [accessCodeError, setAccessCodeError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTime, setSelectedTime] = useState(30)
  const [selectedDifficulty, setSelectedDifficulty] = useState('intermediate')
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(10)

  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()

  const chapterIdParam = params?.chapter_id as string
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    setMounted(true)

    if (chapterIdParam && chapters.some(c => c.id === chapterIdParam)) {
      setSelectedChapter(chapterIdParam)
    } else if (searchParams.get('chapter')) {
      setSelectedChapter(searchParams.get('chapter'))
    }
  }, [chapterIdParam, searchParams])

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
        setAllExercises(data.exercises)
        setLessonCounts(data.lessonCounts || [])
      }
    } catch (error) {
      console.error('Error fetching exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const getExerciseCountForLesson = (chapterId: string, lessonId: string): number => {
    const countData = lessonCounts.find(
      lc => lc.chapterId === chapterId && lc.lessonId === lessonId
    )
    return countData?.count || 0
  }

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5)
  }

  const getExercisesForLesson = (chapterId: string, lessonId: string): Exercise[] => {
    const exercises = allExercises.filter(
      ex => ex.chapterId === chapterId && ex.lessonId === lessonId
    )
    return shuffleArray([...exercises])
  }

  const handleBackToLessons = () => {
    router.push('/lesson')
  }

  const handleBackToChapters = () => {
    setSelectedChapter(null)
    setSelectedLesson(null)
    setCurrentExercise(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
    setShowFinalResult(false)
    setCurrentLessonExercises([])
  }

  const handleBackToLessonsList = () => {
    setSelectedLesson(null)
    setCurrentExercise(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
    setShowFinalResult(false)
    setCurrentLessonExercises([])
  }

  const handlePracticeOverall = async ({
    timeAlloted,
    difficulty,
    questionCount,
  }: {
    timeAlloted: number
    difficulty: string
    questionCount: number
  }) => {
    try {
      const res = await fetch('/api/practice-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeAlloted,
          numQuestions: questionCount,
          chapterId: 'all',
          difficulty,
          source: 'stored',
        }),
      })

      const data = await res.json()

      if (!data.success) {
        console.error(data.message)
        return
      }

      const test = data.test

      // IMPORTANT: your page already supports this path
      router.push(`/practice?accessCode=${test.accessCode}`)
    } catch (error) {
      console.error('Failed to create practice test:', error)
    }
  }

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId)
    setSelectedLesson(null)
    setCurrentExercise(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
    setShowFinalResult(false)
    setCurrentLessonExercises([])
    router.push(`/exercises/${chapterId}`)
  }

  const handleAccessCodeSubmit = () => {
    const trimmedCode = accessCodeInput.trim().toUpperCase()
    if (!trimmedCode) {
      setAccessCodeError('Vui lòng nhập mã truy cập.')
      return
    }
    setAccessCodeError('')
    router.push(`/practice?accessCode=${encodeURIComponent(trimmedCode)}`)
  }

  const handleGenerateNewTest = async () => {
    if (!selectedChapter || !selectedLesson) return
    try {
      setIsGenerating(true)
      const response = await fetch('/api/practice-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: selectedLesson,
          chapterId: selectedChapter,
          source: 'blueprint',
          timeAlloted: 30,
          numQuestions: 10,
        }),
      })
      const data = await response.json()
      if (data.success && data.test?.accessCode) {
        router.push(`/practice?accessCode=${encodeURIComponent(data.test.accessCode)}`)
      } else {
        setAccessCodeError('Không thể tạo đề mới, vui lòng thử lại.')
      }
    } catch (error) {
      console.error(error)
      setAccessCodeError('Có lỗi khi tạo đề mới.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleLessonSelect = (lessonId: string, lessonTitle: string) => {
    if (!selectedChapter) return

    const exercises = getExercisesForLesson(selectedChapter, lessonId)

    if (exercises.length === 0) {
      alert('Bài học này chưa có câu hỏi nào. Vui lòng quay lại sau!')
      return
    }

    setSelectedLesson(lessonId)
    setCurrentExercise(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
    setShowFinalResult(false)
    setStartTime(new Date())
    setCompleted(new Array(exercises.length).fill(false))
    setCurrentLessonExercises(exercises)
  }

  const getCurrentExercises = (): Exercise[] => {
    return currentLessonExercises
  }

  const getCurrentExercise = (): Exercise | null => {
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
    if (!selectedChapter || !selectedLesson) return

    const newExercises = getExercisesForLesson(selectedChapter, selectedLesson)

    setCurrentLessonExercises(newExercises)
    setCurrentExercise(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
    setShowFinalResult(false)
    setStartTime(new Date())
    setCompleted(new Array(newExercises.length).fill(false))
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedLesson || !selectedChapter) return
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
  }, [currentExercise, showResult, currentLessonExercises, selectedLesson, selectedChapter])

  if (!mounted || authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <Icons.BookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Đang tải bài tập...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // ==================== MÀN HÌNH CHỌN CHƯƠNG ====================
  if (!selectedChapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
              <Icons.Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
              <span>Luyện tập thông minh</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Luyện tập Vật Lý 11
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Chọn chương học để bắt đầu luyện tập với hàng trăm câu hỏi có lời giải chi tiết
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="rounded-3xl border border-indigo-100 dark:border-indigo-800 bg-white dark:bg-gray-900 shadow-sm p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={accessCodeInput}
                    onChange={(e) => setAccessCodeInput(e.target.value)}
                    placeholder="Nhập mã truy cập đề luyện tập"
                    className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAccessCodeSubmit}
                    className="rounded-2xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Truy cập đề
                  </button>
                </div>
                {accessCodeError && (
                  <p className="mt-2 text-sm text-red-600">{accessCodeError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {chapters.map((chapter) => {
              const lessonsInChapter = lessonsByChapter[chapter.id] || []
              const totalExercises = lessonsInChapter.reduce((total, lesson) => {
                return total + getExerciseCountForLesson(chapter.id, lesson.id)
              }, 0)
              const ChapterIcon = chapter.icon

              return (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterSelect(chapter.id)}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-105"
                >
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${chapter.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl`} />

                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${chapter.color} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        <ChapterIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Icons.BookOpen className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400">{lessonsInChapter.length} bài</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-left">
                      Chương {chapter.id}: {chapter.title}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 text-left line-clamp-2">
                      {chapter.id === '1' && 'Khám phá thế giới dao động cơ học qua các bài tập đa dạng'}
                      {chapter.id === '2' && 'Tìm hiểu về sóng cơ và các hiện tượng giao thoa, sóng dừng'}
                      {chapter.id === '3' && 'Nắm vững kiến thức về điện trường và tụ điện'}
                      {chapter.id === '4' && 'Hiểu rõ về dòng điện, định luật Ohm và nguồn điện'}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Icons.FileQuestion className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {totalExercises} câu hỏi
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                        <span className="text-sm font-medium">Luyện tập</span>
                        <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Overall Practice Section */}
          <div className="mt-16 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-30" />

              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative flex flex-col gap-8">

                  {/* Header */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <Icons.Trophy className="w-6 h-6 text-yellow-300" />
                        <span className="text-yellow-300 font-semibold">
                          Thử thách
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        Luyện tập tổng hợp
                      </h3>

                      <p className="text-indigo-100 max-w-md">
                        Kiểm tra kiến thức tổng hợp với câu hỏi từ tất cả {chapters.length} chương
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handlePracticeOverall({
                          timeAlloted: selectedTime,
                          difficulty: selectedDifficulty,
                          questionCount: selectedQuestionCount,
                        })
                      }
                      className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <Icons.Swords className="w-5 h-5" />
                      <span>Bắt đầu thử thách</span>
                      <Icons.ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* CONTROLS ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Time Selection (CYCLIC) */}
                    <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
                      <label className="block text-sm font-semibold mb-3 text-indigo-100">
                        Thời gian làm bài
                      </label>

                      <div className="flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            const currentIndex = timeOptions.indexOf(selectedTime)
                            const newIndex =
                              currentIndex <= 0 ? timeOptions.length - 1 : currentIndex - 1
                            setSelectedTime(timeOptions[newIndex])
                          }}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                        >
                          <Icons.ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex-1 text-center">
                          <div className="text-2xl font-bold">
                            {selectedTime >= 60
                              ? `${Math.floor(selectedTime / 60)} giờ${selectedTime % 60 !== 0 ? ` ${selectedTime % 60} phút` : ''
                              }`
                              : `${selectedTime} phút`}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const currentIndex = timeOptions.indexOf(selectedTime)
                            const newIndex =
                              currentIndex >= timeOptions.length - 1 ? 0 : currentIndex + 1
                            setSelectedTime(timeOptions[newIndex])
                          }}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                        >
                          <Icons.ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Difficulty Selection (CYCLIC) */}
                    <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
                      <label className="block text-sm font-semibold mb-3 text-indigo-100">
                        Độ khó
                      </label>

                      <div className="flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            const currentIndex = difficultyOptions.findIndex(
                              (d) => d.value === selectedDifficulty
                            )
                            const newIndex =
                              currentIndex <= 0
                                ? difficultyOptions.length - 1
                                : currentIndex - 1

                            setSelectedDifficulty(difficultyOptions[newIndex].value)
                          }}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                        >
                          <Icons.ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex-1 text-center">
                          <div className="text-2xl font-bold">
                            {
                              difficultyOptions.find(
                                (d) => d.value === selectedDifficulty
                              )?.label
                            }
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const currentIndex = difficultyOptions.findIndex(
                              (d) => d.value === selectedDifficulty
                            )
                            const newIndex =
                              currentIndex >= difficultyOptions.length - 1 ? 0 : currentIndex + 1

                            setSelectedDifficulty(difficultyOptions[newIndex].value)
                          }}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                        >
                          <Icons.ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Question Count (CYCLIC 10–100 step 5) */}
                    <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
                      <label className="block text-sm font-semibold mb-3 text-indigo-100">
                        Số lượng câu hỏi
                      </label>

                      <div className="flex items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedQuestionCount((prev) =>
                              prev <= 10 ? 100 : prev - 5
                            )
                          }}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                        >
                          <Icons.ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex-1 text-center">
                          <div className="text-2xl font-bold">
                            {selectedQuestionCount}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedQuestionCount((prev) =>
                              prev >= 100 ? 10 : prev + 5
                            )
                          }}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                        >
                          <Icons.ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guide Section */}
          <div className="mt-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                  <Icons.Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  Mẹo làm bài hiệu quả
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">Pro tip</span>
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <Icons.CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Sử dụng phím số <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">1</kbd>-<kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">4</kbd> để chọn đáp án nhanh</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icons.CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Xem giải thích chi tiết sau mỗi câu để hiểu rõ bản chất</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icons.CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Theo dõi tiến độ và luyện tập lại những câu sai</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==================== MÀN HÌNH CHỌN BÀI HỌC ====================
  if (selectedChapter && !selectedLesson) {
    const currentChapter = chapters.find(c => c.id === selectedChapter)
    const lessons = lessonsByChapter[selectedChapter] || []
    const ChapterIcon = currentChapter?.icon || Icons.BookOpen

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={handleBackToChapters}
            className="group mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
          >
            <Icons.ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại danh sách chương</span>
          </button>

          {/* Chapter Header */}
          <div className="mb-8 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${currentChapter?.color} shadow-lg`}>
              {ChapterIcon && <ChapterIcon className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Chương {selectedChapter}: {currentChapter?.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Chọn bài học để bắt đầu luyện tập
              </p>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 gap-4">
            {lessons.map((lesson, index) => {
              const exerciseCount = getExerciseCountForLesson(selectedChapter, lesson.id)
              const estimatedTime = Math.ceil(exerciseCount / 2)
              const colors = [
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500',
                'from-green-500 to-emerald-500',
                'from-orange-500 to-red-500'
              ]
              const color = colors[index % colors.length]

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson.id, lesson.title)}
                  disabled={exerciseCount === 0}
                  className={`group w-full bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 ${exerciseCount > 0 ? 'hover:scale-[1.02]' : 'opacity-60 cursor-not-allowed'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                      {lesson.id}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        Bài {lesson.id}: {lesson.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Icons.FileQuestion className="w-3.5 h-3.5" />
                          <span>{exerciseCount} câu hỏi</span>
                        </div>
                        {exerciseCount > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Icons.Clock className="w-3.5 h-3.5" />
                            <span>~{estimatedTime} phút</span>
                          </div>
                        )}
                      </div>
                      {exerciseCount === 0 && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <Icons.AlertCircle className="w-3 h-3" />
                          Chưa có bài tập
                        </p>
                      )}
                    </div>
                    {exerciseCount > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl group-hover:bg-indigo-600 transition-all">
                        <span className="text-indigo-600 dark:text-indigo-400 group-hover:text-white font-medium">Làm bài</span>
                        <Icons.ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ==================== MÀN HÌNH LÀM BÀI TẬP ====================
  const exercise = getCurrentExercise()
  const exercisesList = getCurrentExercises()
  const currentLesson = selectedLesson ? lessonsByChapter[selectedChapter!]?.find(l => l.id === selectedLesson) : null

  if (showFinalResult) {
    const endTime = new Date()
    const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
    const minutes = Math.floor(timeSpent / 60)
    const seconds = timeSpent % 60
    const percentage = Math.round((score / exercisesList.length) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleBackToLessonsList}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
          >
            <Icons.ArrowLeft className="w-4 h-4" />
            <span>Chọn bài khác</span>
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <Icons.Trophy className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg animate-ping-slow">
                ⭐
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Hoàn thành xuất sắc!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Chương {selectedChapter} - Bài {selectedLesson}: {currentLesson?.title}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <Icons.Star className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{score}/{exercisesList.length}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Điểm số</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <Icons.TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{percentage}%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Tỉ lệ đúng</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <Icons.Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{minutes}:{seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Thời gian</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBackToLessonsList}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Icons.BookOpen className="w-4 h-4" />
                Chọn bài khác
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Icons.RefreshCw className="w-4 h-4" />
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackToLessonsList}
          className="group mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
        >
          <Icons.ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại danh sách bài học</span>
        </button>

        {/* Header Info */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Icons.FileQuestion className="w-6 h-6 text-indigo-600" />
              Bài tập
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Chương {selectedChapter} - Bài {selectedLesson}: {currentLesson?.title}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
              <Icons.Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                {exercisesList.length} câu hỏi
              </span>
            </div>
            <button
              onClick={handleGenerateNewTest}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icons.RefreshCw className="w-4 h-4" />
              {isGenerating ? 'Đang tạo đề...' : 'Làm đề khác'}
            </button>
          </div>
        </div>

        {exercise && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Progress Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {currentExercise + 1}
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">/ {exercisesList.length}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Icons.Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {score}/{exercisesList.length}
                  </span>
                </div>
              </div>
              <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentExercise + 1) / exercisesList.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Content */}
            <div className="p-6 md:p-8">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  <Icons.Tag className="w-3 h-3" />
                  {exercise.category}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border ${exercise.difficulty === 'basic'
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200'
                  : exercise.difficulty === 'intermediate'
                    ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-200'
                    : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200'
                  }`}>
                  {exercise.difficulty === 'basic' ? 'Cơ bản' : exercise.difficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                </span>
              </div>

              {/* Question */}
              <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
                  {exercise.chapterId === '1' ? (
                    <MathProvider children={exercise.question} />
                  ) : exercise.chapterId === '2' ? (
                    <RenderWithMath content={exercise.question} />
                  ) : (
                    <RenderWithMath content={exercise.question} />
                  )}
                </h3>
              </div>

              {/* Answer Options */}
              {exercise.type === 'multiple-choice' && exercise.options ? (
                <div className="space-y-3">
                  {exercise.options.map((option, index) => {
                    const isSelected = selectedAnswer === index.toString()
                    const isCorrect = index.toString() === exercise.correctAnswer.toString()
                    const letters = ['A', 'B', 'C', 'D']

                    let buttonClass = 'group relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200 '

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
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index.toString())}
                        disabled={showResult}
                        className={buttonClass}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all ${showResult && isCorrect
                            ? 'border-green-500 bg-green-500 text-white'
                            : showResult && isSelected
                              ? 'border-red-500 bg-red-500 text-white'
                              : isSelected
                                ? 'border-indigo-500 bg-indigo-500 text-white'
                                : 'border-gray-300 text-gray-600 group-hover:border-indigo-400'
                            }`}>
                            {letters[index]}
                          </div>
                          <span className="flex-1 text-gray-800 dark:text-gray-200">
                            {exercise.chapterId === '1' ? (
                              <MathProvider children={option} />
                            ) : exercise.chapterId === '2' ? (
                              <RenderWithMath content={option} />
                            ) : (
                              <RenderWithMath content={option} />
                            )}
                          </span>
                          {showResult && isCorrect && (
                            <Icons.CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <Icons.XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : exercise.type === 'calculation' ? (
                <div className="relative">
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={(e) => handleAnswerSelect(e.target.value)}
                    disabled={showResult}
                    placeholder="Nhập kết quả tính toán của bạn..."
                    className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                  />
                  <Icons.Calculator className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              ) : null}

              {/* Result Explanation */}
              {showResult && (
                <div className={`mt-6 p-5 rounded-xl border-2 ${selectedAnswer === exercise.correctAnswer.toString()
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                  : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                  }`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {selectedAnswer === exercise.correctAnswer.toString() ? (
                        <Icons.CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Icons.XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-lg mb-2 ${selectedAnswer === exercise.correctAnswer.toString()
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                        }`}>
                        {selectedAnswer === exercise.correctAnswer.toString() ? 'Chính xác! Tuyệt vời!' : 'Chưa chính xác'}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        <strong>Giải thích:</strong> {exercise.chapterId === '1' ? (
                          <MathProvider children={exercise.explanation} />
                        ) : exercise.chapterId === '2' ? (
                          <RenderWithMath content={exercise.explanation} />
                        ) : (
                          <RenderWithMath content={exercise.explanation} />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentExercise === 0}
                  className="px-5 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all font-medium flex items-center gap-2"
                >
                  <Icons.ChevronLeft className="w-4 h-4" />
                  Câu trước
                </button>

                {!showResult ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedAnswer}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Icons.CheckCircle className="w-5 h-5" />
                    Kiểm tra câu trả lời
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    {currentExercise === exercisesList.length - 1 ? (
                      <>
                        <Icons.Trophy className="w-5 h-5" />
                        Hoàn thành bài tập
                      </>
                    ) : (
                      <>
                        Câu tiếp theo
                        <Icons.ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}