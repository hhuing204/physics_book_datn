// // app/api/ai/explain/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// // import { geminiUtils, promptTemplates } from '@/lib/gemini/config';
// import { ollamaUtils, promptTemplates } from '@/lib/ollama/config'

// export async function POST(request: NextRequest) {
//     try {
//         const { concept, level } = await request.json();

//         const prompt = promptTemplates.explainConcept(concept, level);
//         // const result = await geminiUtils.generateText(prompt);
//         const result = await ollamaUtils.generateText(prompt);

//         if (!result.success) {
//             return NextResponse.json({
//                 success: false,
//                 message: result.error,
//                 fallback: result.fallbackResponse
//             }, { status: 500 });
//         }

//         return NextResponse.json({
//             success: true,
//             explanation: result.text,
//             tokensUsed: result.usage
//         });

//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             error: 'Internal server error'
//         }, { status: 500 });
//     }
// }

// app/api/ai/explain/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ollamaUtils, promptTemplates } from '@/lib/ollama/config'

export async function POST(request: NextRequest) {
    try {
        const { concept, level } = await request.json();

        // Validate input
        if (!concept) {
            return NextResponse.json({
                success: false,
                error: 'Thiếu khái niệm cần giải thích'
            }, { status: 400 });
        }

        // Validate level
        // if (level && !['basic', 'advanced'].includes(level)) {
        //     return NextResponse.json({
        //         success: false,
        //         error: 'Level phải là "basic" hoặc "advanced"'
        //     }, { status: 400 });
        // }

        // Tạo prompt từ template
        const prompt = promptTemplates.explainConcept(concept, level || 'basic');

        // Gọi Ollama
        const result = await ollamaUtils.generateText(prompt);

        if (!result.success) {
            // Xử lý lỗi chi tiết
            const statusCode = result.errorCode === 'LOADING_MODEL' ? 503 : 500;

            return NextResponse.json({
                success: false,
                error: result.error,
                errorCode: result.errorCode,
                fallbackResponse: result.fallbackResponse,
                message: result.error
            }, { status: statusCode });
        }

        // Trả về response tương thích với frontend
        return NextResponse.json({
            success: true,
            explanation: result.text,
            // Ollama không có usage tokens, trả về metrics thay thế
            metrics: {
                totalDuration: result.metrics?.totalDuration,
                promptEvalCount: result.metrics?.promptEvalCount,
                evalCount: result.metrics?.evalCount
            },
            // Giữ field tokensUsed để tương thích với code cũ (có thể undefined)
            tokensUsed: result.metrics?.evalCount ? {
                promptTokens: result.metrics.promptEvalCount || 0,
                completionTokens: result.metrics.evalCount || 0,
                totalTokens: (result.metrics.promptEvalCount || 0) + (result.metrics.evalCount || 0)
            } : undefined
        });

    } catch (error: any) {
        console.error('Explain API error:', error);

        return NextResponse.json({
            success: false,
            error: 'Lỗi server khi xử lý yêu cầu',
            message: error.message
        }, { status: 500 });
    }
}