import React from 'react';
import {
  BarChart3,
  Code,
  FileSpreadsheet,
  HardDrive,
  Layers,
  Sparkles
} from 'lucide-react';
import { ProjectData, ProjectFile } from '../types';
import { formatBytes } from '../utils/fileHelpers';

interface ProjectStatsProps {
  project: ProjectData;
  onSelectFile: (file: ProjectFile) => void;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ project, onSelectFile }) => {
  // Sort files by size descending
  const largestFiles = Object.values(project.files)
    .sort((a, b) => b.size - a.size)
    .slice(0, 8);

  // Sort files by lines of code descending
  const longestFiles = Object.values(project.files)
    .filter((f) => !f.isBinary)
    .sort((a, b) => b.lineCount - a.lineCount)
    .slice(0, 8);

  const totalLines = project.totalLines || 1;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-10 space-y-8 font-sans">
      {/* Title & Overview */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              Project Architecture & Metrics
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-2">{project.name}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Comprehensive overview of codebase breakdown, volume, and distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <div className="text-[11px] text-slate-500 uppercase font-mono">Last Ingested</div>
            <div className="text-xs font-semibold text-slate-300">
              {new Date(project.uploadedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Files</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{project.totalFiles}</div>
          <div className="text-[11px] text-slate-500 mt-1">Extracted & Indexed</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Lines of Code</span>
            <Code className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {project.totalLines.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across text & code files</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Archive Volume</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {formatBytes(project.totalSize)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Uncompressed bytes</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Languages & Types</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {project.languages.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Distinct technologies</div>
        </div>
      </div>

      {/* Language Breakdown */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">Languages Distribution</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            By Lines of Code
          </span>
        </div>

        {/* Visual Multi-color Progress Bar */}
        <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex mb-4">
          {project.languages.map((lang) => {
            const pct = Math.max(1, (lang.lineCount / totalLines) * 100);
            return (
              <div
                key={lang.name}
                style={{
                  width: `${pct}%`,
                  backgroundColor: lang.color,
                }}
                className="h-full transition-all"
                title={`${lang.name}: ${lang.lineCount} lines (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {project.languages.map((lang) => {
            const pct = ((lang.lineCount / totalLines) * 100).toFixed(1);
            return (
              <div
                key={lang.name}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <div>
                    <div className="text-xs font-medium text-slate-200 uppercase">
                      {lang.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {lang.fileCount} {lang.fileCount === 1 ? 'file' : 'files'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-slate-300">
                    {pct}%
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {lang.lineCount} lines
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Files Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Longest Files */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Largest Files by Lines</h3>
          </div>
          <div className="space-y-1.5">
            {longestFiles.map((file) => (
              <div
                key={file.path}
                onClick={() => onSelectFile(file)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/60 cursor-pointer text-xs transition group"
              >
                <span className="font-mono text-slate-300 truncate max-w-[240px] group-hover:text-sky-300">
                  {file.path}
                </span>
                <span className="font-mono text-slate-500 text-[11px] shrink-0">
                  {file.lineCount.toLocaleString()} lines
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Heaviest Files */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Largest Files by Bytes</h3>
          </div>
          <div className="space-y-1.5">
            {largestFiles.map((file) => (
              <div
                key={file.path}
                onClick={() => onSelectFile(file)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/60 cursor-pointer text-xs transition group"
              >
                <span className="font-mono text-slate-300 truncate max-w-[240px] group-hover:text-sky-300">
                  {file.path}
                </span>
                <span className="font-mono text-slate-500 text-[11px] shrink-0">
                  {formatBytes(file.size)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
