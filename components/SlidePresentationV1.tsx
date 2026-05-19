'use client'

import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useMemo } from 'react'
import { CirclePower } from 'lucide-react'
import { MathFormula } from './Math'
import { useProgress } from '@/hooks/useProgress'

export interface Formula {
    id: string
    latex: string
}

export interface ImageAsset {
    id: string
    src: string
}

export interface Slide {
    id: number
    subId?: number | string
    title: string
    content: string
    type: string
}

export interface Lesson {
    id: string
    title: string
    slides: Slide[]
}


interface SlidePresentationProps {
    slides: Slide[],
    formulas?: Formula[],
    images?: ImageAsset[],
    slideType: string
    lessonId: number
    onSlideChange?: (slideIndex: number) => void
    onLessonComplete?: () => void
}

export interface SlidePresentationRef {
    goToSlide: (index: number) => void
    getCurrentSlide: () => number
}

const SlidePresentationV1 = forwardRef<SlidePresentationRef, SlidePresentationProps>(({
    slides,
    formulas,
    images,
    lessonId,
    slideType,
    onSlideChange,
    onLessonComplete
}, ref) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [startTime, setStartTime] = useState<Date>(new Date())
    const [expandedFormulas, setExpandedFormulas] = useState<Set<string>>(new Set())
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const { updateProgress } = useProgress()

    const ensureMathJaxTypeset = (selector = '.slide-content', attempt = 0): Promise<void> => {
        const MAX_ATTEMPTS = 20
        const RETRY_MS = 300
        return new Promise((resolve) => {
            if (typeof window === 'undefined') return resolve()
            const mj = (window as any).MathJax
            if (mj && mj.typesetPromise) {
                try {
                    const el = document.querySelector(selector)
                    mj.typesetPromise(el ? [el] : undefined)
                        .then(() => resolve())
                        .catch(() => resolve())
                } catch {
                    resolve()
                }
            } else if (attempt < MAX_ATTEMPTS) {
                setTimeout(() => {
                    ensureMathJaxTypeset(selector, attempt + 1).then(() => resolve())
                }, RETRY_MS)
            } else {
                resolve()
            }
        })
    }

    useEffect(() => {
        ensureMathJaxTypeset('.slide-content')

        const onLoad = () => ensureMathJaxTypeset('.slide-content')
        if (typeof window !== 'undefined') {
            if (document.readyState === 'complete') onLoad()
            else window.addEventListener('load', onLoad)
        }
        return () => {
            if (typeof window !== 'undefined') window.removeEventListener('load', onLoad)
        }
    }, [])

    const slide = slides[currentSlide]

    const formulaMap = useMemo(
        () => new Map((formulas ?? []).map(f => [f.id, f])),
        [formulas]
    )

    const imageMap = useMemo(
        () => new Map((images ?? []).map(i => [i.id, i.src])),
        [images]
    )

    const renderContent = (content: string) => {
        return content.replace(
            /\[\[(\w+):(.+?)\]\]/g,
            (_, type, id) => {
                if (type === 'formula') {
                    const formula = formulaMap.get(id)
                    if (!formula) return id

                    const isExpanded = expandedFormulas.has(id)

                    if (isExpanded) {
                        return `
              <span class="formula-ref formula-expanded" data-id="${id}">
                \\(${formula.latex}\\)
              </span>
            `
                    }

                    return `
            <span class="formula-ref formula-collapsed" data-id="${id}">
              (${id})
            </span>
          `
                }

                if (type === 'image') {
                    const src = imageMap.get(id)
                    if (!src) return id

                    return `<img src="${src}" class="rounded-md" />`
                }

                return id
            }
        )
    }

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.innerHTML = renderContent(slides[currentSlide].content)
        }

        requestAnimationFrame(() => {
            ensureMathJaxTypeset('.slide-content')
        })
    }, [currentSlide, expandedFormulas])

    useEffect(() => {
        const el = contentRef.current
        if (!el) return

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement

            const formulaEl = target.closest('.formula-ref') as HTMLElement
            if (!formulaEl) return

            const id = formulaEl.dataset.id
            if (!id) return

            setExpandedFormulas(prev => {
                const next = new Set(prev)

                if (next.has(id)) {
                    next.delete(id)
                } else {
                    next.add(id)
                }

                return next
            })

            requestAnimationFrame(() => {
                ensureMathJaxTypeset('.slide-content')
            })
        }

        el.addEventListener('click', handleClick)

        return () => el.removeEventListener('click', handleClick)
    }, [currentSlide, expandedFormulas])

    const nextSlide = async () => {
        if (currentSlide < slides.length - 1) {
            setIsTransitioning(true)
            setTimeout(() => {
                const newSlideIndex = currentSlide + 1
                setCurrentSlide(newSlideIndex)
                setIsTransitioning(false)
                onSlideChange?.(newSlideIndex)
            }, 150)
        } else {
            const endTime = new Date()
            const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60)

            await updateProgress(String(lessonId), true, timeSpent)
            onLessonComplete?.()
        }
    }

    const prevSlide = () => {
        if (currentSlide > 0) {
            setIsTransitioning(true)
            setTimeout(() => {
                const newSlideIndex = currentSlide - 1
                setCurrentSlide(newSlideIndex)
                setIsTransitioning(false)
                onSlideChange?.(newSlideIndex)
            }, 150)
        }
    }

    const goToSlide = (index: number) => {
        if (index >= 0 && index < slides.length && index !== currentSlide) {
            setIsTransitioning(true)
            setTimeout(() => {
                setCurrentSlide(index)
                setIsTransitioning(false)
                onSlideChange?.(index)
            }, 150)
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSlide()
        }
        if (e.key === 'ArrowLeft') {
            prevSlide()
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [currentSlide])

    useImperativeHandle(ref, () => ({
        goToSlide,
        getCurrentSlide: () => currentSlide
    }))

    const progress = ((currentSlide + 1) / slides.length) * 100

    const isSubIdSlide = slide.subId != null && !['intro', 'summary'].includes(slide.type)

    const getSlideTypeColor = (type: string) => {
        switch (type) {
            case 'intro': return 'from-blue-500 to-blue-600'
            case 'foundation': return 'from-green-500 to-green-600'
            case 'example': return 'from-yellow-500 to-orange-500'
            case 'summary': return 'from-indigo-500 to-indigo-600'
            case 'exploratory': return 'from-purple-400 to-purple-500'
            default: return 'from-gray-500 to-gray-600'
        }
    }

    const getSlideTypeIcon = (type: string) => {
        switch (type) {
            case 'intro':
                return (
                    <CirclePower
                        size={30}
                        color="orange"
                        strokeWidth={2.5}
                        style={{ backgroundColor: "white", borderRadius: "150%" }}
                    />
                )
            case 'foundation': return <>💡</>
            case 'example': return <>🧮</>
            case 'summary': return <>📋</>
            case 'exploratory': return <>🧑‍🏫</>
            default: return <>📄</>
        }
    }

    const getSubIdEmoji = (subId?: number | string) => {
        if (!subId) return null

        const map: Record<string, string> = {
            "1": "1️⃣",
            "2": "2️⃣",
            "3": "3️⃣",
            "4": "4️⃣",
            "5": "5️⃣",
            "6": "6️⃣",
            "7": "7️⃣",
            "8": "8️⃣",
            "9": "9️⃣",
            "10": "🔟"
        }

        return map[String(subId)] || "🔹"
    }

    return (
        <div className="w-full h-full bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div
                ref={containerRef}
                className={`w-full h-full flex items-start justify-center py-8 px-8 transition-opacity duration-150 relative group overflow-y-auto scroll-smooth ${isTransitioning ? 'opacity-0' : 'opacity-100'
                    }`}
            >
                <div className="max-w-4xl w-full relative my-auto min-h-0">

                    {/* Navigation Areas */}
                    {currentSlide > 0 && (
                        <div
                            className="absolute left-0 top-0 w-[8%] h-full z-10 cursor-pointer group/left"
                            onClick={prevSlide}
                        />
                    )}

                    {currentSlide < slides.length - 1 && (
                        <div
                            className="absolute right-0 top-0 w-[8%] h-full z-10 cursor-pointer group/right"
                            onClick={nextSlide}
                        />
                    )}

                    {/* Header */}
                    <div
                        className={`bg-gradient-to-r ${getSlideTypeColor(slide.type)} rounded-t-2xl p-6 text-white transition-transform duration-200`}
                    >
                        <div className="flex items-center gap-4">

                            <span
                                className={
                                    isSubIdSlide
                                        ? "text-4xl flex items-center justify-center leading-none"
                                        : `text-2xl ${slide.type === 'intro' ? 'ml-1' : ''}`
                                }
                            >
                                {isSubIdSlide
                                    ? getSubIdEmoji(slide.subId)
                                    : getSlideTypeIcon(slide.type)}
                            </span>

                            <div
                                className={`flex flex-col justify-center ${slide.type === 'intro' ? 'ml-1' : ''
                                    }`}
                            >
                                <h2 className="text-xl font-bold">{slide.title}</h2>

                                <p className="text-sm flex items-center gap-2">
                                    <span className="text-white/80">{slideType}</span>

                                    {isSubIdSlide &&
                                        !['intro', 'summary'].includes(slide.type) && (
                                            <span className="text-base text-white opacity-90">
                                                {getSlideTypeIcon(slide.type)}
                                            </span>
                                        )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-xl p-8 min-h-[300px]">
                        <div
                            ref={contentRef}
                            className="prose prose-lg dark:prose-invert max-w-none slide-content text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>
            </div>

            {/* Navigation hints */}
            <div className="fixed bottom-4 left-4 text-xs text-gray-500 bg-white/70 dark:bg-gray-800/70 rounded-lg px-3 py-2">
                <div>← → hoặc Space để điều hướng</div>
            </div>

            <div className="fixed bottom-4 right-4 text-sm text-gray-500 bg-white/70 dark:bg-gray-800/70 rounded-lg px-3 py-2">
                {currentSlide + 1} / {slides.length}
            </div>
        </div>
    )
})

SlidePresentationV1.displayName = 'SlidePresentationV1'

export default SlidePresentationV1