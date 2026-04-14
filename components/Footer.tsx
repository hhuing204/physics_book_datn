// components/Footer.tsx
'use client'

import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { FaFacebook, FaYoutube, FaTiktok, FaGithub } from 'react-icons/fa'

export default function Footer() {
    return (
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
                            <li><Link href="/lesson" className="hover:text-white transition">Bài học</Link></li>
                            <li><Link href="/simulation" className="hover:text-white transition">Mô phỏng 3D</Link></li>
                            <li><Link href="/exercises" className="hover:text-white transition">Bài tập</Link></li>
                            <li><Link href="/practice" className="hover:text-white transition">Luyện tập</Link></li>
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
                                href="https://facebook.com"
                                target="_blank"
                                className="w-10 h-10 bg-[#1877f2] rounded-lg flex items-center justify-center hover:bg-[#0d65d9] transition transform hover:scale-110"
                                aria-label="Facebook"
                            >
                                <FaFacebook className="w-5 h-5 text-white" />
                            </Link>
                            <Link
                                href="https://youtube.com"
                                target="_blank"
                                className="w-10 h-10 bg-[#ff0000] rounded-lg flex items-center justify-center hover:bg-[#cc0000] transition transform hover:scale-110"
                                aria-label="YouTube"
                            >
                                <FaYoutube className="w-5 h-5 text-white" />
                            </Link>
                            <Link
                                href="https://tiktok.com"
                                target="_blank"
                                className="w-10 h-10 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition transform hover:scale-110"
                                aria-label="TikTok"
                            >
                                <FaTiktok className="w-5 h-5 text-white" />
                            </Link>
                            <Link
                                href="https://github.com"
                                target="_blank"
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
    )
}