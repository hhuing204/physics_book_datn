"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Thêm useSearchParams
import { MathProvider, MathFormula, RenderWithMath } from "@/components/Math";

interface Exercise {
  id: number;
  lessonId: string;
  lessonTitle: string;
  type: "multiple-choice" | "calculation" | "true-false";
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  difficulty: "basic" | "intermediate" | "advanced";
  category: string;
  chapterId: string;
}

interface AIAnalysis {
  overview: string;
  strengths: string[];
  weaknesses: string[];
  studyPlan: Array<{
    topic: string;
    time: string;
    resources: string[];
  }>;
  weekGoal: string;
}

interface ExerciseResult {
  id: number;
  question: string;
  difficulty: "basic" | "intermediate" | "advanced";
  lessonId: string;
  correct: boolean;
  selectedAnswer: string | number | boolean;
  correctAnswer: string | number | boolean;
  explanation: string;
  graded?: boolean;
}

export default function PracticePage() {
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterId");
  const accessCodeFromUrl = searchParams.get("accessCode");

  // State for AI
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([]);
  const [userAnswers, setUserAnswers] = useState<{
    [key: number]: string | number;
  }>({});

  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number>("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [accessCodeError, setAccessCodeError] = useState("");
  const [practiceTest, setPracticeTest] = useState<any | null>(null);
  const [practiceProgress, setPracticeProgress] = useState<any | null>(null);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [pendingUnansweredCount, setPendingUnansweredCount] = useState(0);
  const [pendingUncheckedCount, setPendingUncheckedCount] = useState(0);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
    return result;
  };

  const preparePracticeSession = (test: any, progress: any) => {
    const exercisesToShuffle = (test.exercises as Exercise[]) || [];
    const randomizedExercises = shuffleArray(exercisesToShuffle);
    if (!progress || progress.status === "finished") {
      setExercises(randomizedExercises);
      setExerciseResults([]);
      setUserAnswers({});
      setCompleted(new Array(randomizedExercises.length).fill(false));
      setCurrentExercise(0);
      setScore(0);
      return;
    }

    const answersMap = new Map<string, any>(
      (progress.answers || []).map((answer: any) => [
        String(answer.exerciseId),
        answer,
      ]),
    );

    const exerciseResultsFromProgress: ExerciseResult[] =
      randomizedExercises.reduce(
        (acc: ExerciseResult[], exercise: Exercise) => {
          const saved = answersMap.get(String(exercise.id));
          if (!saved || saved.graded === false) return acc;

          acc.push({
            id: exercise.id,
            question: saved.question || exercise.question,
            difficulty: exercise.difficulty,
            lessonId: exercise.lessonId,
            correct: saved.correct,
            selectedAnswer: saved.answer,
            correctAnswer: saved.correctAnswer ?? exercise.correctAnswer,
            explanation: saved.explanation ?? exercise.explanation,
            graded: saved.graded ?? true,
          });
          return acc;
        },
        [] as ExerciseResult[],
      );

    const userAnswersFromProgress = Object.fromEntries(
      randomizedExercises
        .map((exercise) => answersMap.get(String(exercise.id)))
        .filter((saved) => saved !== undefined)
        .map((saved) => [
          Number(saved.exerciseId),
          saved.answer,
        ]),
    ) as { [key: number]: string | number };

    const completedFromProgress = randomizedExercises.map((exercise) => {
      const saved = answersMap.get(String(exercise.id));
      return saved?.graded !== false && !!saved;
    });

    const firstIncompleteIndex = completedFromProgress.findIndex(
      (done) => !done,
    );

    setExercises(randomizedExercises);
    setExerciseResults(exerciseResultsFromProgress);
    setUserAnswers(userAnswersFromProgress);
    setCompleted(completedFromProgress);
    setCurrentExercise(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
    setScore(
      typeof progress.score === "number"
        ? progress.score
        : exerciseResultsFromProgress.filter((item) => item.correct).length,
    );
  };

  const router = useRouter();

  const loadPracticeTest = async (code?: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      if (code) {
        const progressRes = await fetch(
          `/api/practice-progress?accessCode=${encodeURIComponent(code)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const progressData = await progressRes.json();

        if (!progressRes.ok) {
          setAccessCodeError(
            progressData.message || "Không thể tải đề luyện tập",
          );
          setExercises([]);
          setPracticeProgress(null);
          setPracticeTest(null);
          return;
        }

        const { practiceTest: test, progress } = progressData;
        if (!test) {
          setAccessCodeError("Không tìm thấy đề luyện tập với mã này.");
          return;
        }

        setPracticeTest(test);

        if (!progress || progress.status === "finished") {
          const newProgressRes = await fetch("/api/practice-progress", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ accessCode: test.accessCode }),
          });
          const newProgressData = await newProgressRes.json();
          if (newProgressRes.ok) {
            setPracticeProgress(newProgressData.progress);
            setHasAutoSubmitted(false);
            preparePracticeSession(
              newProgressData.practiceTest,
              newProgressData.progress,
            );
            setStartTime(new Date(newProgressData.progress.startAt));
          } else {
            setAccessCodeError(
              newProgressData.message || "Không thể bắt đầu lần làm mới",
            );
          }
        } else {
          setPracticeProgress(progress);
          preparePracticeSession(test, progress);
          setStartTime(new Date(progress.startAt));
        }
        return;
      }

      if (chapterId) {
        const url = `/api/practice-tests?default=true&chapterId=${encodeURIComponent(chapterId)}`;
        const testRes = await fetch(url);
        const testData = await testRes.json();
        if (!testRes.ok) {
          setAccessCodeError(
            testData.message || "Không thể tải đề luyện tập mặc định",
          );
          return;
        }
        const test = testData.test;
        const createRes = await fetch("/api/practice-progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accessCode: test.accessCode }),
        });
        const createData = await createRes.json();
        if (createRes.ok) {
          setPracticeTest(test);
          setPracticeProgress(createData.progress);
          setHasAutoSubmitted(false);
          preparePracticeSession(test, createData.progress);
          setStartTime(new Date(createData.progress.startAt));
        } else {
          setAccessCodeError(
            createData.message || "Không thể bắt đầu bài luyện tập",
          );
        }
        return;
      }

      setExercises([]);
    } catch (error) {
      console.error("Error loading practice test:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!mounted) return;
      await loadPracticeTest(accessCodeFromUrl ?? undefined);
    };
    init();
  }, [mounted, chapterId, accessCodeFromUrl]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("physics-book-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.className = savedTheme;
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    if (!practiceProgress?.startAt || showFinalResult) return;

    const updateTime = () => {
      const start = new Date(practiceProgress.startAt).getTime();
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setElapsedSeconds(elapsed);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [practiceProgress, showFinalResult]);

  useEffect(() => {
    if (
      !practiceTest?.timeAlloted ||
      !practiceProgress?.startAt ||
      showFinalResult ||
      hasAutoSubmitted ||
      practiceProgress?.status === "finished"
    ) {
      return;
    }

    const totalAllowedSeconds = practiceTest.timeAlloted * 60;
    if (elapsedSeconds >= totalAllowedSeconds) {
      const timeUpSubmit = async () => {
        setHasAutoSubmitted(true);
        await submitProgress(new Date().toISOString());
        setShowFinalResult(true);
      };

      timeUpSubmit();
    }
  }, [elapsedSeconds, practiceTest, practiceProgress, showFinalResult, hasAutoSubmitted, exerciseResults, score]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveDraftProgress(undefined, true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveDraftProgress(undefined, true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [practiceProgress, selectedAnswer, currentExercise, completed, exerciseResults, score, exercises]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem("physics-book-theme", newTheme);
  };

  const handleAccessCodeSubmit = () => {
    const trimmedCode = accessCodeInput.trim().toUpperCase();
    if (!trimmedCode) {
      setAccessCodeError("Vui lòng nhập mã truy cập đề.");
      return;
    }
    setAccessCodeError("");
    router.push(`/practice?accessCode=${encodeURIComponent(trimmedCode)}`);
  };

  const saveDraftProgress = async (
    nextUserAnswers?: { [key: number]: string | number },
    keepalive = false,
  ) => {
    if (
      !practiceProgress?.accessCode ||
      practiceProgress.status === "finished" ||
      !exercises.length
    ) {
      return;
    }

    const payload = buildProgressPayload(undefined, undefined, undefined, nextUserAnswers);
    if (!payload) return;

    const token = localStorage.getItem("auth_token");
    await fetch("/api/practice-progress", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      keepalive,
    }).catch((error) => console.error("Error saving draft progress:", error));
  };

  const handleAnswerSelect = (answer: string | number) => {
    if (showResult || completed[currentExercise]) return;

    const exerciseId = exercises[currentExercise]?.id;
    if (exerciseId === undefined) return;

    const nextUserAnswers = {
      ...userAnswers,
      [exerciseId]: answer,
    };

    setSelectedAnswer(answer);
    setUserAnswers(nextUserAnswers);

    if (practiceProgress?.accessCode) {
      saveDraftProgress(nextUserAnswers, true);
    }
  };

  const saveCurrentAnswerLocal = (answer: string | number) => {
    const exercise = exercises[currentExercise];
    if (!exercise) return null;

    const isCorrect = isAnswerCorrect(exercise, answer);
    const updatedResults = [
      ...exerciseResults.filter((result) => result.id !== exercise.id),
      {
        id: exercise.id,
        question: exercise.question,
        difficulty: exercise.difficulty,
        lessonId: exercise.lessonId,
        correct: isCorrect,
        selectedAnswer: answer,
        correctAnswer: exercise.correctAnswer,
        explanation: exercise.explanation,
      },
    ];

    const updatedScore = updatedResults.filter((item) => item.correct).length;

    setExerciseResults(updatedResults);
    setScore(updatedScore);
    setUserAnswers((prev) => ({
      ...prev,
      [exercise.id]: answer,
    }));

    const newCompleted = [...completed];
    newCompleted[currentExercise] = true;
    setCompleted(newCompleted);

    return { updatedResults, updatedScore };
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (showResult || currentExercise >= exercises.length || completed[currentExercise]) return;

    const exercise = exercises[currentExercise];
    if (!exercise) return;

    if (exercise.type === "multiple-choice" && exercise.options) {
      const key = parseInt(e.key);
      if (key >= 1 && key <= exercise.options.length) {
        handleAnswerSelect(key - 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentExercise, showResult, exercises]);

  useEffect(() => {
    if (!exercises.length) return;
    const current = exercises[currentExercise];
    if (!current) return;

    const savedAnswer = userAnswers[current.id];
    setSelectedAnswer(savedAnswer !== undefined ? savedAnswer : "");
    setShowResult(completed[currentExercise] || false);
  }, [currentExercise, exercises, userAnswers, completed]);

  const handleSubmit = () => {
    if (selectedAnswer === "") return;

    const saved = saveCurrentAnswerLocal(selectedAnswer);
    if (!saved) return;

    setShowResult(true);

    if (practiceProgress?.accessCode) {
      const token = localStorage.getItem("auth_token");
      const payload = buildProgressPayload(undefined, saved.updatedResults, saved.updatedScore);

      setIsSavingProgress(true);
      fetch("/api/practice-progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
        .catch((error) => console.error("Error saving progress:", error))
        .finally(() => setIsSavingProgress(false));
    }
  };

  //AI analyze
  const analyzeWithAI = async () => {
    if (exerciseResults.length === 0) return;

    setIsAnalyzing(true);
    try {
      // ==================== DỮ LIỆU SIÊU TỐI GIẢN ====================
      // Chỉ gửi 6 con số quan trọng nhất
      const progressData = {
        total: exercises.length,
        score: score,
        percentage: Math.round((score / exercises.length) * 100),
        timeMinutes: startTime
          ? Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60)
          : 0,

        // Bài học có tỷ lệ đúng thấp nhất (chỉ cần lesson number và rate)
        weakestLesson: (() => {
          const lessonMap = new Map<
            number,
            { total: number; correct: number }
          >();

          exercises.forEach((ex) => {
            const result = exerciseResults.find((r) => r.id === ex.id);
            const lessonNum = parseInt(ex.lessonId);
            const current = lessonMap.get(lessonNum) || {
              total: 0,
              correct: 0,
            };
            current.total++;
            if (result?.correct) current.correct++;
            lessonMap.set(lessonNum, current);
          });

          let worstLesson = 0;
          let worstRate = 100;

          lessonMap.forEach((stats, lesson) => {
            const rate = Math.round((stats.correct / stats.total) * 100);
            if (rate < worstRate) {
              worstRate = rate;
              worstLesson = lesson;
            }
          });

          return worstLesson > 0
            ? { lesson: worstLesson, correctRate: worstRate }
            : null;
        })(),

        // Độ khó có tỷ lệ đúng thấp nhất
        weakestDifficulty: (() => {
          const diffMap = new Map<string, { total: number; correct: number }>();

          exercises.forEach((ex) => {
            const result = exerciseResults.find((r) => r.id === ex.id);
            const current = diffMap.get(ex.difficulty) || {
              total: 0,
              correct: 0,
            };
            current.total++;
            if (result?.correct) current.correct++;
            diffMap.set(ex.difficulty, current);
          });

          let worstDiff = "";
          let worstRate = 100;

          diffMap.forEach((stats, diff) => {
            const rate = Math.round((stats.correct / stats.total) * 100);
            if (rate < worstRate) {
              worstRate = rate;
              worstDiff = diff;
            }
          });

          return worstDiff
            ? {
              difficulty: worstDiff,
              correctRate: worstRate,
            }
            : null;
        })(),
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 360000); // Timeout 30s (tăng từ 10s)

      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(progressData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.analysis) {
          console.log(data.analysis);
          setAiAnalysis(data.analysis);
          setShowAIAnalysis(true);
          return;
        }
      }

      // Không hiển thị gì nếu API lỗi
      throw new Error("API failed");
    } catch (error: any) {
      // Silent fail - không hiển thị lỗi cho user
    } finally {
      setIsAnalyzing(false);
    }
  };

  const buildProgressPayload = (
    submittedAt?: string,
    overrideResults?: ExerciseResult[],
    overrideScore?: number,
    draftAnswers?: { [key: number]: string | number },
  ) => {
    if (!practiceProgress?.accessCode) return null;

    const baseAnswers = (practiceProgress.answers || []).map((item: any) => ({
      ...item,
      graded: item.graded !== false,
    }));

    const answerMap = new Map<string, any>(
      baseAnswers.map((item: any) => [item.exerciseId, item]),
    );

    if (overrideResults) {
      overrideResults.forEach((item) => {
        answerMap.set(String(item.id), {
          exerciseId: String(item.id),
          answer: item.selectedAnswer,
          correct: item.correct,
          graded: item.graded ?? true,
          question: item.question,
          difficulty: item.difficulty,
          lessonId: item.lessonId,
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
        });
      });
    }

    exerciseResults.forEach((result) => {
      answerMap.set(String(result.id), {
        exerciseId: String(result.id),
        answer: result.selectedAnswer,
        correct: result.correct,
        graded: result.graded ?? true,
        question: result.question,
        difficulty: result.difficulty,
        lessonId: result.lessonId,
        correctAnswer: result.correctAnswer,
        explanation: result.explanation,
      });
    });

    const draftMap = draftAnswers ?? userAnswers;
    const isFinalSubmission = Boolean(submittedAt);
    exercises.forEach((exercise, index) => {
      const draftAnswer = draftMap[exercise.id];
      if (draftAnswer !== undefined && !completed[index]) {
        const existing = answerMap.get(String(exercise.id));
        if (!existing || existing.graded === false || isFinalSubmission) {
          const isCorrect =
            isFinalSubmission && draftAnswer === exercise.correctAnswer;
          answerMap.set(String(exercise.id), {
            exerciseId: String(exercise.id),
            answer: draftAnswer,
            correct: isFinalSubmission ? isCorrect : false,
            graded: isFinalSubmission,
            question: exercise.question,
            difficulty: exercise.difficulty,
            lessonId: exercise.lessonId,
            correctAnswer: exercise.correctAnswer,
            explanation: exercise.explanation,
          });
        }
      }
    });

    const currentScore =
      overrideScore ??
      Array.from(answerMap.values()).filter((item: any) => item.correct).length;

    const payload: any = {
      accessCode: practiceProgress.accessCode,
      answers: Array.from(answerMap.values()),
      score: currentScore,
    };

    if (submittedAt) payload.submittedAt = submittedAt;
    return payload;
  };

  const submitProgress = async (
    submittedAt?: string,
    overrideResults?: ExerciseResult[],
    overrideScore?: number,
    keepalive = false,
  ) => {
    const payload = buildProgressPayload(submittedAt, overrideResults, overrideScore);
    if (!payload) return;

    if (submittedAt && typeof payload.score === "number") {
      setScore(payload.score);
    }

    const token = localStorage.getItem("auth_token");
    setIsSavingProgress(true);
    await fetch("/api/practice-progress", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      keepalive,
    })
      .catch((error) => console.error("Error saving progress:", error))
      .finally(() => setIsSavingProgress(false));
  };

  const handleNext = async () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer("");
      setShowResult(false);
      return;
    }

    await submitProgress(new Date().toISOString());
    setShowFinalResult(true);
  };

  const handleFinishEarly = () => {
    const unansweredCount = exercises.filter(
      (exercise) => userAnswers[exercise.id] === undefined,
    ).length;
    const uncheckedCount = exercises.filter(
      (exercise, index) =>
        userAnswers[exercise.id] !== undefined && !completed[index],
    ).length;

    setPendingUnansweredCount(unansweredCount);
    setPendingUncheckedCount(uncheckedCount);
    setConfirmSubmitOpen(true);
  };

  const confirmFinishSubmit = async () => {
    setConfirmSubmitOpen(false);
    if (selectedAnswer !== "" && !completed[currentExercise]) {
      saveCurrentAnswerLocal(selectedAnswer);
    }

    await submitProgress(new Date().toISOString());
    setShowFinalResult(true);
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setSelectedAnswer("");
      setShowResult(false);
    }
  };

  const handleRestart = async () => {
    if (!practiceTest) {
      setCurrentExercise(0);
      setSelectedAnswer("");
      setShowResult(false);
      setScore(0);
      setShowFinalResult(false);
      setStartTime(new Date());
      return;
    }

    setCurrentExercise(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
    setShowFinalResult(false);
    setStartTime(new Date());
    setExerciseResults([]);
    setUserAnswers({});
    setCompleted(new Array(practiceTest.exercises.length).fill(false));

    if (practiceProgress?.accessCode) {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch("/api/practice-progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accessCode: practiceProgress.accessCode }),
        });
        const data = await response.json();
        if (response.ok) {
          setPracticeProgress(data.progress);
          setHasAutoSubmitted(false);
        }
      } catch (error) {
        console.error("Error restarting progress:", error);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "basic":
        return "text-green-600 dark:text-green-400";
      case "intermediate":
        return "text-yellow-600 dark:text-yellow-400";
      case "advanced":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "basic":
        return "Cơ bản";
      case "intermediate":
        return "Thông hiểu";
      case "advanced":
        return "Vận dụng cao";
      default:
        return difficulty;
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Xuất sắc! Bạn đã nắm vững kiến thức!";
    if (percentage >= 80) return "Rất tốt! Tiếp tục phát huy!";
    if (percentage >= 70) return "Khá tốt! Hãy ôn luyện thêm!";
    if (percentage >= 60) return "Đạt yêu cầu. Cần cố gắng hơn nữa!";
    return "Cần ôn tập lại kiến thức cơ bản!";
  };

  const getTimerColorClass = () => {
    if (!practiceTest?.timeAlloted) return "text-indigo-900 dark:text-indigo-100";
    const totalSeconds = practiceTest.timeAlloted * 60;
    const remaining = Math.max(totalSeconds - elapsedSeconds, 0);
    if (remaining <= 300) return "text-red-600 dark:text-red-400";
    if (elapsedSeconds >= totalSeconds / 2) return "text-yellow-600 dark:text-yellow-400";
    return "text-indigo-900 dark:text-indigo-100";
  };

  const getNumericValue = (value: string | number | undefined) => {
    const normalized = String(value ?? "").trim();
    if (!normalized) return null;

    const parsed = Number(normalized.replace(/,/g, "."));
    return Number.isFinite(parsed) ? parsed : null;
  };

  const isAnswerCorrect = (exercise: any, submittedAnswer: string | number | undefined) => {
    const expectedAnswer = exercise.correctAnswer;
    const submittedNumeric = getNumericValue(submittedAnswer);
    const expectedNumeric = getNumericValue(expectedAnswer);

    if (submittedNumeric !== null && expectedNumeric !== null) {
      return submittedNumeric === expectedNumeric;
    }

    if (exercise.type === "multiple-choice" && Array.isArray(exercise.options)) {
      const correctIndex = typeof expectedAnswer === "number"
        ? expectedAnswer
        : exercise.options.findIndex((option: string) => String(option).trim() === String(expectedAnswer ?? "").trim());

      if (typeof submittedAnswer === "number") {
        return submittedAnswer === correctIndex;
      }

      return String(submittedAnswer ?? "").trim() === String(correctIndex);
    }

    return String(submittedAnswer ?? "").trim() === String(expectedAnswer ?? "").trim();
  };

  const getCorrectOptionIndex = (exercise: any) => {
    if (exercise.type !== "multiple-choice" || !Array.isArray(exercise.options)) {
      return -1;
    }

    if (typeof exercise.correctAnswer === "number") {
      return exercise.correctAnswer;
    }

    return exercise.options.findIndex((option: string) => String(option).trim() === String(exercise.correctAnswer ?? "").trim());
  };

  const getQuestionStatus = (exerciseId: number) => {
    const result = exerciseResults.find((r) => r.id === exerciseId);
    if (result) return result.correct ? "Đúng" : "Sai";

    const draftAnswer = userAnswers[exerciseId];
    if (draftAnswer !== undefined) return "Chưa kiểm tra";

    return "Chưa trả lời";
  };

  const getQuestionStatusColor = (exerciseId: number) => {
    const result = exerciseResults.find((r) => r.id === exerciseId);
    if (result) return result.correct
      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300";

    const draftAnswer = userAnswers[exerciseId];
    if (draftAnswer !== undefined) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200";

    return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
  };

  const getQuestionPreview = (question: string) => {
    const text = question.replace(/\s+/g, " ").trim();
    return text.length > 80 ? `${text.slice(0, 77)}...` : text;
  };

  const jumpToQuestion = (index: number) => {
    setCurrentExercise(index);
    setSelectedAnswer(userAnswers[exercises[index]?.id] ?? "");
    setShowResult(completed[index] || false);
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Đang tải bài tập...
          </p>
        </div>
      </div>
    );
  }

  if (!accessCodeFromUrl && !chapterId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-xl w-full rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
            Nhập mã truy cập đề luyện tập
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bạn có thể nhập mã đề mà bạn đã tạo hoặc nhận được từ danh sách
            luyện tập. Nếu muốn luyện tổng hợp, truy cập lại trang bài tập để
            chọn chương.
          </p>
          <div className="space-y-4">
            <input
              type="text"
              value={accessCodeInput}
              onChange={(e) => setAccessCodeInput(e.target.value)}
              placeholder="Nhập mã truy cập"
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500/20 outline-none"
            />
            {accessCodeError && (
              <p className="text-sm text-red-600">{accessCodeError}</p>
            )}
            <button
              onClick={handleAccessCodeSubmit}
              className="w-full rounded-2xl bg-indigo-600 px-5 py-3 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              Truy cập đề theo mã
            </button>
            <button
              onClick={() => router.push("/exercises")}
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 px-5 py-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              Quay lại chọn chương / bài
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Không có bài tập nào
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  //loading state
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              AI đang phân tích...
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Đang phân tích kết quả và đề xuất lộ trình học tập tối ưu cho bạn
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showFinalResult) {
    const percentage = Math.round((score / exercises.length) * 100);
    const totalTime =
      elapsedSeconds ||
      (startTime
        ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
        : 0);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const timeTaken = totalTime / 60;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎉</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Hoàn thành đề luyện tập!
            </h1>

            <div className="mb-8">
              <div
                className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}
              >
                {score}/{exercises.length}
              </div>
              <div
                className={`text-2xl font-semibold mb-2 ${getScoreColor(percentage)}`}
              >
                {percentage}%
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-300">
                {getScoreMessage(percentage)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Thời gian đã làm
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Điểm / Phút
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round((score / timeTaken) || 0)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* <button
                onClick={analyzeWithAI}
                disabled={isAnalyzing}
                className={`w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${isAnalyzing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                  }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Đang phân tích...</span>
                  </>
                ) : (
                  <>
                    <span>🤖</span>
                    <span>Phân tích AI chi tiết</span>
                  </>
                )}
              </button> */}

              <button
                onClick={handleRestart}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                🔄 Làm bài mới
              </button>

              <button
                onClick={() => router.push("/lesson")}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                📚 Quay lại học tập
              </button>
            </div>
          </div>

          {/* AI Analysis Modal */}
          {showAIAnalysis && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">
                {!aiAnalysis ? (
                  <p className="text-center text-gray-700 dark:text-gray-300">
                    Đang tải dữ liệu AI...
                  </p>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <span className="mr-2">🤖</span>
                        Phân tích học tập AI
                      </h2>
                      <button
                        onClick={() => setShowAIAnalysis(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Overview */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        📊 Tổng quan
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {aiAnalysis.overview}
                      </p>
                    </div>

                    {/* Strengths */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center">
                          <span className="mr-2">✅</span>
                          Điểm mạnh
                        </h3>
                        <ul className="space-y-2">
                          {aiAnalysis.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">✓</span>
                              <span className="text-green-700 dark:text-green-400">
                                {strength}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center">
                          <span className="mr-2">📝</span>
                          Cần cải thiện
                        </h3>
                        <ul className="space-y-2">
                          {aiAnalysis.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span className="text-red-700 dark:text-red-400">
                                {weakness}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Study Plan */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="mr-2">📅</span>
                        Kế hoạch học tập đề xuất
                      </h3>
                      <div className="space-y-3">
                        {aiAnalysis.studyPlan.map((plan, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {plan.topic}
                              </h4>
                              <span className="text-sm text-blue-600 dark:text-blue-400">
                                {plan.time}
                              </span>
                            </div>
                            {plan.resources && plan.resources.length > 0 && (
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">
                                  Tài nguyên:{" "}
                                </span>
                                {plan.resources.join(", ")}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Week Goal */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                        <span className="mr-2">🎯</span>
                        Mục tiêu tuần này
                      </h3>
                      <p className="text-blue-700 dark:text-blue-400">
                        {aiAnalysis.weekGoal}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const exercise = exercises[currentExercise];
  const isCorrect = isAnswerCorrect(exercise, selectedAnswer);
  const correctOptionIndex = getCorrectOptionIndex(exercise);
  const progress =
    ((currentExercise + (showResult ? 1 : 0)) / exercises.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}

      {/* Progress Bar */}
      <div className="fixed top-[73px] left-0 w-full h-2 bg-gray-200 dark:bg-gray-700 z-40">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto p-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Test Code Header */}
            {practiceProgress && (
              <div className="mb-6 p-4 bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-800/20 rounded-2xl border border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base text-indigo-600 dark:text-indigo-400 mb-1">
                      Mã đề thi
                    </p>
                    <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 font-mono tracking-widest">
                      {practiceProgress.accessCode}
                    </p>
                    {practiceTest?.timeAlloted && (
                      <p className="text-lg text-indigo-600 dark:text-indigo-300 mt-2">
                        Thời gian quy định: {practiceTest.timeAlloted} phút
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-base text-indigo-600 dark:text-indigo-400 mb-1">
                      Thời gian đã làm
                    </p>
                    <p className={`text-2xl font-bold font-mono ${getTimerColorClass()}`}>
                      {Math.floor(elapsedSeconds / 60)}:
                      {String(elapsedSeconds % 60).padStart(2, "0")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Exercise Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              {/* Exercise Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                    Bài {exercise.lessonId}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(exercise.difficulty)}`}
                  >
                    {getDifficultyLabel(exercise.difficulty)}
                  </span>
                </div>

                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    Câu {currentExercise + 1}/{exercises.length}
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <p className="text-lg text-gray-800 dark:text-white leading-relaxed">
                  {exercise.chapterId === "1" ? (
                    <MathProvider children={exercise.question} />
                  ) : exercise.chapterId === "2" ? (
                    <RenderWithMath content={exercise.question} />
                  ) : (
                    <RenderWithMath content={exercise.question} />
                  )}
                </p>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-8">
                {exercise.type === "multiple-choice" && exercise.options && (
                  <>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      (Nhấn phím 1-{exercise.options.length} để chọn nhanh)
                    </p>
                    {exercise.options.map((option: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${selectedAnswer === index
                          ? showResult
                            ? isCorrect
                              ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300"
                              : "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300"
                            : "bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300"
                          : showResult && index === correctOptionIndex
                            ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                          }`}
                      >
                        <div className="flex items-center">
                          <span className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-sm font-medium mr-3">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {exercise.chapterId === "1" ? (
                            <MathProvider children={option} />
                          ) : exercise.chapterId === "2" ? (
                            <RenderWithMath content={option} />
                          ) : (
                            <RenderWithMath content={option} />
                          )}
                        </div>
                      </button>
                    ))}
                  </>
                )}

                {exercise.type === "true-false" && (
                  <>
                    <button
                      onClick={() => handleAnswerSelect("true")}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${selectedAnswer === "true"
                        ? showResult
                          ? isCorrect
                            ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300"
                            : "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300"
                          : "bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300"
                        : showResult && exercise.correctAnswer === "true"
                          ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                        }`}
                    >
                      ✅ Đúng
                    </button>
                    <button
                      onClick={() => handleAnswerSelect("false")}
                      disabled={showResult}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${selectedAnswer === "false"
                        ? showResult
                          ? isCorrect
                            ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300"
                            : "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300"
                          : "bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300"
                        : showResult && exercise.correctAnswer === "false"
                          ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                        }`}
                    >
                      ❌ Sai
                    </button>
                  </>
                )}

                {(exercise.type === "calculation" || (exercise.type as string) === "fill-in") && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={selectedAnswer ?? ""}
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                      disabled={showResult}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập đáp án của bạn..."
                    />
                    {showResult && (
                      <div
                        className={`p-4 rounded-lg ${isCorrect
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                          }`}
                      >
                        Đáp án đúng: {exercise.correctAnswer}
                      </div>
                    )}
                  </div>
                )}

                {showResult && (
                  <div
                    className={`p-4 rounded-lg ${isCorrect ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">
                        {isCorrect ? "✅" : "❌"}
                      </span>
                      <span
                        className={`font-semibold ${isCorrect ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}`}
                      >
                        {isCorrect ? "Chính xác!" : "Chưa chính xác"}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {exercise.chapterId === "1" ? (
                        <MathProvider children={exercise.explanation} />
                      ) : exercise.chapterId === "2" ? (
                        <RenderWithMath content={exercise.explanation} />
                      ) : (
                        <RenderWithMath content={exercise.explanation} />
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {confirmSubmitOpen && (
                <div className="mb-4 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-200">
                  <p className="mb-3">
                    Bạn có chắc chắn muốn nộp bài? {pendingUnansweredCount > 0 || pendingUncheckedCount > 0 ? (
                      pendingUnansweredCount > 0 && pendingUncheckedCount > 0 ?
                        `Còn ${pendingUnansweredCount} câu chưa trả lời và ${pendingUncheckedCount} câu chưa kiểm tra.` :
                        pendingUnansweredCount > 0 ?
                          `Còn ${pendingUnansweredCount} câu chưa trả lời.` :
                          `Còn ${pendingUncheckedCount} câu chưa kiểm tra.`
                    ) : (
                      "Tất cả câu đã có đáp án."
                    )}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={confirmFinishSubmit}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition-colors font-medium"
                    >
                      Có, nộp bài
                    </button>
                    <button
                      onClick={() => setConfirmSubmitOpen(false)}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 hover:bg-gray-100 transition-colors font-medium"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === ""}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Kiểm tra
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {currentExercise === exercises.length - 1
                    ? "Hoàn thành 🎉"
                    : "Tiếp theo →"}
                </button>
                <button
                  onClick={handleFinishEarly}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Hoàn thành bài làm
                </button>
              </div>
            </div>

            {/* Score Display */}
            <div className="text-lg mt-6 text-center text-gray-600 dark:text-gray-400">
              <p>
                Điểm hiện tại:{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {score}/{exerciseResults.length}
                </span>
              </p>
            </div>
          </div>

          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed right-6 top-24 z-50 rounded-full bg-indigo-600 px-4 py-3 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition"
            >
              Hiện bảng câu hỏi
            </button>
          )}

          <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-[100px] space-y-4">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-1">
                      Điều hướng
                    </p>
                    <h2 className="text-xl font-normal text-gray-900 dark:text-white">
                      Danh sách câu hỏi
                    </h2>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {exercises.length} câu hỏi trong đề
                </div>

                <div className="space-y-3">
                  {exercises.map((ex, index) => (
                    <button
                      key={ex.id}
                      onClick={() => jumpToQuestion(index)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${currentExercise === index
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          Câu {index + 1}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getQuestionStatusColor(ex.id)}`}
                        >
                          {getQuestionStatus(ex.id)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
