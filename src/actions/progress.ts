"use server";
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function syncProgressToDb(userId: string, skillName: string, watchedVideos: string[], total: number) {
  try {
    // 1. Safely fetch the existing record first
    const existingRecord = await prisma.userProgress.findUnique({
      where: { userId }
    });

    // 2. Extract existing skills or default to an empty object
    const existingSkills = (existingRecord?.skills as Record<string, any>) || {};

    // 3. Upsert: This handles both creating a new user and updating an existing one
    return await prisma.userProgress.upsert({
      where: { userId },
      update: {
        activeSkill: skillName,
        skills: {
          ...existingSkills, // This is now safe because existingSkills is at least {}
          [skillName]: { 
            watched: watchedVideos, 
            total: total,
            updatedAt: new Date().toISOString()
          }
        }
      },
      create: {
        userId,
        activeSkill: skillName,
        skills: {
          [skillName]: { 
            watched: watchedVideos, 
            total: total,
            updatedAt: new Date().toISOString()
          }
        }
      }
    });
  } catch (error) {
    console.error("Prisma Sync Error:", error);
    throw new Error("Failed to sync progress to database");
  }
}