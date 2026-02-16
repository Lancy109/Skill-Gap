"use client";

import React, { useState, useEffect } from 'react';
import {
    Code2, Database, Layout, Smartphone, Cpu, Server,
    Zap, ArrowLeft, Play, ExternalLink, Globe, Coffee, ChevronRight, X, Sparkles, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
// ...existing code...
import SummaryModal from '@/components/SummaryModal';
import { syncProgressToDb, recordLectureProgress } from '@/actions/progress';
import { summarizeVideo } from '@/actions/ai';

const CoffeeIcon = () => <Coffee size={20} />;

const skillRegistry: Record<string, any> = {
    "Python": { title: "Python", category: "Backend", priority: "Recommended", icon: <Code2 />, color: "from-blue-500 to-blue-700" },
    "C": { title: "C", category: "Backend", priority: "Medium Priority", icon: <Cpu />, color: "from-purple-500 to-purple-700" },
    "Advanced JavaScript": { title: "Advanced JavaScript", category: "Frontend", priority: "High Priority", icon: <Code2 />, color: "from-amber-400 to-orange-500" },
    "NodeJS": { title: "NodeJS", category: "Backend", priority: "High Priority", icon: <Server />, color: "from-emerald-500 to-green-700" },
    "Java": { title: "Java", category: "Backend", priority: "Recommended", icon: <CoffeeIcon />, color: "from-red-500 to-red-700" },
    "SQL": { title: "SQL", category: "Backend", priority: "High Priority", icon: <Database />, color: "from-orange-400 to-orange-600" },
    "Kotlin": { title: "Kotlin", category: "Mobile", priority: "Recommended", icon: <Smartphone />, color: "from-indigo-500 to-blue-600" },
    "TypeScript": { title: "TypeScript", category: "Frontend", priority: "High Priority", icon: <Code2 />, color: "from-sky-400 to-blue-500" },
    "C++": { title: "C++", category: "Backend", priority: "Medium Priority", icon: <Cpu />, color: "from-blue-600 to-indigo-800" },
    "Swift": { title: "Swift", category: "Mobile", priority: "Recommended", icon: <Smartphone />, color: "from-orange-500 to-rose-500" },
    "Flutter": { title: "Flutter", category: "Mobile", priority: "Recommended", icon: <Layout />, color: "from-cyan-400 to-blue-500" },
    "React": { title: "React", category: "Frontend", priority: "Recommended", icon: <Layout />, color: "from-blue-400 to-indigo-500" },
    "HTML & CSS": { title: "HTML & CSS", category: "Frontend", priority: "High Priority", icon: <Globe />, color: "from-pink-500 to-rose-600" }
};

export default function BrowseClient({ initialPlaylists, userId = "default_user" }: { initialPlaylists: any[], userId?: string }) {
    const { user } = useUser();
    const effectiveUserId = user?.id || userId;
    const [isMounted, setIsMounted] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<any>(null);
    const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
    const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
    const [resumePosition, setResumePosition] = useState<number>(0); // optional seconds

    // Summarizer States
    const [showSummary, setShowSummary] = useState(false);
    const [summaryText, setSummaryText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const USER_PROGRESS_KEY = `skill-gap-progress-${effectiveUserId}`;

    useEffect(() => {
        setIsMounted(true);

        const skillName = searchParams.get('skill');
        const resumeVideo = searchParams.get('video');
        if (skillName && skillRegistry[skillName]) setSelectedSkill(skillRegistry[skillName]);

        const progress = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || "{}");
        if (skillName && progress[skillName]) {
            if (progress[skillName].watched) {
                setWatchedVideos(progress[skillName].watched);
            }
            if (resumeVideo) {
                setActiveVideoId(resumeVideo);
                // optional: restore stored position if we saved one
                const idx = progress[skillName].history?.find((h: any) => h.videoId === resumeVideo);
                if (idx?.position) setResumePosition(idx.position);
            }
        }
    }, [searchParams, USER_PROGRESS_KEY, user]);

    useEffect(() => {
        if (selectedSkill) {
            const progress = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || "{}");
            if (progress[selectedSkill.title]) {
                if (progress[selectedSkill.title].watched) {
                    setWatchedVideos(progress[selectedSkill.title].watched);
                }
                if (progress[selectedSkill.title].lastWatched) {
                    setActiveVideoId(progress[selectedSkill.title].lastWatched.videoId);
                    if (progress[selectedSkill.title].lastWatched.position) {
                        setResumePosition(progress[selectedSkill.title].lastWatched.position);
                    }
                }
            } else {
                setWatchedVideos([]);
            }
        }
    }, [selectedSkill, USER_PROGRESS_KEY]);

    const currentPlaylist = selectedSkill ? initialPlaylists.find(p =>
        p.title.toLowerCase().trim() === selectedSkill.title.toLowerCase().trim()
    ) : null;

    // whenever we switch to a new video we may have a stored resume position
    useEffect(() => {
        if (activeVideoId && selectedSkill) {
            const progress = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || "{}");
            const last = progress[selectedSkill.title]?.lastWatched;
            if (last?.videoId === activeVideoId && last.position) {
                setResumePosition(last.position);
            } else {
                setResumePosition(0);
            }
        }
    }, [activeVideoId, selectedSkill, USER_PROGRESS_KEY]);

    const handleStartLearning = async () => {
        if (!selectedSkill || !currentPlaylist) return;

        const rawUrl = currentPlaylist.playlist_url;
        const skillName = selectedSkill.title;

        // record last watched when starting a new skill
        const existing = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || "{}");
        existing[skillName] = existing[skillName] || { watched: [], total: currentPlaylist.videos?.length || 0 };
        existing[skillName].lastWatched = {
            videoId: currentPlaylist.videos?.[0]?.youtube_video_id,
            title: currentPlaylist.videos?.[0]?.title,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(existing));
        window.dispatchEvent(new Event('storageProgressUpdate'));
        // sync with server
        recordLectureProgress(userId, skillName, currentPlaylist.videos?.[0]?.youtube_video_id || '', {
            title: currentPlaylist.videos?.[0]?.title,
            completed: false
        }).catch(() => { });

        if (rawUrl && typeof rawUrl === 'string') {
            try {
                const cleanUrl = rawUrl.trim();
                const url = new URL(cleanUrl);
                const urlParams = new URLSearchParams(url.search);
                const listId = urlParams.get('list');

                if (listId) {
                    setActivePlaylistId(listId);
                    if (currentPlaylist.videos?.[0]) {
                        setActiveVideoId(currentPlaylist.videos[0].youtube_video_id);
                    }
                    localStorage.setItem(`current-open-skill-${effectiveUserId}`, skillName);
                    window.dispatchEvent(new Event("storageProgressUpdate"));
                } else {
                    window.open(cleanUrl, '_blank');
                }
            } catch (e) {
                window.open(rawUrl, '_blank');
            }
        }

        try {
            const totalVideos = currentPlaylist.videos?.length || 0;
            await syncProgressToDb(effectiveUserId, skillName, [], totalVideos);
        } catch (error) {
            console.error("Background sync failed:", error);
        }
    };

    const handleMarkAsCompleted = async () => {
        if (!selectedSkill || !activeVideoId || !currentPlaylist) return;
        let updatedWatched: string[] = [];
        const total = currentPlaylist.videos?.length || 0;
        setWatchedVideos(prev => {
            if (prev.includes(activeVideoId)) { updatedWatched = prev; return prev; }
            updatedWatched = [...prev, activeVideoId];
            const existing = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || "{}");
            existing[selectedSkill.title] = existing[selectedSkill.title] || { watched: [], total };
            existing[selectedSkill.title].watched = updatedWatched;
            existing[selectedSkill.title].total = total;

            // update lastWatched as well
            existing[selectedSkill.title].lastWatched = {
                videoId: activeVideoId!,
                title: currentPlaylist.videos.find((v: any) => v.youtube_video_id === activeVideoId)?.title,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(existing));
            window.dispatchEvent(new Event("storageProgressUpdate"));
            return updatedWatched;
        });
        await syncProgressToDb(effectiveUserId, selectedSkill.title, updatedWatched, total);
        // also record a lecture event with completion flag
        await recordLectureProgress(userId, selectedSkill.title, activeVideoId!, {
            title: currentPlaylist.videos.find((v: any) => v.youtube_video_id === activeVideoId)?.title,
            completed: true
        });
        const currentIndex = currentPlaylist.videos.findIndex((v: any) => v.youtube_video_id === activeVideoId);
        if (currentIndex !== -1 && currentIndex < currentPlaylist.videos.length - 1) {
            setActiveVideoId(currentPlaylist.videos[currentIndex + 1].youtube_video_id);
        }
    };

    const handleSummarize = async () => {
        if (!activeVideoId) return;

        const currentVideo = currentPlaylist?.videos?.find((v: any) => v.youtube_video_id === activeVideoId);
        const titleToSummarize = currentVideo?.title || selectedSkill?.title || "Technical Video";

        setShowSummary(true);
        setIsGenerating(true);
        setSummaryText("");

        const result = await summarizeVideo(activeVideoId, titleToSummarize);

        if (result.error) {
            setSummaryText(`❌ **AI Error**\n\n${result.error}`);
        } else {
            setSummaryText(result.summary || "No summary available.");
        }
        setIsGenerating(false);
    };

    if (!isMounted) return null;

    return (
        <>
            <SummaryModal
                isOpen={showSummary}
                onClose={() => setShowSummary(false)}
                isLoading={isGenerating}
                summary={summaryText}
            />

            <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-700 font-sans">
                <div className="flex flex-1 overflow-hidden h-full">
                    <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                        <AnimatePresence mode="wait">
                            {activePlaylistId ? (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto">
                                    <button
                                        onClick={() => {
                                            setActivePlaylistId(null);
                                            setActiveVideoId(null);
                                            localStorage.removeItem(`current-open-skill-${effectiveUserId}`);
                                            window.dispatchEvent(new Event('storageProgressUpdate'));
                                        }}
                                        className="mb-6 flex items-center gap-2 text-slate-400 font-bold hover:text-red-500 transition-all text-xs uppercase tracking-widest"
                                    >
                                        <X size={16} /> Close Player
                                    </button>

                                    <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 grid grid-cols-1 lg:grid-cols-4 lg:h-[600px]">
                                        <div className="lg:col-span-3 h-full bg-slate-50">
                                            <iframe
                                                width="100%" height="100%"
                                                src={activeVideoId ? `https://www.youtube.com/embed/${activeVideoId}?list=${activePlaylistId}&autoplay=1&rel=0${resumePosition ? `&start=${resumePosition}` : ''}` : ""}
                                                title="Course Player" frameBorder="0" allowFullScreen className="w-full h-full"
                                            ></iframe>
                                        </div>

                                        <div className="p-6 bg-[#F8FAFC] text-slate-900 border-l border-slate-100 flex flex-col h-full overflow-hidden">
                                            <div className="mb-6 shrink-0">
                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Live Path</span>
                                                <h2 className="text-xl font-black mt-1 truncate text-slate-900">{selectedSkill?.title}</h2>
                                            </div>

                                            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Interactive Steps</p>
                                                    {currentPlaylist?.videos?.map((video: any, index: number) => (
                                                        <div
                                                            key={video.youtube_video_id}
                                                            onClick={() => setActiveVideoId(video.youtube_video_id)}
                                                            className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${activeVideoId === video.youtube_video_id ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white border-slate-100 hover:border-indigo-200 text-slate-600'}`}
                                                        >
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${activeVideoId === video.youtube_video_id ? 'bg-white text-indigo-600' : watchedVideos.includes(video.youtube_video_id) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                                {watchedVideos.includes(video.youtube_video_id) ? '✓' : index + 1}
                                                            </div>
                                                            <span className={`text-[11px] font-bold leading-tight ${activeVideoId === video.youtube_video_id ? 'text-white' : 'text-slate-700'}`}>
                                                                {video.title}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-6 space-y-3 shrink-0">
                                                <button
                                                    onClick={handleSummarize}
                                                    disabled={!activeVideoId || isGenerating}
                                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isGenerating ? <Loader2 size={16} className="animate-spin text-white" /> : <Sparkles size={16} className="text-indigo-200" />}
                                                    {isGenerating ? 'Analyzing...' : 'Summarize Video'}
                                                </button>

                                                <button
                                                    onClick={handleMarkAsCompleted}
                                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    {watchedVideos.includes(activeVideoId || '') ? 'Completed' : 'Mark as Completed'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : !selectedSkill ? (
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
                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto">
                                    <button onClick={() => setSelectedSkill(null)} className="mb-10 flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-all text-xs uppercase tracking-widest"><ArrowLeft size={14} /> Back to Library</button>
                                    <div className="bg-white border border-slate-100 rounded-[32px] p-8 lg:p-12 shadow-xl mb-10 relative overflow-hidden">
                                        <div className={`absolute top-0 right-0 w-64 h-64 bg-linear-to-br ${selectedSkill.color} opacity-5 blur-3xl -mr-20 -mt-20`} />
                                        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                                            <div className={`w-28 h-28 bg-linear-to-br ${selectedSkill.color} rounded-3xl flex items-center justify-center text-white shadow-2xl`}>{React.cloneElement(selectedSkill.icon, { size: 48 })}</div>
                                            <div className="text-center md:text-left">
                                                <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">{selectedSkill.title}</h1>
                                                <button onClick={handleStartLearning} className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl"><Play size={18} fill="currentColor" /> Open Resource</button>
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
                                                    <p className="text-sm text-slate-500 font-medium">Watch {currentPlaylist?.videos?.length || '9+'} Lectures directly inside this project.</p>
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
        </>
    );
}

const SkillCard = ({ skill, onSelect }: any) => (
    <motion.div whileHover={{ y: -8 }} onClick={onSelect} className="group relative bg-white p-8 rounded-[32px] border border-slate-100 cursor-pointer transition-all hover:shadow-xl hover:border-slate-200">
        <div className={`w-14 h-14 bg-linear-to-br ${skill.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>{React.cloneElement(skill.icon, { size: 28 })}</div>
        <h4 className="font-bold text-xl text-slate-900 tracking-tight mb-2">{skill.title}</h4>
        <div className="flex items-center justify-between mt-4">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{skill.priority}</span>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all"><ChevronRight size={16} /></div>
        </div>
    </motion.div>
);
