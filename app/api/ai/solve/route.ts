// // app/api/ai/solve/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { geminiUtils, promptTemplates } from '@/lib/gemini/config';

// export async function POST(request: NextRequest) {
//     try {
//         const { problem, showSteps = true } = await request.json();

//         // Kiểm tra dữ liệu đầu vào
//         if (!problem || typeof problem !== 'string') {
//             return NextResponse.json({
//                 success: false,
//                 error: 'Vui lòng cung cấp bài tập cần giải'
//             }, { status: 400 });
//         }

//         // Giới hạn độ dài bài tập
//         if (problem.length > 1000) {
//             return NextResponse.json({
//                 success: false,
//                 error: 'Bài tập quá dài. Vui lòng giới hạn dưới 1000 ký tự'
//             }, { status: 400 });
//         }

//         const prompt = promptTemplates.solveExercise(problem, showSteps);
//         const result = await geminiUtils.generateText(prompt);

//         if (!result.success) {
//             return NextResponse.json({
//                 success: false,
//                 message: result.error,
//                 solution: result.fallbackResponse
//             }, { status: 500 });
//         }

//         return NextResponse.json({
//             success: true,
//             solution: result.text,
//             tokensUsed: result.usage
//         });

//     } catch (error) {
//         console.error('Solve exercise error:', error);
//         return NextResponse.json({
//             success: false,
//             error: 'Lỗi máy chủ khi giải bài tập'
//         }, { status: 500 });
//     }
// }

// app/api/ai/solve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ollamaUtils, promptTemplates } from '@/lib/ollama/config';

export async function POST(request: NextRequest) {
    try {
        const { problem, showSteps = true } = await request.json();

        // Kiểm tra dữ liệu đầu vào
        if (!problem || typeof problem !== 'string') {
            return NextResponse.json({
                success: false,
                error: 'Vui lòng cung cấp bài tập cần giải'
            }, { status: 400 });
        }

        // Giới hạn độ dài bài tập
        if (problem.length > 1000) {
            return NextResponse.json({
                success: false,
                error: 'Bài tập quá dài. Vui lòng giới hạn dưới 1000 ký tự'
            }, { status: 400 });
        }

        const prompt = promptTemplates.solveExercise(problem, showSteps);
        const result = await ollamaUtils.generateText(prompt);

        if (!result.success) {
            return NextResponse.json({
                success: false,
                message: result.error,
                solution: result.fallbackResponse || getFallbackSolution(problem)
            }, { status: 500 });
        }

        // Tách đáp số nếu có
        const solution = result.text || '';
        const answerMatch = solution.match(/(?:đáp số|kết quả|vậy|)=?\s*([^.\n]+)/i);
        const answer = answerMatch ? answerMatch[1].trim() : undefined;

        return NextResponse.json({
            success: true,
            solution: solution,
            answer: answer,
            hasSteps: showSteps,
            metrics: result.metrics
        });

    } catch (error) {
        console.error('Solve exercise error:', error);
        return NextResponse.json({
            success: false,
            error: 'Lỗi máy chủ khi giải bài tập',
            solution: getFallbackSolution('')
        }, { status: 500 });
    }
}

// Hàm tạo lời giải fallback
function getFallbackSolution(problem: string): string {
    if (problem.toLowerCase().includes('con lắc lò xo')) {
        return `**Hướng dẫn giải bài tập con lắc lò xo:**

1. **Xác định các đại lượng:**
   - Độ cứng lò xo: k (N/m)
   - Khối lượng vật: m (kg)
   - Biên độ: A (m)

2. **Công thức cần nhớ:**
   - Chu kỳ: $T = 2\\pi\\sqrt{\\frac{m}{k}}$
   - Tần số góc: $\\omega = \\sqrt{\\frac{k}{m}}$
   - Năng lượng: $W = \\frac{1}{2}kA^2$

3. **Phương trình dao động:**
   $x = A\\cos(\\omega t + \\varphi)$

Vui lòng thử lại sau để có lời giải chi tiết!`;
    }

    if (problem.toLowerCase().includes('con lắc đơn')) {
        return `**Hướng dẫn giải bài tập con lắc đơn:**

1. **Xác định các đại lượng:**
   - Chiều dài dây: l (m)
   - Gia tốc trọng trường: g ≈ 9.8 m/s²
   - Biên độ góc: α₀ (rad)

2. **Công thức cần nhớ (góc nhỏ):**
   - Chu kỳ: $T = 2\\pi\\sqrt{\\frac{l}{g}}$
   - Tần số góc: $\\omega = \\sqrt{\\frac{g}{l}}$
   - Vận tốc: $v = \\sqrt{2gl(1-\\cos\\alpha_0)}$

Vui lòng thử lại sau để có lời giải chi tiết!`;
    }

    return `**Hướng dẫn giải bài tập Vật lý:**

1. Đọc kỹ đề bài, xác định dạng bài
2. Viết các công thức liên quan
3. Thay số và tính toán
4. Kiểm tra đơn vị và kết luận

Vui lòng thử lại sau để có lời giải chi tiết!`;
}