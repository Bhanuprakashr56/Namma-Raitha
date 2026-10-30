import { ProjectFile } from '../types';

export interface ConsoleMessage {
  type: 'log' | 'info' | 'warn' | 'error';
  text: string;
  time: string;
}

/**
 * Resolves an imported/linked relative path against an HTML base file path.
 * e.g., base="public/index.html", relative="styles/main.css" -> "public/styles/main.css"
 * or base="index.html", relative="./app.js" -> "app.js"
 */
export function resolveRelativePath(basePath: string, relativePath: string): string {
  // Ignore external or absolute protocols
  if (
    relativePath.startsWith('http://') ||
    relativePath.startsWith('https://') ||
    relativePath.startsWith('data:') ||
    relativePath.startsWith('blob:') ||
    relativePath.startsWith('//')
  ) {
    return relativePath;
  }

  const baseDirParts = basePath.split('/').slice(0, -1);
  const relParts = relativePath.split('/');

  for (const part of relParts) {
    if (part === '.' || part === '') continue;
    if (part === '..') {
      baseDirParts.pop();
    } else {
      baseDirParts.push(part);
    }
  }

  return baseDirParts.join('/');
}

/**
 * Builds a self-contained HTML page that inlines relative CSS, JS, and image sources
 * from the zip files, and injects a console interceptor.
 */
export function buildLivePreviewBundle(
  entryHtmlPath: string,
  allFiles: Record<string, ProjectFile>
): string {
  const htmlFile = allFiles[entryHtmlPath];
  if (!htmlFile) {
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;color:#888;"><h3>File not found: ${entryHtmlPath}</h3></body></html>`;
  }

  let htmlContent = htmlFile.content;

  // Interceptor script to forward console messages and errors to parent window
  const consoleScript = `
<script>
  (function() {
    function sendLog(type, args) {
      try {
        const text = Array.from(args).map(arg => {
          if (arg instanceof Error) return arg.stack || arg.message;
          if (typeof arg === 'object') {
            try { return JSON.stringify(arg, null, 2); } catch(e) { return String(arg); }
          }
          return String(arg);
        }).join(' ');

        window.parent.postMessage({
          type: 'preview_console',
          logType: type,
          text: text,
          time: new Date().toLocaleTimeString()
        }, '*');
      } catch(e) {}
    }

    const _log = console.log;
    const _warn = console.warn;
    const _error = console.error;
    const _info = console.info;

    console.log = function(...args) { sendLog('log', args); _log.apply(console, args); };
    console.warn = function(...args) { sendLog('warn', args); _warn.apply(console, args); };
    console.error = function(...args) { sendLog('error', args); _error.apply(console, args); };
    console.info = function(...args) { sendLog('info', args); _info.apply(console, args); };

    window.addEventListener('error', function(event) {
      sendLog('error', [event.message + (event.filename ? ' at ' + event.filename + ':' + event.lineno : '')]);
    });
  })();
</script>
`;

  // 1. Inline or replace CSS links: <link rel="stylesheet" href="...">
  htmlContent = htmlContent.replace(/<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi, (match) => {
    const hrefMatch = match.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) return match;
    const href = hrefMatch[1];
    const resolved = resolveRelativePath(entryHtmlPath, href);
    const targetCss = allFiles[resolved] || allFiles[href] || allFiles[href.replace(/^\//, '')];

    if (targetCss && !targetCss.isBinary) {
      return `<style data-source="${href}">\n${targetCss.content}\n</style>`;
    }
    return match;
  });

  // 2. Inline or replace scripts: <script src="..."></script>
  htmlContent = htmlContent.replace(/<script\s+[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (match, src) => {
    const resolved = resolveRelativePath(entryHtmlPath, src);
    const targetJs = allFiles[resolved] || allFiles[src] || allFiles[src.replace(/^\//, '')];

    if (targetJs && !targetJs.isBinary) {
      return `<script data-source="${src}">\n${targetJs.content}\n</script>`;
    }
    return match;
  });

  // 3. Replace image sources: <img src="...">
  htmlContent = htmlContent.replace(/<img\s+([^>]*)\bsrc=["']([^"']+)["']([^>]*)>/gi, (match, before, src, after) => {
    const resolved = resolveRelativePath(entryHtmlPath, src);
    const targetImg = allFiles[resolved] || allFiles[src] || allFiles[src.replace(/^\//, '')];

    if (targetImg) {
      return `<img ${before} src="${targetImg.content}" ${after}>`;
    }
    return match;
  });

  // Inject console script right after <head> or at start
  if (htmlContent.includes('<head>')) {
    htmlContent = htmlContent.replace('<head>', `<head>${consoleScript}`);
  } else {
    htmlContent = `${consoleScript}${htmlContent}`;
  }

  return htmlContent;
}
