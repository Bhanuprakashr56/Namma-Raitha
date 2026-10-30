import React, { useRef } from 'react';
import {
  Archive,
  Code2,
  Columns,
  Download,
  FolderUp,
  MonitorPlay,
  PieChart,
  RotateCcw,
  Sparkles,
  Upload
} from 'lucide-react';
import { PreviewMode, ProjectData } from '../types';
import { formatBytes } from '../utils/fileHelpers';

interface HeaderProps {
  project: ProjectData | null;
  previewMode: PreviewMode;
  onPreviewModeChange: (mode: PreviewMode) => void;
  onZipUpload: (file: File) => void;
  onFolderUpload: (files: FileList) => void;
  onLoadSample: (key: 'arcadeGame' | 'saasDashboard' | 'reactComponents') => void;
  onReset: () => void;
  onDownloadProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  previewMode,
  onPreviewModeChange,
  onZipUpload,
  onFolderUpload,
  onLoadSample,
  onReset,
  onDownloadProject,
}) => {
  const zipInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [showSamples, setShowSamples] = React.useState(false);

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onZipUpload(file);
      e.target.value = '';
    }
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFolderUpload(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/95 backdrop-blur px-4 flex items-center justify-between select-none z-20 sticky top-0">
      {/* Left: Branding & Current Project Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Archive className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">ZipStudio</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Previewer
              </span>
            </div>
            {project ? (
              <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs flex items-center gap-1.5 font-medium">
                <span>{project.name}</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-slate-500">{project.totalFiles} files</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-slate-500">{formatBytes(project.totalSize)}</span>
              </p>
            ) : (
              <p className="text-xs text-slate-500">Local Zip & Code Inspector</p>
            )}
          </div>
        </div>
      </div>

      {/* Center: View Mode Toggle */}
      {project && (
        <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => onPreviewModeChange('split')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              previewMode === 'split'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Split Code & Live Preview"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>

          <button
            onClick={() => onPreviewModeChange('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              previewMode === 'code'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Code File Inspector Only"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>

          <button
            onClick={() => onPreviewModeChange('live')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              previewMode === 'live'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Live Interactive Preview Sandbox"
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={() => onPreviewModeChange('stats')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              previewMode === 'stats'
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Project Architecture & Languages"
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Metrics</span>
          </button>
        </div>
      )}

      {/* Right: Upload Actions & Samples */}
      <div className="flex items-center gap-2">
        <input
          ref={zipInputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          className="hidden"
          onChange={handleZipChange}
        />
        <input
          ref={folderInputRef}
          type="file"
          // @ts-ignore
          webkitdirectory=""
          directory=""
          className="hidden"
          onChange={handleFolderChange}
        />

        {/* Load Samples Popover */}
        <div className="relative">
          <button
            onClick={() => setShowSamples(!showSamples)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700/80 text-slate-300 text-xs font-medium transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Samples</span>
          </button>

          {showSamples && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowSamples(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-40 text-xs">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Test With Sample Demos
                </div>
                <button
                  onClick={() => {
                    onLoadSample('arcadeGame');
                    setShowSamples(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition flex items-start gap-2.5 text-slate-200"
                >
                  <span className="text-base">🚀</span>
                  <div>
                    <div className="font-semibold text-slate-100">Neon Starship Arcade</div>
                    <div className="text-[11px] text-slate-400">
                      HTML5 Canvas, Web Audio synth & controls
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onLoadSample('saasDashboard');
                    setShowSamples(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition flex items-start gap-2.5 text-slate-200"
                >
                  <span className="text-base">⚡</span>
                  <div>
                    <div className="font-semibold text-slate-100">SaaS Metrics Dashboard</div>
                    <div className="text-[11px] text-slate-400">
                      Interactive charts, Python script & JSON
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onLoadSample('reactComponents');
                    setShowSamples(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition flex items-start gap-2.5 text-slate-200"
                >
                  <span className="text-base">🎨</span>
                  <div>
                    <div className="font-semibold text-slate-100">Design System UI Kit</div>
                    <div className="text-[11px] text-slate-400">
                      TypeScript, custom hooks & Markdown docs
                    </div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Upload Zip Button */}
        <button
          onClick={() => zipInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-md shadow-sky-600/20 transition active:scale-95"
          title="Upload .zip file from your computer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload .zip</span>
        </button>

        {/* Upload Folder Button */}
        <button
          onClick={() => folderInputRef.current?.click()}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800 text-slate-300 font-medium text-xs transition"
          title="Upload folder from local storage"
        >
          <FolderUp className="w-3.5 h-3.5" />
          <span>Folder</span>
        </button>

        {project && (
          <>
            <button
              onClick={onDownloadProject}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Download files as ZIP"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onReset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              title="Clear project"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};
