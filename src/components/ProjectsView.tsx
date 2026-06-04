/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Trash2, 
  Edit2, 
  FolderGit2, 
  Plus, 
  Code2, 
  Save, 
  X, 
  CheckCircle2, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Project, ProgrammingLanguage } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export default function ProjectsView({ projects, setProjects }: ProjectsViewProps) {
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [langFilter, setLangFilter] = useState<'All' | ProgrammingLanguage>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | Project['status']>('All');
  const [starredOnly, setStarredOnly] = useState(false);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editLang, setEditLang] = useState<ProgrammingLanguage>('TypeScript');
  const [editLines, setEditLines] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<Project['status']>('Active');

  // Creation form states
  const [showCreator, setShowCreator] = useState(false);
  const [creatorName, setCreatorName] = useState('');
  const [creatorLang, setCreatorLang] = useState<ProgrammingLanguage>('TypeScript');
  const [creatorLines, setCreatorLines] = useState(250);
  const [creatorStatus, setCreatorStatus] = useState<Project['status']>('Active');

  // Trigger creator logging
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorName.trim()) return;

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: creatorName.trim(),
      language: creatorLang,
      linesOfCode: Number(creatorLines) || 100,
      status: creatorStatus,
      createdAt: new Date().toISOString().split('T')[0],
      starred: false,
    };

    setProjects((prev) => [newProject, ...prev]);
    setCreatorName('');
    setCreatorLines(250);
    setCreatorStatus('Active');
    setShowCreator(false);
  };

  // Toggle Project Starred
  const toggleStar = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p))
    );
  };

  // Delete project
  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Turn edit mode ON
  const startEditing = (p: Project) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditLang(p.language);
    setEditLines(p.linesOfCode);
    setEditStatus(p.status);
  };

  // Save changes
  const saveChanges = (id: string) => {
    if (!editName.trim()) return;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: editName.trim(),
              language: editLang,
              linesOfCode: Number(editLines) || 0,
              status: editStatus,
            }
          : p
      )
    );
    setEditingId(null);
  };

  // Filter computations
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = langFilter === 'All' || p.language === langFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesStarred = !starredOnly || p.starred;
    return matchesSearch && matchesLang && matchesStatus && matchesStarred;
  });

  return (
    <div className="space-y-8" id="projects-view-root">
      
      {/* Top action header bar */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-geo-dark pb-6" id="projects-title-container">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter font-sans">
            Registry Index
          </h1>
          <p className="text-geo-teal text-xs font-mono uppercase tracking-[0.2em] mt-1">
            EXPLORE AND RECONFIGURE CONSOLE SUITE DIRECTORIES
          </p>
        </div>

        <button
          id="toggle-project-creator-btn"
          onClick={() => setShowCreator(!showCreator)}
          className="bg-geo-cyan hover:bg-geo-teal text-geo-black hover:text-white px-5 py-2.5 font-black uppercase text-xs tracking-widest transition-colors cursor-pointer rounded-none flex items-center gap-2 border border-transparent"
        >
          {showCreator ? <X size={12} /> : <Plus size={12} />}
          <span>{showCreator ? 'CLOSE EDITOR' : 'NEW PROJECT'}</span>
        </button>
      </div>

      {/* Embedded Project Registry Form */}
      {showCreator && (
        <form 
          onSubmit={handleCreateProject} 
          className="bg-geo-dark p-6 border border-geo-teal/40 rounded-none grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in"
          id="project-creator-bar-form"
        >
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-geo-teal uppercase tracking-widest mb-1 font-mono">
              Repository Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. storage-s3-service, auth-logic"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="bg-geo-black border border-geo-teal text-white w-full px-4 py-2 focus:outline-none focus:border-geo-cyan transition-colors text-sm rounded-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-geo-teal uppercase tracking-widest mb-1 font-mono">
              Programming Lang
            </label>
            <select
              value={creatorLang}
              onChange={(e) => setCreatorLang(e.target.value as ProgrammingLanguage)}
              className="bg-geo-black border border-geo-teal text-white w-full px-3 py-2 focus:outline-none focus:border-geo-cyan transition-colors text-sm rounded-none cursor-pointer hover:bg-geo-dark font-mono appearance-none"
            >
              <option value="TypeScript">TypeScript</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
            </select>
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-geo-teal uppercase tracking-widest mb-1 font-mono">
                Lines scale
              </label>
              <input
                type="number"
                min="0"
                value={creatorLines}
                onChange={(e) => setCreatorLines(Number(e.target.value))}
                className="bg-geo-black border border-geo-teal text-white w-full px-3 py-2 focus:outline-none focus:border-geo-cyan transition-colors text-sm rounded-none font-mono"
              />
            </div>
            
            <button
              id="submit-creator-btn"
              type="submit"
              className="px-4 py-2 bg-geo-cyan hover:bg-geo-teal text-geo-black hover:text-white font-bold font-sans text-xs tracking-widest uppercase transition-colors rounded-none whitespace-nowrap h-9 cursor-pointer"
            >
              LOG
            </button>
          </div>
        </form>
      )}

      {/* FILTER & RESEARCH BAR DOCK */}
      <div 
        className="bg-geo-dark p-6 rounded-none border border-geo-teal/30 flex flex-col md:flex-row gap-4 items-center justify-between"
        id="projects-filter-dock"
      >
        {/* Row search input */}
        <div className="relative w-full md:w-1/3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-geo-teal" />
          <input
            id="projects-search-query"
            type="text"
            placeholder="Search master list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-mono pl-9 pr-3 py-2 bg-geo-black border border-geo-teal text-white rounded-none outline-none focus:border-geo-cyan transition-colors"
          />
        </div>

        {/* Filter selectors */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto" id="filter-controls-dock">
          
          <div className="flex items-center space-x-1.5 text-xs text-geo-teal font-mono uppercase tracking-wider font-bold">
            <span>Lang:</span>
            <select
              id="lang-filter-select"
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value as 'All' | ProgrammingLanguage)}
              className="bg-geo-black border border-geo-teal text-white px-2.5 py-1 focus:outline-none focus:border-geo-cyan text-xs rounded-none cursor-pointer appearance-none hover:bg-geo-black/80 font-mono"
            >
              <option value="All">All types</option>
              <option value="TypeScript">TypeScript</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-geo-teal font-mono uppercase tracking-wider font-bold">
            <span>Status:</span>
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | Project['status'])}
              className="bg-geo-black border border-geo-teal text-white px-2.5 py-1 focus:outline-none focus:border-geo-cyan text-xs rounded-none cursor-pointer appearance-none hover:bg-geo-black/80 font-mono"
            >
              <option value="All">All streams</option>
              <option value="Active">Active Only</option>
              <option value="Completed">Completed Only</option>
              <option value="On Hold">On Hold Only</option>
            </select>
          </div>

          <button
            onClick={() => setStarredOnly(!starredOnly)}
            className={`cursor-pointer flex items-center space-x-1.5 px-3 py-1 font-mono uppercase tracking-wider text-xs border rounded-none transition-all ${
              starredOnly
                ? 'bg-geo-cyan border-geo-cyan text-geo-black font-extrabold'
                : 'bg-geo-black border-geo-teal/30 text-geo-light hover:border-geo-cyan'
            }`}
          >
            <Star 
              size={12} 
              fill={starredOnly ? 'currentColor' : 'none'} 
              className={starredOnly ? 'text-geo-black' : 'text-geo-teal'} 
            />
            <span>STARRED</span>
          </button>
        </div>
      </div>

      {/* PROJECT CATALOG CARDS */}
      {filteredProjects.length === 0 ? (
        <div className="bg-geo-dark/30 rounded-none border border-geo-teal/20 border-dashed p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <FolderGit2 className="text-geo-teal/40 mb-3" size={42} />
          <h4 className="text-sm font-black text-white uppercase tracking-widest font-mono">No matching records</h4>
          <p className="text-xs text-geo-light/50 mt-1 max-w-sm font-mono uppercase tracking-wider text-center">
            QUERY SEQUENCE RETURNED 0 RESULTS. ADJUST TELEMETRY SEARCH STRINGS.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setLangFilter('All');
              setStatusFilter('All');
              setStarredOnly(false);
            }}
            className="mt-6 px-4 py-2 text-xs font-black text-geo-cyan hover:text-white bg-geo-black border border-geo-teal/40 hover:border-geo-cyan rounded-none cursor-pointer uppercase font-mono tracking-widest"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="projects-grid-list">
          {filteredProjects.map((project) => {
            const isEditing = editingId === project.id;

            const statusColors = {
              Active: { bg: 'bg-emerald-500/10 text-emerald-405 border-emerald-500/35', dot: 'bg-emerald-400' },
              Completed: { bg: 'bg-geo-cyan/10 text-geo-cyan border-geo-cyan/35', dot: 'bg-geo-cyan' },
              'On Hold': { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/35', dot: 'bg-amber-400' }
            };

            const langIconColors = {
              TypeScript: 'text-geo-cyan bg-geo-cyan/5 border-geo-cyan/25',
              JavaScript: 'text-amber-400 bg-amber-400/5 border-amber-400/25',
              Python: 'text-indigo-400 bg-indigo-400/5 border-indigo-400/25',
            };

            return (
              <div 
                key={project.id}
                id={`project-card-${project.id}`}
                className={`bg-geo-dark p-6 border rounded-none flex flex-col justify-between transition-all duration-300 ${
                  isEditing 
                    ? 'border-2 border-geo-cyan' 
                    : 'border-geo-teal/30 hover:border-geo-cyan'
                }`}
              >
                {/* Editing view versus normal card view */}
                {isEditing ? (
                  /* EDITING FORM PORTLET */
                  <div className="space-y-4 font-mono flex-1 flex flex-col justify-between text-xs">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-geo-dark pb-2">
                        <span className="text-[10px] font-bold uppercase text-geo-cyan">EDIT DIRECTORY_PARMS</span>
                        <div className="flex items-center gap-1.5">
                          <button 
                            type="button"
                            onClick={() => saveChanges(project.id)}
                            className="bg-geo-cyan text-geo-black hover:bg-geo-teal hover:text-white px-2 py-1 font-black uppercase text-[10px] transition cursor-pointer rounded-none border border-transparent"
                            title="Save Changes"
                          >
                            <Save size={10} className="inline mr-1" />
                            <span>SAVE</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="bg-geo-black text-geo-light hover:text-white px-2 py-1 font-black uppercase text-[10px] border border-geo-teal/30 transition cursor-pointer rounded-none"
                            title="Cancel"
                          >
                            <span>CANCEL</span>
                          </button>
                        </div>
                      </div>

                      {/* Name editor text input */}
                      <div>
                        <label className="block text-[9px] font-bold text-geo-teal uppercase tracking-widest mb-0.5">Project Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-geo-black border border-geo-teal text-white w-full px-2.5 py-1.5 focus:outline-none focus:border-geo-cyan transition-colors text-xs rounded-none font-mono"
                        />
                      </div>

                      {/* Combo properties controls */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-geo-teal uppercase tracking-widest mb-0.5">Language</label>
                          <select
                            value={editLang}
                            onChange={(e) => setEditLang(e.target.value as ProgrammingLanguage)}
                            className="bg-geo-black border border-geo-teal text-white w-full px-2 py-1 focus:outline-none select-none text-xs rounded-none"
                          >
                            <option value="TypeScript">TypeScript</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="Python">Python</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-geo-teal uppercase tracking-widest mb-0.5">Lines scale</label>
                          <input
                            type="number"
                            min="0"
                            value={editLines}
                            onChange={(e) => setEditLines(Number(e.target.value))}
                            className="bg-geo-black border border-geo-teal text-white w-full px-2 py-1 focus:outline-none text-xs rounded-none font-mono text-geo-cyan"
                          />
                        </div>
                      </div>

                      {/* Status select editor */}
                      <div>
                        <label className="block text-[9px] font-bold text-geo-teal uppercase tracking-widest mb-1">Node status</label>
                        <div className="flex gap-1.5">
                          {(['Active', 'Completed', 'On Hold'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setEditStatus(st)}
                              className={`flex-1 py-1 text-[9px] border font-bold uppercase text-center transition cursor-pointer rounded-none ${
                                editStatus === st
                                  ? 'bg-geo-cyan text-geo-black border-geo-cyan'
                                  : 'border-geo-teal/30 hover:border-geo-cyan text-geo-light bg-geo-black'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* READ-ONLY CARD CONTAINER */
                  <div className="flex-1 flex flex-col justify-between" id={`project-card-data-${project.id}`}>
                    <div className="space-y-4">
                      {/* Top status ribbon */}
                      <div className="flex items-center justify-between min-w-0">
                        <span className={`px-2 py-0.5 rounded-none text-[9px] font-mono font-bold uppercase tracking-widest border ${langIconColors[project.language]}`}>
                          {project.language}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          {/* Star */}
                          <button
                            id={`star-btn-icon-${project.id}`}
                            onClick={() => toggleStar(project.id)}
                            className={`p-1 text-geo-teal/40 hover:text-amber-400 transition cursor-pointer`}
                          >
                            <Star size={12} fill={project.starred ? '#fbbf24' : 'none'} className={project.starred ? 'text-amber-400' : ''} />
                          </button>
                          
                          {/* Edit */}
                          <button
                            id={`edit-btn-${project.id}`}
                            onClick={() => startEditing(project)}
                            className="p-1 text-geo-teal/40 hover:text-geo-cyan transition cursor-pointer"
                            title="Edit project"
                          >
                            <Edit2 size={11} />
                          </button>

                          {/* Delete */}
                          <button
                            id={`delete-btn-card-${project.id}`}
                            onClick={() => deleteProject(project.id)}
                            className="p-1 text-geo-teal/40 hover:text-rose-400 transition cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>

                      {/* Repos details */}
                      <div>
                        <h4 className="text-base font-bold text-white tracking-tight break-all font-sans">
                          {project.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`w-1.5 h-1.5 rounded-none ${statusColors[project.status].dot}`} />
                          <span className="text-[10px] font-extrabold text-geo-teal tracking-widest font-mono uppercase">
                            {project.status} STREAM
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata attributes footer */}
                    <div className="mt-8 pt-4 border-t border-geo-teal/20 flex items-center justify-between font-mono">
                      <div className="space-y-0.5">
                        <span className="block text-[8px] font-bold text-geo-teal uppercase tracking-widest select-none">
                          CAPACITY
                        </span>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-sm font-extrabold text-white tracking-tight">
                            {project.linesOfCode.toLocaleString()}
                          </span>
                          <span className="text-[9px] text-[#45A29E] uppercase font-bold">
                            LOC
                          </span>
                        </div>
                      </div>

                      <div className="text-right space-y-0.5">
                        <span className="block text-[8px] font-bold text-geo-teal uppercase tracking-widest select-none">
                          ADDED
                        </span>
                        <span className="text-[10px] font-bold text-geo-light flex items-center justify-end gap-1">
                          <Calendar size={10} className="text-geo-teal" />
                          <span>{project.createdAt}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
