// WaveInterference3D.tsx - Phần InterferenceVisualization đã sửa
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Html, Plane } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { Suspense } from 'react'
import {
    Play,
    Pause,
    RotateCcw,
    Lock,
    Unlock,
    Maximize2,
    Minimize2,
    Settings,
    Eye,
    Waves,
    Radio,
    Target,
    Activity,
    Gauge,
    Ruler,
    Zap,
    Info,
    Brain,
    BarChart3,
    GitCompare,
    Grid3X3,
    Move
} from 'lucide-react'
import {
    LineChart,
    Line as RechartsLine,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

// ===== HẰNG SỐ VẬT LÝ =====
const C = 3e8 // Tốc độ ánh sáng (m/s)

// ===== COMPONENT GIAO THOA SÓNG 3D =====

interface WaveSource {
    position: THREE.Vector3
    amplitude: number
    phase: number
    color: string
    label: string
}

interface InterferenceVisualizationProps {
    sources: WaveSource[]
    wavelength: number
    frequency: number
    time: number
    showSources: boolean
    showWaves: boolean
    showInterference: boolean
    showVectors: boolean
    showPattern: boolean
    gridSize?: number
    resolution?: number
}

// Component hiển thị điểm giao thoa
function InterferenceInstancedMesh({
    sources,
    wavelength,
    frequency,
    time,
    gridSize,
    resolution,
    showInterference
}: {
    sources: WaveSource[]
    wavelength: number
    frequency: number
    time: number
    gridSize: number
    resolution: number
    showInterference: boolean
}) {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const dummyMatrix = useMemo(() => new THREE.Matrix4(), [])
    const dummyColor = useMemo(() => new THREE.Color(), [])

    const half = gridSize / 2
    const step = gridSize / resolution
    const totalInstances = resolution * resolution

    const k = 2 * Math.PI / wavelength
    const omega = 2 * Math.PI * frequency

    // Tính biên độ cực đại có thể
    const maxPossibleAmp = useMemo(() =>
        sources.reduce((sum, s) => sum + Math.abs(s.amplitude), 0),
        [sources]
    )
    const maxPossibleIntensity = maxPossibleAmp * maxPossibleAmp

    // Pre-compute positions (tĩnh)
    const positions = useMemo(() => {
        const pos: [number, number, number][] = []
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                const x = -half + i * step + step / 2
                const z = -half + j * step + step / 2
                pos.push([x, 0, z])
            }
        }
        return pos
    }, [resolution, half, step])

    // Pre-compute distances từ mỗi nguồn đến từng điểm (tĩnh)
    const sourceDistances = useMemo(() => {
        return sources.map(source =>
            positions.map(pos => {
                const dx = pos[0] - source.position.x
                const dz = pos[2] - source.position.z
                return Math.sqrt(dx * dx + dz * dz)
            })
        )
    }, [sources, positions])

    // Update instances mỗi frame
    useFrame(() => {
        if (!meshRef.current || !showInterference) return

        const mesh = meshRef.current
        const baseScale = step * 0.9

        // Tính phase tổng quát theo thời gian
        const timePhase = omega * time

        for (let idx = 0; idx < totalInstances; idx++) {
            // Tính tổng dao động tại điểm này
            let totalDisplacement = 0

            sources.forEach((source, sIdx) => {
                const distance = sourceDistances[sIdx][idx]
                const phase = timePhase - k * distance + source.phase
                totalDisplacement += source.amplitude * Math.cos(phase)
            })

            // Cường độ tức thời
            const intensity = totalDisplacement * totalDisplacement
            const normalizedIntensity = maxPossibleIntensity > 0
                ? Math.min(1, intensity / maxPossibleIntensity)
                : 0

            // Tính màu sắc
            const r = Math.floor(255 * normalizedIntensity)
            const g = Math.floor(100 * normalizedIntensity + 50 * Math.sin(timePhase) * normalizedIntensity)
            const b = Math.floor(255 * (1 - normalizedIntensity * 0.5))

            dummyColor.setRGB(r / 255, g / 255, b / 255)
            mesh.setColorAt(idx, dummyColor)

            // Tính vị trí và scale
            const [x, , z] = positions[idx]
            const height = totalDisplacement * 0.3
            const boxHeight = Math.max(0.02, Math.abs(height) * 0.5 + 0.02)

            dummy.position.set(x, height, z)
            dummy.scale.set(baseScale, boxHeight, baseScale)
            dummy.updateMatrix()

            mesh.setMatrixAt(idx, dummy.matrix)
        }

        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) {
            mesh.instanceColor.needsUpdate = true
        }
    })

    // Chỉ render khi showInterference = true
    if (!showInterference) return null

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, totalInstances]}
            position={[0, 0, 0]}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                toneMapped={true}
                emissiveIntensity={0.3}
            />
        </instancedMesh>
    )
}

// ===== SÓNG TRÒN TỐI ƯU VỚI LINE SEGMENTS =====
function WaveCirclesOptimized({
    sources,
    wavelength,
    frequency,
    time,
    showWaves,
    gridSize
}: {
    sources: WaveSource[]
    wavelength: number
    frequency: number
    time: number
    showWaves: boolean
    gridSize: number
}) {
    const k = 2 * Math.PI / wavelength
    const omega = 2 * Math.PI * frequency

    if (!showWaves) return null

    return (
        <group>
            {sources.map((source, idx) => {
                const circles: THREE.Vector3[][] = []
                const numCircles = 6
                const maxRadius = gridSize / 1.5

                for (let i = 0; i < numCircles; i++) {
                    const baseRadius = (i / numCircles) * maxRadius
                    const points: THREE.Vector3[] = []
                    const segments = 48 // Giảm từ 64 xuống 48 để tối ưu

                    for (let j = 0; j <= segments; j++) {
                        const angle = (j / segments) * Math.PI * 2
                        const r = baseRadius
                        const phaseShift = omega * time - k * r + source.phase
                        const modulation = 1 + 0.1 * Math.sin(phaseShift)

                        const x = source.position.x + Math.cos(angle) * r * modulation
                        const z = source.position.z + Math.sin(angle) * r * modulation
                        const y = source.amplitude * Math.sin(phaseShift) * 0.5

                        points.push(new THREE.Vector3(x, y, z))
                    }

                    circles.push(points)
                }

                return (
                    <group key={`waves-${idx}`}>
                        {circles.map((circlePoints, circleIdx) => (
                            <Line
                                key={`circle-${idx}-${circleIdx}`}
                                points={circlePoints}
                                color={source.color}
                                lineWidth={1.5}
                                transparent
                                opacity={0.3 - circleIdx * 0.04}
                            />
                        ))}
                    </group>
                )
            })}
        </group>
    )
}

// ===== VÂN GIAO THOA (HYPERBOL) =====
function InterferenceFringes({
    sources,
    wavelength,
    showPattern,
    gridSize
}: {
    sources: WaveSource[]
    wavelength: number
    showPattern: boolean
    gridSize: number
}) {
    const fringes = useMemo(() => {
        if (!showPattern || sources.length !== 2) return []

        const result: { points: THREE.Vector3[]; type: 'max' | 'min'; order: number }[] = []
        const half = gridSize / 2
        const step = 0.15
        const s1 = sources[0].position
        const s2 = sources[1].position
        const d = Math.abs(s1.x - s2.x)
        const maxOrders = Math.floor(d / wavelength) + 2

        // Tính pha ban đầu chênh lệch
        const phaseDiff = sources[1].phase - sources[0].phase
        const phaseOffset = (phaseDiff * wavelength) / (2 * Math.PI)

        for (let order = -maxOrders; order <= maxOrders; order++) {
            const maxPoints: THREE.Vector3[] = []
            const minPoints: THREE.Vector3[] = []

            // Có tính đến độ lệch pha giữa 2 nguồn
            const deltaMax = order * wavelength + phaseOffset
            const deltaMin = (order + 0.5) * wavelength + phaseOffset

            for (let z = -half; z <= half; z += step) {
                const findX = (delta: number): number | null => {
                    const f = (x: number): number => {
                        const d1 = Math.sqrt((x - s1.x) ** 2 + z ** 2)
                        const d2 = Math.sqrt((x - s2.x) ** 2 + z ** 2)
                        return Math.abs(d2 - d1) - Math.abs(delta)
                    }

                    let left = -half - 2
                    let right = half + 2
                    const fLeft = f(left)
                    const fRight = f(right)

                    if (fLeft * fRight > 0) return null

                    for (let i = 0; i < 25; i++) {
                        const mid = (left + right) / 2
                        const fMid = f(mid)
                        if (Math.abs(fMid) < 0.002) return mid
                        if (fLeft * fMid < 0) right = mid
                        else left = mid
                    }
                    return (left + right) / 2
                }

                const xMax = findX(deltaMax)
                if (xMax !== null && Math.abs(xMax) <= half) {
                    maxPoints.push(new THREE.Vector3(xMax, 0.02, z))
                }

                const xMin = findX(deltaMin)
                if (xMin !== null && Math.abs(xMin) <= half) {
                    minPoints.push(new THREE.Vector3(xMin, 0.02, z))
                }
            }

            if (maxPoints.length > 1) {
                result.push({ points: maxPoints, type: 'max', order })
            }
            if (minPoints.length > 1) {
                result.push({ points: minPoints, type: 'min', order })
            }
        }

        return result
    }, [sources, wavelength, showPattern, gridSize])

    if (!showPattern) return null

    return (
        <group>
            {fringes.map((fringe, idx) => (
                <Line
                    key={`fringe-${idx}`}
                    points={fringe.points}
                    color={fringe.type === 'max' ? '#ef4444' : '#3b82f6'}
                    lineWidth={fringe.type === 'max' ? 2 : 1.5}
                    transparent
                    opacity={0.6}
                />
            ))}
        </group>
    )
}

// ===== VECTƠ TRƯỜNG =====
function FieldVectors({
    sources,
    wavelength,
    frequency,
    time,
    showVectors,
    gridSize
}: {
    sources: WaveSource[]
    wavelength: number
    frequency: number
    time: number
    showVectors: boolean
    gridSize: number
}) {
    const k = 2 * Math.PI / wavelength
    const omega = 2 * Math.PI * frequency

    const vectors = useMemo(() => {
        if (!showVectors) return []

        const result: { position: THREE.Vector3; magnitude: number }[] = []
        const step = gridSize / 10
        const half = gridSize / 2

        for (let x = -half; x <= half; x += step) {
            for (let z = -half; z <= half; z += step) {
                let totalAmp = 0
                sources.forEach(source => {
                    const dx = x - source.position.x
                    const dz = z - source.position.z
                    const distance = Math.sqrt(dx * dx + dz * dz)
                    totalAmp += source.amplitude * Math.cos(omega * time - k * distance + source.phase)
                })

                if (Math.abs(totalAmp) > 0.05) {
                    result.push({
                        position: new THREE.Vector3(x, 0, z),
                        magnitude: totalAmp
                    })
                }
            }
        }

        return result
    }, [sources, showVectors, wavelength, frequency, time, gridSize, omega, k])

    if (!showVectors) return null

    return (
        <group>
            {vectors.map((vector, idx) => (
                <group key={`vector-${idx}`} position={vector.position}>
                    <Line
                        points={[[0, 0, 0], [0, vector.magnitude, 0]]}
                        color={vector.magnitude > 0 ? '#ef4444' : '#3b82f6'}
                        lineWidth={2}
                    />
                    <mesh position={[0, vector.magnitude * (vector.magnitude > 0 ? 1.1 : 0.9), 0]}>
                        <coneGeometry args={[0.05, 0.15, 6]} />
                        <meshStandardMaterial
                            color={vector.magnitude > 0 ? '#ef4444' : '#3b82f6'}
                            emissive={vector.magnitude > 0 ? '#ef4444' : '#3b82f6'}
                            emissiveIntensity={0.3}
                        />
                    </mesh>
                </group>
            ))}
        </group>
    )
}

// ===== COMPONENT VISUALIZATION CHÍNH (ĐÃ TỐI ƯU) =====
function InterferenceVisualization({
    sources,
    wavelength,
    frequency,
    time,
    showSources,
    showWaves,
    showInterference,
    showVectors,
    showPattern,
    gridSize = 12,
    resolution = 80
}: InterferenceVisualizationProps) {
    return (
        <group>
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 8, 5]} intensity={0.8} />
            <pointLight position={[-5, 5, -5]} intensity={0.4} />
            <directionalLight position={[0, 10, 0]} intensity={0.6} />

            {/* Mặt phẳng nền */}
            <Plane
                args={[gridSize + 2, gridSize + 2]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.1, 0]}
            >
                <meshStandardMaterial color="#1a1a2e" transparent opacity={0.2} side={THREE.DoubleSide} />
            </Plane>

            {/* Lưới tọa độ */}
            <gridHelper args={[gridSize + 2, 20, '#4b5563', '#374151']} position={[0, 0, 0]} />

            {/* Trục tọa độ */}
            <axesHelper args={[gridSize / 2 + 1]} />

            {/* ===== GIAO THOA - INSTANCED MESH ===== */}
            <InterferenceInstancedMesh
                sources={sources}
                wavelength={wavelength}
                frequency={frequency}
                time={time}
                gridSize={gridSize}
                resolution={resolution}
                showInterference={showInterference}
            />

            {/* ===== VÂN GIAO THOA ===== */}
            <InterferenceFringes
                sources={sources}
                wavelength={wavelength}
                showPattern={showPattern}
                gridSize={gridSize}
            />

            {/* ===== SÓNG TRÒN ===== */}
            <WaveCirclesOptimized
                sources={sources}
                wavelength={wavelength}
                frequency={frequency}
                time={time}
                showWaves={showWaves}
                gridSize={gridSize}
            />

            {/* ===== CÁC NGUỒN SÓNG ===== */}
            {showSources && sources.map((source, idx) => (
                <group key={`source-${idx}`} position={source.position}>
                    <mesh>
                        <sphereGeometry args={[0.3, 32, 16]} />
                        <meshStandardMaterial
                            color={source.color}
                            emissive={source.color}
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                    <Html position={[0, 0.8, 0]} center>
                        <div
                            className="text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                            style={{ backgroundColor: source.color }}
                        >
                            {source.label}
                        </div>
                    </Html>
                </group>
            ))}

            {/* ===== VECTƠ TRƯỜNG ===== */}
            <FieldVectors
                sources={sources}
                wavelength={wavelength}
                frequency={frequency}
                time={time}
                showVectors={showVectors}
                gridSize={gridSize}
            />

            {/* Chú thích */}
            <Html position={[-gridSize / 2 + 1, 2, -gridSize / 2 + 1]}>
                <div className="bg-black/80 backdrop-blur-sm text-white text-xs p-3 rounded-lg border border-gray-700">
                    <div className="font-bold mb-2">🚀 Mô Phỏng Giao Thoa Sóng (Tối ưu GPU)</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span>Cực đại giao thoa</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span>Cực tiểu giao thoa</span>
                        </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400">
                        <div>Instances: {resolution} x {resolution}</div>
                        <div>Draw calls: 1 (từ 6.400)</div>
                    </div>
                </div>
            </Html>
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

function ThanhTruot({
    label,
    value,
    min,
    max,
    step,
    onChange,
    donVi = "",
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
                <span className={`text-sm font-bold bg-gradient-to-r ${mauClasses[mau]} text-transparent bg-clip-text`}>
                    {value.toFixed(2)}{donVi}
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
    className = '',
    disabled = false
}: any) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2.5 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
)

// ===== COMPONENT ĐỒ THỊ GIAO THOA =====
interface InterferenceChartProps {
    sourceDistance: number
    wavelength: number
    frequency: number
    amplitude1: number
    amplitude2: number
    phaseDiff: number
}

function InterferenceChart({
    sourceDistance,
    wavelength,
    frequency,
    amplitude1,
    amplitude2,
    phaseDiff
}: InterferenceChartProps) {
    const intensityProfile = useMemo(() => {
        const data: { position: number; intensity: number }[] = []
        const points = 100
        const range = 8

        for (let i = 0; i <= points; i++) {
            const x = -range / 2 + (i / points) * range
            const d1 = Math.abs(x + sourceDistance / 2)
            const d2 = Math.abs(x - sourceDistance / 2)

            const k = 2 * Math.PI / wavelength
            const amp = amplitude1 * Math.cos(-k * d1) + amplitude2 * Math.cos(-k * d2 + phaseDiff)
            const intensity = amp * amp

            data.push({ position: x, intensity })
        }

        return data
    }, [sourceDistance, wavelength, amplitude1, amplitude2, phaseDiff])

    const fringePositions = useMemo(() => {
        const positions: { order: number; position: number; type: string }[] = []
        const maxOrder = Math.floor(sourceDistance / wavelength) + 2

        for (let k = -maxOrder; k <= maxOrder; k++) {
            const xMax = (k * wavelength * Math.sqrt(sourceDistance ** 2 + 0)) / sourceDistance
            if (Math.abs(xMax) <= 6) {
                positions.push({ order: k, position: xMax, type: 'max' })
            }

            const xMin = ((k + 0.5) * wavelength * Math.sqrt(sourceDistance ** 2 + 0)) / sourceDistance
            if (Math.abs(xMin) <= 6) {
                positions.push({ order: k, position: xMin, type: 'min' })
            }
        }

        return positions.sort((a, b) => a.position - b.position)
    }, [sourceDistance, wavelength])

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Phân Tích Giao Thoa</h3>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Cường độ giao thoa theo vị trí
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={intensityProfile}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="position"
                            label={{ value: 'Vị trí (m)', position: 'insideBottom', offset: -5 }}
                            stroke="#9ca3af"
                            domain={[-4, 4]}
                        />
                        <YAxis
                            label={{ value: 'Cường độ', angle: -90, position: 'insideLeft' }}
                            stroke="#9ca3af"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            formatter={(value: any) => [Number(value).toFixed(3), 'Cường độ']}
                        />
                        <RechartsLine
                            type="monotone"
                            dataKey="intensity"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={false}
                            name="Cường độ"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Vị trí vân giao thoa
                </h4>
                <div className="relative h-16 mb-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded" />
                    </div>
                    {fringePositions.map((fringe, idx) => (
                        <div
                            key={idx}
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{ left: `${((fringe.position + 4) / 8) * 100}%` }}
                        >
                            <div
                                className={`w-0.5 h-8 ${fringe.type === 'max' ? 'bg-red-500' : 'bg-blue-500'}`}
                            />
                            <div
                                className={`absolute -top-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap ${fringe.type === 'max' ? 'text-red-500' : 'text-blue-500'}`}
                            >
                                {fringe.type === 'max' ? `k=${fringe.order}` : `k+½`}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Khoảng vân i</div>
                    <div className="font-bold text-purple-600 dark:text-purple-400">
                        {wavelength.toFixed(3)} m
                    </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Số vân cực đại</div>
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                        {Math.floor(sourceDistance / wavelength) * 2 + 1}
                    </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Độ tương phản</div>
                    <div className="font-bold text-green-600 dark:text-green-400">
                        {amplitude1 === amplitude2 ? '1.00' : ((2 * amplitude1 * amplitude2) / (amplitude1 ** 2 + amplitude2 ** 2)).toFixed(2)}
                    </div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Lệch pha Δφ</div>
                    <div className="font-bold text-orange-600 dark:text-orange-400">
                        {(phaseDiff * 180 / Math.PI).toFixed(0)}°
                    </div>
                </div>
            </div>
        </div>
    )
}

// ===== COMPONENT CHÍNH =====
export default function WaveInterference3D() {
    const [dangChay, setDangChay] = useState(true)
    const [khoaCamera, setKhoaCamera] = useState(false)
    const [toanManHinh, setToanManHinh] = useState(false)
    const [tabHienTai, setTabHienTai] = useState('dieuKhien')
    const [isClient, setIsClient] = useState(false)

    const [sourceDistance, setSourceDistance] = useState(3.0)
    const [amplitude1, setAmplitude1] = useState(1.0)
    const [amplitude2, setAmplitude2] = useState(1.0)
    const [phaseDiff, setPhaseDiff] = useState(0)

    const [wavelength, setWavelength] = useState(2.0)
    const [frequency, setFrequency] = useState(0.5)
    const [tocDoThoiGian, setTocDoThoiGian] = useState(1.0)

    const [showSources, setShowSources] = useState(true)
    const [showWaves, setShowWaves] = useState(true)
    const [showInterference, setShowInterference] = useState(true)
    const [showVectors, setShowVectors] = useState(false)
    const [showPattern, setShowPattern] = useState(true)

    const [time, setTime] = useState(0)

    useEffect(() => {
        setIsClient(true)
    }, [])

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
                setTime(t => t + deltaTime * tocDoThoiGian)
            }

            lastTime = currentTime
            animationFrameId = requestAnimationFrame(capNhatThoiGian)
        }

        animationFrameId = requestAnimationFrame(capNhatThoiGian)

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [isClient, dangChay, tocDoThoiGian])

    const sources = useMemo<WaveSource[]>(() => [
        {
            position: new THREE.Vector3(-sourceDistance / 2, 0, 0),
            amplitude: amplitude1,
            phase: 0,
            color: '#f59e0b',
            label: 'S₁'
        },
        {
            position: new THREE.Vector3(sourceDistance / 2, 0, 0),
            amplitude: amplitude2,
            phase: phaseDiff,
            color: '#10b981',
            label: 'S₂'
        }
    ], [sourceDistance, amplitude1, amplitude2, phaseDiff])

    const xuLyReset = useCallback(() => {
        setTime(0)
        setSourceDistance(3.0)
        setAmplitude1(1.0)
        setAmplitude2(1.0)
        setPhaseDiff(0)
        setWavelength(2.0)
        setFrequency(0.5)
        setTocDoThoiGian(1.0)
    }, [])

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
                        🌊 Mô Phỏng Giao Thoa Sóng 3D
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Mô phỏng hiện tượng giao thoa sóng với vân giao thoa và đồ thị phân tích chi tiết
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
                        onClick={() => setDangChay(!dangChay)}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-[500px] rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-900 to-black shadow-xl relative">
                        <Canvas camera={{ position: [8, 6, 8], fov: 45 }}>
                            <Suspense fallback={null}>
                                <InterferenceVisualization
                                    sources={sources}
                                    wavelength={wavelength}
                                    frequency={frequency}
                                    time={time}
                                    showSources={showSources}
                                    showWaves={showWaves}
                                    showInterference={showInterference}
                                    showVectors={showVectors}
                                    showPattern={showPattern}
                                    gridSize={12}
                                    resolution={80}
                                />
                            </Suspense>
                            <OrbitControls
                                enabled={!khoaCamera}
                                enablePan={true}
                                enableZoom={true}
                                enableRotate={true}
                                minDistance={4}
                                maxDistance={20}
                                target={[0, 0, 0]}
                            />
                        </Canvas>

                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white max-w-xs">
                            <div className="text-sm font-bold mb-2">📊 Thông Số Hiện Tại</div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Thời gian:</span>
                                    <span className="font-bold">{time.toFixed(2)} s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Khoảng cách 2 nguồn:</span>
                                    <span className="font-bold">{sourceDistance.toFixed(2)} m</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Bước sóng λ:</span>
                                    <span className="font-bold text-blue-400">{wavelength.toFixed(2)} m</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                        {[
                            { id: 'dieuKhien', label: 'Bảng Điều Khiển', icon: Settings },
                            { id: 'hienThi', label: 'Hiển Thị', icon: Eye },
                            { id: 'lyThuyet', label: 'Lý Thuyết', icon: Brain },
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

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        {tabHienTai === 'dieuKhien' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Bảng Điều Khiển Thông Số
                                </h3>

                                <ThanhTruot
                                    label="Khoảng cách 2 nguồn (a)"
                                    value={sourceDistance}
                                    min={1.0}
                                    max={6.0}
                                    step={0.1}
                                    onChange={setSourceDistance}
                                    donVi=" m"
                                    icon={Ruler}
                                    mau="blue"
                                />

                                <ThanhTruot
                                    label="Bước sóng (λ)"
                                    value={wavelength}
                                    min={0.5}
                                    max={4.0}
                                    step={0.1}
                                    onChange={setWavelength}
                                    donVi=" m"
                                    icon={Waves}
                                    mau="purple"
                                />

                                <ThanhTruot
                                    label="Tần số (f)"
                                    value={frequency}
                                    min={0.1}
                                    max={2.0}
                                    step={0.05}
                                    onChange={setFrequency}
                                    donVi=" Hz"
                                    icon={Activity}
                                    mau="green"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <ThanhTruot
                                        label="Biên độ S₁"
                                        value={amplitude1}
                                        min={0.2}
                                        max={2.0}
                                        step={0.1}
                                        onChange={setAmplitude1}
                                        icon={Zap}
                                        mau="yellow"
                                    />

                                    <ThanhTruot
                                        label="Biên độ S₂"
                                        value={amplitude2}
                                        min={0.2}
                                        max={2.0}
                                        step={0.1}
                                        onChange={setAmplitude2}
                                        icon={Zap}
                                        mau="green"
                                    />
                                </div>

                                <ThanhTruot
                                    label="Độ lệch pha (Δφ)"
                                    value={phaseDiff}
                                    min={0}
                                    max={2 * Math.PI}
                                    step={0.1}
                                    onChange={setPhaseDiff}
                                    donVi=" rad"
                                    icon={Target}
                                    mau="orange"
                                />

                                <ThanhTruot
                                    label="Tốc độ mô phỏng"
                                    value={tocDoThoiGian}
                                    min={0.1}
                                    max={3.0}
                                    step={0.1}
                                    onChange={setTocDoThoiGian}
                                    donVi="x"
                                    icon={Gauge}
                                    mau="red"
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
                                    {[
                                        { key: 'sources', state: showSources, setState: setShowSources, icon: Radio, color: 'yellow', label: 'Nguồn sóng S₁, S₂', desc: 'Hiển thị vị trí hai nguồn' },
                                        { key: 'waves', state: showWaves, setState: setShowWaves, icon: Waves, color: 'blue', label: 'Sóng tròn lan truyền', desc: 'Hiển thị các mặt sóng' },
                                        { key: 'interference', state: showInterference, setState: setShowInterference, icon: Grid3X3, color: 'purple', label: 'Hình ảnh giao thoa', desc: 'Hiển thị cường độ giao thoa' },
                                        { key: 'pattern', state: showPattern, setState: setShowPattern, icon: GitCompare, color: 'red', label: 'Vân giao thoa', desc: 'Đường cực đại và cực tiểu' },
                                        { key: 'vectors', state: showVectors, setState: setShowVectors, icon: Move, color: 'green', label: 'Vectơ biên độ', desc: 'Hiển thị biên độ dao động' }
                                    ].map(item => (
                                        <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 bg-${item.color}-500 rounded-lg flex items-center justify-center`}>
                                                    <item.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{item.label}</div>
                                                    <div className="text-sm text-gray-500">{item.desc}</div>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={item.state}
                                                onChange={(e) => item.setState(e.target.checked)}
                                                className="w-5 h-5"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {tabHienTai === 'lyThuyet' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <Brain className="w-5 h-5" />
                                    Lý Thuyết Giao Thoa Sóng
                                </h3>

                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">📐 Điều kiện giao thoa</h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <div className="font-mono text-blue-600 dark:text-blue-400 mb-1">
                                                Cực đại: d₂ - d₁ = kλ
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                Hai sóng cùng pha, tăng cường lẫn nhau
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                                            <div className="font-mono text-purple-600 dark:text-purple-400 mb-1">
                                                Cực tiểu: d₂ - d₁ = (k + ½)λ
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-400">
                                                Hai sóng ngược pha, triệt tiêu lẫn nhau
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {tabHienTai === 'doThi' && (
                            <InterferenceChart
                                sourceDistance={sourceDistance}
                                wavelength={wavelength}
                                frequency={frequency}
                                amplitude1={amplitude1}
                                amplitude2={amplitude2}
                                phaseDiff={phaseDiff}
                            />
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">📈 Thông Số Nhanh</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Khoảng cách 2 nguồn</div>
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {sourceDistance.toFixed(2)} m
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Bước sóng λ</div>
                                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                    {wavelength.toFixed(2)} m
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Khoảng vân i</div>
                                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                    {wavelength.toFixed(3)} m
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Số vân sáng</div>
                                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                    {Math.floor(sourceDistance / wavelength) * 2 + 1}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}