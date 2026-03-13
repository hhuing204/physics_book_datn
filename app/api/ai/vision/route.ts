// 

// app/api/ai/vision/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ollamaConfig } from '@/lib/ollama/config';

export async function POST(request: NextRequest) {
    try {
        // Kiểm tra model vision đã được cấu hình chưa
        if (!ollamaConfig.visionModel) {
            return NextResponse.json({
                success: false,
                error: 'Vision API chưa được cấu hình',
                message: 'Vui lòng cài đặt model vision: ollama pull llava:7b'
            }, { status: 501 });
        }

        return NextResponse.json({
            success: false,
            error: 'Vision API đang được phát triển',
            message: 'Tính năng xử lý ảnh sẽ có trong phiên bản tiếp theo',
            requiredModel: ollamaConfig.visionModel,
            setup: `Để sử dụng, cài đặt: ollama pull ${ollamaConfig.visionModel}`
        }, { status: 501 });

        /* // Code khi triển khai vision
        const formData = await request.formData();
        const image = formData.get('image') as File;
        const question = formData.get('question') as string || '';

        if (!image) {
            return NextResponse.json({
                success: false,
                error: 'Vui lòng tải lên ảnh'
            }, { status: 400 });
        }

        // Kiểm tra kích thước ảnh (giới hạn 5MB)
        if (image.size > 5 * 1024 * 1024) {
            return NextResponse.json({
                success: false,
                error: 'Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB'
            }, { status: 400 });
        }

        // Convert image to base64
        const bytes = await image.arrayBuffer();
        const base64 = Buffer.from(bytes).toString('base64');
        
        // Gọi Ollama vision model
        const response = await fetch(`${ollamaConfig.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: ollamaConfig.visionModel,
                prompt: `Phân tích ảnh bài tập Vật lý này: ${question}`,
                images: [base64],
                stream: false,
                options: {
                    temperature: 0.2,
                    num_predict: 1024
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            analysis: data.response,
            metrics: {
                totalDuration: data.total_duration,
                evalCount: data.eval_count
            }
        });
        */

    } catch (error) {
        console.error('Vision processing error:', error);
        return NextResponse.json({
            success: false,
            error: 'Lỗi xử lý ảnh',
            message: 'Vui lòng thử lại sau'
        }, { status: 500 });
    }
}