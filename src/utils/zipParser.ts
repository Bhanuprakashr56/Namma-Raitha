import JSZip from 'jszip';
import { ProjectData, ProjectFile } from '../types';
import { buildFileTree, computeLanguages, detectFileTypeAndLang } from './fileHelpers';

const DB_NAME = 'ZipCodePreviewerDB';
const STORE_NAME = 'projects';
const DB_VERSION = 1;

// IndexedDB Helper for high capacity local storage
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function saveProjectToStorage(project: ProjectData): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    // Also save current project ID in localStorage for quick retrieval
    localStorage.setItem('active_preview_project_id', project.id);
    store.put(project);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save to IndexedDB, fallback to in-memory only', err);
  }
}

export async function loadLastProjectFromStorage(): Promise<ProjectData | null> {
  try {
    const activeId = localStorage.getItem('active_preview_project_id');
    if (!activeId) return null;
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(activeId);
    return new Promise<ProjectData | null>((resolve) => {
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result as ProjectData);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function clearStorageProject(): Promise<void> {
  try {
    localStorage.removeItem('active_preview_project_id');
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
  } catch (e) {
    console.warn('Failed to clear project storage', e);
  }
}

/**
 * Parses an uploaded .zip file and returns a structured ProjectData object
 */
export async function parseZipFile(file: File | Blob, customName?: string): Promise<ProjectData> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);

  const files: Record<string, ProjectFile> = {};
  const htmlEntryPoints: string[] = [];
  let totalLines = 0;
  let totalSize = 0;

  const entries = Object.keys(loadedZip.files);

  // Filter out system junk like __MACOSX, .DS_Store, Thumbs.db
  const validEntries = entries.filter((path) => {
    const isFolder = loadedZip.files[path].dir;
    if (isFolder) return false;
    if (path.includes('__MACOSX/') || path.endsWith('.DS_Store') || path.endsWith('Thumbs.db')) {
      return false;
    }
    return true;
  });

  for (const rawPath of validEntries) {
    // Normalize path: remove leading / or ./
    const cleanPath = rawPath.replace(/^\.?\//, '');
    const zipEntry = loadedZip.files[rawPath];
    const { type, language, isBinary, mimeType } = detectFileTypeAndLang(cleanPath);

    let content = '';
    let lineCount = 0;
    let size = 0;

    if (isBinary) {
      // Convert images or binary to base64 data URL
      const base64 = await zipEntry.async('base64');
      content = `data:${mimeType};base64,${base64}`;
      const binaryData = await zipEntry.async('uint8array');
      size = binaryData.byteLength;
    } else {
      // Decode as text
      content = await zipEntry.async('text');
      size = new Blob([content]).size;
      lineCount = content.length > 0 ? content.split('\n').length : 0;
      totalLines += lineCount;
    }

    totalSize += size;

    const fileName = cleanPath.split('/').pop() || cleanPath;
    const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : '';

    if (type === 'html') {
      htmlEntryPoints.push(cleanPath);
    }

    files[cleanPath] = {
      path: cleanPath,
      name: fileName,
      extension: ext,
      content,
      isBinary,
      mimeType,
      size,
      type,
      language,
      lineCount,
    };
  }

  // Sort html entry points so index.html is first
  htmlEntryPoints.sort((a, b) => {
    if (a.toLowerCase().endsWith('index.html')) return -1;
    if (b.toLowerCase().endsWith('index.html')) return 1;
    return a.localeCompare(b);
  });

  const projectName = customName || (file instanceof File ? file.name.replace(/\.zip$/i, '') : 'Project Archive');
  const tree = buildFileTree(files);
  const languages = computeLanguages(files);

  const project: ProjectData = {
    id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: projectName,
    files,
    tree,
    totalFiles: Object.keys(files).length,
    totalLines,
    totalSize,
    languages,
    htmlEntryPoints,
    uploadedAt: Date.now(),
  };

  await saveProjectToStorage(project);
  return project;
}

/**
 * Allows parsing an uploaded folder or collection of files (e.g. from input webkitdirectory or drag-drop)
 */
export async function parseFileList(fileList: FileList | File[]): Promise<ProjectData> {
  const files: Record<string, ProjectFile> = {};
  const htmlEntryPoints: string[] = [];
  let totalLines = 0;
  let totalSize = 0;

  const filesArray = Array.from(fileList);

  for (const file of filesArray) {
    const rawPath = (file as any).webkitRelativePath || file.name;
    const cleanPath = rawPath.replace(/^\.?\//, '');
    if (cleanPath.includes('__MACOSX/') || cleanPath.endsWith('.DS_Store')) continue;

    const { type, language, isBinary, mimeType } = detectFileTypeAndLang(cleanPath);
    let content = '';
    let lineCount = 0;

    if (isBinary) {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      content = `data:${mimeType};base64,${base64}`;
    } else {
      content = await file.text();
      lineCount = content.length > 0 ? content.split('\n').length : 0;
      totalLines += lineCount;
    }

    totalSize += file.size;

    const fileName = cleanPath.split('/').pop() || cleanPath;
    const ext = fileName.includes('.') ? fileName.split('.').pop() || '' : '';

    if (type === 'html') {
      htmlEntryPoints.push(cleanPath);
    }

    files[cleanPath] = {
      path: cleanPath,
      name: fileName,
      extension: ext,
      content,
      isBinary,
      mimeType,
      size: file.size,
      type,
      language,
      lineCount,
    };
  }

  htmlEntryPoints.sort((a, b) => {
    if (a.toLowerCase().endsWith('index.html')) return -1;
    if (b.toLowerCase().endsWith('index.html')) return 1;
    return a.localeCompare(b);
  });

  const folderName = filesArray[0] && (filesArray[0] as any).webkitRelativePath
    ? (filesArray[0] as any).webkitRelativePath.split('/')[0]
    : 'Local Directory';

  const tree = buildFileTree(files);
  const languages = computeLanguages(files);

  const project: ProjectData = {
    id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: folderName,
    files,
    tree,
    totalFiles: Object.keys(files).length,
    totalLines,
    totalSize,
    languages,
    htmlEntryPoints,
    uploadedAt: Date.now(),
  };

  await saveProjectToStorage(project);
  return project;
}
