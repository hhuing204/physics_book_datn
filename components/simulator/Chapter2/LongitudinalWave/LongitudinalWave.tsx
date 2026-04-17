'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { Suspense } from 'react'
import {
    Volume2,
    Droplets,
    Play,
    Pause,
    RotateCcw,
    Lock,
    Unlock,
    Gauge,
    Target,
    Info,
    Activity,
    GitCompare,
    BarChart3,
    Settings,
    Brain,
    Maximize2,
    Minimize2,
    Ruler,
    Clock,
    Waves,
    Eye,
    Move,
    Zap
} from 'lucide-react'
import SoSanhSongChart from './LongitudinalWaveChart'

// ===== HẰNG SỐ =====
const SPEED_OF_SOUND = 343 // Vận tốc âm thanh trong không khí (m/s)

// ===== COMPONENT SÓNG DỌC 3D =====
function SongDocVisualization({
    amplitude,
    wavelength,
    frequency,
    time,
    showCompression,
    showParticles,
    showPropagation
}: {
    amplitude: number
    wavelength: number
    frequency: number
    time: number
    showCompression: boolean
    showParticles: boolean
    showPropagation: boolean
}) {
    const pointsCount = 32
    const length = 8
    const k = 2 * Math.PI / wavelength
    const omega = 2 * Math.PI * frequency

    // Vị trí cân bằng của các phần tử
    const equilibriumPositions = useMemo(() => {
        const positions: number[] = []
        const step = length / pointsCount
        for (let i = 0; i <= pointsCount; i++) {
            positions.push(-length / 2 + i * step)
        }
        return positions
    }, [pointsCount, length])

    // Độ dịch chuyển của mỗi phần tử (sóng dọc - dao động theo trục X)
    const displacements = useMemo(() => {
        return equilibriumPositions.map(x => amplitude * Math.cos(omega * time - k * x))
    }, [equilibriumPositions, amplitude, omega, k, time])

    // Vị trí hiện tại của các phần tử
    const currentPositions = useMemo(() => {
        return equilibriumPositions.map((x, i) => x + displacements[i])
    }, [equilibriumPositions, displacements])

    // Xác định vùng nén/giãn
    const compressionZones = useMemo(() => {
        const step = length / pointsCount
        const zones: { x: number; type: 'compression' | 'rarefaction'; intensity: number }[] = []
        for (let i = 1; i < currentPositions.length; i++) {
            const gap = currentPositions[i] - currentPositions[i - 1]
            const ratio = gap / step
            if (ratio < 0.85) {
                const intensity = Math.min(1, (0.85 - ratio) / 0.35)
                zones.push({ x: (currentPositions[i - 1] + currentPositions[i]) / 2, type: 'compression', intensity })
            } else if (ratio > 1.15) {
                const intensity = Math.min(1, (ratio - 1.15) / 0.35)
                zones.push({ x: (currentPositions[i - 1] + currentPositions[i]) / 2, type: 'rarefaction', intensity })
            }
        }
        return zones
    }, [currentPositions, length, pointsCount])

    return (
        <group>
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[0, 10, 0]} intensity={0.5} />

            <gridHelper args={[12, 20, '#4b5563', '#374151']} position={[0, -1.2, -1]} />
            <axesHelper args={[6]} />

            {/* Đường nối các phần tử */}
            <Line points={currentPositions.map(x => new THREE.Vector3(x, 0, 0))} color="#f59e0b" lineWidth={2} />

            {/* Các phần tử */}
            {showParticles && currentPositions.map((x, idx) => {
                let color = '#f59e0b'
                if (showCompression) {
                    const zone = compressionZones.find(z => Math.abs(z.x - x) < 0.3)
                    if (zone?.type === 'compression') color = '#ef4444'
                    else if (zone?.type === 'rarefaction') color = '#10b981'
                }
                return (
                    <mesh key={idx} position={[x, 0, 0]}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
                    </mesh>
                )
            })}

            {/* Vùng nén/giãn */}
            {showCompression && compressionZones.map((zone, idx) => (
                <mesh key={`zone-${idx}`} position={[zone.x, 0.5, 0]}>
                    <sphereGeometry args={[0.08 + zone.intensity * 0.05, 8, 8]} />
                    <meshStandardMaterial
                        color={zone.type === 'compression' ? '#ef4444' : '#10b981'}
                        emissive={zone.type === 'compression' ? '#ef4444' : '#10b981'}
                        emissiveIntensity={0.3}
                        transparent
                        opacity={0.6}
                    />
                    <Html position={[0, 0.25, 0]} center>
                        <div className={`text-[8px] px-1 py-0.5 rounded-full font-bold whitespace-nowrap
                            ${zone.type === 'compression' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                            {zone.type === 'compression' ? 'NÉN' : 'GIÃN'}
                        </div>
                    </Html>
                </mesh>
            ))}

            {/* MIỆNG (nguồn phát) */}
            <mesh position={[-4.2, 0.2, 0]}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.3} />
            </mesh>
            <Html position={[-4.5, 0.6, 0]} center>
                <div className="bg-orange-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                    👄 MIỆNG (Nguồn phát)
                </div>
            </Html>

            {/* TAI (nơi nhận) */}
            <mesh position={[4, 0.15, 0]}>
                <sphereGeometry args={[0.18, 32, 32]} />
                <meshStandardMaterial color="#8b5cf6" />
            </mesh>
            <Html position={[4.2, 0.5, 0]} center>
                <div className="bg-purple-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                    👂 TAI (Nơi nhận)
                </div>
            </Html>

            {/* Phương truyền sóng */}
            <Line points={[[-5, -0.8, 0], [5, -0.8, 0]]} color="#3b82f6" lineWidth={2} />
            {showPropagation && (
                <>
                    <mesh position={[5.2, -0.8, 0]} rotation={[0, 0, -Math.PI / 2]}>
                        <coneGeometry args={[0.1, 0.4, 8]} />
                        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
                    </mesh>
                    <Html position={[5.8, -0.5, 0]} center>
                        <div className="bg-blue-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                            <Move className="w-3 h-3" />
                            Phương truyền sóng (x)
                        </div>
                    </Html>
                </>
            )}

            {/* Nhãn trục */}
            <Html position={[5.5, 0.3, 0]} center><div className="text-blue-400 text-sm font-bold">x</div></Html>
            <Html position={[0, 1, 0]} center><div className="text-orange-400 text-sm font-bold">Dao động</div></Html>
        </group>
    )
}

// ===== COMPONENT SÓNG NGANG 3D =====
function SongNgangVisualization({
    amplitude,
    wavelength,
    frequency,
    time,
    showRings,
    showRays,
    showPropagation,
    decay = 0.35
}: {
    amplitude: number
    wavelength: number
    frequency: number
    time: number
    showRings: boolean
    showRays: boolean
    showPropagation: boolean
    decay?: number
}) {
    const omega = 2 * Math.PI * frequency
    const k = 2 * Math.PI / wavelength
    const maxRadius = 4.5

    // Vòng tròn sóng đồng tâm
    const rings = useMemo(() => {
        const ringsData: { radius: number; points: THREE.Vector3[] }[] = []
        for (let r = 0.8; r <= maxRadius; r += 0.7) {
            const points: THREE.Vector3[] = []
            const bienDo = amplitude * Math.exp(-decay * r)
            const y = bienDo * Math.cos(omega * time - k * r)
            for (let i = 0; i <= 80; i++) {
                const angle = (i / 80) * Math.PI * 2
                const x = Math.cos(angle) * r
                const z = Math.sin(angle) * r
                points.push(new THREE.Vector3(x, y + 0.05, z))
            }
            ringsData.push({ radius: r, points })
        }
        return ringsData
    }, [amplitude, wavelength, frequency, time, decay, maxRadius, omega, k])

    // Tia sóng tỏa ra
    const rays = useMemo(() => {
        const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
        return angles.map(deg => {
            const rad = deg * Math.PI / 180
            const points: THREE.Vector3[] = []
            for (let r = 0; r <= maxRadius; r += 0.15) {
                const x = Math.cos(rad) * r
                const z = Math.sin(rad) * r
                const bienDo = amplitude * Math.exp(-decay * r)
                const y = bienDo * Math.cos(omega * time - k * r)
                points.push(new THREE.Vector3(x, y + 0.03, z))
            }
            return points
        })
    }, [amplitude, wavelength, frequency, time, decay, maxRadius, omega, k])

    // Đường sóng hình sin khi nhìn ngang
    const sideWavePoints = useMemo(() => {
        const points: THREE.Vector3[] = []
        for (let x = -5; x <= 5; x += 0.1) {
            const r = Math.abs(x)
            const bienDo = amplitude * Math.exp(-decay * r)
            const y = bienDo * Math.cos(omega * time - k * r)
            points.push(new THREE.Vector3(x, y + 0.5, -3.5))
        }
        return points
    }, [amplitude, wavelength, frequency, time, decay, omega, k])

    return (
        <group>
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[0, 10, 0]} intensity={0.5} />

            <gridHelper args={[12, 20, '#4b5563', '#374151']} position={[0, -1, -1]} />
            <axesHelper args={[6]} />

            {/* Mặt nước tham chiếu */}
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[5.5, 32]} />
                <meshStandardMaterial color="#1e40af" transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>

            {/* Vòng tròn sóng */}
            {showRings && rings.map((ring, idx) => (
                <Line key={`ring-${idx}`} points={ring.points} color="#3b82f6" lineWidth={2} />
            ))}

            {/* Tia sóng */}
            {showRays && rays.map((ray, idx) => (
                <Line key={`ray-${idx}`} points={ray} color="#60a5fa" lineWidth={1} />
            ))}

            {/* Đường sóng hình sin khi nhìn ngang */}
            <Line points={sideWavePoints} color="#3b82f6" lineWidth={3} />
            <Line points={[[-5, 0.5, -3.5], [5, 0.5, -3.5]]} color="#6b7280" lineWidth={1} dashed />
            <Html position={[0, 1.2, -3.5]} center>
                <div className="bg-blue-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                    🌊 Sóng hình sin (nhìn ngang)
                </div>
            </Html>

            {/* Quả bóng rơi ở tâm */}
            <mesh position={[0, 0.15, 0]}>
                <sphereGeometry args={[0.18, 32, 32]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, 0.5, 0]} center>
                <div className="bg-red-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                    💧 Điểm rơi
                </div>
            </Html>

            {/* Phương truyền sóng */}
            <Line points={[[-5, -0.8, 0], [5, -0.8, 0]]} color="#3b82f6" lineWidth={2} />
            {showPropagation && (
                <>
                    <mesh position={[5.2, -0.8, 0]} rotation={[0, 0, -Math.PI / 2]}>
                        <coneGeometry args={[0.1, 0.4, 8]} />
                        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
                    </mesh>
                    <Html position={[5.8, -0.5, 0]} center>
                        <div className="bg-blue-500/90 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                            <Move className="w-3 h-3" />
                            Phương truyền sóng
                        </div>
                    </Html>
                </>
            )}

            {/* Nhãn trục */}
            <Html position={[5.5, 0.3, 0]} center><div className="text-blue-400 text-sm font-bold">x</div></Html>
            <Html position={[0, 1, 1.5]} center><div className="text-green-400 text-sm font-bold">z</div></Html>
        </group>
    )
}

// ===== THANH TRƯỢT =====
type MauType = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'

interface ThanhTruotProps {
    label: string
    value: number
    min: number
    max: number
    step: number
    onChange: (value: number) => void
    donVi?: string
    ghiChu?: string
    icon?: React.ElementType
    mau?: MauType
}

function ThanhTruot({ label, value, min, max, step, onChange, donVi = "", ghiChu = "", icon: Icon, mau = 'blue' }: ThanhTruotProps) {
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
                className={`w-full h-2 bg-gradient-to-r ${mauClasses[mau]} rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:shadow-lg`}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{min}{donVi}</span>
                <span>{max}{donVi}</span>
            </div>
            {ghiChu && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ghiChu}</p>}
        </div>
    )
}

// ===== NÚT GRADIENT =====
const NutGradient = ({ children, onClick, gradient = 'from-blue-500 to-blue-600', hover = 'hover:from-blue-600 hover:to-blue-700', disabled = false }: any) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2.5 bg-gradient-to-r ${gradient} ${hover} text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
    >
        {children}
    </button>
)

// ===== CARD THÔNG SỐ =====
const CardThongSo = ({ tieuDe, giaTri, donVi, icon: Icon, mau = 'blue' }: any) => {
    const mauClasses: Record<MauType, string> = {
        blue: 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-300',
        green: 'bg-green-50 border-green-100 text-green-700 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-300',
        purple: 'bg-purple-50 border-purple-100 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800/30 dark:text-purple-300',
        orange: 'bg-orange-50 border-orange-100 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800/30 dark:text-orange-300',
        red: 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-300',
        yellow: 'bg-yellow-50 border-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800/30 dark:text-yellow-300',
    }
    const mauKey = mau as MauType

    return (
        <div className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${mauClasses[mauKey]}`}>
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
export default function SoSanhSong() {
    // ===== STATE =====
    const [dangChay, setDangChay] = useState(true)
    const [khoaCamera, setKhoaCamera] = useState(false)
    const [toanManHinh, setToanManHinh] = useState(false)
    const [tabHienTai, setTabHienTai] = useState('dieuKhien')

    // Thông số chung
    const [amplitude, setAmplitude] = useState(0.35)
    const [wavelength, setWavelength] = useState(2.2)
    const [frequency, setFrequency] = useState(0.65)
    const [tocDoThoiGian, setTocDoThoiGian] = useState(1.0)

    // Hiển thị sóng dọc
    const [showCompression, setShowCompression] = useState(true)
    const [showParticles, setShowParticles] = useState(true)
    const [showPropagation, setShowPropagation] = useState(true)

    // Hiển thị sóng ngang
    const [showRings, setShowRings] = useState(true)
    const [showRays, setShowRays] = useState(true)

    // Dữ liệu thời gian thực
    const [time, setTime] = useState(0)
    const [lichSuU, setLichSuU] = useState<number[]>([])
    const [lichSuH, setLichSuH] = useState<number[]>([])
    const [lichSuV, setLichSuV] = useState<number[]>([])
    const [lichSuE, setLichSuE] = useState<number[]>([])
    const [lichSuT, setLichSuT] = useState<number[]>([])

    const [isClient, setIsClient] = useState(false)

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
                setTime(t => {
                    let newTime = t + dt
                    const period = 1 / frequency
                    if (newTime > period) newTime -= period
                    return newTime
                })
            }

            lastTime = currentTime
            animationFrameId = requestAnimationFrame(capNhatThoiGian)
        }

        animationFrameId = requestAnimationFrame(capNhatThoiGian)
        return () => cancelAnimationFrame(animationFrameId)
    }, [isClient, dangChay, tocDoThoiGian, frequency])

    // Cập nhật dữ liệu lịch sử
    useEffect(() => {
        if (!dangChay) return

        const omega = 2 * Math.PI * frequency
        const u = amplitude * Math.cos(omega * time)
        const waveH = amplitude * Math.cos(omega * time)
        const v = -amplitude * omega * Math.sin(omega * time)
        const e = 0.5 * amplitude * amplitude * omega * omega

        const maxSamples = 300
        setLichSuT(h => [...h.slice(-maxSamples), time])
        setLichSuU(h => [...h.slice(-maxSamples), u])
        setLichSuH(h => [...h.slice(-maxSamples), waveH])
        setLichSuV(h => [...h.slice(-maxSamples), v])
        setLichSuE(h => [...h.slice(-maxSamples), e])
    }, [time, dangChay, amplitude, frequency])

    // Tính toán các đại lượng vật lý
    const tinhToanVatLy = useMemo(() => {
        const omega = 2 * Math.PI * frequency
        const k = 2 * Math.PI / wavelength
        const vanTocPha = omega / k
        const chuKy = 1 / frequency
        const tanSoGoc = omega
        const soSong = k
        const vanTocCucDai = amplitude * omega
        const giaTocCucDai = amplitude * omega * omega
        const nangLuong = 0.5 * amplitude * amplitude * omega * omega

        return { omega, k, vanTocPha, chuKy, tanSoGoc, soSong, vanTocCucDai, giaTocCucDai, nangLuong }
    }, [amplitude, frequency, wavelength])

    const xuLyReset = useCallback(() => {
        setTime(0)
        setAmplitude(0.35)
        setWavelength(2.2)
        setFrequency(0.65)
        setTocDoThoiGian(1.0)
        setLichSuU([])
        setLichSuH([])
        setLichSuV([])
        setLichSuE([])
        setLichSuT([])
    }, [])

    // Loading state
    if (!isClient) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="h-[500px] bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                        🌊 So Sánh Sóng Dọc và Sóng Ngang
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Sóng dọc (âm thanh) | Sóng ngang (gợn sóng mặt nước) - Mô phỏng 3D chi tiết
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
                        gradient={khoaCamera ? 'from-red-500 to-orange-500' : 'from-orange-500 to-blue-500'}
                    >
                        {khoaCamera ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        {khoaCamera ? "Mở Camera" : "Khóa Camera"}
                    </NutGradient>

                    <NutGradient onClick={xuLyReset} gradient="from-gray-600 to-gray-700">
                        <RotateCcw className="w-4 h-4" />
                        Đặt Lại
                    </NutGradient>

                    <NutGradient
                        onClick={() => setDangChay(!dangChay)}
                        gradient={dangChay ? 'from-yellow-500 to-orange-500' : 'from-green-500 to-emerald-500'}
                    >
                        {dangChay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {dangChay ? "Tạm Dừng" : "Phát"}
                    </NutGradient>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SÓNG DỌC */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-orange-500" />
                        <h2 className="text-xl font-bold text-orange-600">Sóng Dọc - Âm Thanh</h2>
                    </div>
                    <div className="h-[380px] rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-900 to-black shadow-xl relative">
                        <Canvas camera={{ position: [0, 1, 10], fov: 45 }}>
                            <Suspense fallback={null}>
                                <SongDocVisualization
                                    amplitude={amplitude}
                                    wavelength={wavelength}
                                    frequency={frequency}
                                    time={time}
                                    showCompression={showCompression}
                                    showParticles={showParticles}
                                    showPropagation={showPropagation}
                                />
                            </Suspense>
                            <OrbitControls enabled={!khoaCamera} minDistance={5} maxDistance={15} />
                        </Canvas>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        Các phần tử dao động dọc theo phương truyền | Đỏ = nén, Xanh = giãn
                    </p>
                </div>

                {/* SÓNG NGANG */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <h2 className="text-xl font-bold text-blue-600">Sóng Ngang - Gợn Sóng Nước</h2>
                    </div>
                    <div className="h-[380px] rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-900 to-black shadow-xl relative">
                        <Canvas camera={{ position: [5, 4, 7], fov: 45 }}>
                            <Suspense fallback={null}>
                                <SongNgangVisualization
                                    amplitude={amplitude}
                                    wavelength={wavelength}
                                    frequency={frequency}
                                    time={time}
                                    showRings={showRings}
                                    showRays={showRays}
                                    showPropagation={showPropagation}
                                    decay={0.4}
                                />
                            </Suspense>
                            <OrbitControls enabled={!khoaCamera} minDistance={3} maxDistance={12} />
                        </Canvas>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        Sóng tròn loang từ tâm | Biên độ giảm dần khi ra xa | Xoay chuột để xem 3D
                    </p>
                </div>
            </div>

            {/* Navigation tab */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl mt-6">
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
                            ? 'bg-white dark:bg-gray-800 shadow-lg text-orange-600 dark:text-orange-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Nội dung tab */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mt-6">
                {tabHienTai === 'dieuKhien' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Bảng Điều Khiển Thông Số
                        </h3>

                        <ThanhTruot
                            label="Biên độ sóng (A)"
                            value={amplitude}
                            min={0.1}
                            max={0.8}
                            step={0.01}
                            onChange={setAmplitude}
                            donVi=" m"
                            ghiChu="Độ lệch lớn nhất của phần tử so với VTCB"
                            icon={Activity}
                            mau="orange"
                        />

                        <ThanhTruot
                            label="Bước sóng (λ)"
                            value={wavelength}
                            min={1.5}
                            max={4}
                            step={0.1}
                            onChange={setWavelength}
                            donVi=" m"
                            ghiChu="Khoảng cách giữa hai đỉnh sóng liên tiếp"
                            icon={Ruler}
                            mau="blue"
                        />

                        <ThanhTruot
                            label="Tần số (f)"
                            value={frequency}
                            min={0.3}
                            max={1.2}
                            step={0.05}
                            onChange={setFrequency}
                            donVi=" Hz"
                            ghiChu="Số dao động trong một giây"
                            icon={Waves}
                            mau="green"
                        />

                        <ThanhTruot
                            label="Tốc độ mô phỏng"
                            value={tocDoThoiGian}
                            min={0.2}
                            max={2.5}
                            step={0.1}
                            onChange={setTocDoThoiGian}
                            donVi="x"
                            ghiChu="1x = Thời gian thực"
                            icon={Gauge}
                            mau="purple"
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
                            <h4 className="font-medium text-gray-700 dark:text-gray-300">Sóng dọc</h4>
                            <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                                        <Target className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Vùng nén và giãn</div>
                                        <div className="text-sm text-gray-500">Đánh dấu vùng nén (đỏ) và giãn (xanh)</div>
                                    </div>
                                </div>
                                <input type="checkbox" checked={showCompression} onChange={(e) => setShowCompression(e.target.checked)} className="w-5 h-5" />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Các phần tử</div>
                                        <div className="text-sm text-gray-500">Hiển thị các hạt dao động</div>
                                    </div>
                                </div>
                                <input type="checkbox" checked={showParticles} onChange={(e) => setShowParticles(e.target.checked)} className="w-5 h-5" />
                            </label>

                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mt-4">Sóng ngang</h4>
                            <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <Waves className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Vòng tròn sóng</div>
                                        <div className="text-sm text-gray-500">Hiển thị các vòng tròn đồng tâm</div>
                                    </div>
                                </div>
                                <input type="checkbox" checked={showRings} onChange={(e) => setShowRings(e.target.checked)} className="w-5 h-5" />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                                        <Move className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Tia sóng</div>
                                        <div className="text-sm text-gray-500">Hiển thị các tia tỏa ra từ tâm</div>
                                    </div>
                                </div>
                                <input type="checkbox" checked={showRays} onChange={(e) => setShowRays(e.target.checked)} className="w-5 h-5" />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                        <Move className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Phương truyền sóng</div>
                                        <div className="text-sm text-gray-500">Hiển thị mũi tên chỉ hướng</div>
                                    </div>
                                </div>
                                <input type="checkbox" checked={showPropagation} onChange={(e) => setShowPropagation(e.target.checked)} className="w-5 h-5" />
                            </label>
                        </div>
                    </div>
                )}

                {tabHienTai === 'vatLy' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            Thông Tin Vật Lý Sóng Cơ
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <CardThongSo
                                tieuDe="Tần số (f)"
                                giaTri={frequency.toFixed(2)}
                                donVi="Hz"
                                icon={Activity}
                                mau="blue"
                            />
                            <CardThongSo
                                tieuDe="Chu kỳ (T)"
                                giaTri={tinhToanVatLy.chuKy.toFixed(3)}
                                donVi="s"
                                icon={Clock}
                                mau="purple"
                            />
                            <CardThongSo
                                tieuDe="Bước sóng (λ)"
                                giaTri={wavelength.toFixed(2)}
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
                                tieuDe="Biên độ (A)"
                                giaTri={amplitude.toFixed(3)}
                                donVi="m"
                                icon={Activity}
                                mau="red"
                            />
                            <CardThongSo
                                tieuDe="Tần số góc (ω)"
                                giaTri={tinhToanVatLy.tanSoGoc.toFixed(2)}
                                donVi="rad/s"
                                icon={Target}
                                mau="purple"
                            />
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">📐 Công Thức Sóng Cơ</h4>
                            <div className="space-y-3 text-sm">
                                <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                    <div className="font-mono text-orange-600 dark:text-orange-400 mb-1">u(x,t) = A·cos(ωt - kx)</div>
                                    <div className="text-gray-600 dark:text-gray-400">Phương trình sóng tổng quát</div>
                                </div>
                                <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                    <div className="font-mono text-blue-600 dark:text-blue-400 mb-1">v = λ·f = ω/k</div>
                                    <div className="text-gray-600 dark:text-gray-400">Vận tốc truyền sóng</div>
                                </div>
                                <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                    <div className="font-mono text-green-600 dark:text-green-400 mb-1">ω = 2πf, k = 2π/λ</div>
                                    <div className="text-gray-600 dark:text-gray-400">Tần số góc và số sóng</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                So sánh sóng dọc và sóng ngang
                            </h4>
                            <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                                <li>• <strong>Sóng dọc:</strong> Dao động trùng phương truyền sóng (ví dụ: âm thanh)</li>
                                <li>• <strong>Sóng ngang:</strong> Dao động vuông góc phương truyền sóng (ví dụ: sóng nước)</li>
                                <li>• Sóng dọc gồm vùng nén và giãn, sóng ngang gồm đỉnh và hõm</li>
                                <li>• Cả hai đều truyền năng lượng nhưng không truyền vật chất</li>
                            </ul>
                        </div>
                    </div>
                )}

                {tabHienTai === 'doThi' && (
                    <div className="space-y-6">
                        <SoSanhSongChart
                            timeData={lichSuT}
                            displacementData={lichSuU}
                            waveHeightData={lichSuH}
                            velocityData={lichSuV}
                            energyData={lichSuE}
                            amplitude={amplitude}
                            frequency={frequency}
                            wavelength={wavelength}
                        />
                    </div>
                )}
            </div>

            {/* Cột phải - Thông tin bổ sung (đặt dưới cùng vì đã có grid 2 cột ở trên) */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-5 border border-orange-100 dark:border-orange-900/30">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-orange-500" />
                        Sóng Dọc - Ứng Dụng
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🔊</span>
                            <div>
                                <div className="font-medium">Âm thanh</div>
                                <div className="text-gray-600 dark:text-gray-400">Truyền trong không khí, nước, chất rắn</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🌋</span>
                            <div>
                                <div className="font-medium">Sóng địa chấn P</div>
                                <div className="text-gray-600 dark:text-gray-400">Sóng sơ cấp trong động đất</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🩺</span>
                            <div>
                                <div className="font-medium">Siêu âm</div>
                                <div className="text-gray-600 dark:text-gray-400">Chẩn đoán hình ảnh y tế</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        Sóng Ngang - Ứng Dụng
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🌊</span>
                            <div>
                                <div className="font-medium">Sóng nước</div>
                                <div className="text-gray-600 dark:text-gray-400">Gợn sóng khi thả đá xuống nước</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🌋</span>
                            <div>
                                <div className="font-medium">Sóng địa chấn S</div>
                                <div className="text-gray-600 dark:text-gray-400">Sóng thứ cấp trong động đất</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">💡</span>
                            <div>
                                <div className="font-medium">Ánh sáng</div>
                                <div className="text-gray-600 dark:text-gray-400">Sóng điện từ là sóng ngang</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>🎯 <strong>Mô phỏng so sánh sóng dọc và sóng ngang</strong> - Phát triển dành cho học sinh Việt Nam</p>
                    <p className="mt-1">Xoay chuột để xem 3D | Điều chỉnh thông số để quan sát sự thay đổi</p>
                </div>
            </div>
        </div>
    )
}