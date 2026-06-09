'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SimulationLayout from '@/components/Layouts/SimulationLayout';
import * as Icons from 'lucide-react';

// Interfaces
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
    content?: string;
    theory?: string;
}

interface Simulation {
    _id: string;
    title: string;
    description: string;
    slug: string;
    componentName: string;
    icon: string;
    color: {
        start: string;
        end: string;
    };
    defaultParams: Record<string, any>;
    order: number;
    isActive: boolean;
}

const getIcon = (iconName: string) => {
    if (!iconName) return null;
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon className="w-8 h-8" /> : null;
};

export default function ChapterPage() {
    const params = useParams();
    const router = useRouter();
    const chapterId = params.chapterId as string;

    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [simulations, setSimulations] = useState<Simulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch chapter data
        fetch(`/api/chapters?chapterId=${chapterId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch chapter');
                }
                return res.json();
            })
            .then((chapterData: Chapter) => {
                setChapter(chapterData);

                // Sau khi có chapter, fetch simulations theo chapterId
                return fetch(`/api/simulations?chapterId=${chapterData.chapterId}`);
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch simulations');
                }
                return res.json();
            })
            .then((data: { simulations: Simulation[] }) => {
                setSimulations(data.simulations || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            });
    }, [chapterId]);

    if (loading) {
        return (
            <SimulationLayout title="Đang tải..." backPath="/simulation">
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            </SimulationLayout>
        );
    }

    if (error) {
        return (
            <SimulationLayout title="Lỗi" backPath="/simulation">
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

    if (!chapter) {
        return (
            <SimulationLayout title="Không tìm thấy" backPath="/simulation">
                <div className="text-center py-20">Không tìm thấy chương học</div>
            </SimulationLayout>
        );
    }

    return (
        <SimulationLayout title={chapter.title} backPath="/simulation">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${chapter.color.start} ${chapter.color.end} bg-opacity-10 rounded-full mb-4`}>
                        {getIcon(chapter.icon)}
                        <span className="text-sm font-medium text-white">
                            Chương {chapter.chapterId}
                        </span>
                    </div>
                    <h1 className={`text-4xl font-bold bg-gradient-to-r ${chapter.color.start} ${chapter.color.end} bg-clip-text text-transparent`}>
                        {chapter.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
                        {chapter.subtitle}
                    </p>
                </div>

                {/* Grid simulations */}
                {simulations.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>Chưa có mô phỏng nào cho chương này</p>
                        <p className="text-sm mt-2">Vui lòng chạy seed data để thêm mô phỏng</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {simulations.map((sim) => (
                            <button
                                key={sim._id}
                                onClick={() => router.push(`/simulation/grade-11/${chapter.chapterId}/${sim.slug}`)}
                                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-[1.02] text-left"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${sim.color?.start || chapter.color.start} ${sim.color?.end || chapter.color.end} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-sm -z-10`} />

                                <div className="p-6">
                                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${sim.color?.start || chapter.color.start} ${sim.color?.end || chapter.color.end} text-white mb-4`}>
                                        {getIcon(sim.icon)}
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {sim.title}
                                    </h2>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        {sim.description}
                                    </p>

                                    <div className="mt-4 text-sm text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                                        Khám phá →
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </SimulationLayout>
    );
}