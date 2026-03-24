// app/exercises/[chapter_id]/page.tsx
'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ChapterExercisesPage() {
    const params = useParams()
    const router = useRouter()
    const chapterId = params?.chapter_id as string

    useEffect(() => {
        if (chapterId) {
            router.replace(`/exercises?chapter=${chapterId}`)
        } else {
            router.replace('/exercises')
        }
    }, [chapterId, router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    )
}