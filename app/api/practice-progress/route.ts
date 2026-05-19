import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import PracticeTest from '@/models/PracticeTest'
import PracticeProgress from '@/models/PracticeProgress'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const user = token ? await verifyToken(token) : null

        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const accessCode = searchParams.get('accessCode')
        const summary = searchParams.get('summary') === 'true'

        if (summary) {
            const attempts = await PracticeProgress.find({ user_id: user._id })
                .sort({ createdAt: -1 })
                .lean()
            return NextResponse.json({ success: true, attempts })
        }

        if (!accessCode) {
            return NextResponse.json({ success: false, message: 'Access code is required' }, { status: 400 })
        }

        const practiceTest = await PracticeTest.findOne({ accessCode }).lean()
        if (!practiceTest) {
            return NextResponse.json({ success: false, message: 'Practice test not found' }, { status: 404 })
        }

        const progress = await PracticeProgress.findOne({
            user_id: user._id,
            practiceTestId: practiceTest._id,
        })
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({ success: true, progress, practiceTest })
    } catch (error) {
        console.error('Practice progress GET error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect()
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const user = token ? await verifyToken(token) : null

        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { accessCode } = body
        if (!accessCode) {
            return NextResponse.json({ success: false, message: 'Access code is required' }, { status: 400 })
        }

        const practiceTest = await PracticeTest.findOne({ accessCode }).lean()
        if (!practiceTest) {
            return NextResponse.json({ success: false, message: 'Practice test not found' }, { status: 404 })
        }

        const existing = await PracticeProgress.findOne({
            user_id: user._id,
            practiceTestId: practiceTest._id,
        })
            .sort({ createdAt: -1 })
            .lean()

        if (existing && existing.status === 'in-progress') {
            return NextResponse.json({ success: true, progress: existing, practiceTest })
        }

        const progress = new PracticeProgress({
            practiceTestId: practiceTest._id,
            user_id: user._id,
            accessCode: practiceTest.accessCode,
            timeAlloted: practiceTest.timeAlloted,
            startAt: new Date(),
            status: 'in-progress',
            answers: [],
            score: 0,
        })
        await progress.save()

        return NextResponse.json({ success: true, progress, practiceTest })
    } catch (error) {
        console.error('Practice progress POST error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        await dbConnect()
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const user = token ? await verifyToken(token) : null

        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { accessCode, answers, score, submittedAt } = body
        if (!accessCode) {
            return NextResponse.json({ success: false, message: 'Access code is required' }, { status: 400 })
        }

        const practiceTest = await PracticeTest.findOne({ accessCode }).lean()
        if (!practiceTest) {
            return NextResponse.json({ success: false, message: 'Practice test not found' }, { status: 404 })
        }

        const progress = await PracticeProgress.findOne({
            user_id: user._id,
            practiceTestId: practiceTest._id,
            status: 'in-progress',
        }).sort({ createdAt: -1 })

        if (!progress) {
            return NextResponse.json({ success: false, message: 'No in-progress attempt found' }, { status: 404 })
        }

        if (answers) {
            progress.answers = answers
        }
        if (typeof score === 'number') {
            progress.score = score
        }
        if (submittedAt) {
            progress.submittedAt = new Date(submittedAt)
            progress.status = 'finished'
        }

        await progress.save()
        return NextResponse.json({ success: true, progress })
    } catch (error) {
        console.error('Practice progress PUT error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}
