// components/simulator/SimulationMiniTest.tsx
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Award, Brain, Lightbulb, AlertCircle } from 'lucide-react';

export interface MiniTestQuestion {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    hint?: string;
    relatedParameter?: {
        param: string;
        expectedMin?: number;
        expectedMax?: number;
        checkValue?: (value: any) => boolean;
    };
}

interface SimulationMiniTestProps {
    simulationId: string;
    chapterId: string;
    questions: MiniTestQuestion[];
    title?: string;
    currentParameters?: Record<string, any>;
    isRequired?: boolean; // Có bắt buộc phải làm không?
    onComplete?: (score: number, passed: boolean) => void;
}

// Key lưu trạng thái đã làm test
const getTestCompletedKey = (simulationId: string) => `simulation_test_completed_${simulationId}`;
const getTestScoreKey = (simulationId: string) => `simulation_test_score_${simulationId}`;

export default function SimulationMiniTest({
    simulationId,
    chapterId,
    questions,
    title = "📝 Kiểm tra nhanh - Bạn đã hiểu mô phỏng này chưa?",
    currentParameters = {},
    isRequired = false,
    onComplete
}: SimulationMiniTestProps) {
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [expandedExplanation, setExpandedExplanation] = useState<string | null>(null);
    const [hasCompleted, setHasCompleted] = useState(false);

    // Kiểm tra xem đã làm test thành công chưa (khi load lại trang)
    useEffect(() => {
        const completed = localStorage.getItem(getTestCompletedKey(simulationId));
        const savedScore = localStorage.getItem(getTestScoreKey(simulationId));

        if (completed === 'true' && savedScore) {
            setHasCompleted(true);
            setScore(parseInt(savedScore));
            setSubmitted(true);
            setShowResults(true);
        }
    }, [simulationId]);

    const checkParameterBasedQuestion = (question: MiniTestQuestion): boolean => {
        if (!question.relatedParameter) return true;

        const { param, expectedMin, expectedMax, checkValue } = question.relatedParameter;
        const currentValue = currentParameters[param];

        if (currentValue === undefined) return true;
        if (checkValue) return checkValue(currentValue);
        if (expectedMin !== undefined && currentValue < expectedMin) return false;
        if (expectedMax !== undefined && currentValue > expectedMax) return false;

        return true;
    };

    const handleAnswer = (questionId: string, answerIndex: number) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    };

    const handleSubmit = () => {
        let correctCount = 0;

        questions.forEach(q => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            const parameterValid = checkParameterBasedQuestion(q);

            if (isCorrect && parameterValid) {
                correctCount++;
            }
        });

        const finalScore = (correctCount / questions.length) * 100;
        setScore(finalScore);
        setSubmitted(true);
        setShowResults(true);

        const passed = finalScore >= 70;

        // Lưu kết quả vào localStorage
        if (passed) {
            localStorage.setItem(getTestCompletedKey(simulationId), 'true');
            localStorage.setItem(getTestScoreKey(simulationId), finalScore.toString());
            setHasCompleted(true);
        }

        if (onComplete) {
            onComplete(finalScore, passed);
        }
    };

    const handleRetry = () => {
        setAnswers({});
        setSubmitted(false);
        setShowResults(false);
        setScore(0);
        // Không xóa khỏi localStorage, chỉ cho phép làm lại
    };

    // Nếu đã hoàn thành và đạt yêu cầu, hiển thị thông báo đã làm
    if (hasCompleted && score >= 70) {
        return (
            <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-green-800 dark:text-green-300">✅ Đã hoàn thành kiểm tra</h3>
                        <p className="text-sm text-green-700 dark:text-green-400">
                            Bạn đã hoàn thành bài kiểm tra với {Math.round(score)}/100 điểm.
                            {isRequired && " Bạn có thể yên tâm rời trang."}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleRetry}
                    className="mt-4 text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                >
                    <RefreshCw className="w-3 h-3" />
                    Làm lại để củng cố kiến thức
                </button>
            </div>
        );
    }

    if (showResults) {
        const passed = score >= 70;
        return (
            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                        }`}>
                        {passed ? (
                            <Award className="w-10 h-10 text-green-500" />
                        ) : (
                            <RefreshCw className="w-10 h-10 text-yellow-500" />
                        )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {passed ? '🎉 Tuyệt vời! Bạn đã hiểu bài!' : '📚 Cần xem lại mô phỏng'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Bạn đạt <span className="font-bold text-purple-600">{Math.round(score)}</span> / {questions.length * 10} điểm
                    </p>
                    {!passed && isRequired && (
                        <p className="text-red-500 dark:text-red-400 mt-2 text-sm">
                            ⚠️ Bắt buộc phải đạt 70% để có thể rời trang. Hãy làm lại bài kiểm tra!
                        </p>
                    )}
                    {passed && isRequired && (
                        <p className="text-green-600 dark:text-green-400 mt-2 text-sm">
                            ✅ Bạn đã hoàn thành yêu cầu. Có thể tiếp tục hoặc rời trang.
                        </p>
                    )}
                </div>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {questions.map((q, idx) => {
                        const userAnswer = answers[q.id];
                        const isCorrect = userAnswer === q.correctAnswer;
                        const isExpanded = expandedExplanation === q.id;

                        return (
                            <div key={q.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                <div className="flex items-start gap-3">
                                    {isCorrect ? (
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white mb-2">
                                            Câu {idx + 1}: {q.text}
                                        </p>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">Đáp án đúng:</span> {q.options[q.correctAnswer]}
                                        </div>
                                        <button
                                            onClick={() => setExpandedExplanation(isExpanded ? null : q.id)}
                                            className="text-xs text-purple-500 hover:text-purple-600 mt-2 flex items-center gap-1"
                                        >
                                            <Lightbulb className="w-3 h-3" />
                                            {isExpanded ? 'Thu gọn giải thích' : 'Xem giải thích'}
                                        </button>
                                        {isExpanded && (
                                            <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm text-purple-700 dark:text-purple-300">
                                                {q.explanation}
                                                {q.hint && (
                                                    <div className="mt-2 text-xs text-purple-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        💡 Gợi ý: {q.hint}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={handleRetry}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Làm lại bài kiểm tra
                </button>
            </div>
        );
    }

    const answeredCount = Object.keys(answers).length;
    const allAnswered = answeredCount === questions.length;

    return (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
                <Brain className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h3>
                {isRequired && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Bắt buộc
                    </span>
                )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                Trả lời các câu hỏi sau để kiểm tra mức độ hiểu bài của bạn.
                {isRequired && " Bạn cần đạt 70% để hoàn thành."}
            </p>

            <div className="space-y-6">
                {questions.map((q, idx) => (
                    <div key={q.id} className="space-y-3">
                        <p className="font-medium text-gray-900 dark:text-white">
                            <span className="text-purple-500 font-bold">{idx + 1}.</span> {q.text}
                        </p>
                        <div className="space-y-2">
                            {q.options.map((option, optIdx) => (
                                <label
                                    key={optIdx}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${answers[q.id] === optIdx
                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={optIdx}
                                        checked={answers[q.id] === optIdx}
                                        onChange={() => handleAnswer(q.id, optIdx)}
                                        className="w-4 h-4 text-purple-600"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">{option}</span>
                                </label>
                            ))}
                        </div>
                        {q.hint && !answers[q.id] && (
                            <details className="text-sm">
                                <summary className="cursor-pointer text-purple-500 hover:text-purple-600">
                                    💡 Xem gợi ý
                                </summary>
                                <p className="mt-2 text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                                    {q.hint}
                                </p>
                            </details>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${allAnswered
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg cursor-pointer'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
            >
                <CheckCircle className="w-4 h-4" />
                Nộp bài và kiểm tra kết quả
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
                💡 Làm lại bao nhiêu lần cũng được để củng cố kiến thức!
            </p>
        </div>
    );
}