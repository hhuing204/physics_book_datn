import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Simulation from '@/models/Simulation';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        await connectDB();

        const simulation = await Simulation.findOne({ slug: params.slug, isActive: true });

        if (!simulation) {
            return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
        }



        return NextResponse.json({
            simulation: {
                ...simulation.toObject(),
                chapterNumber: simulation.chapterId
            }
        });
    } catch (error) {
        console.error('Error fetching simulation:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}