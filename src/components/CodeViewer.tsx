import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Edit3,
  Eye,
  FileCode,
  FileImage,
  RotateCcw,
  Save,
  Search,
  WrapText,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { ProjectFile } from '../types';
import { formatBytes } from '../utils/fileHelpers';
import { highlightCode } from '../utils/syntaxHighlight';

interface CodeViewerProps {
  file: ProjectFile;
  onOpenLivePreview?: () => void;
  onSaveFile?: (path: string, newContent: string) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  file,
  onOpenLivePreview,
  onSaveFile,
}) => {
  const [copied, setCopied] = useState(false);
  const [wrapLines, setWrapLines] = useState(true);
  const [fontSize, setFontSize] = useState(13); // in px
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Direct editing states (no login required)
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(file.content);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync draftContent whenever active file changes
  useEffect(() => {
    setDraftContent(file.content);
    setSaveSuccess(false);
  }, [file.path, file.content]);

  const isDirty = useMemo(() => {
    return !file.isBinary && draftContent !== file.content;
  }, [draftContent, file.content, file.isBinary]);

  const handleCopy = () => {
    if (file.isBinary) return;
    const textToCopy = isEditing ? draftContent : file.content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = isEditing ? draftContent : file.content;
    const blob = file.isBinary
      ? null
      : new Blob([textToDownload], { type: file.mimeType });

    const url = file.isBinary ? file.content : URL.createObjectURL(blob!);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    if (!file.isBinary && blob) URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (file.isBinary || !onSaveFile) return;
    onSaveFile(file.path, draftContent);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRevert = () => {
    setDraftContent(file.content);
  };

  // Keyboard shortcut: Ctrl+S / Cmd+S saves directly
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
      return;
    }

    // Tab key inserts 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = draftContent;

      const updated = val.substring(0, start) + '  ' + val.substring(end);
      setDraftContent(updated);

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  // Raw lines for display & line numbers
  const activeContent = isEditing ? draftContent : file.content;

  const lines = useMemo(() => {
    if (file.isBinary) return [];
    return activeContent.split('\n');
  }, [activeContent, file.isBinary]);

  // Syntax highlighted lines for read-only view
  const highlightedLines = useMemo(() => {
    if (file.isBinary || isEditing) return [];
    const highlighted = highlightCode(file.content, file.language);
    return highlighted.split('\n');
  }, [file.content, file.language, file.isBinary, isEditing]);

  // Matches for in-file search
  const matchCount = useMemo(() => {
    if (!searchQuery || file.isBinary) return 0;
    const lower = searchQuery.toLowerCase();
    return lines.filter((l) => l.toLowerCase().includes(lower)).length;
  }, [searchQuery, lines, file.isBinary]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 border-r border-slate-800 overflow-hidden">
      {/* Code Header Bar */}
      <div className="h-11 border-b border-slate-800 bg-slate-950/70 px-3 sm:px-4 flex items-center justify-between shrink-0 select-none gap-2">
        {/* Left: File info + No Login Status badge */}
        <div className="flex items-center gap-2 truncate min-w-0">
          <FileCode className="w-4 h-4 text-sky-400 shrink-0" />
          <span className="font-mono text-xs text-slate-200 truncate font-medium">
            {file.path}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono border border-slate-700/60 uppercase shrink-0">
            {file.language || file.extension || 'file'}
          </span>
          {isDirty && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-sans border border-amber-500/30 flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Unsaved
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Mode Switch: View vs Edit */}
          {!file.isBinary && (
            <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/50 mr-1">
              <button
                onClick={() => setIsEditing(false)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                  !isEditing
                    ? 'bg-slate-700 text-sky-400 shadow-sm font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="View code with syntax highlighting"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline text-[11px]">View</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setTimeout(() => textareaRef.current?.focus(), 50);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition ${
                  isEditing
                    ? 'bg-sky-600 text-white shadow-sm font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Edit code directly without login"
              >
                <Edit3 className="w-3 h-3" />
                <span className="text-[11px] font-medium">Edit</span>
              </button>
            </div>
          )}

          {/* Save Button in Edit Mode */}
          {isEditing && !file.isBinary && (
            <>
              <button
                onClick={handleSave}
                disabled={!isDirty}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
                  isDirty
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-900/50'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title="Save changes (Ctrl+S / Cmd+S)"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                    <span className="text-[11px]">Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Save</span>
                  </>
                )}
              </button>

              {isDirty && (
                <button
                  onClick={handleRevert}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                  title="Revert unsaved changes"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}

          {/* In-file Search Toggle */}
          {!file.isBinary && (
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition ${
                showSearch ? 'bg-slate-800 text-sky-400' : ''
              }`}
              title="Find in code"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Toggle Wrap */}
          {!file.isBinary && (
            <button
              onClick={() => setWrapLines(!wrapLines)}
              className={`p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition ${
                wrapLines ? 'bg-slate-800 text-sky-400' : ''
              }`}
              title="Toggle Word Wrap"
            >
              <WrapText className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Font sizing */}
          {!file.isBinary && (
            <div className="hidden sm:flex items-center text-slate-500">
              <button
                onClick={() => setFontSize((s) => Math.max(10, s - 1))}
                className="p-1 hover:text-slate-300"
                title="Decrease Font Size"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="text-[10px] px-1 font-mono">{fontSize}px</span>
              <button
                onClick={() => setFontSize((s) => Math.min(20, s + 1))}
                className="p-1 hover:text-slate-300"
                title="Increase Font Size"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Copy Button */}
          {!file.isBinary && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              title="Copy File Content"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          )}

          {/* Download File */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Download this file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Find Bar */}
      {showSearch && !file.isBinary && (
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find in file..."
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>
          <div className="text-slate-500 text-[11px] font-mono">
            {searchQuery ? `${matchCount} line matches` : ''}
          </div>
        </div>
      )}

      {/* Code Body or Binary/Image Preview */}
      <div className="flex-1 overflow-auto font-mono relative bg-slate-900">
        {file.isBinary ? (
          file.type === 'image' ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 shadow-xl max-w-xl max-h-[80%] flex flex-col items-center">
                <img
                  src={file.content}
                  alt={file.name}
                  className="max-h-96 object-contain rounded border border-slate-800"
                />
                <div className="mt-4 text-center">
                  <div className="text-xs text-slate-300 font-medium">{file.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {file.mimeType} &bull; {formatBytes(file.size)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <FileImage className="w-12 h-12 text-slate-600 mb-3" />
              <div className="text-sm font-semibold text-slate-300">Binary Asset</div>
              <div className="text-xs text-slate-500 max-w-sm mt-1">
                {file.name} ({formatBytes(file.size)}) is a binary asset that cannot be rendered as text.
              </div>
              <button
                onClick={handleDownload}
                className="mt-4 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-sans transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Asset</span>
              </button>
            </div>
          )
        ) : isEditing ? (
          /* Direct Interactive Code Editor (No Login Required) */
          <div
            style={{ fontSize: `${fontSize}px` }}
            className="h-full flex min-w-full overflow-hidden"
          >
            {/* Line numbers gutter */}
            <div className="py-4 pr-3 pl-2 select-none text-right font-mono text-slate-600 border-r border-slate-800/80 bg-slate-950/40 shrink-0">
              {lines.map((_, index) => (
                <div key={index} className="leading-relaxed">
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Editable Textarea */}
            <div className="flex-1 relative h-full">
              <textarea
                ref={textareaRef}
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                placeholder="Type or paste code here..."
                style={{ fontSize: `${fontSize}px` }}
                className={`w-full h-full p-4 bg-transparent text-slate-100 font-mono resize-none focus:outline-none leading-relaxed border-none ${
                  wrapLines ? 'whitespace-pre-wrap break-all' : 'whitespace-pre overflow-x-auto'
                }`}
              />
            </div>
          </div>
        ) : (
          /* Syntax Highlighted View Mode */
          <div
            style={{ fontSize: `${fontSize}px` }}
            className={`min-w-full p-4 flex ${
              wrapLines ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
            }`}
          >
            {/* Line numbers gutter */}
            <div className="pr-4 select-none text-right font-mono text-slate-600 border-r border-slate-800/80 mr-4 shrink-0">
              {lines.map((_, index) => (
                <div key={index} className="leading-relaxed">
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Code lines */}
            <div className="flex-1 overflow-x-auto leading-relaxed">
              {highlightedLines.map((lineHtml, index) => {
                const lineRaw = lines[index] || '';
                const isMatch =
                  searchQuery && lineRaw.toLowerCase().includes(searchQuery.toLowerCase());

                return (
                  <div
                    key={index}
                    className={`leading-relaxed ${
                      isMatch ? 'bg-amber-500/20 px-1 -mx-1 rounded' : ''
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: lineHtml || '&nbsp;',
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Editor Footer Status Bar */}
      {!file.isBinary && (
        <div className="h-6 border-t border-slate-800 bg-slate-950 px-3 flex items-center justify-between text-[11px] text-slate-500 font-mono select-none">
          <div className="flex items-center gap-3">
            <span>
              {lines.length} lines &bull; {formatBytes(new Blob([activeContent]).size)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <span className="text-sky-400 font-sans text-[10px] bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800/50">
                Direct Edit Mode Active &bull; Ctrl+S to save
              </span>
            ) : (
              <span className="text-slate-400">Click &ldquo;Edit&rdquo; above to modify code</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
