'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronRight, Home, Moon, Sun, Menu } from 'lucide-react';
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
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [simulations, setSimulations] = useState<Simulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

    // Fetch data
    useEffect(() => {
        console.log('🔍 Sidebar mounted');

        fetch('/api/chapters')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setChapters(data);
                } else if (data.chapters && Array.isArray(data.chapters)) {
                    setChapters(data.chapters);
                } else {
                    setChapters([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('❌ Error fetching chapters:', err);
                setError(err.message);
                setLoading(false);
            });

        fetch('/api/simulations')
            .then(res => res.json())
            .then(data => {
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

    // Handle mouse move for auto-show sidebar
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const threshold = 5;
            if (e.clientX <= threshold && !isHovered && !isMobileOpen) {
                setIsHovered(true);
            } else if (e.clientX > 320 && isHovered && !isMobileOpen) {
                setIsHovered(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isHovered, isMobileOpen]);

    const isActiveChapter = (chapterId: string) => {
        return currentChapterSlug === chapterId;
    };

    const isExpanded = isHovered || isMobileOpen;

    const toggleChapterExpand = (chapterId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) {
                newSet.delete(chapterId);
            } else {
                newSet.add(chapterId);
            }
            return newSet;
        });
    };

    // Hiển thị loading
    if (loading) {
        return (
            <div className="flex">
                <aside className="fixed left-0 top-0 h-full w-16 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800 z-50">
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                    </div>
                </aside>
                <main className="flex-1">{children}</main>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="fixed left-4 top-20 z-50 lg:hidden p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Sidebar - luôn ở chế độ absolute, không đẩy content */}
            <aside
                onMouseEnter={() => !isMobileOpen && setIsHovered(true)}
                onMouseLeave={() => !isMobileOpen && setIsHovered(false)}
                className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 z-50 border-r border-gray-200 dark:border-gray-800
                    ${isExpanded || isMobileOpen ? 'w-80' : 'w-16'}`}
                style={{
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {/* Hover indicator - khi sidebar thu nhỏ */}
                {!isExpanded && !isMobileOpen && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-20 bg-purple-500/50 rounded-r-full transition-all duration-200">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-10 bg-purple-500 rounded-r-full animate-pulse"></div>
                    </div>
                )}

                {/* Logo / Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    {isExpanded || isMobileOpen ? (
                        <>
                            <div>
                                <div className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    Vật Lý 11
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Mô phỏng trực quan
                                </div>
                            </div>
                            {isMobileOpen && (
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                            {!isMobileOpen && isExpanded && (
                                <ChevronRight className="w-4 h-4 text-gray-400 opacity-50" />
                            )}
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
                            {(isExpanded || isMobileOpen) ? 'Không có dữ liệu chương' : '...'}
                        </div>
                    ) : (
                        chapters.map((chapter) => {
                            const chapterSims = simulations.filter((sim: any) => sim.chapterId === chapter.chapterId);
                            const isExpandedChapter = expandedChapters.has(chapter.chapterId);
                            const isActive = isActiveChapter(chapter.chapterId);

                            return (
                                <div key={chapter._id} className="mb-2">
                                    {/* Chapter button */}
                                    <button
                                        onClick={() => router.push(`/simulation/grade-11/${chapter.chapterId}`)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative
                                            ${isActive
                                                ? `bg-gradient-to-r ${chapter.color.start} ${chapter.color.end} text-white shadow-md`
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                            }
                                            ${(!isExpanded && !isMobileOpen) ? 'justify-center' : ''}`}
                                        title={!isExpanded && !isMobileOpen ? chapter.title : undefined}
                                    >
                                        <div className={`transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            {getIcon(chapter.icon, "w-5 h-5")}
                                        </div>
                                        {(isExpanded || isMobileOpen) && (
                                            <>
                                                <span className="text-sm font-medium flex-1 text-left truncate">
                                                    {chapter.title}
                                                </span>
                                                {chapterSims.length > 0 && (
                                                    <button
                                                        onClick={(e) => toggleChapterExpand(chapter.chapterId, e)}
                                                        className={`p-1 rounded-md transition-transform ${isExpandedChapter ? 'rotate-90' : ''}`}
                                                    >
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </button>

                                    {/* Simulations submenu */}
                                    {(isExpanded || isMobileOpen) && chapterSims.length > 0 && (
                                        <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                                            {chapterSims.map((sim) => (
                                                <button
                                                    key={sim._id}
                                                    onClick={() => {
                                                        router.push(`/simulation/grade-11/${chapter.chapterId}/${sim.slug}`);
                                                        if (isMobileOpen) setIsMobileOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all group
                                                        ${pathname.includes(sim.slug)
                                                            ? `bg-gradient-to-r ${chapter.color.start} ${chapter.color.end} text-white`
                                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                >
                                                    <div className="transition-transform group-hover:scale-110">
                                                        {getIcon(sim.icon, "w-3.5 h-3.5")}
                                                    </div>
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
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800 space-y-2 bg-white dark:bg-gray-900">
                    <button
                        onClick={() => router.push('/simulation')}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition group
                            ${(!isExpanded && !isMobileOpen) ? 'justify-center' : ''}`}
                        title={!isExpanded && !isMobileOpen ? 'Trang chủ' : undefined}
                    >
                        <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
                        {(isExpanded || isMobileOpen) && <span>Trang chủ</span>}
                    </button>

                    {/* <button
                        onClick={onThemeToggle}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition group
                            ${(!isExpanded && !isMobileOpen) ? 'justify-center' : ''}`}
                        title={!isExpanded && !isMobileOpen ? (theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng') : undefined}
                    >
                        {theme === 'light' ?
                            <Moon className="w-4 h-4 transition-transform group-hover:scale-110" /> :
                            <Sun className="w-4 h-4 transition-transform group-hover:scale-110" />
                        }
                        {(isExpanded || isMobileOpen) && <span>{theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}</span>}
                    </button> */}
                </div>
            </aside>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Main content - không bị đẩy, luôn full width */}
            <main className="w-full min-h-screen">
                {children}
            </main>
        </div>
    );
}