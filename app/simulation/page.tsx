// app/simulation/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import * as Icons from 'lucide-react';

// Định nghĩa interface cho Chapter
interface Chapter {
    _id: string;
    chapterId: string;
    chapterNumber: number;
    title: string;
    subtitle: string;
    icon: string;
    description?: string;
    color?: {
        start: string;
        end: string;
    };
    order: number;
    isPublished: boolean;
}

// Màu sắc mặc định cho từng chapter theo chapterId
const defaultColors: Record<string, { start: string; end: string }> = {
    '1': { start: 'from-blue-500', end: 'to-cyan-500' },
    '2': { start: 'from-cyan-500', end: 'to-teal-500' },
    '3': { start: 'from-yellow-500', end: 'to-orange-500' },
    '4': { start: 'from-green-500', end: 'to-emerald-500' },
    '5': { start: 'from-purple-500', end: 'to-pink-500' },
    '6': { start: 'from-red-500', end: 'to-rose-500' },
};

// Lấy màu sắc cho chapter, nếu không có thì dùng màu mặc định
const getChapterColor = (chapter: Chapter) => {
    if (chapter.color && chapter.color.start && chapter.color.end) {
        return chapter.color;
    }
    return defaultColors[chapter.chapterId] || { start: 'from-gray-500', end: 'to-gray-600' };
};

const getIcon = (iconName: string) => {
    if (!iconName) return null;
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="w-8 h-8" /> : null;
};

// Component cho particle background
const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            alpha: number;
        }> = [];

        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 3 + 1,
                alpha: Math.random() * 0.3 + 0.1,
            });
        }

        let animationId: number;
        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
};

// Component cho card 3D effect
const SimulationCard = ({ chapter, onClick }: { chapter: Chapter; onClick: () => void }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const colors = getChapterColor(chapter);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        setMousePosition({ x, y });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setMousePosition({ x: 0, y: 0 });
            }}
            onClick={onClick}
            className="group relative cursor-pointer"
            style={{
                transform: isHovered ? `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)` : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                transition: 'transform 0.2s ease-out'
            }}
        >
            {/* Glow effect */}
            <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${colors.start} ${colors.end} rounded-2xl blur-xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
            />

            {/* Card content */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.start} ${colors.end} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                <div className="p-6">
                    {/* Icon with animation */}
                    <div className="relative mb-4">
                        <div className={`absolute inset-0 bg-gradient-to-r ${colors.start} ${colors.end} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                        <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-r ${colors.start} ${colors.end} text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                            {getIcon(chapter.icon) || <Icons.Box className="w-8 h-8" />}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-all duration-300">
                        {chapter.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {chapter.subtitle || chapter.description || `Khám phá ${chapter.title} qua mô phỏng 3D sinh động`}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <Icons.BookOpen className="w-3 h-3" />
                            <span>Chương {chapter.chapterId}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-purple-600 dark:text-purple-400">
                            <Icons.Sparkles className="w-3 h-3" />
                            <span>3D Interactive</span>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            Khám phá ngay
                        </span>
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-600 group-hover:translate-x-1 transition-all duration-300">
                            <Icons.ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-2xl pointer-events-none" />
            </div>
        </div>
    );
};

export default function SimulationPage() {
    const router = useRouter();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/chapters')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch chapters');
                return res.json();
            })
            .then((data) => {
                console.log('API response:', data);
                // Xử lý cả 2 trường hợp: data là array hoặc data có key chapters
                let chaptersArray: Chapter[] = [];
                if (Array.isArray(data)) {
                    chaptersArray = data;
                } else if (data && Array.isArray(data.chapters)) {
                    chaptersArray = data.chapters;
                } else if (data && typeof data === 'object') {
                    // Nếu data là object nhưng không có chapters, thử lấy các giá trị
                    chaptersArray = Object.values(data).filter(item =>
                        item && typeof item === 'object' && 'chapterId' in item
                    ) as Chapter[];
                }
                setChapters(chaptersArray);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching chapters:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const filteredChapters = chapters.filter(chapter => {
        const matchesSearch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (chapter.subtitle && chapter.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Icons.Box className="w-8 h-8 text-purple-600 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-4">Đang tải mô phỏng 3D...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lỗi tải dữ liệu</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <ParticleBackground />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-800 dark:text-purple-200 text-sm font-medium mb-6">
                        <Icons.Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                        <span>Mô phỏng 3D tương tác</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Khám phá Vật Lý
                        </span>
                        <br />
                        <span className="text-gray-800 dark:text-white">qua mô phỏng 3D</span>
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Trải nghiệm các hiện tượng vật lý sinh động với đồ họa 3D tương tác.
                        Xoay, zoom, và khám phá từ mọi góc nhìn!
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-12">
                    <div className="relative">
                        <Icons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm chương học..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                            >
                                <Icons.X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats */}
                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { icon: Icons.BookOpen, label: 'Chương học', value: chapters.length, color: 'from-blue-500 to-cyan-500' },
                        { icon: Icons.Box, label: 'Mô phỏng 3D', value: `${chapters.length * 3}+`, color: 'from-purple-500 to-pink-500' },
                        { icon: Icons.Users, label: 'Học sinh', value: '10K+', color: 'from-green-500 to-emerald-500' },
                        { icon: Icons.Star, label: 'Đánh giá', value: '4.9/5', color: 'from-yellow-500 to-orange-500' }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
                            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-2`}>
                                <stat.icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div> */}

                {/* Results count */}
                {searchTerm && (
                    <div className="mb-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Tìm thấy <span className="font-bold text-purple-600">{filteredChapters.length}</span> kết quả
                        </p>
                    </div>
                )}

                {/* Chapters Grid */}
                {filteredChapters.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icons.Box className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Không tìm thấy chương học
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Vui lòng thử lại với từ khóa khác
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChapters.map((chapter) => (
                            <SimulationCard
                                key={chapter._id}
                                chapter={chapter}
                                onClick={() => router.push(`/simulation/grade-11/${chapter.chapterId}`)}
                            />
                        ))}
                    </div>
                )}

                {/* Featured Section */}
                <div className="mt-20 p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <Icons.Crown className="w-6 h-6 text-yellow-300" />
                                <span className="text-yellow-300 font-semibold">Tính năng nổi bật</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                Mô phỏng con lắc đơn 3D
                            </h3>
                            <p className="text-purple-100 max-w-md">
                                Trải nghiệm dao động điều hòa với đồ họa 3D chân thực.
                                Điều chỉnh các thông số và quan sát sự thay đổi trong thời gian thực.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/simulation')}
                            className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
                        >
                            <span>Trải nghiệm ngay</span>
                            <Icons.ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                        Tại sao nên sử dụng mô phỏng 3D?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Icons.Eye,
                                title: 'Trực quan sinh động',
                                description: 'Hình ảnh 3D chân thực giúp hình dung rõ ràng các hiện tượng vật lý'
                            },
                            {
                                icon: Icons.Hand,
                                title: 'Tương tác thực tế',
                                description: 'Xoay, zoom, điều chỉnh thông số và quan sát sự thay đổi trong thời gian thực'
                            },
                            {
                                icon: Icons.Brain,
                                title: 'Hiểu sâu nhớ lâu',
                                description: 'Kết hợp lý thuyết và thực hành giúp ghi nhớ kiến thức một cách tự nhiên'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}