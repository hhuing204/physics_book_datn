// SonarSimulation3D.tsx - Bản chuyên nghiệp chỉ tập trung dò địa hình
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Html, Sphere, Cone, Cylinder, Ring, Float, Stars, Box, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useState, useCallback, useEffect, useMemo, Suspense } from 'react'
import {
    Play, Pause, RotateCcw, Lock, Unlock, Gauge, Target, Info, Activity,
    BarChart3, Settings, Brain, Maximize2, Minimize2, Ruler, Clock, Waves,
    Eye, EyeOff, Radio, Volume2, Navigation, AlertTriangle, RefreshCw, Radar, Zap, Mountain
} from 'lucide-react'
import SonarWaveChart from './SonarWaveChart'

const SPEED_OF_SOUND_WATER = 1500

// ===== TÀU NỔI =====
function Boat() {
    const boatRef = useRef<THREE.Group>(null)

    useFrame(({ clock }) => {
        if (boatRef.current) {
            boatRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.02
        }
    })

    return (
        <group ref={boatRef} position={[0, 0, 0]}>
            {/* Mặt nước quanh tàu */}
            <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.5, 2.5, 32]} />
                <meshStandardMaterial color="#60a5fa" transparent opacity={0.25} />
            </mesh>

            {/* Thân tàu */}
            <mesh position={[0, -0.2, 0]} castShadow>
                <boxGeometry args={[2.4, 0.4, 0.9]} />
                <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Boong */}
            <mesh position={[0, 0.05, 0]} castShadow>
                <boxGeometry args={[2.3, 0.08, 0.95]} />
                <meshStandardMaterial color="#78350f" roughness={0.6} />
            </mesh>

            {/* Mũi */}
            <mesh position={[1.3, -0.05, 0]} castShadow>
                <coneGeometry args={[0.45, 0.9, 16]} />
                <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>

            {/* Đuôi */}
            <mesh position={[-1.3, -0.05, 0]} castShadow>
                <coneGeometry args={[0.4, 0.8, 12]} />
                <meshStandardMaterial color="#1e293b" metalness={0.7} />
            </mesh>

            {/* Cabin */}
            <mesh position={[0.2, 0.45, 0]} castShadow>
                <boxGeometry args={[0.9, 0.55, 0.85]} />
                <meshStandardMaterial color="#f8fafc" metalness={0.1} />
            </mesh>

            {/* Cửa sổ */}
            {[-0.2, 0, 0.2, 0.4].map((x, i) => (
                <mesh key={i} position={[0.2 + x, 0.6, 0.45]}>
                    <boxGeometry args={[0.12, 0.12, 0.02]} />
                    <meshStandardMaterial color="#38bdf8" metalness={0.9} />
                </mesh>
            ))}

            {/* Ống khói */}
            <mesh position={[-0.8, 0.55, 0.2]} castShadow>
                <cylinderGeometry args={[0.18, 0.22, 0.55, 16]} />
                <meshStandardMaterial color="#dc2626" metalness={0.3} />
            </mesh>

            {/* Sonar dome */}
            <mesh position={[0, -0.38, 0]} castShadow>
                <sphereGeometry args={[0.22, 48, 48]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.85} emissive="#f59e0b" emissiveIntensity={0.25} />
            </mesh>

            <mesh position={[0, -0.38, 0]}>
                <sphereGeometry args={[0.28, 32, 32]} />
                <meshStandardMaterial color="#f59e0b" transparent opacity={0.15} emissive="#f59e0b" emissiveIntensity={0.15} />
            </mesh>
        </group>
    )
}

// ===== TIA SONAR (CHI TIẾT) =====
function SonarBeam({ isActive, angle, distance, time }: { isActive: boolean, angle: number, distance: number, time: number }) {
    if (!isActive) return null

    const radAngle = (angle * Math.PI) / 180
    const maxLength = Math.min(distance / 20, 8)
    const beamLength = maxLength * (0.5 + Math.sin(time * 10) * 0.05)

    // Tia chính
    const endX = Math.sin(radAngle) * beamLength
    const endZ = Math.cos(radAngle) * beamLength

    // Tia phụ (loe ra)
    const sideAngle1 = radAngle + 0.15
    const sideAngle2 = radAngle - 0.15
    const sideX1 = Math.sin(sideAngle1) * beamLength * 0.8
    const sideZ1 = Math.cos(sideAngle1) * beamLength * 0.8
    const sideX2 = Math.sin(sideAngle2) * beamLength * 0.8
    const sideZ2 = Math.cos(sideAngle2) * beamLength * 0.8

    const opacity = 0.6 - (beamLength / maxLength) * 0.3

    return (
        <group position={[0, -0.55, 0]}>
            {/* Tia chính */}
            <Line
                points={[[0, 0, 0], [endX, 0, endZ]]}
                color="#3b82f6"
                lineWidth={3}
            />
            {/* Tia phụ trái */}
            <Line
                points={[[0, 0, 0], [sideX1, 0, sideZ1]]}
                color="#60a5fa"
                lineWidth={1.5}
                opacity={0.4}
            />
            {/* Tia phụ phải */}
            <Line
                points={[[0, 0, 0], [sideX2, 0, sideZ2]]}
                color="#60a5fa"
                lineWidth={1.5}
                opacity={0.4}
            />

            {/* Hạt sáng trên tia */}
            <mesh position={[endX, 0, endZ]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.8} />
            </mesh>

            {/* Các điểm dọc theo tia */}
            {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
                const px = Math.sin(radAngle) * beamLength * t
                const pz = Math.cos(radAngle) * beamLength * t
                return (
                    <mesh key={i} position={[px, 0, pz]}>
                        <sphereGeometry args={[0.025, 6, 6]} />
                        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.4} />
                    </mesh>
                )
            })}
        </group>
    )
}

// ===== SÓNG VÒNG TRÒN SONAR =====
function SonarRingWaves({ isActive, time, speedOfSound, maxDistance }: {
    isActive: boolean, time: number, speedOfSound: number, maxDistance: number
}) {
    const waves = [0, 0.3, 0.6, 0.9, 1.2]

    return (
        <group position={[0, -0.55, 0]}>
            {isActive && waves.map((delay, i) => {
                const radius = (time * speedOfSound * 1.5 + delay) % maxDistance
                const normalizedRadius = radius / 20 // Scale cho phù hợp scene
                const opacity = Math.max(0, 0.5 - normalizedRadius / 2)
                if (normalizedRadius < 0.1) return null
                return (
                    <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
                        <ringGeometry args={[normalizedRadius - 0.05, normalizedRadius, 64]} />
                        <meshStandardMaterial color="#3b82f6" transparent opacity={opacity} side={THREE.DoubleSide} />
                    </mesh>
                )
            })}
        </group>
    )
}

// ===== SÓNG ECHO PHẢN XẠ =====
function EchoWave({ isActive, time, speedOfSound, distance, signalStrength }: {
    isActive: boolean, time: number, speedOfSound: number, distance: number, signalStrength: number
}) {
    if (!isActive || distance === 0) return null

    const travelTime = (distance * 2) / speedOfSound
    const echoTime = time % travelTime
    const radius = (echoTime * speedOfSound) / 20 // Scale
    const maxRadius = distance / 20

    if (radius > maxRadius || radius < 0.1) return null

    const opacity = signalStrength * (1 - radius / maxRadius) * 0.6

    return (
        <group position={[0, -0.55, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius - 0.05, radius, 64]} />
                <meshStandardMaterial color="#ef4444" transparent opacity={opacity} emissive="#ef4444" emissiveIntensity={0.3} side={THREE.DoubleSide} />
            </mesh>
        </group>
    )
}

// ===== ĐỊA HÌNH ĐÁY BIỂN CHI TIẾT =====
function DetailedSeabed() {
    const terrainRef = useRef<THREE.Mesh>(null)

    const terrainGeometry = useMemo(() => {
        const width = 24, depth = 24, segments = 200
        const geometry = new THREE.PlaneGeometry(width, depth, segments, segments)
        geometry.rotateX(-Math.PI / 2)
        const positions = geometry.attributes.position.array

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i]
            const z = positions[i + 2]
            let y = -2.8

            // Núi lớn bên trái
            const distToMountain1 = Math.sqrt((x + 5) ** 2 + (z + 3) ** 2)
            y += Math.max(0, Math.sin(distToMountain1 * 1.2) * 0.6 * Math.exp(-distToMountain1 * 0.25))

            // Núi lớn bên phải
            const distToMountain2 = Math.sqrt((x - 4.5) ** 2 + (z - 2) ** 2)
            y += Math.max(0, Math.sin(distToMountain2 * 1.0) * 0.5 * Math.exp(-distToMountain2 * 0.3))

            // Gò ở giữa
            const distToCenter = Math.sqrt(x ** 2 + z ** 2)
            y += Math.max(0, Math.sin(distToCenter * 1.5) * 0.25 * Math.exp(-distToCenter * 0.4))

            // Gợn sóng đáy
            y += Math.sin(x * 1.8) * Math.cos(z * 1.8) * 0.04
            y += Math.sin(x * 4) * Math.cos(z * 4) * 0.02

            positions[i + 1] = y
        }

        geometry.computeVertexNormals()
        return geometry
    }, [])

    // Tạo texture màu cho địa hình
    const vertexColors = useMemo(() => {
        const positions = terrainGeometry.attributes.position.array
        const colors = []

        for (let i = 0; i < positions.length; i += 3) {
            const y = positions[i + 1]
            // Màu dựa trên độ cao
            if (y > -2.4) {
                colors.push(0.5, 0.35, 0.2) // Nâu đất - cao
            } else if (y > -2.6) {
                colors.push(0.4, 0.45, 0.3) // Xanh rêu - trung bình
            } else {
                colors.push(0.3, 0.35, 0.4) // Xám xanh - thấp
            }
        }

        terrainGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
        return terrainGeometry
    }, [terrainGeometry])

    return (
        <mesh ref={terrainRef} geometry={vertexColors} receiveShadow castShadow>
            <meshStandardMaterial vertexColors roughness={0.7} metalness={0.1} />
        </mesh>
    )
}

// ===== CHI TIẾT ĐỊA HÌNH: ĐÁ, RẠN SAN HÔ =====
function TerrainDetails() {
    // Đá lớn
    const rocks = [
        [-3.5, -2.5, -2], [-3, -2.45, -1.5], [-4, -2.55, -2.5], [3.2, -2.48, 2], [2.8, -2.52, 1.5], [3.8, -2.45, 2.5],
        [-2, -2.4, 3], [-1.5, -2.45, 2.5], [-2.5, -2.38, 3.2], [1.5, -2.5, -3], [2, -2.45, -2.5], [1, -2.55, -3.2]
    ]

    // Rạn san hô
    const corals = [
        [-2.5, -2.6, -1.5], [-2, -2.55, -1], [-3, -2.65, -2], [2, -2.55, 1.5], [2.5, -2.6, 2], [1.5, -2.5, 1],
        [-1, -2.5, 2.5], [-0.5, -2.55, 2], [-1.5, -2.48, 3], [0.5, -2.52, -2.5], [1, -2.48, -2], [0, -2.55, -3]
    ]

    return (
        <group>
            {/* Đá */}
            {rocks.map((pos, i) => (
                <mesh key={`rock-${i}`} position={[pos[0], pos[1], pos[2]]} castShadow receiveShadow>
                    <dodecahedronGeometry args={[0.12 + Math.random() * 0.08, 0]} />
                    <meshStandardMaterial color="#6b5a4a" roughness={0.8} />
                </mesh>
            ))}

            {/* San hô */}
            {corals.map((pos, i) => (
                <group key={`coral-${i}`} position={[pos[0], pos[1], pos[2]]}>
                    <mesh castShadow>
                        <coneGeometry args={[0.1, 0.35, 5]} />
                        <meshStandardMaterial color="#c2410c" roughness={0.5} />
                    </mesh>
                    <mesh position={[0.08, 0.15, 0.05]} castShadow>
                        <coneGeometry args={[0.06, 0.25, 5]} />
                        <meshStandardMaterial color="#ea580c" roughness={0.5} />
                    </mesh>
                    <mesh position={[-0.07, 0.12, -0.08]} castShadow>
                        <coneGeometry args={[0.07, 0.28, 5]} />
                        <meshStandardMaterial color="#c2410c" roughness={0.5} />
                    </mesh>
                </group>
            ))}
        </group>
    )
}

// ===== VẠCH CHỈ KHOẢNG CÁCH TRÊN ĐÁY =====
function DistanceMarkers() {
    const distances = [5, 10, 15, 20]

    return (
        <group position={[0, -2.7, 0]}>
            {distances.map((dist) => {
                const angle = 0 // Hướng chính
                const x = Math.sin(angle) * dist
                const z = Math.cos(angle) * dist
                return (
                    <group key={dist} position={[x, 0, z]}>
                        <mesh>
                            <cylinderGeometry args={[0.08, 0.1, 0.05, 6]} />
                            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
                        </mesh>
                        <Html position={[0, 0.15, 0]} center>
                            <div className="text-[10px] text-yellow-400 font-bold bg-black/50 px-1.5 py-0.5 rounded-full">{dist}m</div>
                        </Html>
                    </group>
                )
            })}
        </group>
    )
}

// ===== CHẤM ĐIỂM TRÊN ĐÁY (ECHO RETURN) =====
function EchoPoints({ isActive, distance, signalStrength, time }: {
    isActive: boolean, distance: number, signalStrength: number, time: number
}) {
    if (!isActive || distance === 0) return null

    const angle = 0 // Hướng chính
    const x = Math.sin(angle) * (distance / 20)
    const z = Math.cos(angle) * (distance / 20)

    const intensity = signalStrength * (0.5 + Math.sin(time * 15) * 0.3)

    return (
        <group position={[x, -2.65, z]}>
            {/* Điểm sáng trên đáy */}
            <mesh>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={intensity} />
            </mesh>

            {/* Vòng tròn lan tỏa */}
            <mesh scale={[1 + Math.sin(time * 20) * 0.2, 1 + Math.sin(time * 20) * 0.2, 1]}>
                <ringGeometry args={[0.12, 0.25, 16]} />
                <meshStandardMaterial color="#ef4444" transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>

            <Html position={[0, 0.25, 0]} center>
                <div className="text-[9px] text-red-400 font-bold bg-black/60 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    ECHO {distance.toFixed(0)}m
                </div>
            </Html>
        </group>
    )
}

// ===== HIỂN THỊ THÔNG SỐ SONAR =====
function SonarDisplay({ distance, travelTime, signalStrength, isActive, pingCount }: {
    distance: number, travelTime: number, signalStrength: number, isActive: boolean, pingCount: number
}) {
    return (
        <Html position={[5, 1.5, 0]} center>
            <div className="bg-gradient-to-br from-gray-900/95 to-slate-900/95 backdrop-blur-md rounded-2xl p-4 min-w-[240px] border border-cyan-500/40 shadow-2xl">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className="font-bold text-white text-xs tracking-wider">SONAR SYSTEM</span>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Trạng thái</span>
                        <span className={`text-xs font-bold ${isActive ? 'text-green-400' : 'text-red-400'}`}>
                            {isActive ? '● ĐANG QUÉT' : '○ TẠM DỪNG'}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Khoảng cách</span>
                        <span className="text-white font-bold text-lg">{distance.toFixed(0)}<span className="text-xs text-gray-400">m</span></span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Thời gian phản hồi</span>
                        <span className="text-cyan-400 font-mono font-bold">{(travelTime * 1000).toFixed(1)} ms</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Cường độ tín hiệu</span>
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full" style={{ width: `${signalStrength * 100}%` }} />
                            </div>
                            <span className="text-white text-xs">{(signalStrength * 100).toFixed(0)}%</span>
                        </div>
                    </div>

                    <div className="flex justify-between pt-1 border-t border-gray-800">
                        <span className="text-gray-400 text-xs">Số lần ping</span>
                        <span className="text-purple-400 font-mono font-bold">{pingCount}</span>
                    </div>
                </div>
            </div>
        </Html>
    )
}

// ===== CHÚ THÍCH =====
function Legend() {
    return (
        <Html position={[-5.5, 1.8, 0]} center>
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-2 text-white text-[10px] border border-cyan-500/30">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1"><div className="w-2.5 h-0.5 bg-blue-500" /><span>Sóng phát</span></div>
                    <div className="flex items-center gap-1"><div className="w-2.5 h-0.5 bg-red-500" /><span>Sóng phản xạ</span></div>
                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /><span>Mốc khoảng cách</span></div>
                    <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /><span>Điểm echo</span></div>
                </div>
            </div>
        </Html>
    )
}

// ===== NƯỚC BIỂN =====
function WaterEnvironment() {
    const particlesRef = useRef<THREE.Points>(null)
    const particleCount = 1500
    const positions = useMemo(() => {
        const arr = new Float32Array(particleCount * 3)
        for (let i = 0; i < particleCount; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 30
            arr[i * 3 + 1] = (Math.random() - 0.5) * 4 - 1
            arr[i * 3 + 2] = (Math.random() - 0.5) * 25
        }
        return arr
    }, [])

    useFrame(({ clock }) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02
        }
    })

    return (
        <>
            {/* Mặt nước */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[28, 28, 32, 32]} />
                <meshStandardMaterial color="#1e3a5f" transparent opacity={0.4} metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Hạt nước */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial color="#4ade80" size={0.02} transparent opacity={0.2} />
            </points>

            {/* Bọt khí */}
            <group>
                {Array.from({ length: 60 }).map((_, i) => {
                    const yPos = useRef(Math.random() * 3 - 2)
                    useFrame(() => {
                        yPos.current += 0.008
                        if (yPos.current > 0.5) yPos.current = -2.5
                    })
                    return (
                        <mesh key={i} position={[(Math.random() - 0.5) * 8, yPos.current, (Math.random() - 0.5) * 7]}>
                            <sphereGeometry args={[0.02 + Math.random() * 0.03, 6, 6]} />
                            <meshStandardMaterial color="#87CEEB" transparent opacity={0.5} />
                        </mesh>
                    )
                })}
            </group>
        </>
    )
}

// ===== MAIN COMPONENT =====
export default function SonarSimulation3D() {
    const [isActive, setIsActive] = useState(true)
    const [khoaCamera, setKhoaCamera] = useState(false)
    const [toanManHinh, setToanManHinh] = useState(false)
    const [tabHienTai, setTabHienTai] = useState('dieuKhien')

    const [distance, setDistance] = useState(120)
    const [frequency, setFrequency] = useState(50000)
    const [signalStrength, setSignalStrength] = useState(0.8)
    const [pingInterval, setPingInterval] = useState(2.0)
    const [beamAngle, setBeamAngle] = useState(30)

    const [showSoundWaves, setShowSoundWaves] = useState(true)
    const [showSonarBeam, setShowSonarBeam] = useState(true)
    const [showEchoWave, setShowEchoWave] = useState(true)
    const [showMarkers, setShowMarkers] = useState(true)
    const [showTerrain, setShowTerrain] = useState(true)

    const [time, setTime] = useState(0)
    const [lastPingTime, setLastPingTime] = useState(0)
    const [pingCount, setPingCount] = useState(0)
    const [historyTime, setHistoryTime] = useState<number[]>([])
    const [historyDistance, setHistoryDistance] = useState<number[]>([])
    const [historyStrength, setHistoryStrength] = useState<number[]>([])
    const [historyTravelTime, setHistoryTravelTime] = useState<number[]>([])

    const [isClient, setIsClient] = useState(false)

    const speedOfSound = SPEED_OF_SOUND_WATER
    const travelTime = (distance * 2) / speedOfSound
    const maxDistance = 300

    useEffect(() => { setIsClient(true) }, [])

    // Animation loop
    useEffect(() => {
        if (!isClient) return
        let frameId: number
        let lastTime: number | null = null

        const animate = (currentTime: number) => {
            if (lastTime === null) { lastTime = currentTime; frameId = requestAnimationFrame(animate); return }
            const delta = (currentTime - lastTime) * 0.001
            if (isActive) {
                setTime(t => t + delta)
                const currentPing = Math.floor(time / pingInterval)
                const lastPing = Math.floor(lastPingTime / pingInterval)
                if (currentPing > lastPing) {
                    setPingCount(prev => prev + 1)
                    setHistoryTime(prev => [...prev.slice(-100), time])
                    setHistoryDistance(prev => [...prev.slice(-100), distance])
                    setHistoryStrength(prev => [...prev.slice(-100), signalStrength])
                    setHistoryTravelTime(prev => [...prev.slice(-100), travelTime])
                }
                setLastPingTime(time)
            }
            lastTime = currentTime
            frameId = requestAnimationFrame(animate)
        }
        frameId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frameId)
    }, [isClient, isActive, time, pingInterval, distance, signalStrength, travelTime])

    const reset = useCallback(() => {
        setTime(0); setLastPingTime(0); setPingCount(0); setDistance(120)
        setFrequency(50000); setSignalStrength(0.8); setPingInterval(2.0); setBeamAngle(30)
        setHistoryTime([]); setHistoryDistance([]); setHistoryStrength([]); setHistoryTravelTime([])
    }, [])

    const manualPing = useCallback(() => {
        setPingCount(prev => prev + 1)
        setHistoryTime(prev => [...prev.slice(-100), time])
        setHistoryDistance(prev => [...prev.slice(-100), distance])
        setHistoryStrength(prev => [...prev.slice(-100), signalStrength])
        setHistoryTravelTime(prev => [...prev.slice(-100), travelTime])
    }, [distance, signalStrength, time, travelTime])

    if (!isClient) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-cyan-900 p-6 flex items-center justify-center">
                <div className="text-center"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><div className="text-cyan-400 text-sm">Đang khởi tạo Sonar...</div></div>
            </div>
        )
    }

    return (
        <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 rounded-2xl shadow-2xl p-6 transition-all duration-300 ${toanManHinh ? 'fixed inset-4 z-50 overflow-y-auto' : ''}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 gap-3">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                        <Radar className="w-7 h-7 text-cyan-400" /> Mô Phỏng Sonar - Dò Địa Hình Đáy Biển
                    </h1>
                    <p className="text-gray-400 text-xs mt-0.5">Nguyên lý định vị bằng sóng âm | Phát hiện độ sâu, địa hình, vật thể dưới đáy</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => setToanManHinh(!toanManHinh)} className="p-1.5 rounded-lg bg-slate-700/50"><Maximize2 className="w-4 h-4 text-gray-300" /></button>
                    <button onClick={() => setKhoaCamera(!khoaCamera)} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${khoaCamera ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'}`}>
                        {khoaCamera ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}{khoaCamera ? 'Mở Camera' : 'Khóa Camera'}
                    </button>
                    <button onClick={reset} className="px-3 py-1.5 bg-slate-700/50 rounded-lg text-xs flex items-center gap-1.5 text-gray-300"><RefreshCw className="w-3.5 h-3.5" />Đặt Lại</button>
                    <button onClick={() => setIsActive(!isActive)} className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg ${isActive ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'} text-white`}>
                        {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}{isActive ? 'TẮT SONAR' : 'BẬT SONAR'}
                    </button>
                    <button onClick={manualPing} className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-xs font-bold flex items-center gap-1.5 text-white shadow-lg"><Zap className="w-3.5 h-3.5" />PING</button>
                </div>
            </div>

            {/* Main */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* 3D View */}
                <div className="lg:col-span-2">
                    <div className="h-[550px] rounded-xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-cyan-950/50 to-blue-950/50 shadow-2xl relative">
                        <Canvas camera={{ position: [8, 1.5, 12], fov: 50 }} shadows>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[5, 5, 5]} intensity={0.8} />
                            <directionalLight position={[0, 10, 0]} intensity={0.6} castShadow />
                            <pointLight position={[0, -2, 0]} intensity={0.4} color="#3b82f6" />

                            <fog attach="fog" args={['#0a2a4a', 15, 28]} />
                            <Stars radius={50} depth={50} count={1000} factor={3} fade speed={0.5} />

                            {/* Nền nước sâu */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
                                <planeGeometry args={[26, 26]} />
                                <meshStandardMaterial color="#0a4a6e" roughness={0.5} metalness={0.1} />
                            </mesh>

                            {/* Địa hình đáy biển */}
                            {showTerrain && <DetailedSeabed />}

                            {/* Chi tiết địa hình */}
                            {showTerrain && <TerrainDetails />}

                            {/* Vạch khoảng cách */}
                            {showMarkers && <DistanceMarkers />}

                            {/* Điểm echo */}
                            <EchoPoints isActive={isActive && showEchoWave} distance={distance} signalStrength={signalStrength} time={time} />

                            {/* Môi trường nước */}
                            <WaterEnvironment />

                            {/* Tàu */}
                            <Boat />

                            {/* Sóng sonar */}
                            <SonarRingWaves isActive={isActive && showSoundWaves} time={time} speedOfSound={speedOfSound} maxDistance={maxDistance} />

                            {/* Sóng echo */}
                            <EchoWave isActive={isActive && showEchoWave} time={time} speedOfSound={speedOfSound} distance={distance} signalStrength={signalStrength} />

                            {/* Tia sonar */}
                            <SonarBeam isActive={isActive && showSonarBeam} angle={beamAngle} distance={distance} time={time} />

                            {/* UI */}
                            <SonarDisplay distance={distance} travelTime={travelTime} signalStrength={signalStrength} isActive={isActive} pingCount={pingCount} />
                            <Legend />

                            <OrbitControls enabled={!khoaCamera} enablePan enableZoom enableRotate minDistance={4} maxDistance={20} target={[0, -1.5, 0]} />
                        </Canvas>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Control Panel */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Settings className="w-4 h-4 text-cyan-400" />Điều Khiển</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-300 flex items-center gap-1.5 mb-1.5"><Target className="w-3.5 h-3.5 text-orange-400" />Khoảng cách đáy</label>
                                <input type="range" min={30} max={250} step={5} value={distance} onChange={(e) => setDistance(parseFloat(e.target.value))} className="w-full h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg" />
                                <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>30m</span><span className="text-orange-400 font-bold">{distance.toFixed(0)}m</span><span>250m</span></div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-300 flex items-center gap-1.5 mb-1.5"><Volume2 className="w-3.5 h-3.5 text-green-400" />Cường độ tín hiệu</label>
                                <input type="range" min={0.2} max={1} step={0.02} value={signalStrength} onChange={(e) => setSignalStrength(parseFloat(e.target.value))} className="w-full h-1.5 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg" />
                                <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>20%</span><span className="text-green-400 font-bold">{(signalStrength * 100).toFixed(0)}%</span><span>100%</span></div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-300 flex items-center gap-1.5 mb-1.5"><Clock className="w-3.5 h-3.5 text-purple-400" />Chu kỳ ping</label>
                                <input type="range" min={0.5} max={3} step={0.1} value={pingInterval} onChange={(e) => setPingInterval(parseFloat(e.target.value))} className="w-full h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg" />
                                <div className="flex justify-between text-xs text-gray-400 mt-0.5"><span>0.5s</span><span className="text-purple-400 font-bold">{pingInterval.toFixed(1)}s</span><span>3s</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Display Options */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" />Hiển Thị</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: 'terrain', label: 'Địa hình', icon: Mountain, color: 'orange', state: showTerrain, setState: setShowTerrain },
                                { id: 'soundWaves', label: 'Sóng phát', icon: Waves, color: 'blue', state: showSoundWaves, setState: setShowSoundWaves },
                                { id: 'echoWave', label: 'Sóng echo', icon: Radio, color: 'red', state: showEchoWave, setState: setShowEchoWave },
                                { id: 'sonarBeam', label: 'Tia sonar', icon: Navigation, color: 'cyan', state: showSonarBeam, setState: setShowSonarBeam },
                                { id: 'markers', label: 'Mốc khoảng cách', icon: Ruler, color: 'yellow', state: showMarkers, setState: setShowMarkers }
                            ].map(item => (
                                <label key={item.id} className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg cursor-pointer hover:bg-slate-700/50">
                                    <div className="flex items-center gap-1.5"><item.icon className={`w-3.5 h-3.5 text-${item.color}-400`} /><span className="text-xs text-gray-300">{item.label}</span></div>
                                    <input type="checkbox" checked={item.state} onChange={(e) => item.setState(e.target.checked)} className="w-4 h-4 rounded border-gray-600 text-cyan-500" />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Thông tin vật lý */}
                    <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-4 border border-cyan-500/30">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Brain className="w-4 h-4 text-cyan-400" />Nguyên Lý</h3>
                        <div className="text-xs text-gray-300 space-y-1.5">
                            <div className="font-mono text-cyan-400">d = v × t / 2</div>
                            <div>• d: Khoảng cách đến đáy (m)</div>
                            <div>• v: Vận tốc âm trong nước (1500 m/s)</div>
                            <div>• t: Thời gian sóng đi và về (s)</div>
                            <div className="pt-1 text-gray-400">Sóng âm phát ra từ sonar, gặp đáy biển phản xạ trở lại. Đo thời gian → tính độ sâu.</div>
                        </div>
                    </div>

                    {/* Hướng dẫn */}
                    <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-xl p-4 border border-yellow-500/30">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Info className="w-4 h-4 text-yellow-400" />Hướng Dẫn</h3>
                        <ul className="text-xs text-gray-300 space-y-1">
                            <li>• 🖱️ Kéo chuột để xoay camera 3D</li>
                            <li>• 🎯 Điều chỉnh thanh trượt để thay đổi độ sâu</li>
                            <li>• 📡 Bật sonar để xem sóng phát và echo</li>
                            <li>• ⚡ Nhấn "PING" để gửi xung thủ công</li>
                            <li>• 🏔️ Bật/tắt địa hình trong tab Hiển Thị</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="mt-5">
                <SonarWaveChart
                    timeData={historyTime}
                    distanceData={historyDistance}
                    strengthData={historyStrength}
                    travelTimeData={historyTravelTime}
                    title="Biểu Đồ Phân Tích Tín Hiệu Sonar"
                    currentDistance={distance}
                    currentStrength={signalStrength}
                    speedOfSound={speedOfSound}
                />
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-700 text-center">
                <p className="text-gray-500 text-[10px]">📡 Mô phỏng nguyên lý Sonar - Dò tìm địa hình đáy biển bằng sóng âm | v = 1500 m/s | Công thức d = v·t/2</p>
            </div>
        </div>
    )
}