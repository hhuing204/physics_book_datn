'use client'

import { useRef, useState, useEffect } from 'react'

interface WaveOnStringProps {
    amplitude?: number
    frequency?: number
    damping?: number
    tension?: number
    pulseMode?: boolean
}

export default function WaveOnString({
    amplitude = 0.5,
    frequency = 1,
    damping = 0,
    tension = 1,
    pulseMode = false
}: WaveOnStringProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isPlaying, setIsPlaying] = useState(true)
    const [time, setTime] = useState(0)
    const [fixedEnd, setFixedEnd] = useState<'fixed' | 'loose' | 'none'>('fixed')
    const [waveType, setWaveType] = useState<'manual' | 'oscillate' | 'pulse'>('oscillate')
    const [pulseSent, setPulseSent] = useState(false)

    const width = 800
    const height = 300
    const stringLength = width - 100
    const startX = 50
    const endX = width - 50
    const yCenter = height / 2

    // Hàm tính li độ của dây tại vị trí x và thời gian t
    const calculateDisplacement = (x: number, t: number): number => {
        const relativeX = (x - startX) / stringLength

        if (waveType === 'oscillate') {
            // Sóng điều hòa từ nguồn
            const k = 2 * Math.PI * frequency / (tension * 100)
            const omega = 2 * Math.PI * frequency
            let u = amplitude * Math.cos(omega * t - k * relativeX * stringLength)

            // Giảm dần
            u *= Math.exp(-damping * relativeX)

            // Phản xạ ở đầu cố định
            if (fixedEnd === 'fixed') {
                const reflected = -amplitude * Math.cos(omega * t - k * (stringLength * 2 - relativeX * stringLength))
                u += reflected * Math.exp(-damping * (1 - relativeX))
            } else if (fixedEnd === 'loose') {
                const reflected = amplitude * Math.cos(omega * t - k * (stringLength * 2 - relativeX * stringLength))
                u += reflected * Math.exp(-damping * (1 - relativeX))
            }

            return u
        } else if (waveType === 'pulse' && pulseSent) {
            // Xung sóng
            const pulseSpeed = tension * 200
            const pulseCenter = startX + (t * pulseSpeed) % (stringLength * 2)
            const pulseWidth = 50
            let u = amplitude * Math.exp(-Math.pow((x - pulseCenter), 2) / (2 * pulseWidth * pulseWidth))

            // Phản xạ
            if (fixedEnd === 'fixed') {
                if (pulseCenter > endX) {
                    const reflectedCenter = endX - (pulseCenter - endX)
                    u += -amplitude * Math.exp(-Math.pow((x - reflectedCenter), 2) / (2 * pulseWidth * pulseWidth))
                }
            }

            return u
        }

        return 0
    }

    // Vẽ dây
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, width, height)

        // Vẽ nền
        ctx.fillStyle = '#1a1a2e'
        ctx.fillRect(0, 0, width, height)

        // Vẽ đường trung tâm
        ctx.beginPath()
        ctx.moveTo(startX, yCenter)
        ctx.lineTo(endX, yCenter)
        ctx.strokeStyle = '#4b5563'
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([])

        // Vẽ dây
        ctx.beginPath()
        let firstPoint = true

        for (let x = startX; x <= endX; x += 2) {
            const u = calculateDisplacement(x, time)
            const y = yCenter - u * 50

            if (firstPoint) {
                ctx.moveTo(x, y)
                firstPoint = false
            } else {
                ctx.lineTo(x, y)
            }
        }

        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 3
        ctx.stroke()

        // Vẽ nguồn dao động
        ctx.beginPath()
        ctx.arc(startX, yCenter - calculateDisplacement(startX, time) * 50, 6, 0, 2 * Math.PI)
        ctx.fillStyle = '#ef4444'
        ctx.fill()
        ctx.fillStyle = 'white'
        ctx.font = 'bold 10px Arial'
        ctx.fillText('NGUỒN', startX - 20, yCenter - 15)

        // Vẽ đầu cuối
        if (fixedEnd !== 'none') {
            ctx.beginPath()
            ctx.rect(endX - 10, yCenter - 20, 20, 40)
            ctx.fillStyle = '#6b7280'
            ctx.fill()

            ctx.fillStyle = 'white'
            ctx.font = '10px Arial'
            ctx.fillText(fixedEnd === 'fixed' ? 'CỐ ĐỊNH' : 'TỰ DO', endX - 15, yCenter - 25)
        }

    }, [time, amplitude, frequency, damping, tension, waveType, fixedEnd, pulseSent, width, height, startX, endX, yCenter, stringLength])

    // Animation loop
    useEffect(() => {
        if (!isPlaying) return

        let animationFrame: number
        let lastTime = performance.now()

        const animate = (now: number) => {
            const delta = (now - lastTime) / 1000
            lastTime = now

            setTime(t => t + delta)

            animationFrame = requestAnimationFrame(animate)
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [isPlaying])

    // Gửi xung
    const sendPulse = () => {
        setPulseSent(true)
        setTimeout(() => setPulseSent(false), 2000)
    }

    return (
        <div className="space-y-4">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="rounded-xl shadow-lg w-full h-auto bg-gray-900"
            />

            <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-4 py-2 rounded-lg font-medium ${isPlaying ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}
                    >
                        {isPlaying ? 'Tạm Dừng' : 'Phát'}
                    </button>

                    <button
                        onClick={() => setTime(0)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    >
                        Đặt Lại
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setWaveType('oscillate')}
                        className={`px-3 py-1 rounded-lg text-sm ${waveType === 'oscillate' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        Dao động
                    </button>
                    <button
                        onClick={() => setWaveType('pulse')}
                        className={`px-3 py-1 rounded-lg text-sm ${waveType === 'pulse' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        Xung sóng
                    </button>
                </div>

                {waveType === 'pulse' && (
                    <button
                        onClick={sendPulse}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg"
                    >
                        Gửi Xung
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label className="text-sm">Biên độ A</label>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={amplitude}
                        onChange={(e) => (window as any).amplitude = parseFloat(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="text-sm">Tần số f</label>
                    <input
                        type="range"
                        min={0.2}
                        max={3}
                        step={0.1}
                        value={frequency}
                        onChange={(e) => (window as any).frequency = parseFloat(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="text-sm">Lực căng</label>
                    <input
                        type="range"
                        min={0.5}
                        max={2}
                        step={0.1}
                        value={tension}
                        onChange={(e) => (window as any).tension = parseFloat(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="text-sm">Đầu cuối</label>
                    <select
                        value={fixedEnd}
                        onChange={(e) => setFixedEnd(e.target.value as any)}
                        className="w-full p-1 rounded border"
                    >
                        <option value="fixed">Cố định</option>
                        <option value="loose">Tự do</option>
                        <option value="none">Không phản xạ</option>
                    </select>
                </div>
            </div>
        </div>
    )
}