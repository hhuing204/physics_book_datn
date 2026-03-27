'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronRight, Home, Moon, Sun } from 'lucide-react';
import * as Icons from 'lucide-react';

interface Chapter {
    _id: string;
    chapterId: string;
    chapterNumber: number;
    title: string;
    subtitle: string;
    icon: string;
    color: { start: string; end: string };
    order: number;
    isPublished: boolean;
}

interface Simulation {
    _id: string;
    title: string;
    slug: string;
    icon: string;
    chapterId: string;
}

interface ChapterSidebarProps {
    currentChapterSlug: string | null;
    children: React.ReactNode;
    onThemeToggle?: () => void;
    theme?: 'light' | 'dark';
}

const getIcon = (iconName: string, className = "w-4 h-4") => {
    if (!iconName) return null;
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className={className} /> : null;
};

export default function ChapterSidebar({
    currentChapterSlug,
    children,
    onThemeToggle,
    theme = 'light'
}: ChapterSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [simulations, setSimulations] = useState<Simulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Debug: log data
    useEffect(() => {
        console.log('🔍 Sidebar mounted');

        // Fetch chapters
        fetch('/api/chapters')
            .then(res => {
                console.log('📡 Chapters API response status:', res.status);
                return res.json();
            })
            .then(data => {
                console.log('📚 Chapters data:', data);
                if (Array.isArray(data)) {
                    setChapters(data);
                } else if (data.chapters && Array.isArray(data.chapters)) {
                    setChapters(data.chapters);
                } else {
                    console.error('Unexpected chapters format:', data);
                    setChapters([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('❌ Error fetching chapters:', err);
                setError(err.message);
                setLoading(false);
            });

        // Fetch simulations
        fetch('/api/simulations')
            .then(res => res.json())
            .then(data => {
                console.log('🎮 Simulations data:', data);
                if (Array.isArray(data)) {
                    setSimulations(data);
                } else if (data.simulations && Array.isArray(data.simulations)) {
                    setSimulations(data.simulations);
                } else {
                    setSimulations([]);
                }
            })
            .catch(err => {
                console.error('❌ Error fetching simulations:', err);
            });
    }, []);

    // Debug: log state changes
    useEffect(() => {
        console.log('📊 State:', { chaptersCount: chapters.length, simulationsCount: simulations.length, loading, error });
    }, [chapters, simulations, loading, error]);

    const isActiveChapter = (chapterId: string) => {
        return currentChapterSlug === chapterId;
    };

    const isExpanded = isHovered;
    const sidebarWidth = isExpanded ? 'w-80' : 'w-16';

    // Hiển thị loading
    if (loading) {
        return (
            <div className="flex">
                <aside className="fixed left-0 top-0 h-full w-16 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800 z-50">
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                    </div>
                </aside>
                <main className="flex-1 ml-16">{children}</main>
            </div>
        );
    }

    // Hiển thị lỗi
    if (error) {
        console.error('Sidebar error:', error);
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 z-50 border-r border-gray-200 dark:border-gray-800 ${sidebarWidth}`}
            >
                {/* Logo / Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    {isExpanded ? (
                        <>
                            <div>
                                <div className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    Vật Lý 11
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Mô phỏng trực quan
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </>
                    ) : (
                        <div className="w-full flex justify-center">
                            <div className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                VL
                            </div>
                        </div>
                    )}
                </div>

                {/* Danh sách chapters */}
                <div className="flex-1 overflow-y-auto py-4 px-3" style={{ height: 'calc(100vh - 140px)' }}>
                    {chapters.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm py-4">
                            {isExpanded ? 'Không có dữ liệu chương' : '...'}
                        </div>
                    ) : (
                        chapters.map((chapter) => {
                            // Lấy simulations của chapter này
                            const chapterSims = simulations.filter((sim: any) => sim.chapterId === chapter.chapterId);

                            return (
                                <div key={chapter._id} className="mb-3">
                                    {/* Chapter button */}
                                    <button
                                        onClick={() => router.push(`/simulation/grade-11/${chapter.chapterId}`)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActiveChapter(chapter.chapterId)
                                            ? `bg-gradient-to-r ${chapter.color.start} ${chapter.color.end} text-white shadow-md`
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            } ${!isExpanded ? 'justify-center' : ''}`}
                                    >
                                        <div>
                                            {getIcon(chapter.icon, "w-5 h-5")}
                                        </div>
                                        {isExpanded && (
                                            <span className="text-sm font-medium flex-1 text-left truncate">
                                                {chapter.title}
                                            </span>
                                        )}
                                    </button>

                                    {/* Simulations submenu - hiển thị khi sidebar expanded */}
                                    {isExpanded && chapterSims.length > 0 && (
                                        <div className="ml-9 mt-2 space-y-1">
                                            {chapterSims.map((sim) => (
                                                <button
                                                    key={sim._id}
                                                    onClick={() => router.push(`/simulation/grade-11/${chapter.chapterId}/${sim.slug}`)}
                                                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-all ${pathname.includes(sim.slug)
                                                        ? `bg-gradient-to-r ${chapter.color.start} ${chapter.color.end} text-white`
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                >
                                                    {getIcon(sim.icon, "w-3.5 h-3.5")}
                                                    <span className="text-xs truncate flex-1">{sim.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
                    <button
                        onClick={() => router.push('/simulation')}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${!isExpanded ? 'justify-center' : ''
                            }`}
                    >
                        <Home className="w-4 h-4" />
                        {isExpanded && <span>Trang chủ</span>}
                    </button>

                    <button
                        onClick={onThemeToggle}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${!isExpanded ? 'justify-center' : ''
                            }`}
                    >
                        {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        {isExpanded && <span>{theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className={`flex-1 transition-all duration-300 ${isExpanded ? 'ml-80' : 'ml-16'}`}>
                {children}
            </main>
        </div>
    );
}