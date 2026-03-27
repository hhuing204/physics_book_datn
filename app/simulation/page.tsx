'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SimulationLayout from '@/components/Layouts/SimulationLayout';
import * as Icons from 'lucide-react';

// Định nghĩa interface cho Chapter
interface Chapter {
    _id: string;
    chapterId: string;
    chapterNumber: number;
    title: string;
    subtitle: string;
    icon: string;
    color: {
        start: string;
        end: string;
    };
    order: number;
    isPublished: boolean;
}

// Định nghĩa response từ API
interface ApiResponse {
    chapters: Chapter[];
}

const getIcon = (iconName: string) => {
    if (!iconName) return null;
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="w-8 h-8" /> : null;
};

export default function SimulationPage() {
    const router = useRouter();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/chapters')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch chapters');
                }
                return res.json();
            })
            .then((data: ApiResponse) => {
                // Kiểm tra data.chapters có phải array không
                console.log(data)
                if (data && Array.isArray(data)) {
                    setChapters(data);
                } else {
                    setChapters([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching chapters:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <SimulationLayout>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            </SimulationLayout>
        );
    }

    if (error) {
        return (
            <SimulationLayout>
                <div className="flex justify-center items-center h-96">
                    <div className="text-center text-red-500">
                        <p className="text-lg font-semibold">Lỗi tải dữ liệu</p>
                        <p className="text-sm">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </SimulationLayout>
        );
    }

    // Kiểm tra nếu không có chapters
    if (chapters.length === 0) {
        return (
            <SimulationLayout>
                <div className="flex justify-center items-center h-96">
                    <div className="text-center text-gray-500">
                        <p className="text-lg font-semibold">Chưa có dữ liệu</p>
                        <p className="text-sm">Vui lòng chạy seed data để thêm chương học</p>
                    </div>
                </div>
            </SimulationLayout>
        );
    }

    return (
        <SimulationLayout>
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Chọn chương học
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {chapters.map((chapter) => (
                        <button
                            key={chapter._id}
                            onClick={() => router.push(`/simulation/grade-11/${chapter.chapterId}`)}
                            className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-all text-left hover:scale-[1.02] transform overflow-hidden"
                        >
                            {/* Gradient background on hover */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-r ${chapter.color.start} ${chapter.color.end} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                            />

                            <div className="relative">
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${chapter.color.start} ${chapter.color.end} text-white mb-4`}>
                                    {getIcon(chapter.icon)}
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {chapter.title}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-300 mt-2">
                                    {chapter.subtitle}
                                </p>

                                <div className="mt-4 text-sm text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                                    Khám phá →
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </SimulationLayout>
    );
}