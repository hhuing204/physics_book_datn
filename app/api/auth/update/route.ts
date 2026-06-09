import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { message: 'Người dùng không tồn tại!' },
        { status: 404 }
      );
    }

    const { name, email, currentPassword, newPassword } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { message: 'Vui lòng cung cấp tên và email.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedName = name.trim();

    if (user.email !== normalizedEmail) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return NextResponse.json(
          { message: 'Email đã được sử dụng bởi người dùng khác.' },
          { status: 409 }
        );
      }
      user.email = normalizedEmail;
    }

    user.name = trimmedName;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: 'Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu.' },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: 'Mật khẩu hiện tại không chính xác.' },
          { status: 401 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' },
          { status: 400 }
        );
      }

      const saltRounds = 12;
      user.password = await bcrypt.hash(newPassword, saltRounds);
    }

    await user.save();

    return NextResponse.json({
      message: 'Cập nhật thông tin thành công!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: (user.role || 'learner').toString().toLowerCase(),
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra, vui lòng thử lại!' },
      { status: 500 }
    );
  }
}
