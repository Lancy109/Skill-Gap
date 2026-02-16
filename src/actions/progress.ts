'use server';

export async function syncProgressToDb(userId: string, skillName: string, watched: string[], total: number) {
  console.log('Mock syncProgressToDb:', userId, skillName, watched.length, total);
  return { success: true };
}

export async function recordLectureProgress(userId: string, skillName: string, videoId: string, data: any) {
  console.log('Mock recordLectureProgress:', userId, skillName, videoId, data);
  return { success: true };
}

export async function updateUserProfile(userId: string, data: any) {
  console.log('Mock updateUserProfile:', userId, data);
  return { success: true };
}

export async function setUserProfileSetupFlag(userId: string) {
  console.log('Mock setUserProfileSetupFlag:', userId);
  return { success: true };
}
