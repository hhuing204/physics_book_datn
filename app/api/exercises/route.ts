// app/api/exercises/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Exercise from '@/models/Exercise';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');
    const lessonId = searchParams.get('lessonId');

    console.log('API called with params:', { chapterId, lessonId });

    await dbConnect();

    // Xây dựng query
    let query: any = {};

    // Trường hợp 1: Lấy bài tập theo chương (luyện tập từng chương)
    if (chapterId && chapterId !== 'all') {
      query.chapterId = chapterId;
    }

    // Trường hợp 2: Nếu có lessonId (lọc theo bài học cụ thể)
    if (lessonId) {
      query.lessonId = lessonId;
    }

    // Trường hợp 3: Lấy tất cả bài tập (không có chapterId hoặc chapterId = 'all')

    console.log('Query:', JSON.stringify(query));

    // Lấy danh sách bài tập
    const exercises = await Exercise.find(query).lean();
    console.log(`Found ${exercises.length} exercises`);


    // Đếm số lượng bài tập theo từng bài học (chỉ khi có chapterId)
    let lessonCounts = [];
    if (chapterId && chapterId !== 'all') {
      lessonCounts = await Exercise.aggregate([
        { $match: { chapterId } },
        {
          $group: {
            _id: { chapterId: '$chapterId', lessonId: '$lessonId' },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            chapterId: '$_id.chapterId',
            lessonId: '$_id.lessonId',
            count: 1,
            _id: 0
          }
        }
      ]);
    } else if (!chapterId || chapterId === 'all') {
      // Nếu lấy tất cả, đếm theo chapter và lesson
      lessonCounts = await Exercise.aggregate([
        {
          $group: {
            _id: { chapterId: '$chapterId', lessonId: '$lessonId' },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            chapterId: '$_id.chapterId',
            lessonId: '$_id.lessonId',
            count: 1,
            _id: 0
          }
        }
      ]);
    }

    console.log('Lesson counts:', lessonCounts);

    return NextResponse.json({
      success: true,
      exercises,
      lessonCounts,
      total: exercises.length,
      // Thêm thông tin về loại lấy bài tập
      type: (!chapterId || chapterId === 'all') ? 'all' : 'by-chapter'
    });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}