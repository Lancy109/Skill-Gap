"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { UserProfileProvider } from '@/lib/UserProfileContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <UserProfileProvider>
            <div className="min-h-screen bg-[#F8FAFC]">
                <Navbar onToggleNav={() => setIsCollapsed(!isCollapsed)} />
                <div className="flex pt-0">
                    <Sidebar isCollapsed={isCollapsed} />
                    <main className="flex-1 overflow-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </UserProfileProvider>
    );
}

