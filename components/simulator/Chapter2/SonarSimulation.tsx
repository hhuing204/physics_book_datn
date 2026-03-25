'use client'

import { useRef, useState, useEffect } from 'react'

interface SonarSimulationProps {
    speedOfSound?: number
    pingInterval?: number
}

export default function SonarSimulation({
    speedOfSound = 343,
    pingInterval = 2000
}: SonarSimulationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isActive, setIsActive] = useState(true)
    const [distance, setDistance] = useState(200)
    const [lastDistance, setLastDistance] = useState(0)
    const [pulses, setPulses] = useState<{ radius: number; active: boolean; returnRadius?: number }[]>([])

    const width = 600
    const height = 400
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = 300

    // Mô phỏng sonar ping
    const sendPing = () => {
        const newPulse = { radius: 0, active: true }
        setPulses(prev => [...prev, newPulse])

        // Tính thời gian sóng phản xạ
        const travelTime = (distance * 2) / speedOfSound * 1000

        setTimeout(() => {
            setPulses(prev =>
                prev.map(p =>
                    p === newPulse ? { ...p, returnRadius: p.radius, active: false } : p
                )
            )
            setLastDistance(distance)
        }, travelTime)
    }

    // Ping tự động
    useEffect(() => {
        if (!isActive) return

        const interval = setInterval(sendPing, pingInterval)
        return () => clearInterval(interval)
    }, [isActive, distance, pingInterval])

    // Animation vòng tròn sóng
    useEffect(() => {
        let animationFrame: number

        const animate = () => {
            setPulses(prev =>
                prev
                    .map(pulse => ({
                        ...pulse,
                        radius: pulse.active
                            ? Math.min(pulse.radius + 3, maxRadius)
                            : pulse.returnRadius !== undefined
                                ? Math.min(pulse.returnRadius + 3, maxRadius)
                                : pulse.radius
                    }))
                    .filter(pulse => pulse.radius < maxRadius)
            )

            animationFrame = requestAnimationFrame(animate)
        }

        animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [maxRadius])

    // Vẽ
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, width, height)

        // Vẽ nền (nước)
        ctx.fillStyle = '#0a4a6e'
        ctx.fillRect(0, 0, width, height)

        // Vẽ đáy biển
        ctx.fillStyle = '#6b4c3b'
        ctx.fillRect(0, height - 80, width, 80)

        // Vẽ tàu
        ctx.beginPath()
        ctx.moveTo(centerX - 30, height - 100)
        ctx.lineTo(centerX + 30, height - 100)
        ctx.lineTo(centerX + 20, height - 80)
        ctx.lineTo(centerX - 20, height - 80)
        ctx.closePath()
        ctx.fillStyle = '#c2410c'
        ctx.fill()

        // Vẽ sonar
        ctx.beginPath()
        ctx.arc(centerX, height - 90, 10, 0, 2 * Math.PI)
        ctx.fillStyle = '#f59e0b'
        ctx.fill()

        // Vẽ vòng tròn sóng
        pulses.forEach(pulse => {
            ctx.beginPath()
            ctx.arc(centerX, height - 90, pulse.radius, 0, 2 * Math.PI)
            ctx.strokeStyle = pulse.active ? '#3b82f6' : '#ef4444'
            ctx.lineWidth = 2
            ctx.stroke()
        })

        // Vẽ vật thể
        const objectX = centerX + (distance * Math.cos(45 * Math.PI / 180))
        const objectY = height - 90 - (distance * Math.sin(45 * Math.PI / 180))

        ctx.beginPath()
        ctx.arc(objectX, objectY, 12, 0, 2 * Math.PI)
        ctx.fillStyle = '#22c55e'
        ctx.fill()
        ctx.fillStyle = 'white'
        ctx.font = 'bold 10px Arial'
        ctx.fillText('CÁ', objectX - 5, objectY + 4)

        // Vẽ khoảng cách
        ctx.beginPath()
        ctx.moveTo(centerX, height - 90)
        ctx.lineTo(objectX, objectY)
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = 'white'
        ctx.font = '12px Arial'
        ctx.fillText(`Khoảng cách: ${distance.toFixed(0)} m`, 20, 40)
        ctx.fillText(`Thời gian phản hồi: ${(distance * 2 / speedOfSound * 1000).toFixed(0)} ms`, 20, 65)

        if (lastDistance > 0) {
            ctx.fillStyle = '#4ade80'
            ctx.fillText(`Phát hiện vật thể ở ${lastDistance.toFixed(0)} m`, 20, 90)
        }
    }, [pulses, distance, lastDistance, width, height, centerX, centerY, speedOfSound])

    return (
        <div className="space-y-4">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="rounded-xl shadow-lg w-full h-auto"
            />

            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`px-4 py-2 rounded-lg font-medium ${isActive
                            ? 'bg-red-500 text-white'
                            : 'bg-green-500 text-white'
                            }`}
                    >
                        {isActive ? 'Tắt Sonar' : 'Bật Sonar'}
                    </button>

                    <button
                        onClick={sendPing}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        Gửi Xung (Ping)
                    </button>
                </div>

                <div className="w-64">
                    <label className="text-sm">Khoảng cách vật thể (m)</label>
                    <input
                        type="range"
                        min={50}
                        max={300}
                        step={10}
                        value={distance}
                        onChange={(e) => setDistance(parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="text-center text-sm">{distance} m</div>
                </div>
            </div>

            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4">
                <h4 className="font-bold text-cyan-700 dark:text-cyan-300 mb-2">
                    🐬 Kỹ thuật Sonar
                </h4>
                <p className="text-sm text-cyan-600 dark:text-cyan-400">
                    Sonar (Sound Navigation and Ranging) sử dụng sóng siêu âm để phát hiện vật thể dưới nước.
                    Cá heo, cá voi và dơi cũng sử dụng cơ chế tương tự để định vị và săn mồi.
                    Nguyên lý: phát sóng siêu âm, đo thời gian sóng phản xạ, tính khoảng cách d = v·t/2.
                </p>
            </div>
        </div>
    )
}