import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import TheoryProgress from '@/models/TheoryProgress';
import Chapter from '@/models/Chapter';

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };

    await dbConnect();

    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);

    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get user statistics (exclude admin)
    const totalUsers = await User.countDocuments({
      role: { $ne: 'admin' },
    });

    const activeUsers = await User.countDocuments({
      isActive: true,
      role: { $ne: 'admin' },
    });

    // Get users created this month (exclude admin)
    const now = new Date();
    const firstDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const newThisMonth = await User.countDocuments({
      createdAt: { $gte: firstDayOfMonth },
      role: { $ne: 'admin' },
    });

    // Get chapter statistics
    const totalChapters = await Chapter.countDocuments();

    const publishedChapters = await Chapter.countDocuments({
      isPublished: true,
    });

    const draftChapters = totalChapters - publishedChapters;

    // Get lesson statistics
    const allChapters = await Chapter.find();

    let totalLessons = 0;

    allChapters.forEach((chap) => {
      if (Array.isArray(chap.lessons)) {
        totalLessons += chap.lessons.length;
      }
    });

    // =========================
    // Progress statistics
    // =========================

    // Get normal users only
    const normalUsers = await User.find({
      role: { $ne: 'admin' },
    }).select('_id');

    const normalUserIds = normalUsers.map((u) => u._id);

    // Total progress records
    const totalProgress = await TheoryProgress.countDocuments({
      user_id: { $in: normalUserIds },
    });

    // Users with progress
    const usersWithProgress = await TheoryProgress.distinct('user_id', {
      user_id: { $in: normalUserIds },
    });

    // Completed lessons
    const completedProgress = await TheoryProgress.countDocuments({
      user_id: { $in: normalUserIds },
      completedAt: { $ne: null },
    });

    // Average completion
    // Formula:
    // total completed lessons / (users * total lessons)
    let averageCompletion = 0;

    if (totalLessons > 0 && normalUserIds.length > 0) {
      const maxPossibleProgress = normalUserIds.length * totalLessons;

      averageCompletion = Math.round(
        (completedProgress / maxPossibleProgress) * 100
      );
    }

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth,
        },
        chapters: {
          total: totalChapters,
          published: publishedChapters,
          drafts: draftChapters,
        },
        lessons: {
          total: totalLessons,
        },
        progress: {
          totalRecords: totalProgress,
          completedRecords: completedProgress,
          averageCompletion,
          activeUsers: usersWithProgress.length,
        },
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}