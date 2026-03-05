'use server';

import { prisma } from '@/lib/prisma';

type SkillEntry = {
  watched?: string[];
  total?: number;
  lastWatched?: { videoId: string; title?: string; position?: number; timestamp: string };
  history?: { videoId: string; title?: string; position?: number; watchedAt: string }[];
  updatedAt?: string;
};

type SkillsMap = Record<string, SkillEntry>;

type ProfileData = {
  name?: string;
  email?: string;
  designation?: string;
  age?: string | number;
  bio?: string;
  activeSkill?: string | null;
  skills?: SkillsMap;
};

export async function syncProgressToDb(userId: string, skill: string, watched: string[], total: number) {
  try {
    const existingRecord = await prisma.userProgress.findUnique({ where: { userId } });
    const existingSkills = (existingRecord?.skills as SkillsMap) || {};

    const existingEntry = existingSkills[skill] || {};

    const newEntry = {
      ...(existingEntry || {}),
      watched: watched || [],
      total: total || 0,
      updatedAt: new Date().toISOString(),
    };

    existingSkills[skill] = newEntry;

    return await prisma.userProgress.upsert({
      where: { userId },
      update: {
        skills: existingSkills,
        activeSkill: skill
      },
      create: {
        userId,
        activeSkill: skill,
        skills: existingSkills
      }
    });
  } catch (error) {
    console.error('Error syncing progress to DB:', error);
    throw error;
  }
}

export async function recordLectureProgress(
  userId: string,
  skill: string,
  videoId: string,
  options: { title?: string; position?: number; completed?: boolean } = {}
) {
  try {
    const existingRecord = await prisma.userProgress.findUnique({ where: { userId } });
    const existingSkills = (existingRecord?.skills as SkillsMap) || {};

    const entry = existingSkills[skill] || { watched: [], total: 0 };

    // mark video completed if requested
    if (options.completed && !entry.watched?.includes(videoId)) {
      entry.watched = [...(entry.watched || []), videoId];
    }

    // update lastWatched metadata
    entry.lastWatched = {
      videoId,
      title: options.title,
      position: options.position,
      timestamp: new Date().toISOString()
    };

    // append history entry
    entry.history = entry.history || [];
    entry.history.push({
      videoId,
      title: options.title,
      position: options.position,
      watchedAt: new Date().toISOString()
    });

    entry.updatedAt = new Date().toISOString();

    existingSkills[skill] = entry;

    await prisma.userProgress.upsert({
      where: { userId },
      update: {
        skills: existingSkills,
        activeSkill: skill
      },
      create: {
        userId,
        activeSkill: skill,
        skills: existingSkills
      }
    });

    return existingSkills;
  } catch (error) {
    console.error('Error recording lecture progress:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, data: ProfileData) {
  try {
    const { name, email, designation, age, bio, activeSkill, skills } = data;

    // Convert age to number cleanly
    const parsedAge = age ? parseInt(age.toString(), 10) : null;

    return await prisma.userProgress.upsert({
      where: { userId },
      update: {
        name,
        email,
        designation,
        age: parsedAge,
        bio,
        activeSkill,
        skills,
        updatedAt: new Date()
      },
      create: {
        userId,
        name,
        email,
        designation,
        age: parsedAge,
        bio,
        activeSkill,
        skills: skills || {}
      }
    });
  } catch (error) {
    console.error('Error updating profile in DB:', error);
    throw error;
  }
}

export async function setUserProfileSetupFlag(userId: string) {
  console.log('setUserProfileSetupFlag DB:', userId);
  return { success: true };
}
