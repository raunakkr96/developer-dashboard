/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FolderGit2, 
  Flame, 
  Terminal, 
  Plus, 
  Hash, 
  Code2, 
  Star, 
  Trash2, 
  CheckCircle2, 
  FolderOpen, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Project, ProgrammingLanguage, LinesOfCodeHistory } from '../types';
import TrendLineChart from './TrendLineChart';

interface DashboardViewProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  streak: number;
  setStreak: (streak: number | ((s: number) => number)) => void;
  locHistory: LinesOfCodeHistory[];
  onRandomizeLOC: () => void;
  setActiveTab: (tab: 'dashboard' | 'projects' | 'analytics') => void;
}

export default function DashboardView({
  projects,
  setProjects,
  streak,
  setStreak,
  locHistory,
  onRandomizeLOC,
  setActiveTab,
}: DashboardViewProps) {
  // Logger states
  const [name, setName] = useState('');
  const [language, setLanguage] = useState<ProgrammingLanguage>('TypeScript');
  const [linesOfCode, setLinesOfCode] = useState<number>(500);
  const [status, setStatus] = useState<Project['status']>('Active');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Local stats calculations
  const activeCount = projects.filter((p) => p.status === 'Active').length;
  const totalLines = projects.reduce((acc, p) => acc + p.linesOfCode, 0);

  // Handle logging a new project
  const handleLogProject = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Project or script name is required.');
      return;
    }

    if (linesOfCode < 0) {
      setErrorMessage('Lines of code cannot be negative.');
      return;
    }

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: name.trim(),
      language,
      linesOfCode: Number(linesOfCode) || 120,
      status,
      createdAt: new Date().toISOString().split('T')[0],
      starred: false,
    };

    setProjects((prev) => [newProject, ...prev]);
    setName('');
    setLinesOfCode(500);
    setStatus('Active');
    
    setSuccessMessage(`Registry logged: "${newProject.name}" added.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Toggle Project Starred State
  const toggleStar = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p))
    );
  };

  // Toggle Project Status Cycle
  const toggleStatus = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus: Project['status'] = 
            p.status === 'Active' ? 'Completed' : p.status === 'Completed' ? 'On Hold' : 'Active';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Delete project from list
  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Adjust streak modifier
  const adjustStreak = (amount: number) => {
    setStreak((prev) => Math.max(0, prev + amount));
  };

  return (
    <div className="space-y-8" id="dashboard-view-root">
      
      {/* Visual Title Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-geo-dark pb-6 gap-4" id="welcome-heading-section">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase font-sans">
            System Overview
          </h1>
          <p className="text-geo-teal text-xs font-mono uppercase tracking-[0.2em] mt-1">
            CYBERNETIC WORKSPACE HARNESS // REALTIME STATISTICS
          </p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-[10px] uppercase text-geo-teal font-black tracking-widest font-mono">
            Telemetry Feed
          </div>
          <div className="text-xs text-geo-light font-mono flex items-center md:justify-end gap-1.5 mt-0.5">
            <Terminal size={12} className="text-geo-cyan" />
            <span>SYNC NODE: STATUS_OK</span>
          </div>
        </div>
      </header>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="metric-cards-grid">
        
        {/* CARD 1: Active Projects */}
        <div 
          id="metric-card-active-projects"
          className="bg-geo-dark p-6 border-t-2 border-geo-cyan shadow-xl rounded-none flex flex-col justify-between"
        >
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] font-black text-geo-teal mb-4">
              Active Projects
            </div>
            
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-white tracking-tight font-sans">
                {activeCount}
              </span>
              <span className="text-geo-light/60 text-xs font-mono lowercase">
                / {projects.length} total repos
              </span>
            </div>
            
            <p className="text-xs text-geo-light/80 mt-3 flex items-center gap-1.5 font-mono">
              <FolderOpen size={12} className="text-geo-teal" />
              <span>{projects.filter(p => p.status === 'Completed').length} ARCHIVED REPOS</span>
            </p>
          </div>

          <button
            onClick={() => setActiveTab('projects')}
            className="w-full mt-6 bg-geo-cyan hover:bg-geo-teal text-geo-black hover:text-white px-4 py-2.5 font-black uppercase text-xs tracking-widest transition-colors cursor-pointer rounded-none border border-transparent"
          >
            Manage Repositories
          </button>
        </div>

        {/* CARD 2: Lines of Code This Week */}
        <div 
          id="metric-card-loc-chart"
          className="bg-geo-dark p-6 border-t-2 border-geo-teal shadow-xl rounded-none flex flex-col justify-between"
        >
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] font-black text-geo-teal mb-3 flex justify-between items-center">
              <span>Lines Of Code</span>
              <span className="text-xs font-mono text-geo-cyan font-bold">{totalLines.toLocaleString()} LOC</span>
            </div>
          </div>

          {/* SVG line chart */}
          <div className="flex-1 mt-1 justify-end min-h-[140px]">
            <TrendLineChart data={locHistory} onRandomize={onRandomizeLOC} />
          </div>
        </div>

        {/* CARD 3: Daily Streak */}
        <div 
          id="metric-card-daily-streak"
          className="bg-geo-dark p-6 border-t-2 border-geo-cyan shadow-xl rounded-none relative overflow-hidden flex flex-col justify-between"
        >
          {/* Quick interactive stream manual overrides */}
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            <button 
              onClick={() => adjustStreak(-1)}
              className="w-5 h-5 bg-geo-black text-geo-light hover:text-geo-cyan border border-geo-teal/30 hover:border-geo-teal flex items-center justify-center text-xs font-extrabold transition cursor-pointer"
              title="Decrement streak"
            >
              -
            </button>
            <button 
              onClick={() => adjustStreak(1)}
              className="w-5 h-5 bg-geo-cyan text-geo-black hover:bg-geo-teal hover:text-white flex items-center justify-center text-xs font-black transition cursor-pointer"
              title="Increment streak"
            >
              +
            </button>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] font-black text-geo-teal mb-4">
              Daily Streak Index
            </div>

            <div className="text-5xl font-black text-white flex items-baseline gap-2 relative z-5">
              <span>{streak}</span>
              <span className="text-3xl animate-pulse">🔥</span>
            </div>

            <p className="text-xs text-geo-light/80 mt-4 leading-relaxed font-sans">
              Deploy checks and logs daily to fuel the core combustion index matrix.
            </p>
          </div>

          <div className="absolute -right-4 -bottom-4 opacity-5 text-8xl grayscale select-none pointer-events-none">
            ⚡
          </div>

          <div className="mt-4 pt-3 border-t border-geo-dark/50 flex items-center justify-between text-[10px] font-mono text-geo-teal uppercase tracking-widest">
            <span>Streak health:</span>
            <span className="text-geo-cyan font-bold">OPTIMAL</span>
          </div>
        </div>

      </div>

      {/* QUICK LOGGER & TABLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="dashboard-table-logger-layout">
        
        {/* Logger input container - col span 1 */}
        <div 
          className="bg-geo-dark p-8 border border-geo-teal/30 rounded-none shadow-xl flex flex-col h-full" 
          id="logger-panel"
        >
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-black text-white uppercase tracking-widest font-sans flex items-center gap-2">
                <Sparkles size={14} className="text-geo-cyan" />
                <span>Quick Project Logger</span>
              </h2>
            </div>
            <div className="h-[1px] w-full bg-geo-teal/20" />
            <p className="text-xs text-geo-light/60 mt-2 font-mono">
              REGISTER NEW REPOSITORIES TO SYSTEM
            </p>
          </div>

          <form onSubmit={handleLogProject} className="space-y-4 flex-1 flex flex-col justify-between" id="logger-form">
            <div className="space-y-4">
              {/* Field A: Name */}
              <div>
                <label htmlFor="project-name-input" className="block text-[10px] font-bold text-geo-teal uppercase tracking-widest mb-1.5 font-mono">
                  Repository Name
                </label>
                <input
                  id="project-name-input"
                  type="text"
                  placeholder="e.g. quantum-gateway, core-engine"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-geo-black border border-geo-teal text-white w-full px-4 py-2 focus:outline-none focus:border-geo-cyan transition-colors text-sm rounded-none font-mono"
                  maxLength={50}
                />
              </div>

              {/* Grid selectors for Language & Lines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Field B: Language */}
                <div>
                  <label htmlFor="project-lang-select" className="block text-[10px] font-bold text-geo-teal uppercase tracking-widest mb-1.5 font-mono">
                    Language
                  </label>
                  <select
                    id="project-lang-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
                    className="bg-geo-black border border-geo-teal text-white w-full px-3 py-2 focus:outline-none focus:border-geo-cyan transition-colors text-sm rounded-none cursor-pointer hover:bg-geo-dark font-mono appearance-none"
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                  </select>
                </div>

                {/* Field C: Lines of Code estimate */}
                <div>
                  <label htmlFor="project-loc-input" className="block text-[10px] font-bold text-geo-teal uppercase tracking-widest mb-1.5 font-mono">
                    Lines Count
                  </label>
                  <input
                    id="project-loc-input"
                    type="number"
                    min="1"
                    max="1000000"
                    value={linesOfCode}
                    onChange={(e) => setLinesOfCode(Math.max(1, Number(e.target.value)))}
                    className="bg-geo-black border border-geo-teal text-white w-full px-3 py-2 focus:outline-none focus:border-geo-cyan transition-colors text-sm rounded-none font-mono"
                  />
                </div>
              </div>

              {/* Status field */}
              <div>
                <label className="block text-[10px] font-bold text-geo-teal uppercase tracking-widest mb-1.5 font-mono">
                  Initial Stage Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Active', 'Completed', 'On Hold'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-1.5 text-xs text-center font-mono font-bold uppercase transition-all cursor-pointer border rounded-none ${
                        status === s
                          ? 'bg-geo-cyan text-geo-black border-geo-cyan'
                          : 'border-geo-teal/40 hover:border-geo-teal text-geo-light bg-geo-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error notifications and Actions */}
            <div className="mt-6 pt-4 border-t border-geo-dark/50 space-y-3">
              {errorMessage && (
                <div className="flex items-center gap-2 p-2 px-3 text-xs text-rose-500 bg-rose-950/20 border border-rose-900 font-mono">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>ERR: {errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="flex items-center gap-2 p-2 px-3 text-xs text-geo-cyan bg-geo-dark border border-geo-teal/50 font-mono">
                  <CheckCircle2 size={12} className="shrink-0" />
                  <span>LOGOK: {successMessage}</span>
                </div>
              )}

              <button
                id="submit-logger-btn"
                type="submit"
                className="w-full bg-geo-cyan hover:bg-geo-teal text-geo-black hover:text-white px-8 py-3 font-black uppercase text-xs tracking-widest transition-colors cursor-pointer rounded-none flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                <span>Add Project Registry</span>
              </button>
            </div>
          </form>
        </div>

        {/* Dynamic Project Table Component - col span 2 */}
        <div 
          className="bg-geo-dark p-6 border border-geo-teal/30 rounded-none shadow-xl flex flex-col lg:col-span-2 overflow-hidden" 
          id="table-panel"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-sans">
                Logged Repositories
              </h3>
              <p className="text-[10px] text-geo-teal mt-1 font-mono">
                REAL TIME LOCAL TRACKING BLOCK BUFFER
              </p>
            </div>
            
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-geo-cyan hover:text-geo-teal font-extrabold font-mono tracking-widest uppercase hover:underline flex items-center gap-1 cursor-pointer align-middle"
            >
              <span>View All Repos</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Table Container scroll wrapper */}
          <div className="flex-1 overflow-x-auto" id="dashboard-table-container">
            {projects.length === 0 ? (
              <div className="h-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center text-geo-light font-mono border border-dashed border-geo-teal/20 rounded-none bg-geo-black/30">
                <Code2 size={36} className="text-geo-teal mb-2" />
                <p className="text-sm font-bold text-white uppercase tracking-wider">No active files</p>
                <p className="text-xs text-geo-light/50 max-w-xs mt-1">
                  Type repository parameters in the Quick Logger to append to tracking database.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse" id="projects-data-table">
                <thead className="bg-[#0B0C10] border-b border-[#45A29E]/30">
                  <tr className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#45A29E]">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Language</th>
                    <th className="px-4 py-3 font-mono">Lines Count</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-[#45A29E]/10 font-mono">
                  {projects.slice(0, 5).map((project) => {
                    const statusColorMap = {
                      Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35',
                      Completed: 'bg-geo-cyan/10 text-geo-cyan border-geo-cyan/35',
                      'On Hold': 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                    };

                    const langColorMap = {
                      TypeScript: 'text-geo-cyan bg-geo-teal/10 border-geo-teal/30',
                      JavaScript: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                      Python: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
                    };

                    return (
                      <tr 
                        key={project.id} 
                        id={`project-row-${project.id}`}
                        className="hover:bg-geo-black/35 transition-colors group/row"
                      >
                        {/* Name Column */}
                        <td className="py-3 px-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleStar(project.id)}
                              className={`p-1 rounded-none transition ${
                                project.starred 
                                  ? 'text-amber-400' 
                                  : 'text-geo-teal/40 hover:text-geo-cyan'
                              }`}
                              title={project.starred ? 'Starred' : 'Star project'}
                            >
                              <Star size={12} fill={project.starred ? '#fbbf24' : 'none'} className="cursor-pointer" />
                            </button>
                            <span className="truncate max-w-[120px] sm:max-w-xs block" title={project.name}>
                              {project.name}
                            </span>
                          </div>
                        </td>

                        {/* Language Badge */}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-none border text-[10px] uppercase font-bold font-mono ${langColorMap[project.language]}`}>
                            {project.language}
                          </span>
                        </td>

                        {/* Lines count */}
                        <td className="py-3 px-4 font-mono text-geo-light font-bold">
                          {project.linesOfCode.toLocaleString()}
                        </td>

                        {/* Status Toggle Cycle Button */}
                        <td className="py-3 px-4">
                          <button
                            id={`status-toggle-${project.id}`}
                            onClick={() => toggleStatus(project.id)}
                            className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border rounded-none cursor-pointer ${
                              statusColorMap[project.status]
                            }`}
                            title="Click to cycle status"
                          >
                            <span>{project.status}</span>
                          </button>
                        </td>

                        {/* Row Actions */}
                        <td className="py-3 px-4 text-right">
                          <button
                            id={`delete-btn-${project.id}`}
                            onClick={() => deleteProject(project.id)}
                            className="p-1 px-2 hover:bg-rose-950/40 hover:text-rose-400 border border-transparent hover:border-rose-900 text-geo-teal/40 rounded-none transition-all duration-150 cursor-pointer text-[10px] font-bold"
                            title="Prune Registry"
                          >
                            <Trash2 size={11} className="inline mr-1" />
                            <span>DEL</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer Page Details */}
          {projects.length > 5 && (
            <div className="mt-3 pt-3 border-t border-geo-teal/20 flex items-center justify-between text-[10px] font-mono text-geo-teal tracking-wider uppercase bg-geo-black/30 p-2">
              <span>Showing 5 latest registries</span>
              <button 
                onClick={() => setActiveTab('projects')}
                className="text-geo-cyan hover:underline font-extrabold cursor-pointer"
              >
                Manage all {projects.length} repository files
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
