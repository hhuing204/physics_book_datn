'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import SimulationLayout from '@/components/Layouts/SimulationLayout';

// Import tất cả components từ các chapter
import * as Chapter1 from '@/components/simulator/Chapter1';
import * as Chapter2 from '@/components/simulator/Chapter2';

const chapterModules: Record<string, Record<string, any>> = {
    1: Chapter1,
    2: Chapter2,
};

export default function SimulationPage() {
    const params = useParams();
    const chapterId = params.chapterId as string;
    const simulationSlug = params.simulationSlug as string;

    const [componentName, setComponentName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/simulations/${simulationSlug}`)
            .then(res => res.json())
            .then(data => {
                setComponentName(data.simulation.componentName);
                setLoading(false);
            });
    }, [simulationSlug]);


    const Component = useMemo(() => {
        if (!componentName) return null;
        const module = chapterModules[chapterId];
        return module?.[componentName] || null;
    }, [chapterId, componentName]);

    if (loading) {
        return (
            <SimulationLayout title="Đang tải..." backPath={`/simulation/grade-11/${chapterId}`}>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            </SimulationLayout>
        );
    }

    if (!Component) {
        return (
            <SimulationLayout title="Không tìm thấy" backPath={`/simulation/grade-11/${chapterId}`}>
                <div className="text-center py-20 text-red-500">
                    Component không tồn tại
                </div>
            </SimulationLayout>
        );
    }

    return (
        <SimulationLayout title="" backPath={`/simulation/grade-11/${chapterId}`}>
            <div className="container mx-auto p-6">
                <Component />
            </div>
        </SimulationLayout>
    );
}