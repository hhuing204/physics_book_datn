// app/api/simulation/access/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import TheoryProgress from '@/models/TheoryProgress';
import mongoose from 'mongoose';

// Mapping simulation ID -> danh sách lessonId cần hoàn thành
const SIMULATION_LESSON_REQUIREMENTS: Record<string, { requiredLessons: string[]; chapterId: string }> = {
    // Chương 1: Dao Động
    'con-lac-don': { requiredLessons: ['1', '2'], chapterId: '1' },
    'con-lac-lo-xo': { requiredLessons: ['1', '2', '3'], chapterId: '1' },


    // Chương 2: Sóng Cơ và Sóng Điện Từ
    'song-dien-tu': { requiredLessons: ['5', '6', '7'], chapterId: '2' },
    'song-doc-va-song-ngang': { requiredLessons: ['5', '6'], chapterId: '2' },
    'giao-thoa-song': { requiredLessons: ['5', '6', '8'], chapterId: '2' },
    'song-tren-day': { requiredLessons: ['5', '6', '9'], chapterId: '2' },
    'sonar': { requiredLessons: ['5', '6', '7'], chapterId: '2' },
    'song-co-3d': { requiredLessons: ['5', '6'], chapterId: '2' },
};

// Hàm lấy tên bài học từ lessonId
const getLessonTitle = (lessonId: string): string => {
    const titles: Record<string, string> = {
        '1': 'Mô tả dao động',
        '2': 'Phương trình dao động điều hoà',
        '3': 'Năng lượng trong dao động điều hoà',
        '4': 'Dao động tắt dần và hiện tượng cộng hưởng',
        '5': 'Sóng cơ và sự truyền sóng',
        '6': 'Các đặc trưng vật lý sóng',
        '7': 'Sóng điện từ',
        '8': 'Giao thoa sóng',
        '9': 'Sóng dừng',
    };
    return titles[lessonId] || `Bài ${lessonId}`;
};

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const authHeader = request.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return NextResponse.json(
                {
                    hasAccess: false,
                    error: 'Vui lòng đăng nhập để sử dụng tính năng này',
                    requiresLogin: true
                },
                { status: 401 }
            );
        }

        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
        let decoded: { userId: string; email: string };

        try {
            decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };
        } catch (error) {
            return NextResponse.json(
                {
                    hasAccess: false,
                    error: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
                    requiresLogin: true
                },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const simulationId = searchParams.get('simulationId');
        const chapterId = searchParams.get('chapterId');

        if (!simulationId) {
            return NextResponse.json(
                { hasAccess: false, error: 'Thiếu thông tin simulation' },
                { status: 400 }
            );
        }

        const userObjectId = new mongoose.Types.ObjectId(decoded.userId);

        // Lấy thông tin user
        const user = await User.findById(userObjectId);

        if (!user) {
            return NextResponse.json(
                { hasAccess: false, error: 'Không tìm thấy thông tin người dùng' },
                { status: 404 }
            );
        }

        // ===== ADMIN / TEACHER: TOÀN QUYỀN =====
        if (user.role === 'admin' || user.role === 'teacher') {
            return NextResponse.json({
                hasAccess: true,
                role: user.role,
                message: 'Bạn có toàn quyền sử dụng simulation'
            });
        }

        // ===== HỌC SINH: CẦN KIỂM TRA BÀI HỌC =====
        // Tìm requirement theo simulationId
        let requirement = SIMULATION_LESSON_REQUIREMENTS[simulationId];

        // Nếu không tìm thấy, thử tìm theo chapterId mặc định
        if (!requirement && chapterId === '2') {
            // Mặc định cho chương 2: cần học bài 5
            requirement = { requiredLessons: ['5'], chapterId: '2' };
        }

        if (!requirement || requirement.requiredLessons.length === 0) {
            // Nếu không có cấu hình, vẫn cho phép truy cập
            console.warn(`No lesson requirement configured for simulation: ${simulationId}`);
            return NextResponse.json({
                hasAccess: true,
                role: user.role,
                message: 'Simulation không yêu cầu bài học trước'
            });
        }

        // Lấy danh sách bài học đã hoàn thành của user
        const completedProgress = await TheoryProgress.find({
            user_id: userObjectId,
            lessonId: { $in: requirement.requiredLessons },
            completedAt: { $exists: true, $ne: null }
        });

        const completedLessonIds = new Set(completedProgress.map(p => p.lessonId));

        // Kiểm tra xem đã hoàn thành tất cả bài học yêu cầu chưa
        const missingLessons = requirement.requiredLessons.filter(
            lessonId => !completedLessonIds.has(lessonId)
        );

        const hasAccess = missingLessons.length === 0;

        // Chi tiết bài học còn thiếu
        const missingLessonsDetails = missingLessons.map(id => ({
            id,
            title: getLessonTitle(id)
        }));

        return NextResponse.json({
            hasAccess,
            role: user.role,
            requiresLesson: !hasAccess,
            missingLessons: missingLessonsDetails,
            completedLessons: Array.from(completedLessonIds),
            requiredLessons: requirement.requiredLessons,
            message: hasAccess
                ? 'Bạn đã hoàn thành các bài học cần thiết, có thể sử dụng simulation'
                : `Bạn cần hoàn thành ${missingLessons.length} bài học trước khi sử dụng simulation này`
        });

    } catch (error) {
        console.error('Error checking access:', error);
        return NextResponse.json(
            {
                hasAccess: false,
                error: 'Có lỗi xảy ra khi kiểm tra quyền truy cập'
            },
            { status: 500 }
        );
    }
}