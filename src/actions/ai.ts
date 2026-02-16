'use server';

export async function summarizeVideo(videoId: string, title: string) {
  console.log('Mock summarizeVideo:', videoId, title);
  // Return a mock summary after a short delay to simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    summary: `This is a mock summary for video ${videoId} (${title}). The AI summarization service is currently being integrated.`,
    error: undefined
  };
}