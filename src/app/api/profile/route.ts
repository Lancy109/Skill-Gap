import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const userProgress = await prisma.userProgress.findUnique({
            where: { userId },
            select: {
                name: true,
                email: true,
                designation: true,
                age: true,
                bio: true,
                activeSkill: true,
                skills: true,
                updatedAt: true
            }
        });

        if (!userProgress) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json(userProgress);
    } catch (error) {
        console.error('Error fetching profile data:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}
