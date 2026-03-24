// app/exercises/layout.tsx
import { MathProvider } from '@/components/Math'

export default function ExercisesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <MathProvider>
            {children}
        </MathProvider>
    )
}