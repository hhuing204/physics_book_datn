// app/api/ai/query/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ollamaUtils, promptTemplates } from '@/lib/ollama/config';
import { classifyQuestion } from '@/utils/AI/questionClassifier';

export async function POST(request: NextRequest) {
    try {
        const { message, messages, userId } = await request.json();

        // Nếu có messages array (chat history)
        if (messages && Array.isArray(messages)) {
            const lastMessage = messages[messages.length - 1]?.content || '';
            const classification = classifyQuestion(lastMessage);

            console.log('📊 Classification:', classification);

            // Chọn endpoint dựa vào phân loại
            if (classification.type === 'solve') {
                // Gọi solve
                const prompt = promptTemplates.solveExercise(lastMessage, true);
                const result = await ollamaUtils.generateText(prompt);

                return NextResponse.json({
                    success: true,
                    type: 'solve',
                    solution: result.text,
                    metrics: result.metrics
                });
            }
            else if (classification.type === 'explain') {
                // Gọi explain
                const prompt = promptTemplates.explainConcept(lastMessage);
                const result = await ollamaUtils.generateText(prompt);

                return NextResponse.json({
                    success: true,
                    type: 'explain',
                    explanation: result.text,
                    metrics: result.metrics
                });
            }
            else {
                // Gọi chat
                const result = await ollamaUtils.chat(messages);

                return NextResponse.json({
                    success: true,
                    type: 'chat',
                    response: result.text,
                    metrics: result.metrics
                });
            }
        }

        // Nếu chỉ có message đơn
        if (message) {
            const classification = classifyQuestion(message);

            if (classification.type === 'solve') {
                const prompt = promptTemplates.solveExercise(message, true);
                const result = await ollamaUtils.generateText(prompt);

                return NextResponse.json({
                    success: true,
                    type: 'solve',
                    solution: result.text,
                    confidence: classification.confidence
                });
            }
            else if (classification.type === 'explain') {
                const prompt = promptTemplates.explainConcept(message);
                const result = await ollamaUtils.generateText(prompt);

                return NextResponse.json({
                    success: true,
                    type: 'explain',
                    explanation: result.text,
                    confidence: classification.confidence
                });
            }
            else {
                const prompt = promptTemplates.chat([{ role: 'user', content: message }]);
                const result = await ollamaUtils.generateText(prompt);

                return NextResponse.json({
                    success: true,
                    type: 'chat',
                    response: result.text,
                    confidence: classification.confidence
                });
            }
        }

        return NextResponse.json({
            success: false,
            error: 'Thiếu message hoặc messages'
        }, { status: 400 });

    } catch (error: any) {
        console.error('Query error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}