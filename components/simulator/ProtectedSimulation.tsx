// components/simulation/ProtectedSimulation.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, BookOpen, Crown, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MissingLesson {
    id: string;
    title: string;
}

interface AccessCheck {
    hasAccess: boolean;
    role?: string;
    requiresLesson?: boolean;
    missingLessons?: MissingLesson[];
    completedLessons?: string[];
    requiredLessons?: string[];
    message?: string;
    error?: string;
    requiresLogin?: boolean;
}

interface ProtectedSimulationProps {
    simulationId: string;
    chapterId: string;
    simulationName: string;
    children: React.ReactNode;
    onAccessGranted?: () => void;
    skipCheck?: boolean;  // CHỈ THÊM DÒNG NÀY
}

export default function ProtectedSimulation({
    simulationId,
    chapterId,
    simulationName,
    children,
    onAccessGranted,
    skipCheck = false  // CHỈ THÊM DÒNG NÀY
}: ProtectedSimulationProps) {
    const router = useRouter();
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const [access, setAccess] = useState<AccessCheck | null>(null);
    const [checkingAccess, setCheckingAccess] = useState(true);

    // Log để debug
    useEffect(() => {
        console.log('===== ProtectedSimulation Debug =====');
        console.log('authLoading:', authLoading);
        console.log('isAuthenticated:', isAuthenticated);
        console.log('user:', user);
        console.log('user?.role:', user?.role);
        console.log('skipCheck:', skipCheck);
        console.log('simulationId:', simulationId);
        console.log('chapterId:', chapterId);
        console.log('simulationName:', simulationName);
    }, [authLoading, isAuthenticated, user, skipCheck, simulationId, chapterId, simulationName]);

    // Lấy token từ localStorage
    const getToken = (): string | null => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            console.log('Token from localStorage:', token ? 'exists' : 'not found');
            return token;
        }
        return null;
    };

    useEffect(() => {
        // Chờ AuthContext load xong
        if (authLoading) {
            console.log('Waiting for auth to load...');
            return;
        }

        console.log('Auth loaded, isAuthenticated:', isAuthenticated);

        // Chưa đăng nhập
        if (!isAuthenticated || !user) {
            console.log('User not authenticated, showing login prompt');
            setAccess({
                hasAccess: false,
                requiresLogin: true,
                message: 'Vui lòng đăng nhập để sử dụng tính năng mô phỏng'
            });
            setCheckingAccess(false);
            return;
        }

        // NẾU skipCheck = true (dành cho giáo viên/admin), CHO PHÉP NGAY
        if (skipCheck) {
            console.log('skipCheck=true, granting access immediately');
            setAccess({
                hasAccess: true,
                role: user.role,
                message: 'Bạn có toàn quyền sử dụng simulation'
            });
            setCheckingAccess(false);
            if (onAccessGranted) onAccessGranted();
            return;
        }

        console.log('User authenticated, role:', user.role);

        // Nếu là admin hoặc teacher, cho phép ngay không cần gọi API
        if (user.role === 'admin' || user.role === 'teacher') {
            console.log('User is admin/teacher, granting access immediately');
            setAccess({
                hasAccess: true,
                role: user.role,
                message: 'Bạn có toàn quyền sử dụng simulation'
            });
            setCheckingAccess(false);
            if (onAccessGranted) onAccessGranted();
            return;
        }

        // Học sinh: gọi API kiểm tra
        const checkSimulationAccess = async () => {
            const token = getToken();
            console.log('Checking simulation access with token:', token ? 'yes' : 'no');

            if (!token) {
                console.log('No token found');
                setAccess({
                    hasAccess: false,
                    requiresLogin: true,
                    message: 'Vui lòng đăng nhập để sử dụng tính năng mô phỏng'
                });
                setCheckingAccess(false);
                return;
            }

            try {
                const url = `/api/simulations/access?simulationId=${simulationId}&chapterId=${chapterId}`;
                console.log('Calling API:', url);

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('API response status:', response.status);

                const data = await response.json();
                console.log('API response data:', data);

                setAccess(data);

                if (data.hasAccess && onAccessGranted) {
                    onAccessGranted();
                }
            } catch (error) {
                console.error('Error checking simulation access:', error);
                setAccess({
                    hasAccess: false,
                    error: 'Có lỗi xảy ra khi kiểm tra quyền truy cập'
                });
            } finally {
                setCheckingAccess(false);
            }
        };

        checkSimulationAccess();
    }, [simulationId, chapterId, user, isAuthenticated, authLoading, onAccessGranted, skipCheck]);

    if (authLoading || checkingAccess) {
        console.log('Loading state: authLoading=', authLoading, 'checkingAccess=', checkingAccess);
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    console.log('Final access state:', access);

    // Chưa đăng nhập
    if (access?.requiresLogin || !isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center p-8">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Cần đăng nhập để sử dụng
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                    Vui lòng đăng nhập để sử dụng mô phỏng {simulationName}
                </p>
                <button
                    onClick={() => {
                        localStorage.setItem('redirectAfterLogin', window.location.href);
                        router.push('/auth/signin');
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    Đăng nhập ngay
                </button>
            </div>
        );
    }

    // Admin/Teacher - đã xử lý ở trên
    if (user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'Teacher') {
        const roleName = user.role === 'admin' ? 'Quản trị viên' : 'Giáo viên';
        return (
            <div>
                <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Crown className="w-5 h-5" />
                    <span className="text-sm font-medium">
                        Quyền {roleName}: Bạn có thể sử dụng simulation mà không cần học bài trước
                    </span>
                </div>
                {children}
            </div>
        );
    }

    // Học sinh - cần học bài trước
    if (access && !access.hasAccess && access.requiresLesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                <div className="w-28 h-28 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="w-14 h-14 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Cần hoàn thành bài học trước
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                    Để sử dụng mô phỏng <span className="font-semibold text-orange-600">{simulationName}</span>,
                    bạn cần hoàn thành các bài học lý thuyết sau:
                </p>

                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-5 mb-6 text-left w-full max-w-md">
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Bài học bắt buộc:
                    </p>
                    <ul className="space-y-2">
                        {(access.requiredLessons || []).map(lessonId => {
                            const isCompleted = access.completedLessons?.includes(lessonId);
                            const lessonTitle = access.missingLessons?.find(l => l.id === lessonId)?.title || `Bài ${lessonId}`;
                            return (
                                <li key={lessonId} className="flex items-center gap-3">
                                    {isCompleted ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-orange-500" />
                                    )}
                                    <span className={`text-sm ${isCompleted ? 'text-green-600 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {lessonTitle}
                                    </span>
                                    {!isCompleted && (
                                        <span className="text-xs text-orange-500 ml-auto">Chưa hoàn thành</span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <button
                    onClick={() => router.push(`/lesson/${chapterId}`)}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <BookOpen className="w-4 h-4" />
                    Học bài ngay
                </button>

                {access.completedLessons && access.completedLessons.length > 0 && (
                    <p className="mt-4 text-sm text-gray-500">
                        Bạn đã hoàn thành {access.completedLessons.length}/{access.requiredLessons?.length || 0} bài học
                    </p>
                )}
            </div>
        );
    }

    // Có quyền truy cập
    if (access?.hasAccess) {
        return (
            <div>
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                        ✓ Bạn đã hoàn thành các bài học cần thiết
                    </span>
                </div>
                {children}
            </div>
        );
    }

    // Lỗi khác
    return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Không thể truy cập
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {access?.error || access?.message || 'Có lỗi xảy ra, vui lòng thử lại sau'}
            </p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
                Thử lại
            </button>
        </div>
    );
}