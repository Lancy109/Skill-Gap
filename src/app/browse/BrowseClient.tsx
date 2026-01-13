"use client";
import React, { useState, useEffect } from 'react';
import {
    Code2, Database, Layout, Smartphone, Cpu, Server,
    Zap, ArrowLeft, Play, ExternalLink, Globe, Coffee, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { syncProgressToDb } from '@/actions/progress'; // Added sync import

const CoffeeIcon = () => <Coffee size={20} />;

const skillRegistry: Record<string, any> = {
    "Python": { title: "Python", priority: "Recommended", icon: <Code2 />, color: "from-blue-500 to-blue-700" },
    "C": { title: "C", priority: "Medium Priority", icon: <Cpu />, color: "from-purple-500 to-purple-700" },
    "Advanced JavaScript": { title: "Advanced JavaScript", priority: "High Priority", icon: <Code2 />, color: "from-amber-400 to-orange-500" },
    "NodeJS": { title: "NodeJS", priority: "High Priority", icon: <Server />, color: "from-emerald-500 to-green-700" },
    "Java": { title: "Java", priority: "Recommended", icon: <CoffeeIcon />, color: "from-red-500 to-red-700" },
    "SQL": { title: "SQL", priority: "High Priority", icon: <Database />, color: "from-orange-400 to-orange-600" },
    "Kotlin": { title: "Kotlin", priority: "Recommended", icon: <Smartphone />, color: "from-indigo-500 to-blue-600" },
    "TypeScript": { title: "TypeScript", priority: "High Priority", icon: <Code2 />, color: "from-sky-400 to-blue-500" },
    "C++": { title: "C++", priority: "Medium Priority", icon: <Cpu />, color: "from-blue-600 to-indigo-800" },
    "Swift": { title: "Swift", priority: "Recommended", icon: <Smartphone />, color: "from-orange-500 to-rose-500" },
    "Flutter": { title: "Flutter", priority: "Recommended", icon: <Layout />, color: "from-cyan-400 to-blue-500" },
    "React": { title: "React", priority: "Recommended", icon: <Layout />, color: "from-blue-400 to-indigo-500" },
    "HTML & CSS": { title: "HTML & CSS", priority: "High Priority", icon: <Globe />, color: "from-pink-500 to-rose-600" }
};

export default function BrowseClient({ initialPlaylists, userId = "default_user" }: { initialPlaylists: any[], userId?: string }) {
    const [isNavCollapsed, setNavCollapsed] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<any>(null);
    const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
    const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsMounted(true);
        const skillName = searchParams.get('skill');
        if (skillName && skillRegistry[skillName]) setSelectedSkill(skillRegistry[skillName]);

        // Load watched videos
        const progress = JSON.parse(localStorage.getItem("skill-gap-progress") || "{}");
        if (skillName && progress[skillName]?.watched) {
            setWatchedVideos(progress[skillName].watched);
        }
    }, [searchParams]);

    // Load watched videos when skill changes via UI (not just URL)
    useEffect(() => {
        if (selectedSkill) {
            const progress = JSON.parse(localStorage.getItem("skill-gap-progress") || "{}");
            if (progress[selectedSkill.title]?.watched) {
                setWatchedVideos(progress[selectedSkill.title].watched);
            } else {
                setWatchedVideos([]);
            }
        }
    }, [selectedSkill]);

    // Find the matching playlist for the selected skill
    const currentPlaylist = selectedSkill ? initialPlaylists.find(p =>
        p.title.toLowerCase().trim() === selectedSkill.title.toLowerCase().trim()
    ) : null;

    const handleStartLearning = async () => {
    if (!selectedSkill || !currentPlaylist) return;

    const rawUrl = currentPlaylist.playlist_url;

    if (rawUrl && typeof rawUrl === 'string') {
        try {
            // Trim whitespace to prevent "Invalid URL" errors
            const cleanUrl = rawUrl.trim();
            const url = new URL(cleanUrl);
            const urlParams = new URLSearchParams(url.search);
            const listId = urlParams.get('list');

            if (listId) {
                // 1. Set UI State
                setActivePlaylistId(listId);
                if (currentPlaylist.videos?.[0]) {
                    setActiveVideoId(currentPlaylist.videos[0].youtube_video_id);
                }

                // 2. Prepare Progress Data
                const existing = JSON.parse(localStorage.getItem("skill-gap-progress") || "{}");
                const totalVideos = currentPlaylist.videos?.length || 0;
                
                if (!existing[selectedSkill.title]) {
                    existing[selectedSkill.title] = { watched: [], total: totalVideos };
                } else {
                    existing[selectedSkill.title].total = totalVideos;
                }

                // 3. Save Locally
                localStorage.setItem("skill-gap-progress", JSON.stringify(existing));
                localStorage.setItem('current-open-skill', selectedSkill.title);

                // 4. Sync to Supabase via Prisma Action
                try {
                    await syncProgressToDb(
                        userId, 
                        selectedSkill.title, 
                        existing[selectedSkill.title].watched, 
                        totalVideos
                    );
                } catch (syncError) {
                    console.warn("Background sync failed, but local progress saved.");
                }

                // 5. Update Dashboard
                window.dispatchEvent(new Event("storageProgressUpdate"));
            } else {
                // No list ID found, just open in new tab
                window.open(cleanUrl, '_blank');
            }
        } catch (e) {
            // This catches the "Invalid URL" error and provides a safe fallback
            console.error("URL Parsing failed, opening in new tab instead:", rawUrl);
            window.open(rawUrl, '_blank');
        }
    } else {
        alert(`Resource URL missing for ${selectedSkill.title}`);
    }
};

    const handleMarkAsCompleted = async () => {
        if (!selectedSkill || !activeVideoId || !currentPlaylist) return;

        // Use a temp variable for the new state to ensure sync is accurate
        let updatedWatched: string[] = [];

        setWatchedVideos(prev => {
            if (prev.includes(activeVideoId)) {
                updatedWatched = prev;
                return prev;
            }
            updatedWatched = [...prev, activeVideoId];

            // Save to localStorage
            const existing = JSON.parse(localStorage.getItem("skill-gap-progress") || "{}");
            existing[selectedSkill.title] = {
                watched: updatedWatched,
                total: currentPlaylist.videos?.length || 0
            };
            localStorage.setItem("skill-gap-progress", JSON.stringify(existing));

            // Dispatch Event
            window.dispatchEvent(new Event("storageProgressUpdate"));

            return updatedWatched;
        });

        // --- ADDED: SYNC TO SUPABASE ---
        const total = currentPlaylist.videos?.length || 0;
        // Small delay to let state update if needed, or use the local variable
        await syncProgressToDb(userId, selectedSkill.title, updatedWatched, total);

        // Optional: Move to next video
        const currentIndex = currentPlaylist.videos.findIndex((v: any) => v.youtube_video_id === activeVideoId);
        if (currentIndex !== -1 && currentIndex < currentPlaylist.videos.length - 1) {
            setActiveVideoId(currentPlaylist.videos[currentIndex + 1].youtube_video_id);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#FDFDFE] flex flex-col text-slate-800">
            <Navbar onToggleNav={() => setNavCollapsed(!isNavCollapsed)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isCollapsed={isNavCollapsed} />

                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <AnimatePresence mode="wait">

                        {/* --- VIEW 1: IN-APP VIDEO PLAYER --- */}
                        {activePlaylistId ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="max-w-6xl mx-auto"
                            >
                                <button
                                    onClick={() => {
                                        setActivePlaylistId(null);
                                        setActiveVideoId(null);
                                        localStorage.removeItem('current-open-skill');
                                        window.dispatchEvent(new Event('storageProgressUpdate'));
                                    }}
                                    className="mb-6 flex items-center gap-2 text-slate-400 font-bold hover:text-red-500 transition-all text-xs uppercase tracking-widest"
                                >
                                    <X size={16} /> Close Player
                                </button> 

                                <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 grid grid-cols-1 lg:grid-cols-4 lg:h-[600px]">
                                    {/* Video Main Frame */}
                                    <div className="lg:col-span-3 h-full bg-slate-50">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={activeVideoId
                                                ? `https://www.youtube.com/embed/${activeVideoId}?list=${activePlaylistId}&autoplay=1&rel=0`
                                                : `https://www.youtube.com/embed/videoseries?list=${activePlaylistId}&autoplay=1&rel=0`
                                            }
                                            title="Course Player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>

                                    {/* Sidebar Playlist Info */}
                                    <div className="p-6 bg-[#F8FAFC] text-slate-900 border-l border-slate-100 flex flex-col h-full overflow-hidden">
                                        <div className="mb-6 shrink-0">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Live Path</span>
                                            <h2 className="text-xl font-black mt-1 truncate text-slate-900">{selectedSkill?.title}</h2>
                                        </div>

                                        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm shrink-0">
                                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                                    Interactive curriculum. Click a step to jump to that video.
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Interactive Steps</p>
                                                {currentPlaylist?.videos && currentPlaylist.videos.length > 0 ? (
                                                    currentPlaylist.videos.map((video: any, index: number) => (
                                                        <div
                                                            key={video.youtube_video_id}
                                                            onClick={() => setActiveVideoId(video.youtube_video_id)}
                                                            className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${activeVideoId === video.youtube_video_id
                                                                ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-200 text-white'
                                                                : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md text-slate-600'
                                                                }`}
                                                        >
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${activeVideoId === video.youtube_video_id
                                                                ? 'bg-white text-indigo-600'
                                                                : watchedVideos.includes(video.youtube_video_id)
                                                                    ? 'bg-emerald-500 text-white'
                                                                    : 'bg-slate-100 text-slate-500'
                                                                }`}>
                                                                {watchedVideos.includes(video.youtube_video_id) ? '✓' : index + 1}
                                                            </div>
                                                            <span className={`text-[11px] font-bold leading-tight ${activeVideoId === video.youtube_video_id
                                                                ? 'text-white'
                                                                : watchedVideos.includes(video.youtube_video_id)
                                                                    ? 'text-slate-400 line-through'
                                                                    : 'text-slate-700'
                                                                }`}>
                                                                {video.title}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-xs text-slate-500 italic p-4">
                                                        No individual steps available for this playlist.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleMarkAsCompleted}
                                            className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                                        >
                                            {watchedVideos.includes(activeVideoId || '') ? 'Completed' : 'Mark as Completed'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : !selectedSkill ? (
                            /* --- VIEW 2: SKILL GRID --- */
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
                                <header className="mb-12">
                                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Curated Paths</h1>
                                    <p className="text-slate-500 mt-2 font-medium">Select a technology to view verified database resources.</p>
                                </header>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {Object.values(skillRegistry).map((skill) => (
                                        <SkillCard key={skill.title} skill={skill} onSelect={() => setSelectedSkill(skill)} />
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            /* --- VIEW 3: SKILL DETAILS --- */
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto">
                                <button
                                    onClick={() => {
                                        setSelectedSkill(null);
                                        localStorage.removeItem('current-open-skill');
                                        window.dispatchEvent(new Event('storageProgressUpdate'));
                                    }}
                                    className="mb-10 flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-all text-xs uppercase tracking-widest"
                                >
                                    <ArrowLeft size={14} /> Back to Library
                                </button>

                                <div className="bg-white border border-slate-100 rounded-[32px] p-8 lg:p-12 shadow-xl shadow-slate-200/40 mb-10 overflow-hidden relative">
                                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${selectedSkill.color} opacity-5 blur-3xl -mr-20 -mt-20`} />

                                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                                        <div className={`w-28 h-28 bg-gradient-to-br ${selectedSkill.color} rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20 shrink-0`}>
                                            {React.cloneElement(selectedSkill.icon, { size: 48 })}
                                        </div>
                                        <div className="text-center md:text-left">
                                            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border border-indigo-100">Verified Path</span>
                                                <span className="text-slate-300 text-[10px] font-black uppercase tracking-tighter">• {selectedSkill.priority}</span>
                                            </div>
                                            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">{selectedSkill.title}</h1>
                                            <button
                                                onClick={handleStartLearning}
                                                className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10"
                                            >
                                                <Play size={18} fill="currentColor" /> Open Resource <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2">Primary Curriculum</h3>
                                    <div
                                        className="group bg-white p-8 rounded-[28px] border border-slate-100 flex items-center justify-between hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer"
                                        onClick={handleStartLearning}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                                <Zap size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-slate-900">Mastery Playlist</h4>
                                                <p className="text-sm text-slate-500 font-medium">Watch 9+ Lectures directly inside this project.</p>
                                            </div>
                                        </div>
                                        <ExternalLink size={20} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

const SkillCard = ({ skill, onSelect }: any) => (
    <motion.div
        whileHover={{ y: -8 }}
        onClick={onSelect}
        className="group relative bg-white p-8 rounded-[32px] border border-slate-100 cursor-pointer transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-slate-200"
    >
        <div className={`w-14 h-14 bg-gradient-to-br ${skill.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {React.cloneElement(skill.icon, { size: 28 })}
        </div>
        <h4 className="font-bold text-xl text-slate-900 tracking-tight mb-2">{skill.title}</h4>
        <div className="flex items-center justify-between mt-4">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{skill.priority}</span>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ChevronRight size={16} />
            </div>
        </div>
    </motion.div>
);