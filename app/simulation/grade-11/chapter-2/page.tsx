'use client'

import { useRouter } from 'next/navigation'
import SimulationLayout from '@/components/Layouts/SimulationLayout'

export default function Chuong2Page() {
    const router = useRouter()

    return (
        <SimulationLayout
            title="Chương 2 Sóng"
            backPath="/simulation"
        >
            <div className="max-w-4xl mx-auto p-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <button
                        onClick={() => router.push('/simulation/grade-11/chapter-2/wave')}
                        className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition text-left hover:scale-[1.02] transform"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Sóng
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Dao động Sóng.
                        </p>
                    </button>

                    {/* <button
                        onClick={() => router.push('/simulation/grade-11/chapter-1/spring-pendulum')}
                        className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition text-left hover:scale-[1.02] transform"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Con lắc lò xo
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            (Sắp triển khai)
                        </p>
                    </button> */}
                </div>
            </div>
        </SimulationLayout>
    )
}