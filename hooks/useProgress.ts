import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ITheoryProgress } from '@/models/TheoryProgress';

interface UseProgressReturn {
  progress: { [key: string]: ITheoryProgress };
  loading: boolean;
  updateProgress: (
    lessonId: string,
    completed: boolean,
    timeSpent?: number
  ) => Promise<boolean>;
  isLessonCompleted: (lessonId: string) => boolean;
  getCompletionRate: () => number;
  getTotalTimeSpent: () => number;
}

export const useProgress = (): UseProgressReturn => {
  const [progress, setProgress] = useState<{ [key: string]: ITheoryProgress }>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setProgress({});
      setLoading(false);
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/progress', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress || {});
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (
    lessonId: string,
    completed: boolean,
    timeSpent?: number
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId,
          completed,
          timeSpent,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setProgress((prev) => ({
          ...prev,
          [lessonId]: data.progress,
        }));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return !!progress[lessonId]?.completedAt;
  };

  const getCompletionRate = (): number => {
    const totalLessons = 4; // keep your existing logic
    const completedLessons = Object.values(progress).filter(
      (p) => !!p.completedAt
    ).length;

    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getTotalTimeSpent = (): number => {
    return Object.values(progress).reduce(
      (total, p) => total + (p.timeSpent || 0),
      0
    );
  };

  return {
    progress,
    loading,
    updateProgress,
    isLessonCompleted,
    getCompletionRate,
    getTotalTimeSpent,
  };
};