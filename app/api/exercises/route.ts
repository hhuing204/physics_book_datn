// app/api/exercises/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Exercise from '@/models/Exercise';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');
    const lessonId = searchParams.get('lessonId');

    console.log('API called with params:', { chapterId, lessonId }); // Debug

    await dbConnect();

    // Xây dựng query
    let query: any = {};
    if (chapterId) {
      query.chapterId = chapterId;
    }
    if (lessonId) {
      query.lessonId = lessonId;
    }

    console.log('Query:', JSON.stringify(query)); // Debug

    // Lấy danh sách bài tập
    const exercises = await Exercise.find(query).lean();
    console.log(`Found ${exercises.length} exercises`); // Debug

    if (exercises.length > 0) {
      console.log('Sample exercise:', exercises[0]); // Debug
    }

    // Đếm số lượng bài tập theo từng bài học
    const lessonCounts = await Exercise.aggregate([
      { $match: chapterId ? { chapterId } : {} },
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

    console.log('Lesson counts:', lessonCounts); // Debug

    return NextResponse.json({
      success: true,
      exercises,
      lessonCounts,
      total: exercises.length
    });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}