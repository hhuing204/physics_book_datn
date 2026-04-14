// app/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import Link from 'next/link'
import Image from 'next/image'

import {
  BookOpen,
  GraduationCap,
  ChevronRight,
  PlayCircle,
  Sparkles,
  Clock,
  Bot,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Waves,
  Zap,
  Battery,
  X,
  ChevronLeft,
  Circle,
  Trophy
} from 'lucide-react'

import { FaFacebook, FaYoutube, FaTiktok, FaGithub } from 'react-icons/fa'

// Dữ liệu các chương
const chapters = [
  {
    id: 1,
    title: 'Dao Động Cơ',
    icon: '⏰',
    iconComp: null,
    color: 'from-blue-500 to-cyan-500',
    bgGlow: 'shadow-blue-500/20',
    gif: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/small/dao_dong_tu_do_la_gi_cc0721bae7.jpg',
    description: 'Khám phá thế giới dao động qua các mô phỏng 3D sinh động',
    lessons: [
      { id: 1, title: 'Mô tả dao động', duration: '2 tiết', description: 'Tìm hiểu các đại lượng đặc trưng của dao động' },
      { id: 2, title: 'Phương trình dao động điều hoà', duration: '3 tiết', description: 'Xây dựng phương trình và các đại lượng' },
      { id: 3, title: 'Năng lượng trong dao động điều hoà', duration: '2 tiết', description: 'Động năng, thế năng và cơ năng' },
      { id: 4, title: 'Dao động tắt dần và cộng hưởng', duration: '2 tiết', description: 'Hiện tượng dao động trong thực tế' }
    ]
  },
  {
    id: 2,
    title: 'Sóng Cơ',
    icon: '🌊',
    iconComp: Waves,
    color: 'from-cyan-500 to-teal-500',
    bgGlow: 'shadow-cyan-500/20',
    gif: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format',
    description: 'Khám phá sóng cơ và các hiện tượng giao thoa, sóng dừng',
    lessons: [
      { id: 5, title: 'Sóng và Sự Truyền Sóng', duration: '2 tiết', description: 'Định nghĩa và đặc điểm của sóng cơ' },
      { id: 6, title: 'Các Đặc Trưng Vật Lý Của Sóng', duration: '3 tiết', description: 'Biên độ, chu kỳ, tần số, bước sóng' },
      { id: 7, title: 'Sóng Điện Từ', duration: '2 tiết', description: 'Sóng điện từ và ứng dụng' },
      { id: 8, title: 'Giao Thoa Sóng', duration: '2 tiết', description: 'Hiện tượng giao thoa sóng cơ' },
      { id: 9, title: 'Sóng Dừng', duration: '2 tiết', description: 'Sóng dừng trên dây và trong ống khí' }
    ]
  },
  {
    id: 3,
    title: 'Điện Trường',
    icon: '⚡',
    iconComp: Zap,
    color: 'from-yellow-500 to-orange-500',
    bgGlow: 'shadow-yellow-500/20',
    gif: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format',
    description: 'Nắm vững kiến thức về điện trường và tụ điện',
    lessons: [
      { id: 11, title: 'Định luật Coulomb', duration: '2 tiết', description: 'Tương tác giữa các điện tích điểm' },
      { id: 12, title: 'Điện trường', duration: '3 tiết', description: 'Khái niệm và tính chất điện trường' },
      { id: 13, title: 'Điện thế và thế năng điện', duration: '2 tiết', description: 'Mối liên hệ giữa điện thế và cường độ điện trường' },
      { id: 14, title: 'Tụ điện', duration: '2 tiết', description: 'Cấu tạo và nguyên lý hoạt động của tụ điện' },
      { id: 15, title: 'Năng lượng tụ điện', duration: '2 tiết', description: 'Năng lượng điện trường trong tụ điện' }
    ]
  },
  {
    id: 4,
    title: 'Dòng Điện Không Đổi',
    icon: '🧲',
    iconComp: Battery,
    color: 'from-green-500 to-emerald-500',
    bgGlow: 'shadow-green-500/20',
    gif: 'https://victory.com.vn/wp-content/uploads/2022/10/anh-huong-cua-dien-tu-truong-trong-cuoc-song-0-e1666254698782.jpg',
    description: 'Hiểu rõ về dòng điện, định luật Ohm và nguồn điện',
    lessons: [
      { id: 16, title: 'Dòng điện. Cường độ dòng điện', duration: '2 tiết', description: 'Khái niệm dòng điện và cường độ dòng điện' },
      { id: 17, title: 'Điện trở. Định luật Ohm', duration: '3 tiết', description: 'Định luật Ohm cho đoạn mạch' },
      { id: 18, title: 'Nguồn điện', duration: '2 tiết', description: 'Suất điện động và điện trở trong của nguồn' },
      { id: 19, title: 'Năng lượng điện. Công suất điện', duration: '2 tiết', description: 'Công và công suất của dòng điện' }
    ]
  }
]

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [currentChapterIndex, setCurrentChapterIndex] = useState(1) // Bắt đầu từ index 1 (sóng cơ)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [autoPlay, setAutoPlay] = useState(true)
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-play carousel
  useEffect(() => {
    if (autoPlay && selectedChapter === null) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentChapterIndex((prev) => (prev + 1) % chapters.length)
      }, 6000)
    }
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current)
      }
    }
  }, [autoPlay, selectedChapter])

  const handleStartLearning = () => {
    if (user) {
      router.push('/lesson')
    } else {
      setShowAuthModal(true)
    }
  }

  const handleAuthSuccess = () => {
    router.push('/lesson')
  }

  const nextChapter = () => {
    setCurrentChapterIndex((prev) => (prev + 1) % chapters.length)
    setAutoPlay(true)
  }

  const prevChapter = () => {
    setCurrentChapterIndex((prev) => (prev - 1 + chapters.length) % chapters.length)
    setAutoPlay(true)
  }
  // const handleChapterClick = (index: number) => {
  //   if (selectedChapter === index) {
  //     setSelectedChapter(null)
  //     setAutoPlay(true)
  //   } else {
  //     setSelectedChapter(index)
  //     setAutoPlay(false)
  //     if (autoPlayIntervalRef.current) {
  //       clearInterval(autoPlayIntervalRef.current)
  //     }
  //   }
  // }

  // const handleLessonClick = (chapterId: number, lessonId: number) => {
  //   router.push(`/lesson/${chapterId}/${lessonId}`)
  // }

  // Wheel scroll handler for snap effect
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isScrolling = false
    let currentSection = 0
    const sections = document.querySelectorAll('.snap-section')
    const totalSections = sections.length

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (isScrolling) return

      if (e.deltaY > 0 && currentSection < totalSections - 1) {
        currentSection++
        isScrolling = true
        sections[currentSection]?.scrollIntoView({ behavior: 'smooth' })
        setActiveSection(currentSection)
      } else if (e.deltaY < 0 && currentSection > 0) {
        currentSection--
        isScrolling = true
        sections[currentSection]?.scrollIntoView({ behavior: 'smooth' })
        setActiveSection(currentSection)
      }

      setTimeout(() => {
        isScrolling = false
      }, 800)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-section'))
            if (!isNaN(index)) {
              currentSection = index
              setActiveSection(index)
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    sections.forEach((section, idx) => {
      section.setAttribute('data-section', String(idx))
      observer.observe(section)
    })

    return () => {
      container.removeEventListener('wheel', handleWheel)
      observer.disconnect()
    }
  }, [mounted])

  const scrollToSection = (index: number) => {
    const sections = document.querySelectorAll('.snap-section')
    sections[index]?.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(index)
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const currentChapter = chapters[currentChapterIndex]
  const IconComponent = currentChapter.iconComp

  const sections = [
    { id: 'hero', label: 'Trang chủ' },
    { id: 'chapters', label: 'Các chương' },
    { id: 'ai', label: 'AI Tutor' },
    { id: 'footer', label: 'Liên hệ' }
  ]

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-mandatory scroll-smooth"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {/* ==================== SECTION 1: HERO ==================== */}
      <section className="snap-section relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto opacity-10 dark:opacity-5">
            <path fill="#3b82f6" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                <span>Hoàn toàn miễn phí - Dành cho học sinh & giáo viên</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Học Vật Lý 11
                </span>
                <br />
                <span className="text-gray-800 dark:text-white">trực quan với mô phỏng 3D</span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Khám phá thế giới dao động, sóng cơ, điện từ qua các mô phỏng 3D tương tác.
                Hiểu sâu, nhớ lâu, học vui.
              </p>

              <div className="flex flex-wrap gap-8 mb-8">
                <div className="group cursor-pointer">
                  <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform">50+</div>
                  <div className="text-sm text-gray-500">Bài học</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-3xl font-bold text-indigo-600 group-hover:scale-110 transition-transform">20+</div>
                  <div className="text-sm text-gray-500">Mô phỏng 3D</div>
                </div>
                <div className="group cursor-pointer">
                  <div className="text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform">500+</div>
                  <div className="text-sm text-gray-500">Bài tập</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleStartLearning}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center group"
                >
                  Bắt đầu học ngay
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  href="/simulation"
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-white font-semibold rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
                >
                  <PlayCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Xem mô phỏng
                </Link>
              </div>
            </div>

            <div className="relative animate-fade-in-up delay-200">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
                <Image
                  src="https://vnmedia2.monkeyuni.net/upload/web/storage_web/24-05-2022_17:22:59_cac-cong-thuc-vat-ly-7.jpg"
                  alt="Sách Vật lý 11"
                  width={500}
                  height={400}
                  className="w-full h-auto object-cover"
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-lg overflow-hidden shadow-xl transform rotate-6 animate-bounce-slow">
                <Image
                  src="https://i.pinimg.com/originals/13/44/cd/1344cdb8afc60644ab100307da6c3487.gif"
                  alt="Wave animation"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                  unoptimized={true}
                />
              </div>

              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-lg overflow-hidden shadow-xl transform -rotate-6 animate-float">
                <Image
                  src="https://i.pinimg.com/originals/45/49/3a/45493a4b1867313ddaca588627496ff1.gif"
                  alt="Pendulum animation"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized={true}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer">
          <ChevronDown className="w-8 h-8 text-blue-500 opacity-60" />
        </div>
      </section>

      {/* ==================== SECTION 2: CHAPTERS ==================== */}
      <section className="snap-section relative min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Các chương học
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-3 rounded-full" />
            <p className="text-gray-500 dark:text-gray-400 mt-3">
              {chapters.length} chương với đầy đủ lý thuyết và bài tập
            </p>
          </div>

          {/* Current Chapter Display - Full width layout */}
          <div className="relative max-w-5xl mx-auto">
            {/* Navigation Buttons */}
            <button
              onClick={prevChapter}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextChapter}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Chapter Content - Grid layout: Left (Lessons) | Right (Overview) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0">
                {/* LEFT SIDE - Danh sách bài học (nén khoảng cách) */}
                <div className="p-5 border-r border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Danh sách bài học
                    </h3>
                    <div className="text-xs text-gray-500">
                      {chapters[currentChapterIndex].lessons.length} bài
                    </div>
                  </div>

                  {/* Scrollable container với chiều cao cố định nhưng hiển thị đủ bài */}
                  <div className="space-y-1.5 overflow-y-auto pr-1" style={{ maxHeight: '360px' }}>
                    {chapters[currentChapterIndex].lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => router.push(`/lesson/${chapters[currentChapterIndex].id}/${lesson.id}`)}
                        className="group flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-700 w-full text-left"
                      >
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-r ${chapters[currentChapterIndex].color} flex items-center justify-center mr-2 shadow-md flex-shrink-0`}>
                          <span className="text-white font-bold text-xs">{lesson.id}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 dark:text-white text-xs group-hover:text-blue-600 transition truncate">
                            Bài {lesson.id}: {lesson.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {lesson.duration}
                          </p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition flex-shrink-0" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-center gap-3">
                    <Link
                      href={`/exercises?chapter=${chapters[currentChapterIndex].id}`}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      📝 Bài tập chương
                    </Link>
                    <Link
                      href={`/simulation/grade-11/${chapters[currentChapterIndex].id}`}
                      className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5"
                    >
                      🎮 Mô phỏng 3D
                    </Link>
                  </div>
                </div>

                {/* RIGHT SIDE - Tổng quan chương + Hình minh họa */}
                <div className="relative overflow-hidden">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={chapters[currentChapterIndex].gif}
                      alt={chapters[currentChapterIndex].title}
                      fill
                      className="object-cover"
                      unoptimized={true}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${chapters[currentChapterIndex].color} opacity-85`} />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  {/* Content */}
                  <div className="relative p-5 text-white h-full flex flex-col justify-between" style={{ minHeight: '420px' }}>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-2xl">
                          {chapters[currentChapterIndex].icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">
                            Chương {chapters[currentChapterIndex].id}
                          </h3>
                          <p className="text-white/80 text-xs">
                            {chapters[currentChapterIndex].title}
                          </p>
                        </div>
                      </div>

                      <p className="text-white/90 text-xs leading-relaxed mb-3 line-clamp-3">
                        {chapters[currentChapterIndex].id === 1 && 'Khám phá thế giới dao động cơ học, từ con lắc đơn đến dao động tắt dần và cộng hưởng.'}
                        {chapters[currentChapterIndex].id === 2 && 'Tìm hiểu về sóng cơ, sự truyền sóng, giao thoa sóng và sóng dừng trong môi trường.'}
                        {chapters[currentChapterIndex].id === 3 && 'Nắm vững kiến thức về điện trường, định luật Coulomb và năng lượng điện trường.'}
                        {chapters[currentChapterIndex].id === 4 && 'Hiểu rõ về dòng điện không đổi, định luật Ohm và công suất điện.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-base font-bold">{chapters[currentChapterIndex].lessons.length}</div>
                          <div className="text-[9px] text-white/70">BÀI HỌC</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                          <Trophy className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-base font-bold">20+</div>
                          <div className="text-[9px] text-white/70">BÀI TẬP</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-base font-bold">3D</div>
                          <div className="text-[9px] text-white/70">MÔ PHỎNG</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {chapters.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentChapterIndex(idx)
                    setAutoPlay(true)
                  }}
                  className={`transition-all duration-300 rounded-full ${currentChapterIndex === idx
                    ? `w-8 h-2 bg-gradient-to-r ${chapters[idx].color}`
                    : 'w-2 h-2 bg-gray-300 dark:bg-gray-600'
                    }`}
                />
              ))}
            </div>

            {/* Auto-play status */}
            {autoPlay && (
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur px-3 py-1.5 rounded-full whitespace-nowrap">
                {/* <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span>Tự động chuyển sau 6 giây</span> */}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3: AI ASSISTANT ==================== */}
      <section className="snap-section relative min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center text-white">
            <div className="animate-fade-in-up">
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="w-8 h-8 text-yellow-300" />
                <span className="text-yellow-300 font-semibold">AI Tutor 24/7</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Trợ lý AI thông minh</h2>
              <p className="text-white/90 text-lg mb-6">
                Hỏi bất cứ điều gì về Vật lý 11, AI sẽ giải thích chi tiết,
                hướng dẫn từng bước và gợi ý bài tập phù hợp.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Giải thích khái niệm chi tiết',
                  'Hướng dẫn giải bài tập từng bước',
                  'Phân tích lỗi sai và đề xuất ôn tập'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-yellow-300 mr-3" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/ai-tutor"
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition group"
              >
                Trò chuyện với AI
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
              </Link>
            </div>

            <div className="relative animate-fade-in-up delay-200">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://media.giphy.com/media/l0MYEqE2T6H83dHm8/giphy.gif"
                  alt="AI Assistant"
                  width={500}
                  height={400}
                  className="rounded-2xl"
                  unoptimized={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: FOOTER ==================== */}
      <section className="snap-section relative min-h-screen w-full bg-gray-900 flex items-center justify-center">
        <footer className="w-full py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                  <span className="font-bold text-xl text-white">Vật Lý 11</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Học tập miễn phí, chất lượng cao dành cho học sinh và giáo viên Việt Nam.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Học tập</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/lesson" className="hover:text-white transition">Bài học</Link></li>
                  <li><Link href="/simulation" className="hover:text-white transition">Mô phỏng 3D</Link></li>
                  <li><Link href="/exercises" className="hover:text-white transition">Bài tập</Link></li>
                  <li><Link href="/practice" className="hover:text-white transition">Luyện tập</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Về chúng tôi</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/about" className="hover:text-white transition">Giới thiệu</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition">Liên hệ</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition">Chính sách</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-4">Theo dõi</h4>
                <div className="flex space-x-3">
                  <Link href="#" className="w-10 h-10 bg-[#1877f2] rounded-lg flex items-center justify-center hover:scale-110 transition">
                    <FaFacebook className="w-5 h-5 text-white" />
                  </Link>
                  <Link href="#" className="w-10 h-10 bg-[#ff0000] rounded-lg flex items-center justify-center hover:scale-110 transition">
                    <FaYoutube className="w-5 h-5 text-white" />
                  </Link>
                  <Link href="#" className="w-10 h-10 bg-black rounded-lg flex items-center justify-center hover:scale-110 transition">
                    <FaTiktok className="w-5 h-5 text-white" />
                  </Link>
                  <Link href="#" className="w-10 h-10 bg-[#333] rounded-lg flex items-center justify-center hover:scale-110 transition">
                    <FaGithub className="w-5 h-5 text-white" />
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Mã nguồn mở - Đóng góp trên GitHub
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-gray-400 pt-8 border-t border-gray-800">
              <p>© 2025 Học Vật Lý 11 - Hoàn toàn miễn phí. Phát triển bởi cộng đồng.</p>
            </div>
          </div>
        </footer>
      </section>

      {/* Dot Navigation */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((section, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${activeSection === index
              ? 'w-8 bg-blue-500'
              : 'bg-gray-300 dark:bg-gray-600 hover:bg-blue-400'
              }`}
            aria-label={`Chuyển đến ${section.label}`}
          >
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded-lg">
              {section.label}
            </span>
          </button>
        ))}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <style jsx global>{`
        .snap-section {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-6deg); }
          50% { transform: translateY(-20px) rotate(-6deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0) rotate(6deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}