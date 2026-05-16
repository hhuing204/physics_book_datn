// components/SimulationModal.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import * as Chapter1 from '@/components/simulator/Chapter1'
import * as Chapter2 from '@/components/simulator/Chapter2'

const chapterModules: Record<string, Record<string, any>> = {
    1: Chapter1,
    2: Chapter2,
}

interface SimulationModalProps {
    isOpen: boolean
    onClose: () => void
    componentName: string
    chapterId: string
    lessonId: string
}

export default function SimulationModal({
    isOpen,
    onClose,
    componentName,
    chapterId,
    lessonId
}: SimulationModalProps) {
    const [Component, setComponent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [renderKey, setRenderKey] = useState(0)

    // Load component khi modal mở và componentName thay đổi
    useEffect(() => {
        if (isOpen && componentName) {
            setLoading(true)

            // Dùng setTimeout để đảm bảo render sau khi modal hiện
            const timer = setTimeout(() => {
                const module = chapterModules[chapterId]
                const SimComponent = module?.[componentName]
                setComponent(() => SimComponent)
                setLoading(false)
                setRenderKey(prev => prev + 1) // Force remount component con
            }, 50)

            return () => clearTimeout(timer)
        } else {
            // Reset khi đóng modal
            setComponent(null)
            setLoading(true)
        }
    }, [isOpen, componentName, chapterId])

    // Xử lý phím ESC để đóng
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    // Ngăn scroll body khi modal mở
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-pink-500">
                    {/* <h2 className="text-xl font-bold text-white">
                        Mô phỏng: {componentName.replace('Simulation', '')}
                    </h2> */}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content - Dùng key để force remount mỗi lần mở */}
                <div key={renderKey} className="p-6 overflow-y-auto max-h-[calc(90vh-70px)]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                        </div>
                    ) : Component ? (
                        <Component />
                    ) : (
                        <div className="text-center py-20 text-red-500">
                            Không tìm thấy mô phỏng {componentName}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}