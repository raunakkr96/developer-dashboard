/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, FolderGit2, BarChart3, Code2, Flame } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'projects' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'projects' | 'analytics') => void;
  streak: number;
}

export default function Sidebar({ activeTab, setActiveTab, streak }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects' as const, label: 'Projects', icon: FolderGit2 },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside 
      id="app-sidebar"
      className="w-full md:w-64 bg-geo-black border-b md:border-b-0 md:border-r border-geo-dark flex flex-col shrink-0 text-geo-light"
    >
      {/* Brand Header */}
      <div className="p-6 md:py-10 border-b border-geo-dark flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-geo-cyan flex items-center justify-center font-black text-geo-black rounded-sm text-sm">
            D
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white font-sans uppercase">DEV_ENV</h1>
            <p className="text-[9px] text-geo-teal font-mono uppercase tracking-widest">Workspace v2.0</p>
          </div>
        </div>
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 p-4 py-8 space-y-2.5" id="sidebar-navigation">
        <div className="px-3 mb-3 text-[10px] font-bold text-geo-teal uppercase tracking-[0.2em] font-mono">
          System Menu
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 transition-colors text-left cursor-pointer uppercase text-xs tracking-widest font-bold ${
                isActive
                  ? 'bg-geo-dark text-geo-cyan border-l-4 border-geo-cyan'
                  : 'text-geo-light hover:bg-geo-dark hover:text-geo-cyan'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-geo-cyan' : 'text-geo-teal'} />
              <span className="font-sans">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Metrics / User Details */}
      <div className="p-6 border-t border-geo-dark bg-geo-black">
        <div className="p-4 border border-geo-teal/40 bg-geo-dark/20 rounded-sm space-y-2.5">
          <div>
            <div className="text-[9px] uppercase tracking-widest text-geo-teal font-extrabold mb-0.5">CURRENT USER</div>
            <div className="text-xs font-mono font-bold text-white truncate">John Developer</div>
          </div>
          <div className="border-t border-geo-dark/60 pt-2">
            <div className="text-[9px] uppercase tracking-widest text-geo-teal font-extrabold mb-0.5">STREAK METRIC</div>
            <div className="text-xs font-mono font-bold text-geo-cyan flex items-center gap-1.5">
              <span>ACTIVE: {streak} DAYS</span>
              <span className="animate-bounce inline">🔥</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
