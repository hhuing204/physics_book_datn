// hooks/useSimulationProgress.ts
import { useState, useEffect } from 'react';

interface SimulationProgress {
    completed: boolean;
    score: number;
    attempts: number;
    lastAccess: Date;
    canAccess: boolean;
}

export function useSimulationProgress(chapterId: string, simulationId: string) {
    const [progress, setProgress] = useState<SimulationProgress | null>(null);
    const [loading, setLoading] = useState(true);

    const getToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    };

    useEffect(() => {
        const fetchProgress = async () => {
            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `/api/simulation/progress?chapterId=${chapterId}&simulationId=${simulationId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                const data = await response.json();
                setProgress(data);
            } catch (error) {
                console.error('Error fetching progress:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [chapterId, simulationId]);

    const saveProgress = async (score: number, completed: boolean = true) => {
        const token = getToken();
        if (!token) return null;

        try {
            const response = await fetch('/api/simulation/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    chapterId,
                    simulationId,
                    score,
                    completed
                })
            });
            const data = await response.json();
            setProgress(data);
            return data;
        } catch (error) {
            console.error('Error saving progress:', error);
            return null;
        }
    };

    return { progress, loading, saveProgress };
}