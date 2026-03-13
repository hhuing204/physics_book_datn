'use client'

import { useMemo } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    ScatterChart,
    Scatter,
    ZAxis
} from 'recharts'
import {
    TrendingUp,
    Zap,
    BarChart3,
    Activity,
    GitCompare,
    Target,
    AlertCircle,
    Info,
    Gauge,
    RotateCw
} from 'lucide-react'

// ===== COMPONENT ĐỒ THỊ CON LẮC =====
interface DoThiConLacProps {
    angleData: number[]
    velocityData: number[]
    energyData?: { dongNang: number; theNang: number; tongNangLuong: number }[]
    timeData: number[]
    title?: string
    showEnergy?: boolean
    pendulumLength?: number
    gravity?: number
    mass?: number
    pendulumType?: 'simple' | 'spring'
}

export default function DoThiConLac({
    angleData,
    velocityData,
    energyData,
    timeData,
    title = "Phân Tích Dao Động Con Lắc",
    showEnergy = true,
    pendulumLength = 2,
    gravity = 9.81,
    mass = 1,
    pendulumType
}: DoThiConLacProps) {
    // Chuẩn bị dữ liệu cho đồ thị
    const chartData = useMemo(() => {
        return timeData.map((time, index) => ({
            time: time,
            angle: angleData[index] || 0,
            velocity: velocityData[index] || 0,
            angleDeg: ((angleData[index] || 0) * 180 / Math.PI).toFixed(1),
            velocityAbs: Math.abs(velocityData[index] || 0),
            kineticEnergy: energyData?.[index]?.dongNang || 0,
            potentialEnergy: energyData?.[index]?.theNang || 0,
            totalEnergy: energyData?.[index]?.tongNangLuong || 0,
        })).filter(d => d.time !== undefined)
    }, [angleData, velocityData, energyData, timeData])

    // Tính toán thống kê
    const stats = useMemo(() => {
        if (angleData.length === 0) return null

        const angles = angleData.filter(a => a !== undefined)
        const velocities = velocityData.filter(v => v !== undefined)

        // Tính chu kỳ từ các điểm giao không
        let zeroCrossings: number[] = []
        for (let i = 1; i < angles.length; i++) {
            if (angles[i - 1] * angles[i] < 0) {
                const t1 = timeData[i - 1]
                const t2 = timeData[i]
                const a1 = angles[i - 1]
                const a2 = angles[i]
                const tZero = t1 - a1 * (t2 - t1) / (a2 - a1)
                zeroCrossings.push(tZero)
            }
        }

        let period = 0
        if (zeroCrossings.length >= 2) {
            const periods = []
            for (let i = 1; i < zeroCrossings.length; i++) {
                periods.push(zeroCrossings[i] - zeroCrossings[i - 1])
            }
            const avgHalfPeriod = periods.reduce((a, b) => a + b, 0) / periods.length
            period = avgHalfPeriod * 2
        }

        // Tính lý thuyết
        const theoreticalPeriod = 2 * Math.PI * Math.sqrt(pendulumLength / gravity)
        const theoreticalFrequency = 1 / theoreticalPeriod
        const maxTheoreticalVelocity = Math.sqrt(2 * gravity * pendulumLength * (1 - Math.cos(Math.max(...angles.map(Math.abs)))))

        return {
            maxAngle: Math.max(...angles),
            minAngle: Math.min(...angles),
            maxVelocity: Math.max(...velocities),
            minVelocity: Math.min(...velocities),
            amplitude: (Math.max(...angles) - Math.min(...angles)) / 2,
            actualPeriod: period || 0,
            theoreticalPeriod: theoreticalPeriod,
            theoreticalFrequency: theoreticalFrequency,
            angleRange: Math.max(...angles) - Math.min(...angles),
            maxTheoreticalVelocity: maxTheoreticalVelocity,
            errorPercentage: period ? Math.abs((period - theoreticalPeriod) / theoreticalPeriod * 100) : 0
        }
    }, [angleData, velocityData, timeData, pendulumLength, gravity])

    // Custom tooltip hiển thị tiếng Việt
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        ⏰ Thời gian: <span className="text-blue-600">
                            {label?.toFixed(2) ?? '0.00'} giây
                        </span>
                    </p>
                    <div className="space-y-1">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {getVietnameseLabel(entry.dataKey)}:
                                </span>
                                <span className="font-bold" style={{ color: entry.color }}>
                                    {formatValue(entry.value, entry.dataKey)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
        return null
    }

    // Hàm chuyển tên biến sang tiếng Việt
    const getVietnameseLabel = (dataKey: string): string => {
        const labels: Record<string, string> = {
            'angle': 'Góc',
            'velocity': 'Vận tốc góc',
            'angleDeg': 'Góc (độ)',
            'kineticEnergy': 'Động năng',
            'potentialEnergy': 'Thế năng',
            'totalEnergy': 'Tổng năng lượng',
            'time': 'Thời gian'
        }
        return labels[dataKey] || dataKey
    }

    // Hàm định dạng giá trị
    const formatValue = (value: number, dataKey: string): string => {
        switch (dataKey) {
            case 'angle':
                return `${value.toFixed(3)} rad (${(value * 180 / Math.PI).toFixed(1)}°)`
            case 'velocity':
                return `${value.toFixed(3)} rad/s`
            case 'kineticEnergy':
            case 'potentialEnergy':
            case 'totalEnergy':
                return `${value.toFixed(3)} J`
            case 'angleDeg':
                return `${value}°`
            default:
                return value.toFixed(3)
        }
    }

    // Custom legend tiếng Việt
    const renderLegend = (props: any) => {
        const { payload } = props
        return (
            <div className="flex flex-wrap justify-center gap-3 mt-4 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                {payload.map((entry: any, index: number) => (
                    <div
                        key={`legend-${index}`}
                        className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-full shadow-sm"
                    >
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm font-medium">
                            {getVietnameseLabel(entry.value)}
                        </span>
                    </div>
                ))}
            </div>
        )
    }

    // Nếu chưa có dữ liệu
    if (chartData.length === 0) {
        return (
            <div className="h-[400px] bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-2xl flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700">
                <Activity className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4 animate-pulse" />
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Đang chờ dữ liệu dao động...
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                    Kéo quả nặng con lắc để bắt đầu dao động. Dữ liệu sẽ hiển thị ở đây.
                </p>
                <div className="mt-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    🎯 Kéo và thả quả nặng để bắt đầu
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Tiêu đề và thống kê nhanh */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        {title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Phân tích dao động con lắc đơn theo thời gian thực
                    </p>
                </div>

                {stats && (
                    <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
                            <Gauge className="w-4 h-4" />
                            Chu kỳ: {stats.actualPeriod.toFixed(2)}s
                        </div>
                        <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Biên độ: {(stats.amplitude * 180 / Math.PI).toFixed(1)}°
                        </div>
                        <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            {chartData.length} mẫu dữ liệu
                        </div>
                    </div>
                )}
            </div>

            {/* Đồ thị 1: Góc và Vận tốc theo thời gian */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="mb-5">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                        <GitCompare className="w-5 h-5 text-blue-600" />
                        Đồ Thị Góc và Vận Tốc Theo Thời Gian
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quan hệ giữa góc lệch và vận tốc góc theo thời gian
                    </p>
                </div>

                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                                strokeOpacity={0.3}
                            />
                            <XAxis
                                dataKey="time"
                                stroke="#6b7280"
                                fontSize={12}
                                label={{
                                    value: 'Thời Gian (giây)',
                                    position: 'insideBottom',
                                    offset: -10,
                                    fill: '#6b7280',
                                    fontSize: 12
                                }}
                            />
                            <YAxis
                                yAxisId="left"
                                stroke="#3b82f6"
                                fontSize={12}
                                label={{
                                    value: 'Góc (radian)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    fill: '#3b82f6',
                                    fontSize: 12
                                }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#10b981"
                                fontSize={12}
                                label={{
                                    value: 'Vận tốc (rad/s)',
                                    angle: 90,
                                    position: 'insideRight',
                                    fill: '#10b981',
                                    fontSize: 12
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={renderLegend} />

                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="angle"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 8, strokeWidth: 2 }}
                                name="Góc"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="velocity"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={false}
                                strokeDasharray="4 2"
                                name="Vận tốc góc"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-bold">📝 Giải thích:</span> Đường màu xanh dương biểu diễn góc lệch của con lắc, đường màu xanh lá (nét đứt) biểu diễn vận tốc góc. Khi con lắc ở biên (góc lớn nhất) thì vận tốc bằng 0.
                    </p>
                </div>
            </div>

            {/* Đồ thị 2: Phân tích năng lượng */}
            {showEnergy && energyData && energyData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="mb-5">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                            Phân Tích Bảo Toàn Năng Lượng
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Sự chuyển hóa giữa động năng và thế năng trong quá trình dao động
                        </p>
                    </div>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                    strokeOpacity={0.3}
                                />
                                <XAxis
                                    dataKey="time"
                                    stroke="#6b7280"
                                    fontSize={12}
                                    label={{
                                        value: 'Thời Gian (giây)',
                                        position: 'insideBottom',
                                        offset: -10,
                                        fill: '#6b7280',
                                        fontSize: 12
                                    }}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    fontSize={12}
                                    label={{
                                        value: 'Năng Lượng (Joule)',
                                        angle: -90,
                                        position: 'insideLeft',
                                        fill: '#6b7280',
                                        fontSize: 12
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={renderLegend} />

                                <Area
                                    type="monotone"
                                    dataKey="kineticEnergy"
                                    stackId="1"
                                    stroke="#f59e0b"
                                    fill="#f59e0b"
                                    fillOpacity={0.7}
                                    strokeWidth={2}
                                    name="Động năng"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="potentialEnergy"
                                    stackId="1"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.7}
                                    strokeWidth={2}
                                    name="Thế năng"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="totalEnergy"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={false}
                                    name="Tổng năng lượng"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            <span className="font-bold">⚡ Định luật bảo toàn:</span> Tổng năng lượng (đường tím) luôn không đổi (trừ khi có ma sát). Động năng lớn nhất khi qua vị trí cân bằng, thế năng lớn nhất ở biên.
                        </p>
                    </div>
                </div>
            )}

            {/* Đồ thị 3: Không gian pha */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="mb-5">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        Không Gian Pha (Phase Space)
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quỹ đạo dao động trong không gian vận tốc - vị trí
                    </p>
                </div>

                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                                strokeOpacity={0.3}
                            />
                            <XAxis
                                type="number"
                                dataKey="angle"
                                name="Góc"
                                stroke="#3b82f6"
                                fontSize={12}
                                label={{
                                    value: 'Góc (radian)',
                                    position: 'insideBottom',
                                    offset: -10,
                                    fill: '#3b82f6',
                                    fontSize: 12
                                }}
                            />
                            <YAxis
                                type="number"
                                dataKey="velocity"
                                name="Vận tốc"
                                stroke="#10b981"
                                fontSize={12}
                                label={{
                                    value: 'Vận tốc góc (rad/s)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    fill: '#10b981',
                                    fontSize: 12
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Scatter
                                name="Quỹ đạo pha"
                                data={chartData}
                                fill="#8b5cf6"
                                fillOpacity={0.6}
                                line={{ stroke: '#8b5cf6', strokeWidth: 2 }}
                                shape="circle"
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-purple-800 dark:text-purple-300">
                        <span className="font-bold">🌀 Ý nghĩa:</span> Mỗi điểm đại diện một trạng thái (góc, vận tốc) của con lắc. Quỹ đạo hình elip thể hiện dao động tuần hoàn. Trong dao động điều hòa, đây là hình elip hoàn chỉnh.
                    </p>
                </div>
            </div>

            {/* Bảng thống kê chi tiết */}
            {stats && (
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-600" />
                        Thống Kê Chi Tiết
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Card 1: Góc lệch */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Góc Lệch</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Cực đại:</span>
                                    <span className="font-bold text-blue-600">{(stats.maxAngle * 180 / Math.PI).toFixed(1)}°</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Cực tiểu:</span>
                                    <span className="font-bold text-blue-600">{(stats.minAngle * 180 / Math.PI).toFixed(1)}°</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Biên độ:</span>
                                    <span className="font-bold text-blue-600">{(stats.amplitude * 180 / Math.PI).toFixed(1)}°</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Vận tốc */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm font-medium text-green-700 dark:text-green-300">Vận Tốc Góc</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Cực đại:</span>
                                    <span className="font-bold text-green-600">{stats.maxVelocity.toFixed(3)} rad/s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Cực tiểu:</span>
                                    <span className="font-bold text-green-600">{stats.minVelocity.toFixed(3)} rad/s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Lý thuyết max:</span>
                                    <span className="font-bold text-green-600">{stats.maxTheoreticalVelocity.toFixed(3)} rad/s</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Chu kỳ */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Chu Kỳ Dao Động</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Thực tế:</span>
                                    <span className="font-bold text-purple-600">{stats.actualPeriod.toFixed(3)} s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Lý thuyết:</span>
                                    <span className="font-bold text-purple-600">{stats.theoreticalPeriod.toFixed(3)} s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Sai số:</span>
                                    <span className={`font-bold ${stats.errorPercentage < 5 ? 'text-green-600' : 'text-orange-600'}`}>
                                        {stats.errorPercentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Tần số */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Thông Số Khác</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Tần số:</span>
                                    <span className="font-bold text-orange-600">{stats.theoreticalFrequency.toFixed(3)} Hz</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Chiều dài L:</span>
                                    <span className="font-bold text-orange-600">{pendulumLength.toFixed(2)} m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Gia tốc g:</span>
                                    <span className="font-bold text-orange-600">{gravity.toFixed(2)} m/s²</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Công thức vật lý */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3">
                            📐 Công Thức Vật Lý {pendulumType === 'spring' ? 'Con Lắc Lò Xo' : 'Con Lắc Đơn'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {pendulumType === 'spring' ? (
                                // Công thức con lắc lò xo
                                <>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                        <div className="font-mono text-blue-600 dark:text-blue-400 mb-1">T = 2π√(m/k)</div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            Chu kỳ dao động: T = 2π × căn(khối lượng / độ cứng lò xo)
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                        <div className="font-mono text-green-600 dark:text-green-400 mb-1">ω₀ = √(k/m)</div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            Tần số góc tự nhiên: ω₀ = căn(độ cứng / khối lượng)
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                        <div className="font-mono text-purple-600 dark:text-purple-400 mb-1">mx" + bx' + kx = 0</div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            Phương trình vi phân dao động có cản
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                        <div className="font-mono text-orange-600 dark:text-orange-400 mb-1">E = ½mv² + ½kx²</div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            Tổng năng lượng = Động năng + Thế năng đàn hồi
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Công thức con lắc đơn (giữ nguyên code hiện tại)
                                <>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                        <div className="font-mono text-blue-600 dark:text-blue-400 mb-1">T = 2π√(L/g)</div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            Chu kỳ dao động nhỏ: T = 2π × căn(chiều dài / gia tốc trọng trường)
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                        <div className="font-mono text-green-600 dark:text-green-400 mb-1">ω = √(g/L)</div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            Tần số góc: ω = căn(gia tốc trọng trường / chiều dài)
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                        <div className="font-mono text-purple-600 dark:text-purple-400 mb-1">θ" + (g/L)θ = 0</div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            Phương trình vi phân dao động điều hòa (góc nhỏ)
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                        <div className="font-mono text-orange-600 dark:text-orange-400 mb-1">E = ½mL²θ̇² + mgL(1-cosθ)</div>
                                        <div className="text-gray-600 dark:text-gray-400">
                                            Tổng năng lượng = Động năng + Thế năng
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer với giải thích */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                            🎯 Hướng Dẫn Đọc Đồ Thị Cho Học Sinh
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span><strong>Đồ thị 1:</strong> Quan sát sự lệch pha giữa góc và vận tốc</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <span><strong>Đồ thị 2:</strong> Năng lượng được bảo toàn khi không có ma sát</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    <span><strong>Đồ thị 3:</strong> Hình elip càng tròn càng gần dao động điều hòa</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span><strong>Biên độ lớn:</strong> Chu kỳ tăng nhẹ so với công thức lý thuyết</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}