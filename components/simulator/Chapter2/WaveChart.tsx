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
    ReferenceLine
} from 'recharts'
import {
    TrendingUp,
    Waves,
    BarChart3,
    Activity,
    GitCompare,
    Target,
    AlertCircle,
    Info,
    Gauge,
    RotateCw,
    Radio
} from 'lucide-react'

// ===== COMPONENT ĐỒ THỊ SÓNG =====
interface DoThiSongProps {
    waveData: {
        x: number;
        u: number;
        time: number;
        phase?: number;
    }[]
    interferenceData?: {
        x: number;
        u1: number;
        u2: number;
        uTotal: number;
    }[]
    standingWaveData?: {
        x: number;
        u: number;
        envelope?: number;
    }[]
    title?: string
    waveSpeed?: number
    frequency?: number
    wavelength?: number
    amplitude?: number
    waveType?: 'transverse' | 'longitudinal'
}

export default function DoThiSong({
    waveData,
    interferenceData,
    standingWaveData,
    title = "Phân Tích Sóng Cơ",
    waveSpeed = 10,
    frequency = 2,
    wavelength = 5,
    amplitude = 1,
    waveType = 'transverse'
}: DoThiSongProps) {
    // Tính toán thống kê
    const stats = useMemo(() => {
        if (waveData.length === 0) return null

        const amplitudes = waveData.map(d => Math.abs(d.u))
        const periods = []

        // Tìm chu kỳ từ dữ liệu
        let zeroCrossings: number[] = []
        for (let i = 1; i < waveData.length; i++) {
            if (waveData[i - 1].u * waveData[i].u < 0) {
                const x1 = waveData[i - 1].x
                const x2 = waveData[i].x
                const u1 = waveData[i - 1].u
                const u2 = waveData[i].u
                const xZero = x1 - u1 * (x2 - x1) / (u2 - u1)
                zeroCrossings.push(xZero)
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

        return {
            maxAmplitude: Math.max(...amplitudes),
            minAmplitude: Math.min(...amplitudes),
            wavelength: period || wavelength,
            waveSpeed: period ? period * frequency : waveSpeed,
            frequency: frequency,
            energy: 0.5 * amplitude * amplitude * frequency * frequency // Năng lượng tỉ lệ với A²f²
        }
    }, [waveData, wavelength, frequency, waveSpeed, amplitude])

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        📍 Vị trí x = <span className="text-blue-600">{label?.toFixed(2) ?? '0.00'} m</span>
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
            'u': 'Li độ sóng',
            'u1': 'Sóng 1',
            'u2': 'Sóng 2',
            'uTotal': 'Sóng tổng hợp',
            'envelope': 'Đường bao',
            'phase': 'Pha',
            'time': 'Thời gian'
        }
        return labels[dataKey] || dataKey
    }

    // Hàm định dạng giá trị
    const formatValue = (value: number, dataKey: string): string => {
        switch (dataKey) {
            case 'u':
            case 'u1':
            case 'u2':
            case 'uTotal':
            case 'envelope':
                return `${value.toFixed(3)} m`
            case 'phase':
                return `${value.toFixed(1)} rad (${(value * 180 / Math.PI).toFixed(0)}°)`
            default:
                return value.toFixed(3)
        }
    }

    // Custom legend
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

    if (waveData.length === 0) {
        return (
            <div className="h-[400px] bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-2xl flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700">
                <Waves className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4 animate-pulse" />
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Đang chờ dữ liệu sóng...
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                    Điều chỉnh các tham số để tạo sóng. Dữ liệu sẽ hiển thị ở đây.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Tiêu đề và thống kê */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        {title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {waveType === 'transverse' ? 'Sóng ngang' : 'Sóng dọc'} - Phân tích theo không gian và thời gian
                    </p>
                </div>

                {stats && (
                    <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
                            <Gauge className="w-4 h-4" />
                            λ = {stats.wavelength.toFixed(2)} m
                        </div>
                        <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
                            <Radio className="w-4 h-4" />
                            f = {stats.frequency.toFixed(2)} Hz
                        </div>
                        <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            v = {stats.waveSpeed.toFixed(2)} m/s
                        </div>
                    </div>
                )}
            </div>

            {/* Đồ thị 1: Sóng cơ bản */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="mb-5">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                        <Waves className="w-5 h-5 text-blue-600" />
                        Đồ Thị Sóng Theo Không Gian
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Biểu diễn li độ sóng u(x) tại thời điểm t
                    </p>
                </div>

                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={waveData}
                            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                                strokeOpacity={0.3}
                            />
                            <XAxis
                                dataKey="x"
                                stroke="#6b7280"
                                fontSize={12}
                                label={{
                                    value: 'Vị trí x (mét)',
                                    position: 'insideBottom',
                                    offset: -10,
                                    fill: '#6b7280',
                                    fontSize: 12
                                }}
                            />
                            <YAxis
                                stroke="#3b82f6"
                                fontSize={12}
                                label={{
                                    value: 'Li độ u (mét)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    fill: '#3b82f6',
                                    fontSize: 12
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={renderLegend} />

                            <Line
                                type="monotone"
                                dataKey="u"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 8, strokeWidth: 2 }}
                                name="u"
                            />

                            {/* Đường biên độ */}
                            <ReferenceLine y={amplitude} stroke="#10b981" strokeDasharray="3 3" />
                            <ReferenceLine y={-amplitude} stroke="#10b981" strokeDasharray="3 3" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-bold">📝 Phương trình sóng:</span> u = A cos(ωt - kx) với A = {amplitude}m, λ = {wavelength}m, f = {frequency}Hz
                    </p>
                </div>
            </div>

            {/* Đồ thị 2: Giao thoa sóng */}
            {interferenceData && interferenceData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="mb-5">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                            <GitCompare className="w-5 h-5 text-purple-600" />
                            Giao Thoa Sóng
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Hai sóng kết hợp tạo thành sóng tổng hợp
                        </p>
                    </div>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={interferenceData}
                                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                                <XAxis dataKey="x" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={renderLegend} />

                                <Line type="monotone" dataKey="u1" stroke="#f59e0b" strokeWidth={2} dot={false} name="u1" />
                                <Line type="monotone" dataKey="u2" stroke="#10b981" strokeWidth={2} dot={false} name="u2" />
                                <Line type="monotone" dataKey="uTotal" stroke="#8b5cf6" strokeWidth={3} dot={false} name="uTotal" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                            <span className="font-bold">🎯 Điều kiện:</span> Cực đại khi Δd = kλ, cực tiểu khi Δd = (k+½)λ
                        </p>
                    </div>
                </div>
            )}

            {/* Đồ thị 3: Sóng dừng */}
            {standingWaveData && standingWaveData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="mb-5">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-red-600" />
                            Sóng Dừng
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Bụng sóng và nút sóng trên dây
                        </p>
                    </div>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={standingWaveData}
                                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                                <XAxis dataKey="x" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend content={renderLegend} />

                                <Area
                                    type="monotone"
                                    dataKey="u"
                                    stroke="#ef4444"
                                    fill="#ef4444"
                                    fillOpacity={0.3}
                                    name="u"
                                />
                                {standingWaveData[0]?.envelope && (
                                    <Line
                                        type="monotone"
                                        dataKey="envelope"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        name="envelope"
                                    />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-700 dark:text-red-300">
                            <span className="font-bold">📌 Sóng dừng:</span> Bụng sóng tại vị trí biên độ cực đại, nút sóng tại vị trí biên độ bằng 0
                        </p>
                    </div>
                </div>
            )}

            {/* Bảng thông số sóng */}
            {stats && (
                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-600" />
                        Thông Số Sóng
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl">
                            <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Bước sóng λ</div>
                            <div className="text-2xl font-bold text-blue-600">{stats.wavelength.toFixed(2)} m</div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl">
                            <div className="text-sm text-green-700 dark:text-green-300 mb-1">Tần số f</div>
                            <div className="text-2xl font-bold text-green-600">{stats.frequency.toFixed(2)} Hz</div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-xl">
                            <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">Vận tốc v</div>
                            <div className="text-2xl font-bold text-purple-600">{stats.waveSpeed.toFixed(2)} m/s</div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-xl">
                            <div className="text-sm text-orange-700 dark:text-orange-300 mb-1">Năng lượng</div>
                            <div className="text-2xl font-bold text-orange-600">{stats.energy.toFixed(2)} J</div>
                        </div>
                    </div>

                    {/* Công thức sóng */}
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3">
                            📐 Công Thức Sóng Cơ
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                                <div className="font-mono text-blue-600 dark:text-blue-400 mb-1">u = A cos(ωt - kx)</div>
                                <div className="text-gray-600 dark:text-gray-400">Phương trình sóng tại điểm x</div>
                            </div>
                            <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                                <div className="font-mono text-green-600 dark:text-green-400 mb-1">v = λf = λ/T</div>
                                <div className="text-gray-600 dark:text-gray-400">Vận tốc truyền sóng</div>
                            </div>
                            <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                                <div className="font-mono text-purple-600 dark:text-purple-400 mb-1">Δφ = 2πΔx/λ</div>
                                <div className="text-gray-600 dark:text-gray-400">Độ lệch pha giữa 2 điểm</div>
                            </div>
                            <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                                <div className="font-mono text-orange-600 dark:text-orange-400 mb-1">E ∝ A²f²</div>
                                <div className="text-gray-600 dark:text-gray-400">Năng lượng sóng</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hướng dẫn */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-white mb-2">
                            🎯 Hướng Dẫn Đọc Đồ Thị Sóng
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <div>• Đồ thị u(x): Hình dạng sóng tại một thời điểm</div>
                            <div>• Khoảng cách 2 đỉnh = bước sóng λ</div>
                            <div>• Biên độ A: Độ lệch lớn nhất từ VTCB</div>
                            <div>• Giao thoa: Sóng tăng cường/triệt tiêu nhau</div>
                            <div>• Sóng dừng: Bụng (max), nút (0)</div>
                            <div>• Càng xa nguồn, biên độ càng giảm</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}