// app/about/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    GraduationCap,
    Users,
    Rocket,
    Heart,
    Target,
    Globe,
    BookOpen,
    Sparkles,
    ChevronRight,
    Mail,
    Github,
    Facebook,
    Youtube,
    Trophy,
    Zap,
    Shield,
    Code,
    Award,
    Clock,
    Star,
    ThumbsUp
} from 'lucide-react'

export default function AboutPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"></div>

                {/* Decorative circles */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                            <span>Giới thiệu về chúng tôi</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Học Vật Lý 11
                            </span>
                            <br />
                            <span className="text-gray-800 dark:text-white">Miễn phí cho mọi người</span>
                        </h1>

                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            Chúng tôi tin rằng giáo dục chất lượng cao cần được tiếp cận miễn phí cho tất cả mọi người.
                            Vật Lý 11 là nền tảng học tập trực quan, kết hợp mô phỏng 3D và AI để giúp học sinh hiểu sâu, nhớ lâu.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sứ mệnh & Tầm nhìn */}
            <section className="py-16 bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Target className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Sứ mệnh
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Mang đến nền tảng học Vật Lý 11 trực quan, sinh động và hoàn toàn miễn phí,
                                giúp học sinh Việt Nam tiếp cận kiến thức một cách dễ dàng và hiệu quả.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-100 dark:border-purple-800">
                            <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <Rocket className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Tầm nhìn
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Trở thành nền tảng học tập trực tuyến hàng đầu cho môn Vật Lý tại Việt Nam,
                                ứng dụng công nghệ hiện đại để cách mạng hóa việc học tập.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Giá trị cốt lõi */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Giá trị cốt lõi
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Những nguyên tắc định hướng mọi hoạt động của chúng tôi
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Heart,
                                title: 'Tận tâm',
                                description: 'Đặt học sinh làm trung tâm, luôn lắng nghe và cải thiện',
                                color: 'text-red-500',
                                bg: 'bg-red-100 dark:bg-red-900/20'
                            },
                            {
                                icon: Zap,
                                title: 'Sáng tạo',
                                description: 'Ứng dụng công nghệ mới để tạo trải nghiệm học tập độc đáo',
                                color: 'text-yellow-500',
                                bg: 'bg-yellow-100 dark:bg-yellow-900/20'
                            },
                            {
                                icon: Shield,
                                title: 'Chất lượng',
                                description: 'Nội dung được xây dựng bởi đội ngũ chuyên môn cao',
                                color: 'text-green-500',
                                bg: 'bg-green-100 dark:bg-green-900/20'
                            }
                        ].map((value, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                                <div className={`w-14 h-14 ${value.bg} rounded-xl flex items-center justify-center mb-4`}>
                                    <value.icon className={`w-7 h-7 ${value.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tính năng nổi bật */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Tính năng nổi bật
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Những công cụ giúp việc học Vật Lý trở nên thú vị hơn
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: BookOpen,
                                title: 'Bài học chi tiết',
                                description: 'Lý thuyết được trình bày rõ ràng, dễ hiểu với hình ảnh minh họa',
                                color: 'from-blue-500 to-cyan-500'
                            },
                            {
                                icon: Globe,
                                title: 'Mô phỏng 3D',
                                description: 'Trực quan hóa các hiện tượng vật lý khó hiểu',
                                color: 'from-purple-500 to-pink-500'
                            },
                            {
                                icon: Sparkles,
                                title: 'AI Tutor',
                                description: 'Trợ lý ảo giải đáp thắc mắc 24/7',
                                color: 'from-yellow-500 to-orange-500'
                            },
                            {
                                icon: Trophy,
                                title: 'Bài tập đa dạng',
                                description: '500+ câu hỏi có lời giải chi tiết',
                                color: 'from-green-500 to-emerald-500'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Thống kê */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center text-white">
                        {[
                            { number: '50+', label: 'Bài học', icon: BookOpen },
                            { number: '20+', label: 'Mô phỏng 3D', icon: Globe },
                            { number: '500+', label: 'Bài tập', icon: Trophy },
                            { number: '10K+', label: 'Học sinh', icon: Users }
                        ].map((stat, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-center">
                                    <stat.icon className="w-8 h-8 opacity-80" />
                                </div>
                                <div className="text-4xl font-bold">{stat.number}</div>
                                <div className="text-blue-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Đội ngũ */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Đội ngũ phát triển
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Những người đứng sau thành công của dự án
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Mai Hoàng Huynh',
                                role: 'Project Manager & Fullstack Developer',
                                description: 'Chịu trách nhiệm tổng thể dự án, phát triển kiến trúc và tính năng chính.',
                                avatar: '👨‍💻'
                            },
                            {
                                name: 'Nguyễn Tuấn Khanh',
                                role: 'Content Creator & Physics Expert',
                                description: 'Biên soạn nội dung bài học, đảm bảo tính chính xác và phù hợp với chương trình.',
                                avatar: '👩‍🏫'
                            }
                        ].map((member, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center text-4xl">
                                    {member.avatar}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {member.name}
                                </h3>
                                <p className="text-blue-600 dark:text-blue-400 text-sm mb-3">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Công nghệ sử dụng */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Công nghệ sử dụng
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Những công nghệ hiện đại tạo nên nền tảng
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { name: 'Next.js 14', icon: '▲' },
                            { name: 'React', icon: '⚛️' },
                            { name: 'TypeScript', icon: '📘' },
                            { name: 'Tailwind CSS', icon: '🎨' },
                            { name: 'Three.js', icon: '🎬' },
                            { name: 'MongoDB', icon: '🍃' },
                            { name: 'OpenAI API', icon: '🤖' },
                            { name: 'MathJax', icon: '📐' }
                        ].map((tech, index) => (
                            <div key={index} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 font-medium">
                                <span className="mr-2">{tech.icon}</span>
                                {tech.name}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lộ trình phát triển */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Lộ trình phát triển
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Những tính năng sẽ được ra mắt trong tương lai
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                phase: 'Phase 1 - Hiện tại',
                                items: [
                                    '✓ 4 chương học đầy đủ',
                                    '✓ Mô phỏng 3D cơ bản',
                                    '✓ 500+ bài tập',
                                    '✓ AI Tutor cơ bản'
                                ],
                                color: 'border-green-500'
                            },
                            {
                                phase: 'Phase 2 - Sắp ra mắt',
                                items: [
                                    '🔄 Mở rộng lên 4 chương',
                                    '🔄 Tương tác thực tế ảo',
                                    '🔄 Bảng xếp hạng học tập',
                                    '🔄 Chứng chỉ hoàn thành'
                                ],
                                color: 'border-yellow-500'
                            },
                            {
                                phase: 'Phase 3 - Tương lai',
                                items: [
                                    '⏳ App mobile chính thức',
                                    '⏳ Học offline',
                                    '⏳ Lộ trình cá nhân hóa',
                                    '⏳ Cộng đồng thảo luận'
                                ],
                                color: 'border-purple-500'
                            }
                        ].map((phase, index) => (
                            <div key={index} className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-l-4 ${phase.color}`}>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    {phase.phase}
                                </h3>
                                <ul className="space-y-2">
                                    {phase.items.map((item, i) => (
                                        <li key={i} className="text-gray-600 dark:text-gray-300">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Bắt đầu hành trình học tập ngay hôm nay
                        </h2>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                            Hoàn toàn miễn phí - Không cần thẻ tín dụng
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/lesson"
                                className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition"
                            >
                                Bắt đầu học ngay
                            </Link>
                            <Link
                                href="/simulation"
                                className="px-8 py-3 bg-blue-500/30 backdrop-blur rounded-xl font-semibold hover:bg-blue-500/40 transition"
                            >
                                Xem mô phỏng
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}