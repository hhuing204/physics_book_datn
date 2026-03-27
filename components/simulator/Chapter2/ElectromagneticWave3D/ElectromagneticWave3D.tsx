'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import * as THREE from 'three'

interface ElectromagneticWaveProps {
    amplitude?: number
    wavelength?: number
    frequency?: number
    time?: number
    showElectric?: boolean
    showMagnetic?: boolean
}

// Component hiển thị sóng điện từ
function EMWave({
    amplitude = 1,
    wavelength = 3,
    frequency = 0.5,
    time = 0,
    showElectric = true,
    showMagnetic = true
}: ElectromagneticWaveProps) {
    const pointsCount = 150
    const length = 12
    const k = 2 * Math.PI / wavelength
    const omega = 2 * Math.PI * frequency

    // Dữ liệu sóng điện trường (trong mặt phẳng YZ)
    const electricPoints = useMemo(() => {
        const points: THREE.Vector3[] = []
        const step = length / pointsCount

        for (let i = 0; i <= pointsCount; i++) {
            const x = -length / 2 + i * step
            const E = amplitude * Math.cos(omega * time - k * x)
            points.push(new THREE.Vector3(x, E, 0))
        }
        return points
    }, [amplitude, wavelength, frequency, time, pointsCount, length])

    // Dữ liệu sóng từ trường (trong mặt phẳng XZ)
    const magneticPoints = useMemo(() => {
        const points: THREE.Vector3[] = []
        const step = length / pointsCount

        for (let i = 0; i <= pointsCount; i++) {
            const x = -length / 2 + i * step
            const B = amplitude * Math.cos(omega * time - k * x)
            points.push(new THREE.Vector3(x, 0, B))
        }
        return points
    }, [amplitude, wavelength, frequency, time, pointsCount, length])

    // Các mũi tên thể hiện vectơ E và B tại một số điểm
    const arrows = useMemo(() => {
        const numArrows = 15
        const step = length / numArrows
        const arrowsData: { x: number; E: number; B: number }[] = []

        for (let i = 0; i <= numArrows; i++) {
            const x = -length / 2 + i * step
            const E = amplitude * Math.cos(omega * time - k * x)
            const B = amplitude * Math.cos(omega * time - k * x)
            arrowsData.push({ x, E, B })
        }
        return arrowsData
    }, [amplitude, wavelength, frequency, time, length])

    return (
        <group>
            {/* Sóng điện trường (màu đỏ) */}
            {showElectric && (
                <Line
                    points={electricPoints}
                    color="#ef4444"
                    lineWidth={3}
                />
            )}

            {/* Sóng từ trường (màu xanh) */}
            {showMagnetic && (
                <Line
                    points={magneticPoints}
                    color="#3b82f6"
                    lineWidth={3}
                />
            )}

            {/* Các mũi tên vectơ */}
            {arrows.map((arrow, idx) => (
                <group key={`arrow-${idx}`} position={[arrow.x, 0, 0]}>
                    {/* Mũi tên điện trường (dọc theo Y) */}
                    {showElectric && Math.abs(arrow.E) > 0.1 && (
                        <>
                            <mesh position={[0, arrow.E / 2, 0]}>
                                <coneGeometry args={[0.08, 0.3, 8]} />
                                <meshStandardMaterial color="#ef4444" />
                            </mesh>
                            <Line
                                points={[[0, 0, 0], [0, arrow.E, 0]]}
                                color="#ef4444"
                                lineWidth={2}
                            />
                        </>
                    )}

                    {/* Mũi tên từ trường (dọc theo Z) */}
                    {showMagnetic && Math.abs(arrow.B) > 0.1 && (
                        <>
                            <mesh position={[0, 0, arrow.B / 2]}>
                                <coneGeometry args={[0.08, 0.3, 8]} />
                                <meshStandardMaterial color="#3b82f6" />
                            </mesh>
                            <Line
                                points={[[0, 0, 0], [0, 0, arrow.B]]}
                                color="#3b82f6"
                                lineWidth={2}
                            />
                        </>
                    )}
                </group>
            ))}

            {/* Phương truyền sóng */}
            <Line
                points={[[-length / 2 - 1, 0, 0], [length / 2 + 1, 0, 0]]}
                color="#888"
                lineWidth={2}
            />
            <Html position={[length / 2 + 0.5, 0.5, 0]} center>
                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    Phương truyền sóng
                </div>
            </Html>
        </group>
    )
}

// Component thang sóng điện từ
export function ThangSongDienTu() {
    const waveTypes = [
        { name: 'Tia Gamma', wavelength: '0.01 nm', frequency: '3×10¹⁹ Hz', color: '#8b5cf6', icon: '⚛️' },
        { name: 'Tia X', wavelength: '0.1 - 10 nm', frequency: '3×10¹⁶ - 3×10¹⁹ Hz', color: '#a855f7', icon: '🦴' },
        { name: 'Tia UV', wavelength: '10 - 400 nm', frequency: '7.5×10¹⁴ - 3×10¹⁶ Hz', color: '#ec489a', icon: '☀️' },
        { name: 'Ánh sáng nhìn thấy', wavelength: '400 - 700 nm', frequency: '4.3×10¹⁴ - 7.5×10¹⁴ Hz', color: '#f97316', icon: '🌈' },
        { name: 'Hồng ngoại', wavelength: '0.7 μm - 1 mm', frequency: '3×10¹¹ - 4.3×10¹⁴ Hz', color: '#ef4444', icon: '🔥' },
        { name: 'Vi sóng', wavelength: '1 mm - 1 m', frequency: '3×10⁸ - 3×10¹¹ Hz', color: '#f59e0b', icon: '📡' },
        { name: 'Sóng Radio', wavelength: '> 1 m', frequency: '< 3×10⁸ Hz', color: '#3b82f6', icon: '📻' }
    ]

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[800px]">
                {/* Thang đo logarit */}
                <div className="relative h-20 bg-gradient-to-r from-purple-600 via-blue-500 via-green-500 to-red-500 rounded-lg mb-8">
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                        {waveTypes.map((wave, idx) => (
                            <div key={idx} className="text-center">
                                <div className="w-0.5 h-8 bg-white mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danh sách các loại sóng */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                    {waveTypes.map((wave, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-md border-l-4"
                            style={{ borderLeftColor: wave.color }}
                        >
                            <div className="text-2xl mb-1">{wave.icon}</div>
                            <div className="font-bold text-sm">{wave.name}</div>
                            <div className="text-xs text-gray-500 mt-1">{wave.wavelength}</div>
                            <div className="text-[10px] text-gray-400">{wave.frequency}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Component chính
export default function ElectromagneticWave3D({
    amplitude = 1,
    wavelength = 3,
    frequency = 0.5,
    showElectric = true,
    showMagnetic = true
}: ElectromagneticWaveProps) {
    const [time, setTime] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [localShowElectric, setLocalShowElectric] = useState(showElectric)
    const [localShowMagnetic, setLocalShowMagnetic] = useState(showMagnetic)

    useEffect(() => {
        if (!isPlaying) return

        let animationFrame: number
        let lastTime = performance.now()

        const animate = (currentTime: number) => {
            const delta = (currentTime - lastTime) / 1000
            lastTime = currentTime

            setTime(t => t + delta * frequency)

            animationFrame = requestAnimationFrame(animate)
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [isPlaying, frequency])

    return (
        <div className="space-y-6">
            {/* View 3D */}
            <div className="h-[450px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                <Canvas camera={{ position: [8, 5, 8], fov: 45 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <OrbitControls enablePan enableZoom enableRotate />

                    <EMWave
                        amplitude={amplitude}
                        wavelength={wavelength}
                        frequency={frequency}
                        time={time}
                        showElectric={localShowElectric}
                        showMagnetic={localShowMagnetic}
                    />

                    <gridHelper args={[20, 20, '#4b5563', '#1f2937']} position={[0, -2, 0]} />
                </Canvas>
            </div>

            {/* Điều khiển */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-4 py-2 rounded-lg font-medium ${isPlaying
                                ? 'bg-yellow-500 text-white'
                                : 'bg-green-500 text-white'
                            }`}
                    >
                        {isPlaying ? 'Tạm Dừng' : 'Phát'}
                    </button>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localShowElectric}
                                onChange={(e) => setLocalShowElectric(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="text-red-500 text-sm">Điện trường E</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={localShowMagnetic}
                                onChange={(e) => setLocalShowMagnetic(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="text-blue-500 text-sm">Từ trường B</span>
                        </label>
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    t = {time.toFixed(2)} s
                </div>
            </div>

            {/* Giải thích */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">
                    📡 Sóng điện từ là gì?
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                    Sóng điện từ là sự lan truyền của điện trường và từ trường biến thiên trong không gian.
                    Điện trường E và từ trường B dao động cùng pha, vuông góc với nhau và vuông góc với
                    phương truyền sóng. Sóng điện từ truyền được trong chân không với tốc độ c = 3×10⁸ m/s.
                </p>
            </div>
        </div>
    )
}