'use client';

import { useState } from 'react';
import { summarizeVideo } from '@/actions/ai';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function VideoSummaryPage() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔹 Extract Video ID (same regex as provided)
  const getVideoId = (url: string) => {
    const pattern = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
    const match = url.match(pattern);
    return match ? match[1] : null;
  };

  const handleSummarize = async () => {
    setError('');
    setSummary('');

    if (!url.trim()) {
      setError('Please enter a valid YouTube URL.');
      return;
    }

    const videoId = getVideoId(url);
    if (!videoId) {
      setError('Could not extract Video ID from the URL.');
      return;
    }

    setIsLoading(true);

    try {
      // Use the existing Groq action
      const result = await summarizeVideo(videoId, 'Video Summary');

      if (result.error) {
        setError(result.error);
      } else {
        setSummary(result.summary);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-10">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Sparkles className="text-indigo-600" /> AI Video Summary
      </h1>

      <div className="max-w-4xl bg-white p-10 rounded-[40px] shadow-sm border border-slate-50">
        <div className="mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-2">Paste YouTube URL</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSummarize}
              disabled={isLoading}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              Summarize
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-sm font-medium">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        {summary ? (
          <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 text-left">
            <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        ) : (
          <div className="p-8 bg-indigo-50/50 rounded-3xl border border-indigo-100 border-dashed text-center">
            <p className="text-indigo-600 font-medium">Your summary will appear here after processing.</p>
          </div>
        )}
      </div>
    </div>
  );
}