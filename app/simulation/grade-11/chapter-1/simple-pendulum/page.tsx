'use client'

import PendulumSimulation3DComplete from '@/components/simulator/Chapter1/PendulumSimulation/PendulumSimulation'
import SimulationLayout from '@/components/Layouts/SimulationLayout'

export default function SimplePendulumPage() {
    return (
        <SimulationLayout
            title="Con lắc đơn - Mô phỏng Vật lý 11"
            backPath="/simulation/grade-11/chapter-1"
        >
            <div className="max-w-6xl mx-auto p-6">
                <PendulumSimulation3DComplete />
            </div>
        </SimulationLayout>
    )
}