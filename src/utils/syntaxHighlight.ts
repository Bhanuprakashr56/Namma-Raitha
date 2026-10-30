/**
 * Fast client-side syntax highlighter for code preview
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const JS_KEYWORDS = new Set([
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
  'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function',
  'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch',
  'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
  'let', 'static', 'enum', 'await', 'async', 'from', 'as', 'interface', 'type',
  'public', 'private', 'protected', 'readonly', 'implements', 'namespace'
]);

const PY_KEYWORDS = new Set([
  'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif',
  'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in',
  'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
  'while', 'with', 'yield', 'True', 'False', 'None'
]);

export function highlightCode(code: string, language: string): string {
  const lang = (language || '').toLowerCase();

  // If HTML or XML
  if (lang === 'html' || lang === 'xml' || lang === 'svg') {
    return highlightHtml(code);
  }

  // If JSON
  if (lang === 'json') {
    return highlightJson(code);
  }

  // If CSS
  if (lang === 'css' || lang === 'scss') {
    return highlightCss(code);
  }

  // General code (JS, TS, PY, RS, GO, etc.)
  return highlightGenericCode(code, lang === 'python' ? PY_KEYWORDS : JS_KEYWORDS);
}

function highlightHtml(code: string): string {
  // Replace HTML tags and attributes
  const escaped = escapeHtml(code);
  return escaped
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-slate-500 italic">$1</span>')
    .replace(/(&lt;\/?)([a-zA-Z0-9\-]+)(.*?)(&gt;)/g, (_match, p1, p2, p3, p4) => {
      // Attribute replacement inside tag
      const attrs = p3.replace(/([a-zA-Z0-9\-]+)(=)(&quot;.*?&quot;|&#039;.*?&#039;)/g, 
        '<span class="text-amber-300">$1</span><span class="text-slate-400">$2</span><span class="text-emerald-400">$3</span>'
      );
      return `<span class="text-sky-400">${p1}</span><span class="text-indigo-400 font-semibold">${p2}</span>${attrs}<span class="text-sky-400">${p4}</span>`;
    });
}

function highlightJson(code: string): string {
  const escaped = escapeHtml(code);
  return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'text-amber-300'; // number
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-indigo-400 font-semibold'; // key
      } else {
        cls = 'text-emerald-400'; // string value
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-purple-400'; // boolean
    } else if (/null/.test(match)) {
      cls = 'text-rose-400'; // null
    }
    return `<span class="${cls}">${match}</span>`;
  });
}

function highlightCss(code: string): string {
  const lines = code.split('\n');
  return lines.map(line => {
    const escaped = escapeHtml(line);
    if (escaped.trim().startsWith('/*') || escaped.trim().startsWith('*')) {
      return `<span class="text-slate-500 italic">${escaped}</span>`;
    }
    // Selector before {
    return escaped
      .replace(/(.*?)\{/g, '<span class="text-amber-300 font-semibold">$1</span>{')
      .replace(/([a-zA-Z\-]+)(\s*:)([^;]+)(;?)/g, 
        '<span class="text-sky-300">$1</span>$2<span class="text-emerald-300">$3</span>$4'
      );
  }).join('\n');
}

function highlightGenericCode(code: string, keywords: Set<string>): string {
  const lines = code.split('\n');
  return lines.map((line) => {
    // Check line comment
    const commentIdx = line.indexOf('//');
    const pyCommentIdx = line.indexOf('#');
    let mainPart = line;
    let commentPart = '';

    if (commentIdx !== -1) {
      mainPart = line.substring(0, commentIdx);
      commentPart = line.substring(commentIdx);
    } else if (pyCommentIdx !== -1 && !line.includes('http') && !line.includes('"#') && !line.includes("'#")) {
      mainPart = line.substring(0, pyCommentIdx);
      commentPart = line.substring(pyCommentIdx);
    }

    let escaped = escapeHtml(mainPart);

    // Strings
    escaped = escaped.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, (str) => {
      return `<span class="text-emerald-400">${str}</span>`;
    });

    // Keywords and numbers (only in non-tag parts)
    escaped = escaped.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (word) => {
      if (keywords.has(word)) {
        return `<span class="text-purple-400 font-medium">${word}</span>`;
      }
      return word;
    });

    // Numbers
    escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-amber-300">$1</span>');

    if (commentPart) {
      return `${escaped}<span class="text-slate-500 italic">${escapeHtml(commentPart)}</span>`;
    }
    return escaped;
  }).join('\n');
}
