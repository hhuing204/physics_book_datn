'use client'

import { useRouter } from 'next/navigation'
import SimulationLayout from '@/components/Layouts/SimulationLayout'

export default function SimulationPage() {
    const router = useRouter()

    return (
        <SimulationLayout>
            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Chọn chương học
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <button
                        onClick={() => router.push('/simulation/grade-11/chapter-1')}
                        className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition text-left hover:scale-[1.02] transform"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Chương 1: Dao động
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Con lắc đơn, con lắc lò xo, năng lượng, dao động điều hòa.
                        </p>
                    </button>

                    {/* Thêm các chương khác ở đây */}
                    <button
                        onClick={() => router.push('/simulation/grade-11/chapter-2')}
                        className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition text-left hover:scale-[1.02] transform"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Chương 2: Sóng cơ
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Sóng cơ, Sóng kết hợp, Sóng Dừng
                        </p>
                    </button>
                </div>
            </div>
        </SimulationLayout>
    )
}