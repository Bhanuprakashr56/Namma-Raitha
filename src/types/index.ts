export interface ProjectFile {
  path: string;
  name: string;
  extension: string;
  content: string; // text content or data URL for binaries/images
  isBinary: boolean;
  mimeType: string;
  size: number;
  type: 'code' | 'image' | 'markdown' | 'json' | 'html' | 'css' | 'binary' | 'other';
  language: string;
  lineCount: number;
}

export interface FileTreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  children: FileTreeNode[];
  file?: ProjectFile;
  size: number;
  fileCount: number;
}

export interface LanguageStat {
  name: string;
  fileCount: number;
  lineCount: number;
  byteCount: number;
  color: string;
}

export interface ProjectData {
  id: string;
  name: string;
  files: Record<string, ProjectFile>;
  tree: FileTreeNode;
  totalFiles: number;
  totalLines: number;
  totalSize: number;
  languages: LanguageStat[];
  htmlEntryPoints: string[];
  uploadedAt: number;
}

export type PreviewMode = 'split' | 'code' | 'live' | 'stats';
export type DeviceViewport = 'responsive' | 'desktop' | 'tablet' | 'mobile';
