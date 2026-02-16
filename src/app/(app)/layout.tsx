"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar onToggleNav={() => setIsCollapsed(!isCollapsed)} />
            <div className="flex pt-0">
                <Sidebar isCollapsed={isCollapsed} />
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
