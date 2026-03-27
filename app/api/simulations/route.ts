import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Simulation from '@/models/Simulation';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const chapterId = searchParams.get('chapterId');

        let query: any = { isActive: true };

        if (chapterId) {
            query.chapterId = chapterId;
        }

        const simulations = await Simulation.find(query).sort({ order: 1 });

        return NextResponse.json({ simulations });
    } catch (error) {
        console.error('Error fetching simulations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch simulations', simulations: [] },
            { status: 500 }
        );
    }
}