/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { LinesOfCodeHistory } from '../types';

interface TrendLineChartProps {
  data: LinesOfCodeHistory[];
  onRandomize?: () => void;
}

export default function TrendLineChart({ data, onRandomize }: TrendLineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 500;
  const height = 140;
  const paddingX = 40;
  const paddingY = 20;

  const maxLines = Math.max(...data.map(d => d.lines), 100);
  const minLines = Math.min(...data.map(d => d.lines), 0);
  const range = maxLines - minLines || 100;

  // Calculate coordinates
  const coords = data.map((item, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    // Invert Y so higher value goes UP
    const ratio = (item.lines - minLines) / range;
    const y = height - paddingY - ratio * (height - paddingY * 2);
    return { x, y, ...item, index: i };
  });

  // Generate Bezier Curve Path
  // High quality curved line helper
  const getBezierPath = () => {
    if (coords.length === 0) return '';
    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      // Control points
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;

      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  // Generate area path for gradient filling
  const getAreaPath = () => {
    const linePath = getBezierPath();
    if (!linePath) return '';
    const lastCoord = coords[coords.length - 1];
    const firstCoord = coords[0];
    const bottomY = height - paddingY / 2;
    return `${linePath} L ${lastCoord.x} ${bottomY} L ${firstCoord.x} ${bottomY} Z`;
  };

  const linePath = getBezierPath();
  const areaPath = getAreaPath();

  return (
    <div className="flex flex-col h-full justify-between" id="trend-line-chart-container">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1 px-2 bg-geo-dark text-geo-cyan text-[10px] font-bold uppercase tracking-widest flex items-center font-mono border border-geo-teal/20">
            <TrendingUp size={10} className="mr-1 inline" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        {onRandomize && (
          <button
            id="randomize-chart-btn"
            onClick={onRandomize}
            className="text-[10px] uppercase tracking-widest font-black bg-geo-black hover:bg-geo-dark text-geo-cyan hover:text-white px-2 py-1 rounded-none border border-geo-teal/30 hover:border-geo-teal flex items-center gap-1 transition-all cursor-pointer"
            title="Generate Random Trend Line"
          >
            <Sparkles size={10} className="text-geo-cyan" />
            <span>Regen</span>
          </button>
        )}
      </div>

      {/* SVG Rendering area wrapper */}
      <div className="relative flex-1 min-h-[140px] w-full" id="svg-chart-wrapper">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full select-none overflow-visible animate-fade-in"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#66FCF1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#45A29E" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#45A29E" />
              <stop offset="100%" stopColor="#66FCF1" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line 
            x1={paddingX} 
            y1={height - paddingY} 
            x2={width - paddingX} 
            y2={height - paddingY} 
            stroke="#1F2833" 
            strokeWidth="1"
            strokeDasharray="2,2" 
          />
          <line 
            x1={paddingX} 
            y1={height / 2} 
            x2={width - paddingX} 
            y2={height / 2} 
            stroke="#1F2833" 
            strokeWidth="0.5"
            strokeDasharray="4,4" 
          />
          <line 
            x1={paddingX} 
            y1={paddingY} 
            x2={width - paddingX} 
            y2={paddingY} 
            stroke="#1F2833" 
            strokeWidth="0.5"
            strokeDasharray="4,4" 
          />

          {/* Area under curve */}
          {areaPath && (
            <path d={areaPath} fill="url(#areaGradient)" className="transition-all duration-500 ease-in-out" />
          )}

          {/* Curved Line */}
          {linePath && (
            <path 
              d={linePath} 
              fill="none" 
              stroke="url(#lineGradient)" 
              strokeWidth="2.5" 
              strokeLinecap="square" 
              className="transition-all duration-500 ease-in-out"
            />
          )}

          {/* Interactive circles and tooltips */}
          {coords.map((point, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <g key={index}>
                {/* Horizontal reference indicator guide on hover */}
                {isHovered && (
                  <>
                    <line 
                      x1={point.x} 
                      y1={paddingY} 
                      x2={point.x} 
                      y2={height - paddingY} 
                      stroke="#66FCF1" 
                      strokeWidth="1" 
                      strokeDasharray="1,2" 
                    />
                    <circle 
                      cx={point.x} 
                      cy={point.y} 
                      r="8" 
                      fill="#66FCF1" 
                      opacity="0.15" 
                    />
                  </>
                )}

                {/* Primary Data dot */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? '5' : '3.5'}
                  fill={isHovered ? '#66FCF1' : '#0B0C10'}
                  stroke="#66FCF1"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer transition-all duration-200"
                />

                {/* X axis labels (Days of week) */}
                <text
                  x={point.x}
                  y={height - 2}
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-geo-teal font-bold uppercase tracking-widest"
                >
                  {point.day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered HTML tooltip bubble centered absolute overlay */}
        {hoveredIndex !== null && (
          <div 
            className="absolute bg-geo-black text-white px-2.5 py-1.5 rounded-none text-[10px] font-bold font-mono shadow-xl border border-geo-teal pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-100"
            style={{
              left: `${(coords[hoveredIndex].x / width) * 100}%`,
              top: `${(coords[hoveredIndex].y / height) * 100 - 8}%`,
            }}
          >
            <div className="text-geo-teal text-[8px] uppercase tracking-widest font-black leading-none mb-1">{coords[hoveredIndex].day} RECORD</div>
            <div className="text-geo-cyan font-extrabold leading-none">{coords[hoveredIndex].lines.toLocaleString()} LOC</div>
          </div>
        )}
      </div>
    </div>
  );
}
