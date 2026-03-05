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

        // Initialize defaults if not found
        const skills: Record<string, { watched?: string[]; total?: number }> = userProgress?.skills ? (userProgress.skills as Record<string, { watched?: string[]; total?: number }>) : {};
        const activeSkill = userProgress?.activeSkill || "Select a Track";

        let totalLecturesCompleted = 0;
        let totalTotalLectures = 0;

        // Map each started skill to a comparison object
        const comparisonData = Object.entries(skills).map(([name, data]: [string, { watched?: string[]; total?: number }]) => {
            const watchedCount = Array.isArray(data.watched) ? data.watched.length : 0;
            const total = data.total || 0;
            totalLecturesCompleted += watchedCount;
            totalTotalLectures += total;

            const progress = total > 0 ? Math.round((watchedCount / total) * 100) : 0;
            return {
                name: name,
                user: progress,
                market: 100, // Goal is always 100%
            };
        });

        const overallProgress = totalTotalLectures > 0 ? Math.round((totalLecturesCompleted / totalTotalLectures) * 100) : 0;

        // Recommendations tailored to the active skill
        const recommendations = [
            { title: `${activeSkill} Advanced Patterns`, type: "Course", priority: "High" },
            { title: "System Design Interview", type: "Video", priority: "Medium" },
            { title: "Docker for Beginners", type: "Workshop", priority: "Low" },
        ];

        const dashboardData = {
            userProfile: {
                userId,
                name: "User",
                activeSkill,
            },
            progress: {
                overall: overallProgress,
                modulesCompleted: 0,
                lecturesCompleted: totalLecturesCompleted,
                skills,
            },
            recommendations,
            analytics: {
                timeSpent: [30, 45, 60, 20, 90, 45, 30],
                streak: 5,
                comparison: comparisonData,
            },
            widgetState: userProgress?.widgetState || {},
        };

        return NextResponse.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
