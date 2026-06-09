import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ExerciseBlueprint from '@/models/ExerciseBlueprint'
import jwt from 'jsonwebtoken'
import { normalizeBlueprintVariablesForClient, normalizeBlueprintVariablesForStorage } from '@/lib/exerciseBlueprintUtils'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function normalizeCorrectAnswerTemplate(value: any): string[] {
    if (Array.isArray(value)) {
        return value.map(v => String(v).trim()).filter(Boolean)
    }

    if (typeof value === 'string') {
        return value
            .split(',')
            .map(v => v.trim())
            .filter(Boolean)
    }

    return []
}


// Verify token and ensure the user is a Teacher
async function verifyTeacher(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        return null
    }

    const token = authHeader.substring(7)
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
        if (!decoded?.userId) return null

        await dbConnect()
        const User = (await import('@/models/User')).default
        const user = await User.findById(decoded.userId)

        if (!user) return null
        if ((user.role || '').toLowerCase() !== 'teacher') return null

        return user
    } catch {
        return null
    }
}

// GET - Fetch all exercise blueprints
export async function GET(request: NextRequest) {
    try {
        const teacher = await verifyTeacher(request)
        if (!teacher) {
            return NextResponse.json(
                { message: 'Unauthorized - Teacher access required' },
                { status: 403 }
            )
        }

        await dbConnect()

        const { searchParams } = new URL(request.url)
        const lessonId = searchParams.get('lessonId')
        const difficulty = searchParams.get('difficulty')
        const search = searchParams.get('search')

        const query: any = {}

        if (lessonId && lessonId !== 'all') {
            query.lessonId = lessonId
        }

        if (difficulty && difficulty !== 'all') {
            query.difficulty = difficulty
        }

        if (search) {
            query.$or = [
                { questionTemplate: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ]
        }

        const rawBlueprints = await ExerciseBlueprint.find(query)
            .sort({ createdAt: -1 })

        const blueprints = rawBlueprints.map(bp => {
            const obj = bp.toObject()

            return {
                ...obj,
                variables: normalizeBlueprintVariablesForClient(obj.variables),
                correctAnswerTemplate: normalizeCorrectAnswerTemplate(
                    obj.correctAnswerTemplate
                )
            }
        })

        return NextResponse.json({
            success: true,
            blueprints
        })
    } catch (error) {
        console.error('Error fetching exercise blueprints:', error)

        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            {
                status: 500
            }
        )
    }
}

// POST - Add new exercise blueprint
export async function POST(request: NextRequest) {
    try {
        const teacher = await verifyTeacher(request)
        if (!teacher) {
            return NextResponse.json(
                { message: 'Unauthorized - Teacher access required' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const {
            id,
            lessonId,
            chapterId,
            type,
            questionTemplate,
            correctAnswerTemplate,
            explanationTemplate,
            difficulty,
            category,
            variables
        } = body

        if (
            id == null ||
            !lessonId ||
            !chapterId ||
            !questionTemplate ||
            !explanationTemplate ||
            !category
        ) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            )
        }

        await dbConnect()

        const newBlueprint = new ExerciseBlueprint({
            id,
            lessonId,
            chapterId,
            type,
            questionTemplate,
            correctAnswerTemplate: normalizeCorrectAnswerTemplate(correctAnswerTemplate),
            explanationTemplate,
            difficulty,
            category,
            variables: normalizeBlueprintVariablesForStorage(variables)
        })

        await newBlueprint.save()

        return NextResponse.json({
            success: true,
            message: 'Exercise blueprint created successfully',
            blueprint: newBlueprint
        })
    } catch (error) {
        console.error('Error creating exercise blueprint:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT - Update exercise blueprint
export async function PUT(request: NextRequest) {
    try {
        const teacher = await verifyTeacher(request)
        if (!teacher) {
            return NextResponse.json(
                { message: 'Unauthorized - Teacher access required' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const {
            id,
            lessonId,
            chapterId,
            type,
            questionTemplate,
            correctAnswerTemplate,
            explanationTemplate,
            difficulty,
            category,
            variables
        } = body

        if (
            id == null ||
            !lessonId ||
            !chapterId ||
            !questionTemplate ||
            !explanationTemplate ||
            !category
        ) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            )
        }

        await dbConnect()

        const updatedBlueprint = await ExerciseBlueprint.findOneAndUpdate(
            { id },
            {
                lessonId,
                chapterId,
                type,
                questionTemplate,
                correctAnswerTemplate: normalizeCorrectAnswerTemplate(correctAnswerTemplate),
                explanationTemplate,
                difficulty,
                category,
                variables: normalizeBlueprintVariablesForStorage(variables)
            },
            { new: true }
        )

        if (!updatedBlueprint) {
            return NextResponse.json(
                { success: false, message: 'Exercise blueprint not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Exercise blueprint updated successfully',
            blueprint: updatedBlueprint
        })
    } catch (error) {
        console.error('Error updating exercise blueprint:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE - Delete exercise blueprint
export async function DELETE(request: NextRequest) {
    try {
        const teacher = await verifyTeacher(request)
        if (!teacher) {
            return NextResponse.json(
                { message: 'Unauthorized - Teacher access required' },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(request.url)
        const idParam = searchParams.get('id')

        if (!idParam) {
            return NextResponse.json(
                { success: false, message: 'Blueprint ID is required' },
                { status: 400 }
            )
        }

        const id = Number(idParam)

        await dbConnect()

        const deletedBlueprint = await ExerciseBlueprint.findOneAndDelete({ id })

        if (!deletedBlueprint) {
            return NextResponse.json(
                { success: false, message: 'Exercise blueprint not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Exercise blueprint deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting exercise blueprint:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}