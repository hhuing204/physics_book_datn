import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import TheoryProgress, { ITheoryProgress } from '@/models/TheoryProgress';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'Token không tồn tại!' },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };

    const userObjectId = new mongoose.Types.ObjectId(decoded.userId);

    const progressData = await TheoryProgress.find({
      user_id: userObjectId,
    });

    const progressMap: { [key: string]: ITheoryProgress } = {};

    progressData.forEach((progress) => {
      progressMap[progress.lessonId] = progress;
    });

    return NextResponse.json({
      message: 'Success',
      progress: progressMap,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra!' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'Token không tồn tại!' },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };

    const { lessonId, completed, timeSpent } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { message: 'Lesson ID is required!' },
        { status: 400 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(decoded.userId);

    const lessonObjectId = mongoose.Types.ObjectId.isValid(lessonId)
      ? new mongoose.Types.ObjectId(lessonId)
      : new mongoose.Types.ObjectId();

    const updateData: Partial<ITheoryProgress> = {
      user_id: userObjectId,
      lesson_id: lessonObjectId,
      lessonId: lessonId,
    };

    // map old "completed" behavior -> completedAt
    if (completed === true) {
      updateData.completedAt = new Date();
    }

    if (timeSpent !== undefined) {
      updateData.timeSpent = timeSpent;
    }

    const progress = await TheoryProgress.findOneAndUpdate(
      {
        user_id: userObjectId,
        lessonId: lessonId,
      },
      updateData,
      {
        upsert: true,
        new: true,
      }
    );

    return NextResponse.json({
      message: 'Cập nhật tiến độ thành công!',
      progress,
    });
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra!' },
      { status: 500 }
    );
  }
}