'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { useMemo } from 'react'

interface SoSanhSongChartProps {
    timeData: number[]
    displacementData: number[]
    waveHeightData: number[]
    velocityData: number[]
    energyData: number[]
    amplitude: number
    frequency: number
    wavelength: number
}

export default function SoSanhSongChart({
    timeData,
    displacementData,
    waveHeightData,
    velocityData,
    energyData,
    amplitude,
    frequency,
    wavelength
}: SoSanhSongChartProps) {
    const data = useMemo(() => {
        return timeData.map((t, i) => ({
            time: t,
            displacement: displacementData[i] ?? 0,
            waveHeight: waveHeightData[i] ?? 0,
            velocity: velocityData[i] ?? 0,
            energy: energyData[i] ?? 0
        }))
    }, [timeData, displacementData, waveHeightData, velocityData, energyData])

    const maxDisp = Math.max(...displacementData.map(Math.abs), amplitude)
    const maxWave = Math.max(...waveHeightData.map(Math.abs), amplitude)
    const maxVel = Math.max(...velocityData.map(Math.abs), amplitude * 2 * Math.PI * frequency)
    const maxEnergy = Math.max(...energyData, 1)

    const omega = 2 * Math.PI * frequency
    const vMax = amplitude * omega
    const vanTocSong = frequency * wavelength
    const chuKy = 1 / frequency

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">📈 Phân Tích So Sánh Sóng Dọc và Sóng Ngang</h3>

            {/* Thông số cơ bản */}
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Biên độ A</div>
                    <div className="font-bold text-orange-600">{amplitude.toFixed(3)} m</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Vận tốc max |v|</div>
                    <div className="font-bold text-blue-600">{vMax.toFixed(3)} m/s</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Tần số f</div>
                    <div className="font-bold text-purple-600">{frequency.toFixed(2)} Hz</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Vận tốc sóng v</div>
                    <div className="font-bold text-green-600">{vanTocSong.toFixed(2)} m/s</div>
                </div>
            </div>

            {/* So sánh sóng dọc và sóng ngang */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                        <h4 className="font-medium">Sóng dọc - Độ dịch chuyển u(t)</h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <h4 className="font-medium">Sóng ngang - Độ cao h(t)</h4>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" label={{ value: 'Thời gian (s)', position: 'insideBottom', offset: -5 }} stroke="#9ca3af" />
                        <YAxis domain={[-maxDisp * 1.2, maxDisp * 1.2]} label={{ value: 'Biên độ (m)', angle: -90, position: 'insideLeft' }} stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px' }} />
                        <Legend />
                        <Line type="monotone" dataKey="displacement" name="Sóng dọc u(t)" stroke="#f97316" dot={false} strokeWidth={2} />
                        <Line type="monotone" dataKey="waveHeight" name="Sóng ngang h(t)" stroke="#3b82f6" dot={false} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Vận tốc dao động */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <h4 className="font-medium">Vận tốc dao động v(t)</h4>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" label={{ value: 'Thời gian (s)', position: 'insideBottom', offset: -5 }} stroke="#9ca3af" />
                        <YAxis domain={[-maxVel * 1.2, maxVel * 1.2]} label={{ value: 'v (m/s)', angle: -90, position: 'insideLeft' }} stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px' }} />
                        <Line type="monotone" dataKey="velocity" stroke="#10b981" dot={false} strokeWidth={2} name="v(t)" />
                    </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2">v(t) = -Aω·sin(ωt) | v<sub>max</sub> = {vMax.toFixed(3)} m/s</p>
            </div>

            {/* Năng lượng dao động */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <h4 className="font-medium">Năng lượng dao động E(t)</h4>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" label={{ value: 'Thời gian (s)', position: 'insideBottom', offset: -5 }} stroke="#9ca3af" />
                        <YAxis domain={[0, maxEnergy * 1.2]} label={{ value: 'E (J)', angle: -90, position: 'insideLeft' }} stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="energy" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="E(t)" />
                    </AreaChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2">E = ½·m·ω²·A² (m=1kg) | E = {((amplitude * amplitude * omega * omega) / 2).toFixed(4)} J</p>
            </div>

            {/* Thông tin bổ sung */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    <span className="font-bold">📌 Lưu ý:</span> Sóng dọc có phương dao động trùng với phương truyền sóng (ví dụ: âm thanh).
                    Sóng ngang có phương dao động vuông góc với phương truyền sóng (ví dụ: sóng nước, ánh sáng).
                    Vận tốc truyền sóng hiện tại là <strong>{vanTocSong.toFixed(2)} m/s</strong>, chu kỳ <strong>{chuKy.toFixed(3)} s</strong>.
                </p>
            </div>
        </div>
    )
}