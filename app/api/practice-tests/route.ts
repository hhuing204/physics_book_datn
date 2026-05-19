import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Exercise from '@/models/Exercise'
import ExerciseBlueprint from '@/models/ExerciseBlueprint'
import PracticeTest from '@/models/PracticeTest'

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const randomFloat = (min: number, max: number, decimals: number) => {
    const factor = Math.pow(10, decimals)
    const value = Math.random() * (max - min) + min
    return Math.round(value * factor) / factor
}

const generateAccessCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i += 1) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

const buildTemplate = (template: string, vars: Record<string, any>) => {
    return template.replace(/\{(\w+)\}/g, (_, name) => {
        return vars[name] != null ? String(vars[name]) : ''
    })
}

const evaluateExpression = (expression: string) => {
    try {
        const fn = new Function('return ' + expression)
        const result = fn()
        if (typeof result === 'number' && !Number.isNaN(result)) {
            return Number(result.toFixed(10))
        }
        return result
    } catch (_error) {
        return expression
    }
}

const generateBlueprintExercise = (blueprint: any, index: number) => {
    const variableValues: Record<string, any> = {}
    if (blueprint.variables && typeof blueprint.variables === 'object') {
        for (const key of Object.keys(blueprint.variables)) {
            const value = blueprint.variables[key]
            if (typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
                if (value.type === 'int') {
                    variableValues[key] = randomInt(value.min, value.max)
                } else {
                    const decimals = value.decimals ?? 2
                    variableValues[key] = randomFloat(value.min, value.max, decimals)
                }
            } else {
                variableValues[key] = value
            }
        }
    }

    const question = buildTemplate(blueprint.questionTemplate, variableValues)
    const rawAnswer = buildTemplate(blueprint.correctAnswerTemplate, variableValues)
    const evaluatedAnswer = evaluateExpression(rawAnswer)
    const correctAnswer = typeof evaluatedAnswer === 'number' ? Number(evaluatedAnswer.toFixed(2)) : evaluatedAnswer
    const result = typeof correctAnswer === 'number' ? correctAnswer : rawAnswer
    const explanation = buildTemplate(blueprint.explanationTemplate, { ...variableValues, result })

    let options: string[] | undefined
    if (blueprint.type === 'multiple-choice') {
        const answerText = String(correctAnswer)
        options = [answerText]
        while (options.length < 4) {
            const distractor = typeof correctAnswer === 'number' ? String(correctAnswer + randomInt(1, 9)) : `Sai ${options.length}`
            if (!options.includes(distractor)) {
                options.push(distractor)
            }
        }
        options = options.sort(() => Math.random() - 0.5)
    }

    return {
        id: Date.now() + index,
        chapterId: blueprint.chapterId || '',
        lessonId: blueprint.lessonId || '',
        lessonTitle: blueprint.lessonTitle || '',
        type: blueprint.type === 'calculation' ? 'calculation' : 'multiple-choice',
        question,
        options,
        correctAnswer,
        explanation,
        difficulty: blueprint.difficulty || 'basic',
        category: blueprint.category || 'Luyện tập',
    }
}

const getDefaultExerciseSelector = async (lessonId?: string, chapterId?: string) => {
    const query: any = {}
    if (lessonId) query.lessonId = lessonId
    if (chapterId && chapterId !== 'all' && !lessonId) query.chapterId = chapterId

    const exercises = await Exercise.find(query).lean()
    return exercises
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect()
        const { searchParams } = new URL(request.url)
        const accessCode = searchParams.get('accessCode')
        const lessonId = searchParams.get('lessonId')
        const chapterId = searchParams.get('chapterId')
        const defaultTest = searchParams.get('default')

        if (accessCode) {
            const test = await PracticeTest.findOne({ accessCode }).lean()
            if (!test) {
                return NextResponse.json({ success: false, message: 'Practice test not found' }, { status: 404 })
            }
            return NextResponse.json({ success: true, test })
        }

        if (defaultTest === 'true') {
            const query: any = { source: 'stored', isDefault: true }
            if (lessonId) query.lessonId = lessonId
            if (chapterId && chapterId !== 'all' && !lessonId) query.chapterId = chapterId
            if (chapterId === 'all' || (!lessonId && !chapterId)) {
                delete query.lessonId
                delete query.chapterId
            }

            let test = await PracticeTest.findOne(query).lean()
            if (test) {
                return NextResponse.json({ success: true, test })
            }

            const exercises = await getDefaultExerciseSelector(lessonId || undefined, chapterId || undefined)
            if (!exercises.length) {
                return NextResponse.json({ success: false, message: 'Không tìm thấy bài tập để tạo đề' }, { status: 404 })
            }

            const model = new PracticeTest({
                accessCode: await generateUniqueCode(),
                lessonId: lessonId || null,
                chapterId: chapterId === 'all' ? null : chapterId || null,
                timeAlloted: 30,
                source: 'stored',
                isDefault: true,
                exercises: exercises.map((exercise: any, index: number) => ({
                    id: exercise.id,
                    chapterId: exercise.chapterId,
                    lessonId: exercise.lessonId,
                    lessonTitle: exercise.lessonTitle,
                    type: exercise.type,
                    question: exercise.question,
                    options: exercise.options,
                    correctAnswer: exercise.correctAnswer,
                    explanation: exercise.explanation,
                    difficulty: exercise.difficulty,
                    category: exercise.category,
                })),
            })
            await model.save()
            test = model.toObject()
            return NextResponse.json({ success: true, test })
        }

        return NextResponse.json({ success: false, message: 'Missing query parameters' }, { status: 400 })
    } catch (error) {
        console.error('Practice test GET error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}

const generateUniqueCode = async (): Promise<string> => {
    let code = generateAccessCode()
    while (await PracticeTest.exists({ accessCode: code })) {
        code = generateAccessCode()
    }
    return code
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect()
        const body = await request.json()
        const { lessonId, chapterId, timeAlloted, source = 'stored', numQuestions = 10 } = body

        const exercises: any[] = []
        if (source === 'blueprint') {
            if (!lessonId) {
                return NextResponse.json({ success: false, message: 'lessonId is required for blueprint generation' }, { status: 400 })
            }
            const blueprints = await ExerciseBlueprint.find({ lessonId }).lean()
            if (!blueprints.length) {
                return NextResponse.json({ success: false, message: 'Không tìm thấy blueprint để tạo đề' }, { status: 404 })
            }
            for (let i = 0; i < Math.min(numQuestions, blueprints.length); i += 1) {
                const blueprint = blueprints[i % blueprints.length]
                exercises.push(generateBlueprintExercise(blueprint, i))
            }
        } else {
            const query: any = {}
            if (lessonId) query.lessonId = lessonId
            else if (chapterId && chapterId !== 'all') query.chapterId = chapterId
            const storedExercises = await Exercise.find(query).lean()
            if (!storedExercises.length) {
                return NextResponse.json({ success: false, message: 'Không tìm thấy bài tập đã lưu để tạo đề' }, { status: 404 })
            }
            const shuffled = [...storedExercises].sort(() => Math.random() - 0.5)
            for (let i = 0; i < Math.min(numQuestions, shuffled.length); i += 1) {
                const exercise = shuffled[i]
                exercises.push({
                    id: exercise.id,
                    chapterId: exercise.chapterId,
                    lessonId: exercise.lessonId,
                    lessonTitle: exercise.lessonTitle,
                    type: exercise.type,
                    question: exercise.question,
                    options: exercise.options,
                    correctAnswer: exercise.correctAnswer,
                    explanation: exercise.explanation,
                    difficulty: exercise.difficulty,
                    category: exercise.category,
                })
            }
        }

        const test = new PracticeTest({
            accessCode: await generateUniqueCode(),
            lessonId: lessonId || null,
            chapterId: chapterId === 'all' ? null : chapterId || null,
            timeAlloted: timeAlloted || 30,
            source,
            isDefault: false,
            exercises,
        })

        await test.save()
        return NextResponse.json({ success: true, test })
    } catch (error) {
        console.error('Practice test POST error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}
