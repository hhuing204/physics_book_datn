'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import UserMenu from '@/components/UserMenu'
import Link from 'next/link'
import Image from 'next/image'

import {
  BookOpen,
  GraduationCap,
  Zap,
  ChevronRight,
  PlayCircle,
  Sparkles,
  Clock,
  Bot,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react'

// Import icons for social media
import { FaFacebook, FaYoutube, FaTiktok, FaGithub } from 'react-icons/fa'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('light')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('physics-book-theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.className = savedTheme
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.className = newTheme
    localStorage.setItem('physics-book-theme', newTheme)
  }

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

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Vật Lý 11
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/lesson" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
                Bài học
              </Link>
              <Link href="/simulation" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
                Mô phỏng 3D
              </Link>
              <Link href="/exercises" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
                Bài tập
              </Link>
              <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
                Giới thiệu
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-3">
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
              <div className="flex flex-col space-y-3">
                <Link href="/lesson" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  Bài học
                </Link>
                <Link href="/simulation" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  Mô phỏng 3D
                </Link>
                <Link href="/exercises" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  Bài tập
                </Link>
                <Link href="/about" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  Giới thiệu
                </Link>
                {!user && (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg text-left"
                  >
                    Đăng nhập
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section với GIF */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"></div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto opacity-10 dark:opacity-5">
            <path fill="#3b82f6" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              {/* Badge */}
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

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mb-8">
                <div>
                  <div className="text-3xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-500">Bài học</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">20+</div>
                  <div className="text-sm text-gray-500">Mô phỏng 3D</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-500">Bài tập</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleStartLearning}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center"
                >
                  Bắt đầu học ngay
                  <ChevronRight className="w-5 h-5 ml-2" />
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

            {/* Right content - GIF Animation */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
                <Image
                  src="https://vnmedia2.monkeyuni.net/upload/web/storage_web/24-05-2022_17:22:59_cac-cong-thuc-vat-ly-7.jpg"
                  alt="Sách Vật lý 11"
                  width={500}
                  height={400}
                  className="w-full h-auto object-cover"
                  unoptimized={true} // Cho phép GIF hoạt động
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Floating GIFs */}
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
      </section>

      {/* Chapter 1: Dao Động Cơ với GIF */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Chương 1: Dao Động Cơ
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Khám phá thế giới dao động qua các mô phỏng 3D sinh động
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
            {/* Left: GIF preview */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <Image
                src="https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/small/dao_dong_tu_do_la_gi_cc0721bae7.jpg"
                alt="Pendulum simulation"
                width={800}
                height={500}
                className="w-full h-auto group-hover:scale-105 transition duration-700"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <PlayCircle className="w-5 h-5" />
                    <span className="font-semibold">Mô phỏng con lắc đơn 3D</span>
                  </div>
                  <p className="text-sm opacity-90">Kéo và thả để tương tác</p>
                </div>
              </div>
            </div>

            {/* Right: Lessons list */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-600" />
                4 bài học
              </h3>

              <div className="space-y-4">
                {[
                  { title: 'Bài 1: Mô tả dao động', icon: '📝', duration: '2 tiết', gif: 'https://hoc24.vn/images/summary/Antiqued-Chester-Wall-Clock-with-Pendulum.gif' },
                  { title: 'Bài 2: Phương trình dao động điều hoà', icon: '📐', duration: '3 tiết', gif: 'https://vatlypt.com/wp-content/uploads/dao-dong-dieu-hoa-va-chuyen-dong-tron-deu-628744-2.gif' },
                  { title: 'Bài 3: Năng lượng trong dao động', icon: '⚡', duration: '2 tiết', gif: 'https://cdn3.olm.vn/upload/img/0602/img_2025-06-02_683d0deccdbc1.jpg' },
                  { title: 'Bài 4: Dao động tắt dần và cộng hưởng', icon: '🔄', duration: '2 tiết', gif: 'https://adammuzic.vn/wp-content/uploads/2021/10/article-migration-image-sound-resonance-647x300-768x432-1.jpg' }
                ].map((lesson, index) => (
                  <Link
                    key={index}
                    href={`/lesson/${index + 1}`}
                    className="flex items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition group border border-gray-100 dark:border-gray-700"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-4">
                      <Image
                        src={lesson.gif}
                        alt={lesson.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized={true}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{lesson.title}</h4>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {lesson.duration}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                  </Link>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/exercises"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                >
                  <span>📝 25+ bài tập có lời giải chi tiết</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Chapters Grid với GIF nền */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Các chương khác</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Sóng cơ',
                icon: '🌊',
                lessons: 8,
                href: '/chuong-2',
                gif: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format',
                color: 'from-cyan-500 to-blue-500'
              },
              {
                title: 'Điện trường',
                icon: '⚡',
                lessons: 6,
                href: '/chuong-3',
                gif: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                title: 'Từ trường',
                icon: '🧲',
                lessons: 5,
                href: '/chuong-4',
                gif: 'https://victory.com.vn/wp-content/uploads/2022/10/anh-huong-cua-dien-tu-truong-trong-cuoc-song-0-e1666254698782.jpg',
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Cảm ứng điện từ',
                icon: '💡',
                lessons: 4,
                href: '/chuong-5',
                gif: 'https://cdn-media.sforum.vn/storage/app/media/giangnguyen/c%E1%BA%A3m%20%E1%BB%A9ng%20%C4%91i%E1%BB%87n%20t%E1%BB%AB%20l%C3%A0%20g%C3%AC/cam-ung-dien-tu-la-gi-thumbnail.jpg',
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Quang hình học',
                icon: '🔍',
                lessons: 7,
                href: '/chuong-6',
                gif: 'http://www.daisonec.com/upload/B%E1%BB%99%20d%E1%BB%A5ng%20c%E1%BB%A5%20V%E1%BA%ADt%20L%C3%BD%20Quang%20h%C3%ACnh%202%20Quang%20h%C3%ACnh%20th%E1%BB%B1c%20h%C3%A0nh.jpg',
                color: 'from-red-500 to-pink-500'
              }
            ].map((chapter, index) => (
              <Link
                key={index}
                href={chapter.href}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 h-64"
              >
                {/* Background GIF */}
                <div className="absolute inset-0">
                  <Image
                    src={chapter.gif}
                    alt={chapter.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    unoptimized={true}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${chapter.color} opacity-80`}></div>
                </div>

                {/* Content */}
                <div className="relative p-6 text-white h-full flex flex-col justify-end">
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-2">{chapter.icon}</span>
                    <h3 className="text-2xl font-bold">{chapter.title}</h3>
                  </div>
                  <p className="text-white/90 mb-3">{chapter.lessons} bài học</p>
                  <div className="flex items-center text-white/80 group-hover:text-white">
                    <span>Khám phá</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Preview */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center text-white">
            <div>
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
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition"
              >
                Trò chuyện với AI
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="relative">
              <Image
                src="https://media.giphy.com/media/l0MYEqE2T6H83dHm8/giphy.gif?cid=790b7611fgj86dbnl6hvn2cbs7p4kgf34mtvubw2mq0n9ifw&ep=v1_gifs_search&rid=giphy.gif&ct=g"
                alt="AI Assistant"
                width={500}
                height={400}
                className="rounded-2xl shadow-2xl"
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer với icon mạng xã hội đẹp */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-xl">Vật Lý 11</span>
              </div>
              <p className="text-gray-400 text-sm">
                Học tập miễn phí, chất lượng cao dành cho học sinh và giáo viên Việt Nam.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Học tập</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/lessons" className="hover:text-white transition">Bài học</Link></li>
                <li><Link href="/simulation" className="hover:text-white transition">Mô phỏng 3D</Link></li>
                <li><Link href="/practice" className="hover:text-white transition">Bài tập</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Về chúng tôi</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition">Giới thiệu</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Liên hệ</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Chính sách</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Theo dõi</h4>
              <div className="flex space-x-3">
                <Link
                  href="#"
                  className="w-10 h-10 bg-[#1877f2] rounded-lg flex items-center justify-center hover:bg-[#0d65d9] transition transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-[#ff0000] rounded-lg flex items-center justify-center hover:bg-[#cc0000] transition transform hover:scale-110"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition transform hover:scale-110"
                  aria-label="TikTok"
                >
                  <FaTiktok className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-[#333] rounded-lg flex items-center justify-center hover:bg-gray-600 transition transform hover:scale-110"
                  aria-label="GitHub"
                >
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Animation styles */}
      <style jsx>{`
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
      `}</style>
    </div>
  )
}