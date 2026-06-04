/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  Flame, 
  Terminal, 
  Code, 
  Sparkles, 
  TrendingUp, 
  Dumbbell, 
  CheckCircle2, 
  FileCode,
  PieChart,
  Lightbulb
} from 'lucide-react';
import { Project, ProgrammingLanguage } from '../types';

interface AnalyticsViewProps {
  projects: Project[];
  streak: number;
}

export default function AnalyticsView({ projects, streak }: AnalyticsViewProps) {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  // Compute language shares
  const langStats: Record<ProgrammingLanguage, { projectCount: number; loc: number; color: string }> = {
    TypeScript: { projectCount: 0, loc: 0, color: '#66FCF1' }, // Cyan
    JavaScript: { projectCount: 0, loc: 0, color: '#C5C6C7' }, // Light Gray
    Python: { projectCount: 0, loc: 0, color: '#45A29E' },     // Teal
  };

  projects.forEach((p) => {
    if (langStats[p.language]) {
      langStats[p.language].projectCount += 1;
      langStats[p.language].loc += p.linesOfCode;
    }
  });

  const totalLines = Object.values(langStats).reduce((acc, curr) => acc + curr.loc, 0);
  const totalProjects = projects.length;

  // Pie chart segment computation
  let accumulatedAngle = 0;
  const segments = Object.entries(langStats).map(([lang, data]) => {
    const percentage = totalLines > 0 ? (data.loc / totalLines) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;
    return {
      language: lang as ProgrammingLanguage,
      percentage,
      angle,
      startAngle,
      linesOfCode: data.loc,
      ...data
    };
  });

  // Simple Github contribution grid matrix rendering
  // Render a mock grid of 28 days (4 columns x 7 days) with intensities matching number of repos/lines
  const gridWeeksCount = 21; // Columns
  
  // Create a static grid with subtle variations
  const gridCells = Array.from({ length: 7 * gridWeeksCount }).map((_, globalIndex) => {
    const seed = (globalIndex * 17) % 31;
    const intensity = seed === 0 ? 0 : seed <= 10 ? 1 : seed <= 20 ? 2 : seed <= 26 ? 3 : 4;
    return {
      index: globalIndex,
      intensity,
      commits: intensity * 2,
    };
  });

  // Smart dynamic productivity insights
  const generateInsights = () => {
    const insights = [];

    // Lang insights
    const dominantLang = Object.entries(langStats).reduce(
      (best, current) => (current[1].loc > best[1].loc ? current : best),
      ['None', { loc: 0 }] as [string, { loc: number }]
    );

    if (dominantLang[0] !== 'None' && dominantLang[1].loc > 0) {
      insights.push({
        title: `${dominantLang[0]} Dominance`,
        description: `Your digital footprint resides heavily in ${dominantLang[0]}, which handles ${( (dominantLang[1].loc / (totalLines || 1)) * 100 ).toFixed(1)}% of your code volume.`,
        type: 'primary',
      });
    }

    // Streak feedback
    if (streak > 5) {
      insights.push({
        title: `${streak}-Day Coding Marathon!`,
        description: `Phenomenal discipline. You are scoring in the top 5% of active regional engineers this week. Keep up the rhythm!`,
        type: 'success',
      });
    } else {
      insights.push({
        title: 'Ignite Your Heatmap',
        description: `Commit lines of code daily to lock in your daily streak index. Small, iterative logs prevent task anxiety.`,
        type: 'warning',
      });
    }

    // Project diversity
    const distinctLangs = Object.values(langStats).filter(l => l.projectCount > 0).length;
    if (distinctLangs >= 3) {
      insights.push({
        title: 'Full Stack Polygamy',
        description: `Tracking logs in TypeScript, JavaScript, and Python. Synthesizing foreign paradigms accelerates cognitive growth.`,
        type: 'info',
      });
    }

    return insights;
  };

  const currentInsights = generateInsights();

  return (
    <div className="space-y-8" id="analytics-view-root">
      
      {/* View Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-geo-dark pb-6 gap-4" id="analytics-header">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter font-sans">
            System Diagnostics
          </h1>
          <p className="text-geo-teal text-xs font-mono uppercase tracking-[0.2em] mt-1">
            STATISTICAL BREAKDOWNS & HISTORIC DENSITY MATRICES
          </p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-[10px] uppercase text-geo-teal font-black tracking-widest font-mono">
            Metrics Core Node
          </div>
          <p className="text-xs text-geo-light font-mono flex items-center md:justify-end gap-1.5 mt-0.5">
            <Terminal size={12} className="text-geo-cyan" />
            <span>METADATA_LOADED_OK</span>
          </p>
        </div>
      </header>

      {/* CHARTS TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="charts-parent-grid">
        
        {/* Language distribution donut card */}
        <div 
          className="bg-geo-dark p-6 border border-geo-teal/30 rounded-none shadow-xl flex flex-col justify-between" 
          id="language-composition-card"
        >
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest font-sans flex items-center gap-2">
              <PieChart size={15} className="text-geo-cyan" />
              <span>Language Codebase Mix</span>
            </h3>
            <p className="text-[10px] text-geo-teal mt-1 font-mono uppercase tracking-wider">
              TOTAL ACCUMULATED CODE RATIOS
            </p>
            <div className="h-[1px] w-full bg-geo-teal/20 mt-3" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-6">
            {/* Custom SVG Donut Component */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              {totalLines === 0 ? (
                <div className="w-28 h-28 border border-dashed border-geo-teal/30 flex items-center justify-center text-[9px] text-geo-teal font-mono text-center px-4 uppercase tracking-wider leading-relaxed">
                  Log code to initialize telemetry
                </div>
              ) : (
                <>
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1F2833" strokeWidth="10" />
                    {segments.map((seg) => {
                      if (seg.percentage === 0) return null;
                      const radius = 41;
                      const circumference = 2 * Math.PI * radius;
                      const strokeLength = (seg.percentage / 100) * circumference;
                      const strokeOffset = circumference - (seg.startAngle / 360) * circumference;

                      return (
                        <circle
                          key={seg.language}
                          id={`donut-arc-${seg.language}`}
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke={seg.color}
                          strokeWidth="10"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeOffset}
                          strokeLinecap="square"
                          onMouseEnter={() => setActiveSegment(seg.language)}
                          onMouseLeave={() => setActiveSegment(null)}
                          className="transition-all duration-300 hover:stroke-[12] cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Central tooltip metrics inside donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                    <span className="text-[9px] font-black text-geo-teal uppercase tracking-widest leading-none font-sans">
                      {activeSegment || 'CODE_VOL'}
                    </span>
                    <span className="text-lg font-black text-white font-mono mt-1">
                      {activeSegment 
                        ? `${( (langStats[activeSegment as ProgrammingLanguage].loc / totalLines) * 100 ).toFixed(0)}%`
                        : `${(totalLines / 1000).toFixed(1)}k`
                      }
                    </span>
                    <span className="text-[8px] font-bold text-geo-light uppercase tracking-wider mt-0.5 font-mono">
                      {activeSegment ? `${(langStats[activeSegment as ProgrammingLanguage].loc).toLocaleString()}` : 'Lines total'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Language stats ledger details */}
            <div className="flex-1 space-y-3.5 w-full">
              {Object.entries(langStats).map(([language, data]) => {
                const percent = totalLines > 0 ? (data.loc / totalLines) * 100 : 0;
                return (
                  <div 
                    key={language} 
                    className={`p-2.5 border transition-colors rounded-none ${
                      activeSegment === language 
                        ? 'bg-geo-black border-geo-cyan' 
                        : 'border-geo-teal/15 bg-geo-black/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1 font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2" style={{ backgroundColor: data.color }} />
                        <span className="font-bold text-white font-sans uppercase text-[10px] tracking-widest">{language}</span>
                      </div>
                      <span className="font-mono font-black text-geo-cyan text-[10px]">
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                    {/* Tiny visual progress bar */}
                    <div className="w-full h-1 bg-geo-black overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: data.color }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[8px] mt-1 font-mono text-geo-teal uppercase tracking-wider">
                      <span>{data.projectCount} FILES REG</span>
                      <span>{data.loc.toLocaleString()} LOC</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center font-mono text-[9px] text-geo-teal uppercase tracking-wider border-t border-geo-dark/50 pt-3">
            Mean density factor / file: <span className="font-extrabold text-white">{totalProjects > 0 ? Math.round(totalLines / totalProjects).toLocaleString() : 0} LOC</span>
          </div>
        </div>

        {/* Workspace insights card */}
        <div 
          className="bg-geo-dark p-6 border border-geo-teal/30 rounded-none shadow-xl flex flex-col justify-between" 
          id="diagnostics-feedback-insights"
        >
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest font-sans flex items-center gap-2">
              <Lightbulb size={15} className="text-geo-cyan" />
              <span>Workspace Diagnostics</span>
            </h3>
            <p className="text-[10px] text-geo-teal mt-1 font-mono uppercase tracking-wider">
              HEURISTIC TELEMETRY INSIGHTS REPORT
            </p>
            <div className="h-[1px] w-full bg-geo-teal/20 mt-3" />
          </div>

          <div className="flex-1 my-5 space-y-3 justify-center flex flex-col" id="insights-list">
            {currentInsights.map((insight, index) => {
              const borderColors = {
                primary: 'border-geo-teal bg-geo-black text-white',
                success: 'border-geo-cyan bg-geo-dark text-geo-cyan',
                warning: 'border-amber-500/40 bg-geo-black text-amber-300',
                info: 'border-geo-teal/40 bg-geo-black text-geo-light',
              };

              return (
                <div 
                  key={index}
                  className={`p-3.5 rounded-none border flex items-start gap-3 transition-transform ${borderColors[insight.type as keyof typeof borderColors] || 'border-geo-teal/10 bg-geo-black/30'}`}
                >
                  <div className="mt-0.5">
                    <Sparkles size={11} className="text-geo-cyan shrink-0 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-white">
                      {insight.title}
                    </h5>
                    <p className="text-[11px] text-geo-light/80 mt-1 leading-snug font-sans">
                      {insight.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center font-mono text-[9px] text-geo-teal uppercase tracking-widest border-t border-geo-dark/50 pt-3 flex items-center justify-center gap-1.5">
            <Flame size={10} className="text-geo-cyan" />
            <span>DAILY CHECKS STABILIZE LOGIC CONTINUITY REGISTRIES.</span>
          </div>
        </div>

      </div>

      {/* COMMIT ACTIVITY GRID CALENDAR */}
      <div 
        className="bg-geo-dark p-6 border border-geo-teal/30 rounded-none shadow-xl" 
        id="git-commits-calendar-panel"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest font-sans">
              Node Commits Heatmap
            </h3>
            <p className="text-[10px] text-geo-teal mt-1 font-mono uppercase tracking-wider">
              VISUAL MATRIX OF LOGS REGISTERED RECENTLY BY GLOBAL INTERVAL
            </p>
          </div>

          {/* Heat map visual labels instructions */}
          <div className="flex items-center space-x-1.5 text-[9px] font-mono text-geo-teal uppercase tracking-wider font-bold">
            <span>LESS</span>
            <span className="w-2.5 h-2.5 bg-geo-black border border-geo-teal/15" />
            <span className="w-2.5 h-2.5 bg-geo-teal/20" />
            <span className="w-2.5 h-2.5 bg-geo-teal/50" />
            <span className="w-2.5 h-2.5 bg-geo-cyan/60" />
            <span className="w-2.5 h-2.5 bg-geo-cyan" />
            <span>MORE</span>
          </div>
        </div>

        {/* Heatmap Grid Wrapper */}
        <div className="overflow-x-auto" id="heatmap-horizontal-scroll">
          <div className="flex items-start gap-2 min-w-[500px]" id="heatmap-calendar-body">
            {/* Days indices */}
            <div className="flex flex-col justify-between py-1 text-[8px] font-mono text-geo-teal select-none h-[88px] pr-2 font-bold uppercase tracking-widest">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Heatmap column grids */}
            <div className="flex-1 grid grid-flow-col grid-rows-7 gap-1 h-[88px]" id="heatmap-cells-grid">
              {gridCells.map((cell) => {
                const colors = [
                  'bg-geo-black border border-geo-teal/15 hover:border-geo-cyan', // 0 commits
                  'bg-geo-teal/20 border border-transparent hover:border-geo-cyan',   // Low
                  'bg-geo-teal/50 hover:bg-geo-teal/70',   // Medium
                  'bg-geo-cyan/60 hover:bg-geo-cyan/80',   // High
                  'bg-geo-cyan hover:bg-white'    // Extreme
                ];

                return (
                  <div
                    key={cell.index}
                    id={`heatmap-cell-${cell.index}`}
                    className={`w-3 h-3 rounded-none cursor-pointer transition-all ${colors[cell.intensity]}`}
                    title={`${cell.commits} logs on index block ${cell.index}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-geo-dark/50 flex items-center justify-between text-[10px] text-geo-teal font-mono uppercase tracking-widest">
          <span>Streak index: <strong className="text-white font-extrabold">{streak} Active Days 🔥</strong></span>
          <span>Matrix telemetry sync [OK]</span>
        </div>
      </div>

    </div>
  );
}
