"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Pencil, History, Settings, LogOut } from 'lucide-react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs"; // Import Clerk hook

const Sidebar = ({ isCollapsed }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk(); // Initialize signOut function

  const menuItems = [
    { icon: <LayoutDashboard size={20}/>, label: "Dashboard", href: "/dashboard" },
    { icon: <BookOpen size={20}/>, label: "Browse", href: "/browse" },
    { icon: <Pencil size={20}/>, label: "Creator", href: "/creator" },
    { icon: <History size={20}/>, label: "History", href: "/history" },
  ];

  const handleLogout = async () => {
    // This logs the user out and redirects them to the home page or sign-in page
    await signOut(() => router.push("/")); 
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 70 : 240 }}
      className="border-r border-slate-100 bg-white flex flex-col pt-6 overflow-hidden shrink-0"
    >
      <div className="px-3 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} passHref className="block">
            <NavItem 
              icon={item.icon} 
              label={item.label} 
              active={pathname === item.href} 
              collapsed={isCollapsed} 
            />
          </Link>
        ))}
      </div>
      
      <div className="mt-auto px-3 pb-6 space-y-1 border-t border-slate-50 pt-4">
         <NavItem icon={<Settings size={20}/>} label="Settings" collapsed={isCollapsed} />
         {/* Logout Button linked to Clerk */}
         <div onClick={handleLogout}>
           <NavItem 
            icon={<LogOut size={20}/>} 
            label="Logout" 
            collapsed={isCollapsed} 
            isLogout // Passing a prop to apply hover styles
          />
         </div>
      </div>
    </motion.aside>
  );
};

// Internal NavItem helper
const NavItem = ({ icon, label, active, collapsed, isLogout }) => (
  <div className={`relative w-full flex items-center transition-all duration-200 rounded-xl font-bold text-sm h-11 cursor-pointer
    ${active ? "text-indigo-600 bg-indigo-50/50" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}
    ${isLogout ? "hover:text-red-600 hover:bg-red-50" : ""} // Added red hover for logout
    `}>
    <div className="flex items-center justify-center w-[7px] pr-6.5 min-w-[70px] shrink-0">{icon}</div>
    {!collapsed && <span className="tracking-tight whitespace-nowrap">{label}</span>}
  </div>
);  

export default Sidebar;