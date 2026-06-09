// app/simulation/grade-11/[chapterId]/minitest/[simulationSlug]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SimulationLayout from '@/components/Layouts/SimulationLayout';
import SimulationMiniTest from '@/components/simulator/SimulationMiniTest';
import {
    SIMULATION_QUESTIONS,
    SIMULATION_TITLES,
    getTestCompletedKey,
    getTestScoreKey,
    PASS_THRESHOLD
} from '@/lib/simulation-constants';

export default function MiniTestPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const chapterId = params.chapterId as string;
    const simulationSlug = params.simulationSlug as string;

    const [canReturn, setCanReturn] = useState(false);
    const [scorePercent, setScorePercent] = useState<number | null>(null);

    const userRole = user?.role?.toLowerCase();
    const isTeacherOrAdmin = userRole === 'teacher' || userRole === 'admin';

    const simulationTitle = SIMULATION_TITLES[simulationSlug] || simulationSlug;
    const questions = SIMULATION_QUESTIONS[simulationSlug] || [];

    // Log khi mount
    useEffect(() => {
        console.log('📝 [MiniTest] Page mounted:', {
            simulationSlug,
            chapterId,
            isTeacherOrAdmin,
            userRole,
            questionsCount: questions.length
        });
    }, []);

    // Nếu là giáo viên/admin, redirect về simulation
    useEffect(() => {
        if (!authLoading && isTeacherOrAdmin) {
            console.log('👨‍🏫 [MiniTest] Teacher/Admin, redirecting to simulation');
            router.replace(`/simulation/grade-11/${chapterId}/${simulationSlug}`);
        }
    }, [authLoading, isTeacherOrAdmin, chapterId, simulationSlug, router]);

    // Kiểm tra đã hoàn thành chưa
    useEffect(() => {
        if (isTeacherOrAdmin) return;

        const completed = localStorage.getItem(getTestCompletedKey(simulationSlug));
        const savedScore = localStorage.getItem(getTestScoreKey(simulationSlug));

        console.log('📝 [MiniTest] Checking localStorage:', {
            completedKey: getTestCompletedKey(simulationSlug),
            completedValue: completed,
            savedScore
        });

        if (completed === 'true') {
            setCanReturn(true);
            if (savedScore) {
                setScorePercent(parseInt(savedScore));
            }
        }
    }, [simulationSlug, isTeacherOrAdmin]);

    const handleComplete = useCallback((score: number, passed: boolean) => {
        const total = questions.length;
        const percent = (score / total) * 100;

        console.log('📝 [MiniTest] handleComplete:', { score, total, percent, passed });

        if (passed && percent >= PASS_THRESHOLD) {
            const completedKey = getTestCompletedKey(simulationSlug);
            const scoreKey = getTestScoreKey(simulationSlug);

            console.log('💾 [MiniTest] Saving to localStorage:', { completedKey, scoreKey, percent });

            localStorage.setItem(completedKey, 'true');
            localStorage.setItem(scoreKey, percent.toString());

            // Verify
            const saved = localStorage.getItem(completedKey);
            console.log('✅ [MiniTest] Verification - saved value:', saved);

            setCanReturn(true);
            setScorePercent(percent);

            console.log('🔁 [MiniTest] Redirecting back to simulation...');
            router.push(`/simulation/grade-11/${chapterId}/${simulationSlug}`);
        } else {
            console.log('❌ [MiniTest] Failed to pass threshold');
            alert(`📊 Bạn đạt ${percent.toFixed(0)}%.\n\nCần đạt ${PASS_THRESHOLD}% để hoàn thành.\n\nVui lòng làm lại bài kiểm tra!`);
        }
    }, [simulationSlug, chapterId, questions.length, router]);

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (isTeacherOrAdmin) {
        return null;
    }

    if (questions.length === 0) {
        return (
            <SimulationLayout
                title="Không có kiểm tra"
                backPath={`/simulation/grade-11/${chapterId}`}
            >
                <div className="text-center py-20">
                    <div className="text-gray-400 text-6xl mb-4">📭</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Không có bài kiểm tra
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Mô phỏng {simulationTitle} không có bài kiểm tra kèm theo.
                    </p>
                    <button
                        onClick={() => router.push(`/simulation/grade-11/${chapterId}`)}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                        ← Quay lại danh sách
                    </button>
                </div>
            </SimulationLayout>
        );
    }

    if (canReturn) {
        return (
            <SimulationLayout
                title={`✅ Hoàn thành - ${simulationTitle}`}
                backPath={`/simulation/grade-11/${chapterId}`}
            >
                <div className="text-center py-20">
                    <div className="text-green-500 text-7xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Chúc mừng bạn!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Bạn đã hoàn thành bài kiểm tra cho mô phỏng
                    </p>
                    <p className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-6">
                        {simulationTitle}
                    </p>

                    {scorePercent !== null && (
                        <div className="inline-block bg-green-100 dark:bg-green-900/30 rounded-full px-6 py-2 mb-6">
                            <span className="text-green-700 dark:text-green-300 font-medium">
                                Điểm số: {scorePercent}% / {PASS_THRESHOLD}%
                            </span>
                        </div>
                    )}

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.push(`/simulation/grade-11/${chapterId}/${simulationSlug}`)}
                            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 transition"
                        >
                            🔄 Xem lại mô phỏng
                        </button>
                        <button
                            onClick={() => router.push(`/simulation/grade-11/${chapterId}`)}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                            ← Quay lại danh sách
                        </button>
                    </div>
                </div>
            </SimulationLayout>
        );
    }

    return (
        <SimulationLayout
            title={`📝 Kiểm tra - ${simulationTitle}`}
            backPath={`/simulation/grade-11/${chapterId}/${simulationSlug}`}
            showBackButton={false}
        >
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-yellow-600 dark:text-yellow-400 text-2xl">⚠️</div>
                        <div>
                            <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                                BẮT BUỘC HOÀN THÀNH
                            </p>
                            <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">
                                Bạn cần đạt tối thiểu <strong>{PASS_THRESHOLD}%</strong> để hoàn thành bài kiểm tra này.
                            </p>
                            <p className="text-yellow-600 dark:text-yellow-500 text-xs mt-2">
                                💡 Mẹo: Hãy quay lại mô phỏng, kéo thả, điều chỉnh các thanh trượt
                                và quan sát kỹ từng hiện tượng trước khi làm bài.
                            </p>
                        </div>
                    </div>
                </div>

                <SimulationMiniTest
                    simulationId={simulationSlug}
                    chapterId={chapterId}
                    questions={questions}
                    title={`📝 Kiểm tra nhanh - ${simulationTitle}`}
                    isRequired={true}
                    onComplete={handleComplete}
                />

                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push(`/simulation/grade-11/${chapterId}/${simulationSlug}`)}
                        className="text-purple-600 dark:text-purple-400 hover:underline text-sm flex items-center gap-1 mx-auto"
                    >
                        ← Quay lại mô phỏng để xem kỹ hơn
                    </button>
                </div>
            </div>
        </SimulationLayout>
    );
}