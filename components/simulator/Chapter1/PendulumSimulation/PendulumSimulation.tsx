'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import {
    Play,
    Pause,
    RotateCcw,
    Lock,
    Unlock,
    Zap,
    BarChart3,
    Settings,
    Info,
    Maximize2,
    Minimize2,
    Ruler,
    Gauge,
    Weight,
    Shield,
    Clock,
    AlertTriangle,
    Brain
} from 'lucide-react'
import DoThiConLac from './PendulumChart'

// Component Line treo
function DayTreoConLac({
    start,
    end,
}: {
    start: [number, number, number]
    end: [number, number, number]
}) {
    const lineRef = useRef<THREE.Line>(null)

    useEffect(() => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...start),
            new THREE.Vector3(...end),
        ])

        const material = new THREE.LineBasicMaterial({
            color: '#666666',
            linewidth: 3
        })

        const line = new THREE.Line(geometry, material)
        // lineRef.current = line
    }, [])

    useEffect(() => {
        if (!lineRef.current) return

        const positions = new Float32Array([
            start[0], start[1], start[2],
            end[0], end[1], end[2],
        ])

        lineRef.current.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        )
        lineRef.current.geometry.attributes.position.needsUpdate = true
    }, [start, end])

    if (!lineRef.current) return null

    return <primitive object={lineRef.current} />
}

// Component 3D Con Lắc
function ConLac3D({
    chieuDai,
    dangChay,
    doGiamChan,
    tocDoThoiGian,
    gocBanDau = Math.PI / 4,
    capNhatGoc,
    capNhatVanTocGoc,
    capNhatViTri,
}: any) {
    const groupRef = useRef<THREE.Group>(null)
    const quaNangRef = useRef<THREE.Mesh>(null)
    const dayTreoRef = useRef<THREE.Line>(null)

    const gocHienTai = useRef(gocBanDau)
    const vanTocHienTai = useRef(0)

    const doGiamChanRef = useRef(doGiamChan)
    const tocDoThoiGianRef = useRef(tocDoThoiGian)

    const dangKeoRef = useRef(false)
    const daThaRaRef = useRef(false)
    const daKeoRef = useRef(false)
    const khoaChuotRef = useRef(false)

    useEffect(() => {
        doGiamChanRef.current = doGiamChan
    }, [doGiamChan])

    useEffect(() => {
        tocDoThoiGianRef.current = tocDoThoiGian
    }, [tocDoThoiGian])

    const tinhViTriQuaNang = (goc: number) => {
        return [
            chieuDai * Math.sin(goc),
            -chieuDai * Math.cos(goc),
            0
        ] as [number, number, number]
    }

    const [viTriQuaNang, setViTriQuaNang] = useState<[number, number, number]>(tinhViTriQuaNang(gocBanDau))

    useFrame((state, delta) => {
        if (!groupRef.current || !quaNangRef.current || dangKeoRef.current || !daThaRaRef.current) return

        if (dangChay) {
            const g = 9.81
            const dt = delta * tocDoThoiGianRef.current

            const giaToc =
                -(g / chieuDai) * Math.sin(gocHienTai.current) -
                doGiamChanRef.current * vanTocHienTai.current

            vanTocHienTai.current += giaToc * dt
            gocHienTai.current += vanTocHienTai.current * dt

            gocHienTai.current = THREE.MathUtils.clamp(gocHienTai.current, -Math.PI * 0.9, Math.PI * 0.9)

            const viTriMoi = tinhViTriQuaNang(gocHienTai.current)
            setViTriQuaNang(viTriMoi)

            if (quaNangRef.current) {
                quaNangRef.current.position.set(...viTriMoi)
            }

            if (dayTreoRef.current) {
                const dayTreoGeometry = dayTreoRef.current.geometry
                const positions = new Float32Array([
                    0, 0, 0,
                    viTriMoi[0], viTriMoi[1], viTriMoi[2]
                ])
                dayTreoGeometry.setAttribute(
                    'position',
                    new THREE.BufferAttribute(positions, 3)
                )
                dayTreoGeometry.attributes.position.needsUpdate = true
            }

            capNhatGoc?.(gocHienTai.current)
            capNhatVanTocGoc?.(vanTocHienTai.current)
            capNhatViTri?.(viTriMoi[0], viTriMoi[1])
        }
    })

    const xuLyNhanChuot = (e: any) => {
        e.stopPropagation()
        khoaChuotRef.current = true
        dangKeoRef.current = true
        daThaRaRef.current = false
        daKeoRef.current = false
    }

    const xuLyDiChuyenChuot = (e: any) => {
        if (!khoaChuotRef.current || !dangKeoRef.current || !e.intersections?.[0]?.point) return

        daKeoRef.current = true

        const diem = e.intersections[0].point
        const gocMoi = Math.atan2(diem.x, -diem.y)
        gocHienTai.current = Math.max(-Math.PI * 0.9, Math.min(Math.PI * 0.9, gocMoi))

        const viTriMoi = tinhViTriQuaNang(gocHienTai.current)
        setViTriQuaNang(viTriMoi)

        if (quaNangRef.current) {
            quaNangRef.current.position.set(...viTriMoi)
        }

        if (dayTreoRef.current) {
            const dayTreoGeometry = dayTreoRef.current.geometry
            const positions = new Float32Array([
                0, 0, 0,
                viTriMoi[0], viTriMoi[1], viTriMoi[2]
            ])
            dayTreoGeometry.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3)
            )
            dayTreoGeometry.attributes.position.needsUpdate = true
        }
    }

    const xuLyThaChuot = () => {
        dangKeoRef.current = false
        khoaChuotRef.current = false
        if (daKeoRef.current) {
            vanTocHienTai.current = 0
            daThaRaRef.current = true
        }
    }

    return (
        <group ref={groupRef}>
            {/* Điểm treo */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshStandardMaterial
                    color="#374151"
                    metalness={0.5}
                    roughness={0.3}
                />
            </mesh>

            {/* Thanh giá đỡ */}
            <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 1.2, 16]} />
                <meshStandardMaterial
                    color="#8b5a2b"
                    metalness={0.3}
                    roughness={0.7}
                />
            </mesh>

            {/* Dây treo */}
            <Line
                points={[[0, 0, 0], viTriQuaNang] as any}
                color="#6B7280"
                lineWidth={3}
            />

            {/* Quả nặng */}
            <mesh
                ref={quaNangRef}
                position={viTriQuaNang}
                onPointerDown={xuLyNhanChuot}
                onPointerMove={xuLyDiChuyenChuot}
                onPointerUp={xuLyThaChuot}
                onPointerLeave={xuLyThaChuot}
            >
                <sphereGeometry args={[0.22, 64, 64]} />
                <meshStandardMaterial
                    color={dangKeoRef.current ? "#F59E0B" : "#3B82F6"}
                    metalness={0.6}
                    roughness={0.3}
                    emissive={dangKeoRef.current ? "#F59E0B" : "#000000"}
                    emissiveIntensity={0.2}
                />

            </mesh>

            {/* Vị trí cân bằng */}
            <mesh position={[0, -chieuDai, 0]}>
                <boxGeometry args={[0.1, 0.02, 0.02]} />
                <meshBasicMaterial color="#10B981" />
            </mesh>
        </group>
    )
}

// Component vòng cung đo góc
function VongCungDoGoc({
    chieuDai,
    gocToiDa = Math.PI / 2,
}: {
    chieuDai: number
    gocToiDa?: number
}) {
    const diem = useMemo(() => {
        const soDiem = 48
        const cacDiem: [number, number, number][] = []

        for (let i = 0; i <= soDiem; i++) {
            const goc = -gocToiDa + (2 * gocToiDa * i) / soDiem
            cacDiem.push([
                chieuDai * Math.sin(goc),
                -chieuDai * Math.cos(goc),
                0,
            ])
        }

        return cacDiem
    }, [chieuDai, gocToiDa])

    return (
        <Line
            points={diem}
            color="#9CA3AF"
            lineWidth={1}
            dashed={false}
            transparent
            opacity={0.5}
        />
    )
}

// Nút Gradient
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

// Card thông số
const CardThongSo = ({ tieuDe, giaTri, donVi, icon: Icon, mau = 'blue' }: any) => {
    const mauClasses = {
        blue: 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-300',
        green: 'bg-green-50 border-green-100 text-green-700 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-300',
        purple: 'bg-purple-50 border-purple-100 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800/30 dark:text-purple-300',
        orange: 'bg-orange-50 border-orange-100 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800/30 dark:text-orange-300',
        red: 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-300',
    }

    return (
        <div className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium opacity-80">{tieuDe}</span>
                {Icon && <Icon className="w-4 h-4 opacity-70" />}
            </div>
            <div className="text-2xl font-bold">{giaTri}</div>
            {donVi && <div className="text-sm opacity-70 mt-1">{donVi}</div>}
        </div>
    )
}

// Thanh trượt cải tiến
const ThanhTruot = ({
    label,
    value,
    min,
    max,
    step,
    onChange,
    donVi = "",
    hienThiGiaTri = true,
    ghiChu = ""
}: any) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            {hienThiGiaTri && (
                <span className="text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
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
            className="w-full h-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
        />
        <div className="flex justify-between text-xs text-gray-500">
            <span>{min}{donVi}</span>
            <span>{max}{donVi}</span>
        </div>
        {ghiChu && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{ghiChu}</p>
        )}
    </div>
)

// Hằng số vật lý
const GIA_TOC_TRONG_TRUONG = 9.81
const KHOI_LUONG_QUA_NANG = 2 // kg

export default function MoPhongConLac3D() {
    // State
    const [chieuDaiConLac, setChieuDaiConLac] = useState(2)
    const [dangChay, setDangChay] = useState(true)
    const [hienThiDieuKhienCamera, setHienThiDieuKhienCamera] = useState(true)
    const [toanManHinh, setToanManHinh] = useState(false)
    const [gocHienTai, setGocHienTai] = useState(Math.PI / 4)
    const [vanTocGoc, setVanTocGoc] = useState(0)
    const [viTriHienTai, setViTriHienTai] = useState<[number, number]>([0, 0])
    const [doGiamChan, setDoGiamChan] = useState(0.02)
    const [tocDoThoiGian, setTocDoThoiGian] = useState(0.5)
    const [tabHienTai, setTabHienTai] = useState('dieuKhien') // 'dieuKhien', 'vatLy', 'nangLuong', 'doThi'

    // Lịch sử dữ liệu cho đồ thị
    const [lichSuGoc, setLichSuGoc] = useState<number[]>([])
    const [lichSuVanToc, setLichSuVanToc] = useState<number[]>([])
    const [lichSuNangLuong, setLichSuNangLuong] = useState<{ dongNang: number, theNang: number, tongNangLuong: number }[]>([])
    const [lichSuThoiGian, setLichSuThoiGian] = useState<number[]>([])
    const [thoiGianDaTroi, setThoiGianDaTroi] = useState(0)

    // Tính toán giá trị dẫn xuất
    const x = chieuDaiConLac * Math.sin(gocHienTai)
    const y = -chieuDaiConLac * Math.cos(gocHienTai)
    const gocDoHienTai = (gocHienTai * 180 / Math.PI).toFixed(1)

    // Tính toán năng lượng
    const dongNang = 0.5 * KHOI_LUONG_QUA_NANG * Math.pow(chieuDaiConLac * vanTocGoc, 2)
    const theNang = KHOI_LUONG_QUA_NANG * GIA_TOC_TRONG_TRUONG * chieuDaiConLac * (1 - Math.cos(gocHienTai))
    const tongNangLuong = dongNang + theNang

    // Tính toán chu kỳ và tần số
    const chuKyLyThuyet = 2 * Math.PI * Math.sqrt(chieuDaiConLac / GIA_TOC_TRONG_TRUONG)
    const tanSoLyThuyet = 1 / chuKyLyThuyet

    // Cập nhật lịch sử dữ liệu
    useEffect(() => {
        if (dangChay) {
            const timer = setInterval(() => {
                setThoiGianDaTroi(t => t + 0.1)

                setLichSuGoc(h => [...h.slice(-200), gocHienTai])
                setLichSuVanToc(h => [...h.slice(-200), vanTocGoc])
                setLichSuNangLuong(h => [...h.slice(-200), {
                    dongNang,
                    theNang,
                    tongNangLuong
                }])
                setLichSuThoiGian(h => [...h.slice(-200), thoiGianDaTroi])
            }, 100)

            return () => clearInterval(timer)
        }
    }, [dangChay, gocHienTai, vanTocGoc, thoiGianDaTroi, dongNang, theNang, tongNangLuong])

    const xuLyReset = () => {
        setDangChay(false)
        setGocHienTai(Math.PI / 4)
        setVanTocGoc(0)
        setLichSuGoc([])
        setLichSuVanToc([])
        setLichSuNangLuong([])
        setLichSuThoiGian([])
        setThoiGianDaTroi(0)
    }

    return (
        <div className={`bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl p-6 transition-all duration-300 ${toanManHinh ? 'fixed inset-4 z-50 overflow-y-auto' : ''}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ⏰ Mô Phỏng Con Lắc Đơn 3D
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Mô phỏng vật lý con lắc đơn với đồ thị phân tích chi tiết - Dành cho học sinh Việt Nam
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
                        onClick={() => setDangChay(!dangChay)}
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

                    <NutGradient
                        onClick={xuLyReset}
                        gradient="from-gray-600 to-gray-700"
                        hover="hover:from-gray-700 hover:to-gray-800"
                    >
                        <RotateCcw className="w-4 h-4 inline mr-2" />
                        Đặt Lại
                    </NutGradient>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái - View 3D */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Container 3D */}
                    <div className="h-[500px] rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black shadow-xl relative">
                        <Canvas
                            camera={{ position: [4, 2, 4], fov: 50 }}
                            shadows
                        >
                            <ambientLight intensity={0.6} />
                            <directionalLight
                                position={[5, 5, 5]}
                                intensity={1.2}
                                castShadow
                                shadow-mapSize-width={2048}
                                shadow-mapSize-height={2048}
                            />
                            <pointLight position={[-5, 5, -5]} intensity={0.3} />

                            {hienThiDieuKhienCamera && (
                                <OrbitControls
                                    enablePan
                                    enableZoom
                                    enableRotate
                                    maxPolarAngle={Math.PI / 1.5}
                                    minDistance={2}
                                    maxDistance={10}
                                />
                            )}

                            {/* Sàn và lưới */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -chieuDaiConLac - 0.5, 0]}>
                                <planeGeometry args={[10, 10]} />
                                <meshStandardMaterial
                                    color="#f3f4f6"
                                    side={THREE.DoubleSide}
                                    opacity={0.3}
                                    transparent
                                />
                            </mesh>
                            <gridHelper args={[8, 8, '#9ca3af', '#6b7280']} position={[0, -chieuDaiConLac - 0.5, 0]} />

                            <ConLac3D
                                chieuDai={chieuDaiConLac}
                                dangChay={dangChay}
                                capNhatGoc={setGocHienTai}
                                capNhatViTri={(x: number, y: number) => setViTriHienTai([x, y])}
                                gocBanDau={Math.PI / 4}
                                capNhatVanTocGoc={setVanTocGoc}
                                doGiamChan={doGiamChan}
                                tocDoThoiGian={tocDoThoiGian}
                            />

                            <VongCungDoGoc chieuDai={chieuDaiConLac} />
                        </Canvas>

                        {/* Điều khiển overlay */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <button
                                onClick={() => setHienThiDieuKhienCamera(!hienThiDieuKhienCamera)}
                                className={`p-2 rounded-full ${hienThiDieuKhienCamera ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'}`}
                                title={hienThiDieuKhienCamera ? "Khóa camera" : "Mở khóa camera"}
                            >
                                {hienThiDieuKhienCamera ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Thông tin real-time */}
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white max-w-xs">
                            <div className="text-sm font-bold mb-2">📊 Thông Số Hiện Tại</div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Góc lệch:</span>
                                    <span className="font-bold">{gocDoHienTai}°</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Vị trí (x, y):</span>
                                    <span className="font-bold">({x.toFixed(2)}, {y.toFixed(2)})</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Vận tốc:</span>
                                    <span className="font-bold">{(vanTocGoc * chieuDaiConLac).toFixed(2)} m/s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Thời gian:</span>
                                    <span className="font-bold">{thoiGianDaTroi.toFixed(1)}s</span>
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
                                    label="Chiều Dài Con Lắc (L)"
                                    value={chieuDaiConLac}
                                    min={0.5}
                                    max={4}
                                    step={0.1}
                                    onChange={setChieuDaiConLac}
                                    donVi=" m"
                                    ghiChu="Chiều dài càng lớn, chu kỳ dao động càng dài"
                                />

                                <ThanhTruot
                                    label="Hệ Số Giảm Chấn (b)"
                                    value={doGiamChan}
                                    min={0}
                                    max={0.2}
                                    step={0.01}
                                    onChange={setDoGiamChan}
                                    donVi=" N·s/m"
                                    ghiChu="b = 0: Dao động không tắt dần. b > 0: Dao động tắt dần"
                                />

                                <ThanhTruot
                                    label="Tốc Độ Mô Phỏng"
                                    value={tocDoThoiGian}
                                    min={0.1}
                                    max={2}
                                    step={0.1}
                                    onChange={setTocDoThoiGian}
                                    donVi="x"
                                    ghiChu="1x = Thời gian thực. 0.5x = Chậm 1/2. 2x = Nhanh gấp đôi"
                                />

                                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                                    <div className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        <span><strong>Hướng dẫn:</strong> Kéo và thả quả nặng màu xanh để thay đổi góc ban đầu. Điều chỉnh các thông số để quan sát sự thay đổi.</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {tabHienTai === 'vatLy' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Brain className="w-5 h-5" />
                                    Thông Tin Vật Lý Con Lắc
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <CardThongSo
                                        tieuDe="Chu Kỳ Lý Thuyết"
                                        giaTri={chuKyLyThuyet.toFixed(2)}
                                        donVi="giây"
                                        icon={Clock}
                                        mau="blue"
                                    />
                                    <CardThongSo
                                        tieuDe="Tần Số Dao Động"
                                        giaTri={tanSoLyThuyet.toFixed(2)}
                                        donVi="Hz"
                                        icon={Gauge}
                                        mau="purple"
                                    />
                                    <CardThongSo
                                        tieuDe="Tần Số Góc"
                                        giaTri={(2 * Math.PI * tanSoLyThuyet).toFixed(2)}
                                        donVi="rad/s"
                                        icon={RotateCcw}
                                        mau="green"
                                    />
                                    <CardThongSo
                                        tieuDe="Vận Tốc Cực Đại"
                                        giaTri={(chieuDaiConLac * Math.sqrt(2 * GIA_TOC_TRONG_TRUONG * chieuDaiConLac * (1 - Math.cos(gocHienTai)))).toFixed(2)}
                                        donVi="m/s"
                                        mau="orange"
                                    />
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">📐 Công Thức Vật Lý Con Lắc Đơn</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <div className="font-mono text-blue-600 dark:text-blue-400 mb-1">T = 2π√(L/g)</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                <strong>Chu kỳ dao động:</strong> Phụ thuộc vào chiều dài dây và gia tốc trọng trường
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <div className="font-mono text-green-600 dark:text-green-400 mb-1">θ'' + (g/L)sin(θ) = 0</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                <strong>Phương trình dao động:</strong> Với góc nhỏ: sin(θ) ≈ θ → dao động điều hòa
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <div className="font-mono text-purple-600 dark:text-purple-400 mb-1">v_max = √(2gL(1-cosθ₀))</div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                <strong>Vận tốc cực đại:</strong> Khi qua vị trí cân bằng
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
                                    angleData={lichSuGoc}
                                    velocityData={lichSuVanToc}
                                    energyData={lichSuNangLuong.map(d => ({
                                        dongNang: d.dongNang,
                                        theNang: d.theNang,
                                        tongNangLuong: d.tongNangLuong
                                    }))}
                                    timeData={lichSuThoiGian}
                                    title="Phân Tích Dao Động Con Lắc"
                                    showEnergy={true}
                                    pendulumLength={chieuDaiConLac}
                                    gravity={GIA_TOC_TRONG_TRUONG}
                                    mass={KHOI_LUONG_QUA_NANG}
                                    pendulumType="simple"
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
                                <div className="text-sm text-gray-600 dark:text-gray-400">Góc Lệch Hiện Tại</div>
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{gocDoHienTai}°</div>
                                <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                                    {gocHienTai.toFixed(3)} radian
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Tọa Độ Quả Nặng</div>
                                <div className="text-xl font-bold text-gray-800 dark:text-white">
                                    x = {x.toFixed(2)} m<br />
                                    y = {y.toFixed(2)} m
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Vận Tốc Tuyến Tính</div>
                                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                    {(vanTocGoc * chieuDaiConLac).toFixed(2)} m/s
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
                                <span className="text-gray-600 dark:text-gray-400">Khối lượng quả nặng</span>
                                <span className="font-semibold">{KHOI_LUONG_QUA_NANG} kg</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Chiều dài dây treo</span>
                                <span className="font-semibold">{chieuDaiConLac.toFixed(2)} m</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Gia tốc trọng trường</span>
                                <span className="font-semibold">{GIA_TOC_TRONG_TRUONG} m/s²</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Hệ số giảm chấn</span>
                                <span className="font-semibold">{doGiamChan.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 dark:text-gray-400">Tốc độ mô phỏng</span>
                                <span className="font-semibold">{tocDoThoiGian.toFixed(1)}x</span>
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
                                <span>Kéo quả nặng màu xanh để đặt góc ban đầu</span>
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
                                    {doGiamChan > 0 ? "⚠️ Năng lượng đang giảm do ma sát" : "✅ Năng lượng được bảo toàn"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>🎯 <strong>Mô phỏng vật lý con lắc đơn</strong> - Phát triển dành cho học sinh Việt Nam</p>
                    <p className="mt-1">Ứng dụng cho bài học: Dao động điều hòa, Con lắc đơn, Bảo toàn năng lượng</p>
                </div>
            </div>
        </div>
    )
}