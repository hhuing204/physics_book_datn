import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import PracticeProgress from '@/models/PracticeProgress'
import PracticeTest from '@/models/PracticeTest'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()
        const token = request.headers.get('authorization')?.replace('Bearer ', '')
        const user = token ? await verifyToken(token) : null

        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        // Only teachers can search for all attempts
        if ((user.role || '').toString().toLowerCase() !== 'teacher') {
            return NextResponse.json(
                { success: false, message: 'Only teachers can access this endpoint' },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(request.url)
        const accessCode = searchParams.get('accessCode')

        if (!accessCode) {
            return NextResponse.json(
                { success: false, message: 'Access code is required' },
                { status: 400 }
            )
        }

        // Find the practice test
        const practiceTest = await PracticeTest.findOne({ accessCode })
            .lean()
        if (!practiceTest) {
            return NextResponse.json(
                { success: false, message: 'Practice test not found' },
                { status: 404 }
            )
        }

        // Get all practice attempts for this test with user info
        const attempts = await PracticeProgress.find({
            accessCode: accessCode
        })
            .populate('user_id', 'name email')
            .sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            practiceTest,
            attempts: JSON.parse(JSON.stringify(attempts)),
            totalAttempts: attempts.length
        })
    } catch (error) {
        console.error('Get practice attempts by access code error:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}
