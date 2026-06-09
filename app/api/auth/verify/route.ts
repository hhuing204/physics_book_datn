import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };

    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { message: 'Người dùng không tồn tại!' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Token hợp lệ',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: (user.role || 'learner').toString().toLowerCase(),
        isActive: user.isActive,
        username: user.username,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error('Verify token error:', error);
    return NextResponse.json(
      { message: 'Token không hợp lệ!' },
      { status: 401 }
    );
  }
}