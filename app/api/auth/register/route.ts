import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password, role } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ thông tin!' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email đã được sử dụng!' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Normalize role: accept 'teacher' or default to 'learner'
    const requestedRole = typeof role === 'string' ? role.trim().toLowerCase() : '';
    const normalizedRole = requestedRole === 'teacher' ? 'teacher' : 'learner';

    // Create user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: normalizedRole,
      isActive: true
    });

    await newUser.save();

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Return user data (excluding password)
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      role: (newUser.role || 'learner').toString().toLowerCase(),
      createdAt: newUser.createdAt,
    };

    return NextResponse.json({
      message: 'Đăng ký thành công!',
      token,
      user: userResponse,
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra, vui lòng thử lại!' },
      { status: 500 }
    );
  }
}