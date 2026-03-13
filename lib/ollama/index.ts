/**
 * Barrel exports for Ollama configuration
 */

export { default as ollamaConfig, promptTemplates, systemPrompts, physicsConfig, ollamaUtils, checkOllamaConnection, getAvailableModels } from './config';
export type {
    OllamaResponse,
    ExerciseData,
    GradingResult,
    ProgressAnalysis,
    ChatMessage,
    PhysicsTopic,
    OllamaModelInfo,
    OllamaGenerateOptions,
    RAGDocument
} from './types';