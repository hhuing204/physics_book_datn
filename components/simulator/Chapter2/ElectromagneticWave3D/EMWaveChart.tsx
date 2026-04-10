// EMWaveChart.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'

interface EMWaveChartProps {
    timeData: number[]
    eFieldData: number[]
    bFieldData: number[]
    intensityData: number[]
    title?: string
    eAmplitude?: number
    bAmplitude?: number
    frequency?: number
    wavelength?: number
}

export default function EMWaveChart({
    timeData,
    eFieldData,
    bFieldData,
    intensityData,
    title = "Phân Tích Sóng Điện Từ",
    eAmplitude = 1.5,
    bAmplitude = 0.5,
    frequency = 0.8,
    wavelength = 3.0
}: EMWaveChartProps) {
    const data = useMemo(() => {
        return timeData.map((t, i) => ({
            time: t,
            eField: eFieldData[i] ?? 0,
            bField: bFieldData[i] ?? 0,
            intensity: intensityData[i] ?? 0
        }))
    }, [timeData, eFieldData, bFieldData, intensityData])

    const maxE = Math.max(...eFieldData.map(Math.abs), eAmplitude)
    const maxB = Math.max(...bFieldData.map(Math.abs), bAmplitude)
    const maxIntensity = Math.max(...intensityData, 1)

    // Tính tỉ lệ E/B
    const tiLeEB = eAmplitude / bAmplitude
    const tiLeChuan = 300 // c = 3e8 m/s = 300 (V/m)/(μT)

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>

            {/* Thông tin biên độ */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Biên độ E₀</div>
                    <div className="font-bold text-red-600 dark:text-red-400">{eAmplitude.toFixed(2)} V/m</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Biên độ B₀</div>
                    <div className="font-bold text-green-600 dark:text-green-400">{bAmplitude.toFixed(2)} μT</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Tỉ lệ E₀/B₀</div>
                    <div className={`font-bold ${Math.abs(tiLeEB - tiLeChuan) < 1 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {tiLeEB.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Điện trường E */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Điện trường E(t)</h4>
                    <span className="text-xs text-gray-500 ml-auto">
                        Biên độ: {eAmplitude.toFixed(2)} V/m
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="time"
                            label={{ value: 'Thời gian (s)', position: 'insideBottom', offset: -5 }}
                            stroke="#9ca3af"
                        />
                        <YAxis
                            domain={[-maxE * 1.2, maxE * 1.2]}
                            label={{ value: 'E (V/m)', angle: -90, position: 'insideLeft' }}
                            stroke="#9ca3af"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            labelStyle={{ color: '#f3f4f6' }}
                            formatter={(value: any) => [Number(value).toFixed(3), 'E (V/m)']}
                        />
                        <Line
                            type="monotone"
                            dataKey="eField"
                            stroke="#ef4444"
                            dot={false}
                            strokeWidth={2}
                            name="E"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Từ trường B */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Từ trường B(t)</h4>
                    <span className="text-xs text-gray-500 ml-auto">
                        Biên độ: {bAmplitude.toFixed(2)} μT
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="time"
                            label={{ value: 'Thời gian (s)', position: 'insideBottom', offset: -5 }}
                            stroke="#9ca3af"
                        />
                        <YAxis
                            domain={[-maxB * 1.2, maxB * 1.2]}
                            label={{ value: 'B (μT)', angle: -90, position: 'insideLeft' }}
                            stroke="#9ca3af"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            formatter={(value: any) => [Number(value).toFixed(3), 'B (μT)']}
                        />
                        <Line
                            type="monotone"
                            dataKey="bField"
                            stroke="#10b981"
                            dot={false}
                            strokeWidth={2}
                            name="B"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Cường độ sóng */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Cường độ sóng I(t)</h4>
                </div>
                <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="time"
                            label={{ value: 'Thời gian (s)', position: 'insideBottom', offset: -5 }}
                            stroke="#9ca3af"
                        />
                        <YAxis
                            domain={[0, maxIntensity * 1.2]}
                            label={{ value: 'I (W/m²)', angle: -90, position: 'insideLeft' }}
                            stroke="#9ca3af"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            formatter={(value: any) => [Number(value).toFixed(4), 'I (W/m²)']}
                        />
                        <Line
                            type="monotone"
                            dataKey="intensity"
                            stroke="#8b5cf6"
                            dot={false}
                            strokeWidth={2}
                            name="Cường độ"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* So sánh E và B (chuẩn hóa) */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">So sánh E và B (chuẩn hóa)</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="time"
                            label={{ value: 'Thời gian (s)', position: 'insideBottom', offset: -5 }}
                            stroke="#9ca3af"
                        />
                        <YAxis
                            domain={[-1.2, 1.2]}
                            label={{ value: 'Biên độ chuẩn hóa', angle: -90, position: 'insideLeft' }}
                            stroke="#9ca3af"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="eField"
                            name="E (chuẩn hóa)"
                            stroke="#ef4444"
                            dot={false}
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="bField"
                            name="B (chuẩn hóa)"
                            stroke="#10b981"
                            dot={false}
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    E và B dao động cùng pha trong sóng điện từ
                    {Math.abs(tiLeEB - tiLeChuan) < 1
                        ? " ✅ Tỉ lệ E/B ≈ c"
                        : " ⚠️ Tỉ lệ E/B khác c"}
                </p>
            </div>

            {/* Thông tin bổ sung */}
            <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Tần số</div>
                    <div className="font-bold text-blue-600 dark:text-blue-400">{frequency.toFixed(2)} Hz</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Chu kỳ</div>
                    <div className="font-bold text-purple-600 dark:text-purple-400">{(1 / frequency).toFixed(2)} s</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Bước sóng</div>
                    <div className="font-bold text-green-600 dark:text-green-400">{wavelength.toFixed(2)} m</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-500">c = E₀/B₀</div>
                    <div className={`font-bold ${Math.abs(tiLeEB - tiLeChuan) < 1 ? 'text-green-600' : 'text-orange-600'}`}>
                        {tiLeChuan}
                    </div>
                </div>
            </div>

            {/* Ghi chú về tỉ lệ E/B */}
            {Math.abs(tiLeEB - tiLeChuan) >= 1 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        <span className="font-bold">⚠️ Lưu ý:</span> Trong chân không, tỉ lệ E₀/B₀ = c ≈ 3×10⁸ m/s = 300 (V/m)/(μT).
                        Tỉ lệ hiện tại ({tiLeEB.toFixed(2)}) khác với giá trị chuẩn. Điều này có thể xảy ra trong môi trường vật chất.
                    </p>
                </div>
            )}
        </div>
    )
}