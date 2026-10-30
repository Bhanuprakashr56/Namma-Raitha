import React, { useRef, useState } from 'react';
import {
  Archive,
  ArrowRight,
  Code2,
  FileCode,
  FolderUp,
  Layers,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
  Upload
} from 'lucide-react';

interface EmptyStateProps {
  onZipUpload: (file: File) => void;
  onFolderUpload: (files: FileList) => void;
  onLoadSample: (key: 'arcadeGame' | 'saasDashboard' | 'reactComponents') => void;
  isLoading: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onZipUpload,
  onFolderUpload,
  onLoadSample,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const first = files[0];
      if (first.name.endsWith('.zip') || first.type.includes('zip')) {
        onZipUpload(first);
      } else {
        // Multi-file or folder dropped
        onFolderUpload(files);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto"
    >
      <input
        ref={zipInputRef}
        type="file"
        accept=".zip,application/zip,application/x-zip-compressed"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onZipUpload(e.target.files[0]);
        }}
      />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-ignore
        webkitdirectory=""
        directory=""
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) onFolderUpload(e.target.files);
        }}
      />

      <div className="w-full max-w-3xl flex flex-col items-center text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Local Storage & Zip Code Preview Studio</span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Drop Your <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">.zip File</span> To Inspect & Preview
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Extract zip archives directly in your browser. Explore the entire file tree, view syntax-highlighted code files, and run interactive live previews.
          </p>
        </div>

        {/* Drag & Drop Main Box */}
        <div
          onClick={() => zipInputRef.current?.click()}
          className={`w-full p-8 md:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer group relative overflow-hidden ${
            isDragging
              ? 'border-sky-400 bg-sky-500/10 scale-[1.01]'
              : 'border-slate-800 hover:border-sky-500/50 bg-slate-900/50 hover:bg-slate-900/80'
          }`}
        >
          {isLoading ? (
            <div className="py-6 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <div className="text-sm font-medium text-slate-300">
                Unpacking archive & indexing files...
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shadow-lg shadow-sky-500/10">
                <Archive className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="text-base font-semibold text-slate-200 group-hover:text-white">
                  Drop your .zip archive here or <span className="text-sky-400 underline underline-offset-4">browse files</span>
                </div>
                <div className="text-xs text-slate-500">
                  Supports .zip files and local folders of any size
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    zipInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-md shadow-sky-600/30 transition flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Select .zip File</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    folderInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition flex items-center gap-1.5"
                >
                  <FolderUp className="w-4 h-4" />
                  <span>Select Local Folder</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Sample Demos */}
        <div className="w-full space-y-3 pt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">
              Or Try A Sample Project Archive
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              onClick={() => onLoadSample('arcadeGame')}
              className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 text-left cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🚀</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Game
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 group-hover:text-sky-300">
                Neon Starship Arcade
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                HTML5 Canvas 60fps arcade engine with procedural Web Audio synthesis & particles.
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-sky-400 group-hover:translate-x-0.5 transition-transform">
                <span>Inspect & play</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div
              onClick={() => onLoadSample('saasDashboard')}
              className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 text-left cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⚡</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Full Dashboard
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 group-hover:text-sky-300">
                SaaS Analytics Hub
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Responsive metrics layout, interactive dynamic charts, Python aggregation script & JSON.
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-sky-400 group-hover:translate-x-0.5 transition-transform">
                <span>Inspect & test</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div
              onClick={() => onLoadSample('reactComponents')}
              className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 text-left cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🎨</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  TypeScript
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 group-hover:text-sky-300">
                Design System UI Kit
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                React components, TypeScript interfaces, custom React hooks, and Markdown documentation.
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-sky-400 group-hover:translate-x-0.5 transition-transform">
                <span>Inspect code</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature badges & local privacy guarantee */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 border-t border-slate-800/60 w-full">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Client-Side & Local Storage (Zero Server Uploads)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MonitorPlay className="w-4 h-4 text-sky-400" />
            <span>Interactive Live Sandbox & Console Bridge</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Syntax Highlighting for 20+ Languages</span>
          </div>
        </div>
      </div>
    </div>
  );
};
