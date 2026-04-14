// hooks/useTheme.ts
import { useState, useEffect } from 'react'

export function useTheme() {
    const [mounted, setMounted] = useState(false)
    const [theme, setTheme] = useState('light')

    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem('physics-book-theme') || 'light'
        setTheme(savedTheme)
        document.documentElement.className = savedTheme
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.className = newTheme
        localStorage.setItem('physics-book-theme', newTheme)
    }

    return { mounted, theme, toggleTheme }
}