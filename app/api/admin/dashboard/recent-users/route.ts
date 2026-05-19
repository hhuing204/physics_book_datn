import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import TheoryProgress from '@/models/TheoryProgress';
import PracticeProgress from '@/models/PracticeProgress';

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

    // Pagination params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const skip = (page - 1) * pageSize;

    const filter = { role: { $ne: 'admin' } };
    const total = await User.countDocuments(filter);

    // Fetch all users, sort numerically by name
    const allUsers = await User.find(filter).select('-password');
    allUsers.sort((a, b) => {
      const getNum = (name: string) => {
        const match = name.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      };
      return getNum(a.name) - getNum(b.name);
    });

    const usersPage = allUsers.slice(skip, skip + pageSize);

    // Add lessonsCompleted & practiceTestsDone
    const usersWithProgress = await Promise.all(
      usersPage.map(async (user) => {
        try {
          const lessonsCompleted = await TheoryProgress.countDocuments({
            user_id: user._id,          // correct field
            completedAt: { $ne: null }  // match completed lessons
          });

          const practiceTestsDone = await PracticeProgress.countDocuments({
            user_id: user._id
          });

          return {
            ...user.toObject(),
            lessonsCompleted,
            practiceTestsDone
          };
        } catch (err) {
          console.error('Error fetching progress for user', user._id, err);
          return {
            ...user.toObject(),
            lessonsCompleted: 0,
            practiceTestsDone: 0
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithProgress,
      total
    });
  } catch (error) {
    console.error('Get recent users error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
