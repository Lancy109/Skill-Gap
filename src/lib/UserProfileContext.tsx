"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

interface UserProfileContextValue {
    profileImageUrl: string;
    setProfileImageUrl: (url: string) => void;
    refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextValue>({
    profileImageUrl: '',
    setProfileImageUrl: () => { },
    refreshProfile: async () => { },
});

export function useUserProfile() {
    return useContext(UserProfileContext);
}

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser();
    const [profileImageUrl, setProfileImageUrl] = useState<string>('');

    const refreshProfile = useCallback(async () => {
        if (!isLoaded || !user) return;
        try {
            const res = await fetch(`/api/profile?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                // Custom DB image takes priority over Clerk image
                setProfileImageUrl(
                    data.profileImage ||
                    user.imageUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name || 'user'}`
                );
            } else {
                setProfileImageUrl(
                    user.imageUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName || 'user'}`
                );
            }
        } catch {
            setProfileImageUrl(
                user.imageUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName || 'user'}`
            );
        }
    }, [isLoaded, user]);

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    return (
        <UserProfileContext.Provider value={{ profileImageUrl, setProfileImageUrl, refreshProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
}
