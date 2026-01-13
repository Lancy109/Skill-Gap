"use client";
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, ShieldCheck, Star, Youtube, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar'; 
import Sidebar from '@/components/Sidebar';

const CreatorPage = () => {
  const [isNavCollapsed, setNavCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nav-collapsed");
    if (saved !== null) setNavCollapsed(saved === "true");
    setIsMounted(true);
  }, []);

  const handleToggleNav = () => {
    setNavCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem("nav-collapsed", newState);
      return newState;
    });
  };

  // Fixed URLs using reliable UI-Avatars service
  const creators = [
    { 
      name: "Shradha Khapra", 
      role: "Apna College", 
      exp: "Ex-Microsoft", 
      rating: "5.0", 
      tags: ["C++", "Java", "DSA"], 
      avatar: "https://yt3.googleusercontent.com/FEcjRtez5od8UowDo6tTt9WlE-MrIFEmcwPMTORmK9Swk6KCklOmA3xfIG9WuLWfNYfNThQE=s160-c-k-c0x00ffffff-no-rj",
      link: "https://youtube.com/@apnacollegeofficial"
    },
    { 
      name: "Mosh Hamedani", 
      role: "Programming with Mosh", 
      exp: "Senior Architect", 
      rating: "4.9", 
      tags: ["Python", "React", "Node.js"], 
      avatar: "https://yt3.googleusercontent.com/HCv0fXFEEcD0HRyF0_qR1K7b7qO3KCzmIoyH1DEJYB94CIUFhIE5i2t2IDIPX97W1-DK4hegww=s160-c-k-c0x00ffffff-no-rj",
      link: "https://youtube.com/@programmingwithmosh"
    },
    { 
      name: "Harry", 
      role: "CodeWithHarry", 
      exp: "Software Engineer", 
      rating: "5.0", 
      tags: ["Web Dev", "Python", "Android"], 
      avatar: "https://yt3.googleusercontent.com/ytc/AIdro_kX3sdbuu3KFmRPsmlu0R5Rx_BhpxwupjtvJmkEdNfla7w=s160-c-k-c0x00ffffff-no-rj",
      link: "https://youtube.com/@codewithharry"
    },
    { 
      name: "Neeraj Walia", 
      role: "EzSnippet", 
      exp: "Tech Content Creator", 
      rating: "4.8", 
      tags: ["MERN", "Tips", "Tech"], 
      avatar: "https://yt3.googleusercontent.com/sQlwCNEVDQ-BQ0n-cyHkZ2WykIaz9mCxiq4SlbWjbITYulw75dJQW__AW42O4Y6FfVzaZR-ZBA=s160-c-k-c0x00ffffff-no-rj",
      link: "https://youtube.com/@ezsnippat"
    },
    { 
      name: "Bro Code", 
      role: "Full Stack Master", 
      exp: "10+ Yrs Exp", 
      rating: "5.0", 
      tags: ["JavaScript", "C#", "SQL"], 
      avatar: "https://yt3.googleusercontent.com/ytc/AIdro_mPFVsxROj1dOtTWc9iNBwDYV4z42Q8LPokBSewiW9pCSg=s160-c-k-c0x00ffffff-no-rj",
      link: "https://youtube.com/@brocodez"
    },
    { 
      name: "SuperSimpleDev", 
      role: "Career Specialist", 
      exp: "Senior Dev", 
      rating: "4.9", 
      tags: ["Frontend", "HTML", "CSS"], 
      avatar: "https://yt3.googleusercontent.com/ytc/AIdro_laf9dDyNATE1_RdVUKthwnwT9TSm9N0my0jL2H8gCvjw=s160-c-k-c0x00ffffff-no-rj",
      link: "https://youtube.com/@supersimpledev"
    },
    { 
      name: "Quincy Larson", 
      role: "freeCodeCamp", 
      exp: "Community Lead", 
      rating: "5.0", 
      tags: ["Certifications", "Backend", "AI"], 
      avatar: "https://yt3.googleusercontent.com/ytc/AIdro_lGRc-05M2OoE1ejQdxeFhyP7OkJg9h4Y-7CK_5je3QqFI=s160-c-k-c0x00ffffff-no-rj",
      link: "https://youtube.com/@freecodecamp"
    },
    { 
      name: "Leo", 
      role: "CS Dojo", 
      exp: "Ex-Google", 
      rating: "4.7", 
      tags: ["Python", "Algorithms", "Career"], 
      avatar: "https://yt3.googleusercontent.com/ytc/AIdro_mxJvgrBjcgK94ZJQwDphl0UFkCKRL8AOa7UvmR__MIyg=s160-c-k-c0x00ffffff-no-rj",
      link: "https://youtube.com/@csdojo"
    },
    { 
      name: "Shaun Pelling", 
      role: "The Net Ninja", 
      exp: "Master Instructor", 
      rating: "5.0", 
      tags: ["Firebase", "Vue", "Flutter"], 
      avatar: "https://yt3.googleusercontent.com/ytc/AIdro_mk2Ex-8sW03SBlBX7D1EC5skH0kv9rS3rU9IXq2I-q2Zg=s160-c-k-c0x00ffffff-no-rj",
      link: "https://youtube.com/@netninja"
    }
  ];

  if (!isMounted) return <div className="min-h-screen bg-[#F8FAFC]" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-700 font-sans">
      <Navbar onToggleNav={handleToggleNav} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isNavCollapsed} />
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key="creator-content"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto space-y-10"
            >
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Verified Educators</h1>
                  <p className="text-slate-500 mt-2 font-medium">Industry-leading creators shaping the future of tech education.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  YouTube Partner Verified
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creators.map((expert, idx) => (
                  <ExpertCard key={idx} expert={expert} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const ExpertCard = ({ expert }) => {
  const [imgSrc, setImgSrc] = useState(expert.avatar);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all group"
    >
      <div className="flex items-start gap-4 mb-4">   
        <div className="relative shrink-0">
          <img 
            src={imgSrc} 
            className="w-16 h-16 rounded-xl object-cover border border-slate-100" 
            alt={expert.name}
            onError={() => setImgSrc(`https://ui-avatars.com/api/?name=${expert.name}&background=random`)} 
          />
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-slate-100">
            <Youtube size={12} className="text-red-500 fill-red-500" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{expert.name}</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{expert.role}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-tighter">
              <Briefcase size={10} /> {expert.exp}
            </span>
            <span className="flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-tighter">
              <Star size={10} className="fill-amber-600" /> {expert.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {expert.tags.map((tag, i) => (
          <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 transition-colors group-hover:bg-white group-hover:border-indigo-50">
            {tag}
          </span>
        ))}
      </div>

      <a 
        href={expert.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-[11px] font-bold hover:bg-red-600 transition-all shadow-lg shadow-slate-200 hover:shadow-red-200"
      >
        YouTube Channel <ExternalLink size={12} />
      </a>
    </motion.div>
  );
};

export default CreatorPage;