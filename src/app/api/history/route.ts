import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const userProgress = await prisma.userProgress.findUnique({
            where: { userId },
        });

        return NextResponse.json({
            progress: {
                skills: userProgress?.skills || {}
            }
        });
    } catch (error) {
        console.error('Error fetching history data:', error);
        return NextResponse.json({ error: 'Failed to fetch history data' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const skillName = searchParams.get('skillName');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        if (skillName) {
            // Delete only the specific skill's history
            const existingRecord = await prisma.userProgress.findUnique({
                where: { userId }
            });

            if (existingRecord) {
                const existingSkills = (existingRecord.skills ?? {}) as Record<string, object>;

                if (existingSkills[skillName]) {
                    delete existingSkills[skillName];

                    // If we delete the currently active skill, nullify it to avoid breaking the dashboard
                    const isDeletingActive = existingRecord.activeSkill === skillName;

                    await prisma.userProgress.update({
                        where: { userId },
                        data: {
                            skills: existingSkills,
                            activeSkill: isDeletingActive ? null : existingRecord.activeSkill
                        }
                    });
                }
            }
            return NextResponse.json({ success: true, message: `History for ${skillName} cleared successfully` });
        } else {
            // Original behavior: wipe the entire record
            await prisma.userProgress.delete({
                where: { userId },
            });
            return NextResponse.json({ success: true, message: 'History cleared successfully' });
        }
    } catch (error) {
        console.error('Error clearing history:', error);
        return NextResponse.json({ error: 'Failed to clear history' }, { status: 500 });
    }
}
