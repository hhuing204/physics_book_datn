// app/simulation/grade-11/[chapterId]/[simulationSlug]/page.tsx
'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo, Suspense, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SimulationLayout from '@/components/Layouts/SimulationLayout';
import ProtectedSimulation from '@/components/simulator/ProtectedSimulation';
import {
    SIMULATION_QUESTIONS,
    SIMULATION_TITLES,
    getTestCompletedKey,
} from '@/lib/simulation-constants';

// Import components từ các chapter
import * as Chapter1 from '@/components/simulator/Chapter1';
import * as Chapter2 from '@/components/simulator/Chapter2';

const SLUG_TO_COMPONENT: Record<string, { chapterId: string; componentName: string }> = {
    'con-lac-don': { chapterId: '1', componentName: 'PendulumSimulation' },
    'con-lac-lo-xo': { chapterId: '1', componentName: 'SpringSimulation' },
    'song-dien-tu': { chapterId: '2', componentName: 'ElectromagneticWave3D' },
    'song-doc-va-song-ngang': { chapterId: '2', componentName: 'LongitudinalWave' },
    'giao-thoa-song': { chapterId: '2', componentName: 'WaveInterferencePattern' },
    'song-tren-day': { chapterId: '2', componentName: 'WaveOnString' },
    'sonar': { chapterId: '2', componentName: 'SonarSimulation' },
    'song-co-3d': { chapterId: '2', componentName: 'WaveSimulation' },
};

const chapterModules: Record<string, Record<string, any>> = {
    '1': Chapter1,
    '2': Chapter2,
};

export default function SimulationPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();

    const chapterIdFromUrl = params.chapterId as string;
    const simulationSlug = params.simulationSlug as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAccessGranted, setIsAccessGranted] = useState(false);

    const isMinitestMode = searchParams.get('mode') === 'minitest';
    const hasRedirectedRef = useRef(false);

    const userRole = user?.role?.toLowerCase();
    const isTeacherOrAdmin = userRole === 'admin' || userRole === 'teacher';

    const simulationConfig = useMemo(() => {
        return SLUG_TO_COMPONENT[simulationSlug];
    }, [simulationSlug]);

    const Component = useMemo(() => {
        if (!simulationConfig) return null;
        const module = chapterModules[simulationConfig.chapterId];
        return module?.[simulationConfig.componentName] || null;
    }, [simulationConfig]);

    const testQuestions = useMemo(() => {
        if (isTeacherOrAdmin) return [];
        return SIMULATION_QUESTIONS[simulationSlug] || [];
    }, [simulationSlug, isTeacherOrAdmin]);

    const simulationTitle = SIMULATION_TITLES[simulationSlug] || simulationSlug;

    const hasCompletedTest = useCallback(() => {
        if (testQuestions.length === 0) return true;
        const completed = localStorage.getItem(getTestCompletedKey(simulationSlug));
        return completed === 'true';
    }, [simulationSlug, testQuestions.length]);

    const handleAccessGranted = useCallback(() => {
        console.log('✅ [Page] Access granted');
        setIsAccessGranted(true);
        setLoading(false);
    }, []);

    // Xử lý khi rời trang: nếu chưa hoàn thành test thì chuyển sang minitest
    useEffect(() => {
        if (!isAccessGranted) return;
        if (isTeacherOrAdmin) return;
        if (testQuestions.length === 0) return;
        if (hasCompletedTest()) return;
        if (isMinitestMode) return;
        if (hasRedirectedRef.current) return;

        // Lưu lại các hàm gốc
        const originalPush = router.push;
        const originalReplace = router.replace;

        // Override router.push
        router.push = (url: string, options?: any) => {
            // Kiểm tra nếu đang rời khỏi trang simulation
            const isLeaving = !url.includes(`/simulation/grade-11/${chapterIdFromUrl}/${simulationSlug}`);

            if (isLeaving && !hasCompletedTest()) {
                hasRedirectedRef.current = true;
                const minitestUrl = `/simulation/grade-11/${chapterIdFromUrl}/minitest/${simulationSlug}`;
                console.log('🚨 [Page] Leaving, redirect to minitest');
                originalPush(minitestUrl, options);
                return Promise.resolve(true);
            }

            return originalPush(url, options);
        };

        router.replace = (url: string, options?: any) => {
            const isLeaving = !url.includes(`/simulation/grade-11/${chapterIdFromUrl}/${simulationSlug}`);

            if (isLeaving && !hasCompletedTest()) {
                hasRedirectedRef.current = true;
                const minitestUrl = `/simulation/grade-11/${chapterIdFromUrl}/minitest/${simulationSlug}`;
                console.log('🚨 [Page] Leaving (replace), redirect to minitest');
                originalReplace(minitestUrl, options);
                return Promise.resolve(true);
            }

            return originalReplace(url, options);
        };

        // Cảnh báo khi đóng tab
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!hasCompletedTest()) {
                e.preventDefault();
                e.returnValue = 'Bạn chưa hoàn thành bài kiểm tra. Bạn có chắc muốn rời đi?';
                return e.returnValue;
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            router.push = originalPush;
            router.replace = originalReplace;
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isAccessGranted, isTeacherOrAdmin, testQuestions.length, hasCompletedTest, isMinitestMode, chapterIdFromUrl, simulationSlug, router]);

    // Validate simulation config
    useEffect(() => {
        if (!simulationConfig) {
            setError('Simulation không tồn tại');
            setLoading(false);
        } else {
            if (isTeacherOrAdmin) {
                setIsAccessGranted(true);
                setLoading(false);
            }
            setLoading(false);
        }
    }, [simulationConfig, isTeacherOrAdmin]);

    if (authLoading || loading) {
        return (
            <SimulationLayout title="Đang tải..." backPath={`/simulation/grade-11/${chapterIdFromUrl}`}>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            </SimulationLayout>
        );
    }

    if (error || !simulationConfig) {
        return (
            <SimulationLayout title="Không tìm thấy" backPath={`/simulation/grade-11/${chapterIdFromUrl}`}>
                <div className="text-center py-20">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Không tìm thấy mô phỏng
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Simulation "{simulationSlug}" không tồn tại
                    </p>
                    <button
                        onClick={() => router.push(`/simulation/grade-11/${chapterIdFromUrl}`)}
                        className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </SimulationLayout>
        );
    }

    if (!Component) {
        return (
            <SimulationLayout title="Đang phát triển" backPath={`/simulation/grade-11/${chapterIdFromUrl}`}>
                <div className="text-center py-20">
                    <div className="text-yellow-500 text-6xl mb-4">🚧</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Đang được phát triển
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Component {simulationConfig.componentName} chưa được export
                    </p>
                </div>
            </SimulationLayout>
        );
    }

    // Hiển thị simulation bình thường
    return (
        <SimulationLayout
            title={simulationTitle}
            backPath={`/simulation/grade-11/${simulationConfig.chapterId}`}
            showBackButton={isTeacherOrAdmin || testQuestions.length === 0 || hasCompletedTest()}
        >
            <ProtectedSimulation
                simulationId={simulationSlug}
                chapterId={simulationConfig.chapterId}
                simulationName={simulationTitle}
                onAccessGranted={handleAccessGranted}
                skipCheck={isTeacherOrAdmin}
            >
                <div className="container mx-auto p-6">
                    {/* Banner thông báo cho học sinh đã học bài nhưng chưa làm test */}
                    {!isTeacherOrAdmin && isAccessGranted && testQuestions.length > 0 && !hasCompletedTest() && (
                        <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-600 dark:text-yellow-400 text-xl">⚠️</span>
                                <span className="text-yellow-800 dark:text-yellow-300 text-sm">
                                    Bạn chưa hoàn thành bài kiểm tra. Khi rời khỏi trang này, bạn sẽ được chuyển sang làm bài kiểm tra.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Badge cho giáo viên/admin */}
                    {isTeacherOrAdmin && (
                        <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg inline-block">
                            <span className="text-blue-700 dark:text-blue-300 text-xs flex items-center gap-1">
                                👨‍🏫 Chế độ giáo viên - Không yêu cầu kiểm tra
                            </span>
                        </div>
                    )}

                    {/* Nút làm bài kiểm tra chủ động */}
                    {!isTeacherOrAdmin && isAccessGranted && testQuestions.length > 0 && !hasCompletedTest() && (
                        <div className="mb-4 flex justify-end">
                            <button
                                onClick={() => {
                                    router.push(`/simulation/grade-11/${chapterIdFromUrl}/minitest/${simulationSlug}`);
                                }}
                                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                            >
                                📝 Làm bài kiểm tra ngay
                            </button>
                        </div>
                    )}

                    <Suspense fallback={
                        <div className="flex justify-center items-center h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                        </div>
                    }>
                        <Component />
                    </Suspense>
                </div>
            </ProtectedSimulation>
        </SimulationLayout>
    );
}