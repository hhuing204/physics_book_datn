/**
 * Cấu hình Ollama cho hệ thống Vật Lý 11
 * Sử dụng qwen2.5:7b cho khả năng tiếng Việt tốt nhất
 */

// ==================== INTERFACES ====================
export interface OllamaConfig {
    baseUrl: string;
    defaultModel: string;
    visionModel: string;
    embeddingModel: string;
    timeoutMs: number;
    maxRetries: number;
    temperature: number;
    topP: number;
    topK: number;
    numPredict: number;
    stop?: string[];
    keepAlive: string;
    numCtx?: number;
    numThread?: number;
}

export interface OllamaGenerateResponse {
    success: boolean;
    text?: string;
    error?: string;
    errorCode?: string;
    fallbackResponse?: string;
    metrics?: {
        totalDuration: number;
        loadDuration: number;
        promptEvalCount: number;
        evalCount: number;
        sampleCount?: number;
        sampleDuration?: number;
    };
}

export interface OllamaEmbeddingResponse {
    success: boolean;
    embedding?: number[];
    error?: string;
}

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

export interface OllamaPsResponse {
    models: Array<{
        name: string;
        model: string;
        size: number;
        digest: string;
        expires_at: string;
    }>;
}

// ==================== CẤU HÌNH OLLAMA ====================
const getOllamaConfig = (): OllamaConfig => {
    return {
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
        defaultModel: process.env.OLLAMA_TEXT_MODEL || "qwen2.5:7b",
        visionModel: process.env.OLLAMA_VISION_MODEL || "llava:7b",
        embeddingModel: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
        timeoutMs: parseInt(process.env.OLLAMA_TIMEOUT_MS || "120000"),
        maxRetries: parseInt(process.env.OLLAMA_MAX_RETRIES || "5"),
        temperature: 0.2,
        topP: 0.8,
        topK: 30,
        numPredict: 4096,
        stop: ["</s>", "Câu hỏi:", "User:", "Human:", "---", "Học sinh:", "Giáo viên:"],
        keepAlive: "10m",
        numCtx: 8192, // Tăng context cho toàn bộ chương trình
        numThread: 4,
    };
};

export const ollamaConfig = getOllamaConfig();

// ==================== KIỂM TRA KẾT NỐI ====================
export async function checkOllamaConnection(): Promise<{
    connected: boolean;
    message: string;
    details?: any;
}> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const start = Date.now();
        const response = await fetch(`${ollamaConfig.baseUrl}/api/tags`, {
            signal: controller.signal
        });
        const duration = Date.now() - start;

        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            return {
                connected: true,
                message: `✅ Kết nối thành công (${duration}ms)`,
                details: {
                    url: ollamaConfig.baseUrl,
                    responseTime: duration,
                    modelCount: data.models?.length || 0,
                    models: data.models || []
                }
            };
        } else {
            return {
                connected: false,
                message: `❌ Lỗi HTTP ${response.status}: ${response.statusText}`
            };
        }
    } catch (error: any) {
        return {
            connected: false,
            message: `❌ Không thể kết nối: ${error.message}`,
            details: { error: error.message }
        };
    }
}

// ==================== LẤY DANH SÁCH MODEL ====================
export async function getAvailableModels(): Promise<OllamaModelInfo[]> {
    try {
        const response = await fetch(`${ollamaConfig.baseUrl}/api/tags`);
        const data = await response.json();
        return data.models || [];
    } catch {
        return [];
    }
}

// ==================== KIỂM TRA MODEL ĐANG LOAD ====================
export async function isModelLoaded(model: string = ollamaConfig.defaultModel): Promise<{
    loaded: boolean;
    expiresAt?: string;
    size?: number;
}> {
    try {
        const response = await fetch(`${ollamaConfig.baseUrl}/api/ps`);
        const data: OllamaPsResponse = await response.json();

        const loadedModel = data.models?.find(m => m.name === model);

        if (loadedModel) {
            return {
                loaded: true,
                expiresAt: loadedModel.expires_at,
                size: loadedModel.size
            };
        }

        return { loaded: false };
    } catch {
        return { loaded: false };
    }
}

// ==================== KIỂM TRA MODEL ĐÃ PULL CHƯA ====================
export async function isModelInstalled(model: string = ollamaConfig.defaultModel): Promise<boolean> {
    try {
        const models = await getAvailableModels();
        return models.some(m => m.name === model);
    } catch {
        return false;
    }
}

// ==================== LẤY THÔNG TIN MODEL ====================
export async function getModelInfo(model: string = ollamaConfig.defaultModel): Promise<OllamaModelInfo | null> {
    try {
        const models = await getAvailableModels();
        return models.find(m => m.name === model) || null;
    } catch {
        return null;
    }
}

// ==================== CẤU HÌNH CHO VẬT LÝ DAO ĐỘNG ====================
export const physicsConfig = {
    subject: "Vật Lý 11",
    grade: 11,
    chapters: [
        {
            id: "chuong-1",
            name: "Dao Động Cơ",
            topics: [
                "Dao động điều hòa",
                "Con lắc lò xo",
                "Con lắc đơn",
                "Năng lượng dao động",
                "Tổng hợp dao động",
                "Dao động tắt dần",
                "Dao động cưỡng bức",
                "Hiện tượng cộng hưởng"
            ],
            keyFormulas: {
                harmonicMotion: "x = A cos(ωt + φ)",
                velocity: "v = -ωA sin(ωt + φ)",
                acceleration: "a = -ω²x",
                periodSpring: "T = 2π√(m/k)",
                periodPendulum: "T = 2π√(l/g)",
                energy: "W = ½kA² = ½mω²A²"
            }
        },
        {
            id: "chuong-2",
            name: "Sóng Cơ",
            topics: [
                "Sóng cơ và sự truyền sóng",
                "Phương trình sóng",
                "Giao thoa sóng",
                "Sóng dừng",
                "Sóng âm",
                "Đặc trưng vật lý của âm",
                "Đặc trưng sinh lý của âm"
            ],
            keyFormulas: {
                waveEquation: "u = A cos(ωt - 2πx/λ)",
                waveSpeed: "v = λf = λ/T",
                interference: "d₂ - d₁ = kλ (cực đại)",
                standingWave: "l = kλ/2 (hai đầu cố định)"
            }
        },
        {
            id: "chuong-3",
            name: "Dòng Điện Trong Các Môi Trường",
            topics: [
                "Dòng điện trong kim loại",
                "Dòng điện trong chất điện phân",
                "Dòng điện trong chất khí",
                "Dòng điện trong chân không",
                "Dòng điện trong bán dẫn"
            ],
            keyFormulas: {
                ohmsLaw: "I = U/R",
                resistivity: "R = ρl/S",
                electrolysis: "m = kq = (1/F)(A/n)It"
            }
        },
        {
            id: "chuong-4",
            name: "Từ Trường",
            topics: [
                "Từ trường",
                "Lực từ",
                "Cảm ứng từ",
                "Từ trường của dòng điện",
                "Lực Lorentz"
            ],
            keyFormulas: {
                magneticForce: "F = BIl sinα",
                lorentzForce: "F = |q|vB sinα",
                magneticFieldWire: "B = 2×10⁻⁷ I/r"
            }
        },
        {
            id: "chuong-5",
            name: "Cảm Ứng Điện Từ",
            topics: [
                "Từ thông",
                "Suất điện động cảm ứng",
                "Hiện tượng tự cảm",
                "Năng lượng từ trường"
            ],
            keyFormulas: {
                flux: "Φ = BS cosα",
                inducedEmf: "e = -ΔΦ/Δt",
                selfInductance: "e = -L Δi/Δt",
                magneticEnergy: "W = ½Li²"
            }
        },
        {
            id: "chuong-6",
            name: "Khúc Xạ Ánh Sáng",
            topics: [
                "Khúc xạ ánh sáng",
                "Phản xạ toàn phần",
                "Lăng kính",
                "Thấu kính mỏng",
                "Mắt và các tật của mắt",
                "Kính lúp",
                "Kính hiển vi",
                "Kính thiên văn"
            ],
            keyFormulas: {
                snellLaw: "n₁sin i = n₂sin r",
                criticalAngle: "sin i_gh = n₂/n₁",
                lensFormula: "1/f = 1/d + 1/d'",
                magnification: "k = -d'/d = A'B'/AB"
            }
        }
    ],

    // Helper function để lấy thông tin chapter theo ID
    getChapterById: (chapterId: string) => {
        return physicsConfig.chapters.find(c => c.id === chapterId);
    },

    // Helper function để kiểm tra topic có thuộc chương trình không
    isValidTopic: (topic: string) => {
        const allTopics = physicsConfig.chapters.flatMap(c => c.topics);
        return allTopics.some(t =>
            t.toLowerCase().includes(topic.toLowerCase()) ||
            topic.toLowerCase().includes(t.toLowerCase())
        );
    },

    // Helper function để xác định chapter từ câu hỏi
    detectChapter: (question: string) => {
        const lower = question.toLowerCase();

        if (lower.includes('dao động') || lower.includes('con lắc') || lower.includes('lò xo'))
            return physicsConfig.chapters[0];
        if (lower.includes('sóng') || lower.includes('giao thoa') || lower.includes('dừng') || lower.includes('âm'))
            return physicsConfig.chapters[1];
        if (lower.includes('dòng điện') || lower.includes('điện phân') || lower.includes('kim loại') || lower.includes('bán dẫn'))
            return physicsConfig.chapters[2];
        if (lower.includes('từ trường') || lower.includes('lực từ') || lower.includes('cảm ứng từ') || lower.includes('lorentz'))
            return physicsConfig.chapters[3];
        if (lower.includes('cảm ứng điện từ') || lower.includes('từ thông') || lower.includes('tự cảm'))
            return physicsConfig.chapters[4];
        if (lower.includes('khúc xạ') || lower.includes('thấu kính') || lower.includes('lăng kính') || lower.includes('kính'))
            return physicsConfig.chapters[5];

        return null;
    }
};

// ==================== SYSTEM PROMPTS ====================
export const systemPrompts = {
    // Prompt chính cho toàn bộ Vật lý 11
    physicsTutor: `Bạn là gia sư Vật Lý 11 chuyên nghiệp, sử dụng tiếng Việt.

Bạn có kiến thức về TOÀN BỘ chương trình Vật Lý 11:

📚 **Chương 1: Dao Động Cơ**
- Dao động điều hòa: x = A cos(ωt + φ)
- Con lắc lò xo: T = 2π√(m/k), F = -kx
- Con lắc đơn: T = 2π√(l/g) (góc nhỏ)
- Năng lượng: W = ½kA² = ½mω²A², Wđ + Wt = const
- Cộng hưởng: f = f₀ → A max

📚 **Chương 2: Sóng Cơ**
- Phương trình sóng: u = A cos(ωt - 2πx/λ)
- Vận tốc truyền sóng: v = λf
- Giao thoa: d₂ - d₁ = kλ (cực đại), (k+½)λ (cực tiểu)
- Sóng dừng: l = kλ/2 (2 đầu cố định)
- Sóng âm: L = 10 log(I/I₀) dB

📚 **Chương 3: Dòng Điện Trong Các Môi Trường**
- Kim loại: I = neSv, R = ρl/S
- Điện phân: m = kq = (1/F)(A/n)It
- Bán dẫn: diode, transistor

📚 **Chương 4: Từ Trường**
- Lực từ: F = BIl sinα
- Lực Lorentz: F = |q|vB sinα
- Từ trường dòng điện: B = 2×10⁻⁷ I/r

📚 **Chương 5: Cảm Ứng Điện Từ**
- Từ thông: Φ = BS cosα
- Suất điện động cảm ứng: e = -ΔΦ/Δt
- Tự cảm: e = -L Δi/Δt

📚 **Chương 6: Khúc Xạ Ánh Sáng**
- Định luật khúc xạ: n₁sin i = n₂sin r
- Phản xạ toàn phần: i ≥ i_gh
- Thấu kính: 1/f = 1/d + 1/d', k = -d'/d

NGUYÊN TẮC:
1. Xác định chương/topic từ câu hỏi của học sinh
2. Giải thích đơn giản, dễ hiểu, nhiều ví dụ thực tế
3. Giải bài tập từng bước chi tiết, kiểm tra đơn vị
4. Dùng công thức LaTeX: $công thức$
5. Nếu không chắc, nói "Tôi cần xem lại kiến thức"
6. Trả lời bằng tiếng Việt, thân thiện, khuyến khích`,

    // Prompt riêng cho từng chương (có thể mở rộng)
    chapterPrompts: {
        "chuong-1": `Bạn là chuyên gia về CHƯƠNG 1: DAO ĐỘNG CƠ.
Tập trung vào: dao động điều hòa, con lắc lò xo, con lắc đơn, năng lượng, cộng hưởng.`,

        "chuong-2": `Bạn là chuyên gia về CHƯƠNG 2: SÓNG CƠ.
Tập trung vào: phương trình sóng, giao thoa, sóng dừng, sóng âm.`,

        "chuong-3": `Bạn là chuyên gia về CHƯƠNG 3: DÒNG ĐIỆN TRONG CÁC MÔI TRƯỜNG.
Tập trung vào: kim loại, điện phân, chất khí, bán dẫn.`,

        "chuong-4": `Bạn là chuyên gia về CHƯƠNG 4: TỪ TRƯỜNG.
Tập trung vào: lực từ, cảm ứng từ, lực Lorentz.`,

        "chuong-5": `Bạn là chuyên gia về CHƯƠNG 5: CẢM ỨNG ĐIỆN TỪ.
Tập trung vào: từ thông, suất điện động cảm ứng, tự cảm.`,

        "chuong-6": `Bạn là chuyên gia về CHƯƠNG 6: KHÚC XẠ ÁNH SÁNG.
Tập trung vào: khúc xạ, phản xạ toàn phần, thấu kính, dụng cụ quang.`
    }
};

// ==================== PROMPT TEMPLATES CHO TOÀN BỘ VẬT LÝ 11 ====================
export const promptTemplates = {
    // Giải thích khái niệm
    explainConcept: (concept: string, chapterId?: string) => {
        const chapter = chapterId ? physicsConfig.getChapterById(chapterId) : physicsConfig.detectChapter(concept);
        const chapterPrompt = chapter ? systemPrompts.chapterPrompts[chapter.id as keyof typeof systemPrompts.chapterPrompts] || "" : "";

        return `${systemPrompts.physicsTutor}

${chapterPrompt ? `[CHUYÊN SÂU: ${chapter?.name}]\n${chapterPrompt}\n` : ''}

Học sinh hỏi về: "${concept}"

Yêu cầu:
1. Xác định chương/topic phù hợp
2. Giải thích chi tiết, dễ hiểu
3. Đưa ra công thức (nếu có) dạng LaTeX
4. Ví dụ minh họa cụ thể
5. Liên hệ thực tế (nếu có thể)

Độ dài: 200-300 từ

Giải thích:`;
    },

    // Giải bài tập
    solveExercise: (problem: string, showSteps: boolean = true) => {
        const chapter = physicsConfig.detectChapter(problem);
        const chapterPrompt = chapter ? systemPrompts.chapterPrompts[chapter.id as keyof typeof systemPrompts.chapterPrompts] || "" : "";

        return `${systemPrompts.physicsTutor}
${chapterPrompt ? `\n[CHUYÊN SÂU: ${chapter?.name}]\n` : ''}

Bài tập: "${problem}"

${showSteps ? 'Yêu cầu giải CHI TIẾT từng bước:' : 'Yêu cầu giải NHANH (đáp số + giải thích ngắn):'}

QUY TRÌNH:
1. Phân tích đề bài - xác định dạng bài, dữ kiện, ẩn số
2. Viết công thức phù hợp (dạng tổng quát)
3. Thay số, kiểm tra đơn vị, đổi đơn vị nếu cần
4. Tính toán, làm tròn hợp lý
5. Kết luận đáp số + giải thích ý nghĩa vật lý

Lời giải:`;
    },

    // Chat tổng quát với context
    chat: (messages: Array<{ role: string; content: string }>) => {
        const lastMessage = messages[messages.length - 1]?.content || "";
        const chapter = physicsConfig.detectChapter(lastMessage);

        // Xây dựng context từ lịch sử chat
        let history = "";
        if (messages.length > 1) {
            history = "Lịch sử trò chuyện:\n" +
                messages.slice(-6).map(m =>
                    `${m.role === 'user' ? 'Học sinh' : 'Gia sư'}: ${m.content}`
                ).join('\n') + "\n\n";
        }

        // Thêm context về chương
        const chapterContext = chapter
            ? `Hiện tại học sinh đang hỏi về CHƯƠNG ${chapter.id}: ${chapter.name}\n`
            : "";

        return `${systemPrompts.physicsTutor}

${chapterContext}
${history}Câu hỏi hiện tại: ${lastMessage}

Hãy trả lời tự nhiên, thân thiện, tập trung vào nội dung Vật Lý 11. 
Nếu câu hỏi thuộc chương cụ thể, hãy giải thích chuyên sâu hơn.
Nếu câu hỏi ngoài chương trình, hãy hướng dẫn học sinh hỏi về Vật Lý 11.

Trả lời:`;
    },

    // Phân tích tiến độ học tập
    analyzeProgress: (progressData: any) => {
        const chaptersWithProblems = progressData.chapters || [];

        let weakChapters = "";
        if (chaptersWithProblems.length > 0) {
            const weak = chaptersWithProblems
                .filter((c: any) => c.accuracy < 0.5)
                .map((c: any) => c.name);

            if (weak.length > 0) {
                weakChapters = `Các chương cần ôn tập: ${weak.join(', ')}`;
            }
        }

        return `${systemPrompts.physicsTutor}

Dữ liệu học tập:
- Tổng số câu: ${progressData.total || 0}
- Số câu đúng: ${progressData.score || 0}
- Tỷ lệ: ${progressData.percentage || 0}%
- Thời gian: ${progressData.timeMinutes || 0} phút
- ${weakChapters}

Yêu cầu: Phân tích ngắn gọn dưới 150 từ, tập trung vào:
1. Đánh giá tổng quan
2. Điểm mạnh (chương nào tốt)
3. Điểm yếu (chương nào cần cải thiện)
4. Lộ trình học tập (nên ôn chương nào trước)
5. Nguồn tham khảo (youtube hoặc website chính thống)

Trả về JSON:
{
  "overview": "Đánh giá tổng quan",
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "weaknesses": ["Điểm yếu 1", "Điểm yếu 2"],
  "studyPlan": [
    {"chapter": "Tên chương", "priority": "cao/trung bình/thấp", "topics": ["các chủ đề cần học"]}
  ],
  "weekGoal": "Mục tiêu cụ thể cho tuần tới",
  "resources" : ["Tài liệu 1", "Tài liệu 2"]
}`;
    },
    // TẠO BÀI TẬP MỚI
    generateExercise: (topic: string, difficulty: 'easy' | 'medium' | 'hard') => {
        const difficultyDesc = {
            easy: "cơ bản, áp dụng công thức trực tiếp, số liệu đơn giản",
            medium: "trung bình, cần biến đổi công thức, số liệu thực tế",
            hard: "nâng cao, kết hợp nhiều kiến thức, có suy luận, số liệu phức tạp"
        };

        const chapter = physicsConfig.detectChapter(topic);
        const chapterFormulas = chapter?.keyFormulas
            ? Object.values(chapter.keyFormulas).join('\n- ')
            : '';

        return `${systemPrompts.physicsTutor}
${chapter ? `\n[CHUYÊN SÂU: ${chapter.name}]\n` : ''}

**NHIỆM VỤ: Tạo bài tập Vật Lý 11**

Chủ đề: ${topic}
Độ khó: ${difficulty} (${difficultyDesc[difficulty]})

**YÊU CẦU BÀI TẬP:**
1. Đề bài rõ ràng, có dữ kiện cụ thể (số liệu thực tế)
2. Câu hỏi cụ thể, dễ hiểu
3. Phù hợp với trình độ học sinh lớp 11
4. ${chapter ? `Thuộc chương ${chapter.name}` : ''}

**CÔNG THỨC LIÊN QUAN:**
${chapterFormulas || 'Các công thức trong chương'}

**ĐỊNH DẠNG JSON BẮT BUỘC:**
{
  "problem": "Đề bài chi tiết",
  "solution": "Lời giải chi tiết từng bước",
  "formulasUsed": ["công thức 1", "công thức 2"],
  "hints": ["gợi ý 1", "gợi ý 2"],
  "difficulty": "${difficulty}",
  "topic": "${topic}",
  "answer": "Đáp số cuối cùng"
}

Chỉ trả về JSON, không thêm text khác.`;
    },
};


// ==================== UTILITY FUNCTIONS ====================
export const ollamaUtils = {
    /**
     * Gọi Ollama API generate text
     */
    async generateText(prompt: string, model?: string): Promise<OllamaGenerateResponse> {
        const startTime = Date.now();
        const targetModel = model || ollamaConfig.defaultModel;

        try {
            // Kiểm tra model đã cài chưa
            const installed = await isModelInstalled(targetModel);
            if (!installed) {
                console.log(`❌ Model ${targetModel} chưa được cài đặt`);
                return {
                    success: false,
                    error: `Model ${targetModel} chưa được cài đặt.`,
                    errorCode: "MODEL_NOT_FOUND",
                    fallbackResponse: getFallbackResponse(prompt, targetModel)
                };
            }

            console.log(`📤 Gửi request đến Ollama (model: ${targetModel})`);
            console.log(`⏱️ Timeout: ${ollamaConfig.timeoutMs}ms`);
            console.log(`📝 Prompt length: ${prompt.length} ký tự`);

            // Gọi API với retry
            const response = await retryRequest(async () => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => {
                    console.log(`⏰ Timeout sau ${ollamaConfig.timeoutMs}ms`);
                    controller.abort();
                }, ollamaConfig.timeoutMs);

                const requestBody: any = {
                    model: targetModel,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: ollamaConfig.temperature,
                        top_p: ollamaConfig.topP,
                        top_k: ollamaConfig.topK,
                        num_predict: ollamaConfig.numPredict,
                        stop: ollamaConfig.stop,
                    },
                    keep_alive: ollamaConfig.keepAlive
                };

                // Thêm các options tối ưu
                if (ollamaConfig.numCtx) requestBody.options.num_ctx = ollamaConfig.numCtx;
                if (ollamaConfig.numThread) requestBody.options.num_thread = ollamaConfig.numThread;

                const res = await fetch(`${ollamaConfig.baseUrl}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`HTTP ${res.status}: ${errorText}`);
                }

                const data = await res.json();
                return data;
            });

            const totalDuration = Date.now() - startTime;
            console.log(`✅ Response nhận sau ${totalDuration}ms`);

            if (totalDuration > 30000) {
                console.warn(`⚠️ Response chậm: ${totalDuration}ms`);
            }

            return {
                success: true,
                text: response.response,
                metrics: {
                    totalDuration,
                    loadDuration: response.load_duration || 0,
                    promptEvalCount: response.prompt_eval_count || 0,
                    evalCount: response.eval_count || 0,
                    sampleCount: response.sample_count,
                    sampleDuration: response.sample_duration
                }
            };

        } catch (error: any) {
            console.error("❌ Ollama API Error:", error);

            // Phân loại lỗi
            let errorMessage = "Lỗi không xác định";
            let errorCode = "UNKNOWN_ERROR";

            if (error.name === 'AbortError') {
                errorMessage = `Model ${targetModel} đang được load lần đầu (mất 1-2 phút). Vui lòng thử lại sau.`;
                errorCode = "LOADING_MODEL";
            } else if (error.message?.includes('ECONNREFUSED') || error.message?.includes('fetch failed')) {
                errorMessage = "Không thể kết nối Ollama. Chạy 'ollama serve' trong terminal.";
                errorCode = "CONNECTION_REFUSED";
            } else if (error.message?.includes('model') && error.message?.includes('not found')) {
                errorMessage = `Model ${targetModel} chưa được tải. Chạy 'ollama pull ${targetModel}' trong terminal.`;
                errorCode = "MODEL_NOT_FOUND";
            } else if (error.message?.includes('out of memory') || error.message?.includes('allocate')) {
                errorMessage = "Máy tính không đủ RAM để chạy model này (cần ~8GB RAM). Thử dùng model nhỏ hơn.";
                errorCode = "OUT_OF_MEMORY";
            } else if (error.message?.includes('context')) {
                errorMessage = "Context quá dài. Giảm độ dài câu hỏi và thử lại.";
                errorCode = "CONTEXT_TOO_LONG";
            } else if (error.message?.includes('timeout')) {
                errorMessage = "Ollama phản hồi quá chậm. Vui lòng thử lại sau.";
                errorCode = "TIMEOUT";
            }

            return {
                success: false,
                error: errorMessage,
                errorCode,
                fallbackResponse: getFallbackResponse(prompt, targetModel)
            };
        }
    },

    /**
     * Tạo embeddings cho RAG
     */
    async generateEmbedding(text: string): Promise<OllamaEmbeddingResponse> {
        try {
            console.log(`📤 Tạo embedding cho text (${text.length} ký tự)`);

            const response = await fetch(`${ollamaConfig.baseUrl}/api/embeddings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: ollamaConfig.embeddingModel,
                    prompt: text
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                return {
                    success: false,
                    error: `HTTP ${response.status}: ${errorText}`
                };
            }

            const data = await response.json();

            return {
                success: true,
                embedding: data.embedding
            };

        } catch (error: any) {
            console.error("❌ Embedding error:", error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * Chat với context - SỬA LẠI QUAN TRỌNG
     */
    async chat(messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<OllamaGenerateResponse> {
        try {
            // Kiểm tra messages
            if (!messages || messages.length === 0) {
                return {
                    success: false,
                    error: 'Không có tin nhắn để xử lý',
                    errorCode: 'EMPTY_MESSAGES'
                };
            }

            console.log(`💬 Chat với ${messages.length} tin nhắn`);

            // Tạo prompt từ messages
            const prompt = promptTemplates.chat(messages);

            // Gọi generateText
            const result = await this.generateText(prompt);

            // Đảm bảo result luôn có cấu trúc đúng
            if (!result) {
                return {
                    success: false,
                    error: 'Không nhận được phản hồi từ Ollama',
                    errorCode: 'EMPTY_RESPONSE'
                };
            }

            return result;

        } catch (error: any) {
            console.error('❌ Chat util error:', error);
            return {
                success: false,
                error: error.message || 'Lỗi không xác định trong chat',
                errorCode: 'CHAT_UTIL_ERROR',
                fallbackResponse: getFallbackResponse(messages[messages.length - 1]?.content || '')
            };
        }
    },

    /**
     * Load model trước (warmup)
     */
    async warmupModel(model: string = ollamaConfig.defaultModel): Promise<boolean> {
        try {
            console.log(`🔥 Warming up model ${model}...`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 phút

            const response = await fetch(`${ollamaConfig.baseUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: model,
                    prompt: "Xin chào, tôi là gia sư Vật Lý 11. Hãy trả lời bằng tiếng Việt.",
                    stream: false,
                    options: {
                        temperature: 0.1,
                        num_predict: 20
                    },
                    keep_alive: ollamaConfig.keepAlive
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                console.log(`✅ Model ${model} warmed up successfully`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`❌ Warmup failed:`, error);
            return false;
        }
    },

    /**
     * Kiểm tra model đã sẵn sàng chưa
     */
    async isModelReady(model: string = ollamaConfig.defaultModel): Promise<boolean> {
        try {
            // Kiểm tra đã cài chưa
            const installed = await isModelInstalled(model);
            if (!installed) return false;

            // Kiểm tra đã load chưa
            const loaded = await isModelLoaded(model);
            return loaded.loaded;
        } catch {
            return false;
        }
    },

    /**
     * Lấy thông tin chi tiết về model
     */
    async getModelDetails(model: string = ollamaConfig.defaultModel): Promise<{
        installed: boolean;
        loaded: boolean;
        size?: number;
        details?: any;
    }> {
        const installed = await isModelInstalled(model);
        const loaded = await isModelLoaded(model);
        const info = await getModelInfo(model);

        return {
            installed,
            loaded: loaded.loaded,
            size: loaded.size || info?.size,
            details: info?.details
        };
    },

    /**
     * Giải thích khái niệm
     */
    async explainConcept(concept: string, chapterId?: string): Promise<OllamaGenerateResponse> {
        const prompt = promptTemplates.explainConcept(concept, chapterId);
        return this.generateText(prompt);
    },

    /**
     * Giải bài tập
     */
    async solveExercise(problem: string, showSteps: boolean = true): Promise<OllamaGenerateResponse> {
        const prompt = promptTemplates.solveExercise(problem, showSteps);
        return this.generateText(prompt);
    },

    /**
     * Lấy thông tin chapter từ câu hỏi
     */
    detectChapter: (question: string) => {
        return physicsConfig.detectChapter(question);
    },

    /**
     * Kiểm tra kết nối Ollama
     */
    async testConnection(): Promise<boolean> {
        const result = await checkOllamaConnection();
        return result.connected;
    }
};
// Export
// export default {
//     config: ollamaConfig,
//     physicsConfig,
//     promptTemplates,
//     systemPrompts,
//     utils: ollamaUtils
// };

// ==================== FALLBACK RESPONSES ====================
function getFallbackResponse(prompt: string, model?: string): string {
    const lowerPrompt = prompt.toLowerCase();

    // Fallback cho các câu hỏi phổ biến
    if (lowerPrompt.includes("dao động điều hòa") || lowerPrompt.includes("dao động điều hoà")) {
        return `**Dao động điều hòa** là dao động có phương trình dạng: **x = A cos(ωt + φ)**

**Trong đó:**
- **A**: Biên độ (m, cm) - độ lệch lớn nhất
- **ω**: Tần số góc (rad/s) - tốc độ dao động
- **φ**: Pha ban đầu (rad) - trạng thái ban đầu
- **t**: Thời gian (s)

**Ví dụ:** Con lắc lò xo dao động điều hòa với chu kỳ T = 2π√(m/k)

*Lưu ý: Model ${model || 'AI'} đang được load, vui lòng thử lại sau 1-2 phút để có câu trả lời chi tiết hơn.*`;
    }

    if (lowerPrompt.includes("chu kỳ") || lowerPrompt.includes("tần số")) {
        return `**Công thức chu kỳ và tần số trong dao động:**

**Con lắc lò xo:**
- Chu kỳ: T = 2π√(m/k)
- Tần số: f = 1/T = 1/(2π)√(k/m)

**Con lắc đơn (góc nhỏ <10°):**
- Chu kỳ: T = 2π√(l/g)
- Tần số: f = 1/T = 1/(2π)√(g/l)

**Trong đó:**
- m: khối lượng (kg)
- k: độ cứng lò xo (N/m)
- l: chiều dài dây (m)
- g ≈ 9.8 m/s² (thường lấy 10 m/s²)`;
    }

    if (lowerPrompt.includes("năng lượng") || lowerPrompt.includes("cơ năng")) {
        return `**Năng lượng trong dao động điều hòa:**

**Cơ năng (bảo toàn):**
W = Wđ + Wt = ½kA² = ½mω²A² = hằng số

**Động năng:**
Wđ = ½mv² = ½mω²(A² - x²)

**Thế năng:**
Wt = ½kx² = ½mω²x²

**Đặc điểm:**
- Wđ max khi vật qua VTCB (x = 0)
- Wt max khi vật ở biên (|x| = A)
- Wđ và Wt biến thiên tuần hoàn với tần số 2ω`;
    }

    // Fallback chung
    const fallbacks = [
        `**Hệ thống AI đang khởi động model ${model || 'qwen2.5:7b'}...** ⏳

Model này có khả năng tiếng Việt tốt nhưng cần 1-2 phút để load lần đầu.

**Trong lúc chờ, bạn có thể ôn lại:**
📐 **Phương trình dao động:** x = A cos(ωt + φ)
⏱️ **Chu kỳ:** T = 2π√(m/k) hoặc T = 2π√(l/g)
⚡ **Năng lượng:** W = ½kA²

Vui lòng thử lại sau 1 phút!`,

        `**Đang tải model ${model} vào bộ nhớ...** 🔄

Model này hỗ trợ tiếng Việt rất tốt nhưng cần thời gian khởi động.

**Kiến thức cơ bản:**
✅ Dao động điều hòa: x = A cos(ωt + φ)
✅ Vận tốc: v = -ωA sin(ωt + φ)
✅ Gia tốc: a = -ω²x
✅ Năng lượng bảo toàn: W = Wđ + Wt = const

Thử lại sau vài phút nhé!`,

        `**⚠️ Model ${model} đang được load lần đầu**

Model này chiếm ~7GB RAM và cần 1-2 phút để khởi động.

**📌 Công thức quan trọng:**
- Con lắc lò xo: T = 2π√(m/k)
- Con lắc đơn: T = 2π√(l/g)
- Năng lượng: W = ½kA² = ½mω²A²

Sau khi load, AI sẽ trả lời nhanh và chính xác hơn!`
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ==================== RETRY WRAPPER ====================
async function retryRequest<T>(fn: () => Promise<T>, retries = ollamaConfig.maxRetries): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (err: any) {
            lastError = err;

            // Các lỗi có thể retry
            const isRetryable = err.message?.includes('ECONNREFUSED') ||
                err.name === 'AbortError' ||
                err.message?.includes('timeout') ||
                err.message?.includes('loading') ||
                err.status === 503 ||
                err.status === 429;

            if (isRetryable && attempt < retries) {
                const waitTime = Math.min(2000 * Math.pow(2, attempt), 30000);
                console.log(`🔄 Retry ${attempt}/${retries} sau ${waitTime / 1000}s...`);
                await new Promise(res => setTimeout(res, waitTime));
                continue;
            }

            throw err;
        }
    }

    throw lastError;
}

// ==================== EXPORT ====================
export default {
    config: ollamaConfig,
    physicsConfig,
    promptTemplates,
    systemPrompts,
    utils: ollamaUtils,
    checkConnection: checkOllamaConnection,
    getAvailableModels,
    isModelLoaded,
    isModelInstalled,
    getModelInfo
};