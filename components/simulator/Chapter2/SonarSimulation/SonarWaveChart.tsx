// SonarWaveChart.tsx (đã sửa hoàn toàn lỗi TypeScript)
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'

interface SonarWaveChartProps {
    timeData: number[]
    distanceData: number[]
    strengthData: number[]
    travelTimeData: number[]
    title?: string
    currentDistance?: number
    currentStrength?: number
    speedOfSound?: number
}

// Helper function để format số an toàn
const formatNumber = (value: unknown, decimals: number = 0): string => {
    const num = Number(value)
    if (isNaN(num)) return '0'
    return num.toFixed(decimals)
}

export default function SonarWaveChart({
    timeData,
    distanceData,
    strengthData,
    travelTimeData,
    title = "Phân Tích Tín Hiệu Sonar",
    currentDistance = 150,
    currentStrength = 0.8,
    speedOfSound = 1500
}: SonarWaveChartProps) {
    const data = useMemo(() => {
        return timeData.map((t, i) => ({
            time: t,
            distance: distanceData[i] ?? 0,
            strength: strengthData[i] ?? 0,
            travelTime: travelTimeData[i] ?? 0
        }))
    }, [timeData, distanceData, strengthData, travelTimeData])

    const maxDistance = Math.max(...distanceData, currentDistance, 300)
    const maxStrength = Math.max(...strengthData, currentStrength, 1)

    // Tính tỉ lệ tín hiệu/nhiễu trung bình
    const avgStrength = strengthData.length > 0
        ? strengthData.reduce((a, b) => a + b, 0) / strengthData.length
        : currentStrength

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>

            {/* Thông số hiện tại */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Khoảng cách hiện tại</div>
                    <div className="font-bold text-orange-600 dark:text-orange-400">{currentDistance.toFixed(0)} m</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Cường độ tín hiệu</div>
                    <div className="font-bold text-green-600 dark:text-green-400">{(currentStrength * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Thời gian phản hồi</div>
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                        {((currentDistance * 2 / speedOfSound) * 1000).toFixed(1)} ms
                    </div>
                </div>
            </div>

            {/* Đồ thị khoảng cách theo thời gian */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Khoảng cách phát hiện theo thời gian</h4>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="time"
                            label={{ value: 'Thời gian (s)', position: 'insideBottom', offset: -5 }}
                            stroke="#9ca3af"
                        />
                        <YAxis
                            domain={[0, maxDistance * 1.1]}
                            label={{ value: 'Khoảng cách (m)', angle: -90, position: 'insideLeft' }}
                            stroke="#9ca3af"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            labelStyle={{ color: '#f3f4f6' }}
                            formatter={(value) => [`${formatNumber(value, 0)} m`, 'Khoảng cách']}
                        />
                        <Line
                            type="monotone"
                            dataKey="distance"
                            stroke="#f97316"
                            dot={{ r: 4, fill: '#f97316' }}
                            strokeWidth={2}
                            name="Khoảng cách"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Đồ thị cường độ tín hiệu */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Cường độ tín hiệu phản xạ (Echo)</h4>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="time"
                            label={{ value: 'Thời gian (s)', position: 'insideBottom', offset: -5 }}
                            stroke="#9ca3af"
                        />
                        <YAxis
                            domain={[0, 1.1]}
                            label={{ value: 'Cường độ (0-1)', angle: -90, position: 'insideLeft' }}
                            stroke="#9ca3af"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            formatter={(value) => {
                                const numValue = Number(value)
                                return [`${(numValue * 100).toFixed(1)}%`, 'Cường độ']
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="strength"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.3}
                            name="Cường độ"
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Cường độ trung bình: {(avgStrength * 100).toFixed(1)}%
                    {avgStrength > 0.7 ? " ✅ Tín hiệu tốt" : avgStrength > 0.4 ? " ⚠️ Tín hiệu trung bình" : " ❌ Tín hiệu yếu"}
                </p>
            </div>

            {/* Đồ thị thời gian phản hồi */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Thời gian phản hồi (Travel Time)</h4>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="time"
                            label={{ value: 'Thời gian (s)', position: 'insideBottom', offset: -5 }}
                            stroke="#9ca3af"
                        />
                        <YAxis
                            label={{ value: 'Thời gian (ms)', angle: -90, position: 'insideLeft' }}
                            stroke="#9ca3af"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            formatter={(value) => [`${formatNumber(value, 1)} ms`, 'Thời gian phản hồi']}
                        />
                        <Line
                            type="monotone"
                            dataKey="travelTime"
                            stroke="#8b5cf6"
                            dot={false}
                            strokeWidth={2}
                            name="Thời gian phản hồi"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Mối quan hệ khoảng cách - cường độ */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Mối quan hệ: Khoảng cách và Cường độ</h4>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="distance"
                            label={{ value: 'Khoảng cách (m)', position: 'insideBottom', offset: -5 }}
                            stroke="#9ca3af"
                            domain={[0, 'auto']}
                        />
                        <YAxis
                            domain={[0, 1.1]}
                            label={{ value: 'Cường độ', angle: -90, position: 'insideLeft' }}
                            stroke="#9ca3af"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            labelFormatter={(label) => `Khoảng cách: ${formatNumber(label, 0)} m`}
                            formatter={(value, name, props) => {
                                // value là giá trị của dataKey
                                // name là tên của series (từ prop name của Line)
                                const numValue = Number(value)
                                if (name === 'Cường độ tín hiệu') {
                                    return [`${(numValue * 100).toFixed(1)}%`, name]
                                }
                                return [`${numValue.toFixed(0)} m`, name]
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="strength"
                            stroke="#10b981"
                            dot={{ r: 3 }}
                            name="Cường độ tín hiệu"
                        />
                        <Line
                            type="monotone"
                            dataKey="distance"
                            stroke="#f97316"
                            dot={{ r: 3 }}
                            name="Khoảng cách"
                        />
                    </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Cường độ tín hiệu giảm khi khoảng cách tăng do sự suy hao sóng âm trong môi trường nước.
                    Công thức suy hao: I ∝ 1/d² (tổn hao hình học)
                </p>
            </div>

            {/* Thông số kỹ thuật */}
            <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Vận tốc âm thanh</div>
                    <div className="font-bold text-cyan-600 dark:text-cyan-400">{speedOfSound} m/s</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Số lần phát hiện</div>
                    <div className="font-bold text-purple-600 dark:text-purple-400">{data.length}</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Tầm xa tối đa</div>
                    <div className="font-bold text-yellow-600 dark:text-yellow-400">~{Math.max(...distanceData, 300).toFixed(0)} m</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Tỉ lệ phát hiện</div>
                    <div className="font-bold text-red-600 dark:text-red-400">
                        {data.length > 0 ? ((data.filter(d => d.strength > 0.3).length / data.length) * 100).toFixed(0) : 0}%
                    </div>
                </div>
            </div>

            {/* Cảnh báo */}
            {avgStrength < 0.4 && data.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-bold">⚠️ Cảnh báo:</span>
                        Cường độ tín hiệu thấp. Có thể do khoảng cách quá xa, vật thể nhỏ, hoặc nhiễu môi trường.
                        Hãy thử tăng cường độ tín hiệu hoặc giảm khoảng cách.
                    </p>
                </div>
            )}
        </div>
    )
}