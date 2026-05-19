import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export interface AuthUser {
    _id: string
    email: string
    username?: string
    role?: string
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
    await dbConnect()

    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret'

    const decoded = jwt.verify(token, jwtSecret) as {
        userId: string
        email: string
    }

    const user = await User.findById(decoded.userId)
        .select('-password')
        .lean<AuthUser>()
    return user
}