'use server';

import { YoutubeTranscript } from 'youtube-transcript';
import Groq from 'groq-sdk';

export async function summarizeVideo(videoId: string, title: string) {
  console.log('Summarizing Video with Groq:', videoId, title);

  try {
    // 1. Fetch Transcript
    let transcriptText = "";
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      transcriptText = transcript.map(t => t.text).join(' ');
    } catch (err) {
      console.warn("Could not fetch transcript, falling back to title:", err);
      transcriptText = "(No transcript available. Please summarize based on the title only.)";
    }

    // 2. Init Groq
    if (!process.env.GROQ_API_KEY) {
      return { summary: '', error: 'GROQ_API_KEY is missing in your environment variables.' };
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // 3. Call Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational AI assistant. Your goal is to provide a highly structured, concise, and easy-to-read summary of the provided video content. Use markdown formatting, bullet points, and bold text for key concepts. Keep it under 300 words.'
        },
        {
          role: 'user',
          content: `Video Title: ${title}\n\nTranscript / Context:\n${transcriptText.substring(0, 15000)} // truncate to avoid token limits`
        }
      ],
      model: 'llama-3.1-8b-instant',
    });

    return {
      summary: completion.choices[0]?.message?.content || 'No summary generated.',
      error: undefined
    };

  } catch (error: any) {
    console.error('Groq Summarization Error:', error);
    return {
      summary: '',
      error: error.message || 'Failed to generate summary with Groq.'
    };
  }
}