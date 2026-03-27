'use client'

import { useRef, useEffect, useState, useMemo } from 'react'

interface WaveInterferencePatternProps {
    width?: number
    height?: number
    sourceDistance?: number
    wavelength?: number
    frequency?: number
    amplitude?: number
    phaseDiff?: number
    time?: number
}

export default function WaveInterferencePattern({
    width = 600,
    height = 500,
    sourceDistance = 120,
    wavelength = 40,
    frequency = 0.5,
    amplitude = 1,
    phaseDiff = 0,
    time = 0
}: WaveInterferencePatternProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isPlaying, setIsPlaying] = useState(true)
    const [currentTime, setCurrentTime] = useState(time)

    // Vị trí hai nguồn
    const centerX = width / 2
    const centerY = height / 2
    const source1X = centerX - sourceDistance / 2
    const source2X = centerX + sourceDistance / 2
    const sourceY = centerY

    // Hàm tính biên độ tại một điểm
    const calculateAmplitude = (x: number, y: number, t: number): number => {
        const d1 = Math.hypot(x - source1X, y - sourceY)
        const d2 = Math.hypot(x - source2X, y - sourceY)

        const k = 2 * Math.PI / wavelength
        const omega = 2 * Math.PI * frequency

        const u1 = amplitude * Math.cos(omega * t - k * d1)
        const u2 = amplitude * Math.cos(omega * t - k * d2 + phaseDiff)

        return u1 + u2
    }

    // Hàm tính màu dựa trên biên độ
    const getColor = (amplitude: number, maxAmp: number): string => {
        const normalized = Math.abs(amplitude) / maxAmp
        const intensity = Math.min(255, Math.floor(128 + normalized * 127))

        if (amplitude > 0) {
            // Cực đại (đỏ)
            return `rgb(${intensity}, ${Math.floor(intensity * 0.3)}, ${Math.floor(intensity * 0.3)})`
        } else {
            // Cực tiểu (xanh)
            return `rgb(${Math.floor(intensity * 0.3)}, ${Math.floor(intensity * 0.3)}, ${intensity})`
        }
    }

    // Vẽ hình ảnh giao thoa
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const imageData = ctx.createImageData(width, height)
        const data = imageData.data

        // Tìm biên độ cực đại để chuẩn hóa
        let maxAmp = 0
        const step = 4
        for (let x = 0; x < width; x += step) {
            for (let y = 0; y < height; y += step) {
                const amp = Math.abs(calculateAmplitude(x, y, currentTime))
                if (amp > maxAmp) maxAmp = amp
            }
        }
        if (maxAmp === 0) maxAmp = 1

        // Vẽ từng pixel
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const amp = calculateAmplitude(x, y, currentTime)
                const color = getColor(amp, maxAmp)

                const idx = (y * width + x) * 4
                const rgb = color.match(/\d+/g)
                if (rgb) {
                    data[idx] = parseInt(rgb[0])
                    data[idx + 1] = parseInt(rgb[1])
                    data[idx + 2] = parseInt(rgb[2])
                    data[idx + 3] = 255
                }
            }
        }

        ctx.putImageData(imageData, 0, 0)

        // Vẽ các nguồn
        ctx.beginPath()
        ctx.arc(source1X, sourceY, 8, 0, 2 * Math.PI)
        ctx.fillStyle = '#f59e0b'
        ctx.fill()
        ctx.fillStyle = 'white'
        ctx.font = 'bold 12px Arial'
        ctx.fillText('S₁', source1X - 4, sourceY + 4)

        ctx.beginPath()
        ctx.arc(source2X, sourceY, 8, 0, 2 * Math.PI)
        ctx.fillStyle = '#10b981'
        ctx.fill()
        ctx.fillStyle = 'white'
        ctx.fillText('S₂', source2X - 4, sourceY + 4)

        // Vẽ đường trung trực
        ctx.beginPath()
        ctx.moveTo(centerX, 0)
        ctx.lineTo(centerX, height)
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([])

    }, [width, height, sourceDistance, wavelength, frequency, amplitude, phaseDiff, currentTime])

    // Animation loop
    useEffect(() => {
        if (!isPlaying) return

        let animationFrame: number
        let lastTime = performance.now()

        const animate = (now: number) => {
            const delta = (now - lastTime) / 1000
            lastTime = now

            setCurrentTime(t => t + delta * frequency)

            animationFrame = requestAnimationFrame(animate)
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [isPlaying, frequency])

    return (
        <div className="space-y-4">
            <div className="relative">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="rounded-xl shadow-lg border border-gray-300 dark:border-gray-700 w-full h-auto"
                    style={{ backgroundColor: '#0a0a2a' }}
                />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`px-4 py-2 rounded-lg font-medium ${isPlaying
                            ? 'bg-yellow-500 text-white'
                            : 'bg-green-500 text-white'
                            }`}
                    >
                        {isPlaying ? 'Tạm Dừng' : 'Phát'}
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded" />
                        <span className="text-sm">Cực đại</span>
                        <div className="w-4 h-4 bg-blue-500 rounded ml-2" />
                        <span className="text-sm">Cực tiểu</span>
                    </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                    t = {currentTime.toFixed(2)} s | λ = {wavelength} px | Δφ = {(phaseDiff * 180 / Math.PI).toFixed(0)}°
                </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                    <strong>🎯 Vân giao thoa:</strong> Các vân sáng (đỏ) là nơi hai sóng tăng cường,
                    vân tối (xanh) là nơi hai sóng triệt tiêu. Khoảng cách giữa các vân tỉ lệ với bước sóng λ.
                </p>
            </div>
        </div>
    )
}