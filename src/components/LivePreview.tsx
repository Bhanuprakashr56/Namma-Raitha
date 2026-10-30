import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ExternalLink,
  Laptop,
  Maximize2,
  Play,
  RefreshCw,
  Smartphone,
  Tablet,
  Terminal,
  Trash2,
  X
} from 'lucide-react';
import { DeviceViewport, ProjectData, ProjectFile } from '../types';
import { buildLivePreviewBundle, ConsoleMessage } from '../utils/liveRunner';

interface LivePreviewProps {
  project: ProjectData;
  activeFile: ProjectFile | null;
  onSelectFile: (file: ProjectFile) => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  project,
  activeFile,
  onSelectFile,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<DeviceViewport>('responsive');
  const [reloadKey, setReloadKey] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleMessage[]>([]);
  const [showConsole, setShowConsole] = useState(false);

  // Determine active HTML file to render
  const selectedHtmlPath = useMemo(() => {
    if (activeFile && (activeFile.type === 'html' || activeFile.extension === 'html')) {
      return activeFile.path;
    }
    // Fallback to project's first HTML entry point
    if (project.htmlEntryPoints.length > 0) {
      return project.htmlEntryPoints[0];
    }
    return null;
  }, [activeFile, project.htmlEntryPoints]);

  // Listen to postMessage console logs from sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'preview_console') {
        setConsoleLogs((prev) => [
          ...prev.slice(-100),
          {
            type: event.data.logType || 'log',
            text: event.data.text || '',
            time: event.data.time || new Date().toLocaleTimeString(),
          },
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Generate bundled HTML string
  const bundledHtml = useMemo(() => {
    if (!selectedHtmlPath) return '';
    return buildLivePreviewBundle(selectedHtmlPath, project.files);
  }, [selectedHtmlPath, project.files, reloadKey]);

  // Calculate container width based on device viewport
  const viewportWidth = useMemo(() => {
    switch (viewport) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      case 'desktop':
        return '1024px';
      case 'responsive':
      default:
        return '100%';
    }
  }, [viewport]);

  const handleOpenExternal = () => {
    if (!bundledHtml) return;
    const blob = new Blob([bundledHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Render Markdown if active file is markdown
  const isMarkdown = activeFile?.type === 'markdown';
  const isJson = activeFile?.type === 'json';

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Top Preview Control Bar */}
      <div className="h-11 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between shrink-0 select-none">
        {/* Left: Target preview descriptor */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300">Live Preview</span>

          {project.htmlEntryPoints.length > 1 && (
            <select
              value={selectedHtmlPath || ''}
              onChange={(e) => {
                const target = project.files[e.target.value];
                if (target) onSelectFile(target);
              }}
              className="ml-2 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-300 focus:outline-none"
            >
              {project.htmlEntryPoints.map((path) => (
                <option key={path} value={path}>
                  {path}
                </option>
              ))}
            </select>
          )}

          {selectedHtmlPath && (
            <span className="font-mono text-[11px] text-slate-500 truncate max-w-[160px] hidden sm:inline">
              ({selectedHtmlPath})
            </span>
          )}
        </div>

        {/* Center: Device Viewport Switcher */}
        {selectedHtmlPath && (
          <div className="hidden sm:flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewport('responsive')}
              className={`p-1 rounded ${
                viewport === 'responsive'
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Responsive Width (100%)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1 rounded ${
                viewport === 'desktop'
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Desktop Viewport (1024px)"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1 rounded ${
                viewport === 'tablet'
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Tablet Viewport (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1 rounded ${
                viewport === 'mobile'
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Mobile Viewport (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {selectedHtmlPath && (
            <>
              <button
                onClick={() => setReloadKey((k) => k + 1)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="Reload Preview Frame"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowConsole(!showConsole)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                  showConsole
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="Preview Console Logs"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono">
                  {consoleLogs.length > 0 ? `(${consoleLogs.length})` : ''}
                </span>
              </button>

              <button
                onClick={handleOpenExternal}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="Open in new window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-2 bg-slate-950/60 relative">
        {selectedHtmlPath ? (
          <div
            style={{ width: viewportWidth, maxWidth: '100%' }}
            className="h-full bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-200 border border-slate-800 flex flex-col"
          >
            <iframe
              ref={iframeRef}
              key={reloadKey}
              srcDoc={bundledHtml}
              sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
              title="Live Project Preview"
              className="w-full flex-1 border-0"
            />
          </div>
        ) : isMarkdown && activeFile ? (
          <div className="w-full h-full max-w-3xl overflow-y-auto p-8 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-200 font-sans leading-relaxed text-sm">
            <div className="border-b border-slate-800 pb-3 mb-6">
              <span className="text-xs uppercase tracking-wider text-sky-400 font-mono">
                Markdown Rendered Preview
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{activeFile.name}</h2>
            </div>
            <div className="prose prose-invert max-w-none space-y-4">
              {activeFile.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('# ')) {
                  return (
                    <h1 key={idx} className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
                      {paragraph.replace('# ', '')}
                    </h1>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-xl font-semibold text-sky-300">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-lg font-semibold text-slate-200">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                  const items = paragraph.split('\n');
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1 text-slate-300">
                      {items.map((item, i) => (
                        <li key={i}>{item.replace(/^[-*]\s+/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.startsWith('```')) {
                  const code = paragraph.replace(/```[a-z]*\n?/g, '').replace(/```$/, '');
                  return (
                    <pre
                      key={idx}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-sky-300 overflow-x-auto"
                    >
                      <code>{code}</code>
                    </pre>
                  );
                }
                return (
                  <p key={idx} className="text-slate-300 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        ) : isJson && activeFile ? (
          <div className="w-full h-full max-w-3xl overflow-y-auto p-6 bg-slate-900/60 rounded-xl border border-slate-800 text-slate-200 font-sans text-xs">
            <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-amber-400">
                  Formatted JSON Inspector
                </span>
                <h2 className="text-sm font-bold text-white">{activeFile.name}</h2>
              </div>
            </div>
            <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs overflow-auto text-amber-300 leading-relaxed">
              {(() => {
                try {
                  return JSON.stringify(JSON.parse(activeFile.content), null, 2);
                } catch {
                  return activeFile.content;
                }
              })()}
            </pre>
          </div>
        ) : (
          <div className="text-center p-8 max-w-md">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">
              No HTML Entry Point Found
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Live web preview renders HTML documents along with linked CSS, JS, and image assets.
              Select an HTML file in the explorer or load one of the interactive samples.
            </p>
            {project.htmlEntryPoints.length > 0 && (
              <button
                onClick={() => {
                  const f = project.files[project.htmlEntryPoints[0]];
                  if (f) onSelectFile(f);
                }}
                className="mt-4 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Open {project.htmlEntryPoints[0]}</span>
              </button>
            )}
          </div>
        )}

        {/* Floating Console Drawer */}
        {showConsole && (
          <div className="absolute bottom-2 left-2 right-2 max-h-56 bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur flex flex-col z-30 font-mono text-xs overflow-hidden">
            <div className="h-8 border-b border-slate-800 bg-slate-900/90 px-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-slate-300 text-[11px]">
                  Console Output ({consoleLogs.length})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setConsoleLogs([])}
                  className="p-1 hover:text-rose-400 text-slate-500 rounded transition"
                  title="Clear Console"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setShowConsole(false)}
                  className="p-1 hover:text-slate-300 text-slate-500 rounded transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-2 overflow-y-auto flex-1 space-y-1">
              {consoleLogs.length === 0 ? (
                <div className="text-slate-600 italic text-[11px] py-2 text-center">
                  Console is empty. Logs, warnings, and errors from preview scripts will show here.
                </div>
              ) : (
                consoleLogs.map((log, i) => (
                  <div
                    key={i}
                    className={`px-2 py-1 rounded text-[11px] flex items-start gap-2 ${
                      log.type === 'error'
                        ? 'bg-rose-500/10 text-rose-300 border-l-2 border-rose-500'
                        : log.type === 'warn'
                        ? 'bg-amber-500/10 text-amber-300 border-l-2 border-amber-500'
                        : 'text-slate-300 border-l-2 border-sky-500/40'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 shrink-0 font-sans">
                      {log.time}
                    </span>
                    <pre className="flex-1 whitespace-pre-wrap break-all font-mono">
                      {log.text}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
