/**
 * Middleware cho Ollama API requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkOllamaConnection, getAvailableModels, ollamaConfig } from './config';

export async function ollamaMiddleware(request: NextRequest) {
    // Kiểm tra kết nối Ollama
    const isConnected = await checkOllamaConnection();

    if (!isConnected) {
        return NextResponse.json({
            error: 'Ollama connection failed',
            message: 'Không thể kết nối Ollama server. Đảm bảo Ollama đang chạy (ollama serve)',
            solution: 'Chạy "ollama serve" trong terminal và thử lại',
            docs: 'https://github.com/ollama/ollama'
        }, { status: 503 });
    }

    // Kiểm tra model mặc định có tồn tại không
    const availableModels = await getAvailableModels();
    const defaultModel = ollamaConfig.defaultModel;

    if (!availableModels.includes(defaultModel)) {
        return NextResponse.json({
            error: 'Model not found',
            message: `Model ${defaultModel} chưa được pull`,
            solution: `Chạy "ollama pull ${defaultModel}" để tải model`,
            availableModels
        }, { status: 404 });
    }

    // Kiểm tra rate limiting (tùy chọn)
    // Có thể implement rate limiting riêng nếu cần

    return null; // Cho phép request tiếp tục
}

// Helper xử lý lỗi phổ biến
export function handleOllamaError(error: any) {
    console.error('Ollama Error Details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
    });

    if (error.message?.includes('ECONNREFUSED')) {
        return {
            success: false,
            error: 'Không thể kết nối Ollama',
            suggestion: 'Chạy "ollama serve" trong terminal'
        };
    }

    if (error.message?.includes('model')) {
        return {
            success: false,
            error: 'Model không tồn tại',
            suggestion: `Chạy "ollama pull ${ollamaConfig.defaultModel}"`
        };
    }

    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        return {
            success: false,
            error: 'Ollama không phản hồi',
            suggestion: 'Kiểm tra server hoặc giảm tải'
        };
    }

    return {
        success: false,
        error: 'Lỗi hệ thống AI',
        suggestion: 'Vui lòng thử lại sau'
    };
}