import { FileTreeNode, LanguageStat, ProjectFile } from '../types';

export const LANGUAGE_COLORS: Record<string, string> = {
  typescript: '#3178c6',
  javascript: '#f7df1e',
  html: '#e34f26',
  css: '#1572b6',
  scss: '#c6538c',
  json: '#292929',
  markdown: '#083fa1',
  python: '#3776ab',
  rust: '#dea584',
  go: '#00add8',
  java: '#b07219',
  c: '#555555',
  cpp: '#f34b7d',
  csharp: '#178600',
  php: '#4f5d95',
  ruby: '#701516',
  sql: '#e38c00',
  yaml: '#cb171e',
  xml: '#0060ac',
  shell: '#89e051',
  svg: '#ff9900',
  other: '#94a3b8',
};

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toLowerCase() || '';
}

export function detectFileTypeAndLang(filePath: string): {
  type: ProjectFile['type'];
  language: string;
  isBinary: boolean;
  mimeType: string;
} {
  const ext = getFileExtension(filePath);
  const name = filePath.split('/').pop() || '';

  // Images
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'bmp', 'avif'].includes(ext)) {
    return {
      type: 'image',
      language: ext,
      isBinary: true,
      mimeType: `image/${ext === 'svg' ? 'svg+xml' : ext === 'jpg' ? 'jpeg' : ext}`,
    };
  }

  if (ext === 'svg') {
    return {
      type: 'image',
      language: 'svg',
      isBinary: false,
      mimeType: 'image/svg+xml',
    };
  }

  // HTML
  if (['html', 'htm'].includes(ext)) {
    return {
      type: 'html',
      language: 'html',
      isBinary: false,
      mimeType: 'text/html',
    };
  }

  // CSS / styling
  if (['css', 'scss', 'sass', 'less'].includes(ext)) {
    return {
      type: 'css',
      language: ext,
      isBinary: false,
      mimeType: 'text/css',
    };
  }

  // Markdown
  if (['md', 'markdown', 'mdx'].includes(ext)) {
    return {
      type: 'markdown',
      language: 'markdown',
      isBinary: false,
      mimeType: 'text/markdown',
    };
  }

  // JSON
  if (['json', 'geojson', 'topojson'].includes(ext) || name === '.prettierrc' || name === '.eslintrc') {
    return {
      type: 'json',
      language: 'json',
      isBinary: false,
      mimeType: 'application/json',
    };
  }

  // Code languages
  const codeLanguages: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    py: 'python',
    rb: 'ruby',
    rs: 'rust',
    go: 'go',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cc: 'cpp',
    h: 'c',
    hpp: 'cpp',
    cs: 'csharp',
    php: 'php',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    yml: 'yaml',
    yaml: 'yaml',
    xml: 'xml',
    env: 'shell',
    toml: 'toml',
    ini: 'ini',
    dockerfile: 'dockerfile',
  };

  if (codeLanguages[ext] || name.toLowerCase() === 'dockerfile') {
    return {
      type: 'code',
      language: codeLanguages[ext] || 'dockerfile',
      isBinary: false,
      mimeType: 'text/plain',
    };
  }

  // Audio / Video / Archive / Binaries
  if (['mp3', 'wav', 'ogg', 'mp4', 'webm', 'zip', 'tar', 'gz', 'pdf', 'woff', 'woff2', 'ttf', 'eot', 'wasm'].includes(ext)) {
    return {
      type: 'binary',
      language: ext,
      isBinary: true,
      mimeType: 'application/octet-stream',
    };
  }

  // Default fallback text
  return {
    type: 'code',
    language: 'plaintext',
    isBinary: false,
    mimeType: 'text/plain',
  };
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function buildFileTree(files: Record<string, ProjectFile>): FileTreeNode {
  const root: FileTreeNode = {
    name: 'root',
    path: '',
    isFolder: true,
    children: [],
    size: 0,
    fileCount: 0,
  };

  const sortedPaths = Object.keys(files).sort();

  for (const path of sortedPaths) {
    const file = files[path];
    const segments = path.split('/').filter(Boolean);
    let currentNode = root;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isLast = i === segments.length - 1;
      const currentPath = segments.slice(0, i + 1).join('/');

      currentNode.size += file.size;
      currentNode.fileCount += 1;

      if (isLast) {
        currentNode.children.push({
          name: segment,
          path: currentPath,
          isFolder: false,
          children: [],
          file: file,
          size: file.size,
          fileCount: 1,
        });
      } else {
        let folderNode = currentNode.children.find((c) => c.isFolder && c.name === segment);
        if (!folderNode) {
          folderNode = {
            name: segment,
            path: currentPath,
            isFolder: true,
            children: [],
            size: 0,
            fileCount: 0,
          };
          currentNode.children.push(folderNode);
        }
        currentNode = folderNode;
      }
    }
  }

  // Sort folders first, then files alphabetically
  const sortNodes = (node: FileTreeNode) => {
    node.children.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });
    node.children.forEach(sortNodes);
  };

  sortNodes(root);
  return root;
}

export function computeLanguages(files: Record<string, ProjectFile>): LanguageStat[] {
  const map: Record<string, { count: number; lines: number; bytes: number }> = {};

  for (const file of Object.values(files)) {
    const lang = file.language || 'other';
    if (!map[lang]) {
      map[lang] = { count: 0, lines: 0, bytes: 0 };
    }
    map[lang].count += 1;
    map[lang].lines += file.lineCount;
    map[lang].bytes += file.size;
  }

  const list: LanguageStat[] = Object.entries(map).map(([lang, stat]) => ({
    name: lang,
    fileCount: stat.count,
    lineCount: stat.lines,
    byteCount: stat.bytes,
    color: LANGUAGE_COLORS[lang.toLowerCase()] || '#818cf8',
  }));

  list.sort((a, b) => b.lineCount - a.lineCount || b.byteCount - a.byteCount);
  return list;
}
