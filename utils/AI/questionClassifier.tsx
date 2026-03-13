// utils/questionClassifier.ts

export type QuestionType = 'chat' | 'solve' | 'explain' | 'unknown';

export interface ClassificationResult {
    type: QuestionType;
    confidence: number;
    reason?: string;
}

export function classifyQuestion(question: string): ClassificationResult {
    const lower = question.toLowerCase().trim();

    // 1. Kiểm tra nếu là yêu cầu GIẢI BÀI TẬP
    const solvePatterns = [
        // Từ khóa giải bài tập
        /\b(giải|tính|tìm|xác định|bài\s*tập)\b/i,
        // Có số và đơn vị
        /\d+\s*(cm|m|kg|g|n|hz|m\/s|rad|π)/i,
        // Có dấu = hoặc phép tính
        /[=+\-*/]|\d+\s*[+\-*/]\s*\d+/,
        // Công thức vật lý
        /[xvfavωφ]|=|cos|sin|tan|π|√/i,
        // Câu hỏi có dữ kiện
        /(có|với|biết|cho).{5,}(tính|tìm|xác định)/i,
        // Đuôi câu hỏi bài tập
        /(là bao nhiêu|bằng bao nhiêu|có giá trị là)$/i,
    ];

    // 2. Kiểm tra nếu là yêu cầu GIẢI THÍCH
    const explainPatterns = [
        // Từ khóa giải thích
        /\b(giải thích|định nghĩa|khái niệm|là gì|thế nào|tại sao|vì sao)\b/i,
        // Câu hỏi lý thuyết
        /\b(đặc điểm|tính chất|nguyên lý|định luật|ý nghĩa)\b/i,
        // Hỏi về công thức
        /\b(công thức|biểu thức|phương trình)\b.*\?$/i,
        // Câu hỏi ngắn, không có số
        /^.{10,50}\?$/i,
    ];

    // 3. Kiểm tra độ dài câu hỏi
    const wordCount = lower.split(/\s+/).length;

    // 4. Đếm số lượng số trong câu
    const numberCount = (lower.match(/\d+/g) || []).length;

    // 5. Kiểm tra có dữ kiện số không
    const hasNumbers = numberCount > 0;
    const hasUnits = /(cm|m|kg|g|n|hz|m\/s|rad)/i.test(lower);
    const hasFormula = /[xvfavωφ]|=|cos|sin|tan/i.test(lower);

    // Tính điểm cho từng loại
    let solveScore = 0;
    let explainScore = 0;
    let chatScore = 0;

    // Tăng điểm cho solve
    solvePatterns.forEach(pattern => {
        if (pattern.test(lower)) solveScore += 2;
    });

    if (hasNumbers) solveScore += 3;
    if (hasUnits) solveScore += 2;
    if (hasFormula) solveScore += 3;
    if (wordCount > 15) solveScore += 1; // Bài tập thường dài

    // Tăng điểm cho explain
    explainPatterns.forEach(pattern => {
        if (pattern.test(lower)) explainScore += 2;
    });

    if (!hasNumbers && wordCount < 20) explainScore += 2;
    if (lower.includes('?')) explainScore += 1;

    // Chat thông thường
    if (!hasNumbers && !hasFormula && wordCount < 15) {
        chatScore += 2;
    }

    // Xác định loại
    const maxScore = Math.max(solveScore, explainScore, chatScore);

    if (maxScore === 0) {
        return { type: 'unknown', confidence: 0 };
    }

    if (solveScore === maxScore && solveScore >= 4) {
        return {
            type: 'solve',
            confidence: solveScore / (solveScore + explainScore + chatScore),
            reason: 'Phát hiện bài tập có số liệu'
        };
    }

    if (explainScore === maxScore && explainScore >= 3) {
        return {
            type: 'explain',
            confidence: explainScore / (solveScore + explainScore + chatScore),
            reason: 'Câu hỏi lý thuyết, giải thích'
        };
    }

    return {
        type: 'chat',
        confidence: chatScore / (solveScore + explainScore + chatScore),
        reason: 'Hội thoại thông thường'
    };
}

// Helper function để kiểm tra nhanh
export function isMathProblem(question: string): boolean {
    const result = classifyQuestion(question);
    return result.type === 'solve' && result.confidence > 0.5;
}

export function isExplanation(question: string): boolean {
    const result = classifyQuestion(question);
    return result.type === 'explain' && result.confidence > 0.4;
}