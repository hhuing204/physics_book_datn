import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import Chapter from '../../../models/Chapter'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const chapterId = searchParams.get('chapterId') // "1", "2", "3", ...

    if (chapterId) {
      // Lấy chapter theo chapterId hoặc id
      const chapter = await Chapter.findOne({ $or: [{ chapterId }, { id: chapterId }] })
      if (!chapter) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
      }
      return NextResponse.json(chapter)
    }
    else {
      // Lấy tất cả chapters, sắp xếp theo chapterId hoặc id
      const chapters = await Chapter.find().sort({ chapterId: 1, id: 1 })
      return NextResponse.json(chapters)
    }
  } catch (error) {
    console.error('Error fetching chapters:', error)
    return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const chapter = new Chapter(body)
    await chapter.save()
    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create chapter' }, { status: 500 })
  }
}