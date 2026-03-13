/**
 * Type definitions cho Ollama AI
 */

export interface OllamaResponse {
    success: boolean;
    text?: string;
    error?: string;
    errorCode?: string;
    fallbackResponse?: string;
    metrics?: {
        totalDuration: number;    // Tổng thời gian xử lý
        loadDuration: number;     // Thời gian load model
        promptEvalCount: number;  // Số tokens prompt
        evalCount: number;        // Số tokens response
    };
}

export interface ExerciseData {
    problem: string;
    solution: string;
    formulasUsed: string[];
    hints: string[];
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface GradingResult {
    score: number;
    correctParts: string[];
    incorrectParts: Array<{
        part: string;
        reason: string;
    }>;
    feedback: string;
    modelSolution: string;
}

export interface ProgressAnalysis {
    overview: string;
    strengths: string[];
    weaknesses: string[];
    studyPlan?: Array<{
        topic: string;
        time: string;
        resources: string[];
    }>;
    weekGoal?: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface PhysicsTopic {
    id: string;
    name: string;
    description: string;
    difficulty: number;
    prerequisites: string[];
    formulas: string[];
    commonMistakes: string[];
}

// Thêm types cho Ollama
export interface OllamaModelInfo {
    name: string;
    modified_at: string;
    size: number;
    digest: string;
    details?: {
        format: string;
        family: string;
        families: string[];
        parameter_size: string;
        quantization_level: string;
    };
}

export interface OllamaGenerateOptions {
    model: string;
    prompt: string;
    system?: string;
    template?: string;
    context?: number[];
    options?: {
        num_predict?: number;
        temperature?: number;
        top_p?: number;
        top_k?: number;
        stop?: string[];
    };
}

export interface RAGDocument {
    id: string;
    content: string;
    metadata: {
        lesson: string;
        topic: string;
        difficulty?: string;
    };
    embedding?: number[];
}