'use client'

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import * as THREE from 'three'

interface LongitudinalWaveProps {
    amplitude: number
    wavelength: number
    frequency: number
    time: number
    color?: string
    numPoints?: number
}

// Component hiển thị các phần tử dao động dọc
function PhanTuDaoDong({
    x,
    displacement,
    originalX,
    color = '#f59e0b'
}: {
    x: number
    displacement: number
    originalX: number
    color?: string
}) {
    return (
        <group position={[x, 0, 0]}>
            {/* Hình cầu đại diện cho phần tử */}
            <mesh>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
            </mesh>

            {/* Đường kẻ thể hiện sự dịch chuyển */}
            <Line
                points={[[originalX - x, -0.3, 0], [originalX - x, 0.3, 0]]}
                color="#666"
                lineWidth={1}
            />

            {/* Vị trí cân bằng (đường chấm) */}
            <Line
                points={[[-0.4, -0.2, 0], [0.4, -0.2, 0]]}
                color="#888"
                lineWidth={1}
                dashed
                dashSize={0.05}
                gapSize={0.03}
            />
        </group>
    )
}

// Component sóng dọc 3D
export default function LongitudinalWave({
    amplitude = 0.8,
    wavelength = 3,
    frequency = 0.8,
    time = 0,
    color = '#f59e0b',
    numPoints = 25
}: LongitudinalWaveProps) {
    const groupRef = useRef<THREE.Group>(null)
    const particlesRef = useRef<(THREE.Group | null)[]>([])

    // Tạo các vị trí cân bằng ban đầu
    const equilibriumPositions = useMemo(() => {
        const positions: number[] = []
        const startX = -8
        const endX = 8
        const step = (endX - startX) / (numPoints - 1)

        for (let i = 0; i < numPoints; i++) {
            positions.push(startX + i * step)
        }
        return positions
    }, [numPoints])

    // Tính độ dịch chuyển của mỗi phần tử
    const displacements = useMemo(() => {
        const k = 2 * Math.PI / wavelength
        const omega = 2 * Math.PI * frequency

        return equilibriumPositions.map(x => {
            // Sóng dọc: độ dịch chuyển cùng phương truyền sóng
            return amplitude * Math.cos(omega * time - k * x)
        })
    }, [equilibriumPositions, amplitude, wavelength, frequency, time])

    // Tạo các đường nối giữa các phần tử để thấy rõ vùng nén/giãn
    const connectionPoints = useMemo(() => {
        const points: THREE.Vector3[] = []
        for (let i = 0; i < numPoints; i++) {
            const x = equilibriumPositions[i] + displacements[i]
            points.push(new THREE.Vector3(x, 0.2, 0))
        }
        return points
    }, [equilibriumPositions, displacements, numPoints])

    // Các vùng nén và giãn
    const compressionZones = useMemo(() => {
        const zones: { x: number; type: 'compression' | 'rarefaction' }[] = []
        for (let i = 1; i < numPoints; i++) {
            const dist1 = displacements[i] - displacements[i - 1]
            const x1 = equilibriumPositions[i - 1] + displacements[i - 1]
            const x2 = equilibriumPositions[i] + displacements[i]
            const gap = x2 - x1

            // Khoảng cách giữa 2 phần tử so với khoảng cách cân bằng
            const equilibriumGap = equilibriumPositions[i] - equilibriumPositions[i - 1]
            if (gap < equilibriumGap * 0.8) {
                zones.push({ x: (x1 + x2) / 2, type: 'compression' })
            } else if (gap > equilibriumGap * 1.2) {
                zones.push({ x: (x1 + x2) / 2, type: 'rarefaction' })
            }
        }
        return zones
    }, [equilibriumPositions, displacements, numPoints])

    return (
        <group ref={groupRef}>
            {/* Đường nối các phần tử (thể hiện sự nén/giãn) */}
            <Line
                points={connectionPoints}
                color={color}
                lineWidth={2}
            />

            {/* Các phần tử dao động */}
            {equilibriumPositions.map((eqX, idx) => {
                const disp = displacements[idx]
                const currentX = eqX + disp

                return (
                    <PhanTuDaoDong
                        key={idx}
                        x={currentX}
                        displacement={disp}
                        originalX={eqX}
                        color={color}
                    />
                )
            })}

            {/* Đánh dấu vùng nén và giãn */}
            {compressionZones.map((zone, idx) => (
                <mesh key={`zone-${idx}`} position={[zone.x, 0.6, 0]}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshStandardMaterial
                        color={zone.type === 'compression' ? '#ef4444' : '#10b981'}
                        emissive={zone.type === 'compression' ? '#ef4444' : '#10b981'}
                        emissiveIntensity={0.5}
                    />
                    <Html position={[0, 0.3, 0]} center>
                        <div className={`text-[10px] whitespace-nowrap px-1 py-0.5 rounded ${zone.type === 'compression'
                            ? 'bg-red-500 text-white'
                            : 'bg-green-500 text-white'
                            }`}>
                            {zone.type === 'compression' ? 'NÉN' : 'GIÃN'}
                        </div>
                    </Html>
                </mesh>
            ))}

            {/* Trục tọa độ */}
            <Line
                points={[[-10, -0.8, 0], [10, -0.8, 0]]}
                color="#666"
                lineWidth={1}
            />
            <Line
                points={[[0, -1, 0], [0, 1, 0]]}
                color="#666"
                lineWidth={1}
            />
        </group>
    )
}