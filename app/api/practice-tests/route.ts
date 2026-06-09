import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
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

const normalizeVariableName = (name: string) => {
    return name.trim().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (digit) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(digit)))
}

const buildTemplate = (template: string | string[] | undefined, vars: Record<string, any>): string => {
    if (Array.isArray(template)) {
        return template.map((item) => buildTemplate(item, vars)).join(', ')
    }

    if (typeof template !== 'string') {
        return String(template ?? '')
    }

    return template.replace(/\{([^{}]+)\}/g, (_, name) => {
        const trimmedName = name.trim()
        const directValue = vars[trimmedName]
        if (directValue != null) {
            return String(directValue)
        }

        const normalizedName = normalizeVariableName(trimmedName)
        const fallbackValue = normalizedName !== trimmedName ? vars[normalizedName] : undefined
        return fallbackValue != null ? String(fallbackValue) : ''
    })
}

const parseTheoreticalAnswers = (answerTemplate: string) => {
    const matches = answerTemplate.match(/\{[^{}]+\}/g)
    if (!matches) {
        return []
    }

    return matches.map((match) => match.replace(/[{}]/g, '').trim())
}

const getVariableEntries = (variables: any) => {
    if (!variables || typeof variables !== 'object') {
        return []
    }

    if (variables instanceof Map) {
        return Array.from(variables.entries())
    }

    return Object.entries(variables)
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

const normalizePreviewExercise = (exercise: any, index: number) => {
    return {
        id: exercise.id ?? Date.now() + index,
        chapterId: exercise.chapterId || '',
        lessonId: exercise.lessonId || '',
        lessonTitle: exercise.lessonTitle || '',
        type: exercise.type === 'fill-in' ? 'fill-in' : 'multiple-choice',
        question: exercise.question ?? '',
        options: Array.isArray(exercise.options) ? exercise.options : undefined,
        correctAnswer: String(exercise.correctAnswer ?? ''),
        explanation: exercise.explanation ?? '',
        difficulty: exercise.difficulty || 'basic',
        category: exercise.category || 'Luyện tập',
    }
}

const resolveTheoreticalOptionValues = (blueprint: any, answerTokens: string[]) => {
    const optionGroups = getVariableEntries(blueprint.variables).filter(([, value]) => Array.isArray(value))
    if (!optionGroups.length) {
        return answerTokens.map((token) => token.trim()).filter(Boolean)
    }

    return answerTokens.map((token) => {
        const trimmedToken = token.trim()
        if (!trimmedToken) {
            return ''
        }

        for (const [, optionGroup] of optionGroups) {
            const matchedOption = Array.isArray(optionGroup)
                ? optionGroup.find((option: any) => option?.name === trimmedToken)
                : null

            if (matchedOption && typeof matchedOption.value === 'string' && matchedOption.value.trim()) {
                return matchedOption.value.trim()
            }
        }

        return trimmedToken
    }).filter(Boolean)
}

const getTheoreticalOptionValues = (blueprint: any) => {
    const optionGroups = getVariableEntries(blueprint.variables).filter(([, value]) => Array.isArray(value))
    if (!optionGroups.length) {
        return undefined
    }

    const optionValues = optionGroups.flatMap(([, optionGroup]) => {
        if (!Array.isArray(optionGroup)) {
            return []
        }

        return optionGroup
            .map((option: any) => (typeof option?.value === 'string' ? option.value.trim() : ''))
            .filter(Boolean)
    })

    return optionValues.length ? optionValues : undefined
}

const createCalculationOptions = (correctAnswer: string | number) => {
    const numericAnswer = typeof correctAnswer === 'number' ? correctAnswer : Number(correctAnswer)
    if (!Number.isFinite(numericAnswer)) {
        return undefined
    }

    const decimals = Number.isInteger(numericAnswer) ? 0 : 2
    const options = [String(numericAnswer)]

    while (options.length < 4) {
        const multiplier = 0.9 + Math.random() * 0.2
        const distractorValue = Number((numericAnswer * multiplier).toFixed(decimals))
        const distractorText = String(distractorValue)

        if (distractorText !== String(numericAnswer) && !options.includes(distractorText)) {
            options.push(distractorText)
        }
    }

    return options.sort(() => Math.random() - 0.5)
}

const generateBlueprintExercise = (blueprint: any, index: number) => {
    const variableValues: Record<string, any> = {}
    const variableEntries = getVariableEntries(blueprint.variables)
    for (const [key, value] of variableEntries) {
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

    const question = buildTemplate(blueprint.questionTemplate, variableValues)
    const rawAnswer = buildTemplate(blueprint.correctAnswerTemplate, variableValues)

    let correctAnswer: string
    let result: string | number
    let options: string[] | undefined
    let exerciseType: 'multiple-choice' | 'fill-in' = 'fill-in'

    if (blueprint.type === 'theoretical') {
        const renderedAnswers = Array.isArray(blueprint.correctAnswerTemplate)
            ? blueprint.correctAnswerTemplate.map((answerTemplate: any) => buildTemplate(answerTemplate, variableValues)).filter(Boolean)
            : [buildTemplate(blueprint.correctAnswerTemplate, variableValues)].filter(Boolean)

        const parsedAnswers = renderedAnswers.length
            ? renderedAnswers
            : parseTheoreticalAnswers(rawAnswer)

        const normalizedAnswerTokens = parsedAnswers
            .flatMap((answer: string | string[]) => Array.isArray(answer) ? answer : String(answer).split(','))
            .map((token: string) => token.trim())
            .filter(Boolean)

        const resolvedAnswers = resolveTheoreticalOptionValues(blueprint, normalizedAnswerTokens)
        correctAnswer = resolvedAnswers.length ? resolvedAnswers.join(', ') : rawAnswer.trim()
        result = correctAnswer
        options = getTheoreticalOptionValues(blueprint)
        exerciseType = 'multiple-choice'
    } else if (blueprint.type === 'calculation') {
        const evaluatedAnswer = evaluateExpression(rawAnswer)
        const answerValue = typeof evaluatedAnswer === 'number' ? Number(evaluatedAnswer.toFixed(2)) : evaluatedAnswer
        correctAnswer = typeof answerValue === 'number' ? String(answerValue) : String(answerValue ?? rawAnswer)
        result = typeof answerValue === 'number' ? answerValue : rawAnswer

        const useMultipleChoice = Math.random() < 0.5
        if (useMultipleChoice && typeof answerValue === 'number' && Number.isFinite(answerValue)) {
            options = createCalculationOptions(answerValue)
            exerciseType = 'multiple-choice'
        }
    } else {
        const evaluatedAnswer = evaluateExpression(rawAnswer)
        const answerValue = typeof evaluatedAnswer === 'number' ? Number(evaluatedAnswer.toFixed(2)) : evaluatedAnswer
        correctAnswer = typeof answerValue === 'number' ? String(answerValue) : String(answerValue ?? rawAnswer)
        result = typeof answerValue === 'number' ? answerValue : rawAnswer
    }

    const explanation = buildTemplate(blueprint.explanationTemplate, { ...variableValues, result })

    return {
        id: Date.now() + index,
        chapterId: blueprint.chapterId || '',
        lessonId: blueprint.lessonId || '',
        lessonTitle: blueprint.lessonTitle || '',
        type: exerciseType,
        question,
        options,
        correctAnswer,
        explanation,
        difficulty: blueprint.difficulty || 'basic',
        category: blueprint.category || 'Luyện tập',
    }
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect()
        const { searchParams } = new URL(request.url)
        const accessCode = searchParams.get('accessCode')
        const lessonId = searchParams.get('lessonId')
        const chapterId = searchParams.get('chapterId')
        const defaultTest = searchParams.get('default')
        const listTests = searchParams.get('list')

        if (accessCode) {
            const test = await PracticeTest.findOne({ accessCode }).lean()
            if (!test) {
                return NextResponse.json({ success: false, message: 'Practice test not found' }, { status: 404 })
            }
            return NextResponse.json({ success: true, test })
        }

        if (listTests === 'true') {
            const query: any = {}
            if (lessonId) {
                query.lessonId = lessonId
            } else if (chapterId && chapterId !== 'all') {
                query.chapterId = chapterId
            }
            const tests = await PracticeTest.find(query).sort({ createdAt: -1 }).limit(20).lean()
            return NextResponse.json({ success: true, tests })
        }

        if (defaultTest === 'true') {
            const blueprintQuery: any = {}
            if (lessonId) {
                blueprintQuery.lessonId = lessonId
            } else if (chapterId && chapterId !== 'all') {
                blueprintQuery.chapterId = chapterId
            }
            const blueprints = await ExerciseBlueprint.find(blueprintQuery).lean()
            if (!blueprints.length) {
                return NextResponse.json({ success: false, message: 'Không tìm thấy blueprint để tạo đề' }, { status: 404 })
            }

            const exercises = blueprints.map((blueprint: any, index: number) => generateBlueprintExercise(blueprint, index))

            const model = new PracticeTest({
                accessCode: await generateUniqueCode(),
                lessonId: lessonId || null,
                chapterId: chapterId === 'all' ? null : chapterId || null,
                timeAlloted: 30,
                exercises,
            })
            await model.save()
            const test = model.toObject()
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
        const { lessonId, chapterId, timeAlloted, numQuestions = 10, blueprintIds, previewOnly = false, previewExercises } = body

        if (Array.isArray(previewExercises) && previewExercises.length) {
            const exercises = previewExercises.map((exercise: any, index: number) => normalizePreviewExercise(exercise, index))
            if (previewOnly) {
                return NextResponse.json({ success: true, exercises })
            }

            const test = new PracticeTest({
                accessCode: await generateUniqueCode(),
                lessonId: lessonId || null,
                chapterId: chapterId === 'all' ? null : chapterId || null,
                timeAlloted: timeAlloted || 30,
                exercises,
            })

            await test.save()
            return NextResponse.json({ success: true, test })
        }

        const blueprintQuery: any = {}
        if (lessonId) {
            blueprintQuery.lessonId = lessonId
        } else if (chapterId && chapterId !== 'all') {
            blueprintQuery.chapterId = chapterId
        }

        const difficulty = body.difficulty
        if (difficulty && difficulty !== 'all') {
            blueprintQuery.difficulty = difficulty
        }

        let blueprints = await ExerciseBlueprint.find(blueprintQuery).lean()
        if (Array.isArray(blueprintIds) && blueprintIds.length) {
            blueprints = await ExerciseBlueprint.find({ id: { $in: blueprintIds.map(Number) } }).lean()
        }

        if (!blueprints.length) {
            return NextResponse.json({ success: false, message: 'Không tìm thấy blueprint để tạo đề' }, { status: 404 })
        }

        const exercises: any[] = []
        const shuffledBlueprints = [...blueprints].sort(() => Math.random() - 0.5)
        for (let i = 0; i < Math.min(numQuestions, shuffledBlueprints.length); i += 1) {
            const blueprint = shuffledBlueprints[i % shuffledBlueprints.length]
            exercises.push(generateBlueprintExercise(blueprint, i))
        }

        if (previewOnly) {
            return NextResponse.json({ success: true, exercises })
        }

        const test = new PracticeTest({
            accessCode: await generateUniqueCode(),
            lessonId: lessonId || null,
            chapterId: chapterId === 'all' ? null : chapterId || null,
            timeAlloted: timeAlloted || 30,
            exercises,
        })

        await test.save()
        return NextResponse.json({ success: true, test })
    } catch (error) {
        console.error('Practice test POST error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}