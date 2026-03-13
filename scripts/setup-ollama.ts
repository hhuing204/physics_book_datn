/**
 * Script setup Ollama - Chạy lần đầu
 * node scripts/setup-ollama.js
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { ollamaConfig, checkOllamaConnection } from '@/lib/ollama/config';

const execAsync = promisify(exec);

async function setupOllama() {
    console.log('🔧 Setting up Ollama for Physics 11...');

    // 1. Kiểm tra Ollama đã chạy chưa
    console.log('\n📡 Checking Ollama connection...');
    const connected = await checkOllamaConnection();

    if (!connected) {
        console.error('❌ Ollama is not running!');
        console.log('\nPlease start Ollama first:');
        console.log('  ollama serve');
        console.log('\nOr install Ollama from: https://ollama.com');
        process.exit(1);
    }

    console.log('✅ Ollama is running!');

    // 2. Pull các model cần thiết
    const models = [
        ollamaConfig.defaultModel,
        ollamaConfig.visionModel,
        ollamaConfig.embeddingModel
    ].filter((v, i, a) => a.indexOf(v) === i); // Unique

    console.log('\n📥 Pulling required models...');

    for (const model of models) {
        console.log(`\n  Pulling ${model}...`);
        try {
            const { stdout, stderr } = await execAsync(`ollama pull ${model}`);
            if (stderr) console.warn(`  ⚠️  ${stderr}`);
            console.log(`  ✅ ${model} ready`);
        } catch (error) {
            console.error(`  ❌ Failed to pull ${model}:`, error);
        }
    }

    console.log('\n🎉 Setup complete!');
    console.log('\nAvailable models:');
    const { stdout } = await execAsync('ollama list');
    console.log(stdout);
}

setupOllama();