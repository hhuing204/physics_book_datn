// // app/api/ai/generate/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { geminiUtils, promptTemplates, physicsConfig } from '@/lib/gemini/config';

// export async function POST(request: NextRequest) {
//     try {
//         const { topic, difficulty = 'medium', count = 1 } = await request.json();

//         // Kiểm tra dữ liệu đầu vào
//         if (!topic || typeof topic !== 'string') {
//             return NextResponse.json({
//                 success: false,
//                 error: 'Vui lòng cung cấp chủ đề bài tập'
//             }, { status: 400 });
//         }

//         // Kiểm tra topic có nằm trong focus topics không
//         const isValidTopic = physicsConfig.focusTopics.some(focusTopic =>
//             topic.toLowerCase().includes(focusTopic.toLowerCase()) ||
//             focusTopic.toLowerCase().includes(topic.toLowerCase())
//         );

//         if (!isValidTopic) {
//             return NextResponse.json({
//                 success: false,
//                 error: `Chủ đề phải thuộc một trong các chủ đề: ${physicsConfig.focusTopics.join(', ')}`,
//                 suggestions: physicsConfig.focusTopics
//             }, { status: 400 });
//         }

//         // Kiểm tra difficulty
//         if (!['easy', 'medium', 'hard'].includes(difficulty)) {
//             return NextResponse.json({
//                 success: false,
//                 error: 'Độ khó phải là một trong: easy, medium, hard'
//             }, { status: 400 });
//         }

//         // Giới hạn số lượng bài tập
//         const exerciseCount = Math.min(Math.max(1, parseInt(count) || 1), 5);

//         const exercises = [];

//         for (let i = 0; i < exerciseCount; i++) {
//             const prompt = promptTemplates.generateExercise(topic, difficulty);
//             const result = await geminiUtils.generateText(prompt);

//             if (result.success) {
//                 try {
//                     const exercise = JSON.parse(result.text || '');

//                     // Validate exercise format
//                     if (exercise.problem && exercise.solution) {
//                         exercises.push({
//                             ...exercise,
//                             id: i + 1,
//                             topic: topic,
//                             generatedAt: new Date().toISOString()
//                         });
//                     }
//                 } catch (parseError) {
//                     console.error('Failed to parse exercise:', parseError);
//                     // Continue to next iteration
//                 }
//             }

//             // Thêm delay nhỏ giữa các request để tránh rate limit
//             if (i < exerciseCount - 1) {
//                 await new Promise(resolve => setTimeout(resolve, 500));
//             }
//         }

//         if (exercises.length === 0) {
//             return NextResponse.json({
//                 success: false,
//                 error: 'Không thể tạo bài tập. Vui lòng thử lại sau.',
//                 fallbackExercises: generateFallbackExercises(topic, difficulty, exerciseCount)
//             }, { status: 500 });
//         }

//         return NextResponse.json({
//             success: true,
//             exercises: exercises,
//             count: exercises.length,
//             topic: topic,
//             difficulty: difficulty
//         });

//     } catch (error) {
//         console.error('Generate exercise error:', error);
//         return NextResponse.json({
//             success: false,
//             error: 'Lỗi máy chủ khi tạo bài tập',
//             fallbackExercises: generateFallbackExercises('Dao động điều hòa', 'medium', 1)
//         }, { status: 500 });
//     }
// }

// // Hàm tạo fallback exercises
// function generateFallbackExercises(topic: string, difficulty: string, count: number): any[] {
//     const fallbacks = [];

//     for (let i = 0; i < count; i++) {
//         fallbacks.push({
//             id: i + 1,
//             problem: `Một vật dao động điều hòa với phương trình x = 0.1cos(2πt) (m). Tính biên độ, tần số góc và chu kỳ dao động.`,
//             solution: `
// 1. Biên độ: A = 0.1 m
// 2. Tần số góc: ω = 2π rad/s
// 3. Chu kỳ: T = 2π/ω = 1 s
//             `.trim(),
//             formulasUsed: ["x = Acos(ωt + φ)", "ω = 2π/T", "T = 1/f"],
//             hints: ["So sánh với phương trình tổng quát", "Xác định các hệ số từ phương trình"],
//             difficulty: difficulty,
//             topic: topic,
//             isFallback: true
//         });
//     }

//     return fallbacks;
// }

// app/api/ai/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ollamaUtils, promptTemplates, physicsConfig } from '@/lib/ollama/config';

export async function POST(request: NextRequest) {
    try {
        const { topic, difficulty = 'medium', count = 1 } = await request.json();

        // Kiểm tra dữ liệu đầu vào
        if (!topic || typeof topic !== 'string') {
            return NextResponse.json({
                success: false,
                error: 'Vui lòng cung cấp chủ đề bài tập'
            }, { status: 400 });
        }

        // Lấy tất cả topics từ các chương
        const allTopics = physicsConfig.chapters.flatMap(c => c.topics);

        // Kiểm tra topic có nằm trong danh sách không
        const isValidTopic = allTopics.some(t =>
            topic.toLowerCase().includes(t.toLowerCase()) ||
            t.toLowerCase().includes(topic.toLowerCase())
        );

        if (!isValidTopic) {
            return NextResponse.json({
                success: false,
                error: `Chủ đề không hợp lệ. Các chủ đề có sẵn: ${allTopics.slice(0, 10).join(', ')}...`,
                suggestions: allTopics.slice(0, 10)
            }, { status: 400 });
        }

        // Kiểm tra difficulty
        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            return NextResponse.json({
                success: false,
                error: 'Độ khó phải là một trong: easy, medium, hard'
            }, { status: 400 });
        }

        // Giới hạn số lượng bài tập
        const exerciseCount = Math.min(Math.max(1, parseInt(count) || 1), 5);

        const exercises = [];

        for (let i = 0; i < exerciseCount; i++) {
            const prompt = promptTemplates.generateExercise(topic, difficulty as any);
            const result = await ollamaUtils.generateText(prompt);

            if (result.success && result.text) {
                try {
                    // Làm sạch JSON
                    let cleanText = result.text
                        .trim()
                        .replace(/^```json/i, "")
                        .replace(/^```/, "")
                        .replace(/```$/, "")
                        .trim();

                    const exercise = JSON.parse(cleanText);

                    // Validate exercise format
                    if (exercise.problem && exercise.solution) {
                        exercises.push({
                            ...exercise,
                            id: i + 1,
                            topic: topic,
                            difficulty: difficulty,
                            generatedAt: new Date().toISOString()
                        });
                    }
                } catch (parseError) {
                    console.error('Failed to parse exercise:', parseError);
                    // Nếu không parse được, tạo exercise từ text
                    exercises.push({
                        id: i + 1,
                        problem: result.text.substring(0, 200) + "...",
                        solution: "Xem chi tiết trong câu trả lời",
                        formulasUsed: [],
                        hints: ["Đọc kỹ đề bài"],
                        difficulty: difficulty,
                        topic: topic,
                        generatedAt: new Date().toISOString(),
                        raw: result.text
                    });
                }
            }

            // Thêm delay nhỏ giữa các request
            if (i < exerciseCount - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        if (exercises.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'Không thể tạo bài tập. Vui lòng thử lại sau.',
                fallbackExercises: generateFallbackExercises(topic, difficulty, exerciseCount)
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            exercises: exercises,
            count: exercises.length,
            topic: topic,
            difficulty: difficulty
        });

    } catch (error) {
        console.error('Generate exercise error:', error);
        return NextResponse.json({
            success: false,
            error: 'Lỗi máy chủ khi tạo bài tập',
            fallbackExercises: generateFallbackExercises('Dao động điều hòa', 'medium', 1)
        }, { status: 500 });
    }
}

// Hàm tạo fallback exercises
function generateFallbackExercises(topic: string, difficulty: string, count: number): any[] {
    const fallbacks = [];

    for (let i = 0; i < count; i++) {
        fallbacks.push({
            id: i + 1,
            problem: `Một vật dao động điều hòa với phương trình x = 5cos(2πt + π/3) (cm). Tính biên độ, tần số góc, pha ban đầu và chu kỳ dao động.`,
            solution: `**Giải:**
1. Biên độ: A = 5 cm
2. Tần số góc: ω = 2π rad/s
3. Pha ban đầu: φ = π/3 rad
4. Chu kỳ: T = 2π/ω = 1 s

**Đáp số:** A = 5cm, ω = 2π rad/s, φ = π/3, T = 1s`,
            formulasUsed: ["x = Acos(ωt + φ)", "T = 2π/ω"],
            hints: ["So sánh với phương trình tổng quát", "Xác định các hệ số từ phương trình"],
            difficulty: difficulty,
            topic: topic,
            isFallback: true
        });
    }

    return fallbacks;
}