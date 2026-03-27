'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ChapterSidebar from '@/components/Layouts/ChapterSidebar';
import SimulationLayout from '@/components/Layouts/SimulationLayout';

export default function Grade11Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Xác định chapter hiện tại từ URL
    const getCurrentChapter = () => {
        if (pathname.includes('chuong-1-dao-dong')) return 'chuong-1-dao-dong';
        if (pathname.includes('chuong-2-song')) return 'chuong-2-song';
        return null;
    };

    const currentChapter = getCurrentChapter();

    // Theme toggle
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.className = newTheme;
        localStorage.setItem('physics-book-theme', newTheme);
    };

    // Load saved theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('physics-book-theme') as 'light' | 'dark' || 'light';
        setTheme(savedTheme);
        document.documentElement.className = savedTheme;
    }, []);

    // Xác định backPath cho SimulationLayout
    const getBackPath = () => {
        if (currentChapter) {
            return `/simulation/grade-11/${currentChapter}`;
        }
        return '/simulation';
    };

    // Xác định title
    const getTitle = () => {
        if (pathname.includes('chuong-1-dao-dong')) {
            if (pathname.split('/').length > 5) {
                return 'Mô phỏng';
            }
            return 'Chương 1: Dao động';
        }
        if (pathname.includes('chuong-2-song')) {
            if (pathname.split('/').length > 5) {
                return 'Mô phỏng';
            }
            return 'Chương 2: Sóng';
        }
        return 'Mô phỏng Vật lý 11';
    };

    // Xác định có hiển thị back button không
    const showBackButton = () => {
        // Nếu đang ở trang chapter (không có simulationSlug) thì không hiển thị back
        const parts = pathname.split('/');
        return parts.length > 5; // Có simulationSlug
    };

    return (
        <ChapterSidebar
            currentChapterSlug={currentChapter}
            onThemeToggle={toggleTheme}
            theme={theme}
        >
            <SimulationLayout
                title={getTitle()}
                backPath={getBackPath()}
                showBackButton={showBackButton()}
            >
                {children}
            </SimulationLayout>
        </ChapterSidebar>
    );
}