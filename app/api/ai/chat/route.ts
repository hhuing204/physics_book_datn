// // app/api/ai/chat/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { geminiUtils } from '@/lib/gemini/config';

// export async function POST(request: NextRequest) {
//     try {
//         const { messages, userId } = await request.json();

//         // Kiểm tra dữ liệu đầu vào
//         if (!messages || !Array.isArray(messages) || messages.length === 0) {
//             return NextResponse.json({
//                 success: false,
//                 error: 'Vui lòng cung cấp tin nhắn'
//             }, { status: 400 });
//         }

//         // Kiểm tra tin nhắn cuối cùng
//         const lastMessage = messages[messages.length - 1];
//         if (!lastMessage || !lastMessage.content || lastMessage.role !== 'user') {
//             return NextResponse.json({
//                 success: false,
//                 error: 'Tin nhắn cuối cùng phải từ người dùng'
//             }, { status: 400 });
//         }

//         // Giới hạn độ dài tin nhắn
//         const totalLength = messages.reduce((sum, msg) => sum + msg.content.length, 0);
//         if (totalLength > 4000) {
//             return NextResponse.json({
//                 success: false,
//                 error: 'Cuộc trò chuyện quá dài. Vui lòng bắt đầu cuộc trò chuyện mới'
//             }, { status: 400 });
//         }

//         // Giới hạn số lượng tin nhắn
//         const limitedMessages = messages.slice(-10); // Chỉ lấy 10 tin nhắn gần nhất

//         // Kiểm tra nội dung tin nhắn có liên quan đến Vật lý Dao động không
//         const isPhysicsRelated = checkPhysicsRelated(lastMessage.content);
//         if (!isPhysicsRelated) {
//             return NextResponse.json({
//                 success: false,
//                 error: 'Xin lỗi, tôi chỉ có thể trả lời các câu hỏi về Vật lý 11 - Chương Dao động',
//                 allowedTopics: [
//                     'Dao động điều hòa',
//                     'Con lắc lò xo',
//                     'Con lắc đơn',
//                     'Năng lượng dao động',
//                     'Tổng hợp dao động',
//                     'Dao động tắt dần',
//                     'Hiện tượng cộng hưởng'
//                 ]
//             }, { status: 400 });
//         }

//         const result = await geminiUtils.chatWithContext(limitedMessages);

//         if (!result.success) {
//             return NextResponse.json({
//                 success: false,
//                 message: result.error,
//                 response: getChatFallback(lastMessage.content)
//             }, { status: 500 });
//         }

//         return NextResponse.json({
//             success: true,
//             response: result.text,
//             tokensUsed: result.usage,
//             messageCount: limitedMessages.length
//         });

//     } catch (error) {
//         console.error('Chat error:', error);
//         return NextResponse.json({
//             success: false,
//             error: 'Lỗi máy chủ khi xử lý tin nhắn',
//             response: getChatFallback('')
//         }, { status: 500 });
//     }
// }

// // Kiểm tra nội dung có liên quan đến Vật lý Dao động không
// function checkPhysicsRelated(message: string): boolean {
//     const physicsKeywords = [
//         'dao động', 'con lắc', 'lò xo', 'chu kỳ', 'tần số',
//         'biên độ', 'năng lượng', 'điều hòa', 'tắt dần', 'cộng hưởng',
//         'vật lý', 'lý 11', 'dao động cơ', 'pha ban đầu', 'tần số góc',
//         'ω', 'π', 'cos', 'sin', 'A', 'T', 'f', 'k', 'm', 'g'
//     ];

//     const lowerMessage = message.toLowerCase();
//     return physicsKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
// }

// // Hàm tạo fallback cho chat
// function getChatFallback(message: string): string {
//     const fallbacks = [
//         "Xin lỗi, hiện tôi đang gặp sự cố kỹ thuật. Bạn có thể thử hỏi lại sau hoặc xem tài liệu về dao động điều hòa trong sách giáo khoa.",
//         "Tạm thời tôi không thể trả lời câu hỏi này. Hãy kiểm tra các công thức: x = Acos(ωt + φ), T = 2π√(m/k), W = ½kA².",
//         "AI đang bảo trì. Bạn có câu hỏi nào về dao động điều hòa, con lắc lò xo, hay năng lượng dao động không?",
//         "Hệ thống đang quá tải. Vui lòng thử lại sau. Trong lúc chờ, hãy ôn lại phương trình dao động x = Acos(ωt + φ)."
//     ];

//     return fallbacks[Math.floor(Math.random() * fallbacks.length)];
// }

import { NextRequest, NextResponse } from 'next/server';
import { ollamaUtils, physicsConfig, systemPrompts } from '@/lib/ollama/config';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function POST(request: NextRequest) {
    try {
        const { messages, userId, chapterId } = await request.json();

        // Kiểm tra dữ liệu đầu vào
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'Vui lòng cung cấp tin nhắn'
            }, { status: 400 });
        }

        // Kiểm tra tin nhắn cuối cùng
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || !lastMessage.content || lastMessage.role !== 'user') {
            return NextResponse.json({
                success: false,
                error: 'Tin nhắn cuối cùng phải từ người dùng'
            }, { status: 400 });
        }

        // Giới hạn độ dài
        const totalLength = messages.reduce((sum, msg) => sum + msg.content.length, 0);
        if (totalLength > 8000) {
            return NextResponse.json({
                success: false,
                error: 'Cuộc trò chuyện quá dài. Vui lòng bắt đầu cuộc trò chuyện mới'
            }, { status: 400 });
        }

        // Lấy 8 tin nhắn gần nhất
        const limitedMessages = messages.slice(-8);

        // Kiểm tra nội dung có liên quan đến Vật lý 11 không
        const isValid = checkPhysicsTopic(lastMessage.content);
        if (!isValid.valid) {
            return NextResponse.json({
                success: false,
                error: isValid.message,
                suggestion: isValid.suggestion
            }, { status: 400 });
        }

        // Xác định chapter từ câu hỏi hoặc từ chapterId
        let currentChapter = chapterId
            ? physicsConfig.getChapterById(chapterId)
            : physicsConfig.detectChapter(lastMessage.content);

        // Format messages
        const formattedMessages: ChatMessage[] = limitedMessages
            .filter((msg: any) => msg.role === 'user' || msg.role === 'assistant')
            .map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: String(msg.content || '')
            }));

        // Thêm context về chapter vào system prompt
        const chapterContext = currentChapter
            ? `\n[CHƯƠNG HIỆN TẠI: ${currentChapter.name}]\nCác chủ đề: ${currentChapter.topics.join(', ')}\n`
            : '';

        // Tạo messages với system prompt
        const fullMessages = [
            {
                role: 'system',
                content: systemPrompts.physicsTutor + chapterContext
            },
            ...formattedMessages
        ];

        // Gọi Ollama
        const result = await ollamaUtils.chat(formattedMessages);

        if (!result.success) {
            // Xử lý lỗi
            let errorMessage = result.error || 'Lỗi không xác định';
            let statusCode = 500;

            if (result.errorCode === 'LOADING_MODEL') {
                errorMessage = 'Model AI đang khởi động, vui lòng thử lại sau 1-2 phút.';
                statusCode = 503;
            } else if (result.errorCode === 'CONNECTION_REFUSED') {
                errorMessage = 'Không thể kết nối Ollama. Chạy "ollama serve" trong terminal.';
                statusCode = 503;
            }

            return NextResponse.json({
                success: false,
                error: errorMessage,
                errorCode: result.errorCode,
                response: getFallbackResponse(lastMessage.content, currentChapter)
            }, { status: statusCode });
        }

        return NextResponse.json({
            success: true,
            response: result.text,
            chapter: currentChapter ? {
                id: currentChapter.id,
                name: currentChapter.name
            } : null,
            metrics: result.metrics
        });

    } catch (error: any) {
        console.error('Chat error:', error);
        return NextResponse.json({
            success: false,
            error: 'Lỗi máy chủ',
            response: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'
        }, { status: 500 });
    }
}

// Kiểm tra câu hỏi có thuộc Vật lý 11 không
function checkPhysicsTopic(message: string): { valid: boolean; message: string; suggestion?: string } {
    const lower = message.toLowerCase();

    // Các từ khóa Vật lý 11
    const physicsKeywords = [
        'dao động', 'con lắc', 'lò xo', 'chu kỳ', 'tần số', 'biên độ',
        'sóng', 'giao thoa', 'sóng dừng', 'sóng âm', 'cường độ âm',
        'dòng điện', 'điện trở', 'điện phân', 'bán dẫn', 'diode',
        'từ trường', 'lực từ', 'cảm ứng từ', 'lorentz',
        'cảm ứng điện từ', 'từ thông', 'suất điện động', 'tự cảm',
        'khúc xạ', 'phản xạ toàn phần', 'lăng kính', 'thấu kính',
        'mắt', 'kính lúp', 'kính hiển vi', 'kính thiên văn',
        'vật lý 11', 'lý 11', 'bài tập lý'
    ];

    // Các từ khóa không thuộc Vật lý 11
    const unrelatedKeywords = [
        'lịch sử', 'địa lý', 'văn học', 'tiếng anh', 'toán', 'hóa học',
        'sinh học', 'tin học', 'gdcd', 'thể dục', 'quân sự'
    ];

    // Kiểm tra nếu có từ khóa không liên quan
    for (const word of unrelatedKeywords) {
        if (lower.includes(word)) {
            return {
                valid: false,
                message: `Xin lỗi, tôi chỉ hỗ trợ môn Vật Lý 11.`,
                suggestion: `Bạn có thể hỏi về các chương: Dao động, Sóng cơ, Điện học, Từ trường, Cảm ứng điện từ, Quang hình học.`
            };
        }
    }

    // Kiểm tra nếu có ít nhất 1 từ khóa Vật lý
    const hasPhysicsKeyword = physicsKeywords.some(k => lower.includes(k));

    if (!hasPhysicsKeyword) {
        return {
            valid: false,
            message: 'Câu hỏi có vẻ không liên quan đến Vật Lý 11.',
            suggestion: 'Hãy hỏi về dao động, sóng cơ, điện học, từ trường, cảm ứng điện từ, hoặc quang hình học.'
        };
    }

    return { valid: true, message: 'OK' };
}

// Fallback response
function getFallbackResponse(message: string, chapter?: any): string {
    const chapterName = chapter?.name || 'Vật Lý 11';

    return `Xin lỗi, hệ thống AI đang tạm thời gián đoạn.

**Trong lúc chờ, bạn có thể ôn lại kiến thức ${chapterName}:**

${chapter ? getChapterFormulas(chapter.id) : `
- **Dao động cơ**: x = A cos(ωt + φ), T = 2π√(m/k), W = ½kA²
- **Sóng cơ**: v = λf, Δφ = 2πd/λ
- **Điện học**: I = U/R, R = ρl/S
- **Từ trường**: F = BIl sinα, F = |q|vB sinα
- **Cảm ứng điện từ**: e = -ΔΦ/Δt
- **Quang hình**: n₁sin i = n₂sin r, 1/f = 1/d + 1/d'
`}

Vui lòng thử lại sau 1-2 phút!`;
}

// Lấy công thức theo chương
function getChapterFormulas(chapterId: string): string {
    const formulas: Record<string, string> = {
        'chuong-1': '- Dao động điều hòa: x = A cos(ωt + φ)\n- Con lắc lò xo: T = 2π√(m/k)\n- Con lắc đơn: T = 2π√(l/g)\n- Năng lượng: W = ½kA² = ½mω²A²',

        'chuong-2': '- Phương trình sóng: u = A cos(ωt - 2πx/λ)\n- Vận tốc: v = λf\n- Giao thoa: d₂ - d₁ = kλ (cực đại)\n- Sóng dừng: l = kλ/2',

        'chuong-3': '- Định luật Ohm: I = U/R\n- Điện trở: R = ρl/S\n- Điện phân: m = kq = (1/F)(A/n)It',

        'chuong-4': '- Lực từ: F = BIl sinα\n- Lực Lorentz: F = |q|vB sinα\n- Cảm ứng từ dây dẫn: B = 2×10⁻⁷ I/r',

        'chuong-5': '- Từ thông: Φ = BS cosα\n- Suất điện động cảm ứng: e = -ΔΦ/Δt\n- Tự cảm: e = -L Δi/Δt',

        'chuong-6': '- Định luật khúc xạ: n₁sin i = n₂sin r\n- Thấu kính: 1/f = 1/d + 1/d\'\n- Số bội giác: G = 25/f (kính lúp)'
    };

    return formulas[chapterId] || formulas['chuong-1'];
}

// GET endpoint
export async function GET(request: NextRequest) {
    return NextResponse.json({
        success: true,
        message: 'Chat API for Vật Lý 11 - Toàn bộ chương trình',
        version: '2.0',
        model: 'qwen2.5:7b',
        chapters: physicsConfig.chapters.map(c => ({
            id: c.id,
            name: c.name,
            topics: c.topics
        }))
    });
}