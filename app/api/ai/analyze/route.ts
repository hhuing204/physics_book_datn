// // app/api/ai/analyze/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { geminiUtils, promptTemplates } from '@/lib/gemini/config';
// import { PassThrough } from 'stream';

// export async function POST(request: NextRequest) {
//     try {
//         const progressData = await request.json();

//         // Tạo prompt
//         const prompt = promptTemplates.analyzeProgress(progressData);
//         const result = await geminiUtils.generateText(prompt);

//         if (!result.success || !result.text) {
//             return NextResponse.json({
//                 success: false,
//                 message: result.error || "AI response error",
//                 fallback: result.fallbackResponse || null
//             }, { status: 500 });
//         }
//         // console.log("AI RAW RESPONSE:", result.text);

//         let cleanText = result.text
//             .trim()
//             .replace(/^```json/i, "")
//             .replace(/^```/, "")
//             .replace(/```$/, "");

//         // Safe JSON parse
//         // console.log("Cleantext: ", cleanText)
//         let parsed;
//         try {
//             parsed = JSON.parse(cleanText);
//         } catch (e) {
//             return NextResponse.json({
//                 success: false,
//                 error: "AI did not return valid JSON",
//                 raw: cleanText
//             }, { status: 500 });
//         }


//         // let cleanText = {
//         //     "overview": "Bạn đã đạt 40% số câu đúng, cho thấy kiến thức nền tảng Vật lý 11 chưa vững chắc. Thời gian làm bài nhanh có thể chỉ ra sự vội vàng hoặc thiếu tự tin trong việc giải quyết vấn đề.",
//         //     "strengths": [
//         //         "Hoàn thành bài kiểm tra trong thời gian ngắn",
//         //         "Có khả năng giải quyết được một số câu hỏi cơ bản"
//         //     ],
//         //     "weaknesses": [
//         //         "Nắm vững kiến thức tổng thể còn hạn chế",
//         //         "Cần cải thiện độ chính xác và kỹ năng vận dụng công thức"
//         //     ],
//         //     "studyPlan": [
//         //         {
//         //             "topic": "Ôn tập toàn bộ kiến thức cơ bản Vật lý 11 (từ chương đầu)",
//         //             "time": "3-4 giờ/tuần",
//         //             "resources": ["Sách giáo khoa Vật lý 11", "Bài giảng trực tuyến (ví dụ: VietJack, Hocmai)", "Tuyển tập bài tập cơ bản có lời giải"]
//         //         }
//         //     ],
//         //     "weekGoal": "Nắm vững các định nghĩa, công thức cốt lõi của ít nhất 2 chương đầu tiên, và có thể giải quyết đúng 60% các bài tập cơ bản liên quan."
//         // }
//         // let parsed = cleanText;
//         // // console.log(parsed)

//         return NextResponse.json({
//             success: true,
//             analysis: parsed,
//             tokensUsed: result.usage || null
//         });

//     } catch (error: any) {
//         console.error("❌ Analyze API Error:", error);
//         return NextResponse.json({
//             success: false,
//             error: 'Internal server error'
//         }, { status: 500 });
//     }
// }

// app/api/ai/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ollamaUtils, promptTemplates } from '@/lib/ollama/config';

export async function POST(request: NextRequest) {
    try {
        const progressData = await request.json();

        // Validate dữ liệu đầu vào
        if (!progressData || typeof progressData !== 'object') {
            return NextResponse.json({
                success: false,
                error: 'Dữ liệu không hợp lệ'
            }, { status: 400 });
        }

        // Tính percentage nếu chưa có
        if (progressData.total && progressData.score && !progressData.percentage) {
            progressData.percentage = Math.round((progressData.score / progressData.total) * 100);
        }

        // Tạo prompt
        const prompt = promptTemplates.analyzeProgress(progressData);
        const result = await ollamaUtils.generateText(prompt);

        if (!result.success || !result.text) {
            return NextResponse.json({
                success: false,
                message: result.error || "AI response error",
                fallback: result.fallbackResponse || getFallbackAnalysis(progressData)
            }, { status: 500 });
        }

        // Làm sạch JSON từ response
        let cleanText = result.text
            .trim()
            .replace(/^```json/i, "")
            .replace(/^```/, "")
            .replace(/```$/, "")
            .trim();

        // Parse JSON
        let parsed;
        try {
            parsed = JSON.parse(cleanText);
        } catch (e) {
            console.error("JSON parse error:", e);
            console.log("Raw text:", cleanText);

            // Nếu không parse được, trả về fallback
            return NextResponse.json({
                success: true,
                analysis: getFallbackAnalysis(progressData),
                warning: "AI response không đúng format, sử dụng phân tích mẫu",
                raw: cleanText
            });
        }

        return NextResponse.json({
            success: true,
            analysis: parsed,
            metrics: result.metrics
        });

    } catch (error: any) {
        console.error("❌ Analyze API Error:", error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
}

// Hàm tạo phân tích fallback
function getFallbackAnalysis(progressData: any) {
    const percentage = progressData.percentage || 0;
    const total = progressData.total || 0;
    const score = progressData.score || 0;

    let level = "cần cố gắng";
    if (percentage >= 80) level = "tốt";
    else if (percentage >= 60) level = "khá";
    else if (percentage >= 40) level = "trung bình";

    return {
        overview: `Bạn đã đạt ${percentage}% (${score}/${total}) số câu đúng, mức độ ${level}.`,
        strengths: [
            "Đã hoàn thành bài kiểm tra",
            "Có nỗ lực trong học tập"
        ],
        weaknesses: [
            percentage < 60 ? "Cần ôn tập thêm kiến thức cơ bản" : "Cần luyện tập thêm bài tập nâng cao"
        ],
        studyPlan: [
            {
                topic: "Ôn tập các khái niệm cơ bản",
                time: "2-3 giờ/tuần",
                resources: ["Sách giáo khoa Vật lý 11", "Bài giảng trực tuyến"]
            }
        ],
        weekGoal: "Hoàn thành ít nhất 50 bài tập trắc nghiệm"
    };
}