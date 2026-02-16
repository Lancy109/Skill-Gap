import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Mock data for the dashboard
    const mockData = {
        userProfile: {
            userId: "mock-user-123",
            name: "Demo User",
            activeSkill: "Python",
        },
        progress: {
            overall: 45,
            modulesCompleted: 3,
            lecturesCompleted: 12,
            skills: {
                "Python": { total: 20, watched: ["vid1", "vid2", "vid3", "vid4", "vid5"] },
                "React": { total: 15, watched: ["vid1", "vid2"] }
            },
        },
        recommendations: [
            { title: "Advanced Python Patterns", type: "Course", priority: "High" },
            { title: "System Design Interview", type: "Video", priority: "Medium" },
            { title: "Docker for Beginners", type: "Workshop", priority: "Low" },
        ],
        analytics: {
            timeSpent: [30, 45, 60, 20, 90, 45, 30],
            streak: 5,
            comparison: {
                user: 65,
                market: 80,
                trackAvg: 50,
            },
        },
        widgetState: {},
    };

    return NextResponse.json(mockData);
}
