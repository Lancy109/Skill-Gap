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

export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const body = await request.json();
        const { name, designation, age, bio, activeSkill, profileImage } = body;
        // Note: email is intentionally excluded and cannot be updated

        const updated = await prisma.userProgress.update({
            where: { userId },
            data: {
                name: name || undefined,
                designation: designation || undefined,
                age: age ? parseInt(age) : undefined,
                bio: bio || undefined,
                activeSkill: activeSkill || undefined,
                profileImage: profileImage || undefined,
                updatedAt: new Date()
            },
            select: {
                name: true,
                email: true,
                designation: true,
                age: true,
                bio: true,
                activeSkill: true,
                profileImage: true,
                updatedAt: true
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
