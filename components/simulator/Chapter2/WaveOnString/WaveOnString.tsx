// WaveOnString.tsx
'use client'

import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import {
    Play,
    Pause,
    RotateCcw,
    Settings,
    Eye,
    EyeOff,
    Maximize2,
    Minimize2,
    Activity,
    Gauge,
    Ruler,
    Waves,
    Target,
    Zap,
    Move,
    Clock,
    Info,
    AlertCircle,
    GitCompare,
    BarChart3,
    Radio
} from 'lucide-react'

// ===== COMPONENT CHÍNH: SÓNG TRÊN DÂY =====
export default function WaveOnString() {
    // ===== STATE =====
    const [dangChay, setDangChay] = useState(true)
    const [toanManHinh, setToanManHinh] = useState(false)
    const [tabHienTai, setTabHienTai] = useState('dieuKhien')
    const [hienThiNangLuong, setHienThiNangLuong] = useState(true)
    const [hienThiVanToc, setHienThiVanToc] = useState(true)
    const [hienThiSóngPhanXa, setHienThiSóngPhanXa] = useState(true)

    // Thông số sóng
    const [amplitude, setAmplitude] = useState(0.5)        // Biên độ (đơn vị chuẩn hóa)
    const [frequency, setFrequency] = useState(1.5)         // Tần số (Hz)
    const [wavelength, setWavelength] = useState(2.0)       // Bước sóng (m)
    const [tension, setTension] = useState(1.0)             // Lực căng dây (N)
    const [linearDensity, setLinearDensity] = useState(0.1) // Mật độ khối lượng dài (kg/m)
    const [damping, setDamping] = useState(0.02)            // Hệ số tắt dần
    const [phase, setPhase] = useState(0)                   // Pha ban đầu (rad)

    // Chế độ sóng
    const [waveMode, setWaveMode] = useState<'continuous' | 'pulse'>('continuous')
    const [boundaryCondition, setBoundaryCondition] = useState<'fixed' | 'free' | 'absorbing'>('fixed')
    const [excitationType, setExcitationType] = useState<'harmonic' | 'impulse' | 'manual'>('harmonic')

    // Dữ liệu thời gian thực
    const [time, setTime] = useState(0)
    const [tocDoThoiGian, setTocDoThoiGian] = useState(1.0)
    const [pulseTrigger, setPulseTrigger] = useState(0)
    const [pulsePosition, setPulsePosition] = useState(0)
    const [pulseWidth, setPulseWidth] = useState(0.5)

    // Dữ liệu lịch sử cho đồ thị
    const [lichSuT, setLichSuT] = useState<number[]>([])
    const [lichSuAmplitude, setLichSuAmplitude] = useState<number[]>([])
    const [lichSuNangLuong, setLichSuNangLuong] = useState<number[]>([])
    const [lichSuVanToc, setLichSuVanToc] = useState<number[]>([])

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const animationFrameRef = useRef<number>()

    // Kích thước canvas
    const [dimensions, setDimensions] = useState({ width: 900, height: 400 })

    // ===== TÍNH TOÁN VẬT LÝ =====
    const tinhToanVatLy = useMemo(() => {
        const T = tension
        const mu = linearDensity
        const vanTocSong = Math.sqrt(T / mu)  // v = √(T/μ)
        const omega = 2 * Math.PI * frequency
        const k = omega / vanTocSong
        const lambda = 2 * Math.PI / k
        const chuKy = 1 / frequency
        const troKhang = Math.sqrt(T * mu)  // Z = √(T·μ)

        // Hệ số phản xạ
        let heSoPhanXa = 0
        if (boundaryCondition === 'fixed') heSoPhanXa = -1
        else if (boundaryCondition === 'free') heSoPhanXa = 1
        else heSoPhanXa = 0

        // Năng lượng sóng
        const matDoNangLuong = 0.5 * mu * omega * omega * amplitude * amplitude
        const congSuatTruyen = matDoNangLuong * vanTocSong

        return {
            vanTocSong,
            omega,
            k,
            lambda,
            chuKy,
            troKhang,
            heSoPhanXa,
            matDoNangLuong,
            congSuatTruyen
        }
    }, [tension, linearDensity, frequency, amplitude, boundaryCondition])

    // ===== CẬP NHẬT KÍCH THƯỚC CANVAS =====
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const width = containerRef.current.clientWidth
                const height = Math.min(400, width * 0.5)
                setDimensions({ width, height })
            }
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    // ===== ANIMATION LOOP =====
    useEffect(() => {
        if (!dangChay) return

        let lastTime = performance.now()

        const animate = (currentTime: number) => {
            const deltaTime = (currentTime - lastTime) * 0.001 * tocDoThoiGian
            lastTime = currentTime

            setTime(t => t + deltaTime)

            // Cập nhật vị trí xung
            if (waveMode === 'pulse' && pulseTrigger > 0) {
                setPulsePosition(p => p + tinhToanVatLy.vanTocSong * deltaTime)
            }

            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [dangChay, tocDoThoiGian, tinhToanVatLy.vanTocSong, waveMode, pulseTrigger])

    // ===== CẬP NHẬT DỮ LIỆU LỊCH SỬ =====
    useEffect(() => {
        if (!dangChay) return

        const x = 0.5 // Đo tại giữa dây
        const { omega, k, vanTocSong } = tinhToanVatLy

        // Tính li độ
        let u = 0
        if (excitationType === 'harmonic') {
            u = amplitude * Math.cos(omega * time - k * x * 10 + phase)
            u *= Math.exp(-damping * time)
        }

        // Năng lượng tức thời
        const dongNang = 0.5 * linearDensity * Math.pow(amplitude * omega * Math.sin(omega * time), 2)
        const theNang = 0.5 * tension * Math.pow(k * amplitude * Math.sin(omega * time), 2)
        const nangLuong = dongNang + theNang

        const maxSamples = 500
        setLichSuT(h => [...h.slice(-maxSamples), time])
        setLichSuAmplitude(h => [...h.slice(-maxSamples), u])
        setLichSuNangLuong(h => [...h.slice(-maxSamples), nangLuong])
        setLichSuVanToc(h => [...h.slice(-maxSamples), vanTocSong])
    }, [time, dangChay, amplitude, frequency, phase, damping, linearDensity, tension, tinhToanVatLy, excitationType])

    // ===== HÀM TÍNH LI ĐỘ SÓNG =====
    const calculateDisplacement = useCallback((x: number, t: number): number => {
        const { vanTocSong, omega, k, heSoPhanXa } = tinhToanVatLy
        const L = 10 // Chiều dài dây (m)
        const xNorm = x / L

        if (waveMode === 'continuous') {
            if (excitationType === 'harmonic') {
                // Sóng tới
                let u = amplitude * Math.cos(omega * t - k * x + phase)

                // Tắt dần theo không gian
                u *= Math.exp(-damping * x)

                // Sóng phản xạ (nếu có)
                if (boundaryCondition !== 'absorbing') {
                    const xPhanXa = 2 * L - x
                    const uPhanXa = heSoPhanXa * amplitude * Math.cos(omega * t - k * xPhanXa + phase)
                    u += uPhanXa * Math.exp(-damping * (2 * L - x))
                }

                // Tắt dần theo thời gian
                u *= Math.exp(-damping * t * 0.1)

                return u
            }
        } else if (waveMode === 'pulse' && pulseTrigger > 0) {
            // Xung Gauss
            const pulseCenter = pulsePosition
            const width = pulseWidth
            let u = amplitude * Math.exp(-Math.pow((x - pulseCenter) / width, 2))

            // Phản xạ xung
            if (boundaryCondition !== 'absorbing' && pulseCenter > L) {
                const reflectedCenter = 2 * L - pulseCenter
                u += heSoPhanXa * amplitude * Math.exp(-Math.pow((x - reflectedCenter) / width, 2))
            }

            return u
        }

        return 0
    }, [tinhToanVatLy, waveMode, excitationType, amplitude, phase, damping, boundaryCondition, pulseTrigger, pulsePosition, pulseWidth])

    // ===== VẼ CANVAS =====
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const { width, height } = dimensions
        canvas.width = width
        canvas.height = height

        // Thông số vẽ
        const margin = { left: 60, right: 40, top: 30, bottom: 40 }
        const graphWidth = width - margin.left - margin.right
        const graphHeight = height - margin.top - margin.bottom
        const yCenter = margin.top + graphHeight / 2
        const L = 10 // Chiều dài dây (m)
        const scaleY = graphHeight / (amplitude * 3 + 0.5) // Scale cho biên độ

        // Xóa canvas
        ctx.clearRect(0, 0, width, height)

        // Vẽ nền gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, '#0f172a')
        gradient.addColorStop(1, '#1e293b')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        // Vẽ lưới
        ctx.beginPath()
        ctx.strokeStyle = '#334155'
        ctx.lineWidth = 0.5

        // Lưới dọc
        for (let i = 0; i <= 10; i++) {
            const x = margin.left + (i / 10) * graphWidth
            ctx.beginPath()
            ctx.moveTo(x, margin.top)
            ctx.lineTo(x, height - margin.bottom)
            ctx.strokeStyle = '#334155'
            ctx.stroke()

            // Nhãn trục x
            ctx.fillStyle = '#94a3b8'
            ctx.font = '10px Arial'
            ctx.textAlign = 'center'
            ctx.fillText(`${i} m`, x, height - margin.bottom + 15)
        }

        // Lưới ngang
        const ySteps = 5
        for (let i = -ySteps; i <= ySteps; i++) {
            const y = yCenter + (i / ySteps) * (graphHeight / 2)
            ctx.beginPath()
            ctx.moveTo(margin.left, y)
            ctx.lineTo(width - margin.right, y)
            ctx.strokeStyle = i === 0 ? '#475569' : '#334155'
            ctx.stroke()
        }

        // Vẽ trục
        ctx.beginPath()
        ctx.moveTo(margin.left, yCenter)
        ctx.lineTo(width - margin.right, yCenter)
        ctx.strokeStyle = '#64748b'
        ctx.lineWidth = 2
        ctx.stroke()

        // Nhãn trục
        ctx.fillStyle = '#cbd5e1'
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        ctx.fillText('x (m)', width - margin.right + 5, yCenter + 5)

        ctx.save()
        ctx.translate(margin.left - 15, yCenter)
        ctx.rotate(-Math.PI / 2)
        ctx.fillStyle = '#cbd5e1'
        ctx.font = '12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('Li độ u(x,t)', 0, 0)
        ctx.restore()

        // Vẽ các điểm cố định
        const startX = margin.left
        const endX = margin.left + graphWidth

        // Vẽ dây
        ctx.beginPath()
        let firstPoint = true

        for (let px = startX; px <= endX; px += 2) {
            const x = ((px - startX) / graphWidth) * L
            const u = calculateDisplacement(x, time)
            const py = yCenter - u * scaleY

            if (firstPoint) {
                ctx.moveTo(px, py)
                firstPoint = false
            } else {
                ctx.lineTo(px, py)
            }
        }

        // Style cho đường dây
        const lineGradient = ctx.createLinearGradient(startX, 0, endX, 0)
        lineGradient.addColorStop(0, '#f59e0b')
        lineGradient.addColorStop(0.5, '#ef4444')
        lineGradient.addColorStop(1, '#f59e0b')

        ctx.strokeStyle = lineGradient
        ctx.lineWidth = 3
        ctx.shadowColor = '#f59e0b'
        ctx.shadowBlur = 10
        ctx.stroke()
        ctx.shadowBlur = 0

        // Vẽ nguồn dao động (bên trái)
        const sourceX = startX
        const sourceU = calculateDisplacement(0, time)
        const sourceY = yCenter - sourceU * scaleY

        ctx.beginPath()
        ctx.arc(sourceX, sourceY, 8, 0, 2 * Math.PI)
        ctx.fillStyle = '#ef4444'
        ctx.shadowColor = '#ef4444'
        ctx.shadowBlur = 15
        ctx.fill()
        ctx.strokeStyle = '#fca5a5'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.shadowBlur = 0

        // Nhãn nguồn
        ctx.fillStyle = '#fca5a5'
        ctx.font = 'bold 10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('NGUỒN', sourceX, sourceY - 15)
        ctx.fillText('DAO ĐỘNG', sourceX, sourceY - 3)

        // Vẽ đầu cuối (bên phải)
        const endMarkerX = endX

        if (boundaryCondition === 'fixed') {
            // Đầu cố định
            ctx.fillStyle = '#64748b'
            ctx.shadowColor = '#64748b'
            ctx.shadowBlur = 10
            ctx.fillRect(endMarkerX - 8, yCenter - 25, 16, 50)

            ctx.fillStyle = '#94a3b8'
            ctx.font = 'bold 10px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('CỐ ĐỊNH', endMarkerX, yCenter - 30)

            // Vẽ vòng tròn cố định
            ctx.beginPath()
            ctx.arc(endMarkerX, yCenter, 6, 0, 2 * Math.PI)
            ctx.fillStyle = '#475569'
            ctx.fill()
            ctx.strokeStyle = '#94a3b8'
            ctx.lineWidth = 2
            ctx.stroke()
        } else if (boundaryCondition === 'free') {
            // Đầu tự do
            ctx.beginPath()
            ctx.arc(endMarkerX, yCenter, 8, 0, 2 * Math.PI)
            ctx.fillStyle = '#10b981'
            ctx.shadowColor = '#10b981'
            ctx.shadowBlur = 10
            ctx.fill()
            ctx.strokeStyle = '#6ee7b7'
            ctx.lineWidth = 2
            ctx.stroke()

            ctx.fillStyle = '#6ee7b7'
            ctx.font = 'bold 10px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('TỰ DO', endMarkerX, yCenter - 18)
        } else {
            // Hấp thụ (không phản xạ)
            ctx.beginPath()
            ctx.moveTo(endMarkerX, yCenter - 15)
            ctx.lineTo(endMarkerX + 15, yCenter - 15)
            ctx.lineTo(endMarkerX + 15, yCenter + 15)
            ctx.lineTo(endMarkerX, yCenter + 15)
            ctx.fillStyle = '#8b5cf6'
            ctx.globalAlpha = 0.5
            ctx.fill()
            ctx.globalAlpha = 1

            ctx.fillStyle = '#a78bfa'
            ctx.font = 'bold 10px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('HẤP THỤ', endMarkerX + 8, yCenter - 20)
        }
        ctx.shadowBlur = 0

        // Vẽ mũi tên vận tốc truyền sóng (nếu bật)
        if (hienThiVanToc) {
            const arrowY = yCenter - 40
            ctx.beginPath()
            ctx.moveTo(startX + 50, arrowY)
            ctx.lineTo(startX + 150, arrowY)
            ctx.strokeStyle = '#3b82f6'
            ctx.lineWidth = 2
            ctx.stroke()

            // Đầu mũi tên
            ctx.beginPath()
            ctx.moveTo(startX + 150, arrowY)
            ctx.lineTo(startX + 140, arrowY - 5)
            ctx.lineTo(startX + 140, arrowY + 5)
            ctx.closePath()
            ctx.fillStyle = '#3b82f6'
            ctx.fill()

            ctx.fillStyle = '#60a5fa'
            ctx.font = '10px Arial'
            ctx.textAlign = 'center'
            ctx.fillText(`v = ${tinhToanVatLy.vanTocSong.toFixed(2)} m/s`, startX + 100, arrowY - 8)
        }

        // Vẽ thông tin năng lượng (nếu bật)
        if (hienThiNangLuong) {
            ctx.fillStyle = '#fbbf24'
            ctx.font = 'bold 12px Arial'
            ctx.textAlign = 'right'
            ctx.fillText(`Năng lượng: ${tinhToanVatLy.matDoNangLuong.toFixed(4)} J/m`, width - margin.right - 10, margin.top + 20)
        }

        // Vẽ chú thích thời gian
        ctx.fillStyle = '#94a3b8'
        ctx.font = '12px Arial'
        ctx.textAlign = 'left'
        ctx.fillText(`t = ${time.toFixed(2)} s`, margin.left, margin.top - 5)

    }, [dimensions, time, calculateDisplacement, amplitude, tinhToanVatLy, boundaryCondition, hienThiVanToc, hienThiNangLuong])

    // ===== XỬ LÝ SỰ KIỆN =====
    const xuLyReset = useCallback(() => {
        setTime(0)
        setAmplitude(0.5)
        setFrequency(1.5)
        setWavelength(2.0)
        setTension(1.0)
        setLinearDensity(0.1)
        setDamping(0.02)
        setPhase(0)
        setPulsePosition(0)
        setLichSuT([])
        setLichSuAmplitude([])
        setLichSuNangLuong([])
        setLichSuVanToc([])
    }, [])

    const guiXung = useCallback(() => {
        setPulseTrigger(p => p + 1)
        setPulsePosition(0)
        setTime(0)
    }, [])

    // ===== COMPONENT CON: THANH TRƯỢT =====
    const ThanhTruot = ({ label, value, min, max, step, onChange, donVi = '', icon: Icon, mau = 'blue' }: any) => {
        const mauClasses: any = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600',
            red: 'from-red-500 to-red-600',
            yellow: 'from-yellow-500 to-yellow-600'
        }

        return (
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4" />}
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                    </div>
                    <span className={`text-sm font-bold bg-gradient-to-r ${mauClasses[mau]} text-transparent bg-clip-text`}>
                        {value.toFixed(3)}{donVi}
                    </span>
                </div>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className={`w-full h-2 bg-gradient-to-r ${mauClasses[mau]} rounded-lg appearance-none cursor-pointer`}
                />
                <div className="flex justify-between text-xs text-gray-500">
                    <span>{min}{donVi}</span>
                    <span>{max}{donVi}</span>
                </div>
            </div>
        )
    }

    // ===== COMPONENT CON: CARD THÔNG SỐ =====
    const CardThongSo = ({ tieuDe, giaTri, donVi, icon: Icon, mau = 'blue' }: any) => {
        const mauClasses: any = {
            blue: 'bg-blue-50 border-blue-100 text-blue-700',
            green: 'bg-green-50 border-green-100 text-green-700',
            purple: 'bg-purple-50 border-purple-100 text-purple-700',
            orange: 'bg-orange-50 border-orange-100 text-orange-700',
            red: 'bg-red-50 border-red-100 text-red-700',
            yellow: 'bg-yellow-50 border-yellow-100 text-yellow-700'
        }

        return (
            <div className={`p-3 rounded-xl border ${mauClasses[mau]}`}>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium opacity-80">{tieuDe}</span>
                    {Icon && <Icon className="w-3 h-3 opacity-70" />}
                </div>
                <div className="text-xl font-bold">{giaTri}</div>
                {donVi && <div className="text-xs opacity-70">{donVi}</div>}
            </div>
        )
    }

    // ===== COMPONENT CON: ĐỒ THỊ SÓNG =====
    const WaveChart = () => {
        const duLieu = useMemo(() => {
            return lichSuT.map((t, i) => ({
                time: t,
                amplitude: lichSuAmplitude[i] || 0,
                energy: lichSuNangLuong[i] || 0
            }))
        }, [lichSuT, lichSuAmplitude, lichSuNangLuong])

        const maxAmp = Math.max(...lichSuAmplitude.map(Math.abs), amplitude)
        const maxEnergy = Math.max(...lichSuNangLuong, 1)

        return (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Đồ Thị Phân Tích Sóng
                </h3>

                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-4 gap-3">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-500">Biên độ</div>
                        <div className="font-bold text-red-600">{amplitude.toFixed(3)} m</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-500">Tần số</div>
                        <div className="font-bold text-blue-600">{frequency.toFixed(2)} Hz</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-500">Vận tốc</div>
                        <div className="font-bold text-green-600">{tinhToanVatLy.vanTocSong.toFixed(2)} m/s</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-500">Bước sóng</div>
                        <div className="font-bold text-purple-600">{tinhToanVatLy.lambda.toFixed(2)} m</div>
                    </div>
                </div>

                {/* Biểu đồ li độ (giả lập - thực tế nên dùng recharts như EMWaveChart) */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">Li độ theo thời gian (tại x = L/2)</h4>
                    </div>
                    <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg relative overflow-hidden">
                        <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
                            <polyline
                                points={duLieu.map((d, i) => {
                                    const x = (i / duLieu.length) * 400
                                    const y = 50 - (d.amplitude / maxAmp) * 40
                                    return `${x},${y}`
                                }).join(' ')}
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                </div>

                {/* Thông tin năng lượng */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Mật độ năng lượng</div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {tinhToanVatLy.matDoNangLuong.toExponential(2)} J/m
                        </div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Công suất truyền</div>
                        <div className="text-2xl font-bold text-orange-600">
                            {tinhToanVatLy.congSuatTruyen.toExponential(2)} W
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ===== RENDER CHÍNH =====
    return (
        <div className={`bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl p-6 transition-all duration-300 ${toanManHinh ? 'fixed inset-4 z-50 overflow-y-auto' : ''}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        🎸 Mô Phỏng Sóng Trên Dây
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Mô phỏng vật lý sóng cơ trên dây - Khảo sát dao động, phản xạ và năng lượng
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setToanManHinh(!toanManHinh)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                    >
                        {toanManHinh ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={xuLyReset}
                        className="px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium"
                    >
                        <RotateCcw className="w-4 h-4 inline mr-2" />
                        Đặt Lại
                    </button>

                    <button
                        onClick={() => setDangChay(!dangChay)}
                        className={`px-4 py-2.5 bg-gradient-to-r text-white rounded-lg font-medium ${dangChay ? 'from-yellow-500 to-orange-500' : 'from-green-500 to-emerald-500'}`}
                    >
                        {dangChay ? <><Pause className="w-4 h-4 inline mr-2" />Tạm Dừng</> : <><Play className="w-4 h-4 inline mr-2" />Phát</>}
                    </button>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái - Canvas và điều khiển */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Container Canvas */}
                    <div ref={containerRef} className="rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 shadow-xl">
                        <canvas
                            ref={canvasRef}
                            width={dimensions.width}
                            height={dimensions.height}
                            className="w-full h-auto bg-gray-900"
                        />
                    </div>

                    {/* Navigation tab */}
                    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                        {[
                            { id: 'dieuKhien', label: 'Điều Khiển', icon: Settings },
                            { id: 'cheDo', label: 'Chế Độ Sóng', icon: Waves },
                            { id: 'thongSo', label: 'Thông Số Vật Lý', icon: Activity },
                            { id: 'doThi', label: 'Đồ Thị', icon: BarChart3 }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setTabHienTai(tab.id)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${tabHienTai === tab.id
                                    ? 'bg-white dark:bg-gray-800 shadow-lg text-orange-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Nội dung tab */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200">
                        {tabHienTai === 'dieuKhien' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Bảng Điều Khiển
                                </h3>

                                <ThanhTruot
                                    label="Biên độ (A)"
                                    value={amplitude}
                                    min={0.1}
                                    max={1.5}
                                    step={0.05}
                                    onChange={setAmplitude}
                                    donVi=" m"
                                    icon={Target}
                                    mau="orange"
                                />

                                <ThanhTruot
                                    label="Tần số (f)"
                                    value={frequency}
                                    min={0.2}
                                    max={3}
                                    step={0.1}
                                    onChange={setFrequency}
                                    donVi=" Hz"
                                    icon={Activity}
                                    mau="blue"
                                />

                                <ThanhTruot
                                    label="Lực căng dây (T)"
                                    value={tension}
                                    min={0.2}
                                    max={3}
                                    step={0.1}
                                    onChange={setTension}
                                    donVi=" N"
                                    icon={Gauge}
                                    mau="green"
                                />

                                <ThanhTruot
                                    label="Mật độ khối lượng dài (μ)"
                                    value={linearDensity}
                                    min={0.01}
                                    max={0.5}
                                    step={0.01}
                                    onChange={setLinearDensity}
                                    donVi=" kg/m"
                                    icon={Ruler}
                                    mau="purple"
                                />

                                <ThanhTruot
                                    label="Hệ số tắt dần"
                                    value={damping}
                                    min={0}
                                    max={0.1}
                                    step={0.005}
                                    onChange={setDamping}
                                    donVi=""
                                    icon={Zap}
                                    mau="red"
                                />

                                <ThanhTruot
                                    label="Tốc độ mô phỏng"
                                    value={tocDoThoiGian}
                                    min={0.1}
                                    max={3}
                                    step={0.1}
                                    onChange={setTocDoThoiGian}
                                    donVi="x"
                                    icon={Clock}
                                    mau="yellow"
                                />
                            </div>
                        )}

                        {tabHienTai === 'cheDo' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Waves className="w-5 h-5" />
                                    Chế Độ Sóng
                                </h3>

                                {/* Chế độ sóng */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Kiểu sóng
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setWaveMode('continuous')}
                                            className={`p-3 rounded-lg border-2 transition-all ${waveMode === 'continuous'
                                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                                : 'border-gray-200 dark:border-gray-700'
                                                }`}
                                        >
                                            <Waves className="w-5 h-5 mb-1" />
                                            <div className="font-medium">Liên tục</div>
                                            <div className="text-xs text-gray-500">Sóng hình sin</div>
                                        </button>
                                        <button
                                            onClick={() => setWaveMode('pulse')}
                                            className={`p-3 rounded-lg border-2 transition-all ${waveMode === 'pulse'
                                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                                : 'border-gray-200 dark:border-gray-700'
                                                }`}
                                        >
                                            <Zap className="w-5 h-5 mb-1" />
                                            <div className="font-medium">Xung</div>
                                            <div className="text-xs text-gray-500">Xung đơn</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Điều kiện biên */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Điều kiện biên đầu cuối
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'fixed', label: 'Cố định', icon: '📌' },
                                            { id: 'free', label: 'Tự do', icon: '🔄' },
                                            { id: 'absorbing', label: 'Hấp thụ', icon: '⬇️' }
                                        ].map(mode => (
                                            <button
                                                key={mode.id}
                                                onClick={() => setBoundaryCondition(mode.id as any)}
                                                className={`p-2 rounded-lg border-2 transition-all ${boundaryCondition === mode.id
                                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                    : 'border-gray-200 dark:border-gray-700'
                                                    }`}
                                            >
                                                <div className="text-xl mb-1">{mode.icon}</div>
                                                <div className="text-xs font-medium">{mode.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Nút gửi xung */}
                                {waveMode === 'pulse' && (
                                    <div className="pt-4">
                                        <button
                                            onClick={guiXung}
                                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium"
                                        >
                                            <Zap className="w-4 h-4 inline mr-2" />
                                            Gửi Xung Sóng
                                        </button>
                                    </div>
                                )}

                                {/* Tùy chọn hiển thị */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                                        Tùy chọn hiển thị
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center justify-between p-2">
                                            <span>Hiển thị vận tốc truyền sóng</span>
                                            <input
                                                type="checkbox"
                                                checked={hienThiVanToc}
                                                onChange={(e) => setHienThiVanToc(e.target.checked)}
                                            />
                                        </label>
                                        <label className="flex items-center justify-between p-2">
                                            <span>Hiển thị năng lượng</span>
                                            <input
                                                type="checkbox"
                                                checked={hienThiNangLuong}
                                                onChange={(e) => setHienThiNangLuong(e.target.checked)}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {tabHienTai === 'thongSo' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5" />
                                    Thông Số Vật Lý
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <CardThongSo
                                        tieuDe="Vận tốc sóng"
                                        giaTri={tinhToanVatLy.vanTocSong.toFixed(2)}
                                        donVi="m/s"
                                        icon={Gauge}
                                        mau="blue"
                                    />
                                    <CardThongSo
                                        tieuDe="Bước sóng"
                                        giaTri={tinhToanVatLy.lambda.toFixed(2)}
                                        donVi="m"
                                        icon={Ruler}
                                        mau="green"
                                    />
                                    <CardThongSo
                                        tieuDe="Chu kỳ"
                                        giaTri={tinhToanVatLy.chuKy.toFixed(3)}
                                        donVi="s"
                                        icon={Clock}
                                        mau="purple"
                                    />
                                    <CardThongSo
                                        tieuDe="Trở kháng"
                                        giaTri={tinhToanVatLy.troKhang.toFixed(2)}
                                        donVi="Ω"
                                        icon={Target}
                                        mau="orange"
                                    />
                                    <CardThongSo
                                        tieuDe="Mật độ NL"
                                        giaTri={tinhToanVatLy.matDoNangLuong.toExponential(2)}
                                        donVi="J/m"
                                        icon={Zap}
                                        mau="yellow"
                                    />
                                    <CardThongSo
                                        tieuDe="Công suất"
                                        giaTri={tinhToanVatLy.congSuatTruyen.toExponential(2)}
                                        donVi="W"
                                        icon={Activity}
                                        mau="red"
                                    />
                                </div>

                                {/* Công thức */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">📐 Công Thức Sóng Trên Dây</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded">
                                            <div className="font-mono text-blue-600 mb-1">v = √(T/μ)</div>
                                            <div className="text-gray-600 text-xs">Vận tốc truyền sóng</div>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded">
                                            <div className="font-mono text-green-600 mb-1">λ = v/f = 2π/k</div>
                                            <div className="text-gray-600 text-xs">Bước sóng</div>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded">
                                            <div className="font-mono text-purple-600 mb-1">u(x,t) = A cos(ωt - kx + φ)</div>
                                            <div className="text-gray-600 text-xs">Phương trình sóng</div>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded">
                                            <div className="font-mono text-orange-600 mb-1">E = ½μω²A²</div>
                                            <div className="text-gray-600 text-xs">Mật độ năng lượng trung bình</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Giải thích */}
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        Giải thích
                                    </h4>
                                    <ul className="space-y-1 text-sm text-yellow-600 dark:text-yellow-400">
                                        <li>• Vận tốc sóng phụ thuộc vào lực căng và mật độ dây</li>
                                        <li>• Sóng phản xạ ngược pha tại đầu cố định</li>
                                        <li>• Sóng phản xạ cùng pha tại đầu tự do</li>
                                        <li>• Năng lượng sóng tỉ lệ với bình phương biên độ và tần số</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {tabHienTai === 'doThi' && <WaveChart />}
                    </div>
                </div>

                {/* Cột phải - Thông tin bổ sung */}
                <div className="space-y-6">
                    {/* Thông tin nhanh */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-5 border border-orange-100">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">📊 Thông Số Nhanh</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-600">Vận tốc sóng</div>
                                <div className="text-3xl font-bold text-orange-600">
                                    {tinhToanVatLy.vanTocSong.toFixed(2)}
                                    <span className="text-lg ml-1">m/s</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    v = √(T/μ) = √({tension}/{linearDensity})
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Bước sóng</div>
                                <div className="text-xl font-bold text-blue-600">
                                    {tinhToanVatLy.lambda.toFixed(2)} m
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">Chu kỳ</div>
                                <div className="text-xl font-bold text-green-600">
                                    {tinhToanVatLy.chuKy.toFixed(3)} s
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Các chế độ sóng */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 shadow-lg">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Radio className="w-5 h-5" />
                            Hiện Tượng Sóng
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="font-medium text-blue-600 mb-1">🌊 Sóng tới</div>
                                <div className="text-sm text-gray-600">
                                    Lan truyền từ nguồn đến đầu cuối
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="font-medium text-purple-600 mb-1">🔄 Sóng phản xạ</div>
                                <div className="text-sm text-gray-600">
                                    {boundaryCondition === 'fixed' && 'Ngược pha tại đầu cố định'}
                                    {boundaryCondition === 'free' && 'Cùng pha tại đầu tự do'}
                                    {boundaryCondition === 'absorbing' && 'Bị hấp thụ hoàn toàn'}
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="font-medium text-green-600 mb-1">📈 Sóng dừng</div>
                                <div className="text-sm text-gray-600">
                                    Hình thành khi có sự giao thoa giữa sóng tới và sóng phản xạ
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="font-medium text-orange-600 mb-1">⚡ Năng lượng sóng</div>
                                <div className="text-sm text-gray-600">
                                    Truyền dọc theo dây với vận tốc v
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hướng dẫn */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-100">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Hướng Dẫn
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 font-bold">1.</span>
                                <span>Điều chỉnh biên độ, tần số và lực căng</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 font-bold">2.</span>
                                <span>Chọn điều kiện biên để quan sát phản xạ</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 font-bold">3.</span>
                                <span>Chuyển chế độ xung để gửi xung đơn</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 font-bold">4.</span>
                                <span>Theo dõi năng lượng và vận tốc sóng</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 font-bold">5.</span>
                                <span>Xem đồ thị để phân tích chi tiết</span>
                            </li>
                        </ul>
                    </div>

                    {/* Ứng dụng */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-100">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">🎯 Ứng Dụng</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🎸</span>
                                <div>
                                    <div className="font-medium">Nhạc cụ dây</div>
                                    <div className="text-gray-600">Guitar, violin, piano</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🌉</span>
                                <div>
                                    <div className="font-medium">Cầu treo</div>
                                    <div className="text-gray-600">Dao động của dây cáp</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">📡</span>
                                <div>
                                    <div className="font-medium">Truyền tín hiệu</div>
                                    <div className="text-gray-600">Cáp quang, dây điện</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🔬</span>
                                <div>
                                    <div className="font-medium">Nghiên cứu</div>
                                    <div className="text-gray-600">Mô hình sóng cơ học</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>🎯 <strong>Mô phỏng vật lý sóng trên dây</strong> - Phát triển dành cho học sinh Việt Nam</p>
                    <p className="mt-1">Ứng dụng cho bài học: Sóng cơ, Dao động, Phản xạ sóng, Sóng dừng</p>
                </div>
            </div>
        </div>
    )
}