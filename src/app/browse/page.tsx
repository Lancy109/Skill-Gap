import { prisma } from "@/lib/prisma";
import BrowseClient from "./BrowseClient";

export default async function BrowsePage() {
  // Fetch all playlists and their videos using raw queries
  // Workaround: Using raw query because Prisma client generation is blocked by the active dev server
  let dbPlaylists: any[] = [];
  let dbVideos: any[] = [];
  try {
    dbPlaylists = await prisma.$queryRawUnsafe('SELECT id, title, playlist_url FROM "playlists"') as any[];
    dbVideos = await prisma.$queryRawUnsafe('SELECT playlist_id, title, youtube_video_id, position FROM "videos" ORDER BY position ASC') as any[];
  } catch (err) {
    // If the database is unreachable (e.g., local dev or misconfigured env), avoid crashing the page.
    // Fall back to an empty list so the UI can render and the user can still navigate.
    console.warn("BrowsePage: database query failed, falling back to empty playlists:", err);
  }

  // Attach videos to their respective playlists
  const playlistsWithVideos = dbPlaylists.map(playlist => ({
    ...playlist,
    videos: dbVideos.filter(v => v.playlist_id === playlist.id)
  }));

  return <BrowseClient initialPlaylists={playlistsWithVideos} />;
}

