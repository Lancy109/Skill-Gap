"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Pencil, History, Settings, LogOut } from 'lucide-react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/dashboard" },
    { icon: <BookOpen size={20} />, label: "Browse", href: "/browse" },
    { icon: <Pencil size={20} />, label: "Creator", href: "/creator" },
    { icon: <History size={20} />, label: "History", href: "/history" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 70 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      // FIXES:
      // Reverted to fixed height calculation to ensure footer stays at bottom
      className="sticky top-14 h-[calc(100vh-3.5rem)] border-r border-slate-100 bg-white flex flex-col pt-4 shrink-0 z-40 shadow-sm font-sans text-slate-900"
    >
      {/* 1. MENU ITEMS (Scrollable Internal Area) */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar py-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <NavItem
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
              collapsed={isCollapsed}
            />
          </Link>
        ))}
      </div>

      {/* 2. FOOTER (Pinned to Bottom) */}
      <div className="mt-auto px-3 pb-6 space-y-1 border-t border-slate-50 pt-4 bg-white">
        <NavItem icon={<Settings size={20} />} label="Settings" collapsed={isCollapsed} />

        <div onClick={() => signOut(() => router.push("/"))}>
          <NavItem
            icon={<LogOut size={20} />}
            label="Logout"
            collapsed={isCollapsed}
            isLogout
          />
        </div>
      </div>
    </motion.aside>
  );
};

// Internal NavItem Helper
const NavItem = ({ icon, label, active, collapsed, isLogout }: any) => (
  <div className={`
    relative w-full flex items-center transition-all duration-200 rounded-xl font-medium text-sm h-11 cursor-pointer mb-1 overflow-hidden select-none
    ${active ? "text-indigo-600 bg-indigo-50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}
    ${isLogout ? "hover:text-red-600 hover:bg-red-50" : ""}
  `}>
    {/* Icon Container - Always centered */}
    <div className={`flex items-center justify-center h-full aspect-square shrink-0 ${collapsed ? "w-full" : "w-[50px]"}`}>
      {icon}
    </div>

    {/* Label - Hidden when collapsed */}
    {!collapsed && (
      <span className="truncate pr-4 whitespace-nowrap opacity-100 transition-opacity duration-200">
        {label}
      </span>
    )}
  </div>
);

export default Sidebar;