'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import DoThiConLac from '../PendulumSimulation/PendulumChart'
import LatexPanel from './LatexPanel'
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
    AlertTriangle
} from 'lucide-react'

// ===== SPRING MASS VISUALIZATION =====
function MoHinhLoXo3D({
    x,
    khoaCamera,
    batDauKeo,
    ketThucKeo,
    capNhatKeo,
}: {
    x: number
    khoaCamera: boolean
    batDauKeo: () => void
    ketThucKeo: () => void
    capNhatKeo: (y: number) => void
}) {
    const vatNangRef = useRef<THREE.Mesh>(null)

    // Tạo geometry cho lò xo
    const diemLoXo = useMemo(() => {
        const diem: THREE.Vector3[] = []
        const soVong = 18
        const banKinh = 0.1
        const phanDoan = soVong * 16

        // Chiều dài lò xo từ điểm treo đến vật nặng
        const chieuDaiLoXo = Math.max(0.5, 1.8 - x)

        for (let i = 0; i <= phanDoan; i++) {
            const t = i / phanDoan
            const goc = t * soVong * Math.PI * 2

            const xPos = banKinh * Math.cos(goc)
            const yPos = -chieuDaiLoXo * t
            const zPos = banKinh * Math.sin(goc)

            diem.push(new THREE.Vector3(xPos, yPos, zPos))
        }

        return diem
    }, [x])

    // Vị trí vật nặng
    const viTriVatNang = -Math.max(0.5, 1.8 - x)

    return (
        <>
            {/* Ánh sáng */}
            <ambientLight intensity={0.7} />
            <pointLight position={[2, 2, 2]} intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />

            {/* TRẦN NHÀ */}
            <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[1.5, 0.1, 0.3]} />
                <meshStandardMaterial color="#4b5563" metalness={0.3} roughness={0.4} />
            </mesh>

            {/* ĐIỂM TREO LÒ XO */}
            <mesh position={[0, 0.15, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.1]} />
                <meshStandardMaterial color="#374151" />
            </mesh>

            {/* LÒ XO XOẮN ỐC */}
            <Line
                points={diemLoXo}
                color="#f59e0b"
                lineWidth={4}
            />

            {/* ĐIỂM NỐI DƯỚI LÒ XO */}
            <mesh position={[0, viTriVatNang, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.08]} />
                <meshStandardMaterial color="#374151" />
            </mesh>

            {/* VẬT NẶNG */}
            <mesh
                ref={vatNangRef}
                position={[0, viTriVatNang - 0.15, 0]}
                onPointerDown={(e) => {
                    e.stopPropagation()
                    batDauKeo()
                }}
                onPointerUp={(e) => {
                    e.stopPropagation()
                    ketThucKeo()
                }}
                onPointerMove={(e) => {
                    e.stopPropagation()
                    if (!vatNangRef.current) return
                    const yMoi = Math.max(-2.5, Math.min(-0.8, e.point.y))
                    capNhatKeo(yMoi)
                }}
            >
                <sphereGeometry args={[0.18, 32, 32]} />
                <meshStandardMaterial
                    color="#ef4444"
                    metalness={0.3}
                    roughness={0.4}
                    emissive="#ef4444"
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* SÀN NHÀ THAM CHIẾU */}
            <gridHelper args={[4, 10, '#6b7280', '#9ca3af']} position={[0, -2, 0]} rotation={[0, 0, 0]} />

            {/* VỊ TRÍ CÂN BẰNG */}
            <mesh position={[0, -1.3, 0]}>
                <boxGeometry args={[0.4, 0.01, 0.01]} />
                <meshBasicMaterial color="#10b981" />
            </mesh>

            {/* TRỤC TỌA ĐỘ */}
            <axesHelper args={[2]} />
        </>
    )
}

// ===== THANH TRƯỢT CẢI TIẾN =====
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
    icon: Icon
}: any) {
    const mauClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600'
    }

    const mau = 'blue' // Có thể thay đổi theo props nếu cần

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                </div>
                {hienThiGiaTri && (
                    <span className={`text-sm font-bold bg-gradient-to-r ${mauClasses[mau]} text-transparent bg-clip-text`}>
                        {value.toFixed(2)}{donVi}
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
    className = ''
}: any) => (
    <button
        onClick={onClick}
        className={`px-4 py-2.5 bg-gradient-to-r ${gradient} ${hover} text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl ${className}`}
    >
        {children}
    </button>
)

// ===== CARD THÔNG SỐ =====
const CardThongSo = ({ tieuDe, giaTri, donVi, icon: Icon, mau = 'blue' }: any) => {
    const mauClasses = {
        blue: 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-300',
        green: 'bg-green-50 border-green-100 text-green-700 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-300',
        purple: 'bg-purple-50 border-purple-100 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800/30 dark:text-purple-300',
        orange: 'bg-orange-50 border-orange-100 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800/30 dark:text-orange-300',
        red: 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-300',
    }

    return (
        <div className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md `}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium opacity-80">{tieuDe}</span>
                {Icon && <Icon className="w-4 h-4 opacity-70" />}
            </div>
            <div className="text-2xl font-bold">{giaTri}</div>
            {donVi && <div className="text-sm opacity-70 mt-1">{donVi}</div>}
        </div>
    )
}

// ===== HẰNG SỐ VẬT LÝ =====
const GIA_TOC_TRONG_TRUONG = 9.81
const KHOI_LUONG_VAT_NANG = 2 // kg

// ===== COMPONENT CHÍNH =====
export default function MoPhongLoXo3D() {
    // ===== STATE =====
    const [dangChay, setDangChay] = useState(false)
    const [daBiTacDong, setDaBiTacDong] = useState(false)
    const [khoaCamera, setKhoaCamera] = useState(false)
    const [dangKeo, setDangKeo] = useState(false)
    const [toanManHinh, setToanManHinh] = useState(false)
    const [tabHienTai, setTabHienTai] = useState('dieuKhien') // 'dieuKhien', 'vatLy', 'nangLuong', 'doThi'

    const [x, setX] = useState(0)
    const [v, setV] = useState(0)
    const [t, setT] = useState(0)

    const [lichSuX, setLichSuX] = useState<number[]>([])
    const [lichSuV, setLichSuV] = useState<number[]>([])
    const [lichSuT, setLichSuT] = useState<number[]>([])

    const [isClient, setIsClient] = useState(false)

    // ===== THÔNG SỐ VẬT LÝ CÓ THỂ ĐIỀU CHỈNH =====
    const [k, setK] = useState(10) // Hằng số lò xo
    const [m, setM] = useState(1) // Khối lượng
    const [heSoCan, setHeSoCan] = useState(0.2) // Hệ số cản
    const [tocDoThoiGian, setTocDoThoiGian] = useState(1.0)

    // Set isClient to true after mount
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Physics animation loop
    useEffect(() => {
        if (!isClient || !daBiTacDong) return

        let animationFrameId: number
        let lastTime: number | null = null

        const capNhatVatLy = (currentTime: number) => {
            if (lastTime === null) {
                lastTime = currentTime
                animationFrameId = requestAnimationFrame(capNhatVatLy)
                return
            }

            if (!dangChay || dangKeo) {
                lastTime = currentTime
                animationFrameId = requestAnimationFrame(capNhatVatLy)
                return
            }

            const deltaTime = (currentTime - lastTime) * 0.001
            const dt = deltaTime * tocDoThoiGian

            // Tính toán vật lý - dao động điều hòa có cản
            const a = (-k * x - heSoCan * v) / m

            const vMoi = v + a * dt
            const xMoi = x + vMoi * dt
            const tMoi = t + dt

            setV(vMoi)
            setX(xMoi)
            setT(tMoi)

            // Giữ lại 300 mẫu dữ liệu
            const maxSamples = 300
            setLichSuX(h => [...h.slice(-maxSamples), xMoi])
            setLichSuV(h => [...h.slice(-maxSamples), vMoi])
            setLichSuT(h => [...h.slice(-maxSamples), tMoi])

            lastTime = currentTime
            animationFrameId = requestAnimationFrame(capNhatVatLy)
        }

        animationFrameId = requestAnimationFrame(capNhatVatLy)

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [isClient, dangChay, dangKeo, x, v, t, k, m, heSoCan, tocDoThoiGian, daBiTacDong])

    const xuLyBatDauKeo = useCallback(() => {
        setDangKeo(true)
        setDaBiTacDong(true)
    }, [])

    const xuLyKetThucKeo = useCallback(() => {
        setDangKeo(false)
        setDangChay(true)
    }, [])

    const xuLyCapNhatKeo = useCallback((yMoi: number) => {
        const doDanHoi = -yMoi - 1.3
        setX(doDanHoi)
    }, [])

    const xuLyReset = useCallback(() => {
        setX(0)
        setV(0)
        setT(0)
        setDaBiTacDong(false)
        setDangChay(false)
        setLichSuX([])
        setLichSuV([])
        setLichSuT([])
    }, [])

    const xuLyBatDauMoPhong = useCallback(() => {
        if (!daBiTacDong) {
            setX(0.2)
            setDaBiTacDong(true)
        }
        setDangChay(true)
    }, [daBiTacDong])

    const xuLyTamDungMoPhong = useCallback(() => {
        setDangChay(false)
    }, [])

    // Tính toán tính chất vật lý
    const tanSoTuNhien = Math.sqrt(k / m)
    const chuKy = 2 * Math.PI / tanSoTuNhien
    const tiLeCan = heSoCan / (2 * Math.sqrt(k * m))

    // Chuẩn bị dữ liệu cho đồ thị
    const duLieuDoThi = useMemo(() => {
        return lichSuT.map((thoiGian, index) => ({
            time: thoiGian,
            angle: lichSuX[index] || 0,
            velocity: lichSuV[index] || 0,
            kineticEnergy: 0.5 * m * Math.pow(lichSuV[index] || 0, 2),
            potentialEnergy: 0.5 * k * Math.pow(lichSuX[index] || 0, 2),
            totalEnergy: 0.5 * m * Math.pow(lichSuV[index] || 0, 2) + 0.5 * k * Math.pow(lichSuX[index] || 0, 2)
        }))
    }, [lichSuT, lichSuX, lichSuV, m, k])

    // Tính toán năng lượng
    const dongNang = 0.5 * m * Math.pow(v, 2)
    const theNang = 0.5 * k * Math.pow(x, 2)
    const tongNangLuong = dongNang + theNang

    // Loading state for SSR
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
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ⏰ Mô Phỏng Con Lắc Lò Xo 3D
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Mô phỏng vật lý con lắc lò xo với đồ thị phân tích chi tiết - Dành cho học sinh Việt Nam
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setToanManHinh(!toanManHinh)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title={toanManHinh ? "Thoát toàn màn hình" : "Toàn màn hình"}
                    >
                        {toanManHinh ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>

                    <NutGradient
                        onClick={() => setKhoaCamera(!khoaCamera)}
                        gradient={khoaCamera ? 'from-red-500 to-orange-500' : 'from-blue-500 to-purple-500'}
                        hover={khoaCamera ? 'hover:from-red-600 hover:to-orange-600' : 'hover:from-blue-600 hover:to-purple-600'}
                    >
                        {khoaCamera ? (
                            <>
                                <Unlock className="w-4 h-4 inline mr-2" />
                                Mở Camera
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4 inline mr-2" />
                                Khóa Camera
                            </>
                        )}
                    </NutGradient>

                    <NutGradient
                        onClick={xuLyReset}
                        gradient="from-gray-600 to-gray-700"
                        hover="hover:from-gray-700 hover:to-gray-800"
                    >
                        <RotateCcw className="w-4 h-4 inline mr-2" />
                        Đặt Lại
                    </NutGradient>

                    {!daBiTacDong ? (
                        <NutGradient
                            onClick={xuLyBatDauMoPhong}
                            gradient="from-green-500 to-emerald-500"
                            hover="hover:from-green-600 hover:to-emerald-600"
                        >
                            <Play className="w-4 h-4 inline mr-2" />
                            Bắt Đầu
                        </NutGradient>
                    ) : (
                        <NutGradient
                            onClick={dangChay ? xuLyTamDungMoPhong : xuLyBatDauMoPhong}
                            gradient={dangChay ? 'from-yellow-500 to-orange-500' : 'from-green-500 to-emerald-500'}
                            hover={dangChay ? 'hover:from-yellow-600 hover:to-orange-600' : 'hover:from-green-600 hover:to-emerald-600'}
                        >
                            {dangChay ? (
                                <>
                                    <Pause className="w-4 h-4 inline mr-2" />
                                    Tạm Dừng
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 inline mr-2" />
                                    Tiếp Tục
                                </>
                            )}
                        </NutGradient>
                    )}
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái - View 3D */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Container 3D */}
                    <div className="h-[500px] rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black shadow-xl relative">
                        <Canvas
                            camera={{ position: [1.5, 0, 2], fov: 50 }}
                        >
                            <Suspense fallback={null}>
                                <MoHinhLoXo3D
                                    x={x}
                                    khoaCamera={khoaCamera}
                                    batDauKeo={xuLyBatDauKeo}
                                    ketThucKeo={xuLyKetThucKeo}
                                    capNhatKeo={xuLyCapNhatKeo}
                                />
                            </Suspense>
                            <OrbitControls
                                enabled={!khoaCamera}
                                enablePan={true}
                                enableZoom={true}
                                enableRotate={true}
                                minDistance={1}
                                maxDistance={10}
                            />
                        </Canvas>

                        {/* Thông tin real-time */}
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white max-w-xs">
                            <div className="text-sm font-bold mb-2">📊 Thông Số Hiện Tại</div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Độ dời (x):</span>
                                    <span className="font-bold">{x.toFixed(3)} m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Vận tốc (v):</span>
                                    <span className="font-bold">{v.toFixed(3)} m/s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Thời gian:</span>
                                    <span className="font-bold">{t.toFixed(2)}s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Trạng thái:</span>
                                    <span className="font-bold">
                                        {!daBiTacDong ? "⚫ Nghỉ" : dangChay ? "▶ Dao động" : "⏸ Tạm dừng"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation tab */}
                    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                        {[
                            { id: 'dieuKhien', label: 'Bảng Điều Khiển', icon: Settings },
                            { id: 'vatLy', label: 'Thông Tin Vật Lý', icon: Brain },
                            { id: 'nangLuong', label: 'Phân Tích Năng Lượng', icon: Zap },
                            { id: 'doThi', label: 'Đồ Thị Phân Tích', icon: BarChart3 }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setTabHienTai(tab.id)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${tabHienTai === tab.id
                                    ? 'bg-white dark:bg-gray-800 shadow-lg text-blue-600 dark:text-blue-400'
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
                                    label="Hằng Số Lò Xo (k)"
                                    value={k}
                                    min={1}
                                    max={50}
                                    step={0.5}
                                    onChange={setK}
                                    donVi=" N/m"
                                    ghiChu="Độ cứng của lò xo. k càng lớn, lò xo càng cứng"
                                    icon={Zap}
                                />

                                <ThanhTruot
                                    label="Khối Lượng Vật Nặng (m)"
                                    value={m}
                                    min={0.1}
                                    max={5}
                                    step={0.1}
                                    onChange={setM}
                                    donVi=" kg"
                                    ghiChu="Khối lượng càng lớn, dao động càng chậm"
                                    icon={Weight}
                                />

                                <ThanhTruot
                                    label="Hệ Số Cản"
                                    value={heSoCan}
                                    min={0}
                                    max={2}
                                    step={0.05}
                                    onChange={setHeSoCan}
                                    donVi=" N·s/m"
                                    ghiChu="b = 0: Dao động không tắt dần. b > 0: Dao động tắt dần"
                                    icon={Activity}
                                />

                                <ThanhTruot
                                    label="Tốc Độ Mô Phỏng"
                                    value={tocDoThoiGian}
                                    min={0.1}
                                    max={5}
                                    step={0.1}
                                    onChange={setTocDoThoiGian}
                                    donVi="x"
                                    ghiChu="1x = Thời gian thực. 0.5x = Chậm 1/2. 5x = Nhanh gấp 5"
                                    icon={Gauge}
                                />

                                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                                    <div className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        <span><strong>Hướng dẫn:</strong> Kéo và thả vật nặng màu đỏ để thay đổi vị trí ban đầu. Điều chỉnh các thông số để quan sát sự thay đổi.</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {tabHienTai === 'vatLy' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Brain className="w-5 h-5" />
                                    Thông Tin Vật Lý Con Lắc Lò Xo
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <CardThongSo
                                        tieuDe="Chu Kỳ Dao Động"
                                        giaTri={chuKy.toFixed(2)}
                                        donVi="giây"
                                        icon={Clock}
                                        mau="blue"
                                    />
                                    <CardThongSo
                                        tieuDe="Tần Số Tự Nhiên"
                                        giaTri={tanSoTuNhien.toFixed(2)}
                                        donVi="rad/s"
                                        icon={Gauge}
                                        mau="purple"
                                    />
                                    <CardThongSo
                                        tieuDe="Tần Số Dao Động"
                                        giaTri={(tanSoTuNhien / (2 * Math.PI)).toFixed(2)}
                                        donVi="Hz"
                                        icon={RotateCcw}
                                        mau="green"
                                    />
                                    <CardThongSo
                                        tieuDe="Tỷ Lệ Cản"
                                        giaTri={tiLeCan.toFixed(3)}
                                        donVi=""
                                        mau="orange"
                                    />
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">📐 Công Thức Vật Lý Con Lắc Lò Xo</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <div className="font-mono text-blue-600 dark:text-blue-400 mb-1">T = 2π√(m/k)</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                <strong>Chu kỳ dao động:</strong> Phụ thuộc vào khối lượng và độ cứng lò xo
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <div className="font-mono text-green-600 dark:text-green-400 mb-1">mx'' + bx' + kx = 0</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                <strong>Phương trình dao động:</strong> Dao động điều hòa có cản
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <div className="font-mono text-purple-600 dark:text-purple-400 mb-1">ω₀ = √(k/m)</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                <strong>Tần số góc tự nhiên:</strong> Không phụ thuộc vào biên độ
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {tabHienTai === 'nangLuong' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Phân Tích Năng Lượng
                                </h3>

                                <div className="grid grid-cols-3 gap-4">
                                    <CardThongSo
                                        tieuDe="Động Năng"
                                        giaTri={dongNang.toFixed(2)}
                                        donVi="Joule"
                                        icon={Zap}
                                        mau="yellow"
                                    />
                                    <CardThongSo
                                        tieuDe="Thế Năng"
                                        giaTri={theNang.toFixed(2)}
                                        donVi="Joule"
                                        icon={Weight}
                                        mau="green"
                                    />
                                    <CardThongSo
                                        tieuDe="Tổng Năng Lượng"
                                        giaTri={tongNangLuong.toFixed(2)}
                                        donVi="Joule"
                                        icon={Shield}
                                        mau="purple"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Phần trăm Động năng:</span>
                                            <span className="font-bold text-yellow-600">
                                                {(dongNang / tongNangLuong * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                                                style={{ width: `${(dongNang / tongNangLuong) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Phần trăm Thế năng:</span>
                                            <span className="font-bold text-green-600">
                                                {(theNang / tongNangLuong * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300"
                                                style={{ width: `${(theNang / tongNangLuong) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <p className="font-bold mb-2">⚖️ Định Luật Bảo Toàn Năng Lượng:</p>
                                    <p>Trong hệ kín không có ma sát: <strong>E = K + U = hằng số</strong></p>
                                    <p className="mt-1">• Khi qua VTCB: Thế năng = 0, Động năng = cực đại</p>
                                    <p>• Ở biên: Động năng = 0, Thế năng = cực đại</p>
                                    <p className="mt-2 text-red-600 dark:text-red-400">
                                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                                        Khi có giảm chấn, tổng năng lượng giảm dần theo thời gian.
                                    </p>
                                </div>
                            </div>
                        )}

                        {tabHienTai === 'doThi' && (
                            <div className="space-y-6">
                                <DoThiConLac
                                    angleData={lichSuX}
                                    velocityData={lichSuV}
                                    energyData={duLieuDoThi.map(d => ({
                                        dongNang: d.kineticEnergy,
                                        theNang: d.potentialEnergy,
                                        tongNangLuong: d.totalEnergy
                                    }))}
                                    timeData={lichSuT}
                                    title="Phân Tích Dao Động Con Lắc Lò Xo"
                                    showEnergy={true}
                                    pendulumLength={1.8}
                                    gravity={GIA_TOC_TRONG_TRUONG}
                                    mass={m}
                                    pendulumType="spring"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Cột phải - Thông tin bổ sung */}
                <div className="space-y-6">
                    {/* Thông tin nhanh */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">📈 Thông Số Nhanh</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Độ Dời Hiện Tại (x)</div>
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{x.toFixed(3)} m</div>
                                <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                                    {x === 0 ? "Vị trí cân bằng" : x > 0 ? "Trên vị trí cân bằng" : "Dưới vị trí cân bằng"}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Vận Tốc Hiện Tại (v)</div>
                                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                    {v.toFixed(3)} m/s
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Tổng Năng Lượng</div>
                                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                    {tongNangLuong.toFixed(2)} J
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin hệ thống */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-lg">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Ruler className="w-5 h-5" />
                            Thông Tin Hệ Thống
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Độ cứng lò xo (k)</span>
                                <span className="font-semibold">{k.toFixed(2)} N/m</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Khối lượng vật nặng</span>
                                <span className="font-semibold">{m.toFixed(2)} kg</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Hệ số cản</span>
                                <span className="font-semibold">{heSoCan.toFixed(2)} N·s/m</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Tốc độ mô phỏng</span>
                                <span className="font-semibold">{tocDoThoiGian.toFixed(1)}x</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 dark:text-gray-400">Thời gian đã trôi</span>
                                <span className="font-semibold">{t.toFixed(1)} s</span>
                            </div>
                        </div>
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
                                <span>Kéo vật nặng màu đỏ để đặt vị trí ban đầu</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold">2.</span>
                                <span>Thả ra để bắt đầu dao động</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold">3.</span>
                                <span>Điều chỉnh các thông số ở bảng điều khiển</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold">4.</span>
                                <span>Chọn các tab để xem phân tích chi tiết</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-bold">5.</span>
                                <span>Kéo chuột trong view 3D để xoay camera</span>
                            </li>
                        </ul>
                    </div>

                    {/* Tóm tắt năng lượng */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-100 dark:border-green-900/30">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">⚡ Tóm Tắt Năng Lượng</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Động năng:</span>
                                    <span className="font-semibold text-yellow-600">{dongNang.toFixed(2)} J</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                                        style={{ width: `${(dongNang / tongNangLuong) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Thế năng:</span>
                                    <span className="font-semibold text-green-600">{theNang.toFixed(2)} J</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                                        style={{ width: `${(theNang / tongNangLuong) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="pt-3 border-t border-green-200 dark:border-green-800">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Tổng năng lượng</span>
                                    <span className="font-bold text-lg text-purple-600">{tongNangLuong.toFixed(2)} J</span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {heSoCan > 0 ? "⚠️ Năng lượng đang giảm do ma sát" : "✅ Năng lượng được bảo toàn"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>🎯 <strong>Mô phỏng vật lý con lắc lò xo</strong> - Phát triển dành cho học sinh Việt Nam</p>
                    <p className="mt-1">Ứng dụng cho bài học: Dao động điều hòa, Con lắc lò xo, Bảo toàn năng lượng</p>
                </div>
            </div>
        </div>
    )
}