'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import {
    Play,
    Pause,
    RotateCcw,
    Lock,
    Unlock,
    Waves,
    BarChart3,
    Settings,
    Info,
    Maximize2,
    Minimize2,
    Ruler,
    Gauge,
    Radio,
    GitCompare,
    Target,
    Volume2,
    AlertTriangle,
    Brain,
    Move
} from 'lucide-react'
import DoThiSong from './WaveChart'

// Component sóng 3D
// Component sóng 3D
function Song3D({
    amplitude,
    wavelength,
    frequency,
    waveSpeed,
    phase,
    waveType = 'transverse',
    color = '#3b82f6',
    position = [0, 0, 0],
    showParticles = true,
    time = 0
}: any) {
    const lineRef = useRef<THREE.Line>(null)
    const particlesRef = useRef<THREE.Points>(null)
    const pointsCount = 200
    const length = 20 // Chiều dài sóng hiển thị

    // Tạo dữ liệu sóng
    const wavePoints = useMemo(() => {
        const points: THREE.Vector3[] = []
        const dx = length / pointsCount

        for (let i = 0; i <= pointsCount; i++) {
            const x = -length / 2 + i * dx
            const k = 2 * Math.PI / wavelength
            const omega = 2 * Math.PI * frequency

            let y = 0
            if (waveType === 'transverse') {
                // Sóng ngang - dao động theo phương y
                y = amplitude * Math.cos(omega * time - k * x + phase)
            } else {
                // Sóng dọc - không hiển thị trực tiếp trên đồ thị 3D
                y = 0
            }

            points.push(new THREE.Vector3(x, y, 0))
        }
        return points
    }, [amplitude, wavelength, frequency, time, phase, waveType, pointsCount, length])

    // Tạo các hạt dao động
    const particlePositions = useMemo(() => {
        if (!showParticles || waveType === 'longitudinal') return null

        const positions: number[] = []
        const particleCount = 30
        const dx = length / particleCount

        for (let i = 0; i <= particleCount; i++) {
            const x = -length / 2 + i * dx
            const k = 2 * Math.PI / wavelength
            const omega = 2 * Math.PI * frequency
            const y = amplitude * Math.cos(omega * time - k * x + phase)

            positions.push(x, y, 0)
        }
        return new Float32Array(positions)
    }, [amplitude, wavelength, frequency, time, phase, waveType, showParticles, length])

    // Cập nhật line geometry
    useEffect(() => {
        if (!lineRef.current) return

        const positions = wavePoints.map(p => [p.x, p.y, p.z]).flat()
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

        lineRef.current.geometry.dispose()
        lineRef.current.geometry = geometry
    }, [wavePoints])

    // Cập nhật particles
    useEffect(() => {
        if (!particlesRef.current || !particlePositions) return

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

        particlesRef.current.geometry.dispose()
        particlesRef.current.geometry = geometry
    }, [particlePositions])

    return (
        <group position={new THREE.Vector3(...position)}>
            {/* Đường sóng - Sử dụng primitive thay vì line component trực tiếp */}
            <primitive object={new THREE.Line(
                new THREE.BufferGeometry(),
                new THREE.LineBasicMaterial({ color, linewidth: 2 })
            )} ref={lineRef} />

            {/* Các hạt dao động */}
            {particlePositions && (
                <points ref={particlesRef}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            array={particlePositions}
                            count={particlePositions.length / 3}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial color="#ef4444" size={0.15} />
                </points>
            )}

            {/* Trục tọa độ - Sử dụng Line từ drei */}
            <Line
                points={[[-length / 2 - 1, 0, 0], [length / 2 + 1, 0, 0]]}
                color="#666"
                lineWidth={1}
            />
            <Line
                points={[[0, -amplitude - 0.5, 0], [0, amplitude + 0.5, 0]]}
                color="#666"
                lineWidth={1}
            />
        </group>
    )
}

// Component nguồn sóng kết hợp (giao thoa)
function NguonSongKetHop({
    amplitude,
    wavelength,
    frequency,
    distance = 4,
    phaseDiff = 0,
    time = 0,
}: any) {
    const groupRef = useRef<THREE.Group>(null)

    // Tính vận tốc sóng từ wavelength và frequency
    const waveSpeed = wavelength * frequency

    // Tạo mặt sóng tròn
    const createCircularWave = (centerX: number, centerZ: number, radius: number, color: string) => {
        const points: THREE.Vector3[] = []
        const segments = 64

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2
            points.push(new THREE.Vector3(
                centerX + radius * Math.cos(angle),
                0,
                centerZ + radius * Math.sin(angle)
            ))
        }
        return points
    }

    // Tính bán kính sóng dựa vào thời gian
    const radius = (time % (wavelength / frequency)) * waveSpeed

    return (
        <group ref={groupRef}>
            {/* Nguồn 1 */}
            <mesh position={[-distance / 2, 0, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
                <Html position={[0, 0.5, 0]} center>
                    <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        S₁
                    </div>
                </Html>
            </mesh>

            {/* Nguồn 2 */}
            <mesh position={[distance / 2, 0, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
                <Html position={[0, 0.5, 0]} center>
                    <div className="bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                        S₂
                    </div>
                </Html>
            </mesh>

            {/* Mặt sóng từ nguồn 1 */}
            <Line
                points={createCircularWave(-distance / 2, 0, radius % 4, '#f59e0b')}
                color="#f59e0b"
                lineWidth={1}
                opacity={0.5 - (radius % 4) / 8}
                transparent
            />
            <Line
                points={createCircularWave(-distance / 2, 0, (radius + wavelength / 2) % 4, '#f59e0b')}
                color="#f59e0b"
                lineWidth={1}
                opacity={0.3}
                transparent
            />

            {/* Mặt sóng từ nguồn 2 */}
            <Line
                points={createCircularWave(distance / 2, 0, radius % 4, '#10b981')}
                color="#10b981"
                lineWidth={1}
                opacity={0.5 - (radius % 4) / 8}
                transparent
            />
            <Line
                points={createCircularWave(distance / 2, 0, (radius + wavelength / 2) % 4, '#10b981')}
                color="#10b981"
                lineWidth={1}
                opacity={0.3}
                transparent
            />
        </group>
    )
}

// Component sóng dừng
// Component sóng dừng
function SongDung3D({
    length = 10,
    amplitude = 1,
    wavelength,
    harmonic = 1,
    time = 0,
    color = '#ef4444'
}: any) {
    const lineRef = useRef<THREE.Line>(null)
    const pointsCount = 200
    const frequency = 0.5 // Tần số cơ bản

    // Tạo sóng dừng: u = 2A cos(kx) sin(ωt)
    const standingWavePoints = useMemo(() => {
        const points: THREE.Vector3[] = []
        const dx = length / pointsCount
        const k = 2 * Math.PI / (2 * length / harmonic) // λ = 2L/n
        const omega = 2 * Math.PI * frequency * harmonic

        for (let i = 0; i <= pointsCount; i++) {
            const x = -length / 2 + i * dx
            const u = 2 * amplitude * Math.cos(k * x) * Math.sin(omega * time)
            points.push(new THREE.Vector3(x, u, 0))
        }
        return points
    }, [length, amplitude, harmonic, time, pointsCount, frequency])

    // Đường bao
    const envelopePoints = useMemo(() => {
        const points: THREE.Vector3[] = []
        const dx = length / pointsCount
        const k = 2 * Math.PI / (2 * length / harmonic)

        for (let i = 0; i <= pointsCount; i++) {
            const x = -length / 2 + i * dx
            const env = 2 * amplitude * Math.abs(Math.cos(k * x))
            points.push(new THREE.Vector3(x, env, 0))
        }
        return points
    }, [length, amplitude, harmonic, pointsCount])

    // Cập nhật line
    useEffect(() => {
        if (!lineRef.current) return

        const positions = standingWavePoints.map(p => [p.x, p.y, p.z]).flat()
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

        lineRef.current.geometry.dispose()
        lineRef.current.geometry = geometry
    }, [standingWavePoints])

    return (
        <group>
            {/* Sóng dừng */}
            <primitive
                object={new THREE.Line(
                    new THREE.BufferGeometry(),
                    new THREE.LineBasicMaterial({ color, linewidth: 3 })
                )}
                ref={lineRef}
            />

            {/* Đường bao trên */}
            <Line
                points={envelopePoints}
                color="#10b981"
                lineWidth={1}
                dashed
                dashSize={0.2}
                gapSize={0.1}
            />

            {/* Đường bao dưới */}
            <Line
                points={envelopePoints.map(p => new THREE.Vector3(p.x, -p.y, p.z))}
                color="#10b981"
                lineWidth={1}
                dashed
                dashSize={0.2}
                gapSize={0.1}
            />

            {/* Vị trí nút sóng */}
            {Array.from({ length: harmonic + 1 }).map((_, i) => {
                const x = -length / 2 + i * length / harmonic
                return (
                    <mesh key={i} position={[x, 0, 0]}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial color="#ef4444" />
                        <Html position={[0, 0.3, 0]} center>
                            <div className="bg-red-500 text-white px-1 py-0.5 rounded text-[10px]">
                                Nút
                            </div>
                        </Html>
                    </mesh>
                )
            })}

            {/* Vị trí bụng sóng */}
            {Array.from({ length: harmonic }).map((_, i) => {
                const x = -length / 2 + (i + 0.5) * length / harmonic
                return (
                    <mesh key={`bung-${i}`} position={[x, amplitude * 2, 0]}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial color="#10b981" />
                        <Html position={[0, 0.3, 0]} center>
                            <div className="bg-green-500 text-white px-1 py-0.5 rounded text-[10px]">
                                Bụng
                            </div>
                        </Html>
                    </mesh>
                )
            })}
        </group>
    )
}

// Component chính
export default function MoPhongSongCo() {
    // State cơ bản
    const [waveType, setWaveType] = useState<'transverse' | 'longitudinal'>('transverse')
    const [simulationMode, setSimulationMode] = useState<'basic' | 'interference' | 'standing'>('basic')
    const [isPlaying, setIsPlaying] = useState(true)
    const [showControls, setShowControls] = useState(true)
    const [fullscreen, setFullscreen] = useState(false)
    const [time, setTime] = useState(0)

    // Tham số sóng
    const [amplitude, setAmplitude] = useState(1.0)
    const [wavelength, setWavelength] = useState(4.0)
    const [frequency, setFrequency] = useState(0.5)
    const [waveSpeed, setWaveSpeed] = useState(2.0)
    const [phase, setPhase] = useState(0)

    // Tham số giao thoa
    const [sourceDistance, setSourceDistance] = useState(6)
    const [phaseDiff, setPhaseDiff] = useState(0)

    // Tham số sóng dừng
    const [stringLength, setStringLength] = useState(10)
    const [harmonic, setHarmonic] = useState(1)

    // Dữ liệu đồ thị
    const [waveData, setWaveData] = useState<any[]>([])
    const [interferenceData, setInterferenceData] = useState<any[]>([])
    const [standingWaveData, setStandingWaveData] = useState<any[]>([])

    // Animation loop
    // Thay vì useFrame, dùng useEffect + requestAnimationFrame
    useEffect(() => {
        if (!isPlaying) return

        let animationFrame: number
        let lastTime = performance.now()

        const animate = (currentTime: number) => {
            const delta = (currentTime - lastTime) / 1000 // Convert to seconds
            lastTime = currentTime

            setTime(t => t + delta * frequency)

            animationFrame = requestAnimationFrame(animate)
        }

        animationFrame = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animationFrame)
        }
    }, [isPlaying, frequency])

    // Cập nhật dữ liệu đồ thị
    useEffect(() => {
        const points: any[] = []
        const numPoints = 200
        const length = 20

        for (let i = 0; i <= numPoints; i++) {
            const x = -length / 2 + i * length / numPoints
            const k = 2 * Math.PI / wavelength
            const omega = 2 * Math.PI * frequency
            const u = amplitude * Math.cos(omega * time - k * x + phase)

            points.push({ x, u, time })
        }
        setWaveData(points)

        // Dữ liệu giao thoa
        if (simulationMode === 'interference') {
            const interPoints: any[] = []
            for (let i = 0; i <= numPoints; i++) {
                const x = -length / 2 + i * length / numPoints
                const k = 2 * Math.PI / wavelength
                const omega = 2 * Math.PI * frequency

                const d1 = Math.abs(x + sourceDistance / 2)
                const d2 = Math.abs(x - sourceDistance / 2)

                const u1 = amplitude * Math.cos(omega * time - k * d1)
                const u2 = amplitude * Math.cos(omega * time - k * d2 + phaseDiff)
                const uTotal = u1 + u2

                interPoints.push({ x, u1, u2, uTotal })
            }
            setInterferenceData(interPoints)
        }

        // Dữ liệu sóng dừng
        if (simulationMode === 'standing') {
            const standPoints: any[] = []
            for (let i = 0; i <= numPoints; i++) {
                const x = -stringLength / 2 + i * stringLength / numPoints
                const k = 2 * Math.PI / (2 * stringLength / harmonic) // λ = 2L/n
                const omega = 2 * Math.PI * frequency * harmonic

                const u = 2 * amplitude * Math.cos(k * x) * Math.sin(omega * time)
                const envelope = 2 * amplitude * Math.abs(Math.cos(k * x))

                standPoints.push({ x, u, envelope })
            }
            setStandingWaveData(standPoints)
        }
    }, [amplitude, wavelength, frequency, phase, time, simulationMode, sourceDistance, phaseDiff, stringLength, harmonic])

    return (
        <div className={`bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl p-6 transition-all duration-300 ${fullscreen ? 'fixed inset-4 z-50 overflow-y-auto' : ''}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        🌊 Mô Phỏng Sóng Cơ 3D
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Mô phỏng trực quan các hiện tượng sóng trong Vật lý 11
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setFullscreen(!fullscreen)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${isPlaying
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? 'Tạm Dừng' : 'Phát'}
                    </button>

                    <button
                        onClick={() => setTime(0)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Đặt Lại
                    </button>
                </div>
            </div>

            {/* Navigation mode */}
            <div className="flex space-x-2 mb-6 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
                {[
                    { id: 'basic', label: 'Sóng Cơ Bản', icon: Waves },
                    { id: 'interference', label: 'Giao Thoa', icon: GitCompare },
                    { id: 'standing', label: 'Sóng Dừng', icon: Target }
                ].map(mode => (
                    <button
                        key={mode.id}
                        onClick={() => setSimulationMode(mode.id as any)}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${simulationMode === mode.id
                            ? 'bg-white dark:bg-gray-800 shadow-lg text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                            }`}
                    >
                        <mode.icon className="w-4 h-4" />
                        {mode.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* View 3D */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-[500px] rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-900 to-black shadow-xl relative">
                        <Canvas
                            camera={{ position: [5, 5, 15], fov: 45 }}
                            shadows
                        >
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 5]} intensity={1} />

                            {showControls && <OrbitControls enablePan enableZoom enableRotate />}

                            {/* Grid nền */}
                            <gridHelper args={[30, 20, '#4b5563', '#1f2937']} />

                            {/* Hiển thị theo mode */}
                            {simulationMode === 'basic' && (
                                <Song3D
                                    amplitude={amplitude}
                                    wavelength={wavelength}
                                    frequency={frequency}
                                    waveSpeed={waveSpeed}
                                    phase={phase}
                                    waveType={waveType}
                                    time={time}
                                    color="#3b82f6"
                                />
                            )}

                            {simulationMode === 'interference' && (
                                <NguonSongKetHop
                                    amplitude={amplitude}
                                    wavelength={wavelength}
                                    frequency={frequency}
                                    distance={sourceDistance}
                                    phaseDiff={phaseDiff}
                                    time={time}
                                />
                            )}

                            {simulationMode === 'standing' && (
                                <SongDung3D
                                    length={stringLength}
                                    amplitude={amplitude}
                                    wavelength={wavelength}
                                    harmonic={harmonic}
                                    time={time}
                                />
                            )}

                            {/* Thông tin thời gian */}
                            <Html position={[0, amplitude + 2, 0]} center>
                                <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                    t = {time.toFixed(2)}s
                                </div>
                            </Html>
                        </Canvas>

                        {/* Controls overlay */}
                        <button
                            onClick={() => setShowControls(!showControls)}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition"
                        >
                            {showControls ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Đồ thị */}
                    <DoThiSong
                        waveData={waveData}
                        interferenceData={simulationMode === 'interference' ? interferenceData : undefined}
                        standingWaveData={simulationMode === 'standing' ? standingWaveData : undefined}
                        waveSpeed={waveSpeed}
                        frequency={frequency}
                        wavelength={wavelength}
                        amplitude={amplitude}
                        waveType={waveType}
                    />
                </div>

                {/* Control Panel */}
                <div className="space-y-6">
                    {/* Tham số cơ bản */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Tham Số Sóng
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium block mb-2">Biên độ A (m)</label>
                                <input
                                    type="range"
                                    min={0.2}
                                    max={2}
                                    step={0.1}
                                    value={amplitude}
                                    onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0.2m</span>
                                    <span className="font-bold text-blue-600">{amplitude.toFixed(1)}m</span>
                                    <span>2.0m</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-2">Bước sóng λ (m)</label>
                                <input
                                    type="range"
                                    min={1}
                                    max={8}
                                    step={0.5}
                                    value={wavelength}
                                    onChange={(e) => setWavelength(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>1m</span>
                                    <span className="font-bold text-green-600">{wavelength.toFixed(1)}m</span>
                                    <span>8m</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-2">Tần số f (Hz)</label>
                                <input
                                    type="range"
                                    min={0.2}
                                    max={2}
                                    step={0.1}
                                    value={frequency}
                                    onChange={(e) => setFrequency(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0.2Hz</span>
                                    <span className="font-bold text-purple-600">{frequency.toFixed(1)}Hz</span>
                                    <span>2.0Hz</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-2">Vận tốc v (m/s)</label>
                                <input
                                    type="range"
                                    min={0.5}
                                    max={5}
                                    step={0.5}
                                    value={waveSpeed}
                                    onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <div className="text-xs text-gray-500 text-center mt-1">
                                    v = λf = {wavelength.toFixed(1)} × {frequency.toFixed(1)} = {(wavelength * frequency).toFixed(1)} m/s
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-2">Loại sóng</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setWaveType('transverse')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${waveType === 'transverse'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700'
                                            }`}
                                    >
                                        Sóng ngang
                                    </button>
                                    <button
                                        onClick={() => setWaveType('longitudinal')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${waveType === 'longitudinal'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700'
                                            }`}
                                    >
                                        Sóng dọc
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tham số giao thoa */}
                    {simulationMode === 'interference' && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-purple-200">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-600">
                                <GitCompare className="w-5 h-5" />
                                Giao Thoa Sóng
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium block mb-2">Khoảng cách 2 nguồn (m)</label>
                                    <input
                                        type="range"
                                        min={2}
                                        max={10}
                                        step={0.5}
                                        value={sourceDistance}
                                        onChange={(e) => setSourceDistance(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium block mb-2">Độ lệch pha Δφ (rad)</label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={2 * Math.PI}
                                        step={0.1}
                                        value={phaseDiff}
                                        onChange={(e) => setPhaseDiff(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="text-center text-sm mt-1">
                                        {phaseDiff.toFixed(1)} rad ({(phaseDiff * 180 / Math.PI).toFixed(0)}°)
                                    </div>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                    <p className="text-sm text-purple-700 dark:text-purple-300">
                                        <strong>Điều kiện cực đại:</strong> d₂ - d₁ = kλ<br />
                                        <strong>Điều kiện cực tiểu:</strong> d₂ - d₁ = (k+½)λ
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tham số sóng dừng */}
                    {simulationMode === 'standing' && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border border-red-200">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-600">
                                <Target className="w-5 h-5" />
                                Sóng Dừng
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium block mb-2">Chiều dài dây L (m)</label>
                                    <input
                                        type="range"
                                        min={4}
                                        max={16}
                                        step={1}
                                        value={stringLength}
                                        onChange={(e) => setStringLength(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium block mb-2">Họa âm bậc n</label>
                                    <input
                                        type="range"
                                        min={1}
                                        max={5}
                                        step={1}
                                        value={harmonic}
                                        onChange={(e) => setHarmonic(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-center gap-2 mt-2">
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <button
                                                key={n}
                                                onClick={() => setHarmonic(n)}
                                                className={`w-8 h-8 rounded-full text-sm font-medium ${harmonic === n
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700'
                                                    }`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        <strong>Điều kiện sóng dừng 2 đầu cố định:</strong><br />
                                        L = n·λ/2 với n = 1, 2, 3...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Thông số hiện tại */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border">
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Thông Số Hiện Tại
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Biên độ:</span>
                                <span className="font-bold">{amplitude.toFixed(2)} m</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Bước sóng:</span>
                                <span className="font-bold">{wavelength.toFixed(2)} m</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tần số:</span>
                                <span className="font-bold">{frequency.toFixed(2)} Hz</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Vận tốc:</span>
                                <span className="font-bold">{waveSpeed.toFixed(2)} m/s</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                                <span>Chu kỳ T:</span>
                                <span className="font-bold">{(1 / frequency).toFixed(2)} s</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Số sóng k:</span>
                                <span className="font-bold">{(2 * Math.PI / wavelength).toFixed(2)} rad/m</span>
                            </div>
                        </div>
                    </div>

                    {/* Hướng dẫn */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            Hướng Dẫn
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>• Chọn chế độ mô phỏng ở trên</li>
                            <li>• Điều chỉnh các tham số để quan sát</li>
                            <li>• Sóng ngang: dao động vuông góc phương truyền</li>
                            <li>• Sóng dọc: dao động trùng phương truyền</li>
                            <li>• Giao thoa: 2 nguồn kết hợp tạo vân</li>
                            <li>• Sóng dừng: bụng và nút cố định</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}