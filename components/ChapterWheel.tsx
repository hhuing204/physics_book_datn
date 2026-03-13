'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber' // Sửa import ở đây
import { Text, Html, useCursor } from '@react-three/drei' // Bỏ useThree khỏi drei
import * as THREE from 'three'
import { ChevronRight, BookOpen, Clock, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Dữ liệu các chương
const chapters = [
    {
        id: 1,
        title: 'Dao Động Cơ',
        icon: '⏰',
        color: '#3b82f6',
        lightColor: '#93c5fd',
        position: [0, 0, 5],
        lessons: [
            { id: 'bai-1', title: 'Mô tả dao động', icon: '📝', duration: '2 tiết' },
            { id: 'bai-2', title: 'Phương trình dao động điều hoà', icon: '📐', duration: '3 tiết' },
            { id: 'bai-3', title: 'Năng lượng trong dao động', icon: '⚡', duration: '2 tiết' },
            { id: 'bai-4', title: 'Dao động tắt dần và cộng hưởng', icon: '🔄', duration: '2 tiết' }
        ]
    },
    {
        id: 2,
        title: 'Sóng Cơ',
        icon: '🌊',
        color: '#06b6d4',
        lightColor: '#a5f3fc',
        position: [4, 0, 2],
        lessons: [
            { id: 'bai-1', title: 'Sóng cơ và sự truyền sóng', icon: '🌊', duration: '2 tiết' },
            { id: 'bai-2', title: 'Giao thoa sóng', icon: '🔄', duration: '3 tiết' },
            { id: 'bai-3', title: 'Sóng dừng', icon: '📏', duration: '2 tiết' },
            { id: 'bai-4', title: 'Sóng âm', icon: '🎵', duration: '2 tiết' }
        ]
    },
    {
        id: 3,
        title: 'Điện Trường',
        icon: '⚡',
        color: '#eab308',
        lightColor: '#fde047',
        position: [2, 3, -2],
        lessons: [
            { id: 'bai-1', title: 'Điện tích - Định luật Coulomb', icon: '⚡', duration: '2 tiết' },
            { id: 'bai-2', title: 'Điện trường', icon: '🌀', duration: '2 tiết' },
            { id: 'bai-3', title: 'Công của lực điện', icon: '💪', duration: '2 tiết' },
            { id: 'bai-4', title: 'Điện thế - Hiệu điện thế', icon: '📊', duration: '2 tiết' }
        ]
    },
    {
        id: 4,
        title: 'Từ Trường',
        icon: '🧲',
        color: '#10b981',
        lightColor: '#6ee7b7',
        position: [-2, 3, -2],
        lessons: [
            { id: 'bai-1', title: 'Từ trường', icon: '🧲', duration: '2 tiết' },
            { id: 'bai-2', title: 'Lực từ', icon: '💪', duration: '2 tiết' },
            { id: 'bai-3', title: 'Cảm ứng từ', icon: '📈', duration: '2 tiết' },
            { id: 'bai-4', title: 'Lực Lorentz', icon: '🔄', duration: '2 tiết' }
        ]
    },
    {
        id: 5,
        title: 'Cảm Ứng Điện Từ',
        icon: '💡',
        color: '#a855f7',
        lightColor: '#d8b4fe',
        position: [-4, 0, 2],
        lessons: [
            { id: 'bai-1', title: 'Từ thông', icon: '🌀', duration: '2 tiết' },
            { id: 'bai-2', title: 'Suất điện động cảm ứng', icon: '⚡', duration: '2 tiết' },
            { id: 'bai-3', title: 'Hiện tượng tự cảm', icon: '🔄', duration: '2 tiết' },
            { id: 'bai-4', title: 'Năng lượng từ trường', icon: '📊', duration: '2 tiết' }
        ]
    },
    {
        id: 6,
        title: 'Quang Hình Học',
        icon: '🔍',
        color: '#ef4444',
        lightColor: '#fca5a5',
        position: [-2, -3, -2],
        lessons: [
            { id: 'bai-1', title: 'Khúc xạ ánh sáng', icon: '🌈', duration: '2 tiết' },
            { id: 'bai-2', title: 'Phản xạ toàn phần', icon: '✨', duration: '2 tiết' },
            { id: 'bai-3', title: 'Thấu kính mỏng', icon: '🔍', duration: '3 tiết' },
            { id: 'bai-4', title: 'Mắt và dụng cụ quang', icon: '👁️', duration: '3 tiết' }
        ]
    }
]

// Component Chapter Card 3D
function ChapterCard({ chapter, index, total, selectedChapter, onSelect, isExpanded }: any) {
    const meshRef = useRef<THREE.Mesh>(null)
    const groupRef = useRef<THREE.Group>(null)
    const [hovered, setHovered] = useState(false)
    const [targetPosition, setTargetPosition] = useState(chapter.position)
    const [targetRotation, setTargetRotation] = useState([0, 0, 0])

    useCursor(hovered)

    // Animation khi được chọn
    useEffect(() => {
        if (isExpanded && selectedChapter?.id === chapter.id) {
            // Zoom ra và xoay để hiện lessons
            setTargetPosition([0, 0, 8])
            setTargetRotation([0, 0, 0])
        } else {
            // Trở về vị trí ban đầu
            setTargetPosition(chapter.position)
            setTargetRotation([0, index * (Math.PI * 2 / total), 0])
        }
    }, [isExpanded, selectedChapter, chapter.id, chapter.position, index, total])

    // Smooth animation
    useFrame(() => {
        if (!groupRef.current) return

        // Lerp position
        groupRef.current.position.x += (targetPosition[0] - groupRef.current.position.x) * 0.1
        groupRef.current.position.y += (targetPosition[1] - groupRef.current.position.y) * 0.1
        groupRef.current.position.z += (targetPosition[2] - groupRef.current.position.z) * 0.1

        // Lerp rotation
        groupRef.current.rotation.y += (targetRotation[1] - groupRef.current.rotation.y) * 0.1
    })

    return (
        <group ref={groupRef} position={chapter.position} rotation={[0, index * (Math.PI * 2 / total), 0]}>
            {/* Card chính */}
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => onSelect(chapter)}
            >
                <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
                <meshStandardMaterial
                    color={hovered ? chapter.lightColor : chapter.color}
                    emissive={hovered ? chapter.color : '#000000'}
                    emissiveIntensity={0.2}
                    roughness={0.3}
                    metalness={0.1}
                    transparent
                    opacity={isExpanded && selectedChapter?.id !== chapter.id ? 0.3 : 1}
                />
            </mesh>

            {/* Viền sáng */}
            <mesh position={[0, 0.2, 0]}>
                <torusGeometry args={[1.5, 0.05, 16, 64]} />
                <meshStandardMaterial color={chapter.color} emissive={chapter.color} emissiveIntensity={0.5} />
            </mesh>

            {/* Icon chương */}
            <Html position={[0, 0, 0]} center>
                <div className={`text-4xl transform transition-all duration-300 ${hovered ? 'scale-110' : ''}`}>
                    {chapter.icon}
                </div>
            </Html>

            {/* Tên chương */}
            <Text
                position={[0, -1.2, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {chapter.title}
            </Text>

            {/* Danh sách bài học khi được chọn */}
            {isExpanded && selectedChapter?.id === chapter.id && (
                <group position={[0, -2, 0]}>
                    {chapter.lessons.map((lesson: any, idx: number) => (
                        <LessonItem
                            key={idx}
                            lesson={lesson}
                            index={idx}
                            chapterId={chapter.id}
                            color={chapter.color}
                        />
                    ))}
                </group>
            )}
        </group>
    )
}

// Component Lesson Item
function LessonItem({ lesson, index, chapterId, color }: any) {
    const [hovered, setHovered] = useState(false)

    return (
        <group position={[0, -index * 0.8, 0]}>
            <mesh
                position={[0, 0, 0]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => window.location.href = `/lessons/chuong-${chapterId}/${lesson.id}`}
            >
                <boxGeometry args={[4, 0.6, 0.2]} />
                <meshStandardMaterial
                    color={hovered ? color : '#333333'}
                    emissive={hovered ? color : '#000000'}
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.9}
                />
            </mesh>

            <Html position={[-1.5, 0, 0.2]} center>
                <div className="flex items-center text-white text-sm whitespace-nowrap">
                    <span className="mr-2">{lesson.icon}</span>
                    <span className="font-medium">{lesson.title}</span>
                    <span className="ml-4 text-xs opacity-70">{lesson.duration}</span>
                </div>
            </Html>

            <Html position={[1.8, 0, 0.2]} center>
                <ChevronRight className={`w-4 h-4 text-white transition-all duration-300 ${hovered ? 'translate-x-1' : ''}`} />
            </Html>
        </group>
    )
}

// Component Scene chính
function Scene({ selectedChapter, onSelectChapter, isExpanded }: any) {
    const { camera } = useThree()

    // Animation camera khi có chapter được chọn
    useEffect(() => {
        if (isExpanded && selectedChapter) {
            // Zoom camera lại gần
            camera.position.lerp(new THREE.Vector3(0, 0, 12), 0.1)
        } else {
            // Quay về vị trí ban đầu
            camera.position.lerp(new THREE.Vector3(0, 5, 20), 0.1)
            camera.lookAt(0, 0, 0)
        }
    }, [isExpanded, selectedChapter, camera])

    return (
        <>
            {/* Ánh sáng */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            {/* Grid nền */}
            <gridHelper args={[30, 20, '#4b5563', '#1f2937']} rotation={[0, 0, 0]} />

            {/* Các chapter cards */}
            {chapters.map((chapter, index) => (
                <ChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    index={index}
                    total={chapters.length}
                    selectedChapter={selectedChapter}
                    onSelect={onSelectChapter}
                    isExpanded={isExpanded}
                />
            ))}
        </>
    )
}

// Component chính
export default function ChapterWheel() {
    const [selectedChapter, setSelectedChapter] = useState<any>(null)
    const [isExpanded, setIsExpanded] = useState(false)

    const handleSelectChapter = (chapter: any) => {
        if (selectedChapter?.id === chapter.id && isExpanded) {
            // Nếu click vào chapter đang mở, đóng lại
            setIsExpanded(false)
            setSelectedChapter(null)
        } else {
            // Mở chapter mới
            setSelectedChapter(chapter)
            setIsExpanded(true)
        }
    }

    const handleBack = () => {
        setIsExpanded(false)
        setSelectedChapter(null)
    }

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
            {/* Canvas 3D */}
            <Canvas
                camera={{ position: [0, 5, 20], fov: 45 }}
                className="w-full h-full"
            >
                <Scene
                    selectedChapter={selectedChapter}
                    onSelectChapter={handleSelectChapter}
                    isExpanded={isExpanded}
                />
            </Canvas>

            {/* Nút back khi expanded */}
            {isExpanded && (
                <button
                    onClick={handleBack}
                    className="absolute top-8 left-8 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition flex items-center space-x-2 z-10"
                >
                    <span>←</span>
                    <span>Quay lại</span>
                </button>
            )}

            {/* Tiêu đề */}
            {!isExpanded && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white z-10">
                    <h2 className="text-2xl font-bold mb-2">Khám phá 6 chương Vật lý 11</h2>
                    <p className="text-white/70">Click vào mỗi chương để xem chi tiết bài học</p>
                </div>
            )}

            {/* Thông tin chapter được chọn */}
            {isExpanded && selectedChapter && (
                <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md rounded-xl p-6 text-white max-w-xs z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="text-3xl">{selectedChapter.icon}</div>
                        <div>
                            <h3 className="text-xl font-bold">{selectedChapter.title}</h3>
                            <p className="text-white/70 text-sm">{selectedChapter.lessons.length} bài học</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {selectedChapter.lessons.map((lesson: any, idx: number) => (
                            <Link
                                key={idx}
                                href={`/lessons/chuong-${selectedChapter.id}/${lesson.id}`}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition group"
                            >
                                <div className="flex items-center space-x-2">
                                    <span>{lesson.icon}</span>
                                    <span className="text-sm">{lesson.title}</span>
                                </div>
                                <PlayCircle className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}