import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  FileDigit,
  FileImage,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { FileTreeNode, ProjectData, ProjectFile } from '../types';
import { formatBytes } from '../utils/fileHelpers';

interface FileTreeProps {
  project: ProjectData;
  activeFilePath: string | null;
  onSelectFile: (file: ProjectFile) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  project,
  activeFilePath,
  onSelectFile,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'code' | 'styles' | 'images' | 'docs'>('all');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    '': true,
    root: true,
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = { '': true };
    const traverse = (node: FileTreeNode) => {
      if (node.isFolder) {
        next[node.path] = true;
        node.children.forEach(traverse);
      }
    };
    traverse(project.tree);
    setExpandedFolders(next);
  };

  const collapseAll = () => {
    setExpandedFolders({ '': true, root: true });
  };

  // Filtered files when searching
  const filteredList = useMemo(() => {
    if (!search && filterType === 'all') return null;

    return Object.values(project.files).filter((file) => {
      const matchSearch = search ? file.path.toLowerCase().includes(search.toLowerCase()) : true;
      if (!matchSearch) return false;

      if (filterType === 'code') {
        return file.type === 'code' || file.type === 'html' || file.type === 'json';
      }
      if (filterType === 'styles') {
        return file.type === 'css';
      }
      if (filterType === 'images') {
        return file.type === 'image';
      }
      if (filterType === 'docs') {
        return file.type === 'markdown' || file.extension === 'txt' || file.extension === 'pdf';
      }
      return true;
    });
  }, [project.files, search, filterType]);

  const getFileIcon = (file: ProjectFile) => {
    const ext = file.extension.toLowerCase();

    if (file.type === 'image') {
      return <FileImage className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    if (ext === 'json') {
      return <FileJson className="w-4 h-4 text-amber-400 shrink-0" />;
    }
    if (ext === 'md' || ext === 'markdown' || ext === 'txt') {
      return <FileText className="w-4 h-4 text-sky-400 shrink-0" />;
    }
    if (['html', 'htm'].includes(ext)) {
      return <FileCode2 className="w-4 h-4 text-orange-500 shrink-0" />;
    }
    if (['css', 'scss', 'sass'].includes(ext)) {
      return <FileCode2 className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
    if (['ts', 'tsx'].includes(ext)) {
      return <FileCode2 className="w-4 h-4 text-blue-400 shrink-0" />;
    }
    if (['js', 'jsx'].includes(ext)) {
      return <FileCode2 className="w-4 h-4 text-yellow-400 shrink-0" />;
    }
    if (['py'].includes(ext)) {
      return <FileCode2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    }

    return <FileDigit className="w-4 h-4 text-slate-400 shrink-0" />;
  };

  const renderTreeNode = (node: FileTreeNode, depth = 0) => {
    if (node.name === 'root') {
      return (
        <div key="root" className="space-y-0.5">
          {node.children.map((child) => renderTreeNode(child, depth))}
        </div>
      );
    }

    const isExpanded = expandedFolders[node.path] ?? depth < 2;

    if (node.isFolder) {
      return (
        <div key={node.path} className="select-none">
          <div
            onClick={() => toggleFolder(node.path)}
            style={{ paddingLeft: `${depth * 14 + 8}px` }}
            className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-slate-800/70 text-slate-300 text-xs font-medium cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-1.5 truncate">
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-amber-400/90 shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-amber-400/80 shrink-0" />
              )}
              <span className="truncate">{node.name}</span>
            </div>
            <span className="text-[10px] text-slate-500 group-hover:text-slate-400 ml-1 shrink-0">
              {node.children.length}
            </span>
          </div>

          {isExpanded && (
            <div className="space-y-0.5">
              {node.children.map((child) => renderTreeNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Render file item
    const file = node.file!;
    const isActive = activeFilePath === file.path;

    return (
      <div
        key={file.path}
        onClick={() => onSelectFile(file)}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        className={`flex items-center justify-between py-1 px-2 rounded-md text-xs cursor-pointer transition-colors group ${
          isActive
            ? 'bg-sky-500/20 text-sky-300 font-medium border-l-2 border-sky-400'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {getFileIcon(file)}
          <span className="truncate">{file.name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 shrink-0 ml-1">
          {file.lineCount > 0 && <span>{file.lineCount}L</span>}
          <span>{formatBytes(file.size)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-72 border-r border-slate-800 bg-slate-950/80 flex flex-col h-full shrink-0 select-none">
      {/* Search and Filter Bar */}
      <div className="p-2.5 border-b border-slate-800/80 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code files..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] text-slate-400 scrollbar-none">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2 py-0.5 rounded ${
              filterType === 'all'
                ? 'bg-slate-800 text-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('code')}
            className={`px-2 py-0.5 rounded ${
              filterType === 'code'
                ? 'bg-slate-800 text-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setFilterType('styles')}
            className={`px-2 py-0.5 rounded ${
              filterType === 'styles'
                ? 'bg-slate-800 text-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Styles
          </button>
          <button
            onClick={() => setFilterType('images')}
            className={`px-2 py-0.5 rounded ${
              filterType === 'images'
                ? 'bg-slate-800 text-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setFilterType('docs')}
            className={`px-2 py-0.5 rounded ${
              filterType === 'docs'
                ? 'bg-slate-800 text-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Docs
          </button>
        </div>
      </div>

      {/* Tree Header Actions */}
      <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400 font-medium border-b border-slate-800/40">
        <span className="uppercase tracking-wider text-[10px] text-slate-500">
          Explorer ({filteredList ? filteredList.length : project.totalFiles})
        </span>
        <div className="flex items-center gap-2 text-slate-500">
          <button
            onClick={expandAll}
            className="hover:text-slate-300"
            title="Expand All Folders"
          >
            Expand
          </button>
          <span>&bull;</span>
          <button
            onClick={collapseAll}
            className="hover:text-slate-300"
            title="Collapse All Folders"
          >
            Collapse
          </button>
        </div>
      </div>

      {/* File Tree / Search Results List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 text-xs">
        {filteredList ? (
          filteredList.length > 0 ? (
            filteredList.map((file) => {
              const isActive = activeFilePath === file.path;
              return (
                <div
                  key={file.path}
                  onClick={() => onSelectFile(file)}
                  className={`flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 font-medium border-l-2 border-sky-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getFileIcon(file)}
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 ml-1">
                    {formatBytes(file.size)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs">
              No matching files found.
            </div>
          )
        ) : (
          renderTreeNode(project.tree)
        )}
      </div>
    </div>
  );
};
