/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ProjectsView from './components/ProjectsView';
import AnalyticsView from './components/AnalyticsView';
import { Project, LinesOfCodeHistory } from './types';
import { Code2, Server } from 'lucide-react';

// Starter repositories data to seed if localStorage is empty
const SEED_PROJECTS: Project[] = [
  {
    id: 'proj_seeded_1',
    name: 'api-gateway',
    language: 'TypeScript',
    linesOfCode: 12800,
    status: 'Active',
    createdAt: '2026-05-15',
    starred: true,
  },
  {
    id: 'proj_seeded_2',
    name: 'landing-page-v2',
    language: 'JavaScript',
    linesOfCode: 3200,
    status: 'Completed',
    createdAt: '2026-05-20',
    starred: false,
  },
  {
    id: 'proj_seeded_3',
    name: 'data-classification-model',
    language: 'Python',
    linesOfCode: 9500,
    status: 'On Hold',
    createdAt: '2026-05-10',
    starred: true,
  },
  {
    id: 'proj_seeded_4',
    name: 'user-auth-service',
    language: 'TypeScript',
    linesOfCode: 4500,
    status: 'Active',
    createdAt: '2026-05-24',
    starred: false,
  },
];

// Starter LOC trends
const SEED_LOC_HISTORY: LinesOfCodeHistory[] = [
  { day: 'Mon', lines: 120 },
  { day: 'Tue', lines: 450 },
  { day: 'Wed', lines: 320 },
  { day: 'Thu', lines: 855 },
  { day: 'Fri', lines: 580 },
  { day: 'Sat', lines: 1120 },
  { day: 'Sun', lines: 940 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'analytics'>('dashboard');
  
  // Load initial states from localStorage or use seeded datasets
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('devsuite_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing localStorage projects:', e);
      }
    }
    return SEED_PROJECTS;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('devsuite_streak');
    return saved !== null ? Number(saved) : 12; // default 12 days streak
  });

  const [locHistory, setLocHistory] = useState<LinesOfCodeHistory[]>(() => {
    const saved = localStorage.getItem('devsuite_loc_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed parsing localStorage LOC history:', e);
      }
    }
    return SEED_LOC_HISTORY;
  });

  // Sync to localStorage when projects or stats modify
  useEffect(() => {
    localStorage.setItem('devsuite_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('devsuite_streak', String(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('devsuite_loc_history', JSON.stringify(locHistory));
  }, [locHistory]);

  // Handle random trend line regeneration
  const handleRandomizeLOC = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const newHistory = days.map((day) => {
      // Create random LOC with slight upward trend for weekend pushes
      const multiplier = day === 'Sat' || day === 'Sun' ? 1.4 : 1.0;
      const lines = Math.floor((Math.random() * 850 + 150) * multiplier);
      return { day, lines };
    });
    setLocHistory(newHistory);
  };

  return (
    <div id="devsuite-app-container" className="flex flex-col md:flex-row min-h-screen bg-geo-black font-sans text-geo-light antialiased overflow-hidden">
      
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        streak={streak} 
      />

      {/* Main Content Area */}
      <main id="main-content-scrollable" className="flex-1 overflow-y-auto h-screen relative bg-geo-black">
        
        {/* Top Floating App Bar */}
        <header className="sticky top-0 bg-geo-black/95 backdrop-blur-md border-b border-geo-dark px-6 py-4 flex items-center justify-between z-30">
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-geo-dark text-geo-cyan px-2.5 py-1 rounded-none font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 border border-geo-cyan/20">
              <span className="w-1.5 h-1.5 rounded-full bg-geo-cyan animate-ping" />
              <span>Developer Workspace</span>
            </span>
            <span className="hidden sm:inline text-geo-dark">|</span>
            <span className="hidden sm:inline text-xs font-mono text-geo-teal">Timezone UTC</span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center gap-1 bg-geo-dark text-geo-light p-1.5 px-3 rounded-none border border-geo-teal/40">
              <Server size={12} className="text-geo-cyan" />
              <span className="font-semibold text-[10px] tracking-wider uppercase">PREVIEW NODE [OK]</span>
            </div>
          </div>
        </header>

        {/* View render hub container with padding boundaries */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
          {activeTab === 'dashboard' && (
            <DashboardView 
              projects={projects}
              setProjects={setProjects}
              streak={streak}
              setStreak={setStreak}
              locHistory={locHistory}
              onRandomizeLOC={handleRandomizeLOC}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView 
              projects={projects}
              setProjects={setProjects}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView 
              projects={projects}
              streak={streak}
            />
          )}
        </div>

      </main>

    </div>
  );
}
