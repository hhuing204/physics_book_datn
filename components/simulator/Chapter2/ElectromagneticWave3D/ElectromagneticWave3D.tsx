// ElectromagneticWaveSimulation.tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line, Html, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { Suspense } from 'react'
import {
    Zap,
    Play,
    Pause,
    RotateCcw,
    Lock,
    Unlock,
    Gauge,
    Target,
    AlertCircle,
    Info,
    Activity,
    GitCompare,
    BarChart3,
    RefreshCw,
    Settings,
    Brain,
    Maximize2,
    Minimize2,
    Ruler,
    Weight,
    Shield,
    Clock,
    AlertTriangle,
    Radio,
    Waves,
    Eye,
    EyeOff,
    Sun,
    Move
} from 'lucide-react'
import EMWaveChart from './EMWaveChart'


// ===== HẰNG SỐ VẬT LÝ =====
const C: number = 3e8 // Tốc độ ánh sáng (m/s)
const EPSILON_0: number = 8.854e-12 // Hằng số điện môi (F/m)
// const MU_0: number = 4 * Math.PI * 1e-7 // Độ từ thẩm (H/m)

// ===== COMPONENT SÓNG ĐIỆN TỪ 3D =====
// ElectromagneticWaveSimulation.tsx - Phần sửa đổi

function EMWaveVisualization({
    eAmplitude,
    bAmplitude,
    wavelength,
    frequency,
    time,
    showElectric,
    showMagnetic,
    showVectors,
    showPropagation,
    phase
}: {
    eAmplitude: number
    bAmplitude: number
    wavelength: number
    frequency: number
    time: number
    showElectric: boolean
    showMagnetic: boolean
    showVectors: boolean
    showPropagation: boolean
    phase: number
}) {
    const pointsCount = 200
    const length = 10
    const k = 2 * Math.PI / wavelength
    const omega = 2 * Math.PI * frequency

    // Hệ số scale để hiển thị B rõ hơn
    const B_DISPLAY_SCALE = 1

    // Dữ liệu sóng điện trường E - Dao động theo trục Y
    const electricPoints = useMemo(() => {
        const points: THREE.Vector3[] = []
        const step = length / pointsCount

        for (let i = 0; i <= pointsCount; i++) {
            const x = -length / 2 + i * step
            const E = eAmplitude * Math.cos(omega * time - k * x + phase)
            points.push(new THREE.Vector3(x, E, 0))
        }
        return points
    }, [eAmplitude, wavelength, frequency, time, phase])

    // Dữ liệu sóng từ trường B - Dao động theo trục Z (SÓNG SIN)
    const magneticPoints = useMemo(() => {
        const points: THREE.Vector3[] = []
        const step = length / pointsCount

        for (let i = 0; i <= pointsCount; i++) {
            const x = -length / 2 + i * step
            // B dao động theo hàm sin/cos - ĐÂY LÀ SÓNG SIN!
            const B = bAmplitude * Math.cos(omega * time - k * x + phase)
            // Scale lên để dễ quan sát, vị trí Z thay đổi theo B
            const B_display = B * B_DISPLAY_SCALE
            points.push(new THREE.Vector3(x, 0, B_display))
        }
        return points
    }, [bAmplitude, B_DISPLAY_SCALE, wavelength, frequency, time, phase])

    // Các vị trí vẽ vectơ
    const vectorPositions = useMemo(() => {
        const numVectors = 12
        const step = length / numVectors
        const positions: number[] = []

        for (let i = 0; i <= numVectors; i++) {
            positions.push(-length / 2 + i * step)
        }
        return positions
    }, [length])

    return (
        <group>
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-5, 3, -5]} intensity={0.4} />
            <directionalLight position={[0, 10, 0]} intensity={0.5} />

            <gridHelper args={[14, 20, '#4b5563', '#374151']} position={[0, -eAmplitude - 0.5, 0]} />
            <axesHelper args={[7]} />

            {/* ===== SÓNG ĐIỆN TRƯỜNG E - Dao động sin theo trục Y ===== */}
            {showElectric && (
                <>
                    <Line
                        points={electricPoints}
                        color="#ef4444"
                        lineWidth={3}
                    />
                    <Html position={[0, eAmplitude + 1, 0]} center>
                        <div className="bg-red-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                            <span className="font-bold">E</span> (Vectơ cường độ điện trường)
                        </div>
                    </Html>
                </>
            )}

            {/* ===== SÓNG TỪ TRƯỜNG B - Dao động sin theo trục Z ===== */}
            {showMagnetic && (
                <>
                    <Line
                        points={magneticPoints}
                        color="#10b981"
                        lineWidth={3}
                    />
                    <Html position={[0, 0, bAmplitude * B_DISPLAY_SCALE + 1]} center>
                        <div className="bg-green-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                            <span className="font-bold">B</span> (Vectơ cảm ứng từ)
                            <span className="text-[10px] ml-1 opacity-75">(đã phóng to {B_DISPLAY_SCALE}x)</span>
                        </div>
                    </Html>
                </>
            )}

            {/* ===== PHƯƠNG TRUYỀN SÓNG - Trục X ===== */}
            <Line
                points={[[-length / 2 - 1, 0, 0], [length / 2 + 1, 0, 0]]}
                color="#3b82f6"
                lineWidth={3}
            />

            {showPropagation && (
                <>
                    <mesh position={[length / 2 + 0.8, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                        <coneGeometry args={[0.15, 0.5, 8]} />
                        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
                    </mesh>
                    <Html position={[length / 2 + 1.8, 0.8, 0]} center>
                        <div className="bg-blue-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                            <Move className="w-3 h-3" />
                            Phương truyền sóng (x)
                        </div>
                    </Html>
                </>
            )}

            {/* ===== CÁC VECTƠ E VÀ B TẠI CÁC ĐIỂM ===== */}
            {showVectors && vectorPositions.map((x, idx) => {
                // Tính giá trị E và B tại vị trí x
                const E = eAmplitude * Math.cos(omega * time - k * x + phase)
                const B = bAmplitude * Math.cos(omega * time - k * x + phase)
                const B_display = B * B_DISPLAY_SCALE

                return (
                    <group key={`vector-${idx}`} position={[x, 0, 0]}>
                        {/* Vectơ điện trường E - Hướng theo trục Y */}
                        {showElectric && Math.abs(E) > 0.05 && (
                            <group>
                                <Line
                                    points={[[0, 0, 0], [0, E, 0]]}
                                    color="#ef4444"
                                    lineWidth={3}
                                />
                                <mesh position={[0, E * (E > 0 ? 1.15 : 0.85), 0]}>
                                    <coneGeometry args={[0.08, 0.25, 8]} />
                                    <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
                                </mesh>
                                <Html position={[0.3, E * 0.5, 0]} center>
                                    <div className="text-red-500 text-xs font-bold">E</div>
                                </Html>
                            </group>
                        )}

                        {/* Vectơ từ trường B - Hướng theo trục Z */}
                        {showMagnetic && Math.abs(B_display) > 0.05 && (
                            <group>
                                <Line
                                    points={[[0, 0, 0], [0, 0, B_display]]}
                                    color="#10b981"
                                    lineWidth={3}
                                />
                                <mesh position={[0, 0, B_display * (B_display > 0 ? 1.15 : 0.85)]}>
                                    <coneGeometry args={[0.08, 0.25, 8]} />
                                    <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} />
                                </mesh>
                                <Html position={[0.3, 0, B_display * 0.5]} center>
                                    <div className="text-green-500 text-xs font-bold">B</div>
                                </Html>
                            </group>
                        )}

                        {/* Điểm nút trên trục x */}
                        <mesh>
                            <sphereGeometry args={[0.05, 8, 8]} />
                            <meshStandardMaterial color="#6b7280" />
                        </mesh>
                    </group>
                )
            })}

            {/* Chú thích */}
            <Html position={[-4, eAmplitude + 2, 3]} center>
                <div className="bg-black/80 backdrop-blur-sm text-white text-xs p-4 rounded-lg border border-gray-700">
                    <div className="font-bold mb-2 text-center">Hình 7.1. Sự lan truyền của sóng điện từ</div>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-red-500" />
                            <span className="text-red-400">E: Vectơ cường độ điện trường</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-green-500" />
                            <span className="text-green-400">B: Vectơ cảm ứng từ (đã phóng to {B_DISPLAY_SCALE}x)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-blue-500" />
                            <span className="text-blue-400">x: Phương truyền sóng</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-700 text-gray-400 text-[10px]">
                        <div>E₀ = {eAmplitude.toFixed(2)} V/m</div>
                        <div>B₀ = {bAmplitude.toFixed(2)} μT</div>
                        <div>λ = {wavelength.toFixed(2)} m</div>
                        <div>f = {frequency.toFixed(2)} Hz</div>
                    </div>
                </div>
            </Html>

            {/* Nhãn O (gốc tọa độ) */}
            <Html position={[-0.3, -0.3, 0.3]} center>
                <div className="text-white text-sm font-bold">O</div>
            </Html>

            {/* Nhãn các trục */}
            <Html position={[length / 2 + 1, 0.3, 0]} center>
                <div className="text-blue-400 text-sm font-bold">x</div>
            </Html>
            <Html position={[0, eAmplitude + 0.5, 0]} center>
                <div className="text-red-400 text-sm font-bold">E</div>
            </Html>
            <Html position={[0, 0.3, bAmplitude * B_DISPLAY_SCALE + 0.5]} center>
                <div className="text-green-400 text-sm font-bold">B</div>
            </Html>
        </group>
    )
}

// ===== THANH TRƯỢT CẢI TIẾN =====

// Định nghĩa type cho màu
type MauType = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'

interface ThanhTruotProps {
    label: string
    value: number
    min: number
    max: number
    step: number
    onChange: (value: number) => void
    donVi?: string
    hienThiGiaTri?: boolean
    ghiChu?: string
    icon?: React.ElementType
    mau?: MauType
}

function ThanhTruot({
    label,
    value,
    min,
    max,
    step,
    onChange,
    donVi = "",
    hienThiGiaTri = true,
    ghiChu = "",
    icon: Icon,
    mau = 'blue'
}: ThanhTruotProps) {
    const mauClasses: Record<MauType, string> = {
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
                {hienThiGiaTri && (
                    <span className={`text-sm font-bold bg-gradient-to-r ${mauClasses[mau]} text-transparent bg-clip-text`}>
                        {typeof value === 'number' ? value.toFixed(3) : value}{donVi}
                    </span>
                )}
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className={`w-full h-2 bg-gradient-to-r ${mauClasses[mau]} rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:shadow-lg`}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{min}{donVi}</span>
                <span>{max}{donVi}</span>
            </div>
            {ghiChu && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ghiChu}</p>
            )}
        </div>
    )
}

// ===== NÚT GRADIENT =====
const NutGradient = ({
    children,
    onClick,
    gradient = 'from-blue-500 to-blue-600',
    hover = 'hover:from-blue-600 hover:to-blue-700',
    className = '',
    disabled = false
}: any) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2.5 bg-gradient-to-r ${gradient} ${hover} text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
)

// ===== CARD THÔNG SỐ =====

interface CardThongSoProps {
    tieuDe: string
    giaTri: string | number
    donVi?: string
    icon?: React.ElementType
    mau?: MauType
}

const CardThongSo = ({ tieuDe, giaTri, donVi, icon: Icon, mau = 'blue' }: CardThongSoProps) => {
    const mauClasses: Record<MauType, string> = {
        blue: 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-300',
        green: 'bg-green-50 border-green-100 text-green-700 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-300',
        purple: 'bg-purple-50 border-purple-100 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800/30 dark:text-purple-300',
        orange: 'bg-orange-50 border-orange-100 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800/30 dark:text-orange-300',
        red: 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-300',
        yellow: 'bg-yellow-50 border-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800/30 dark:text-yellow-300',
    }

    return (
        <div className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${mauClasses[mau]}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium opacity-80">{tieuDe}</span>
                {Icon && <Icon className="w-4 h-4 opacity-70" />}
            </div>
            <div className="text-2xl font-bold">{giaTri}</div>
            {donVi && <div className="text-sm opacity-70 mt-1">{donVi}</div>}
        </div>
    )
}

// ===== COMPONENT CHÍNH =====
export default function ElectromagneticWaveSimulation() {
    // ===== STATE =====
    const [dangChay, setDangChay] = useState(true)
    const [khoaCamera, setKhoaCamera] = useState(false)
    const [toanManHinh, setToanManHinh] = useState(false)
    const [tabHienTai, setTabHienTai] = useState('dieuKhien')

    // Thông số sóng
    const [eAmplitude, setEAmplitude] = useState(1.5)   // Biên độ điện trường (V/m)
    const [bAmplitude, setBAmplitude] = useState(0.5)   // Biên độ từ trường (μT)
    const [wavelength, setWavelength] = useState(3.0)   // Bước sóng (m)
    const [frequency, setFrequency] = useState(0.8)     // Tần số (Hz)
    const [phase, setPhase] = useState(0)               // Pha ban đầu (rad)
    const [tocDoThoiGian, setTocDoThoiGian] = useState(1.0) // Tốc độ mô phỏng

    // Hiển thị
    const [showElectric, setShowElectric] = useState(true)
    const [showMagnetic, setShowMagnetic] = useState(true)
    const [showVectors, setShowVectors] = useState(true)
    const [showPropagation, setShowPropagation] = useState(true)

    // Dữ liệu thời gian thực
    const [time, setTime] = useState(0)
    const [lichSuE, setLichSuE] = useState<number[]>([])
    const [lichSuB, setLichSuB] = useState<number[]>([])
    const [lichSuT, setLichSuT] = useState<number[]>([])
    const [lichSuCuongDo, setLichSuCuongDo] = useState<number[]>([])

    const [isClient, setIsClient] = useState(false)

    // Set isClient after mount
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Animation loop
    useEffect(() => {
        if (!isClient) return

        let animationFrameId: number
        let lastTime: number | null = null

        const capNhatThoiGian = (currentTime: number) => {
            if (lastTime === null) {
                lastTime = currentTime
                animationFrameId = requestAnimationFrame(capNhatThoiGian)
                return
            }

            if (dangChay) {
                const deltaTime = (currentTime - lastTime) * 0.001
                const dt = deltaTime * tocDoThoiGian

                setTime(t => t + dt)
            }

            lastTime = currentTime
            animationFrameId = requestAnimationFrame(capNhatThoiGian)
        }

        animationFrameId = requestAnimationFrame(capNhatThoiGian)

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [isClient, dangChay, tocDoThoiGian])

    // Cập nhật dữ liệu lịch sử
    useEffect(() => {
        if (!dangChay) return

        const omega = 2 * Math.PI * frequency
        const k = 2 * Math.PI / wavelength
        const x = 0 // Đo tại gốc tọa độ

        const E = eAmplitude * Math.cos(omega * time - k * x + phase)
        const B = (bAmplitude / C) * Math.cos(omega * time - k * x + phase)
        const cuongDo = Math.sqrt(E * E + B * B * C * C)

        const maxSamples = 500
        setLichSuT(h => [...h.slice(-maxSamples), time])
        setLichSuE(h => [...h.slice(-maxSamples), E])
        setLichSuB(h => [...h.slice(-maxSamples), B * 1e6]) // Chuyển sang μT
        setLichSuCuongDo(h => [...h.slice(-maxSamples), cuongDo])
    }, [time, dangChay, eAmplitude, bAmplitude, frequency, wavelength, phase])

    // Tính toán các đại lượng vật lý
    // Trong component chính, sửa phần tính toán vật lý:
    const tinhToanVatLy = useMemo(() => {
        const f: number = frequency ?? 0.8
        const lambda: number = wavelength ?? 3.0
        const eAmp: number = eAmplitude ?? 1.5
        const bAmp: number = bAmplitude ?? 0.5

        const omega: number = 2 * Math.PI * f
        const k: number = (2 * Math.PI) / lambda
        const vanTocPha: number = omega / k
        const tanSo: number = f
        const chuKy: number = f > 0 ? 1 / f : 0
        const buocSong: number = lambda

        // Cường độ sóng trung bình
        const cuongDoTrungBinh: number = 0.5 * C * EPSILON_0 * eAmp * eAmp

        // Mật độ năng lượng
        const matDoNangLuong: number = EPSILON_0 * eAmp * eAmp

        return {
            omega,
            k,
            vanTocPha,
            tanSo,
            chuKy,
            buocSong,
            eAmplitude: eAmp,
            bAmplitude: bAmp,
            cuongDoTrungBinh,
            matDoNangLuong
        }
    }, [eAmplitude, bAmplitude, frequency, wavelength])

    const xuLyReset = useCallback(() => {
        setTime(0)
        setEAmplitude(1.5)
        setBAmplitude(0.5)
        setWavelength(3.0)
        setFrequency(0.8)
        setPhase(0)
        setLichSuE([])
        setLichSuB([])
        setLichSuT([])
        setLichSuCuongDo([])
    }, [])

    const xuLyBatDauMoPhong = useCallback(() => {
        setDangChay(true)
    }, [])

    const xuLyTamDungMoPhong = useCallback(() => {
        setDangChay(false)
    }, [])

    // Chuẩn bị dữ liệu đồ thị
    const duLieuDoThi = useMemo(() => {
        return lichSuT.map((t, idx) => ({
            time: t,
            eField: lichSuE[idx] || 0,
            bField: lichSuB[idx] || 0,
            intensity: lichSuCuongDo[idx] || 0
        }))
    }, [lichSuT, lichSuE, lichSuB, lichSuCuongDo])

    // Loading state
    if (!isClient) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900/20 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="h-[500px] bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <div className="text-gray-600 dark:text-gray-400">Đang khởi tạo mô phỏng...</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl p-6 transition-all duration-300 ${toanManHinh ? 'fixed inset-4 z-50 overflow-y-auto' : ''}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        📡 Mô Phỏng Sóng Điện Từ 3D
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Mô phỏng vật lý sóng điện từ với đồ thị phân tích chi tiết - Dành cho học sinh Việt Nam
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setToanManHinh(!toanManHinh)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        {toanManHinh ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>

                    <NutGradient
                        onClick={() => setKhoaCamera(!khoaCamera)}
                        gradient={khoaCamera ? 'from-red-500 to-orange-500' : 'from-purple-500 to-pink-500'}
                    >
                        {khoaCamera ? (
                            <><Unlock className="w-4 h-4 inline mr-2" />Mở Camera</>
                        ) : (
                            <><Lock className="w-4 h-4 inline mr-2" />Khóa Camera</>
                        )}
                    </NutGradient>

                    <NutGradient onClick={xuLyReset} gradient="from-gray-600 to-gray-700">
                        <RotateCcw className="w-4 h-4 inline mr-2" />
                        Đặt Lại
                    </NutGradient>

                    <NutGradient
                        onClick={dangChay ? xuLyTamDungMoPhong : xuLyBatDauMoPhong}
                        gradient={dangChay ? 'from-yellow-500 to-orange-500' : 'from-green-500 to-emerald-500'}
                    >
                        {dangChay ? (
                            <><Pause className="w-4 h-4 inline mr-2" />Tạm Dừng</>
                        ) : (
                            <><Play className="w-4 h-4 inline mr-2" />Phát</>
                        )}
                    </NutGradient>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái - View 3D */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Container 3D */}
                    <div className="h-[500px] rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-900 to-black shadow-xl relative">
                        <Canvas camera={{ position: [6, 4, 6], fov: 45 }}>
                            <Suspense fallback={null}>
                                <EMWaveVisualization
                                    eAmplitude={eAmplitude}
                                    bAmplitude={bAmplitude}
                                    wavelength={wavelength}
                                    frequency={frequency}
                                    time={time}
                                    showElectric={showElectric}
                                    showMagnetic={showMagnetic}
                                    showVectors={showVectors}
                                    showPropagation={showPropagation}
                                    phase={phase}
                                />
                            </Suspense>
                            <OrbitControls
                                enabled={!khoaCamera}
                                enablePan={true}
                                enableZoom={true}
                                enableRotate={true}
                                minDistance={3}
                                maxDistance={15}
                            />
                        </Canvas>

                        {/* Thông tin real-time */}
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white max-w-xs">
                            <div className="text-sm font-bold mb-2">📊 Thông Số Hiện Tại</div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Thời gian:</span>
                                    <span className="font-bold">{time.toFixed(2)} s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>E (gốc):</span>
                                    <span className="font-bold text-red-400">
                                        {(eAmplitude * Math.cos(tinhToanVatLy.omega * time + phase)).toFixed(2)} V/m
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>B (gốc):</span>
                                    <span className="font-bold text-green-400">
                                        {(bAmplitude * Math.cos(tinhToanVatLy.omega * time + phase)).toFixed(2)} μT
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Trạng thái:</span>
                                    <span className="font-bold">
                                        {dangChay ? "▶ Đang chạy" : "⏸ Tạm dừng"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Chú thích */}
                        {/* Chú thích dưới view 3D */}
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl p-3 text-white">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-0.5 bg-red-500" />
                                    <span className="text-xs">E: Cường độ điện trường</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-0.5 bg-green-500" />
                                    <span className="text-xs">B: Cảm ứng từ</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-0.5 bg-blue-500" />
                                    <span className="text-xs">x: Phương truyền sóng</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation tab */}
                    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                        {[
                            { id: 'dieuKhien', label: 'Bảng Điều Khiển', icon: Settings },
                            { id: 'hienThi', label: 'Hiển Thị', icon: Eye },
                            { id: 'vatLy', label: 'Thông Tin Vật Lý', icon: Brain },
                            { id: 'doThi', label: 'Đồ Thị Phân Tích', icon: BarChart3 }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setTabHienTai(tab.id)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${tabHienTai === tab.id
                                    ? 'bg-white dark:bg-gray-800 shadow-lg text-purple-600 dark:text-purple-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Nội dung tab */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        {tabHienTai === 'dieuKhien' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Bảng Điều Khiển Thông Số
                                </h3>

                                <ThanhTruot
                                    label="Biên độ sóng (E₀)"
                                    value={eAmplitude}
                                    min={0.2}
                                    max={3}
                                    step={0.1}
                                    onChange={setEAmplitude}
                                    donVi=" V/m"
                                    ghiChu="Biên độ điện trường. B₀ = E₀/c"
                                    icon={Zap}
                                    mau="red"
                                />

                                <ThanhTruot
                                    label="Bước sóng (λ)"
                                    value={wavelength}
                                    min={1}
                                    max={6}
                                    step={0.2}
                                    onChange={setWavelength}
                                    donVi=" m"
                                    ghiChu="Khoảng cách giữa hai đỉnh sóng liên tiếp"
                                    icon={Ruler}
                                    mau="blue"
                                />

                                <ThanhTruot
                                    label="Tần số (f)"
                                    value={frequency}
                                    min={0.2}
                                    max={2}
                                    step={0.05}
                                    onChange={setFrequency}
                                    donVi=" Hz"
                                    ghiChu="Số dao động trong một giây"
                                    icon={Activity}
                                    mau="green"
                                />

                                <ThanhTruot
                                    label="Pha ban đầu (φ)"
                                    value={phase}
                                    min={0}
                                    max={2 * Math.PI}
                                    step={0.1}
                                    onChange={setPhase}
                                    donVi=" rad"
                                    ghiChu="Độ lệch pha tại t = 0"
                                    icon={Target}
                                    mau="purple"
                                />

                                <ThanhTruot
                                    label="Tốc độ mô phỏng"
                                    value={tocDoThoiGian}
                                    min={0.1}
                                    max={3}
                                    step={0.1}
                                    onChange={setTocDoThoiGian}
                                    donVi="x"
                                    ghiChu="1x = Thời gian thực"
                                    icon={Gauge}
                                    mau="orange"
                                />
                            </div>
                        )}

                        {tabHienTai === 'hienThi' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Eye className="w-5 h-5" />
                                    Tùy Chỉnh Hiển Thị
                                </h3>

                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                                                <Zap className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Điện trường E</div>
                                                <div className="text-sm text-gray-500">Dao động theo trục Y</div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={showElectric}
                                            onChange={(e) => setShowElectric(e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                                <Waves className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Từ trường B</div>
                                                <div className="text-sm text-gray-500">Dao động theo trục Z</div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={showMagnetic}
                                            onChange={(e) => setShowMagnetic(e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                                <Move className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Vectơ E và B</div>
                                                <div className="text-sm text-gray-500">Hiển thị mũi tên vectơ</div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={showVectors}
                                            onChange={(e) => setShowVectors(e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                                <Radio className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="font-medium">Phương truyền sóng</div>
                                                <div className="text-sm text-gray-500">Hiển thị mũi tên chỉ hướng</div>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={showPropagation}
                                            onChange={(e) => setShowPropagation(e.target.checked)}
                                            className="w-5 h-5"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        {tabHienTai === 'vatLy' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Brain className="w-5 h-5" />
                                    Thông Tin Vật Lý Sóng Điện Từ
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <CardThongSo
                                        tieuDe="Tần số (f)"
                                        giaTri={tinhToanVatLy.tanSo.toFixed(2)}
                                        donVi="Hz"
                                        icon={Activity}
                                        mau="blue"
                                    />
                                    <CardThongSo
                                        tieuDe="Chu kỳ (T)"
                                        giaTri={tinhToanVatLy.chuKy.toFixed(2)}
                                        donVi="s"
                                        icon={Clock}
                                        mau="purple"
                                    />
                                    <CardThongSo
                                        tieuDe="Bước sóng (λ)"
                                        giaTri={tinhToanVatLy.buocSong.toFixed(2)}
                                        donVi="m"
                                        icon={Ruler}
                                        mau="green"
                                    />
                                    <CardThongSo
                                        tieuDe="Vận tốc pha"
                                        giaTri={tinhToanVatLy.vanTocPha.toFixed(2)}
                                        donVi="m/s"
                                        icon={Gauge}
                                        mau="orange"
                                    />
                                    <CardThongSo
                                        tieuDe="Biên độ E₀"
                                        giaTri={tinhToanVatLy.eAmplitude.toFixed(2)}
                                        donVi="V/m"
                                        icon={Zap}
                                        mau="red"
                                    />
                                    <CardThongSo
                                        tieuDe="Biên độ B₀"
                                        giaTri={(tinhToanVatLy.bAmplitude * 1e6).toFixed(2)}
                                        donVi="μT"
                                        icon={Waves}
                                        mau="blue"
                                    />
                                </div>

                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">📐 Công Thức Sóng Điện Từ</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <div className="font-mono text-purple-600 dark:text-purple-400 mb-1">E = E₀ cos(ωt - kx)</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                Phương trình sóng điện trường
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <div className="font-mono text-blue-600 dark:text-blue-400 mb-1">B = B₀ cos(ωt - kx)</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                Phương trình sóng từ trường
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <div className="font-mono text-green-600 dark:text-green-400 mb-1">E₀ = c·B₀</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                Mối quan hệ giữa biên độ điện và từ
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <div className="font-mono text-orange-600 dark:text-orange-400 mb-1">c = 1/√(ε₀μ₀) ≈ 3×10⁸ m/s</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                Tốc độ ánh sáng trong chân không
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        Tính chất sóng điện từ
                                    </h4>
                                    <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                                        <li>• E và B dao động cùng pha, vuông góc với nhau</li>
                                        <li>• Cả E và B đều vuông góc với phương truyền sóng</li>
                                        <li>• Sóng điện từ là sóng ngang</li>
                                        <li>• Truyền được trong chân không với vận tốc c</li>
                                        <li>• Mang theo năng lượng và động lượng</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {tabHienTai === 'doThi' && (
                            <div className="space-y-6">
                                <EMWaveChart
                                    timeData={lichSuT}
                                    eFieldData={lichSuE}
                                    bFieldData={lichSuB}
                                    intensityData={lichSuCuongDo}
                                    title="Phân Tích Sóng Điện Từ"
                                    eAmplitude={eAmplitude}
                                    bAmplitude={bAmplitude}
                                    frequency={frequency}
                                    wavelength={wavelength}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Cột phải - Thông tin bổ sung */}
                <div className="space-y-6">
                    {/* Thông tin nhanh */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-900/30">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">📈 Thông Số Nhanh</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Tần số hiện tại</div>
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    {frequency.toFixed(2)} Hz
                                </div>
                                <div className="text-xs text-purple-500 dark:text-purple-400 mt-1">
                                    Chu kỳ: {(1 / frequency).toFixed(2)} s
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Bước sóng</div>
                                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                    {wavelength.toFixed(2)} m
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Vận tốc truyền sóng</div>
                                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                    {(frequency * wavelength).toFixed(2)} m/s
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thang sóng điện từ */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Radio className="w-5 h-5" />
                            Thang Sóng Điện Từ
                        </h3>
                        <ThangSongDienTu />
                    </div>

                    {/* Hướng dẫn sử dụng */}
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-5 border border-orange-100 dark:border-orange-900/30">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Hướng Dẫn Sử Dụng
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold">1.</span>
                                <span>Điều chỉnh biên độ, tần số và bước sóng</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold">2.</span>
                                <span>Bật/tắt hiển thị E, B và vectơ</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold">3.</span>
                                <span>Kéo chuột để xoay camera quan sát</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold">4.</span>
                                <span>Xem đồ thị phân tích trong tab Đồ Thị</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold">5.</span>
                                <span>Thay đổi tốc độ mô phỏng để quan sát rõ hơn</span>
                            </li>
                        </ul>
                    </div>

                    {/* Ứng dụng thực tế */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-100 dark:border-green-900/30">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">🌐 Ứng Dụng Thực Tế</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">📻</span>
                                <div>
                                    <div className="font-medium">Truyền thông</div>
                                    <div className="text-gray-600 dark:text-gray-400">Radio, TV, WiFi, 5G</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🩻</span>
                                <div>
                                    <div className="font-medium">Y học</div>
                                    <div className="text-gray-600 dark:text-gray-400">X-quang, MRI, xạ trị</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🛰️</span>
                                <div>
                                    <div className="font-medium">Viễn thám</div>
                                    <div className="text-gray-600 dark:text-gray-400">Radar, GPS, vệ tinh</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">☀️</span>
                                <div>
                                    <div className="font-medium">Năng lượng</div>
                                    <div className="text-gray-600 dark:text-gray-400">Pin mặt trời, sưởi ấm</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>🎯 <strong>Mô phỏng vật lý sóng điện từ</strong> - Phát triển dành cho học sinh Việt Nam</p>
                    <p className="mt-1">Ứng dụng cho bài học: Sóng điện từ, Dao động điện từ, Truyền thông</p>
                </div>
            </div>
        </div>
    )
}

// Component Thang sóng điện từ
function ThangSongDienTu() {
    const waveTypes = [
        { name: 'Tia Gamma', wavelength: '&lt; 0.01 nm', frequency: '&gt; 3×10¹⁹ Hz', color: '#8b5cf6', icon: '⚛️' },
        { name: 'Tia X', wavelength: '0.01 - 10 nm', frequency: '3×10¹⁶ - 3×10¹⁹ Hz', color: '#a855f7', icon: '🦴' },
        { name: 'Tia UV', wavelength: '10 - 400 nm', frequency: '7.5×10¹⁴ - 3×10¹⁶ Hz', color: '#ec489a', icon: '☀️' },
        { name: 'Ánh sáng', wavelength: '400 - 700 nm', frequency: '4.3×10¹⁴ - 7.5×10¹⁴ Hz', color: '#f97316', icon: '🌈' },
        { name: 'Hồng ngoại', wavelength: '0.7 μm - 1 mm', frequency: '3×10¹¹ - 4.3×10¹⁴ Hz', color: '#ef4444', icon: '🔥' },
        { name: 'Vi sóng', wavelength: '1 mm - 1 m', frequency: '3×10⁸ - 3×10¹¹ Hz', color: '#f59e0b', icon: '📡' },
        { name: 'Radio', wavelength: '&gt; 1 m', frequency: '&lt; 3×10⁸ Hz', color: '#3b82f6', icon: '📻' }
    ]

    return (
        <div className="space-y-4">
            <div className="relative h-16 bg-gradient-to-r from-purple-600 via-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 rounded-lg">
                {waveTypes.map((_, idx) => (
                    <div key={idx} className="absolute inset-0 flex items-center" style={{ left: `${(idx / (waveTypes.length - 1)) * 100}%` }}>
                        <div className="w-0.5 h-6 bg-white/50" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-2">
                {waveTypes.map((wave, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg border-l-4" style={{ borderLeftColor: wave.color }}>
                        <span className="text-xl">{wave.icon}</span>
                        <div className="flex-1">
                            <div className="font-medium text-sm">{wave.name}</div>
                            <div className="text-xs text-gray-500">
                                λ: <span dangerouslySetInnerHTML={{ __html: wave.wavelength }} /> |
                                f: <span dangerouslySetInnerHTML={{ __html: wave.frequency }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}