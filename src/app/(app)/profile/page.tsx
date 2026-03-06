"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { User, Mail, Briefcase, Calendar, FileText, Code2, Edit2, X, Save, Camera, Trash2 } from 'lucide-react';
import { useUserProfile } from '@/lib/UserProfileContext';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { profileImageUrl, setProfileImageUrl } = useUserProfile();
  const [profileData, setProfileData] = useState<Record<string, string | number | null | undefined> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Image upload state
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!isLoaded) return;
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/profile?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const json = await response.json();
        setProfileData(json);
        setFormData(json);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user, isLoaded]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side size limit: 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImage = async () => {
    if (!user || !previewImage) return;
    setIsUploadingImage(true);
    try {
      const response = await fetch(`/api/profile?userId=${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImage: previewImage }),
      });
      if (!response.ok) throw new Error('Failed to save image');
      // Update global context so Navbar reflects the change immediately
      setProfileImageUrl(previewImage);
      setPreviewImage('');
      alert('Profile photo updated!');
    } catch (err) {
      console.error('Error saving image:', err);
      alert('Failed to save image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!user || !window.confirm('Are you sure you want to remove your profile photo?')) return;
    setIsUploadingImage(true);
    try {
      const response = await fetch(`/api/profile?userId=${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImage: null }),
      });
      if (!response.ok) throw new Error('Failed to remove image');
      // Update global context
      setProfileImageUrl('');
      alert('Profile photo removed!');
    } catch (err) {
      console.error('Error removing image:', err);
      alert('Failed to remove image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const response = await fetch(`/api/profile?userId=${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save profile');
      const updated = await response.json();
      setProfileData(updated);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center p-10 min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !profileData) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto w-full text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Profile Unavailable</h1>
        <p className="text-slate-500">Please sign in and complete the setup process to view your profile.</p>
      </div>
    );
  }

  // Determine the displayed avatar: preview > DB image > Clerk image > dicebear fallback
  const displayedAvatar =
    previewImage ||
    profileImageUrl ||
    user?.imageUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name || 'user'}`;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
            <p className="text-slate-500">Manage your learning identity</p>
          </div>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        )}
      </div>

      {/* Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
              <button
                onClick={() => setEditMode(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  disabled
                  placeholder="Enter your email"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed. Contact support to update.</p>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Designation / Role</label>
                <input
                  type="text"
                  value={formData.designation || ''}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g., Software Developer, Student, etc."
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  placeholder="Enter your age"
                  min="1"
                  max="100"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Active Skill */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Active Skill / Focus Area</label>
                <input
                  type="text"
                  value={formData.activeSkill || ''}
                  onChange={e => setFormData({ ...formData, activeSkill: e.target.value })}
                  placeholder="e.g., React, Python, Machine Learning"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Professional Bio</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about your goals and experience"
                  rows={5}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">

        {/* Header Cover Area */}
        <div className="h-32 bg-linear-to-r from-indigo-500 to-purple-600 relative" />

        <div className="px-8 pb-8 relative">
          {/* Avatar with upload button */}
          <div className="absolute -top-12 left-8 group">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md overflow-hidden relative">
              <Image
                src={displayedAvatar}
                alt={String(profileData.name ?? 'User')}
                width={96}
                height={96}
                className="w-full h-full object-cover rounded-full"
                unoptimized={true}
              />
              {/* Camera overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Change photo"
              >
                <Camera size={22} className="text-white" />
              </button>
            </div>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
            {/* Remove photo button */}
            {profileImageUrl && !previewImage && (
              <button
                onClick={handleRemoveImage}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-slate-200 text-red-500 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors z-10"
                title="Remove photo"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Preview save/cancel bar */}
          {previewImage && (
            <div className="absolute top-4 right-8 flex gap-2 z-10">
              <button
                onClick={handleSaveImage}
                disabled={isUploadingImage}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
              >
                <Save size={14} /> {isUploadingImage ? 'Saving...' : 'Save Photo'}
              </button>
              <button
                onClick={() => setPreviewImage('')}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition"
              >
                <X size={14} /> Discard
              </button>
            </div>
          )}

          <div className="pt-16 pb-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{profileData.name || "Learning User"}</h2>
              <div className="flex items-center gap-2 text-indigo-600 font-bold mt-1">
                <Code2 size={16} /> <span>Focused on: {profileData.activeSkill || "General Learning"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">

            {/* Info Items */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Email Address</label>
                  <p className="font-bold text-slate-800">{profileData.email || "No email provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Briefcase size={18} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Designation</label>
                  <p className="font-bold text-slate-800">{profileData.designation || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Age</label>
                  <p className="font-bold text-slate-800">{profileData.age ? `${profileData.age} Years` : "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Bio Area */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/50">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={16} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Professional Bio</h3>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {profileData.bio || "No biography provided. Edit your profile to add one!"}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}