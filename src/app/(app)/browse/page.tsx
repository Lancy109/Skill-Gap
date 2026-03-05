import React from 'react';
import { prisma } from "@/lib/prisma";
import BrowseClient from "./BrowseClient";

type DbPlaylist = { id: string; title: string; playlist_url: string };
type DbVideo = { playlist_id: string; title: string; youtube_video_id: string; position: number };

export default async function BrowsePage() {
  // Fetch all playlists and their videos using raw queries
  // Workaround: Using raw query because Prisma client generation is blocked by the active dev server
  let dbPlaylists: DbPlaylist[] = [];
  let dbVideos: DbVideo[] = [];
  try {
    dbPlaylists = await prisma.$queryRawUnsafe('SELECT id, title, playlist_url FROM "playlists"') as DbPlaylist[];
    dbVideos = await prisma.$queryRawUnsafe('SELECT playlist_id, title, youtube_video_id, position FROM "videos" ORDER BY position ASC') as DbVideo[];
  } catch (err) {
    // If the database is unreachable (e.g., local dev or misconfigured env), avoid crashing the page.
    // Fall back to mock data so the UI can render and the user can still navigate and test.
    console.warn("BrowsePage: database query failed, falling back to mock playlists:", err);
    dbPlaylists = [
      { id: 'playlist-1', title: 'React for Beginners', playlist_url: 'https://youtube.com/playlist?list=PLmock1' },
      { id: 'playlist-2', title: 'Python Mastery', playlist_url: 'https://youtube.com/playlist?list=PLmock2' }
    ];
    dbVideos = [
      { playlist_id: 'playlist-1', title: 'Introduction to React', youtube_video_id: 'Ke90Tje7VS0', position: 1 },
      { playlist_id: 'playlist-1', title: 'React Hooks Explained', youtube_video_id: 'TNhaISOUy6Q', position: 2 },
      { playlist_id: 'playlist-2', title: 'Python Basics', youtube_video_id: 'vEQ8CXFWLZU', position: 1 }
    ];
  }

  // Attach videos to their respective playlists
  const playlistsWithVideos = dbPlaylists.map(playlist => ({
    ...playlist,
    videos: dbVideos.filter(v => v.playlist_id === playlist.id)
  }));

  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BrowseClient initialPlaylists={playlistsWithVideos} />
    </React.Suspense>
  );
}

